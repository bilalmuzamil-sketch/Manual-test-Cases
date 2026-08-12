// Deep runnability probe on the three FINAL reports: the surfaces the static harvest cannot
// reach. Each of these is a step our cases actually ask a tester to perform, so each is
// executed here rather than assumed.
//   1. tab switching (WIP)          4. downloads (all four/two menu items per report)
//   2. sorting by header click      5. phone viewport (390x844) toolbar layout
//   3. expand / collapse            6. dark mode
const {boot,APP,RENDERED}=require('./harness.cjs'); const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/report-suite/verify-final-2026-08-12/evidence/';
const DL='/tmp/rs812/dl/'; fs.mkdirSync(DL,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const R=[{k:'wip',p:'/reports/work-in-progress'},
         {k:'tu', p:'/reports/technician-utilization'},
         {k:'sbc',p:'/reports/sales-by-customer'}];

const HDRS=`(()=>{${RENDERED}
  return __labs('thead th').map(h=>(h.it||h.tc).replace(/arrow_drop_(up|down)|keyboard_double_arrow_(down|up)|info_outline/g,'').trim());})()`;
const FIRSTCOL=`(()=>[...document.querySelectorAll('tbody tr')].slice(0,6).map(r=>(r.innerText||'').split('\\n')[0].trim()))()`;
const TABS=`(()=>{${RENDERED}
  return __labs('.q-tab,[role=tab]').map(t=>({tc:t.tc,it:t.it,tt:t.tt,tid:t.tid,
    sel:(document.querySelector('[data-test-id="'+t.tid+'"]')||{getAttribute:()=>null}).getAttribute('aria-selected')}));})()`;

(async()=>{
  const {browser,ctx,page,bridgeErrors}=await boot(); const out={};
  for(const r of R){
    const rec={downloads:[],notes:[]};
    await page.goto(APP+r.p,{waitUntil:'domcontentloaded',timeout:120000});
    await sleep(9000);

    // ---------- 1. tabs (WIP only) ----------
    const tabs=await page.evaluate(TABS);
    const own=tabs.filter(t=>t.tid&&/^tab_/.test(t.tid));
    if(own.length){
      rec.tabs=own.map(t=>({rendered:t.it,shipped:t.tc,tt:t.tt,tid:t.tid,selectedOnLoad:t.sel}));
      rec.tabSwitch=[];
      for(const t of own){
        try{
          const el=await page.$('[data-test-id="'+t.tid+'"]');
          await el.scrollIntoViewIfNeeded().catch(()=>{});
          await el.click({timeout:9000}); await sleep(4000);
          const sel=await page.evaluate(`(document.querySelector('[data-test-id="${t.tid}"]')||{getAttribute:()=>null}).getAttribute('aria-selected')`);
          const rows=await page.evaluate(`document.querySelectorAll('tbody tr').length`);
          rec.tabSwitch.push({tid:t.tid,becameSelected:sel,rows});
        }catch(e){ rec.tabSwitch.push({tid:t.tid,err:String(e).slice(0,90)}); }
      }
      // back to the default tab
      const d=await page.$('[data-test-id="'+own[0].tid+'"]'); if(d){ await d.click().catch(()=>{}); await sleep(3500); }
    }

    // ---------- 2. sorting ----------
    try{
      const before=await page.evaluate(FIRSTCOL);
      const hdrs=await page.evaluate(HDRS);
      // click a header that is a plain text column
      const idx=hdrs.findIndex(h=>h&&h.length>1);
      const ths=await page.$$('thead th');
      if(ths[idx]){
        await ths[idx].click({timeout:9000}); await sleep(4000);
        const after1=await page.evaluate(FIRSTCOL);
        await ths[idx].click({timeout:9000}); await sleep(4000);
        const after2=await page.evaluate(FIRSTCOL);
        rec.sort={header:hdrs[idx],before,afterFirstClick:after1,afterSecondClick:after2,
                  firstClickChanged:JSON.stringify(before)!==JSON.stringify(after1),
                  secondClickChanged:JSON.stringify(after1)!==JSON.stringify(after2)};
      }
    }catch(e){ rec.sort={err:String(e).slice(0,120)}; }

    // ---------- 3. expand / collapse ----------
    try{
      const ex=await page.$('[data-test-id="button_'+r.k+'_expand_all"]');
      if(ex){
        const b=await page.evaluate(`document.querySelectorAll('tbody tr').length`);
        await ex.click({timeout:9000}); await sleep(4500);
        const a=await page.evaluate(`document.querySelectorAll('tbody tr').length`);
        await ex.click({timeout:9000}); await sleep(3500);
        const c=await page.evaluate(`document.querySelectorAll('tbody tr').length`);
        rec.expand={rowsCollapsed:b,rowsExpanded:a,rowsAfterCollapseAgain:c,works:a>b};
      } else rec.expand={present:false};
    }catch(e){ rec.expand={err:String(e).slice(0,120)}; }

    // ---------- 4. downloads ----------
    try{
      const btn=await page.$('[data-test-id="btn_dropdown_'+r.k+'_export"]');
      if(btn){
        await btn.click({timeout:9000}); await sleep(1500);
        const items=await page.evaluate(`(()=>{
          const ms=[...document.querySelectorAll('.q-menu')].filter(m=>{const cs=getComputedStyle(m);
            return cs.display!=='none'&&cs.visibility!=='hidden';});
          const m=ms[ms.length-1]; if(!m) return [];
          return [...m.querySelectorAll('.q-item')].map(e=>e.textContent.replace(/\\s+/g,' ').trim());})()`);
        await page.keyboard.press('Escape'); await sleep(700);
        for(let i=0;i<items.length;i++){
          try{
            const b2=await page.$('[data-test-id="btn_dropdown_'+r.k+'_export"]');
            await b2.click({timeout:9000}); await sleep(1400);
            const dlp=page.waitForEvent('download',{timeout:60000}).catch(()=>null);
            await page.evaluate(`(()=>{
              const ms=[...document.querySelectorAll('.q-menu')].filter(m=>{const cs=getComputedStyle(m);
                return cs.display!=='none'&&cs.visibility!=='hidden';});
              const m=ms[ms.length-1]; if(!m) return;
              const it=[...m.querySelectorAll('.q-item')][${i}]; if(it) it.click();})()`);
            const d=await dlp;
            let size=null,name=null;
            if(d){ name=d.suggestedFilename(); const pth=DL+r.k+'-'+i+'-'+name;
                   await d.saveAs(pth).catch(()=>{}); try{size=fs.statSync(pth).size;}catch(_){}}
            await sleep(2500);
            const toast=await page.evaluate(`(()=>{const e=document.querySelector('.q-notification');
              return e?e.innerText.replace(/\\s+/g,' ').trim():null;})()`);
            rec.downloads.push({item:items[i],filename:name,bytes:size,toast});
            await page.keyboard.press('Escape'); await sleep(1200);
          }catch(e){ rec.downloads.push({item:items[i],err:String(e).slice(0,110)}); }
        }
      }
    }catch(e){ rec.notes.push('download probe: '+String(e).slice(0,120)); }

    // ---------- 5. dark mode ----------
    try{
      const bg0=await page.evaluate(`getComputedStyle(document.body).backgroundColor`);
      await page.evaluate(`document.body.classList.add('body--dark')`); await sleep(1200);
      const bg1=await page.evaluate(`getComputedStyle(document.body).backgroundColor`);
      await page.evaluate(`document.body.classList.remove('body--dark')`); await sleep(600);
      rec.darkMode={light:bg0,dark:bg1,changed:bg0!==bg1};
    }catch(e){ rec.darkMode={err:String(e).slice(0,90)}; }

    out[r.k]=rec;
    console.log(r.k,'tabs',(rec.tabs||[]).length,'sortChanged',rec.sort&&rec.sort.firstClickChanged,
      'expand',rec.expand&&rec.expand.works,'downloads',rec.downloads.length,
      'ok',rec.downloads.filter(d=>d.bytes).length,'dark',rec.darkMode&&rec.darkMode.changed);
  }

  // ---------- 6. phone viewport ----------
  const ph=await ctx.newPage(); await ph.setViewportSize({width:390,height:844});
  out._phone={};
  for(const r of R){
    try{
      await ph.goto(APP+r.p,{waitUntil:'domcontentloaded',timeout:120000}); await sleep(9000);
      out._phone[r.k]=await ph.evaluate(`(()=>{${RENDERED}
        const ids=['btn_dropdown_${r.k}_export','button_column_selection','date-range-selector_${r.k}_trigger','select_multiple_report_location_filter'];
        const vis={}; for(const i of ids){const e=document.querySelector('[data-test-id="'+i+'"]');
          if(!e){vis[i]='ABSENT';continue;} const rc=e.getBoundingClientRect();
          vis[i]={x:Math.round(rc.x),y:Math.round(rc.y),w:Math.round(rc.width),h:Math.round(rc.height),
                  visible:rc.width>0&&rc.height>0};}
        return {width:innerWidth,controls:vis,rows:document.querySelectorAll('tbody tr').length};})()`);
      await ph.screenshot({path:OUT+'phone-'+r.k+'.png'}).catch(()=>{});
    }catch(e){ out._phone[r.k]={err:String(e).slice(0,120)}; }
    console.log('phone',r.k,JSON.stringify(out._phone[r.k]).slice(0,200));
  }
  out._meta={bridgeErrors,at:new Date().toISOString()};
  fs.writeFileSync(OUT+'deep-final-three.json',JSON.stringify(out,null,1));
  console.log('bridge_errors',bridgeErrors.length);
  await browser.close();
})();
