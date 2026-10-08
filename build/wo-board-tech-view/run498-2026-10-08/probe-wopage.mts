/** Which calls does a work order page make (lines, history), and what do they answer? Also reset the admin's pins. */
import { open, done, APP } from './session.mts';
import { api, workOrders } from './data.mts';
import { t } from './wob.mts';
const { browser, page: p } = await open('/workorders');
const a = api(p);
const gets: string[] = []; p.on('request', (q) => { if (q.method() === 'GET' && /\/api\/work-orders\//.test(q.url())) gets.push(q.url().replace(/^https:\/\/[^/]+/, '').slice(0, 140)); });
const [w] = await workOrders(a, 'ZZAUTOTEST F2 Initials Avatar');
await p.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
console.log(t(), 'GETS', JSON.stringify([...new Set(gets)]));
for (const u of [`/api/work-orders/${w.id}/lines`, `/api/work-orders/${w.id}/history`, `/api/work-orders/view/${w.id}`]) { const r = await a.get(u); console.log(t(), u.replace(w.id, '<id>'), r.status, JSON.stringify(r.body).slice(0, 700)); }
console.log(t(), 'lead select text', await p.evaluate(`[...document.querySelectorAll('[data-test-id*="lead"]')].map(e => e.getAttribute('data-test-id') + '=' + e.innerText.replace(/\\s+/g, ' ').slice(0, 60)).slice(0, 6)`));
// the admin's pins back to what they were at the start of the session (Brandi Smith only)
const pref = (await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {};
console.log(t(), 'pins now', JSON.stringify(pref.pinnedTechnicianIds));
pref.pinnedTechnicianIds = ['3ff0914b-49a3-4d80-b07d-92a10e1a89f8'];
console.log(t(), 'reset pins', (await a.put('/api/users/me/preferences/work-orders-list', { value: pref })).status, JSON.stringify(((await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {}).pinnedTechnicianIds));
await done(browser);
