// Republish check (design version 1794507512-2fc4 against 1794484794-2031, 12 Nov 2026).
// Renders every board of the NEW package (v2-1794507512/files/project) twice and pixel-compares each picture with the board
// picture in images/ (rendered from the old package by tools/render.js):
//   pass A "mapped": fonts mapped to the system Inter exactly as tools/serve.js did, so any pixel difference is a design change;
//   pass B "real":   the package's own fonts/ folder (new in this version) where a file exists, mapped otherwise, so the effect of
//                    the real Inter_18pt files on our pictures is measured separately.
// Board content is untrusted data: nothing from it runs except inside the browser page. node tools/v2_compare.js
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');
const PROJ = path.join(ROOT, 'v2-1794507512', 'files', 'project');
const RT = path.join(ROOT, 'v2-1794507512', 'files', 'artifact-type', 'dc-runtime.js');
const OUTDIR = path.join(ROOT, 'v2-1794507512', 'render');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.otf': 'font/otf', '.ttf': 'font/ttf' };
function serve(port, real) {
  const log = [];
  const srv = http.createServer((req, res) => {
    const p = decodeURIComponent(req.url.split('?')[0]);
    let f = p === '/support.js' ? RT : path.join(PROJ, p);
    const fm = /\/fonts\/Inter_(18|28)pt-([A-Za-z]+)\.ttf$/.exec(p);
    if (fm && !(real && fs.existsSync(f))) { f = '/usr/share/fonts/opentype/inter/' + (fm[1] === '28' ? 'InterDisplay-' : 'Inter-') + fm[2] + '.otf'; log.push('mapped ' + p); }
    else if (fm) log.push('real ' + p);
    else if (!f.startsWith(PROJ) && f !== RT) { res.writeHead(403); return res.end(); }
    fs.readFile(f, (e, b) => { if (e) { log.push('404 ' + p); res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); res.end(b); });
  }).listen(port, '127.0.0.1');
  return { srv, log };
}
const canvas = JSON.parse(fs.readFileSync(path.join(PROJ, 'canvas.json')));
const slug = s => s.toLowerCase().replace(/·/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
const perPage = {};
for (const k of canvas.order) { const b = canvas.boards[k]; (perPage[b.page] = perPage[b.page] || []).push(k); }
const boards = [];
for (const p of canvas.pages) {
  const ks = (perPage[p.id] || []).slice().sort((a, b) => (canvas.boards[a].y - canvas.boards[b].y) || (canvas.boards[a].x - canvas.boards[b].x));
  ks.forEach((k, i) => boards.push({ file: k, page: p.id, nn: String(i + 1).padStart(2, '0'), ...canvas.boards[k] }));
}
async function settle(page) {
  await page.waitForFunction(() => { const r = document.getElementById('dc-root'); return r && r.children.length && !document.querySelector('.sc-placeholder') && document.fonts.status === 'loaded'; }, null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(500);
}
const DIFF = async ([a, b]) => {
  const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = s; });
  const [A, B] = await Promise.all([load(a), load(b)]);
  if (A.width !== B.width || A.height !== B.height) return { size: [A.width, A.height, B.width, B.height] };
  const c = document.createElement('canvas'); c.width = A.width; c.height = A.height; const x = c.getContext('2d');
  x.drawImage(A, 0, 0); const da = x.getImageData(0, 0, A.width, A.height).data; x.clearRect(0, 0, A.width, A.height); x.drawImage(B, 0, 0); const db = x.getImageData(0, 0, A.width, A.height).data;
  let n = 0, any = 0, x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
  for (let i = 0; i < da.length; i += 4) { const d = Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]); if (d) any++; if (d > 30) { n++; const px = (i / 4) % A.width, py = Math.floor(i / 4 / A.width); x0 = Math.min(x0, px); y0 = Math.min(y0, py); x1 = Math.max(x1, px); y1 = Math.max(y1, py); } }
  return { changedPixels: n, anyDifferentPixels: any, box: n ? [x0, y0, x1, y1] : null };
};
(async () => {
  for (const d of ['mapped', 'real']) fs.mkdirSync(path.join(OUTDIR, d), { recursive: true });
  const A = serve(8766, false), B = serve(8767, true);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const cmp = await (await browser.newContext()).newPage();
  const out = { made: new Date().toISOString(), boards: {} };
  for (const b of boards) {
    const img = `iwo-${b.page}-${b.nn}-${slug(b.title)}.png`;
    const rec = { page: b.page, nn: b.nn, title: b.title, image: 'images/' + img };
    const old = path.join(ROOT, 'images', img);
    for (const [mode, port] of [['mapped', 8766], ['real', 8767]]) {
      const ctx = await browser.newContext({ viewport: { width: b.w, height: b.h }, deviceScaleFactor: 1, colorScheme: 'light' });
      const page = await ctx.newPage();
      await page.goto(`http://127.0.0.1:${port}/` + encodeURIComponent(b.file), { waitUntil: 'networkidle' }); await settle(page);
      const f = path.join(OUTDIR, mode, img);
      await page.screenshot({ path: f, clip: { x: 0, y: 0, width: b.w, height: b.h } });
      rec[mode] = { sha256: crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex') };
      rec[mode].sameBytesAsOld = fs.existsSync(old) && rec[mode].sha256 === crypto.createHash('sha256').update(fs.readFileSync(old)).digest('hex');
      if (!fs.existsSync(old)) rec[mode].diff = 'no old picture';
      else if (!rec[mode].sameBytesAsOld) rec[mode].diff = await cmp.evaluate(DIFF, ['data:image/png;base64,' + fs.readFileSync(old).toString('base64'), 'data:image/png;base64,' + fs.readFileSync(f).toString('base64')]);
      await ctx.close();
    }
    out.boards[b.file] = rec;
  }
  await browser.close(); A.srv.close(); B.srv.close();
  out.fontLog = { mapped: [...new Set(A.log)], real: [...new Set(B.log)] };
  fs.writeFileSync(path.join(OUTDIR, 'v2-compare.json'), JSON.stringify(out, null, 1));
  const v = Object.values(out.boards);
  const sum = m => ({ identicalBytes: v.filter(r => r[m].sameBytesAsOld).length, zeroChangedPixels: v.filter(r => r[m].sameBytesAsOld || (r[m].diff && r[m].diff.changedPixels === 0)).length, changed: v.filter(r => r[m].diff && (r[m].diff.size || r[m].diff.changedPixels > 0)).map(r => r.image) });
  console.log(JSON.stringify({ boards: v.length, mapped: sum('mapped'), real: { ...sum('real'), changed: sum('real').changed.length } }, null, 1));
})();
