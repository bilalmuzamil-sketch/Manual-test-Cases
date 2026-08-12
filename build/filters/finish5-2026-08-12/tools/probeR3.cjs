// probeR3 — (a) C43562 steps 4 (shared URL in a fresh window) and 5 (phone);
//           (b) LIVE verification of what the four already-held cases are actually blocked on,
//               so each hold reason is evidence-backed rather than quoted from its own text.
const { makeHarness, OUT, APP } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
const chips = p => p.$$eval('[data-test-id^="filter_chip_"]', els => els.map(e =>
  (e.innerText||'').replace(/\s+/g,' ').replace(/\s*keyboard_arrow_down$/,'').trim()));
(async () => {
  const R = { probe:'R3', at:new Date().toISOString() };

  // ---------- (a) C43562 step 4: set a filter, copy the URL, open it in a FRESH window
  {
    const h = await makeHarness('admin'); const P = h.page;
    await P.goto(APP+'/parts/inventory',{waitUntil:'domcontentloaded',timeout:120000});
    await P.waitForTimeout(11000); await L.ensureBarOpen(P);
    const o = await L.openChip(P,'filter_chip_category');
    const pick = o.options.find(x=>/brake/i.test(x.text)) || o.options[1];
    await L.pickOption(P,pick.id); await P.waitForTimeout(3000); await L.closeMenu(P);
    const sharedUrl = P.url();
    const srcRows = await P.evaluate(()=>document.querySelectorAll('tbody tr').length);
    await h.browser.close();
    const h2 = await makeHarness('admin'); const P2 = h2.page;
    await P2.goto(sharedUrl,{waitUntil:'domcontentloaded',timeout:120000});
    await P2.waitForTimeout(12000); await L.ensureBarOpen(P2);
    R.c43562_step4 = { sharedUrl, sourceRows:srcRows, freshWindowRows:await P2.evaluate(()=>document.querySelectorAll('tbody tr').length),
      freshWindowChips:await chips(P2), landedOn:P2.url(), picked:pick.text };
    await h2.browser.close();
    console.log('C43562 step4 sharedURL:', JSON.stringify(R.c43562_step4).slice(0,520));
  }

  // ---------- (a) C43562 step 5: the same Parts page at phone size
  {
    const h = await makeHarness('admin', { width:390, height:844 }); const P = h.page;
    await P.goto(APP+'/parts/inventory',{waitUntil:'domcontentloaded',timeout:120000});
    await P.waitForTimeout(12000);
    const s = { viewport:'390x844' };
    s.chipsRaw = await P.$$eval('[data-test-id^="filter_chip_"]', els=>els.map(e=>{
      const r=e.getBoundingClientRect(); const cs=getComputedStyle(e);
      return { id:e.getAttribute('data-test-id'), text:(e.innerText||'').replace(/\s+/g,' ').trim(),
        x:Math.round(r.x), y:Math.round(r.y), w:Math.round(r.width), visible:cs.display!=='none' };}));
    s.horizontallyScrollable = await P.evaluate(()=>{
      const c=[...document.querySelectorAll('*')].find(e=>e.querySelector('[data-test-id^="filter_chip_"]')
        && e.scrollWidth>e.clientWidth+8);
      return c? { tag:c.tagName, scrollWidth:c.scrollWidth, clientWidth:c.clientWidth } : null; });
    s.toggleBar = !!(await P.$('[data-test-id="toggle_filter_bar"]'));
    // apply a filter on the phone
    if (s.chipsRaw.length) {
      const o = await L.openChip(P, s.chipsRaw.find(c=>/category/.test(c.id))?.id || s.chipsRaw[0].id);
      s.opened = o.found; s.optionCount = o.options.length;
      s.sheetShape = await P.evaluate(()=>{ const m=document.querySelector('.q-menu,.q-dialog');
        if(!m) return null; const r=m.getBoundingClientRect();
        return { cls:m.className.slice(0,60), x:Math.round(r.x), y:Math.round(r.y),
          w:Math.round(r.width), h:Math.round(r.height),
          hasApply:/apply/i.test(m.innerText||'') }; });
      if (o.options.length) { const p2=o.options.find(x=>/brake/i.test(x.text))||o.options[1];
        const before=P.url(); await L.pickOption(P,p2.id); await P.waitForTimeout(3000);
        s.appliedImmediately = P.url()!==before; s.urlAfter=P.url(); }
      await L.closeMenu(P);
    }
    R.c43562_step5_phone = s;
    await P.screenshot({path:`${OUT}/c43562-phone-parts.png`}).catch(()=>{});
    await h.browser.close();
    console.log('C43562 step5 phone:', JSON.stringify(s).slice(0,650));
  }

  // ---------- (b) live conditions behind the four held cases
  {
    const h = await makeHarness('admin'); const P = h.page;
    const surfaces = [
      ['Parts/Inventory','/parts/inventory'], ['Parts/Part Sales','/parts/part-sales'],
      ['Parts/Catalog','/parts/parts-catalogue'], ['Parts/Returns','/parts/returns'],
      ['Parts/Purchase Orders','/parts/orders'], ['Parts/Vendor Invoices','/parts/deliveries'],
      ['Parts/Vendors','/parts/vendors'],
      ['Rep/Timesheet Activities','/reports/punch-clock-activities'], ['Rep/Sales','/reports/sales'],
      ['Rep/Shop Efficiency','/reports/shop-billing-efficiency'], ['Rep/Sales Tax','/reports/sales-tax'],
      ['Rep/Notes','/reports/notes-report'], ['Rep/Reminders','/reports/reminders-report'],
      ['Rep/AR Aging Detail','/reports/ar-aging-detail'], ['Rep/Technician Efficiency','/reports/technician-efficiency'],
      ['Rep/Advisor Analysis','/reports/service-advisor-analysis'], ['Rep/IBS Batches','/reports/batch-transactions'],
    ];
    const out=[];
    for (const [n,p] of surfaces) {
      await P.goto(APP+p,{waitUntil:'domcontentloaded',timeout:120000}); await P.waitForTimeout(9000);
      const rec = { name:n, path:p, landedOn:P.url(),
        pageSearch: !!(await P.$('[data-test-id="page_search_toggle"]')),
        filterBar: (await P.$$('[data-test-id^="filter_chip_"]')).length,
        innerTabs: await P.$$eval('[role="tab"], .q-tab', els=>els.map(e=>({
          id:e.getAttribute('data-test-id'), t:(e.innerText||'').replace(/\s+/g,' ').trim() }))
          .filter(t=>!/^(report_nav|parts_nav)/.test(t.id||''))) };
      out.push(rec);
      console.log(`  ${n.padEnd(26)} search=${rec.pageSearch?'Y':'N'} chips=${rec.filterBar} tabs=[${rec.innerTabs.map(t=>t.t).join('|')}]`);
    }
    R.heldConditions = out;
    R.summary = {
      partsViewsWithFilterBar: out.filter(o=>/^Parts/.test(o.name) && o.filterBar>0).map(o=>o.name),
      reportsWithInnerTabs:    out.filter(o=>/^Rep/.test(o.name) && o.innerTabs.length>0).map(o=>o.name),
      reportsWithPageSearch:   out.filter(o=>/^Rep/.test(o.name) && o.pageSearch).map(o=>o.name),
      reportsWithoutPageSearch:out.filter(o=>/^Rep/.test(o.name) && !o.pageSearch).map(o=>o.name),
      partsWithoutPageSearch:  out.filter(o=>/^Parts/.test(o.name) && !o.pageSearch).map(o=>o.name) };
    console.log('SUMMARY:', JSON.stringify(R.summary,null,1));
    await h.browser.close();
  }
  fs.writeFileSync(`${OUT}/probeR3.json`, JSON.stringify(R,null,2));
})();
