/** Is there ANY second organisation on sv10043 (12 Oct 2026)? POST /api/register now answers 404 on this build, so
 *  organisation B can only be one that already exists. Lists /api/organizations and searches /api/users and /api/companies
 *  for other-organisation records (playbook §X: from organisation A these lists show B's records too). Read-only. */
import fs from 'node:fs'; import path from 'node:path';
import { open } from './session.mts';
import { api } from './data.mts';
import { EV, t } from './wob.mts';
const { browser, page } = await open('/customers'); const a = api(page); const o: any = {};
const arr = (b: any) => Array.isArray(b?.data) ? b.data : (b?.data?.collection ?? b?.data?.organizations ?? b?.collection ?? []);
const r = await a.get('/api/organizations'); o.orgsStatus = r.status; o.orgs = arr(r.body).map((x: any) => ({ id: String(x.id).slice(0, 8), name: x.name ?? x.company_name ?? x.title }));
o.orgsRaw = JSON.stringify(r.body).slice(0, 400);
const me = (await a.get('/api/auth/me/fe-permissions')).body; o.myOrgHint = JSON.stringify(me).match(/organi[sz]ation[^,]{0,80}/i)?.[0] ?? null;
for (const u of ['/api/users?limit=200&search=OrgB', '/api/users?limit=500', '/api/companies?limit=50&search=OrgB']) { const x = await a.get(u); const rows = arr(x.body); o[u] = { status: x.status, n: rows.length, orgIds: [...new Set(rows.map((y: any) => String(y.organization_id ?? y.organizationId ?? '').slice(0, 8)))].slice(0, 10), orgB: rows.filter((y: any) => /orgb|other org/i.test(JSON.stringify(y))).map((y: any) => `${y.first_name ?? y.name ?? ''} ${y.last_name ?? ''} org=${String(y.organization_id ?? '').slice(0, 8)}`).slice(0, 10) }; }
console.log(t(), 'ORGB', JSON.stringify(o).slice(0, 3000)); fs.writeFileSync(path.join(EV, 'orgb-check.json'), JSON.stringify(o, null, 1));
await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 8000))]); process.exit(0);
