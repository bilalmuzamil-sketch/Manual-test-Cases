/** carol-sparks-stg2-1023.mts — 23 Oct 2026, STAGING, read-only. Follow-up to carol-sparks-stg-1023.mts: (2) Settings > Staff search ONE word
 *  "Carol" (a full-name search "Carol Neal" finds nobody — searched as one term); (3b) viewing as Carol, open the top-right name menu to show
 *  whose account it is. Boxes -> EV/carol-sparks-stg2-1023.json. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { api } from './data.mts'; import { EV, t } from './wob.mts'; import { viewAs } from './viewas.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = {};
try {
  await a.post('/api/exit-switch-user', {});
  await p.goto(APP + '/administration/staff?search=Carol', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  const rows = p.locator('tbody tr'); o.rows = await rows.evaluateAll((r: any[]) => r.map((x) => x.innerText.replace(/\s+/g, ' ').slice(0, 200)));
  const row = rows.filter({ hasText: 'Neal' }).first(); o.row = (await row.innerText().catch(() => '')).replace(/\s+/g, ' '); o.rowBox = await row.boundingBox().catch(() => null);
  o.searchBox = await p.locator('input').filter({ hasText: '' }).first().boundingBox().catch(() => null);
  await p.screenshot({ path: path.join(EV, 'stg-carol-2-search-carol.png') });
  const v = await viewAs(browser, p, a, '5b7d54ab-f93f-4eaa-9983-bb004702de0d', ''); const q = v.page;
  await q.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await q.waitForTimeout(7000);
  await q.locator('[data-test-id="profile_menu_button"]').click(); await q.waitForTimeout(2500);
  const menu = q.locator('.q-menu').last(); o.menu = (await menu.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); o.menuBox = await menu.boundingBox().catch(() => null);
  const nm = menu.locator('text=/Carol/').first(); o.nameBox = await nm.boundingBox().catch(() => null); o.btnBox = await q.locator('[data-test-id="profile_menu_button"]').boundingBox().catch(() => null);
  await q.screenshot({ path: path.join(EV, 'stg-carol-4-name-menu-as-carol.png') });
  await v.close(); o.exit = 'closed';
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await a.post('/api/exit-switch-user', {}).catch(() => {}); }
console.log(t(), 'CAROL2', JSON.stringify(o)); fs.writeFileSync(path.join(EV, 'carol-sparks-stg2-1023.json'), JSON.stringify(o, null, 1)); await done(browser);
