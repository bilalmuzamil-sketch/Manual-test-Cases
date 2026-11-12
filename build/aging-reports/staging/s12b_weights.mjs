// s12b_weights.mjs — 12 Nov 2026, staging: C715534 step 3 "two bold sums" on each bucket row — font weight of every cell of the bucket rows
// and the Totals row on A/P Aging Detail (closed), plus the same on A/R Aging Detail for comparison. Read-only.
import { stgStart } from './stglib.mjs';
const s = await stgStart(new URL('./s12/', import.meta.url).pathname); const p = s.page; const o = {};
for (const slug of ['ap-aging-detail', 'ar-aging-detail']) { await s.go('/reports/' + slug); await p.waitForTimeout(4000);
  o[slug] = await p.evaluate(() => [...document.querySelectorAll('main tbody tr, main tfoot tr')].filter((tr) => tr.innerText.trim()).map((tr) => [...tr.querySelectorAll('td')].map((td) => { const el = td.querySelector('*:not(i)') || td; return [td.innerText.replace(/\s+/g, ' ').trim().slice(0, 24), getComputedStyle(td).fontWeight, getComputedStyle(el).fontWeight]; }).filter((c) => c[0]))); }
console.log(JSON.stringify(o).slice(0, 2500)); await s.close(); process.exit(0);
