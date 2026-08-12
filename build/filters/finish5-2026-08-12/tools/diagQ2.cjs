const { makeHarness, OUT, APP, API } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
(async () => {
  const h = await makeHarness('admin');
  const P = h.page;
  const d = { stages: [] };
  async function snap(tag) {
    const chips = await L.chips(P);
    const tabs = await P.$$eval('[data-test-id^="tab_"]', els => els.map(e => ({
      id: e.getAttribute('data-test-id'), text: (e.innerText||'').trim(),
      sel: e.getAttribute('aria-selected'), cls: /q-tab--active/.test(e.className) })));
    d.stages.push({ tag, url: P.url(), chipCount: chips.length,
      chipIds: chips.map(c=>c.id), togglepresent: !!(await P.$('[data-test-id="toggle_filter_bar"]')),
      activeTab: tabs.filter(t=>t.cls||t.sel==='true').map(t=>t.id), tabs: tabs.map(t=>t.id+':'+t.text) });
    return chips;
  }
  await P.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await P.waitForTimeout(11000);
  await snap('landed-all');
  // click Estimates via its OWN test-id
  const c1 = await L.clickSel(P, '[data-test-id="tab_estimates"]');
  await P.waitForTimeout(6000);
  d.estClick = c1;
  await snap('after-tab_estimates-click');
  d.ensure1 = await L.ensureBarOpen(P);
  await P.waitForTimeout(2000);
  await snap('after-ensureBarOpen');
  // direct URL route
  await P.goto(APP + '/workorders?tab=estimate', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await P.waitForTimeout(11000);
  await snap('direct-url-tab=estimate');
  d.pref = await L.pref(P);
  // corrected API shape
  d.api = await P.evaluate(async (api) => {
    const out = {};
    for (const st of ['estimate','complete','approved','declined']) {
      const r = await fetch(`${api}/api/work-orders?limit=1000&filters[0][field]=status&filters[0][value]=${st}`, {headers:{accept:'application/json'}});
      const j = r.ok ? await r.json() : null;
      const arr = j?.data?.work_orders || [];
      out[st] = { http: r.status, len: arr.length,
        customers: [...new Set(arr.map(w=>w.companyName||w.company_name).filter(Boolean))].length };
    }
    return out;
  }, API);
  fs.writeFileSync(`${OUT}/diagQ2.json`, JSON.stringify(d,null,2));
  d.stages.forEach(s=>console.log(JSON.stringify(s)));
  console.log('estClick',JSON.stringify(d.estClick),'ensure1',JSON.stringify(d.ensure1));
  console.log('api',JSON.stringify(d.api));
  console.log('prefValue', JSON.stringify(d.pref.value?.filters), 'collapsed', JSON.stringify(d.pref.value?.collapsed));
  await h.browser.close();
})();
