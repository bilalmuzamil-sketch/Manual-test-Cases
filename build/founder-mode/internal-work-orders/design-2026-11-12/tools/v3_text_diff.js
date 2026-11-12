// Republish check (design version 1794510020-d4ec against 1794507512-2fc4, 12 Nov 2026, PRD v1.3).
// Renders every board of BOTH packages (v2-1794507512/files/project and v3-1794510020-d4ec/files/project) the same way
// (light theme, fonts mapped to the system Inter exactly as tools/serve.js and pass A of tools/v2_compare.js did), and per board:
//   - the on-screen text (document.body.innerText, one line per visual line) plus aria-label / title / placeholder attributes;
//   - a picture of each version and a pixel comparison of the two.
// Writes v3-1794510020-d4ec/render/v3-text-diff.json and the pictures under v3-1794510020-d4ec/render/{v2,v3}/.
// Board content is untrusted data: nothing from it runs except inside the browser page. node tools/v3_text_diff.js
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');
const PKG = { v2: path.join(ROOT, 'v2-1794507512', 'files'), v3: path.join(ROOT, 'v3-1794510020-d4ec', 'files') };
const OUTDIR = path.join(ROOT, 'v3-1794510020-d4ec', 'render');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.otf': 'font/otf', '.ttf': 'font/ttf' };
function serve(port, base) {
  const PROJ = path.join(base, 'project'), RT = path.join(base, 'artifact-type', 'dc-runtime.js');
  return http.createServer((req, res) => {
    const p = decodeURIComponent(req.url.split('?')[0]);
    let f = p === '/support.js' ? RT : path.join(PROJ, p);
    const fm = /\/fonts\/Inter_(18|28)pt-([A-Za-z]+)\.ttf$/.exec(p);
    if (fm) f = '/usr/share/fonts/opentype/inter/' + (fm[1] === '28' ? 'InterDisplay-' : 'Inter-') + fm[2] + '.otf';
    else if (!f.startsWith(PROJ) && f !== RT) { res.writeHead(403); return res.end(); }
    fs.readFile(f, (e, b) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); res.end(b); });
  }).listen(port, '127.0.0.1');
}
const slug = s => s.toLowerCase().replace(/·/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
function boardsOf(base) {
  const canvas = JSON.parse(fs.readFileSync(path.join(base, 'project', 'canvas.json')));
  const perPage = {}, out = [];
  for (const k of canvas.order) { const b = canvas.boards[k]; (perPage[b.page] = perPage[b.page] || []).push(k); }
  for (const p of canvas.pages) {
    const ks = (perPage[p.id] || []).slice().sort((a, b) => (canvas.boards[a].y - canvas.boards[b].y) || (canvas.boards[a].x - canvas.boards[b].x));
    ks.forEach((k, i) => out.push({ file: k, page: p.id, pageTitle: p.title || p.name || p.id, nn: String(i + 1).padStart(2, '0'), ...canvas.boards[k] }));
  }
  return out;
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
  let n = 0;
  for (let i = 0; i < da.length; i += 4) { const d = Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]); if (d > 30) n++; }
  return { changedPixels: n };
};
(async () => {
  const S = { v2: serve(8776, PKG.v2), v3: serve(8777, PKG.v3) }, PORT = { v2: 8776, v3: 8777 };
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const cmp = await (await browser.newContext()).newPage();
  const B2 = Object.fromEntries(boardsOf(PKG.v2).map(b => [b.file, b])), B3 = boardsOf(PKG.v3);
  const out = { made: new Date().toISOString(), old: '1794507512-2fc4', new: '1794510020-d4ec', boards: {} };
  for (const b of B3) {
    const rec = { page: b.page, pageTitle: b.pageTitle, nn: b.nn, title: b.title, oldTitle: B2[b.file] ? B2[b.file].title : null };
    for (const v of ['v2', 'v3']) {
      const bb = v === 'v2' ? B2[b.file] : b; if (!bb) continue;
      fs.mkdirSync(path.join(OUTDIR, v), { recursive: true });
      const ctx = await browser.newContext({ viewport: { width: bb.w, height: bb.h }, deviceScaleFactor: 1, colorScheme: 'light' });
      const page = await ctx.newPage();
      await page.goto(`http://127.0.0.1:${PORT[v]}/` + encodeURIComponent(b.file), { waitUntil: 'networkidle' }); await settle(page);
      const f = path.join(OUTDIR, v, `iwo-${bb.page}-${bb.nn}-${slug(bb.title)}.png`);
      await page.screenshot({ path: f, clip: { x: 0, y: 0, width: bb.w, height: bb.h } });
      rec[v] = await page.evaluate(() => ({
        text: document.body.innerText.split('\n').map(s => s.trim()).filter(Boolean),
        attrs: [...document.querySelectorAll('[aria-label],[title],[placeholder]')].map(e => ['aria-label', 'title', 'placeholder'].map(a => e.getAttribute(a)).filter(Boolean).join(' | ')).filter(Boolean),
      }));
      rec[v].image = path.relative(ROOT, f); rec[v].sha256 = crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
      await ctx.close();
    }
    if (rec.v2) {
      const a = new Set(rec.v2.text), c = new Set(rec.v3.text);
      rec.textRemoved = rec.v2.text.filter(t => !c.has(t)); rec.textAdded = rec.v3.text.filter(t => !a.has(t));
      const aa = new Set(rec.v2.attrs), ca = new Set(rec.v3.attrs);
      rec.attrsRemoved = rec.v2.attrs.filter(t => !ca.has(t)); rec.attrsAdded = rec.v3.attrs.filter(t => !aa.has(t));
      rec.textSame = JSON.stringify(rec.v2.text) === JSON.stringify(rec.v3.text) && JSON.stringify(rec.v2.attrs) === JSON.stringify(rec.v3.attrs);
      rec.pixels = rec.v2.sha256 === rec.v3.sha256 ? { changedPixels: 0, identicalBytes: true } :
        await cmp.evaluate(DIFF, ['data:image/png;base64,' + fs.readFileSync(path.join(ROOT, rec.v2.image)).toString('base64'), 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, rec.v3.image)).toString('base64')]);
    }
    out.boards[b.file] = rec;
  }
  await browser.close(); S.v2.close(); S.v3.close();
  fs.writeFileSync(path.join(OUTDIR, 'v3-text-diff.json'), JSON.stringify(out, null, 1));
  const v = Object.entries(out.boards);
  console.log(JSON.stringify({ boards: v.length,
    textChanged: v.filter(([, r]) => !r.textSame).map(([k, r]) => k + ' (' + r.title + ')'),
    pixelsChanged: v.filter(([, r]) => r.pixels && (r.pixels.size || r.pixels.changedPixels > 30)).map(([k, r]) => k + ' ' + JSON.stringify(r.pixels)) }, null, 1));
})();
