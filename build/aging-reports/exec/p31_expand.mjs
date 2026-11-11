// p31_expand.mjs — 11 Nov 2026: why "ZZAUTOTEST AR Customer A" did not open in s2 (A/R Collection / A/P Unpaid): find the row, list its
// buttons (aria-label, text), click the chevron by its aria-label "Expand <name>", read the row again. Read only.
import { start, REPORTS } from './lib.mjs'; import { mkSort } from './sortlib.mjs';
const s = await start(new URL('./p31/', import.meta.url).pathname); const p = s.page; const S = mkSort(p);
for (const [rep, name] of [['arc', 'ZZAUTOTEST AR Customer A'], ['apu', 'ZZAUTOTEST AP Vendor A']]) { await s.go(REPORTS[rep]); await p.waitForTimeout(2000);
  const l = await S.find(new RegExp(name + ' \\(')); console.log(rep, 'found', !!l, l && (await l.innerText()).replace(/\s+/g, ' ').slice(0, 120));
  if (l) { console.log(' buttons', JSON.stringify(await l.locator('button').evaluateAll((bs) => bs.map((b) => [b.getAttribute('aria-label'), b.innerText.trim()])))); await l.locator('button[aria-label^="Expand"]').first().click(); await p.waitForTimeout(2500); const l2 = await S.find(new RegExp(name + ' \\(')); console.log(' after', (await l2.innerText()).replace(/\s+/g, ' ').slice(0, 80)); await s.shot(rep + '-after'); } }
await s.close(); process.exit(0);
