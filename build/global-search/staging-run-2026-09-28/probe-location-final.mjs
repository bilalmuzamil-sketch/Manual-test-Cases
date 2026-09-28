// Is the screen showing the other location's jobs, or just a cached answer for a query already
// typed? A query never typed in this browser settles it.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const WP = { heavy: 'b3c8c820-f815-4cf1-8938-10956c5ee71a', leth: 'f8a8b802-7780-4b16-bf10-343caeb616b2' };
const b = await P.openStaging('/customers', 'admin');
const sw = async (id) => b.page.evaluate(async (wid) => (await fetch('https://api.staging.shopview.com/api/iam/change-location', {
  method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify({ workplace_id: wid, workplace_timezone: 'America/Edmonton' }) })).status, id);
const be = async (q) => b.page.evaluate(async (qq) => {
  const d = (await (await fetch('https://api.staging.shopview.com/api/search?q=' + encodeURIComponent(qq), { credentials: 'include', headers: { Accept: 'application/json' } })).json()).data || {};
  return Object.fromEntries((d.groups || []).filter(g => (g.items || []).length).map(g => [g.type, g.items.length]));
}, q);
const out = {};
console.log('switch to Lethbridge ->', await sw(WP.leth));
await b.page.goto('https://app.staging.shopview.com/customers', { waitUntil: 'domcontentloaded' });
await b.page.waitForTimeout(8000);
for (const q of ['ZZT-4471', 'Kestrelway', 'ZZAUTOTEST Bridgeport Hauling']) {   // none typed before in this browser
  const backend = await be(q);
  await P.openPalette(b.page, 'click');
  await P.type(b.page, q, 4000);
  const s = await P.read(b.page);
  const screenWo = (s.groupRows || []).filter(g => /work order/i.test(g.head)).flatMap(g => g.rows.map(r => r.slice(0, 40)));
  out[q] = { backend, screenWo, groups: (s.groupRows || []).map(g => g.head) };
  console.log(`"${q}"  back end ${JSON.stringify(backend)}  |  screen groups: ${out[q].groups.join(', ')}`);
  if (screenWo.length) console.log('     screen work orders:', screenWo.join(' ;; ').slice(0, 150));
  await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(700);
}
console.log('restore ->', await sw(WP.heavy));
fs.writeFileSync('probe-location-final.json', JSON.stringify(out, null, 1));
await b.browser.close();
