// diagQ — rule out MY harness before reporting any absence.
const { makeHarness, OUT, APP, API } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
(async () => {
  const h = await makeHarness('admin');
  const P = h.page;
  await P.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await P.waitForTimeout(11000);
  const d = {};
  d.url = P.url();
  d.anyFilterTestIds = await P.$$eval('[data-test-id]', els =>
    [...new Set(els.map(e => e.getAttribute('data-test-id')))].filter(t => /filter|chip|collapse|toggle/i.test(t)));
  d.allTestIdsSample = await P.$$eval('[data-test-id]', els =>
    [...new Set(els.map(e => e.getAttribute('data-test-id')))].slice(0, 70));
  d.pref = await L.pref(P);
  d.bodyTop = await P.evaluate(() => document.body.innerText.replace(/\s+/g,' ').slice(0, 700));
  // API shape probe
  d.apiShape = await P.evaluate(async (api) => {
    const out = {};
    const r0 = await fetch(`${api}/api/work-orders?limit=3`, { headers: { accept: 'application/json' } });
    const j0 = r0.ok ? await r0.json() : null;
    out.plain = { http: r0.status, topKeys: j0 ? Object.keys(j0) : null,
      dataKeys: j0 && j0.data && !Array.isArray(j0.data) ? Object.keys(j0.data) : (Array.isArray(j0?.data) ? 'ARRAY len ' + j0.data.length : null) };
    const r1 = await fetch(`${api}/api/work-orders?limit=1000&filters[0][field]=status&filters[0][value]=estimate`, { headers: { accept: 'application/json' } });
    const j1 = r1.ok ? await r1.json() : null;
    let arr = j1?.data?.workOrders || j1?.data || [];
    if (!Array.isArray(arr)) arr = arr?.workOrders || [];
    out.estimate = { http: r1.status, len: Array.isArray(arr) ? arr.length : 'notArray',
      firstKeys: Array.isArray(arr) && arr[0] ? Object.keys(arr[0]).slice(0, 18) : null };
    return out;
  }, API);
  fs.writeFileSync(`${OUT}/diagQ.json`, JSON.stringify(d, null, 2));
  await P.screenshot({ path: `${OUT}/diagQ.png` }).catch(()=>{});
  console.log('URL', d.url);
  console.log('filterish testids:', JSON.stringify(d.anyFilterTestIds));
  console.log('pref:', JSON.stringify(d.pref).slice(0, 300));
  console.log('apiShape:', JSON.stringify(d.apiShape));
  console.log('body:', d.bodyTop.slice(0, 400));
  console.log('sample testids:', JSON.stringify(d.allTestIdsSample).slice(0,900));
  await h.browser.close();
})();
