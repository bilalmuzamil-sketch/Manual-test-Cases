/**
 * A browser relay for networks where Chromium cannot hold TLS through the machine's proxy.
 *
 * 🔴 WHY THIS EXISTS. In Claude's cloud containers every outbound connection goes through a local
 * egress proxy. `curl` and Node are fine through it; Chromium is not. Measured 2 October 2026 on
 * staging: 52 of 62 requests succeeded and 10 died with ERR_TOO_MANY_RETRIES — six of them the
 * app's own JavaScript and CSS — so the app showed "Part of the page failed to load" and nothing
 * could be tested. No browser flag fixed it (HTTP/2 off, QUIC off, TLS 1.2: failures under all of
 * them). The nightly runs will live in exactly that kind of container, so without this they would
 * never render a page.
 *
 * What it does: Chromium is pointed at this relay. The relay accepts the browser's CONNECT, ends
 * the browser's TLS with a throwaway certificate (the context already ignores certificate errors,
 * as it always has), and makes each request itself — from Node, over HTTP/1.1, through the
 * egress proxy. Node is the client the egress proxy handles well.
 *
 * This replaces `build/atlassian-login/bridge.mjs`, a separate process that wrote its port to
 * /tmp/atlassian/bridge-port.txt. That process died in the middle of a session on 2 October and
 * left the port file behind; every run after that failed at sign-in with ECONNREFUSED. This one
 * runs INSIDE whichever process opens the browser and stops with it, so there is no port file and
 * nothing to go stale.
 *
 * Used only where it is needed — see `relayWanted()`. On a laptop it is never started.
 */
import http from 'node:http';
import https from 'node:https';
import tls from 'node:tls';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import type { AddressInfo } from 'node:net';

const CLOUD_CA = '/root/.ccr/ca-bundle.crt';

function egress(): URL | null {
  const raw = process.env.HTTPS_PROXY || process.env.https_proxy || '';
  try { return raw ? new URL(raw) : null; } catch { return null; }
}

/**
 * Needed when the machine's proxy is a LOCAL egress proxy with its own certificate authority —
 * Claude's cloud containers. Force with GS_BROWSER_RELAY=1, refuse with GS_BROWSER_RELAY=0.
 */
export function relayWanted(): boolean {
  const f = process.env.GS_BROWSER_RELAY;
  if (f === '0') return false;
  const e = egress();
  if (f === '1') return !!e;
  return !!e && /^(127\.0\.0\.1|localhost)$/.test(e.hostname) && fs.existsSync(caPath() ?? '');
}

function caPath(): string | null {
  for (const p of [process.env.GS_EGRESS_CA, process.env.NODE_EXTRA_CA_CERTS, process.env.SSL_CERT_FILE, CLOUD_CA]) {
    if (p && fs.existsSync(p)) return p;
  }
  return null;
}

/** A throwaway certificate for the browser-facing side, made fresh per process, never written to the repo. */
function throwawayCert(): { key: Buffer; cert: Buffer } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gs-relay-'));
  const key = path.join(dir, 'k.pem'), cert = path.join(dir, 'c.pem');
  execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', key, '-out', cert,
    '-days', '2', '-subj', '/CN=gs-relay'], { stdio: 'ignore' });
  fs.chmodSync(key, 0o600);
  const out = { key: fs.readFileSync(key), cert: fs.readFileSync(cert) };
  fs.rmSync(dir, { recursive: true, force: true });
  return out;
}

/** An https.Agent that reaches each origin through a CONNECT tunnel on the egress proxy. */
class TunnelAgent extends https.Agent {
  constructor(private via: URL, private ca: (string | Buffer)[]) { super({ keepAlive: true, maxSockets: 8 }); }
  createConnection(opts: any, cb: (err: Error | null, s?: any) => void): any {
    const target = `${opts.host}:${opts.port || 443}`;
    const req = http.request({
      host: this.via.hostname, port: Number(this.via.port || 80), method: 'CONNECT', path: target,
      headers: { host: target },
    });
    req.once('connect', (res, sock) => {
      if (res.statusCode !== 200) { sock.destroy(); cb(new Error(`egress CONNECT ${target} -> ${res.statusCode}`)); return; }
      const t = tls.connect({ socket: sock, servername: opts.servername || opts.host, ca: this.ca, ALPNProtocols: ['http/1.1'] });
      t.once('secureConnect', () => cb(null, t));
      t.once('error', (e) => cb(e));
    });
    req.once('error', (e) => cb(e));
    req.end();
    return undefined;
  }
}

const HOP = new Set(['connection', 'proxy-connection', 'keep-alive', 'transfer-encoding', 'upgrade', 'te', 'trailer', 'proxy-authorization']);

let started: Promise<string> | null = null;

/** Start the relay once per process; resolves to the proxy URL to hand Chromium. */
export function startRelay(): Promise<string> {
  if (started) return started;
  started = new Promise((resolve, reject) => {
    const via = egress();
    const caFile = caPath();
    if (!via) { reject(new Error('relay needs HTTPS_PROXY')); return; }
    const ca = [...tls.rootCertificates, ...(caFile ? [fs.readFileSync(caFile)] : [])];
    const agent = new TunnelAgent(via, ca);
    const { key, cert } = throwawayCert();

    const inner = https.createServer({ key, cert }, (req, res) => {
      const host = req.headers.host || '';
      const headers: Record<string, any> = {};
      for (const [k, v] of Object.entries(req.headers)) if (!HOP.has(k.toLowerCase())) headers[k] = v;
      const up = https.request({ host: host.split(':')[0], port: Number(host.split(':')[1] || 443),
        method: req.method, path: req.url, headers, agent }, (r) => {
        const out: Record<string, any> = {};
        for (const [k, v] of Object.entries(r.headers)) if (!HOP.has(k.toLowerCase())) out[k] = v;
        res.writeHead(r.statusCode || 502, out);
        r.pipe(res);
      });
      up.on('error', (e) => {
        try { res.writeHead(502, { 'content-type': 'text/plain' }); res.end(`relay: ${e.message}`); } catch { /* gone */ }
      });
      req.pipe(up);
    });
    inner.on('clientError', () => {});

    const outer = http.createServer((_q, s) => { s.writeHead(400); s.end('CONNECT only'); });
    outer.on('connect', (_req, sock, head) => {
      sock.write('HTTP/1.1 200 Connection Established\r\n\r\n');
      if (head?.length) sock.unshift(head);
      inner.emit('connection', sock);
    });
    outer.on('clientError', () => {});
    outer.listen(0, '127.0.0.1', () => {
      outer.unref(); inner.unref();          // never keep a finished process alive
      resolve(`http://127.0.0.1:${(outer.address() as AddressInfo).port}`);
    });
    outer.on('error', reject);
  });
  return started;
}
