/**
 * RUN ONCE PER NEW ENVIRONMENT (2026-10-09): signs in, finds the organisation and the two locations the suite uses,
 * and writes profiles/<host>.json, so no later batch has to rediscover them. Read-only.
 *   GS_APP=https://<branch>.qa.shopview.com  [WOB_LOC1_NAME="Heavy Duty"] [WOB_LOC2_NAME="Lethbridge"]  wob.sh discover-profile.mts
 * Staging/production: also set WOB_API=https://<api host> (QA branches derive it).
 */
import fs from 'node:fs';
import { open, done } from './session.mts';
import { api } from './data.mts';
import { APP, API, HOST, PROFILE_FILE } from './profile.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p);
const wp = (await a.get('/api/staff/my-workplaces')).body?.data; const places: any[] = Array.isArray(wp) ? wp : wp?.collection ?? wp?.workplaces ?? [];
const nm = (x: any) => String(x.name ?? x.workplace_name ?? x.label ?? '');
const l1 = places.find((x) => new RegExp(process.env.WOB_LOC1_NAME || 'Heavy Duty', 'i').test(nm(x))) ?? places[0];
const l2 = places.find((x) => x !== l1 && new RegExp(process.env.WOB_LOC2_NAME || 'Lethbridge', 'i').test(nm(x))) ?? places.find((x) => x !== l1);
const me = (await a.get('/api/auth/me')).body?.data ?? {};
const org = me.organization_id ?? me.organizationId ?? l1?.organization_id ?? l1?.organizationId ?? (await a.get('/api/staff?limit=1')).body?.data?.collection?.[0]?.organization_id ?? '';
const out = { host: HOST, app: APP, api: API, org, heavy: l1?.id ?? l1?.workplace_id ?? '', heavyName: l1 ? nm(l1) : null, leth: l2?.id ?? l2?.workplace_id ?? '', lethName: l2 ? nm(l2) : null, written: new Date().toISOString() };
fs.writeFileSync(PROFILE_FILE, JSON.stringify(out, null, 1)); console.log('profile', JSON.stringify(out));
await done(browser);
