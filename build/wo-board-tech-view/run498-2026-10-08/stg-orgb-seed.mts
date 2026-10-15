/**
 * 15 Oct 2026 — STAGING, C154650 set-up in the SECOND company, signed in as the QA lead's "Analyst 1" (bilal.muzamil+dako). Cookies
 * from /tmp/qa-cookies/staging-analyst1.json (chmod 600, never committed). ONE Google sign-in holds ONE app session (L0394), so this
 * runs BEFORE anything signs in as Admin. Makes, in company B: technician "ZZAUTOTEST F3 Scope OrgB Tech", customer "ZZAUTOTEST F3
 * Scope OrgB Customer" and an Approved work order led by that technician. If a write is refused (the role may not allow it), the
 * company's existing technicians and work orders are read instead, so the company-A checks have real company-B names to look for.
 * Writes evidence/staging-full-2026-10-14/orgb-seed-stg.json: { ids, names, woNumbers, customers, company }. Nothing secret is written.
 */
import { request } from 'playwright';
import fs from 'node:fs'; import path from 'node:path';
import { EV, t } from './wob.mts';
import { customer, workOrder } from './data.mts';
import { person } from './staff.mts';
const C = JSON.parse(fs.readFileSync('/tmp/qa-cookies/staging-analyst1.json', 'utf8'));
const API = 'https://api.staging.shopview.com', APPH = 'app.staging.shopview.com';
const PORT = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const ck = (name: string, value: string, domain: string) => ({ name, value, domain, path: '/', expires: -1, httpOnly: true, secure: true, sameSite: 'Lax' as const });
const cookies = ['api.staging.shopview.com', APPH, '.shopview.com'].flatMap((d) => [ck('sv_sso_session', C.sv_sso_session, d), ck('PHPSESSID', C.PHPSESSID, d), ck('cf_clearance', C.cf_clearance, d)]);
const rc = await request.newContext({ ignoreHTTPSErrors: true, proxy: { server: `http://127.0.0.1:${PORT}` }, storageState: { cookies, origins: [] },
  extraHTTPHeaders: { Accept: 'application/json', Origin: `https://${APPH}`, Referer: `https://${APPH}/workorders` } });
const a: any = {}; for (const m of ['get', 'post', 'put', 'patch']) a[m] = async (u: string, b?: unknown) => { const r = await rc.fetch(`${API}${u}`, { method: m.toUpperCase(), data: b === undefined ? undefined : b, headers: { 'Content-Type': 'application/json' } }); return { status: r.status(), body: await r.json().catch(() => null) }; };
const o: any = { at: new Date().toISOString(), ids: [], names: [], woNumbers: [], customers: [] };
const perm = await a.get('/api/auth/me/fe-permissions'); o.signedIn = perm.status;   // positive control: 200 = the Analyst 1 session is alive
if (perm.status !== 200) { o.error = `Analyst 1 sign-in refused: ${perm.status} ${JSON.stringify(perm.body).slice(0, 120)}`; }
else {
  o.permCount = (perm.body?.data ?? perm.body)?.length ?? null;
  const orgs = await a.get('/api/organizations'); o.company = (orgs.body?.data?.organizations ?? []).map((x: any) => x.name);
  const rolesR = await a.get('/api/roles?pagination[rowsPerPage]=1000'); const roles = (rolesR.body?.data?.collection ?? rolesR.body?.data ?? []) as any[]; o.roles = roles.map((r: any) => r.name).slice(0, 15);
  const tech = roles.find((r: any) => /^technician$/i.test(r.name)) ?? roles.find((r: any) => /tech/i.test(r.name));
  try { const p = await person(a, 'ZZAUTOTEST F3 Scope', 'OrgB Tech', { role: tech?.id, email: 'zz.wob.orgb.tech.stg@staging.shopview.local', clockable: true });
    o.tech = p.row ? { id: p.row.staff_id, user: p.row.id, name: `${p.row.first_name} ${p.row.last_name}` } : null; o.techLog = JSON.stringify(p.log ?? '').slice(0, 300);
    if (p.row) { o.ids.push(p.row.staff_id, p.row.id); o.names.push(`${p.row.first_name} ${p.row.last_name}`); }
    const c: any = await customer(a, 'ZZAUTOTEST F3 Scope OrgB Customer', 'ORGB-1'); const w = await workOrder(a, c, 'approved', p.row?.staff_id ?? null);
    const v = (await a.get(`/api/work-orders/view/${w}`)).body?.data?.work_order; o.wo = v?.number; o.woLead = v?.tech_assigned_id ?? v?.lead_technician_id ?? null; if (v?.number) o.woNumbers.push(v.number); o.customers.push('ZZAUTOTEST F3 Scope OrgB Customer');
  } catch (e: any) { o.seedError = String(e?.message || e).slice(0, 250); }
  // whatever the writes did: read company B's own technicians and work orders, so A is checked against everything B holds
  const cands = ((await a.get('/api/work-orders/lead-technician-candidates')).body?.data?.technicians ?? []) as any[];
  for (const x of cands) { o.ids.push(x.staffId, x.userId); o.names.push(`${x.firstName ?? ''} ${x.lastName ?? ''}`.trim()); }
  const wl = (await a.get('/api/work-orders?pagination[rowsPerPage]=50')).body?.data?.work_orders ?? [];
  for (const w of wl) { if (w.number) o.woNumbers.push(w.number); const cn = w.customer_name ?? w.company_name ?? w.customer?.name; if (cn) o.customers.push(cn); }
  o.ids = [...new Set(o.ids.filter(Boolean))]; o.names = [...new Set(o.names.filter(Boolean))]; o.woNumbers = [...new Set(o.woNumbers)]; o.customers = [...new Set(o.customers)];
}
fs.writeFileSync(path.join(EV, 'orgb-seed-stg.json'), JSON.stringify(o, null, 1));
console.log(t(), 'ORGB-STG', JSON.stringify({ ...o, ids: o.ids.length }).slice(0, 1500)); process.exit(0);
