// Second menu sweep — the controls the first regex missed because they do NOT end in
// "_filter": select_sbc_product_type, select_sbr_product_type, select_sbr_invoice_status,
// toggle_sbr_show_unassigned, button_*_expand_all. Widened to "every control-looking id".
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
    const tt=cs.textTransform; let r=t;
    if(tt==='uppercase') r=t.toUpperCase();
    else if(tt==='lowercase') r=t.toLowerCase();
    else if(tt==='capitalize') r=t.replace(/\\b\\p{L}/gu,c=>c.toUpperCase());
    raw.push({tc:t,rendered:r,tt});
  }
  return {raw, items:[...m.querySelectorAll('.q-item')].map(e=>{
      const l=__lab(e);
      const cb=e.querySelector('[aria-checked],input[type=checkbox],.q-toggle,.q-checkbox');
      return Object.assign(l,{checked: cb?(cb.getAttribute('aria-checked')||String(cb.checked||'')):null});
    })};
})()`;

// the closed/resting state of a control, before it is opened
const RESTING=`(id)=>{
  const e=document.querySelector('[data-test-id="'+id+'"]'); if(!e) return null;
  const cs=getComputedStyle(e);
  const tc=(e.textContent||'').replace(/\\s+/g,' ').trim();
  const it=(e.innerText||'').replace(/\\s+/g,' ').trim();
  return {tc,it,tt:cs.textTransform,aria:e.getAttribute('aria-label'),
          val:(e.querySelector('input')||{}).value||null,
          checked:e.getAttribute('aria-checked')||(e.querySelector('[aria-checked]')||{getAttribute:()=>null}).getAttribute('aria-checked')};
}`;

(async()=>{
  const {browser,page,bridgeErrors}=await boot(); const out={};
  const WANT=/^(select_|toggle_|btn_|button_|date-range-selector_|checkbox_|switch_)/;
  const SKIP=/^(button_desktop_nav_link|select_global_search|button_notifications|profile_menu_button|clock_in|button_sbc_expand_customer|button_sbr_expand_rep|button_pv_|button_iv_|skip-to)/;
  for(const r of R){
    out[r.k]={};
    await page.goto(APP+r.path,{waitUntil:'domcontentloaded',timeout:120000});
    await sleep(9000);
    const ids=await page.evaluate(`[...new Set([...document.querySelectorAll('[data-test-id]')]
      .map(e=>e.getAttribute('data-test-id')))]`);
    const want=ids.filter(i=>WANT.test(i)&&!SKIP.test(i)&&!/expand_(customer|rep)_/.test(i));
    for(const id of want){
      const rec={};
      try{
        rec.resting=await page.evaluate(RESTING,id);
        const el=await page.$('[data-test-id="'+id+'"]');
        if(!el){ out[r.k][id]={missing:true}; continue; }
        await el.scrollIntoViewIfNeeded().catch(()=>{});
        const before=page.url();
        await el.click({timeout:9000});
        await sleep(1700);
        if(page.url()!==before){ rec.navigatedAway=page.url(); await page.goBack(); await sleep(6000); }
        else {
          rec.panel=await page.evaluate(PANEL);
          rec.after=await page.evaluate(RESTING,id);   // toggles change state instead of opening
          await page.keyboard.press('Escape'); await sleep(800);
          // a toggle must be put back
          if(rec.after&&rec.resting&&rec.after.checked!==rec.resting.checked){
            const e2=await page.$('[data-test-id="'+id+'"]');
            if(e2){ await e2.click({timeout:9000}).catch(()=>{}); await sleep(1200);
                    rec.restored=await page.evaluate(RESTING,id); }
          }
        }
      }catch(e){ rec.err=String(e).slice(0,140); }
      out[r.k][id]=rec;
    }
    console.log(r.k, want.length, 'controls:', want.join(' '));
  }
  out._meta={bridgeErrors,at:new Date().toISOString()};
  fs.writeFileSync(OUT+'menus2.json',JSON.stringify(out,null,1));
  console.log('bridge_errors',bridgeErrors.length);
  await browser.close();
})();
