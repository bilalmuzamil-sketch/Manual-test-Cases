// Does the package's own font (Inter_18pt, new in version 1794507512-2fc4) change any LAYOUT our look cases rely on?
// For every distinct board, in "mapped" (system Inter, as our pictures) and "real" fonts: each visible text's line count, whether it
// is cut (ellipsis or overflow), and whether any two text boxes overlap. Reports only boards where these differ. node tools/v2_fontlayout.js
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..'), PROJ = path.join(ROOT, 'v2-1794507512', 'files', 'project'), RT = path.join(ROOT, 'v2-1794507512', 'files', 'artifact-type', 'dc-runtime.js');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.otf': 'font/otf', '.ttf': 'font/ttf', '.svg': 'image/svg+xml' };
const serve = (port, real) => http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]); let f = p === '/support.js' ? RT : path.join(PROJ, p);
  const fm = /\/fonts\/Inter_(18|28)pt-([A-Za-z]+)\.ttf$/.exec(p);
  if (fm && !(real && fs.existsSync(f))) f = '/usr/share/fonts/opentype/inter/' + (fm[1] === '28' ? 'InterDisplay-' : 'Inter-') + fm[2] + '.otf';
  else if (!fm && !f.startsWith(PROJ) && f !== RT) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (e, b) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); res.end(b); });
}).listen(port, '127.0.0.1');
const canvas = JSON.parse(fs.readFileSync(path.join(PROJ, 'canvas.json')));
const seen = new Set(), boards = [];
for (const k of canvas.order) { const h = crypto.createHash('sha256').update(fs.readFileSync(path.join(PROJ, k), 'utf8').replace(/<title>[\s\S]*?<\/title>/, '')).digest('hex'); if (!seen.has(h)) { seen.add(h); boards.push({ file: k, ...canvas.boards[k] }); } }
const EX = ({ W, H }) => {
  const out = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) {
    const s = n.nodeValue.replace(/\s+/g, ' ').trim(); if (!s) continue; const el = n.parentElement; if (!el || el.closest('script,style,helmet')) continue;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const r = document.createRange(); r.selectNodeContents(n); const rects = [...r.getClientRects()].filter(x => x.width > 0);
    if (!rects.length) continue; const b = r.getBoundingClientRect(); if (b.x >= W || b.y >= H) continue;
    const lines = new Set(rects.map(x => Math.round(x.top))).size;
    let cut = false; for (let e = el; e && e !== document.body; e = e.parentElement) { const c = getComputedStyle(e); if ((c.textOverflow === 'ellipsis' || /hidden|clip/.test(c.overflowX)) && e.scrollWidth > e.clientWidth + 1) { cut = true; break; } }
    out.push({ t: s.slice(0, 80), lines, cut, box: [b.x, b.y, b.right, b.bottom] });
  }
  const ov = []; for (let i = 0; i < out.length; i++) for (let j = i + 1; j < out.length; j++) { const a = out[i].box, c = out[j].box; const ix = Math.min(a[2], c[2]) - Math.max(a[0], c[0]), iy = Math.min(a[3], c[3]) - Math.max(a[1], c[1]); if (ix > 2 && iy > 2) ov.push(out[i].t + ' | ' + out[j].t); }
  return { texts: out.map(o => ({ t: o.t, lines: o.lines, cut: o.cut })), overlaps: ov };
};
(async () => {
  const s1 = serve(8768, false), s2 = serve(8769, true);
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const res = { distinctBoards: boards.length, differences: {} };
  for (const b of boards) {
    const r = {};
    for (const [m, port] of [['mapped', 8768], ['real', 8769]]) {
      const ctx = await br.newContext({ viewport: { width: b.w, height: b.h }, colorScheme: 'light' }); const p = await ctx.newPage();
      await p.goto(`http://127.0.0.1:${port}/` + encodeURIComponent(b.file), { waitUntil: 'networkidle' });
      await p.waitForFunction(() => { const x = document.getElementById('dc-root'); return x && x.children.length && document.fonts.status === 'loaded'; }, null, { timeout: 15000 }).catch(() => {});
      await p.waitForTimeout(400); r[m] = await p.evaluate(EX, { W: b.w, H: b.h }); await ctx.close();
    }
    const d = [];
    const n = Math.min(r.mapped.texts.length, r.real.texts.length);
    if (r.mapped.texts.length !== r.real.texts.length) d.push(`text count ${r.mapped.texts.length} -> ${r.real.texts.length}`);
    for (let i = 0; i < n; i++) { const a = r.mapped.texts[i], c = r.real.texts[i]; if (a.t !== c.t) d.push(`text ${a.t} -> ${c.t}`); else { if (a.lines !== c.lines) d.push(`lines "${a.t}" ${a.lines} -> ${c.lines}`); if (a.cut !== c.cut) d.push(`cut "${a.t}" ${a.cut} -> ${c.cut}`); } }
    const oa = new Set(r.mapped.overlaps), oc = new Set(r.real.overlaps);
    for (const o of oc) if (!oa.has(o)) d.push('new overlap: ' + o); for (const o of oa) if (!oc.has(o)) d.push('overlap gone: ' + o);
    if (d.length) res.differences[b.file] = d;
  }
  await br.close(); s1.close(); s2.close();
  fs.writeFileSync(path.join(ROOT, 'v2-1794507512', 'render', 'v2-fontlayout.json'), JSON.stringify(res, null, 1));
  console.log(JSON.stringify({ distinct: res.distinctBoards, boardsWithLayoutDifferences: Object.keys(res.differences).length }));
})();
