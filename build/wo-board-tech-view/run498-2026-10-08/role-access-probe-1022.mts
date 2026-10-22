/** role-access-probe-1022.mts — 22 Oct 2026, READ ONLY. Why can the production test admin not start account access on screen (no item in the
 *  Staff row, /impersonate-user lands without the Account Access bar)? Reads the signed-in user's role and its permission codes, the
 *  built-in Admin role's codes, and lists every code mentioning impersonation / account access / switch user in either, plus the codes
 *  Admin has that this role lacks. Output EV/role-access-probe-1022.json. Changes nothing. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api } from './data.mts'; import { EV, t } from './wob.mts'; import { ORG } from './profile.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p); const o: any = {};
const list = (d: any) => Array.isArray(d) ? d : d?.collection ?? [];
const meU = (await a.get('/api/iam/view-profile/')).body?.data?.user ?? {}; o.me = { name: `${meU.first_name} ${meU.last_name}`, role_id: meU.role_id };
o.fePermissionsOnSession = await p.evaluate(`(() => { try { const w = JSON.parse(localStorage.getItem('fe_permissions_wrapper') || 'null'); const l = w?.fe_permissions ?? w ?? []; return Array.isArray(l) ? l.map(x => x.code ?? x.name ?? x).filter(x => /imperson|account|switch/i.test(String(x))) : null; } catch { return null; } })()`);
const roles = list((await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data);
o.roles = roles.map((r: any) => ({ id: r.id, label: r.label ?? r.name, system: r.is_system ?? r.system ?? null })).slice(0, 40);
const codes = async (id: string) => { const r = (await a.get(`/api/roles/${id}`)).body?.data; return { name: r?.name ?? r?.label, template: r?.template_id ?? null, codes: (r?.fe_permissions ?? []).map((x: any) => x.code ?? x.name ?? x) as string[] }; };
const mine = o.me.role_id ? await codes(o.me.role_id) : null; const adminRole = roles.find((r: any) => /^admin(istrator)?$/i.test(r.label ?? r.name ?? ''));
const adm = adminRole ? await codes(adminRole.id) : null;
o.myRole = mine ? { name: mine.name, template: mine.template, count: mine.codes.length, access: mine.codes.filter((c) => /imperson|account|switch/i.test(c)) } : null;
o.adminRole = adm ? { name: adm.name, count: adm.codes.length, access: adm.codes.filter((c) => /imperson|account|switch/i.test(c)) } : null;
o.adminHasMyRoleLacks = mine && adm ? adm.codes.filter((c) => !mine.codes.includes(c)) : null;
fs.writeFileSync(path.join(EV, 'role-access-probe-1022.json'), JSON.stringify(o, null, 1)); console.log(t(), 'ROLEACCESS', JSON.stringify(o).slice(0, 3000)); await done(browser);
