import { open, done } from './session.mts'; import { api } from './data.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p);
const st = ((await a.get('/api/staff?limit=200&search=Esther')).body?.data?.collection ?? []) as any[];
const T = ((await a.get('/api/technicians?limit=1000&per_page=1000')).body?.data?.collection ?? []) as any[];
const e = T.find((x: any) => /Esther Howard/.test(x.name));
console.log('STAFFROW', JSON.stringify(st[0] ?? null).slice(0, 400)); console.log('TECH', JSON.stringify(e ?? null).slice(0, 400));
for (const u of [`/api/iam/view-profile/${e?.user_id}`, `/api/staff/${st[0]?.staff_id}`, `/api/staff/${st[0]?.id}`, `/api/users/${e?.user_id}`]) { const r = await a.get(u); console.log('GET', u.replace(/[0-9a-f-]{36}/g, '<id>'), r.status, JSON.stringify(r.body).slice(0, 300)); }
console.log('COUNTS staff(limit200)', st.length, 'techs', T.length, 'staffAll', (((await a.get('/api/staff?limit=500')).body?.data?.collection) ?? []).length, 'meta', JSON.stringify((await a.get('/api/staff?limit=500')).body?.data ?? {}).replace(/"collection":\[.*\]/, '').slice(0, 200));
await done(browser);
