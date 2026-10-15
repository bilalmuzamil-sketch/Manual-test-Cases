/** 15 Oct 2026 — STAGING, C154650: in company B (Analyst 1 login, as stg-orgb-seed.mts), make the existing technician offered as lead
 *  ("Scope OrgB Tech") the lead of work order S-2 ("ZZAUTOTEST F3 Scope OrgB Customer"), and read it back. Adds its staff ids to
 *  orgb-seed-stg.json. stg-orgb-seed.mts could not create a new technician (role list empty: "Role is missing"). */
import { request } from 'playwright';
import fs from 'node:fs'; import path from 'node:path';
import { EV, t } from './wob.mts';
const C = JSON.parse(fs.readFileSync('/tmp/qa-cookies/staging-analyst1.json', 'utf8')); const API = 'https://api.staging.shopview.com', APPH = 'app.staging.shopview.com';
const PORT = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const ck = (name: string, value: string, domain: string) => ({ name, value, domain, path: '/', expires: -1, httpOnly: true, secure: true, sameSite: 'Lax' as const });
const rc = await request.newContext({ ignoreHTTPSErrors: true, proxy: { server: `http://127.0.0.1:${PORT}` }, storageState: { cookies: ['api.staging.shopview.com', APPH].flatMap((d) => [ck('sv_sso_session', C.sv_sso_session, d), ck('PHPSESSID', C.PHPSESSID, d), ck('cf_clearance', C.cf_clearance, d)]), origins: [] }, extraHTTPHeaders: { Accept: 'application/json', Origin: `https://${APPH}`, Referer: `https://${APPH}/workorders` } });
const call = async (m: string, u: string, b?: unknown) => { const r = await rc.fetch(`${API}${u}`, { method: m, data: b, headers: { 'Content-Type': 'application/json' } }); return { status: r.status(), body: await r.json().catch(() => null) }; };
const F = path.join(EV, 'orgb-seed-stg.json'); const S = JSON.parse(fs.readFileSync(F, 'utf8')); const o: any = {};
const cands = ((await call('GET', '/api/work-orders/lead-technician-candidates')).body?.data?.technicians ?? []) as any[]; o.cands = cands.map((x) => `${x.firstName} ${x.lastName}`);
const tech = cands.find((x) => /OrgB Tech/.test(`${x.firstName} ${x.lastName}`)) ?? cands[0]; o.tech = tech ? `${tech.firstName} ${tech.lastName}` : null;
const wl = ((await call('GET', '/api/work-orders?search=F3%20Scope%20OrgB&pagination[rowsPerPage]=10')).body?.data?.work_orders ?? []) as any[];
const w = wl.find((x) => x.number === S.wo) ?? wl[0]; o.wo = w?.number;
if (tech && w) { o.set = (await call('POST', '/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: tech.staffId })).status;
  const v = (await call('GET', `/api/work-orders/view/${w.id}`)).body?.data?.work_order ?? {}; o.leadBack = JSON.stringify(Object.fromEntries(Object.entries(v).filter(([k]) => /tech|lead/i.test(k)))).slice(0, 300); o.status = v.status; }
S.tech = tech ? { id: tech.staffId, user: tech.userId, name: o.tech } : S.tech; S.woLeadSet = o.set; S.techNames = o.cands; fs.writeFileSync(F, JSON.stringify(S, null, 1));
console.log(t(), 'ORGB-LEAD', JSON.stringify(o).slice(0, 1200)); process.exit(0);
