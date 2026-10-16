/** 16 Oct 2026 (batch 40) — read only: open the app as Analyst 1 (analyst.mts, its own cookies) and record what the second company holds
 *  for the blocked tests: does the app open on Work Orders, the user's permissions, locations, technicians (lead candidates), roles,
 *  staff count, work order count and the Tech View Unassigned count. Pictures EV/analyst-probe-*.png; json EV/analyst-probe.json. */
import fs from 'node:fs'; import path from 'node:path';
import { analystBrowser } from './analyst.mts'; import { EV, t } from './wob.mts';
const A = await analystBrowser('/workorders?tab=all'); const p = A.page, a = A.api; const o: any = { info: A.info };
await p.screenshot({ path: path.join(EV, 'analyst-probe-1.png') });
o.localUser = await p.evaluate(() => { const u = localStorage.getItem('user'); return u ? Object.keys(JSON.parse(u).data ?? JSON.parse(u)).slice(0, 30) : null; });
const fe = (await a.get('/api/auth/me/fe-permissions')).body?.data; o.perms = (Array.isArray(fe) ? fe : fe?.fe_permissions ?? []).map((x: any) => x.code ?? x.name ?? x).slice(0, 80);
o.workplaces = (await a.get('/api/staff/my-workplaces')).body?.data;
o.orgs = (await a.get('/api/organizations')).body?.data?.organizations?.map((x: any) => `${x.name} ${String(x.id).slice(0, 8)}`);
o.cands = ((await a.get('/api/work-orders/lead-technician-candidates')).body?.data?.technicians ?? []).map((x: any) => `${x.firstName} ${x.lastName}`);
const st = await a.get('/api/staff?limit=200'); o.staff = (st.body?.data?.collection ?? []).map((x: any) => `${x.first_name} ${x.last_name} | ${x.role_label} | clock=${x.clockable} | del=${x.deletable}`);
o.depts = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/departments')).body?.data).map((d: any) => d.name ?? d.label);
const wl = await a.get('/api/work-orders?tab=all&pagination[rowsPerPage]=5'); o.woTotal = wl.body?.data?.pagination ?? null; o.woSample = (wl.body?.data?.work_orders ?? []).map((w: any) => `${w.number} ${w.status} lead=${w.techAssignedFirstName ?? '-'}`);
o.top = await p.locator('[data-test-id="profile_menu_button"]').innerText().catch(() => null);
await p.locator('[aria-label="Tech View"]').first().click().catch(() => {}); await p.waitForTimeout(5000);
o.groups = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_group_count_"]')].map(c => { const id = c.getAttribute('data-test-id').replace('tech_view_group_count_', ''); const n = document.querySelector('[data-test-id="tech_view_group_name_' + id + '"]'); return (n ? n.textContent.trim() : id) + '=' + c.textContent.trim(); })`);
await p.screenshot({ path: path.join(EV, 'analyst-probe-2-techview.png') });
fs.writeFileSync(path.join(EV, 'analyst-probe.json'), JSON.stringify(o, null, 1)); console.log(t(), 'ANALYST', JSON.stringify(o).slice(0, 6000));
await A.browser.close(); process.exit(0);
