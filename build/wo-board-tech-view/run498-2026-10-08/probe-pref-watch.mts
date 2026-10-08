/** Is anyone else changing the admin user's saved display? Read it every 10 s for 3 minutes, touching nothing. */
import { open, done } from './session.mts';
import { api } from './data.mts';
const { browser, page: p } = await open('/customers');
const a = api(p);
let last = '';
for (let i = 0; i < 18; i++) {
  const r = await a.get('/api/users/me/preferences/work-orders-list');
  const v = r.body?.data?.value ?? r.body?.value ?? {};
  const s = `display=${v.display} tab=${v.tab} filters=${JSON.stringify(v.filters)}`;
  if (s !== last) console.log(new Date().toISOString().slice(11, 19), r.status, s);
  last = s; await p.waitForTimeout(10_000);
}
await done(browser);
