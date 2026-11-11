// s1_caps.mjs — 11 Nov 2026: C715278 (two vendors that differ only in capitals keep one order everywhere): A/P Aging Summary — find
// "ZZCAPS Supply" and "zzcaps supply" on screen (picture + row boxes), Download (PDF), Download (CSV), reload and find them again.
// Files and readings in exec/s1caps/.
import { start, REPORTS } from './lib.mjs'; import fs from 'fs';
const OUT = new URL('./s1caps/', import.meta.url).pathname; const s = await start(OUT); const p = s.page; const o = {};
const SC = `(document.querySelector('main .q-table__middle.scroll, main .q-virtual-scroll, main .q-table__middle') || document.scrollingElement)`;
const NAMES = ['ZZCAPS Supply', 'zzcaps supply'];
const findRows = async () => { await p.evaluate(`${SC}.scrollTop = 0`); await p.waitForTimeout(700);
  for (let i = 0; i < 300; i++) { const r = await p.evaluate((ns) => { const trs = [...document.querySelectorAll('main tbody tr')]; const idx = ns.map((n) => trs.findIndex((t) => (t.querySelector('td')?.innerText || '').trim() === n));
      if (idx.some((x) => x < 0)) return null; trs[idx[0]].scrollIntoView({ block: 'center' }); return { idx, around: trs.slice(Math.min(...idx) - 1, Math.max(...idx) + 2).map((t) => (t.querySelector('td')?.innerText || '').trim()) }; }, NAMES);
    if (r) { await p.waitForTimeout(800); r.boxes = await p.evaluate((ns) => ns.map((n) => { const tr = [...document.querySelectorAll('main tbody tr')].find((t) => (t.querySelector('td')?.innerText || '').trim() === n); const b = tr.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; }), NAMES); return r; }
    const moved = await p.evaluate(`(() => { const e = ${SC}; const b = e.scrollTop; e.scrollTop = b + e.clientHeight * 0.8; return e.scrollTop !== b; })()`); await p.waitForTimeout(600); if (!moved) return null; } return null; };
const exportAs = async (kind) => { await p.locator('main button[aria-label="Export report"]').first().click(); await p.waitForTimeout(900);
  const dl = p.waitForEvent('download', { timeout: 120000 }).catch(() => null); await p.locator('.q-menu:visible').getByText(`Download (${kind})`, { exact: true }).click(); const d = await dl; await p.waitForTimeout(2500);
  const note = (await p.locator('.q-notification').allInnerTexts().catch(() => [])).join(' | '); if (!d) return { kind, file: null, note }; const f = OUT + 'export-' + d.suggestedFilename(); await d.saveAs(f); return { kind, file: f, note, bytes: fs.statSync(f).size }; };
await s.go(REPORTS.aps); await p.waitForTimeout(3000); o.screen1 = await findRows(); o.pic1 = await s.shot('screen');
o.pdf = await exportAs('PDF'); o.csv = await exportAs('CSV');
await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); o.screen2 = await findRows(); o.pic2 = await s.shot('after-reload');
s.save('caps', o); console.log(JSON.stringify(o).slice(0, 1500)); await s.close(); process.exit(0);
