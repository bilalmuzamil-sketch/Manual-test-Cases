// Local static server for the design files (Rule 121 harness). Serves files/project at /, and /support.js = the canvas runtime
// (files/artifact-type/dc-runtime.js), which is what the canvas injects as ./support.js (the runtime warns about "support.js or a copy of it").
// node tools/serve.js <port>
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', 'files', 'project');
const RT = path.resolve(__dirname, '..', 'files', 'artifact-type', 'dc-runtime.js');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.otf': 'font/otf' };
const log = [];
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let f = p === '/support.js' ? RT : path.join(ROOT, p);
  // The package has no fonts/ folder (the canvas serves it); map Inter_18pt-X / Inter_28pt-X to the system Inter (same family) and log it.
  const fm = /\/fonts\/Inter_(18|28)pt-([A-Za-z]+)\.ttf$/.exec(p);
  if (fm) { f = '/usr/share/fonts/opentype/inter/' + (fm[1] === '28' ? 'InterDisplay-' : 'Inter-') + fm[2] + '.otf'; log.push('font mapped ' + p); }
  else if (!f.startsWith(ROOT) && f !== RT) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (e, b) => {
    if (e) { log.push('404 ' + p); res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); res.end(b);
  });
}).listen(+process.argv[2] || 8765, '127.0.0.1');
process.on('SIGTERM', () => { fs.writeFileSync(path.resolve(__dirname, '..', 'render', 'server-404.log'), log.join('\n')); process.exit(0); });
