// staging-bridge.mjs — FRESH local MITM bridge for Chromium.
//
// Chromium cannot TLS through the agent egress proxy directly. This bridge is a
// small local HTTP proxy that accepts Chromium's CONNECT and forwards each
// request via Node global fetch, which honours NODE_USE_ENV_PROXY=1 +
// NODE_EXTRA_CA_CERTS (the agent-proxy CA bundle). It reads $HTTPS_PROXY LIVE at
// start-up; the proxy port rotates between sessions, so rebuild it every run and
// never hard-code a port.
//
// boot2 (staging-boot2.mjs) points Playwright straight at $HTTPS_PROXY and
// usually works; use this bridge as the FALLBACK when the direct proxy path fails.
//
// SECRET-FREE: no cookies/tokens here — it only relays bytes. Secrets live in the
// browser session driven on top of it.
//
// Run it with the proxy env exported, e.g.:
//   NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt \
//     node staging-bridge.mjs
// It prints:  BRIDGE_LISTENING 127.0.0.1:<port>
// Then launch Chromium with:
//   --proxy-server=http://127.0.0.1:<port> \
//   --ignore-certificate-errors --no-sandbox --ssl-version-max=tls1.2
import http from 'node:http';
import net from 'node:net';

const UPSTREAM = process.env.HTTPS_PROXY || process.env.https_proxy || '';
if (!process.env.NODE_USE_ENV_PROXY) console.error('WARN: NODE_USE_ENV_PROXY not set — fetch may not use the agent proxy');
console.error('BRIDGE upstream ($HTTPS_PROXY read live):', UPSTREAM || '(none)');

// Relay plain HTTP requests via global fetch (fetch uses the env proxy).
const server = http.createServer(async (req, res) => {
  try {
    const url = req.url.startsWith('http') ? req.url : `http://${req.headers.host}${req.url}`;
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const body = chunks.length ? Buffer.concat(chunks) : undefined;
    const headers = { ...req.headers }; delete headers['proxy-connection']; delete headers.connection;
    const r = await fetch(url, { method: req.method, headers, body, redirect: 'manual' });
    res.writeHead(r.status, Object.fromEntries(r.headers));
    const buf = Buffer.from(await r.arrayBuffer());
    res.end(buf);
  } catch (e) {
    res.writeHead(502); res.end('bridge error: ' + e.message);
  }
});

// Handle HTTPS via CONNECT: open a tunnel to the upstream agent proxy and pipe.
server.on('connect', (req, clientSocket, head) => {
  const [host, port] = req.url.split(':');
  if (UPSTREAM) {
    // Tunnel through the upstream agent proxy (it terminates TLS to the internet).
    const u = new URL(UPSTREAM);
    const up = net.connect(Number(u.port), u.hostname, () => {
      up.write(`CONNECT ${req.url} HTTP/1.1\r\nHost: ${req.url}\r\n\r\n`);
    });
    let established = false;
    up.once('data', (d) => {
      established = /^HTTP\/1\.[01] 200/.test(d.toString());
      clientSocket.write(`HTTP/1.1 ${established ? '200 Connection Established' : '502 Bad Gateway'}\r\n\r\n`);
      if (established) { if (head && head.length) up.write(head); up.pipe(clientSocket); clientSocket.pipe(up); }
      else { clientSocket.end(); up.end(); }
    });
    up.on('error', () => { try { clientSocket.end(); } catch {} });
    clientSocket.on('error', () => { try { up.end(); } catch {} });
  } else {
    // No upstream proxy: connect directly to origin.
    const up = net.connect(Number(port) || 443, host, () => {
      clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
      if (head && head.length) up.write(head); up.pipe(clientSocket); clientSocket.pipe(up);
    });
    up.on('error', () => { try { clientSocket.end(); } catch {} });
    clientSocket.on('error', () => { try { up.end(); } catch {} });
  }
});

server.listen(0, '127.0.0.1', () => {
  const { port } = server.address();
  console.log(`BRIDGE_LISTENING 127.0.0.1:${port}`);
});
