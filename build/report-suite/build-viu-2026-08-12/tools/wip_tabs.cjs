const {boot}=require('./boot.cjs'); const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/report-suite/build-viu-2026-08-12/evidence/';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const {browser,page}=await boot();
  const out={build:'v3.6-8c28eed',tabs:[]}; const dls=[]; const resp=[];
  page.on('download',async d=>{const f=OUT+'tabdl-'+Date.now()+'-'+d.suggestedFilename();try{await d.saveAs(f);}catch(e){}
    dls.push({name:d.suggestedFilename(),saved:f,size:(()=>{try{return fs.statSync(f).size}catch(e){return -1}})()});});
  page.on('response',async r=>{const u=r.url(); if(/\/export\?/.test(u)){let b='';try{if(r.status()>=400)b=(await r.text()).slice(0,400);}catch(e){}
    resp.push({s:r.status(),ct:r.headers()['content-type']||'',u:u.split('?')[1]?.slice(0,160),err:b});}});
  await page.goto('https://sv8582.qa.shopview.com/reports/work-in-progress',{waitUntil:'domcontentloaded',timeout:120000});
  await sleep(9000);
  const tabTexts=await page.evaluate(()=>[...document.querySelectorAll('.q-tab,[role=tab]')].map(e=>(e.textContent||'').trim()).filter(t=>/\(\d+\)/.test(t)));
  console.log('WIP TABS:',JSON.stringify(tabTexts));
  for(let ti=0; ti<tabTexts.length; ti++){
    const label=tabTexts[ti];
    const clicked=await page.evaluate(t=>{const e=[...document.querySelectorAll('.q-tab,[role=tab]')].find(x=>(x.textContent||'').trim()===t); if(e){e.click();return true}return false;},label);
    await sleep(4000);
    const rows=await page.evaluate(()=>document.querySelectorAll('tbody tr').length);
    const rec={tab:label,clicked,rows,ops:[]};
    for(const tid of ['action_wip_export_pdf','action_wip_export_csv']){
      const db=dls.length, rb=resp.length;
      await page.click('[data-test-id=btn_dropdown_wip_export]'); await sleep(1200);
      const ok=await page.evaluate(t=>{const e=document.querySelector('[data-test-id='+t+']'); if(e){e.scrollIntoView();e.click();return true}return false;},tid);
      await sleep(6000);
      const notif=await page.evaluate(()=>[...document.querySelectorAll('.q-notification__message')].map(e=>e.innerText.trim()));
      rec.ops.push({tid,clicked:ok,downloads:dls.slice(db),http:resp.slice(rb),notification:notif});
      console.log(' ',label,'|',tid,'| dl',JSON.stringify(dls.slice(db).map(d=>d.name+':'+d.size)),'| http',JSON.stringify(resp.slice(rb).map(r=>r.s)),'| notif',JSON.stringify(notif));
      await page.evaluate(()=>document.querySelectorAll('.q-notification .q-btn').forEach(b=>b.click()));
      await sleep(800);
    }
    out.tabs.push(rec);
    fs.writeFileSync(OUT+'wip-tabs-verdict.json',JSON.stringify(out,null,2));
  }
  await browser.close();
})().catch(e=>{console.error('FATAL',e.message);process.exit(1);});
