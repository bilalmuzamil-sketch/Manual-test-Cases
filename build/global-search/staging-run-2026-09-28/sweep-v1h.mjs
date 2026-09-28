// C53587 with the payload the seeder proved works ({is_vehicle_here:false} + company + vehicle, no
// workplace), and a control for C45154: is the recent list even stable when NOTHING is done to it?
// If it changes on its own, "the record was re-added" cannot be read off a single comparison.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
const out = {};
const recents = async () => {
  await P.openPalette(b.page, 'click'); await b.page.waitForTimeout(3500);
  const r = await b.page.evaluate(() => [...document.querySelectorAll('.search-row')].map(x => (x.innerText || '').replace(/\s+/g, ' ').slice(0, 40)));
  await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(900);
  return r;
};
await b.page.goto('https://app.staging.shopview.com/customers/3d760beb-ee5e-4cfe-8fe5-9250ca5c4dc7/work-orders', { waitUntil: 'domcontentloaded' });
await b.page.waitForTimeout(8000);
out.control = { a: await recents(), b: await recents(), c: await recents() };
out.controlStable = JSON.stringify(out.control.a) === JSON.stringify(out.control.b) && JSON.stringify(out.control.b) === JSON.stringify(out.control.c);
console.log('C45154 control - three reads with nothing done in between, identical:', out.controlStable);
if (!out.controlStable) {
  console.log('   1st:', out.control.a.slice(0, 3).join(' ;; '));
  console.log('   2nd:', out.control.b.slice(0, 3).join(' ;; '));
  console.log('   3rd:', out.control.c.slice(0, 3).join(' ;; '));
}
// C53587
out.create = await b.page.evaluate(async () => {
  const j = async (u) => (await fetch('https://api.staging.shopview.com' + u, { credentials: 'include', headers: { Accept: 'application/json' } })).json();
  const s = await j('/api/search?q=' + encodeURIComponent('ZZT-4471'));
  const asset = ((s.data.groups || []).find(g => g.type === 'assets') || {}).items[0];
  const r = await fetch('https://api.staging.shopview.com/api/work-orders/create', { method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ is_vehicle_here: false, company_id: '3d760beb-ee5e-4cfe-8fe5-9250ca5c4dc7', vehicle_id: asset && asset.id }) });
  const body = await r.json().catch(() => null);
  let number = null;
  const id = body && body.data && (body.data.work_order_id || body.data.id);
  if (id) { const d = await j('/api/work-orders/view/' + id); number = ((d.data || {}).work_order || {}).number; }
  return { status: r.status, id, number };
});
console.log('C53587 create ->', JSON.stringify(out.create));
if (out.create.number) {
  const bare = out.create.number.replace(/^S-?/, '');
  const t0 = Date.now(); let found = false, secs = 0;
  for (let i = 0; i < 12 && !found; i++) {
    await P.openPalette(b.page, 'click'); await P.type(b.page, bare, 2600);
    found = ((await P.read(b.page)).rows || []).some(r => r.text.includes(bare));
    secs = Math.round((Date.now() - t0) / 1000);
    await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(600);
    if (!found) await b.page.waitForTimeout(2500);
  }
  out.C53587 = { number: out.create.number, found, seconds: secs };
  console.log(`C53587 new work order ${out.create.number} findable: ${found} after about ${secs}s`);
}
fs.writeFileSync('sweep-v1h.json', JSON.stringify(out, null, 1));
await b.browser.close();
