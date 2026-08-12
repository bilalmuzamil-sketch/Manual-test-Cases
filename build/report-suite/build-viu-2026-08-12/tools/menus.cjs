const {boot}=require('./boot.cjs'); const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/report-suite/build-viu-2026-08-12/evidence/';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const REPS=[['sbc','/reports/sales-by-customer'],['tu','/reports/technician-utilization'],
            ['sbr','/reports/sales-by-representative'],['pv','/reports/parts-velocity'],
            ['iv','/reports/inventory-value'],['wip','/reports/work-in-progress']];
const READ=`(()=>{const m=document.querySelector('.q-menu'); if(!m) return null;
 const tw=document.createTreeWalker(m,NodeFilter.SHOW_TEXT); const raw=[]; let n;
 while(n=tw.nextNode()){const t=n.nodeValue.trim(); if(t) raw.push(t);}
 return {raw, items:[...m.querySelectorAll('.q-item')].map(e=>({txt:e.textContent.trim(),inner:e.innerText.trim(),tid:e.getAttribute('data-test-id')}))};})()`;
(async()=>{
  const {browser,page}=await boot(); const all={};
  for(const [k,p] of REPS){
    await page.goto('https://sv8582.qa.shopview.com'+p,{waitUntil:'domcontentloaded',timeout:120000});
    await sleep(7000);
    const rec={};
    // every dropdown-looking control on the page
    const tids=await page.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))].filter(t=>/dropdown|export|download|date-range|column|summary_strip/.test(t)));
    rec.controls=tids;
    for(const t of tids.filter(x=>/dropdown|export|download|date-range/.test(x))){
      try{
        await page.evaluate(id=>{const e=document.querySelector('[data-test-id="'+id+'"]'); if(e){e.scrollIntoView();e.click();}},t);
        await sleep(1500);
        const m=await page.evaluate(READ);
        if(m&&m.items.length) rec[t]=m;
        await page.keyboard.press('Escape'); await sleep(700);
      }catch(e){}
    }
    // summary strip / stat labels
    rec.summary=await page.evaluate(()=>[...document.querySelectorAll('[data-test-id*=summary]')].map(e=>({tid:e.getAttribute('data-test-id'),txt:e.textContent.trim().slice(0,60)})));
    all[k]=rec;
    console.log('==',k);
    for(const kk of Object.keys(rec)) if(rec[kk]&&rec[kk].items) console.log('   ',kk,'->',JSON.stringify(rec[kk].items.map(i=>i.txt)));
    fs.writeFileSync(OUT+'menus.json',JSON.stringify(all,null,2));
  }
  await browser.close();
})().catch(e=>{console.error('FATAL',e.message);process.exit(1);});
