/** Read the build marker and sign-in health before anything else (resume, 9 Oct 2026). Read-only. */
import { open, done } from './session.mts';
import { api } from './data.mts';
const { browser, page: p } = await open('/workorders');
const a = api(p);
const me = await a.get('/api/users/me'); console.log('me', me.status, 'perms', (me.body?.data?.fe_permissions ?? me.body?.fe_permissions ?? []).length);
const marker = await p.evaluate(() => { const t = document.body.innerText.match(/v\d+\.\d+\.\d+-[0-9a-f]{7}/); return t ? t[0] : null; });
console.log('marker in page', marker);
for (const u of ['/api/version', '/version', '/api/app/version']) { const r = await a.get(u).catch(() => ({ status: 0, body: null })); if (r.status === 200) console.log('version', u, JSON.stringify(r.body).slice(0, 200)); }
await done(browser);
