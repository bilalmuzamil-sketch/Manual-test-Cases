const {boot}=require('./boot.cjs'); const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/report-suite/build-viu-2026-08-12/evidence/';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const REPS=[['sbc','/reports/sales-by-customer'],['tu','/reports/technician-utilization']];
(async()=>{
  const {browser,page}=await boot(); const all={};
  for(const [k,p] of REPS){
    await page.goto('https://sv8582.qa.shopview.com'+p,{waitUntil:'domcontentloaded',timeout:120000});
    await sleep(8000); const rec={};
    for(const t of ['btn_dropdown_'+k+'_export','date-range-selector_'+k+'_trigger']){
      const el=await page.$('[data-test-id="'+t+'"]');
      if(!el){ rec[t]={err:'control not found'}; continue; }
      await el.scrollIntoViewIfNeeded(); await el.click(); await sleep(2500);
      rec[t]=await page.evaluate(()=>{const ms=[...document.querySelectorAll('.q-menu,.q-dialog')];
        if(!ms.length) return {err:'no menu opened'};
        return ms.map(m=>({items:[...m.querySelectorAll('.q-item')].map(e=>({txt:e.textContent.trim(),inner:e.innerText.trim()})),
          raw:(()=>{const tw=document.createTreeWalker(m,NodeFilter.SHOW_TEXT);const a=[];let n;while(n=tw.nextNode()){const s=n.nodeValue.trim();if(s)a.push(s);}return a.slice(0,40);})()}));});
      await page.screenshot({path:OUT+'menu-'+k+'-'+t.replace(/[^a-z0-9]/gi,'_')+'.png'});
      await page.keyboard.press('Escape'); await sleep(1200);
      await page.mouse.click(5,5); await sleep(800);
    }
    all[k]=rec; console.log('==',k,JSON.stringify(rec).slice(0,1400));
    fs.writeFileSync(OUT+'menus2.json',JSON.stringify(all,null,2));
  }
  await browser.close();
})().catch(e=>{console.error('FATAL',e.message);process.exit(1);});
