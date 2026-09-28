import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const tech = await P.openStaging('/customers', 'tech');
const out = await tech.page.evaluate(async () => {
  const j = async (u) => { try { const x = await fetch('https://api.staging.shopview.com' + u, { credentials: 'include', headers: { Accept: 'application/json' } }); return { u, status: x.status, body: (await x.text()).slice(0, 400) }; } catch (e) { return { u, err: String(e) }; } };
  const out = [];
  for (const u of ['/api/iam/me', '/api/staff/me', '/api/users/me', '/api/me', '/api/iam/user', '/api/staff/current', '/api/iam/permissions']) out.push(await j(u));
  return out;
});
for (const r of out) console.log(r.u, '->', r.status, (r.body || '').slice(0, 220));
fs.writeFileSync('probe-whoami.json', JSON.stringify(out, null, 1));
await tech.browser.close();
