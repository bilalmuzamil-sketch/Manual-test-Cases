// The Location-column question, tested rather than assumed.
// Spec (WIP S4-R3 / SBC section 2, both as amended 2026-08-05/06) makes the column
// ACCESS-gated: any user with access to more than one location sees it by default and can
// toggle it. This account's location filter lists FIVE locations, so the access condition
// is met. Earlier passes could not settle it and said so; this one can.
// Two states are read per report: as the report opens, and with "All locations" selected.
const {boot,APP,RENDERED}=require('./harness.cjs'); const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/report-suite/verify-final-2026-08-12/evidence/';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const R=[{k:'wip',p:'/reports/work-in-progress'},{k:'sbc',p:'/reports/sales-by-customer'},
         {k:'tu',p:'/reports/technician-utilization'},{k:'iv',p:'/reports/inventory-value'},
         {k:'pv',p:'/reports/parts-velocity'},{k:'sbr',p:'/reports/sales-by-representative'}];

const COLS=`(()=>{${RENDERED}
  const ms=[...document.querySelectorAll('.q-menu')].filter(m=>{const cs=getComputedStyle(m);
    return cs.display!=='none'&&cs.visibility!=='hidden';});
  const m=ms[ms.length-1]; if(!m) return null;
  return [...m.querySelectorAll('.q-item')].map(e=>{
    const l=__lab(e); const cb=e.querySelector('[aria-checked],input[type=checkbox]');
    return {label:l.it||l.tc, checked: cb?(cb.getAttribute('aria-checked')||String(cb.checked)):null};});
})()`;
const HDRS=`(()=>{${RENDERED}
  return __labs('thead th').map(h=>(h.it||h.tc).replace(/arrow_drop_(up|down)|keyboard_double_arrow_(down|up)|info_outline/g,'').trim());
})()`;
const LOCLABEL=`(()=>{${RENDERED}
  const e=document.querySelector('[data-test-id=select_multiple_report_location_filter]');
  return e?__lab(e):null;})()`;

(async()=>{
  const {browser,page,bridgeErrors}=await boot(); const out={};
  for(const r of R){
    const rec={};
    await page.goto(APP+r.p,{waitUntil:'domcontentloaded',timeout:120000});
    await sleep(9000);
    rec.locationsAvailable=await page.evaluate(`(async()=>{return null})()`).catch(()=>null);
    rec.locFilterLabel=await page.evaluate(LOCLABEL);
    rec.headersBefore=await page.evaluate(HDRS);
    // column menu as the report opens
    let el=await page.$('[data-test-id=button_column_selection]');
    if(el){ await el.click({timeout:9000}).catch(()=>{}); await sleep(1500);
            rec.colsBefore=await page.evaluate(COLS); await page.keyboard.press('Escape'); await sleep(800); }
    // now select "All locations"
    el=await page.$('[data-test-id=select_multiple_report_location_filter]');
    if(el){
      await el.scrollIntoViewIfNeeded().catch(()=>{});
      await el.click({timeout:9000}).catch(()=>{}); await sleep(1600);
      const clicked=await page.evaluate(`(()=>{
        const ms=[...document.querySelectorAll('.q-menu')].filter(m=>{const cs=getComputedStyle(m);
          return cs.display!=='none'&&cs.visibility!=='hidden';});
        const m=ms[ms.length-1]; if(!m) return 'no menu';
        const it=[...m.querySelectorAll('.q-item')].find(e=>/All locations/i.test(e.textContent));
        if(!it) return 'no All locations row';
        it.click(); return 'clicked';})()`);
      rec.allLocationsClick=clicked;
      await sleep(1500); await page.keyboard.press('Escape'); await sleep(6000);
      rec.locFilterAfter=await page.evaluate(LOCLABEL);
      rec.headersAfter=await page.evaluate(HDRS);
      el=await page.$('[data-test-id=button_column_selection]');
      if(el){ await el.click({timeout:9000}).catch(()=>{}); await sleep(1500);
              rec.colsAfter=await page.evaluate(COLS); await page.keyboard.press('Escape'); await sleep(800); }
    }
    out[r.k]=rec;
    const has=a=>(a||[]).some(x=>/^Location$/i.test(x.label||x));
    console.log(r.k,
      '| locfilter before:',JSON.stringify((rec.locFilterLabel||{}).it||''),
      '| Location col BEFORE:',has(rec.colsBefore),
      '| after All locations:',JSON.stringify((rec.locFilterAfter||{}).it||''),
      '| Location col AFTER:',has(rec.colsAfter),
      '| in header after:',(rec.headersAfter||[]).includes('Location'));
  }
  out._meta={bridgeErrors,at:new Date().toISOString()};
  fs.writeFileSync(OUT+'location-column.json',JSON.stringify(out,null,1));
  console.log('bridge_errors',bridgeErrors.length);
  await browser.close();
})();
