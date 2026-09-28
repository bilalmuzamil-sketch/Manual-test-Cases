import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');   // any live session can mint a quick-login
const out = await b.page.evaluate(async () => {
  const r = await fetch('https://api.staging.shopview.com/api/quick-login', { method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ key: 'tech' }) });
  return { status: r.status, body: await r.json().catch(() => null) };
});
console.log('quick-login tech ->', out.status);
console.log(JSON.stringify(out.body).slice(0, 900));
fs.writeFileSync('probe-techid.json', JSON.stringify(out, null, 1));
await b.browser.close();
