// probeQ1b — RUNNABILITY walk, four Status-chip cases (C29559, C29609, C29610, C29612).
// STEPS ONLY. Expected results are neither read for judgement nor changed; HOLD stays.
const { makeHarness, OUT, APP, API } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
(async () => {
  const h = await makeHarness('admin');
  const P = h.page, R = { probe: 'Q1b', at: new Date().toISOString(), cases: {} };

  // ---- Preconditions, from the server (corrected envelope: data.work_orders)
  await P.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await P.waitForTimeout(11000);
  R.preconditionData = await P.evaluate(async (api) => {
    const o = {};
    for (const st of ['estimate','complete','approved']) {
      const r = await fetch(`${api}/api/work-orders?limit=1000&filters[0][field]=status&filters[0][value]=${st}`,{headers:{accept:'application/json'}});
      const j = r.ok ? await r.json() : null; const a = j?.data?.work_orders || [];
      o[st] = { http:r.status, workOrders:a.length, distinctCustomers:[...new Set(a.map(w=>w.companyName).filter(Boolean))].length };
    }
    return o;
  }, API);

  const tabLabel = async () => P.$$eval('[data-test-id^="tab_"]', els => els.map(e => {
    const cs = getComputedStyle(e);
    return { id:e.getAttribute('data-test-id'), domText:(e.innerText||'').trim(),
             textTransform:cs.textTransform, active:/q-tab--active/.test(e.className) };
  }));
  R.tabsOnScreen = await tabLabel();

  async function tabTo(testId) {
    const c = await L.clickSel(P, `[data-test-id="${testId}"]`);
    await P.waitForTimeout(6500);
    const bar = await L.ensureBarOpen(P);
    return { click:c, bar, url:P.url(), activeTab:(await tabLabel()).filter(t=>t.active).map(t=>t.id) };
  }

  // ============ C29559: Estimates tab still shows the other four chips ============
  {
    const c = { steps: [] };
    c.steps.push({ n:1, text:'Click the Estimates tab', ...(await tabTo('tab_estimates')) });
    const ch = await L.chips(P);
    c.steps.push({ n:2, text:'Look at the filter bar', chipCount:ch.length, chips:ch });
    const per = [];
    for (const x of ch) {
      const o = await L.openChip(P, x.id);
      per.push({ id:x.id, onScreenText:x.text, disabled:x.disabled, opacity:x.opacity,
                 opened:o.found, optionCount:o.options.length, firstOptions:o.options.slice(0,3).map(q=>q.text) });
      await L.closeMenu(P);
    }
    c.steps.push({ n:3, text:'Look at each chip in turn', perChip:per });
    R.cases.C29559 = c;
  }

  // ============ C29609 / C29610: same shape, Estimates then Completed ============
  for (const [cid, tab, tabName] of [['C29609','tab_estimates','Estimates'], ['C29610','tab_completed','Completed']]) {
    const c = { steps: [] };
    await P.goto(APP + '/workorders?tab=all', { waitUntil:'domcontentloaded', timeout:120000 });
    await P.waitForTimeout(9000); await L.ensureBarOpen(P);
    c.steps.push({ n:1, text:`Click the ${tabName} tab`, ...(await tabTo(tab)) });
    const ch = await L.chips(P);
    const st = ch.find(x=>/chip_status/.test(x.id));
    c.steps.push({ n:2, text:'Look at the filter bar and at the Status chip',
      statusChipPresent: !!st, statusChip: st || null, chipCount: ch.length, chips: ch });
    // step 3 — try to click the Status chip and change it
    const before = P.url();
    let s3;
    if (st) {
      const clk = await L.clickSel(P, `[data-test-id="${st.id}"]`, 2);
      await P.waitForTimeout(1800);
      s3 = { statusChipPresent:true, clicked:clk, optionsAppeared:await P.$$eval(L.OPT,e=>e.length).catch(()=>0),
             urlChanged:P.url()!==before };
      await L.closeMenu(P);
    } else {
      s3 = { statusChipPresent:false, executable:false,
             note:'the control this step names is not on the page at all on this tab' };
    }
    c.steps.push({ n:3, text:'Try to click the Status chip and change it', ...s3 });
    // step 4 — Customer filter, one customer
    const cu = ch.find(x=>/chip_company_id/.test(x.id));
    let s4 = { chipPresent: !!cu };
    if (cu) {
      const o = await L.openChip(P, cu.id);
      s4.opened=o.found; s4.optionCount=o.options.length;
      if (o.options.length) { s4.picked=o.options[0].text; s4.pick=await L.pickOption(P,o.options[0].id);
        s4.tickedAfter=await L.tickedCount(P); }
      await L.closeMenu(P);
    }
    c.steps.push({ n:4, text:'Open the Customer filter and select one customer', ...s4 });
    c.steps.push({ n:5, text:'Look at the table', rows:await L.rows(P), url:P.url(), chipsNow:await L.chips(P) });
    await L.clearAll(P);
    R.cases[cid] = c;
  }

  // ============ C29612: a Status choice survives a tab switch and returns on All ============
  {
    const c = { steps: [] };
    await P.goto(APP + '/workorders?tab=all', { waitUntil:'domcontentloaded', timeout:120000 });
    await P.waitForTimeout(9000);
    const bar = await L.ensureBarOpen(P);
    // step 1 — Status filter, tick Approved
    const o1 = await L.openChip(P, 'filter_chip_status');
    const appr = o1.options.find(x=>/approved/i.test(x.text) || /_approved$/.test(x.id||''));
    let s1 = { bar, statusOpened:o1.found, optionCount:o1.options.length,
               approvedOptionPresent: !!appr, approvedId: appr?appr.id:null, allOptions:o1.options.map(x=>x.text) };
    if (appr) { s1.pick = await L.pickOption(P, appr.id); s1.ticked = await L.tickedCount(P); }
    await L.closeMenu(P);
    s1.urlAfter = P.url(); s1.chipsAfter = await L.chips(P);
    c.steps.push({ n:1, text:'On the All tab, open the Status filter and tick Approved', ...s1 });
    // step 2 — Customer filter, one customer
    const o2 = await L.openChip(P, 'filter_chip_company_id');
    let s2 = { opened:o2.found, optionCount:o2.options.length };
    if (o2.options.length) { s2.picked=o2.options[0].text; s2.pick=await L.pickOption(P,o2.options[0].id);
      s2.ticked=await L.tickedCount(P); }
    await L.closeMenu(P);
    s2.urlAfter = P.url();
    c.steps.push({ n:2, text:'Open the Customer filter and select one customer', ...s2 });
    // step 3 — Estimates tab
    c.steps.push({ n:3, text:'Click the Estimates tab and look at the filter bar and the table',
      ...(await tabTo('tab_estimates')), chips: await L.chips(P), rows: await L.rows(P) });
    // step 4 — back to All
    c.steps.push({ n:4, text:'Click back to the All tab', ...(await tabTo('tab_all')) });
    // step 5 — look at Status and Customer chips
    c.steps.push({ n:5, text:'Look at the Status chip and the Customer chip',
      chips: await L.chips(P), url: P.url(), ticked: await L.tickedCount(P) });
    await L.clearAll(P);
    R.cases.C29612 = c;
  }

  R.prefAtEnd = await L.pref(P);
  fs.writeFileSync(`${OUT}/probeQ1b.json`, JSON.stringify({ ...R,
    api4xx:h.apiLog.filter(a=>a.s>=400), bridgeErrors:h.bridgeErrors, apiCalls:h.apiLog.length }, null, 2));
  console.log('PRECOND', JSON.stringify(R.preconditionData));
  console.log('TABS', JSON.stringify(R.tabsOnScreen.map(t=>t.id+'="'+t.domText+'" tt='+t.textTransform)));
  for (const k of Object.keys(R.cases)) { console.log('===',k);
    for (const s of R.cases[k].steps) console.log('  ', JSON.stringify(s).slice(0,600)); }
  console.log('bridgeErrors', h.bridgeErrors.length, '4xx', JSON.stringify(h.apiLog.filter(a=>a.s>=400).slice(0,5)));
  await h.browser.close();
})();
