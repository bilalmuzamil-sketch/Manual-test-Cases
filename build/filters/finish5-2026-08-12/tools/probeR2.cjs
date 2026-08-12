// probeR2 — the two cases finish4 could not close, now driven end to end.
//  C29614 steps 1-6 (all six, in order)
//  C43560 steps 1-6 (two browsers, last-write-wins)
// Landing is BARE /workorders throughout: that is the route a tester takes (the nav link),
// and probeR1 established that an explicit ?tab=all in the address legitimately wins over
// the saved preference -- which is what made finish4 read a false negative.
const { makeHarness, OUT, APP } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
const chips = p => p.$$eval('[data-test-id^="filter_chip_"]', els => els.map(e =>
  (e.innerText||'').replace(/\s+/g,' ').replace(/\s*keyboard_arrow_down$/,'').trim()));
const rows = p => p.evaluate(()=>document.querySelectorAll('tbody tr').length);
const land = async (p, path='/workorders', w=13000) => {
  await p.goto(APP+path,{waitUntil:'domcontentloaded',timeout:120000});
  await p.waitForTimeout(w); await L.ensureBarOpen(p); };
async function setStatus(p, want) {
  const o = await L.openChip(p,'filter_chip_status');
  const t = o.options.find(x=>new RegExp('^'+want+'$','i').test(x.text));
  const r = { optionsSeen:o.options.length, found:!!t };
  if (t) { await L.pickOption(p,t.id); await p.waitForTimeout(3800); }
  await L.closeMenu(p); await p.waitForTimeout(2500);
  r.chips = await chips(p); r.url = p.url();
  return r;
}
async function untickStatus(p, want) {
  const o = await L.openChip(p,'filter_chip_status');
  const t = o.options.find(x=>new RegExp('^'+want+'$','i').test(x.text));
  const r = { found:!!t };
  if (t) { await L.pickOption(p,t.id); await p.waitForTimeout(3800); }
  await L.closeMenu(p); await p.waitForTimeout(2500);
  r.chips = await chips(p); r.url = p.url();
  return r;
}

(async () => {
  const R = { probe:'R2', at:new Date().toISOString(), C29614:{steps:[]}, C43560:{steps:[]} };

  // ================= C29614 =================
  {
    const h = await makeHarness('admin'); const P = h.page;
    await land(P);
    // precondition 2: filters applied (a status AND a customer), set through the chips
    const st = await setStatus(P,'Approved');
    const oc = await L.openChip(P,'filter_chip_company_id');
    let cust=null;
    if (oc.options.length){ cust=oc.options[0].text; await L.pickOption(P,oc.options[0].id); await P.waitForTimeout(3800);}
    await L.closeMenu(P); await P.waitForTimeout(2500);
    R.C29614.precondition = { status:st.found?'Approved':null, customer:cust,
      chips:await chips(P), url:P.url(), rows:await rows(P) };
    // step 1 — visit other areas
    const visited=[];
    for (const p of ['/customers','/parts/inventory','/reports/sales']) {
      await P.goto(APP+p,{waitUntil:'domcontentloaded',timeout:120000}); await P.waitForTimeout(7000);
      visited.push({ path:p, landedOn:P.url() });
    }
    R.C29614.steps.push({ n:1, text:'Visit several other areas and use them briefly', visited });
    // step 2 — return to Work Orders
    await land(P);
    R.C29614.steps.push({ n:2, text:'Return to Work Orders and look at chips and table',
      chips:await chips(P), rows:await rows(P), url:P.url() });
    const prefBefore = await L.pref(P);
    await h.browser.close();               // step 3 — close the browser completely
    R.C29614.steps.push({ n:3, text:'Close the browser completely', done:true, prefAtClose:prefBefore.value?.filters });

    // step 4/5 — open the browser again as the same person, go to Work Orders
    const h2 = await makeHarness('admin'); const P2 = h2.page;
    await land(P2);
    const c5 = await chips(P2);
    R.C29614.steps.push({ n:'4-5', text:'Open the browser again, sign in as the same person, go to Work Orders; look',
      chips:c5, rows:await rows(P2), url:P2.url(),
      statusKept:c5.some(t=>/Status\s*:/.test(t)), customerKept:c5.some(t=>/Customer\s*:/.test(t)),
      appGET:h2.apiLog.filter(a=>/preferences\/work-orders-list/.test(a.u)&&a.m==='GET') });
    await h2.browser.close();

    // step 6 — a DIFFERENT browser profile, same person
    const h3 = await makeHarness('admin'); const P3 = h3.page;
    await land(P3);
    const c6 = await chips(P3);
    R.C29614.steps.push({ n:6, text:'On a different browser profile, sign in as the same person and open Work Orders',
      separateBrowserProcess:true, chips:c6, rows:await rows(P3), url:P3.url(),
      statusKept:c6.some(t=>/Status\s*:/.test(t)), customerKept:c6.some(t=>/Customer\s*:/.test(t)),
      bridgeErrors:h3.bridgeErrors.length });
    // leave the account tidy through the interface
    await L.clearAll(P3); await P3.waitForTimeout(3000);
    R.C29614.cleanedTo = (await L.pref(P3)).value?.filters;
    await h3.browser.close();
    console.log('C29614:'); R.C29614.steps.forEach(s=>console.log('  ',JSON.stringify(s).slice(0,420)));
  }

  // ================= C43560 — two browsers at the same time =================
  {
    const hA = await makeHarness('admin'), hB = await makeHarness('admin');
    const A = hA.page, B = hB.page;
    await land(A); await land(B);
    R.C43560.precondition = { browserA:{chips:await chips(A),url:A.url()},
                              browserB:{chips:await chips(B),url:B.url()},
                              separateProcesses:true };
    // step 1 — A sets Approved
    const s1 = await setStatus(A,'Approved'); await A.waitForTimeout(3000);
    R.C43560.steps.push({ n:1, text:'Browser A: set Status to Approved; wait', ...s1,
      appPUT:hA.apiLog.filter(a=>a.m==='PUT'&&/work-orders-list/.test(a.u)).length });
    // step 2 — B must first RELOAD so it SEES Approved (finish4's step 2 skipped this, so its
    // "clear Approved" ADDED Approved instead of removing it). Then untick Approved, tick Estimate.
    await land(B);
    const bSees = await chips(B);
    const un = await untickStatus(B,'Approved');
    const s2 = await setStatus(B,'Estimate');
    R.C43560.steps.push({ n:2, text:'Browser B: set Status to Estimate instead, and clear Approved; wait',
      bReloadedFirst:true, whatBSawOnLoad:bSees, afterUntickApproved:un.chips, afterTickEstimate:s2.chips,
      url:B.url(), appPUT:hB.apiLog.filter(a=>a.m==='PUT'&&/work-orders-list/.test(a.u)).length });
    await B.waitForTimeout(3000);
    // step 3 — A reloads
    await land(A);
    const c3 = await chips(A);
    R.C43560.steps.push({ n:'3-4', text:'Browser A: reload; look at chips and table',
      chips:c3, rows:await rows(A), url:A.url(),
      showsEstimate:c3.some(t=>/Status\s*:\s*Estimate/i.test(t)),
      showsApproved:c3.some(t=>/Status\s*:\s*Approved/i.test(t)) });
    // step 5 — A adds a Customer filter
    const oc = await L.openChip(A,'filter_chip_company_id');
    let cu=null; if(oc.options.length){cu=oc.options[0].text; await L.pickOption(A,oc.options[0].id); await A.waitForTimeout(4000);}
    await L.closeMenu(A); await A.waitForTimeout(3500);
    R.C43560.steps.push({ n:5, text:'Browser A: set a Customer filter as well; wait',
      customer:cu, chips:await chips(A), url:A.url() });
    // step 6 — B reloads
    await land(B);
    const c6 = await chips(B);
    R.C43560.steps.push({ n:6, text:'Browser B: reload and look at chips and table',
      chips:c6, rows:await rows(B), url:B.url(),
      showsCustomer:c6.some(t=>/Customer\s*:/.test(t)),
      showsEstimate:c6.some(t=>/Status\s*:\s*Estimate/i.test(t)) });
    R.C43560.errors = { A:hA.consoleErrs.slice(0,4), B:hB.consoleErrs.slice(0,4),
      bridgeA:hA.bridgeErrors.length, bridgeB:hB.bridgeErrors.length };
    await L.clearAll(A); await A.waitForTimeout(3000);
    R.C43560.cleanedTo = (await L.pref(A)).value?.filters;
    await hA.browser.close(); await hB.browser.close();
    console.log('C43560:'); R.C43560.steps.forEach(s=>console.log('  ',JSON.stringify(s).slice(0,460)));
    console.log('  cleanedTo', JSON.stringify(R.C43560.cleanedTo));
  }
  fs.writeFileSync(`${OUT}/probeR2.json`, JSON.stringify(R,null,2));
})();
