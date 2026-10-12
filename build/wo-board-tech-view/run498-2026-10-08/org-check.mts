/** Prove the organisation id for the current environment's profile (12 Oct 2026). Read-only. */
import { open, done } from './session.mts';
import { api } from './data.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p);
const me = (await a.get('/api/auth/me')).body?.data ?? {};
const cand = [process.env.WOB_ORG, me.organization_id, me.organizationId, me.organization?.id, me.details?.organization_id].filter(Boolean);
const out: any = { meKeys: Object.keys(me).slice(0, 25), cand };
for (const o of cand) { const r = await a.get(`/api/organizations/${o}/roles?pagination[rowsPerPage]=5`); out[o] = r.status; }
console.log('ORG', JSON.stringify(out)); await done(browser);
