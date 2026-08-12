// Per-report label harvest against the RUNNING build.
// Opens: the page, the column-selection menu, the download menu, the date-range panel,
// every other visible dropdown/select, and the tab strip. Records rendered + shipped text.
const {boot,APP,RENDERED}=require('./harness.cjs'); const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/report-suite/verify-final-2026-08-12/evidence/';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const REPORTS=[
 {k:'wip', path:'/reports/work-in-progress',        name:'Work In Progress',         final:true},
 {k:'tu',  path:'/reports/technician-utilization',  name:'Technician Utilization',   final:true},
 {k:'sbc', path:'/reports/sales-by-customer',       name:'Sales By Customer',        final:true},
 {k:'sbr', path:'/reports/sales-by-representative', name:'Sales By Representative',  final:false},
 {k:'pv',  path:'/reports/parts-velocity',          name:'Parts Velocity',           final:false},
 {k:'iv',  path:'/reports/inventory-value',         name:'Inventory Value',          final:false}];

const DUMP=`(()=>{${RENDERED}
  const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  const texts=[]; let n;
  while(n=tw.nextNode()){
    const t=(n.nodeValue||'').replace(/\\s+/g,' ').trim();
    if(!t||t.length>140) continue;
    const p=n.parentElement; if(!p) continue;
    const cs=getComputedStyle(p);
    if(cs.display==='none'||cs.visibility==='hidden') continue;
    const tt=cs.textTransform;
    // rendered form: apply the transform ourselves so a text NODE is comparable too
    let r=t;
    if(tt==='uppercase') r=t.toUpperCase();
    else if(tt==='lowercase') r=t.toLowerCase();
    else if(tt==='capitalize') r=t.replace(/\\b\\p{L}/gu,c=>c.toUpperCase());
    texts.push({tc:t,rendered:r,tt});
  }
  const seen=new Set(); const uniq=[];
  for(const x of texts){const k=x.tc+'|'+x.tt; if(!seen.has(k)){seen.add(k);uniq.push(x);}}
  return {
    url:location.pathname,
    title:document.title,
    texts:uniq,
    headers:__labs('thead th'),
    buttons:__labs('button,.q-btn'),
    tabs:__labs('.q-tab,[role=tab]'),
    labels:__labs('label,.q-field__label,.q-item__label'),
    testids:[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))],
    placeholders:[...new Set([...document.querySelectorAll('[placeholder]')].map(e=>e.getAttribute('placeholder')))],
    aria:[...new Set([...document.querySelectorAll('[aria-label]')].map(e=>e.getAttribute('aria-label')))],
    rows:document.querySelectorAll('tbody tr').length,
    emptyText:(()=>{const e=document.querySelector('.q-table__bottom--nodata,.no-data,[data-test-id*=empty]');return e?__lab(e):null;})()
  };
})()`;

// LAST .q-menu, never the first — Quasar leaves earlier menus mounted (schedule HARNESS-FIX 4).
const MENU=`(()=>{${RENDERED}
  const ms=[...document.querySelectorAll('.q-menu,.q-dialog__inner')];
  const m=ms[ms.length-1]; if(!m) return null;
  const tw=document.createTreeWalker(m,NodeFilter.SHOW_TEXT); const raw=[]; let n;
  while(n=tw.nextNode()){
    const t=(n.nodeValue||'').replace(/\\s+/g,' ').trim(); if(!t) continue;
    const p=n.parentElement; const tt=p?getComputedStyle(p).textTransform:'none';
    let r=t;
    if(tt==='uppercase') r=t.toUpperCase();
    else if(tt==='lowercase') r=t.toLowerCase();
    else if(tt==='capitalize') r=t.replace(/\\b\\p{L}/gu,c=>c.toUpperCase());
    raw.push({tc:t,rendered:r,tt});
  }
  return {count:ms.length, raw,
    items:[...m.querySelectorAll('.q-item')].map(e=>{
      const l=__lab(e);
      const cb=e.querySelector('[aria-checked],input[type=checkbox]');
      return Object.assign(l,{checked: cb?(cb.getAttribute('aria-checked')||String(cb.checked)):null});
    })};
})()`;

(async()=>{
  const {browser,page,apiLog,bridgeErrors}=await boot(); const all={};
  const only=process.argv[2];
  for(const r of REPORTS){
    if(only && only!==r.k) continue;
    const rec={report:r.name,key:r.k,path:r.path,final:r.final,menus:{}};
    try{
      await page.goto(APP+r.path,{waitUntil:'domcontentloaded',timeout:120000});
      await sleep(9000);
      Object.assign(rec, await page.evaluate(DUMP));
      // --- column selection ---
      for(const sel of ['[data-test-id=button_column_selection]','[data-test-id*=column_selection]','[data-test-id*=columns]']){
        const el=await page.$(sel);
        if(el){ await el.scrollIntoViewIfNeeded().catch(()=>{}); await el.click({timeout:8000}).catch(()=>{});
          await sleep(1600); rec.menus.columns=await page.evaluate(MENU);
          await page.keyboard.press('Escape'); await sleep(700); break; }
      }
      // --- download / export menu ---
      for(const sel of ['[data-test-id*=download]','[data-test-id*=export]','[data-test-id^=btn_dropdown]']){
        const el=await page.$(sel);
        if(el){ await el.scrollIntoViewIfNeeded().catch(()=>{}); await el.click({timeout:8000}).catch(()=>{});
          await sleep(1600); const m=await page.evaluate(MENU);
          if(m&&m.raw&&m.raw.length){ rec.menus.download=m; rec.menus.download.openedBy=sel; }
          await page.keyboard.press('Escape'); await sleep(700);
          if(rec.menus.download) break; }
      }
      // --- date range panel ---
      for(const sel of ['[data-test-id*=date_range]','[data-test-id*=daterange]','[data-test-id*=date]']){
        const el=await page.$(sel);
        if(el){ await el.scrollIntoViewIfNeeded().catch(()=>{}); await el.click({timeout:8000}).catch(()=>{});
          await sleep(2000);
          const m=await page.evaluate(`(()=>{${RENDERED}
            const ms=[...document.querySelectorAll('.q-menu,.q-dialog__inner')]; const m=ms[ms.length-1]; if(!m) return null;
            // the preset panel: list items that are NOT calendar day numbers
            const items=[...m.querySelectorAll('.q-item,li,button,div')].map(e=>__lab(e))
              .filter(x=>x&&x.tc&&x.tc.length>3&&x.tc.length<40&&!/^\\d+$/.test(x.tc));
            const seen=new Set(); const u=[];
            for(const x of items){ if(!seen.has(x.tc)){seen.add(x.tc);u.push(x);} }
            return {items:u.slice(0,60)};})()`);
          if(m&&m.items&&m.items.length){ rec.menus.dates=m; rec.menus.dates.openedBy=sel; }
          await page.keyboard.press('Escape'); await sleep(700);
          if(rec.menus.dates) break; }
      }
      await page.screenshot({path:OUT+'shot-'+r.k+'.png',fullPage:false}).catch(()=>{});
    }catch(e){ rec.error=String(e).slice(0,300); }
    all[r.k]=rec;
    console.log(r.k,'rows',rec.rows,'hdrs',(rec.headers||[]).length,'tabs',(rec.tabs||[]).length,
      'menus',Object.keys(rec.menus||{}).join(',')||'-', rec.error?('ERR '+rec.error.slice(0,60)):'');
  }
  all._meta={apiLog:apiLog.slice(-140),bridgeErrors,at:new Date().toISOString()};
  const f=OUT+(only?('harvest-'+only+'.json'):'harvest-all.json');
  fs.writeFileSync(f,JSON.stringify(all,null,1));
  console.log('bridge_errors',bridgeErrors.length,'->',f);
  await browser.close();
})();
