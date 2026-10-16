/** 16 Oct 2026 (batch 40) — read only, Analyst 1's company: does any work order line there already show labor by a deleted staff member
 *  ("Deleted user")? Every work order on the All tab, every line's Labor row read on its Lines tab. */
import fs from 'node:fs'; import path from 'node:path';
import { analystBrowser } from './analyst.mts'; import { EV, t } from './wob.mts';
const A = await analystBrowser('/workorders?tab=all'); const p = A.page, a = A.api; const o: any = { checked: 0, hits: [] as string[] };
const wl = ((await a.get('/api/work-orders?tab=all&pagination[rowsPerPage]=200')).body?.data?.work_orders ?? []) as any[]; o.total = wl.length;
for (const w of wl) { const d = (await a.get(`/api/work-orders/lines/${w.id}`)).body?.data; const ls: any[] = Array.isArray(d) ? d : d?.collection ?? []; if (!ls.length) continue;
  if (!JSON.stringify(ls).match(/tech|labor|task/i)) continue; await p.goto(`${A.APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(4500); o.checked++;
  const txt = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="line_labor_name_"]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) as string[]; if (txt.some((x) => /Deleted user/i.test(x))) o.hits.push(`${w.number}: ${txt.join(' | ')}`); }
fs.writeFileSync(path.join(EV, 'C368191-orgb-scan.json'), JSON.stringify(o, null, 1)); console.log(t(), 'SCAN', JSON.stringify(o).slice(0, 2000)); await A.browser.close(); process.exit(0);
