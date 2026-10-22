// Fresh MITM bridge: Chromium --proxy-server=http://127.0.0.1:<port>
// Accepts CONNECT, terminates TLS with a local self-signed cert, forwards each request
// through the egress proxy via Node global fetch (NODE_USE_ENV_PROXY=1).
import http from 'http';
import https from 'https';
import net from 'net';
import fs from 'fs';

const key = fs.readFileSync('/tmp/atlassian/mitm.key');
const cert = fs.readFileSync('/tmp/atlassian/mitm.crt');

const inner = https.createServer({ key, cert }, async (req, res) => {
  const host = req.headers.host;
  const url = `https://${host}${req.url}`;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const body = chunks.length ? Buffer.concat(chunks) : undefined;
  const headers = {};
  for (const [k, v] of Object.entries(req.headers)) {
    if (['connection', 'proxy-connection', 'keep-alive', 'transfer-encoding', 'upgrade', 'host', 'content-length', 'accept-encoding'].includes(k.toLowerCase())) continue;
    headers[k] = v;
  }
  headers.host = host;
  try {
    const r = await fetch(url, { method: req.method, headers, body, redirect: 'manual' });
    const buf = Buffer.from(await r.arrayBuffer());
    const out = {};
    r.headers.forEach((v, k) => {
      if (['content-encoding', 'transfer-encoding', 'connection', 'content-length'].includes(k.toLowerCase())) return;
      if (k.toLowerCase() === 'set-cookie') return; // handled below
      out[k] = v;
    });
    const sc = typeof r.headers.getSetCookie === 'function' ? r.headers.getSetCookie() : [];
    if (sc.length) out['set-cookie'] = sc;
    res.writeHead(r.status, out);
    res.end(buf);
  } catch (e) {
    try { res.writeHead(502, { 'content-type': 'text/plain' }); res.end('bridge error: ' + String(e)); } catch (_) {}
  }
});

// re-write header ordering issue: set-cookie must be set before writeHead. Patch by wrapping.
const proxy = http.createServer((req, res) => { res.writeHead(400); res.end('CONNECT only'); });
proxy.on('connect', (req, clientSocket, head) => {
  clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
  if (head && head.length) clientSocket.unshift(head);
  inner.emit('connection', clientSocket);
});
proxy.on('clientError', () => {});
const port = Number(process.argv[2] || 0);
proxy.listen(port, '127.0.0.1', () => {
  fs.writeFileSync('/tmp/atlassian/bridge-port.txt', String(proxy.address().port));
  console.log('bridge listening on ' + proxy.address().port + ' egress=' + (process.env.HTTPS_PROXY || ''));
});
