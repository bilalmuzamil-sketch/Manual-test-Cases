/** role-make-1026.mts — 26 Oct 2026 (Rule 107: seed what the test needs): make the custom role "ZZAUTOTEST WO View Only" (Work orders: View
 *  only) on the current branch with POST /api/roles, trying the body shapes the refusal names; read it back. */
import { open, done } from './session.mts'; import { api } from './data.mts'; import { t } from './wob.mts'; import { ORG } from './profile.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = { tries: [] };
const L = async () => ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data);
const tech = (await L()).find((r: any) => /^Technician$/.test(r.label ?? r.name ?? '')); const T = (await a.get(`/api/roles/${tech.id}`)).body.data;
const wov = T.fe_permissions.find((x: any) => x.code === 'workOrdersView').id;
const NAME = 'ZZAUTOTEST WO View Only';
const bodies = [
  { name: NAME, description: 'Work orders: View only (QA)', organization: ORG, fe_permissions: [wov], template_id: T.template_id, cross_toggles: { seeFinancialData: false, seeApArData: false, viewHistoryLogs: false } },
  { name: NAME, description: 'Work orders: View only (QA)', organization: ORG, fe_permissions: [{ id: wov }], template_id: T.template_id },
  { name: NAME, description: 'Work orders: View only (QA)', permissions: [wov], template_id: T.template_id },
  { name: NAME, description: 'Work orders: View only (QA)', fe_permission_ids: [wov], template_id: T.template_id, organization_id: ORG },
];
for (const b of bodies) { if ((await L()).some((r: any) => (r.label ?? r.name) === NAME)) break; const r = await a.post('/api/roles', b); o.tries.push({ keys: Object.keys(b), status: r.status, body: JSON.stringify(r.body).slice(0, 300) }); }
const made = (await L()).find((r: any) => (r.label ?? r.name) === NAME); o.made = made ? made.id : null;
if (made) o.readback = (await a.get(`/api/roles/${made.id}`)).body?.data?.fe_permissions?.map((x: any) => x.code);
console.log(t(), 'ROLE', JSON.stringify(o)); await done(browser);
