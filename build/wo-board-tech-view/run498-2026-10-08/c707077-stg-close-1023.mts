/** c707077-stg-close-1023.mts — 23 Oct 2026, STAGING. C707077 step 5 on today's build: Edit Line has no "Cancel" button (X, Delete,
 *  Save & Close only), so close it with the X and check it closed and nothing changed (line technician still David Sparks). S2-38093. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { api, workOrders } from './data.mts'; import { EV, t } from './wob.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = {};
try {
  const wo = (await workOrders(a, 'ZZAUTOTEST C11577 Staff Name 32554')).find((x: any) => /38093/.test(String(x.number ?? '')));
  o.wo = wo?.id ?? null; const id = wo?.id;
  const techs = async () => { const l = (await a.get(`/api/work-orders/lines/${id}`)).body?.data; const L = (Array.isArray(l) ? l : l?.collection ?? [])[0]; return (L?.assigned_techs ?? L?.technicians ?? []).map((x: any) => x.name ?? `${x.first_name ?? ''} ${x.last_name ?? ''}`.trim()); };
  o.before = await techs();
  await p.goto(APP + `/workorders/${id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  await p.getByText('Service - Full grease service').first().click(); await p.waitForTimeout(2500);
  const d = p.locator('.q-dialog').filter({ hasText: 'Edit Line' }); o.open = await d.count();
  o.buttons = await d.last().locator('button').evaluateAll((b: any[]) => b.map((x) => (x.innerText || x.getAttribute('aria-label') || '').trim()).filter(Boolean));
  const x = d.last().locator('button').filter({ hasText: /^\s*close\s*$/ }).first(); o.xBox = await x.boundingBox().catch(() => null);
  await p.screenshot({ path: path.join(EV, 'C707077-stg1023-s4b-edit-line-open.png') });
  await x.click(); await p.waitForTimeout(3000); o.afterClose = await p.locator('.q-dialog').filter({ hasText: 'Edit Line' }).count();
  o.labor = (await p.locator('text=/^\\s*Labor\\s*$/').first().locator('xpath=..').innerText().catch(() => '')).replace(/\s+/g, ' ');
  await p.screenshot({ path: path.join(EV, 'C707077-stg1023-s5-closed.png') });
  o.after = await techs(); o.unchanged = JSON.stringify(o.before) === JSON.stringify(o.after);
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
console.log(t(), 'CLOSE', JSON.stringify(o)); fs.writeFileSync(path.join(EV, 'c707077-stg-close-1023.json'), JSON.stringify(o, null, 1)); await done(browser);
