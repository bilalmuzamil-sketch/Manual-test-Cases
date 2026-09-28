// C55684 redone. The first attempt switched location by calling the back end from the page, which
// moves the session but never tells the running screen - so "the old records are still listed" was
// a fact about my shortcut, not about the product. This one clicks the location picker.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
const out = {};
const wos = s => (s.groupRows || []).filter(g => /work order/i.test(g.head)).flatMap(g => g.rows.map(r => r.slice(0, 44)));

await b.page.waitForTimeout(6000);
await P.openPalette(b.page, 'click');
await P.type(b.page, 'Bridgeport', 3600);
out.heavyDuty = wos(await P.read(b.page));
console.log('on Heavy Duty:', out.heavyDuty.length, 'work orders');
await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(800);

// find and open the location picker in the header
out.picker = await b.page.evaluate(() => {
  const t = e => ((e && e.innerText) || '').replace(/\s+/g, ' ').trim();
  const el = [...document.querySelectorAll('button,[role="button"],.q-item,div,span')]
    .filter(e => /Staging Heavy Duty/i.test(t(e)) && t(e).length < 60);
  const pick = el[el.length - 1];
  if (!pick) return null;
  pick.click();
  return { text: t(pick), cls: String(pick.className).slice(0, 70) };
});
await b.page.waitForTimeout(3000);
out.menu = await b.page.evaluate(() => [...document.querySelectorAll('.q-menu *, [role="menu"] *, .q-dialog *')]
  .map(e => ((e.innerText || '')).replace(/\s+/g, ' ').trim()).filter(x => /Lethbridge|Heavy Duty|QB Location/i.test(x) && x.length < 60).slice(0, 8));
console.log('picker:', JSON.stringify(out.picker), '\nmenu offers:', JSON.stringify(out.menu));
out.switched = await b.page.evaluate(() => {
  const e = [...document.querySelectorAll('.q-menu *, [role="menu"] *, .q-dialog *, .q-item')]
    .filter(x => /Lethbridge/i.test((x.innerText || '')) && (x.innerText || '').trim().length < 60);
  const pick = e[e.length - 1]; if (!pick) return false; pick.click(); return true;
});
await b.page.waitForTimeout(9000);
out.headerNow = await b.page.evaluate(() => (document.body.innerText || '').match(/Staging [A-Za-z]+ - \d+/g) || []);
console.log('clicked Lethbridge:', out.switched, '| header now says:', JSON.stringify(out.headerNow));

// PROVE the switch landed before reading anything into the result
if (out.switched && out.headerNow.some(h => /Lethbridge/i.test(h))) {
  await P.openPalette(b.page, 'click');
  await P.type(b.page, 'Bridgepor', 200, true);
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
  const after = await P.read(b.page);
  out.lethbridge = wos(after);
  out.customersStillThere = (after.groupRows || []).some(g => /customer/i.test(g.head) && g.rows.some(r => /Bridgeport Hauling/.test(r)));
  const old = new Set(out.heavyDuty.map(s => s.split(' ')[0]));
  out.leaked = [...new Set(frames.flatMap(f => f || []).filter(r => old.has(r.split(' ')[0])))];
  console.log('on Lethbridge:', out.lethbridge.length, 'work orders', out.lethbridge.join(' ;; ').slice(0, 160));
  console.log('customer itself still listed:', out.customersStillThere);
  console.log('old ones flashing up mid-load:', out.leaked.length ? out.leaked.join(' ;; ') : 'none');
  await b.page.keyboard.press('Escape');
}
// put the session back where it was
await b.page.waitForTimeout(1500);
await b.page.evaluate(() => {
  const t = e => ((e && e.innerText) || '').replace(/\s+/g, ' ').trim();
  const el = [...document.querySelectorAll('button,[role="button"],.q-item,div,span')].filter(e => /Staging Lethbridge/i.test(t(e)) && t(e).length < 60);
  if (el.length) el[el.length - 1].click();
});
await b.page.waitForTimeout(2500);
await b.page.evaluate(() => {
  const e = [...document.querySelectorAll('.q-menu *, [role="menu"] *, .q-item')].filter(x => /Heavy Duty/i.test(x.innerText || '') && (x.innerText || '').trim().length < 60);
  if (e.length) e[e.length - 1].click();
});
await b.page.waitForTimeout(8000);
out.restored = await b.page.evaluate(() => (document.body.innerText || '').match(/Staging [A-Za-z]+ - \d+/g) || []);
console.log('restored to:', JSON.stringify(out.restored));
fs.writeFileSync('sweep-location.json', JSON.stringify(out, null, 1));
await b.browser.close();
