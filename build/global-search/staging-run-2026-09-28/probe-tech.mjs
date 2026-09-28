// Which accounts does the sign-in panel offer, and who is the technician?
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
const out = await b.page.evaluate(async () => {
  const j = async (u, o) => { const r = await fetch('https://api.staging.shopview.com' + u, Object.assign({ credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }, o)); return { status: r.status, body: await r.json().catch(() => null) }; };
  const users = await j('/api/quick-login/users');
  const me = await j('/api/staff/my-workplaces');
  return { users: users.status === 200 ? users.body : users, meStatus: me.status };
});
console.log(JSON.stringify(out).slice(0, 1200));
fs.writeFileSync('probe-tech.json', JSON.stringify(out, null, 1));
await b.browser.close();
