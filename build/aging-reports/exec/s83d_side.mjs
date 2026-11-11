// s83d_side.mjs — 11 Nov 2026 ~16:50: C715600 re-measure. s83c at 1200 px scrolled only 6 px (label moved 388->382 with the columns: cannot tell
// pinned from scrolling), and at 1000 px the Customer filter opens as a full dialog (not a .q-menu) so the pick timed out. Here: pick the customer
// and open the group at 1440, then RESIZE (no reload) to 1200, 1000 and 900, scroll fully right, and read the label's x against the table's left
// edge plus a column (Location) moving as the positive control that the scroll really happened.
import { start, REPORTS } from './lib.mjs'; import { mkSort } from './sortlib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./s83d/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const S = mkSort(p); const F = mkFilt(p);
const A1 = 'Desert Edge Truck Service & Repair'; const o = { id: 'C715600' };
const shot = async (n) => { const f = OUT + 'C715600-' + n + '.png'; await p.mouse.move(5, 890); await p.screenshot({ path: f }); return f; };
const lab = () => p.evaluate((n) => { const sc = document.querySelector('main .q-table__middle'); const m = sc.getBoundingClientRect();
  const tr = [...document.querySelectorAll('main tbody tr')].find((t) => t.innerText.includes(n)); const e = tr && [...tr.querySelectorAll('*')].filter((x) => !x.children.length && x.textContent.includes(n.slice(0, 10)))[0];
  const r = e && e.getBoundingClientRect(); const loc = [...document.querySelectorAll('main tbody td')].find((t) => /Staging /.test(t.innerText)); const lr = loc && loc.getBoundingClientRect();
  const td = e && e.closest('td'); return { sw: sc.scrollWidth, cw: sc.clientWidth, left: sc.scrollLeft, tableLeft: Math.round(m.x), labelX: r && Math.round(r.x), labelRight: r && Math.round(r.right), labelText: e && e.textContent.trim(),
    locX: lr && Math.round(lr.x), tdPos: td && getComputedStyle(td).position, tdLeft: td && getComputedStyle(td).left, elPos: e && getComputedStyle(e).position, visibleAtLeft: !!r && r.x >= m.x - 1 && r.right <= m.right + 1 }; }, A1);
try {
  await p.setViewportSize({ width: 1440, height: 900 }); await s.go(REPORTS.arc); await p.waitForTimeout(3500); await F.pick('Customer', A1);
  await S.expand(new RegExp(A1.replace(/[.*+?^${}()|[\]\\&]/g, '\\$&') + ' \\(')).catch(() => {}); await p.waitForTimeout(1500); o.w1440 = await lab(); await shot('1440');
  for (const w of [1200, 1000, 900]) { await p.setViewportSize({ width: w, height: 900 }); await p.waitForTimeout(1500);
    await p.evaluate(() => { const e = document.querySelector('main .q-table__middle'); e.scrollLeft = 0; }); await p.waitForTimeout(600);
    const r = { before: await lab() }; await shot(w + '-1-before');
    await p.evaluate(() => { const e = document.querySelector('main .q-table__middle'); e.scrollLeft = e.scrollWidth; }); await p.waitForTimeout(1200);
    r.after = await lab(); await shot(w + '-2-scrolled-right'); o['w' + w] = r; }
} catch (e) { o.err = String(e).slice(0, 300); try { await shot('error'); } catch {} }
fs.writeFileSync(OUT + 'C715600.json', JSON.stringify(o, null, 1)); console.log('C715600', o.err || 'ok', JSON.stringify(o).slice(0, 900)); await s.close?.(); process.exit(0);
