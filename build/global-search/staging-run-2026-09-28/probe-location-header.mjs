// THE missing control: after switching at the back end and reloading, which location does the
// SCREEN believe it is on? If it still says Heavy Duty, then it is showing Heavy Duty's jobs quite
// correctly and the whole finding is about my shortcut, not the product.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const WP = { heavy: 'b3c8c820-f815-4cf1-8938-10956c5ee71a', leth: 'f8a8b802-7780-4b16-bf10-343caeb616b2' };
const b = await P.openStaging('/customers', 'admin');
const sw = async (id) => b.page.evaluate(async (wid) => (await fetch('https://api.staging.shopview.com/api/iam/change-location', {
  method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify({ workplace_id: wid, workplace_timezone: 'America/Edmonton' }) })).status, id);
const readHeader = () => b.page.evaluate(() => {
  const body = (document.body.innerText || '').replace(/\s+/g, ' ');
  const m = body.match(/Staging [A-Za-z ]+ - \d+/g) || [];
  const store = {};
  try { for (const k of Object.keys(localStorage)) if (/work|place|location|shop/i.test(k)) store[k] = String(localStorage.getItem(k)).slice(0, 120); } catch {}
  return { matches: m, headerSnippet: body.slice(0, 200), store };
});
const out = {};
console.log('switch to Lethbridge ->', await sw(WP.leth));
await b.page.goto('https://app.staging.shopview.com/customers', { waitUntil: 'domcontentloaded' });
await b.page.waitForTimeout(9000);
out.afterSwitch = await readHeader();
console.log('screen says location:', JSON.stringify(out.afterSwitch.matches), '\n  header text:', out.afterSwitch.headerSnippet.slice(0, 160));
console.log('  stored workplace keys:', JSON.stringify(out.afterSwitch.store).slice(0, 300));
console.log('restore ->', await sw(WP.heavy));
await b.page.goto('https://app.staging.shopview.com/customers', { waitUntil: 'domcontentloaded' });
await b.page.waitForTimeout(9000);
out.restored = await readHeader();
console.log('after restoring, screen says:', JSON.stringify(out.restored.matches));
fs.writeFileSync('probe-location-header.json', JSON.stringify(out, null, 1));
await b.browser.close();
