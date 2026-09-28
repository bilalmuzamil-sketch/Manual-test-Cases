// C55684, settled without the picker. The location is switched at the back end and the page then
// RELOADED, so the running screen genuinely holds the new location - which the header is read back
// to prove. The "never even for a moment" half is sampled every 400ms from the first keystroke.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const WP = { heavy: 'b3c8c820-f815-4cf1-8938-10956c5ee71a', leth: 'f8a8b802-7780-4b16-bf10-343caeb616b2' };
const b = await P.openStaging('/customers', 'admin');
const out = {};
const wos = s => (s.groupRows || []).filter(g => /work order/i.test(g.head)).flatMap(g => g.rows.map(r => r.slice(0, 44)));
const header = () => b.page.evaluate(() => ((document.body.innerText || '').match(/Staging [A-Za-z]+ - \d+/) || [null])[0]);
const switchTo = async (id) => b.page.evaluate(async (wid) => {
  const r = await fetch('https://api.staging.shopview.com/api/iam/change-location', {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ workplace_id: wid, workplace_timezone: 'America/Edmonton' }) });
  return r.status;
});
async function measure(label) {
  await b.page.goto('https://app.staging.shopview.com/customers', { waitUntil: 'domcontentloaded' });
  await b.page.waitForTimeout(8000);
  const h = await header();
  await P.openPalette(b.page, 'click');
  await P.type(b.page, 'Bridgepor', 150, true);          // start typing, then watch it load
  const frames = [];
  for (let i = 0; i < 12; i++) {
    frames.push(await b.page.evaluate(() => {
      const m = document.querySelector('.search-modal'); if (!m) return null;
      return [...m.querySelectorAll('.search-group')]
        .filter(g => /work order/i.test((g.querySelector('.search-group__header') || {}).innerText || ''))
        .flatMap(g => [...g.querySelectorAll('.search-row')].map(r => (r.innerText || '').replace(/\s+/g, ' ').slice(0, 30)));
    }));
    await b.page.waitForTimeout(400);
  }
  await b.page.waitForTimeout(3500);
  const s = await P.read(b.page);
  await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(700);
  return { label, header: h, wo: wos(s),
           customer: (s.groupRows || []).some(g => /customer/i.test(g.head) && g.rows.some(r => /Bridgeport Hauling/.test(r))),
           frames };
}
console.log('switch to Heavy Duty ->', await switchTo(WP.heavy));
out.heavy = await measure('Heavy Duty');
console.log(`${out.heavy.label} [header: ${out.heavy.header}] -> ${out.heavy.wo.length} work orders, customer listed: ${out.heavy.customer}`);
console.log('   ', out.heavy.wo.join(' ;; ').slice(0, 170));
console.log('switch to Lethbridge ->', await switchTo(WP.leth));
out.leth = await measure('Lethbridge');
console.log(`${out.leth.label} [header: ${out.leth.header}] -> ${out.leth.wo.length} work orders, customer listed: ${out.leth.customer}`);
console.log('   ', out.leth.wo.join(' ;; ').slice(0, 170) || '(none)');
const old = new Set(out.heavy.wo.map(s => s.split(' ')[0]));
out.leaked = [...new Set(out.leth.frames.flatMap(f => f || []).filter(r => old.has(r.split(' ')[0])))];
console.log('Heavy Duty jobs visible at ANY moment while Lethbridge loaded:', out.leaked.length ? out.leaked.join(' ;; ') : 'none');
console.log('restore ->', await switchTo(WP.heavy));
fs.writeFileSync('sweep-location2.json', JSON.stringify(out, null, 1));
await b.browser.close();
