const {boot}=require('./boot.cjs'); const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/report-suite/build-viu-2026-08-12/evidence/';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const {browser,page}=await boot(); const all={};
  for(const [k,p] of [['wip','/reports/work-in-progress'],['sbc','/reports/sales-by-customer']]){
    await page.goto('https://sv8582.qa.shopview.com'+p,{waitUntil:'domcontentloaded',timeout:120000});
    await sleep(8000);
    const el=await page.$('[data-test-id="date-range-selector_'+k+'_trigger"]');
    if(!el){all[k]={err:'trigger not found'};continue;}
    await el.scrollIntoViewIfNeeded(); await el.click(); await sleep(2500);
    all[k]=await page.evaluate(()=>{
      const panes=[...document.querySelectorAll('.q-menu,.q-dialog,.q-popup-proxy')];
      const res=[];
      for(const m of panes){
        // a preset is a clickable label that is NOT a calendar day number
        const clickables=[...m.querySelectorAll('.q-item, button, .q-btn, [role=option], li, a')]
          .map(e=>e.textContent.trim()).filter(t=>t && t.length>2 && t.length<30 && !/^\d+$/.test(t) && !/chevron/.test(t));
        const tw=document.createTreeWalker(m,NodeFilter.SHOW_TEXT); const raw=[]; let n;
        while(n=tw.nextNode()){const t=n.nodeValue.trim(); if(t && !/^\d{1,2}$/.test(t) && !/chevron/.test(t)) raw.push(t);}
        res.push({clickables:[...new Set(clickables)], nonNumericText:[...new Set(raw)]});
      }
      return res;});
    await page.screenshot({path:OUT+'datepicker-'+k+'.png'});
    console.log('==',k,JSON.stringify(all[k]).slice(0,1200));
    await page.keyboard.press('Escape'); await sleep(1000);
  }
  fs.writeFileSync(OUT+'date-presets.json',JSON.stringify(all,null,2));
  await browser.close();
})().catch(e=>{console.error('FATAL',e.message);process.exit(1);});
