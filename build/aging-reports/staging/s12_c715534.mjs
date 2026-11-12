// s12_c715534.mjs — 12 Nov 2026, staging (v26.45.4), C715534 re-run after its chevron line was changed to PRD v12 S4-R1 (QA lead's instruction):
// A/P Aging Detail opened untouched (every bucket closed), 1440 px light: title row, chips, header cells + both chevron colours, the five bucket
// rows, Totals; then 1536 px: sideways overflow / clipped cells. Pictures at both widths. Read-only.
import { stgStart } from './stglib.mjs'; import fs from 'fs';
const OUT = new URL('./s12/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await stgStart(OUT); const p = s.page; const o = {};
const read = () => p.evaluate(() => { const T = (e) => (e?.innerText || '').replace(/\s+/g, ' ').trim(); const col = (e) => e ? getComputedStyle(e).color : null;
  const th = [...document.querySelectorAll('main thead th')]; const hi = th[0]?.querySelector('i, .q-icon');
  const rows = [...document.querySelectorAll('main tbody tr, main tfoot tr')].map((tr) => ({ t: T(tr), chev: tr.querySelector('i, .q-icon')?.textContent?.trim() || null, chevColor: col(tr.querySelector('i, .q-icon')), bold: [...tr.querySelectorAll('td')].filter((td) => +getComputedStyle(td).fontWeight >= 600 || td.querySelector('b,strong')).length }));
  const sc = document.querySelector('main .q-table__middle, main .q-table__container') || document.querySelector('main');
  return { title: T(document.querySelector('main h1, main .page-title')), chips: [...document.querySelectorAll('main button')].map(T).filter((t) => /:/.test(t)).slice(0, 6),
    heads: th.map(T), headChevron: { text: hi?.textContent?.trim(), color: col(hi) }, rows, docOverflow: document.documentElement.scrollWidth - window.innerWidth,
    tableOverflow: sc ? sc.scrollWidth - sc.clientWidth : null }; });
await s.go('/reports/ap-aging-detail'); await p.waitForTimeout(4500); o.w1440 = await read(); o.pic1440 = await s.shot('1440');
await p.setViewportSize({ width: 1536, height: 900 }); await p.waitForTimeout(2500); o.w1536 = await read(); o.pic1536 = await s.shot('1536');
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); const a = o.w1440;
console.log(JSON.stringify({ title: a.title, chips: a.chips, heads: a.heads, headChevron: a.headChevron, rows: a.rows.map((r) => [r.t.slice(0, 70), r.chev, r.chevColor]), over1440: [a.docOverflow, a.tableOverflow], over1536: [o.w1536.docOverflow, o.w1536.tableOverflow] }).slice(0, 2500)); await s.close(); process.exit(0);
