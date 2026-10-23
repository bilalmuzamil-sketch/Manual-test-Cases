/** carol-sparks-stg-1023.mts — 23 Oct 2026, STAGING, read-only (account access switched on and off). QA lead: "How can I check IF David
 *  Sparks is really Carol Neal?" — the on-screen check: (1) Settings > Staff search "sparks" finds nobody; (2) search "Carol Neal" finds
 *  her; (3) view the app as Carol (account access) > Work Orders > All > List > "Assigned to me": S2-37765 listed, lead David Sparks.
 *  Positive control: the technicians list's David Sparks carries Carol's user id. Pictures + boxes -> EV/carol-sparks-stg-1023.json. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { api } from './data.mts'; import { EV, t, tab, display } from './wob.mts'; import { viewAs } from './viewas.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = {};
const list = (b: any) => (b?.data?.collection ?? b?.data ?? []) as any[];
const box = async (pg: any, sel: string) => pg.locator(sel).first().boundingBox().catch(() => null);
try {
  await a.post('/api/exit-switch-user', {});
  o.build = (await p.evaluate(`document.documentElement.outerHTML.match(/v\\d+\\.\\d+\\.\\d+-[0-9a-f]{7}/)?.[0] ?? null`));
  await p.goto(APP + '/administration/staff?search=sparks', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  o.s1 = { text: (await p.locator('main, .q-page').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300), msg: await box(p, 'text=/No staff match/'), search: await box(p, 'input[type=search], input[placeholder*="earch"]') };
  await p.screenshot({ path: path.join(EV, 'stg-carol-1-search-sparks.png') });
  await p.goto(APP + '/administration/staff?search=' + encodeURIComponent('Carol Neal'), { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  const row = p.locator('tbody tr').filter({ hasText: 'Carol' }).first();
  o.s2 = { rows: await p.locator('tbody tr').count(), row: (await row.innerText().catch(() => '')).replace(/\s+/g, ' '), box: await row.boundingBox().catch(() => null) };
  await p.screenshot({ path: path.join(EV, 'stg-carol-2-search-carol.png') });
  const carol = list((await a.get('/api/staff?search=Carol&pagination[rowsPerPage]=200')).body).find((x: any) => x.first_name === 'Carol' && x.last_name === 'Neal');
  o.carol = carol ? { id: carol.id, email: carol.email, staff_id: carol.staff_id } : null;
  const T = list((await a.get('/api/technicians?limit=1000&per_page=1000')).body);
  o.control = T.filter((x: any) => x.user_id === carol?.id).map((x: any) => ({ id: x.id, name: x.name }));
  const v = await viewAs(browser, p, a, carol.id, '');
  const q = v.page; q.setDefaultTimeout(20000);
  await q.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await q.waitForTimeout(7000); await tab(q, 'All'); await display(q, 'List').catch(() => {});
  const assigned = () => q.locator('button:has-text("Assigned to me"), .q-btn:has-text("Assigned to me")').first();
  if ((await assigned().getAttribute('aria-pressed')) !== 'true') { await assigned().click(); await q.waitForTimeout(5000); }
  o.s3 = { pressed: await assigned().getAttribute('aria-pressed'), bar: (await q.locator('text=/Account Access/i').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 160),
    rows: (await q.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => r.innerText.replace(/\\s+/g, ' ').slice(0, 220))`)) as string[] };
  let r = q.locator('tbody tr').filter({ hasText: 'S2-37765' }).first();
  if (!(await r.count())) { const sb = q.locator('[data-test-id="page_search_input"]'); if (!(await sb.isVisible().catch(() => false))) await q.locator('[data-test-id="page_search_toggle"]').click().catch(() => {}); await sb.fill('37765'); await q.waitForTimeout(5000); o.s3.searched = true; r = q.locator('tbody tr').filter({ hasText: 'S2-37765' }).first(); }
  o.s3.row = (await r.innerText().catch(() => '')).replace(/\s+/g, ' '); o.s3.rowBox = await r.boundingBox().catch(() => null);
  o.s3.assignedBox = await assigned().boundingBox().catch(() => null); o.s3.barBox = await box(q, 'text=/Account Access/i');
  const leadCell = r.locator('td').filter({ hasText: /Sparks/ }).first(); o.s3.leadBox = await leadCell.boundingBox().catch(() => null); o.s3.lead = await leadCell.innerText().catch(() => null);
  o.s3.heads = await q.evaluate(`[...document.querySelectorAll('thead th')].map(h => h.innerText.trim())`);
  await q.screenshot({ path: path.join(EV, 'stg-carol-3-assigned-as-carol.png') });
  await v.close(); o.exit = 'closed';
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await a.post('/api/exit-switch-user', {}).catch(() => {}); }
console.log(t(), 'CAROL-SPARKS', JSON.stringify(o)); fs.writeFileSync(path.join(EV, 'carol-sparks-stg-1023.json'), JSON.stringify(o, null, 1)); await done(browser);
