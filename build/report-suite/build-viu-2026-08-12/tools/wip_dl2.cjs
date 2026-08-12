const {boot}=require('./boot.cjs');
const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/report-suite/build-viu-2026-08-12/evidence/';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const {browser,page,ctx}=await boot();
  const reqs=[],resp=[],dls=[];
  page.on('request',r=>{const u=r.url(); if(/\/api\//.test(u)) reqs.push({m:r.method(),u:u.replace('https://sv8582api.qa.shopview.com',''),pd:(r.postData()||'').slice(0,500)});});
  page.on('response',async r=>{const u=r.url(); if(/\/api\//.test(u)){let b='';try{if(r.status()>=400)b=(await r.text()).slice(0,500);}catch(e){}
    resp.push({s:r.status(),u:u.replace('https://sv8582api.qa.shopview.com',''),ct:r.headers()['content-type']||'',cl:r.headers()['content-length']||'',err:b});}});
  page.on('download',async d=>{const f=OUT+'dl-'+d.suggestedFilename();try{await d.saveAs(f);}catch(e){}dls.push({name:d.suggestedFilename(),url:d.url(),saved:f});});

  await page.goto('https://sv8582.qa.shopview.com/reports/work-in-progress',{waitUntil:'domcontentloaded',timeout:120000});
  await sleep(9000);
  const res={build:null,tabs:[],menu:null,attempts:[]};
  res.tabs=await page.evaluate(()=>[...document.querySelectorAll('.q-tab,[role=tab]')].map(e=>({t:(e.textContent||'').trim(),sel:e.getAttribute('aria-selected')})).filter(x=>/\(\d+\)/.test(x.t)));

  // open the export dropdown and harvest the menu (raw text nodes, not innerText)
  await page.click('[data-test-id=btn_dropdown_wip_export]');
  await sleep(1500);
  res.menu=await page.evaluate(()=>{
    const m=document.querySelector('.q-menu'); if(!m) return null;
    const tw=document.createTreeWalker(m,NodeFilter.SHOW_TEXT); const raw=[]; let n;
    while(n=tw.nextNode()){const t=n.nodeValue.trim(); if(t) raw.push(t);}
    return {raw, innerText:m.innerText, items:[...m.querySelectorAll('.q-item')].map(e=>({txt:(e.textContent||'').trim(),inner:e.innerText.trim(),tid:e.getAttribute('data-test-id')}))};
  });
  await page.screenshot({path:OUT+'wip-export-menu.png'});
  console.log('MENU',JSON.stringify(res.menu&&res.menu.items));

  // click each menu item in turn, on the DEFAULT tab (Approved - partially completed, 15 rows)
  const n=(res.menu&&res.menu.items.length)||0;
  for(let i=0;i<n;i++){
    const before=reqs.length, dlb=dls.length;
    if(i>0){ await page.click('[data-test-id=btn_dropdown_wip_export]'); await sleep(1200); }
    const items=await page.$$('.q-menu .q-item');
    if(!items[i]) { res.attempts.push({i,err:'item gone'}); continue; }
    const label=(await items[i].evaluate(e=>e.textContent.trim()));
    await items[i].scrollIntoViewIfNeeded();
    await items[i].click();
    await sleep(5000);
    const notif=await page.evaluate(()=>[...document.querySelectorAll('.q-notification, .q-notification__message, [role=alert]')].map(e=>e.innerText.trim()));
    fs.writeFileSync(OUT+'wip-progress.json',JSON.stringify({attempts:res.attempts,reqs,resp,dls},null,2));res.attempts.push({i,label,newReqs:reqs.slice(before),newDownloads:dls.slice(dlb),notification:notif});
    console.log('ATTEMPT',i,label,'| reqs',JSON.stringify(reqs.slice(before)),'| dl',dls.length-dlb,'| notif',JSON.stringify(notif));
    await page.screenshot({path:OUT+'wip-after-'+i+'.png'});
  }
  fs.writeFileSync(OUT+'wip-download-probe.json',JSON.stringify({res,reqs,resp,dls},null,2));
  await browser.close();
})().catch(e=>{console.error('FATAL',e.message,e.stack);process.exit(1);});
