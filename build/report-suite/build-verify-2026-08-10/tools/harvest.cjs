const {boot,APP}=require('/tmp/boot.cjs'); const fs=require('fs');
const REPORT=process.argv[2];
const snap=p=>p.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  return {
   headers:[...document.querySelectorAll('thead th')].map(t=>t.innerText.replace(/arrow_drop_(up|down)/g,'').trim()),
   tabs:[...document.querySelectorAll('.q-tab,[role=tab]')].filter(vis).map(e=>e.innerText.trim()).filter(t=>!/\n/.test(t)),
   text:[...new Set([...document.querySelectorAll('body *')].filter(e=>vis(e)&&e.children.length===0&&e.innerText&&e.innerText.trim()).map(e=>e.innerText.trim()).filter(t=>t.length<200))],
   testids:[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))],
   rowcount:document.querySelectorAll('tbody tr').length,
   row0:[...document.querySelectorAll('tbody tr')].slice(0,2).map(r=>[...r.querySelectorAll('td')].map(td=>td.innerText.trim()))
  };});
const popup=p=>p.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  return [...document.querySelectorAll('.q-menu,.q-dialog__inner,[role=menu],[role=listbox]')].filter(vis).map(m=>({
    testids:[...m.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).slice(0,60),
    items:[...new Set([...m.querySelectorAll('*')].filter(e=>e.children.length===0&&e.innerText&&e.innerText.trim()).map(e=>e.innerText.trim()))].slice(0,60)
  }));});
(async()=>{
  const {browser,page}=await boot();
  await page.goto(APP+'/reports/'+REPORT,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(14000);
  const base=await snap(page);
  const IDS=base.testids.filter(t=>/^(btn_dropdown|button_column_selection|select_multiple|date-range-selector.*trigger|btn_|button_export|toggle_)/.test(t)&&!/^report_nav/.test(t));
  const res={report:REPORT,url:page.url(),base,menus:{},err:[],probed:IDS};
  for(const id of IDS){
    try{
      const loc=page.locator(`[data-test-id="${id}"]`).first();
      if(!await loc.count()){res.menus[id]='NO SUCH CONTROL';continue;}
      await loc.click({timeout:6000,force:true}); await page.waitForTimeout(2200);
      const pop=await popup(page); if(pop.length) res.menus[id]=pop;
      await page.keyboard.press('Escape'); await page.waitForTimeout(800);
    }catch(e){res.err.push(id+': '+e.message.split('\n')[0].slice(0,70));}
  }
  fs.writeFileSync('/tmp/vocab2-'+REPORT+'.json',JSON.stringify(res,null,1));
  console.log('DONE',REPORT,'menus',Object.keys(res.menus).length,'errs',res.err.length);
  await browser.close();
})().catch(e=>{console.log('ERR',e.message.slice(0,200));process.exit(1)});
