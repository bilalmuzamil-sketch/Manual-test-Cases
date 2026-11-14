// Local static server for the Tiered Pricing design package (Rule 121 harness; recipe from founder-mode/internal-work-orders/design-2026-11-12/tools/serve.js).
// Serves files-v1794631438-539a/project at /, and /support.js = the canvas runtime (artifact-type/dc-runtime.js), which the canvas injects as ./support.js.
// Fonts the package does not hold (it ships 8 of the Inter files tokens.css names) are answered with the system Inter of the same weight, and logged.
// node tools/serve.js <port>
const http = require('http'), fs = require('fs'), path = require('path');
const PKG = path.resolve(__dirname, '..', 'files-v1794631438-539a');
const ROOT = path.join(PKG, 'project');
const RT = path.join(PKG, 'artifact-type', 'dc-runtime.js');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.otf': 'font/otf', '.ttf': 'font/ttf' };
const log = new Set();
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let f = p === '/support.js' ? RT : path.join(ROOT, p);
  if (f !== RT && !f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if (!fs.existsSync(f)) {
    const fm = /\/fonts\/Inter_(18|28)pt-([A-Za-z]+)\.ttf$/.exec(p);
    if (fm) { const sys = '/usr/share/fonts/opentype/inter/' + (fm[1] === '28' ? 'InterDisplay-' : 'Inter-') + fm[2] + '.otf'; if (fs.existsSync(sys)) { f = sys; log.add('font mapped ' + p); } }
  }
  fs.readFile(f, (e, b) => {
    if (e) { log.add('404 ' + p); res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); res.end(b);
  });
}).listen(+process.argv[2] || 8771, '127.0.0.1');
const dump = () => fs.writeFileSync(path.resolve(__dirname, '..', 'render', 'server-log.txt'), [...log].sort().join('\n') + '\n');
setInterval(dump, 30000);
process.on('SIGTERM', () => { dump(); process.exit(0); });
