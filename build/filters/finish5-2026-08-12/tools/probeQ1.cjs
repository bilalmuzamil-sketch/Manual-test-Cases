// probeQ1 — RUNNABILITY walk of the four Status-chip cases held on Branko's confirmation.
// C29559, C29609, C29610, C29612.  STEPS ONLY.  Their expected results are NOT read here
// and are NOT to be changed; the HOLD stays.  What is being established is only whether a
// tester can execute the steps exactly as written.
const { makeHarness, OUT, APP } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');

(async () => {
  const h = await makeHarness('admin');
  const R = { probe: 'Q1', at: new Date().toISOString(), cases: {} };
  const P = h.page;

  // ---- Precondition data check: do Estimate and Complete work orders exist, for >=2 customers?
  async function dataCheck() {
    return P.evaluate(async (api) => {
      const out = {};
      for (const st of ['estimate', 'complete', 'approved']) {
        const u = `${api}/api/work-orders?limit=1000&filters[0][field]=status&filters[0][value]=${st}`;
        const r = await fetch(u, { headers: { accept: 'application/json' } });
        const j = r.ok ? await r.json() : null;
        const rows = (j && (j.data?.workOrders || j.data || [])) || [];
        const arr = Array.isArray(rows) ? rows : [];
        const cust = [...new Set(arr.map(w => w.companyName).filter(Boolean))];
        out[st] = { http: r.status, count: arr.length, distinctCustomers: cust.length, sample: cust.slice(0, 3) };
      }
      return out;
    }, 'https://sv8785api.qa.shopview.com');
  }

  await P.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await P.waitForTimeout(9000);
  R.dataCheck = await dataCheck();

  // Tabs, as the tester reads them (computed style, not textContent)
  R.tabs = await P.$$eval('[role="tab"], .q-tab', els => els.map(e => {
    const cs = getComputedStyle(e);
    let t = (e.innerText || '').replace(/\s+/g, ' ').trim();
    return { domText: t, transform: cs.textTransform, id: e.getAttribute('data-test-id'),
             ariaSelected: e.getAttribute('aria-selected') };
  }));

  async function goTab(name) {
    // click the tab whose visible text matches
    const ok = await P.evaluate((n) => {
      const els = [...document.querySelectorAll('[role="tab"], .q-tab')];
      const t = els.find(e => (e.innerText || '').replace(/\s+/g, ' ').trim().toLowerCase().includes(n.toLowerCase()));
      if (!t) return false; t.click(); return true;
    }, name);
    await P.waitForTimeout(5000);
    return ok;
  }

  // ================= C29559 : Estimates tab shows the other four chips =================
  {
    const c = { steps: [] };
    c.steps.push({ n: 1, text: 'Click the Estimates tab', ok: await goTab('Estimates'), url: P.url() });
    await L.ensureBarOpen(P);
    const ch = await L.chips(P);
    c.steps.push({ n: 2, text: 'Look at the filter bar', chipCount: ch.length, chips: ch });
    // step 3: look at each chip in turn -> can each be opened?
    const per = [];
    for (const x of ch) {
      const o = await L.openChip(P, x.id);
      per.push({ id: x.id, text: x.text, disabled: x.disabled, opened: o.found, optionCount: o.options.length,
                 firstOptions: o.options.slice(0, 4).map(q => q.text) });
      await L.closeMenu(P);
    }
    c.steps.push({ n: 3, text: 'Look at each chip in turn', perChip: per });
    R.cases.C29559 = c;
  }

  // ================= C29609 : Estimates tab, Status greyed + Customer works =================
  {
    const c = { steps: [] };
    await L.goWO(P, '?tab=all'); await P.waitForTimeout(4000);
    c.steps.push({ n: 1, text: 'Click the Estimates tab', ok: await goTab('Estimates'), url: P.url() });
    await L.ensureBarOpen(P);
    const ch = await L.chips(P);
    const st = ch.find(x => /status/i.test(x.id));
    c.steps.push({ n: 2, text: 'Look at the filter bar and at the Status chip', statusChip: st, allChips: ch });
    // step 3: try to click the Status chip and change it
    const before = P.url();
    const clk = await L.clickSel(P, `[data-test-id="${st ? st.id : 'filter_chip_status'}"]`, 2);
    await P.waitForTimeout(1800);
    const menuOpen = await P.$$eval(L.OPT, e => e.length).catch(() => 0);
    c.steps.push({ n: 3, text: 'Try to click the Status chip and change it', clickAttempt: clk,
                   optionsAppeared: menuOpen, urlChanged: P.url() !== before });
    await L.closeMenu(P);
    // step 4: open Customer filter, select one customer
    const cu = ch.find(x => /customer/i.test(x.id));
    let s4 = { chipPresent: !!cu };
    if (cu) {
      const o = await L.openChip(P, cu.id);
      s4.opened = o.found; s4.optionCount = o.options.length;
      if (o.options.length) {
        const pick = o.options[0];
        s4.picked = pick.text;
        s4.pick = await L.pickOption(P, pick.id);
        s4.tickedAfter = await L.tickedCount(P);
      }
      await L.closeMenu(P);
    }
    c.steps.push({ n: 4, text: 'Open the Customer filter and select one customer', ...s4 });
    c.steps.push({ n: 5, text: 'Look at the table', rows: await L.rows(P), chipsNow: await L.chips(P), url: P.url() });
    await L.clearAll(P);
    R.cases.C29609 = c;
  }

  // ================= C29610 : Completed tab, same shape =================
  {
    const c = { steps: [] };
    await L.goWO(P, '?tab=all'); await P.waitForTimeout(4000);
    c.steps.push({ n: 1, text: 'Click the Completed tab', ok: await goTab('Completed'), url: P.url() });
    await L.ensureBarOpen(P);
    const ch = await L.chips(P);
    const st = ch.find(x => /status/i.test(x.id));
    c.steps.push({ n: 2, text: 'Look at the filter bar and at the Status chip', statusChip: st, allChips: ch });
    const before = P.url();
    const clk = await L.clickSel(P, `[data-test-id="${st ? st.id : 'filter_chip_status'}"]`, 2);
    await P.waitForTimeout(1800);
    const menuOpen = await P.$$eval(L.OPT, e => e.length).catch(() => 0);
    c.steps.push({ n: 3, text: 'Try to click the Status chip and change it', clickAttempt: clk,
                   optionsAppeared: menuOpen, urlChanged: P.url() !== before });
    await L.closeMenu(P);
    const cu = ch.find(x => /customer/i.test(x.id));
    let s4 = { chipPresent: !!cu };
    if (cu) {
      const o = await L.openChip(P, cu.id);
      s4.opened = o.found; s4.optionCount = o.options.length;
      if (o.options.length) { const pick = o.options[0]; s4.picked = pick.text;
        s4.pick = await L.pickOption(P, pick.id); s4.tickedAfter = await L.tickedCount(P); }
      await L.closeMenu(P);
    }
    c.steps.push({ n: 4, text: 'Open the Customer filter and select one customer', ...s4 });
    c.steps.push({ n: 5, text: 'Look at the table', rows: await L.rows(P), chipsNow: await L.chips(P), url: P.url() });
    await L.clearAll(P);
    R.cases.C29610 = c;
  }

  fs.writeFileSync(`${OUT}/probeQ1.json`, JSON.stringify({ ...R, api4xx: h.apiLog.filter(a => a.s >= 400),
    bridgeErrors: h.bridgeErrors, apiCount: h.apiLog.length }, null, 2));
  console.log('dataCheck', JSON.stringify(R.dataCheck));
  console.log('tabs', JSON.stringify(R.tabs.map(t => t.domText + '|' + t.transform)));
  for (const k of Object.keys(R.cases)) {
    console.log('---', k);
    for (const s of R.cases[k].steps) console.log('  ', JSON.stringify(s).slice(0, 460));
  }
  console.log('bridgeErrors', h.bridgeErrors.length, 'api4xx', JSON.stringify(h.apiLog.filter(a => a.s >= 400).slice(0, 6)));
  await h.browser.close();
})();
