const {boot}=require('./boot.cjs'); const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/report-suite/build-viu-2026-08-12/evidence/';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const REPORTS=[
 {k:'wip',   path:'/reports/work-in-progress',        name:'Work In Progress'},
 {k:'tu',    path:'/reports/technician-utilization',  name:'Technician Utilization'},
 {k:'sbc',   path:'/reports/sales-by-customer',       name:'Sales By Customer'},
 {k:'sbr',   path:'/reports/sales-by-representative', name:'Sales By Representative'},
 {k:'pv',    path:'/reports/parts-velocity',          name:'Parts Velocity'},
 {k:'iv',    path:'/reports/inventory-value',         name:'Inventory Value'}];
const DUMP=`(()=>{
  const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  const texts=[]; let n; while(n=tw.nextNode()){const t=n.nodeValue.trim(); if(t&&t.length<120) texts.push(t);}
  return {
    url:location.pathname,
    texts:[...new Set(texts)],
    headers:[...document.querySelectorAll('thead th')].map(e=>e.textContent.trim()),
    buttons:[...document.querySelectorAll('button,.q-btn')].map(e=>({txt:e.textContent.trim(),tid:e.getAttribute('data-test-id'),aria:e.getAttribute('aria-label')})).filter(x=>x.txt||x.tid),
    tabs:[...document.querySelectorAll('.q-tab,[role=tab]')].map(e=>({txt:e.textContent.trim(),tid:e.getAttribute('data-test-id'),sel:e.getAttribute('aria-selected')})),
    testids:[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))],
    placeholders:[...new Set([...document.querySelectorAll('[placeholder]')].map(e=>e.getAttribute('placeholder')))],
    aria:[...new Set([...document.querySelectorAll('[aria-label]')].map(e=>e.getAttribute('aria-label')))],
    rows:document.querySelectorAll('tbody tr').length};
})()`;
const MENU=`(()=>{const m=document.querySelector('.q-menu'); if(!m) return null;
  const tw=document.createTreeWalker(m,NodeFilter.SHOW_TEXT); const raw=[]; let n;
  while(n=tw.nextNode()){const t=n.nodeValue.trim(); if(t) raw.push(t);}
  return {raw, items:[...m.querySelectorAll('.q-item')].map(e=>({txt:e.textContent.trim(),checked:(e.getAttribute('aria-checked')||(e.querySelector('[aria-checked]')?e.querySelector('[aria-checked]').getAttribute('aria-checked'):null))}))};})()`;
(async()=>{
  const {browser,page}=await boot(); const all={};
  for(const r of REPORTS){
    try{
      await page.goto('https://sv8582.qa.shopview.com'+r.path,{waitUntil:'domcontentloaded',timeout:120000});
      await sleep(8000);
      const s=await page.evaluate(DUMP); s.report=r.name; s.wanted=r.path;
      s.menus={};
      for(const [label,sel] of [['columns','[data-test-id=button_column_selection]'],['export','[data-test-id*=export][data-test-id*=dropdown], [data-test-id^=btn_dropdown]']]){
        try{ const el=await page.$(sel); if(el){ await el.click(); await sleep(1400); s.menus[label]=await page.evaluate(MENU);
          await page.keyboard.press('Escape'); await sleep(600);} }catch(e){ s.menus[label]={err:e.message.slice(0,80)}; }
      }
      await page.screenshot({path:OUT+'rep-'+r.k+'.png'});
      all[r.k]=s;
      console.log(r.k,'| landed',s.url,'| rows',s.rows,'| headers',JSON.stringify(s.headers.slice(0,12)));
      console.log('   tabs:',JSON.stringify(s.tabs.filter(t=>t.tid&&/tab_/.test(t.tid)).map(t=>t.txt)));
      console.log('   colmenu:',JSON.stringify(s.menus.columns&&s.menus.columns.items));
      fs.writeFileSync(OUT+'harvest-all.json',JSON.stringify(all,null,2));
    }catch(e){ all[r.k]={err:e.message.slice(0,200),wanted:r.path}; console.log(r.k,'ERR',e.message.slice(0,120)); }
  }
  fs.writeFileSync(OUT+'harvest-all.json',JSON.stringify(all,null,2));
  await browser.close();
})().catch(e=>{console.error('FATAL',e.message);process.exit(1);});
