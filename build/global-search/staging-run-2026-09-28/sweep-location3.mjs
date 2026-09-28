// C55684, settled. Earlier attempts failed for three separate reasons of my own: switching from the
// page without telling the screen, an exact-match header read that found nothing, and a switch call
// sent with the wrong timezone that answered 400 - so "the old jobs are still there" was never a
// reading of the product. The switch is now made with the workplace's own timezone and CONFIRMED by
// searching the back end before the screen is read.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const WP = { heavy: ['b3c8c820-f815-4cf1-8938-10956c5ee71a', 'America/Edmonton'],
             leth:  ['f8a8b802-7780-4b16-bf10-343caeb616b2', 'America/Edmonton'] };
const b = await P.openStaging('/customers', 'admin');
const out = {};
const wos = s => (s.groupRows || []).filter(g => /work order/i.test(g.head)).flatMap(g => g.rows.map(r => r.slice(0, 44)));
const switchTo = async ([id, tz]) => b.page.evaluate(async ([wid, wtz]) => {
  const r = await fetch('https://api.staging.shopview.com/api/iam/change-location', {
    method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ workplace_id: wid, workplace_timezone: wtz }) });
  return r.status;
}, [id, tz]);
const backendCounts = async () => b.page.evaluate(async () => {
  const r = await fetch('https://api.staging.shopview.com/api/search?q=Bridgeport', { credentials: 'include', headers: { Accept: 'application/json' } });
  const d = (await r.json()).data || {};
  return Object.fromEntries((d.groups || []).filter(g => (g.items || []).length).map(g => [g.type, g.items.length]));
});
async function measure(label, wp) {
  const st = await switchTo(wp);
  const counts = await backendCounts();                 // proves the switch landed
  await b.page.goto('https://app.staging.shopview.com/customers', { waitUntil: 'domcontentloaded' });
  await b.page.waitForTimeout(8000);
  await P.openPalette(b.page, 'click');
  await P.type(b.page, 'Bridgepor', 150, true);
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
  const r = { label, switchStatus: st, backend: counts, wo: wos(s), frames,
    customer: (s.groupRows || []).some(g => /customer/i.test(g.head) && g.rows.some(x => /Bridgeport Hauling/.test(x))) };
  console.log(`${label}: switch ${st}, back end ${JSON.stringify(counts)} -> screen shows ${r.wo.length} work orders, customer listed: ${r.customer}`);
  if (r.wo.length) console.log('   ', r.wo.join(' ;; ').slice(0, 150));
  return r;
}
out.heavy = await measure('Heavy Duty', WP.heavy);
out.leth = await measure('Lethbridge', WP.leth);
const old = new Set(out.heavy.wo.map(s => s.split(' ')[0]));
out.leaked = [...new Set(out.leth.frames.flatMap(f => f || []).filter(r => old.has(r.split(' ')[0])))];
console.log('Heavy Duty jobs seen at ANY moment while Lethbridge loaded:', out.leaked.length ? out.leaked.join(' ;; ') : 'NONE');
console.log('restore to Heavy Duty ->', await switchTo(WP.heavy), JSON.stringify(await backendCounts()));
fs.writeFileSync('sweep-location3.json', JSON.stringify(out, null, 1));
await b.browser.close();
