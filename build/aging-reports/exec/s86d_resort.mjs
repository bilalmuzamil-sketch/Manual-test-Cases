// s86d_resort.mjs — 11 Nov 2026 ~16:20: step 6 of C715454 (A/R Detail) / C715455 (A/P Detail): after an Amount sort, does the open bucket start
// again from its first 100 lines? s86/s86c counted 200 - but they sorted while scrolled to the END of the bucket (step 4), and the developer's
// rule (SV-12540 comment 80909) adds the next 100 as soon as the end of the first 100 is in view. Here, two ways, every 150 ms for 4 s after the
// click: (a) as the test runs it (scrolled to the end, then sort) and (b) scrolled back to the top first, then sort. Records the bucket's DOM row
// count and the scroll position at each sample, pictures at the first sample. Output exec/s86d/<id>.json.
import { start, REPORTS } from './lib.mjs'; import { mkSort } from './sortlib.mjs'; import { ensureLoc } from './locsw.mjs'; import fs from 'fs';
const OUT = new URL('./s86d/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const S = mkSort(p);
const count = (src) => p.evaluate((src) => { const all = [...document.querySelectorAll('main tbody tr')]; const i0 = all.findIndex((t) => new RegExp(src).test(t.innerText.replace(/\s+/g, ' '))); if (i0 < 0) return -1; let n = 0; for (let k = i0 + 1; k < all.length; k++) { const tx = all[k].innerText.trim(); if (/^Total for /.test(tx) || /keyboard_arrow_(right|down)/.test(all[k].innerText)) break; if (tx) n++; } return n; }, src);
const top = () => p.evaluate(`${S.SC}.scrollTop`);
async function run(id, key, label) { const o = { id }; await ensureLoc(p, 'Staging Heavy Duty - 9919');
  for (const mode of ['a-sort-at-end', 'b-sort-at-top']) { await s.go(REPORTS[key]); await p.waitForTimeout(4000); await S.expand(new RegExp(label)); await p.waitForTimeout(1500); const src = label.replace('^', '') + ' \\(';
    for (let i = 0; i < 6; i++) { await p.evaluate(`(() => { const e = ${S.SC}; e.scrollTop = e.scrollHeight; })()`); await p.waitForTimeout(1500); } const before = { n: await count(src), top: await top() };
    if (mode === 'b-sort-at-top') { await p.evaluate(`${S.SC}.scrollTop = 0`); await p.waitForTimeout(800); before.topAfterReset = await top(); }
    const th = p.locator('main thead th').filter({ hasText: /^\s*Amount\s*(arrow_drop_(up|down))?\s*$/ }).first(); await th.click(); const samples = []; for (let i = 0; i < 27; i++) { samples.push([i * 150, await count(src), await top()]); if (i === 2) await s.shot(id + '-' + mode + '-first'); await p.waitForTimeout(150); }
    o[mode] = { before, samples, sorted: await S.sorted().catch(() => null) }; await s.shot(id + '-' + mode + '-end'); }
  fs.writeFileSync(OUT + id + '.json', JSON.stringify(o, null, 1)); console.log(id, 'ok', JSON.stringify({ a: o['a-sort-at-end'].samples.map((x) => x[1]).join(','), b: o['b-sort-at-top'].samples.map((x) => x[1]).join(',') }).slice(0, 500)); }
try { await run('C715454', 'ard', '^1-30 days past due'); } catch (e) { console.log('C715454 Error', String(e).slice(0, 200)); }
try { await run('C715455', 'apd', '^31-60 days past due'); } catch (e) { console.log('C715455 Error', String(e).slice(0, 200)); }
await s.close(); process.exit(0);
