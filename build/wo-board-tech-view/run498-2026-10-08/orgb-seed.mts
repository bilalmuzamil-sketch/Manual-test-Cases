/**
 * Organisation B data (12 Oct 2026), signed in with the login the QA lead gave (kept in /tmp only). The login API answers 401
 * unless the request carries the sign-in page's Origin/Referer and the branch SSO cookie (orgb-login-probe) — so a request
 * context with those headers is used, and the app's own endpoints make: a technician "ZZAUTOTEST F3 Scope OrgB Tech",
 * a customer "ZZAUTOTEST F3 Scope OrgB Customer" and an Approved work order led by that technician (C154650, C368175).
 */
import { request } from 'playwright';
import fs from 'node:fs'; import path from 'node:path';
import { EV, t } from './wob.mts';
import { customer, workOrder } from './data.mts';
import { person, staffRows } from './staff.mts';
const env = Object.fromEntries(fs.readFileSync('/tmp/shopview/sv10043-orgb.env', 'utf8').trim().split('\n').map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]));
const API = 'https://sv10043api.qa.shopview.com';
/* FIX: the SSO cookie goes into the cookie JAR (host-only, both hosts) — a hard-wired Cookie header overrode the session
   cookie the login hands back, so every call after the login was 401 not_authenticated */
const ck = (domain: string) => ({ name: 'sv_sso_session', value: process.env.GS_SSO || '', domain, path: '/', expires: -1, httpOnly: true, secure: true, sameSite: 'Lax' as const });
const rc = await request.newContext({ ignoreHTTPSErrors: true, storageState: { cookies: [ck('sv10043api.qa.shopview.com'), ck('sv10043.qa.shopview.com')], origins: [] }, extraHTTPHeaders: { Accept: 'application/json', Origin: 'https://sv10043.qa.shopview.com', Referer: 'https://sv10043.qa.shopview.com/login' } });
const lr = await rc.post(`${API}/api/login`, { data: { username: env.SV_USER, password: env.SV_PASS } }); const L = (await lr.json().catch(() => null))?.data ?? {};
const tok = L.token ?? L.access_token ?? null;
const a: any = {}; for (const m of ['get', 'post', 'put', 'patch']) a[m] = async (u: string, b?: unknown) => { const r = await rc.fetch(`${API}${u}`, { method: m.toUpperCase(), data: b === undefined ? undefined : b, headers: { 'Content-Type': 'application/json', ...(tok ? { Authorization: `Bearer ${tok}` } : {}) } }); return { status: r.status(), body: await r.json().catch(() => null) }; };
const o: any = { login: lr.status() };
const det = L.details ?? L.user?.details ?? {}; o.orgId = String(L.organization_id ?? det.organization_id ?? L.user?.organization_id ?? '').slice(0, 8);
const WPB = det.default_workplace ?? L.default_workplace ?? L.workplace_id ?? null; o.workplace = String(WPB ?? '').slice(0, 8); o.loginKeys = Object.keys(L).slice(0, 30); o.detKeys = Object.keys(det).slice(0, 30);
const orgs = await a.get('/api/organizations'); o.orgs = (orgs.body?.data?.organizations ?? []).map((x: any) => x.name);
const me = (await staffRows(a, env.SV_USER))[0]; o.me = me ? `${me.first_name} ${me.last_name} | ${me.role_label} | wp ${String(me.workplace_id).slice(0, 8)}` : null;
const orgRows = orgs.body?.data?.organizations ?? []; const ORG = (orgRows.find((x: any) => x.name !== 'Staging Foothills Group Inc') ?? {}).id ?? me?.organization_id; o.orgBName = (orgRows.find((x: any) => x.id === ORG) ?? {}).name; const wp = WPB ?? me?.workplace_id;
const rr1 = await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`); const rr2 = await a.get('/api/roles?pagination[rowsPerPage]=1000');
o.rolesRaw = [rr1.status, JSON.stringify(rr1.body).slice(0, 200), rr2.status, JSON.stringify(rr2.body).slice(0, 300)];
const pick = (b: any) => { const d = b?.data; return Array.isArray(d) ? d : (d?.collection ?? d?.roles ?? []); };
const roles = [...pick(rr1.body), ...pick(rr2.body)]; o.roles = roles.map((r: any) => r.name).slice(0, 15);
const tech = roles.find((r: any) => /^technician$/i.test(r.name)) ?? roles.find((r: any) => /tech/i.test(r.name));
const p = await person(a, 'ZZAUTOTEST F3 Scope', 'OrgB Tech', { role: tech?.id, email: 'zz.wob.orgb.tech@staging.shopview.local', workplace: wp, clockable: true }); o.tech = p.row ? `${p.row.first_name} ${p.row.last_name} staff=${!!p.row.staff_id}` : null; o.techLog = p.log;
try { const c: any = await customer(a, 'ZZAUTOTEST F3 Scope OrgB Customer', 'ORGB-1'); o.customer = !!c.company_id; const w = await workOrder(a, c, 'approved', p.row?.staff_id ?? null); o.wo = (await a.get(`/api/work-orders/view/${w}`)).body?.data?.work_order?.number; }
catch (e: any) { o.woError = String(e?.message || e).slice(0, 250); }
o.orgBWorkOrders = (await a.get('/api/work-orders?search=F3%20Scope%20OrgB&pagination[rowsPerPage]=10')).body?.data?.collection?.length ?? null;
console.log(t(), 'ORGB-SEED', JSON.stringify(o).replace(/[0-9a-f]{32,}/g, '<h>').slice(0, 3000)); fs.writeFileSync(path.join(EV, 'orgb-seed.json'), JSON.stringify(o, null, 1)); process.exit(0);
