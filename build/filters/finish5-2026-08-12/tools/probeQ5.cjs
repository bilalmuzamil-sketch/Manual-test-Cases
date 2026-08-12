// probeQ5 — drive the INTERACTIVE halves of the Parts/Reports steps that probeQ4 could only
// enumerate: does picking a value narrow the list, does multi-select work, does the Credits
// tab carry its own bar, does a Date Range chip open a real panel, and C43562's
// collapse / return / shared-URL / phone sequence.
const { makeHarness, OUT, APP } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
(async () => {
  const h = await makeHarness('admin');
  const P = h.page, R = { probe:'Q5', at:new Date().toISOString() };

  const go = async (p, w=11000) => { await P.goto(APP+p,{waitUntil:'domcontentloaded',timeout:120000});
                                     await P.waitForTimeout(w); await L.ensureBarOpen(P); };
  const rowCount = () => P.evaluate(()=>document.querySelectorAll('tbody tr').length);
  const chipTexts = () => P.$$eval('[data-test-id^="filter_chip_"]',els=>els.map(e=>
    (e.innerText||'').replace(/\s+/g,' ').replace(/\s*keyboard_arrow_down$/,'').trim()));

  // ---------- C38906 / C38907: pick a value on Inventory; then multi-select; then clear ----------
  {
    const s = {};
    await go('/parts/inventory');
    s.startRows = await rowCount(); s.startUrl = P.url(); s.startChips = await chipTexts();
    // clear the bin-location default first, through the control a tester uses
    const ca = await L.clearAll(P); await P.waitForTimeout(2500);
    s.afterClearFilters = { click: ca, rows: await rowCount(), url: P.url(), chips: await chipTexts() };
    // step: open Category and pick ONE value
    const o = await L.openChip(P,'filter_chip_category');
    s.categoryOptions = o.options.length;
    const pick1 = o.options.find(x=>x.text && !/uncategor/i.test(x.text)) || o.options[1];
    s.picked1 = pick1.text;
    await L.pickOption(P, pick1.id); await P.waitForTimeout(2500);
    s.afterOne = { ticked: await L.tickedCount(P), rows: await rowCount(), url: P.url() };
    // step: pick a SECOND value (multi-select)
    const o2 = await P.$$eval(L.OPT, els=>els.map(e=>({id:e.getAttribute('data-test-id'),
      text:(e.innerText||'').replace(/\s+/g,' ').trim()})));
    const pick2 = o2.find(x=>x.id!==pick1.id && x.text && !/uncategor/i.test(x.text));
    s.picked2 = pick2 ? pick2.text : null;
    if (pick2) { await L.pickOption(P, pick2.id); await P.waitForTimeout(2500); }
    s.afterTwo = { ticked: await L.tickedCount(P), rows: await rowCount(), url: P.url() };
    s.chipTextWithTwo = await chipTexts();
    // step: Clear Selection inside the menu
    s.clearSelection = await L.clearSelection(P);
    await P.waitForTimeout(2200);
    s.afterClearSelection = { ticked: await L.tickedCount(P), rows: await rowCount(), url: P.url() };
    await L.closeMenu(P);
    s.clearFiltersControlPresent = !!(await P.$('[data-test-id="clear_filters"]'));
    R.partsInteract = s;
    console.log('PARTS pick/multi/clear:', JSON.stringify(s).slice(0,900));
  }

  // ---------- C38904 step 5: the Credits tab and its own filter bar ----------
  {
    const s = {};
    await go('/parts/returns');
    s.returnsTabChips = await chipTexts();
    s.tabs = await P.$$eval('[role="tab"], .q-tab', els=>els.map(e=>({id:e.getAttribute('data-test-id'),
      text:(e.innerText||'').replace(/\s+/g,' ').trim(), active:/q-tab--active/.test(e.className)}))
      .filter(t=>!/^(report_nav|parts_nav)/.test(t.id||'')));
    const cr = s.tabs.find(t=>/credit/i.test(t.text));
    if (cr) {
      const ok = await P.evaluate(({id,txt})=>{const els=[...document.querySelectorAll('[role="tab"], .q-tab')];
        const t = (id&&document.querySelector(`[data-test-id="${id}"]`)) || els.find(e=>(e.innerText||'').trim().toLowerCase().includes(txt.toLowerCase()));
        if(!t) return false; t.click(); return true;}, {id:cr.id, txt:'Credits'});
      await P.waitForTimeout(7000); await L.ensureBarOpen(P);
      s.creditsClicked = ok; s.creditsUrl = P.url(); s.creditsTabChips = await chipTexts();
      s.creditsRows = await rowCount();
    }
    R.creditsTab = s;
    console.log('CREDITS TAB:', JSON.stringify(s).slice(0,700));
  }

  // ---------- C38909 step 9 / C38882: does a Date Range chip open a real panel? ----------
  {
    const s = {};
    await go('/reports/punch-clock-activities');
    s.chipsBefore = await chipTexts();
    await L.clickSel(P,'[data-test-id="filter_chip_range"]');
    await P.waitForTimeout(2500);
    s.panel = await P.evaluate(()=>{
      const m=document.querySelector('.q-menu'); if(!m) return {menu:false};
      return { menu:true, text:(m.innerText||'').replace(/\s+/g,' ').slice(0,420),
        optionish:[...m.querySelectorAll('div,li,button')].map(e=>(e.innerText||'').trim())
          .filter(t=>t&&t.length<26).slice(0,24),
        hasCustom:/custom/i.test(m.innerText||''), hasClear:/clear/i.test(m.innerText||''),
        inputs:[...m.querySelectorAll('input')].map(i=>i.getAttribute('placeholder')||i.getAttribute('aria-label')||i.type) };
    });
    await L.closeMenu(P);
    R.dateRangePanel = s;
    console.log('DATE PANEL:', JSON.stringify(s).slice(0,900));
  }

  // ---------- C38910: pick a Reports filter value and watch the table ----------
  {
    const s = {};
    await go('/reports/sales');
    s.startRows = await rowCount(); s.startUrl = P.url(); s.chips = await chipTexts();
    const o = await L.openChip(P,'filter_chip_company_id');
    s.customerOptions = o.options.length;
    if (o.options.length) { s.picked = o.options[0].text; await L.pickOption(P, o.options[0].id);
      await P.waitForTimeout(3000); }
    await L.closeMenu(P);
    s.after = { rows: await rowCount(), url: P.url(), chips: await chipTexts() };
    R.reportsInteract = s;
    console.log('REPORTS pick:', JSON.stringify(s).slice(0,600));
  }

  // ---------- C38911: Notes / Mention, tick two ----------
  {
    const s = {};
    await go('/reports/notes-report');
    s.chips = await chipTexts(); s.startRows = await rowCount();
    const men = await P.$$eval('[data-test-id^="filter_chip_"]',els=>els.map(e=>({id:e.getAttribute('data-test-id'),
      t:(e.innerText||'').replace(/\s+/g,' ')})));
    const m = men.find(x=>/mention/i.test(x.t));
    if (m) { const o = await L.openChip(P, m.id); s.mentionOptions=o.options.length;
      const a=o.options[0], b=o.options.find(x=>x.id!==a.id);
      s.tickA=a.text; await L.pickOption(P,a.id); await P.waitForTimeout(2200);
      s.afterA={ticked:await L.tickedCount(P), rows:await rowCount(), url:P.url()};
      if(b){ s.tickB=b.text; await L.pickOption(P,b.id); await P.waitForTimeout(2200);
        s.afterB={ticked:await L.tickedCount(P), rows:await rowCount(), url:P.url()};}
      await L.closeMenu(P);
    }
    // and the named-but-checked alternative: A/R Aging Detail's chips
    await go('/reports/ar-aging-detail');
    s.arAgingDetailChips = await chipTexts();
    R.notesMention = s;
    console.log('NOTES mention:', JSON.stringify(s).slice(0,800));
  }

  fs.writeFileSync(`${OUT}/probeQ5.json`, JSON.stringify({...R, bridgeErrors:h.bridgeErrors,
    api4xx:h.apiLog.filter(a=>a.s>=400)},null,2));
  console.log('bridgeErrors', h.bridgeErrors.length, '4xx', JSON.stringify(h.apiLog.filter(a=>a.s>=400).slice(0,6)));
  await h.browser.close();
})();
