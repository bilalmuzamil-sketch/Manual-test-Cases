const { makeHarness, OUT, APP } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
(async () => {
  const h = await makeHarness('admin');
  const P = h.page, R = { at:new Date().toISOString(), roots:{} };
  for (const root of ['/parts','/reports']) {
    await P.goto(APP + root, { waitUntil:'domcontentloaded', timeout:120000 });
    await P.waitForTimeout(12000);
    R.roots[root] = {
      landedOn: P.url(),
      tabs: await P.$$eval('[role="tab"], .q-tab, [data-test-id^="tab_"]', els=>els.map(e=>({
        id:e.getAttribute('data-test-id'), text:(e.innerText||'').replace(/\s+/g,' ').trim(),
        active:/q-tab--active/.test(e.className), href:e.getAttribute('href')||null }))),
      links: await P.$$eval('a[href]', els=>[...new Set(els.map(e=>((e.innerText||'').replace(/\s+/g,' ').trim()+'||'+e.getAttribute('href'))))].slice(0,120)),
      body: await P.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,1500)),
      chipIds: await P.$$eval('[data-test-id]', els=>[...new Set(els.map(e=>e.getAttribute('data-test-id')))].filter(t=>/filter|chip|search|tab_/.test(t)))
    };
    await P.screenshot({ path:`${OUT}/root${root.replace('/','-')}.png` }).catch(()=>{});
  }
  fs.writeFileSync(`${OUT}/probeQ3.json`, JSON.stringify({...R,bridgeErrors:h.bridgeErrors},null,2));
  for (const k of Object.keys(R.roots)) {
    const r=R.roots[k];
    console.log('=== ',k,'->',r.landedOn);
    console.log('  TABS:', JSON.stringify(r.tabs.map(t=>(t.id||'')+':'+t.text)));
    console.log('  chipIds:', JSON.stringify(r.chipIds).slice(0,500));
    console.log('  BODY:', r.body.slice(0,900));
    console.log('  LINKS:', JSON.stringify(r.links.filter(l=>/part|report|invoice|vendor|return|catalog|order|inventory|timesheet|note|remind|tax|aging|efficien|sales/i.test(l))).slice(0,1400));
  }
  console.log('bridge',h.bridgeErrors.length);
  await h.browser.close();
})();
