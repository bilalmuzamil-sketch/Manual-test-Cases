// Open EVERY dropdown on every report by its EXACT test-id.
// The morning harvest used [data-test-id*=export], which matched the NAV LINK
// report_nav_export_reports first and navigated off the report. Exact ids only.
const {boot,APP,RENDERED}=require('./harness.cjs'); const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/report-suite/verify-final-2026-08-12/evidence/';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const R=[
 {k:'wip',path:'/reports/work-in-progress'},
 {k:'tu', path:'/reports/technician-utilization'},
 {k:'sbc',path:'/reports/sales-by-customer'},
 {k:'sbr',path:'/reports/sales-by-representative'},
 {k:'pv', path:'/reports/parts-velocity'},
 {k:'iv', path:'/reports/inventory-value'}];

const PANEL=`(()=>{${RENDERED}
  const ms=[...document.querySelectorAll('.q-menu,.q-dialog__inner')].filter(m=>{
    const cs=getComputedStyle(m); return cs.display!=='none'&&cs.visibility!=='hidden';});
  const m=ms[ms.length-1]; if(!m) return null;
  const tw=document.createTreeWalker(m,NodeFilter.SHOW_TEXT); const raw=[]; let n;
  while(n=tw.nextNode()){
    const t=(n.nodeValue||'').replace(/\\s+/g,' ').trim(); if(!t) continue;
    const p=n.parentElement; if(!p) continue;
    const cs=getComputedStyle(p);
    if(cs.display==='none'||cs.visibility==='hidden') continue;
    const tt=cs.textTransform;
    let r=t;
    if(tt==='uppercase') r=t.toUpperCase();
    else if(tt==='lowercase') r=t.toLowerCase();
    else if(tt==='capitalize') r=t.replace(/\\b\\p{L}/gu,c=>c.toUpperCase());
    raw.push({tc:t,rendered:r,tt});
  }
  return {openMenus:ms.length, raw,
    items:[...m.querySelectorAll('.q-item')].map(e=>{
      const l=__lab(e);
      const cb=e.querySelector('[aria-checked],input[type=checkbox]');
      return Object.assign(l,{checked: cb?(cb.getAttribute('aria-checked')||String(cb.checked)):null});
    })};
})()`;

(async()=>{
  const {browser,page,bridgeErrors}=await boot(); const out={};
  for(const r of R){
    out[r.k]={};
    await page.goto(APP+r.path,{waitUntil:'domcontentloaded',timeout:120000});
    await sleep(9000);
    // discover this report's own controls, excluding nav links
    const ids=await page.evaluate(`[...new Set([...document.querySelectorAll('[data-test-id]')]
      .map(e=>e.getAttribute('data-test-id')))].filter(i=>/^(btn_dropdown_|date-range-selector_|select_multiple_|select_[a-z]+_[a-z]+_filter|button_column_selection)/.test(i))`);
    for(const id of ids){
      try{
        const el=await page.$('[data-test-id="'+id+'"]');
        if(!el) continue;
        await el.scrollIntoViewIfNeeded().catch(()=>{});
        await el.click({timeout:9000});
        await sleep(1800);
        const before=page.url();
        const p=await page.evaluate(PANEL);
        if(page.url()!==before){ out[r.k][id]={navigatedAway:page.url()}; await page.goBack(); await sleep(6000); continue; }
        out[r.k][id]=p;
        await page.keyboard.press('Escape'); await sleep(800);
      }catch(e){ out[r.k][id]={err:String(e).slice(0,140)}; }
    }
    console.log(r.k, Object.keys(out[r.k]).map(i=>i+':'+((out[r.k][i]&&out[r.k][i].raw)?out[r.k][i].raw.length:'X')).join(' '));
  }
  out._meta={bridgeErrors,at:new Date().toISOString()};
  fs.writeFileSync(OUT+'menus.json',JSON.stringify(out,null,1));
  console.log('bridge_errors',bridgeErrors.length);
  await browser.close();
})();
