// Boards whose content runs past their own frame (text found below or right of the board edge by tools/render.js) are rendered a
// second time with every clipping container opened up, so the part of the design that the frame cuts off is seen too. These
// pictures are a harness view ("frame opened"), not the design's board; the board picture in images/ stays the reference.
// Also renders each distinct screen at 1440 and 1536 px wide (the board's own wrapper widened) to look for wrapping, overlap and
// clipping at the widths Rule 126 names. node tools/render_full.js
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..'), OUT = path.join(ROOT, 'render');
const BASE = 'http://127.0.0.1:8765/';
const logs = fs.readdirSync(OUT).filter(f => /^render-log-\d+\.json$/.test(f)).map(f => JSON.parse(fs.readFileSync(path.join(OUT, f))));
const boards = Object.assign({}, ...logs.map(l => l.boards));
const distinct = Object.entries(boards).filter(([, v]) => !v.drive.sameAs);
const OPEN = () => {
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (/hidden|clip|auto|scroll/.test(cs.overflow + cs.overflowY + cs.overflowX)) { el.style.overflow = 'visible'; }
    if (el.style.height && /px|%/.test(el.style.height) && el.scrollHeight > el.clientHeight + 1) el.style.height = 'auto';
  }
  const root = document.querySelector('#dc-root > .sc-host > div, #dc-root > div > div');
  if (root) { root.style.height = 'auto'; root.style.minHeight = '100%'; }
};
const WIDEN = (w) => {
  const root = document.querySelector('#dc-root > .sc-host > div');
  if (root) { root.style.width = w + 'px'; }
};
(async () => {
  fs.mkdirSync(path.join(OUT, 'full'), { recursive: true }); fs.mkdirSync(path.join(OUT, 'widths'), { recursive: true });
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const out = {};
  for (const [file, v] of distinct) {
    const rec = {};
    if (v.outside && v.outside.length) {
      const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, colorScheme: 'light' });
      const page = await ctx.newPage();
      await page.goto(BASE + encodeURIComponent(file), { waitUntil: 'networkidle' }); await page.waitForTimeout(700);
      await page.evaluate(OPEN); await page.waitForTimeout(300);
      const f = 'full/' + file.replace('.dc.html', '') + '-frame-opened.png';
      await page.screenshot({ path: path.join(OUT, f), fullPage: true });
      rec.full = 'render/' + f; rec.cutTexts = v.outside.map(o => o.text);
      await ctx.close();
    }
    // widths: only boards drawn at a desktop width
    if (v.w >= 1280) {
      rec.widths = {};
      for (const W of [1440, 1536]) {
        const ctx = await browser.newContext({ viewport: { width: W, height: v.h }, colorScheme: 'light' });
        const page = await ctx.newPage();
        await page.goto(BASE + encodeURIComponent(file), { waitUntil: 'networkidle' }); await page.waitForTimeout(700);
        await page.evaluate(WIDEN, W); await page.waitForTimeout(500);
        const res = await page.evaluate(({ W, H }) => {
          const rows = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
          while ((n = w.nextNode())) { const s = n.nodeValue.trim(); if (!s) continue; const el = n.parentElement; if (!el || el.closest('script,style,helmet')) continue;
            const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') continue; const r = document.createRange(); r.selectNodeContents(n); const b = r.getBoundingClientRect(); if (!b.width) continue;
            const top = document.elementFromPoint(Math.min(Math.max(b.left + b.width / 2, 0), W - 1), Math.min(Math.max(b.top + b.height / 2, 0), H - 1));
            rows.push({ t: s.slice(0, 60), x: b.left, y: b.top, w: b.width, h: b.height, lines: Math.round(b.height / parseFloat(cs.lineHeight || cs.fontSize * 1.4) || 1), covered: !!top && !(el.contains(top) || top.contains(el)) }); }
          const ov = [];
          for (let a = 0; a < rows.length; a++) for (let c = a + 1; c < rows.length; c++) { const p = rows[a], q = rows[c]; if (p.covered || q.covered) continue;
            const ix = Math.min(p.x + p.w, q.x + q.w) - Math.max(p.x, q.x), iy = Math.min(p.y + p.h, q.y + q.h) - Math.max(p.y, q.y); if (ix > 2 && iy > 2) ov.push(p.t + ' <> ' + q.t); }
          const clipped = [...document.querySelectorAll('body *')].filter(el => { const cs = getComputedStyle(el); return (cs.textOverflow === 'ellipsis' || cs.overflowX === 'hidden') && el.scrollWidth > el.clientWidth + 1 && el.children.length < 3 && (el.innerText || '').trim(); }).map(el => el.innerText.trim().slice(0, 60));
          return { overlaps: ov.slice(0, 30), clipped: [...new Set(clipped)].slice(0, 30), texts: rows.map(r => r.t) };
        }, { W, H: v.h });
        const f = `widths/${file.replace('.dc.html', '')}-${W}.png`;
        await page.screenshot({ path: path.join(OUT, f) });
        rec.widths[W] = { picture: 'render/' + f, overlaps: res.overlaps, clipped: res.clipped, sameTexts: JSON.stringify(res.texts) === JSON.stringify(v.rows.filter(r => true).map(r => r.text.slice(0, 60))) };
        await ctx.close();
      }
    }
    out[file] = rec; console.log(file, rec.full ? 'opened' : '', rec.widths ? Object.entries(rec.widths).map(([W, x]) => W + ':' + x.overlaps.length + 'ov/' + x.clipped.length + 'cl').join(' ') : '');
  }
  fs.writeFileSync(path.join(OUT, 'full-and-widths.json'), JSON.stringify(out, null, 1));
  await browser.close();
})();
