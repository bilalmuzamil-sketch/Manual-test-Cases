// Can a tech session and an admin session run side by side? And who is the tech account?
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const admin = await P.openStaging('/customers', 'admin');
const tech = await P.openStaging('/customers', 'tech');
const who = async (b, label) => {
  const r = await b.page.evaluate(async () => {
    const j = async (u) => { const x = await fetch('https://api.staging.shopview.com' + u, { credentials: 'include', headers: { Accept: 'application/json' } }); return { status: x.status, body: await x.json().catch(() => null) }; };
    const perms = await j('/api/iam/fe-permissions');
    const staff = await j('/api/staff?per_page=100');
    return { permsStatus: perms.status,
             nPerms: ((perms.body || {}).data || {}).collection ? perms.body.data.collection.length : (Array.isArray((perms.body || {}).data) ? perms.body.data.length : null),
             perms: perms.body };
  });
  console.log(label, 'fe-permissions ->', r.permsStatus, 'count', r.nPerms);
  return r;
};
const a = await who(admin, 'ADMIN');
const t = await who(tech, 'TECH ');
// is the admin session still alive after the tech login?
const stillOk = await admin.page.evaluate(async () => (await fetch('https://api.staging.shopview.com/api/staff/my-workplaces', { credentials: 'include', headers: { Accept: 'application/json' } })).status);
console.log('admin session after the tech login ->', stillOk);
fs.writeFileSync('probe-tech2.json', JSON.stringify({ a: { n: a.nPerms }, t: { n: t.nPerms, perms: t.perms }, stillOk }, null, 1));
await admin.browser.close(); await tech.browser.close();
