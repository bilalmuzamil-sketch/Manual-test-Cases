// C45154's recents half (the first read caught the list before it had loaded - one stale row) and
// C53587, whose work order failed to create because the request was missing the vehicle.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
const out = {};
const recents = async () => {
  await P.openPalette(b.page, 'click');
  await b.page.waitForTimeout(3500);                 // let the recent list actually arrive
  const r = await b.page.evaluate(() => [...document.querySelectorAll('.search-row')].map(x => (x.innerText || '').replace(/\s+/g, ' ').slice(0, 46)));
  await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(700);
  return r;
};
const CUST = 'https://app.staging.shopview.com/customers/3d760beb-ee5e-4cfe-8fe5-9250ca5c4dc7/work-orders';
await b.page.goto(CUST, { waitUntil: 'domcontentloaded' }); await b.page.waitForTimeout(8000);
out.before = await recents();
await P.openPalette(b.page, 'click');
await P.type(b.page, 'ZZAUTOTEST Bridgeport Hauling', 3800);
const urlBefore = b.page.url();
await b.page.evaluate(() => {
  const g = [...document.querySelectorAll('.search-group')].find(x => /^Customers/.test(((x.querySelector('.search-group__header') || {}).innerText || '').trim()));
  const r = g && [...g.querySelectorAll('.search-row')].find(e => (e.innerText || '').includes('Bridgeport Hauling'));
  if (r) r.click();
});
await b.page.waitForTimeout(8000);
out.navigated = b.page.url() !== urlBefore;
out.after = await recents();
out.recentsUnchanged = JSON.stringify(out.before) === JSON.stringify(out.after);
console.log('C45154 navigated again:', out.navigated, '| recents unchanged:', out.recentsUnchanged);
console.log('   before:', out.before.slice(0, 3).join(' ;; '));
console.log('   after :', out.after.slice(0, 3).join(' ;; '));

// C53587 - create a work order WITH its vehicle, then find it without reloading
out.create = await b.page.evaluate(async () => {
  const j = async (u, o) => (await fetch('https://api.staging.shopview.com' + u, Object.assign({ credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }, o))).json();
  const s = await j('/api/search?q=' + encodeURIComponent('ZZT-4471'));
  const asset = ((s.data.groups || []).find(g => g.type === 'assets') || {}).items[0];
  const wps = await j('/api/staff/my-workplaces');
  const list = wps.data || wps; const wp = (Array.isArray(list) ? list : []).find(w => /Heavy Duty/.test(w.name));
  const r = await fetch('https://api.staging.shopview.com/api/work-orders/create', { method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ company_id: '3d760beb-ee5e-4cfe-8fe5-9250ca5c4dc7', vehicle_id: asset && asset.id, workplace_id: wp && wp.id }) });
  return { status: r.status, body: await r.json().catch(() => null) };
});
console.log('C53587 create ->', out.create.status, JSON.stringify(out.create.body).slice(0, 200));
if (out.create.status < 300) {
  const id = (out.create.body.data || {}).work_order_id || (out.create.body.data || {}).id;
  const num = await b.page.evaluate(async (i) => {
    const d = await (await fetch('https://api.staging.shopview.com/api/work-orders/view/' + i, { credentials: 'include', headers: { Accept: 'application/json' } })).json();
    return ((d.data || {}).work_order || {}).number;
  }, id);
  const t0 = Date.now(); let found = false, secs = 0;
  for (let i = 0; i < 10 && !found; i++) {
    await P.openPalette(b.page, 'click');
    await P.type(b.page, num.replace(/^S-?/, ''), 2600);
    const s2 = await P.read(b.page);
    found = (s2.rows || []).some(r => r.text.includes(num.replace(/^S-/, '')));
    secs = Math.round((Date.now() - t0) / 1000);
    await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(600);
    if (!found) await b.page.waitForTimeout(2500);
  }
  out.C53587 = { number: num, found, seconds: secs };
  console.log(`C53587 new work order ${num} findable: ${found} after about ${secs}s`);
}
fs.writeFileSync('sweep-v1g.json', JSON.stringify(out, null, 1));
await b.browser.close();
