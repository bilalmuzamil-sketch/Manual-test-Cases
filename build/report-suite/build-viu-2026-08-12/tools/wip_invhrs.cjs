const {boot}=require('./boot.cjs'); const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/report-suite/build-viu-2026-08-12/evidence/';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const {browser,page}=await boot(); const dls=[],resp=[];
  page.on('download',async d=>{const f=OUT+'ih-'+Date.now()+'-'+d.suggestedFilename();try{await d.saveAs(f);}catch(e){}
    dls.push({name:d.suggestedFilename(),size:(()=>{try{return fs.statSync(f).size}catch(e){return -1}})(),saved:f});});
  page.on('response',async r=>{if(/\/export\?/.test(r.url())){let b='';try{if(r.status()>=400)b=(await r.text()).slice(0,300);}catch(e){}
    resp.push({s:r.status(),q:decodeURIComponent(r.url().split('?')[1]).slice(0,260),err:b});}});
  await page.goto('https://sv8582.qa.shopview.com/reports/work-in-progress',{waitUntil:'domcontentloaded',timeout:120000});
  await sleep(9000);
  const out={};
  await page.click('[data-test-id=button_column_selection]'); await sleep(1500);
  out.columnMenu=await page.evaluate(()=>{const m=document.querySelector('.q-menu');if(!m)return null;
    return {items:[...m.querySelectorAll('.q-item')].map(e=>({txt:(e.textContent||'').trim(),checked:(e.querySelector('[aria-checked]')||{}).getAttribute?e.querySelector('[aria-checked]').getAttribute('aria-checked'):(e.getAttribute('aria-checked')||null)})),
      raw:(()=>{const tw=document.createTreeWalker(m,NodeFilter.SHOW_TEXT);const a=[];let n;while(n=tw.nextNode()){const t=n.nodeValue.trim();if(t)a.push(t);}return a;})()};});
  console.log('COLUMN MENU',JSON.stringify(out.columnMenu&&out.columnMenu.items));
  await page.screenshot({path:OUT+'wip-column-menu.png'});
  // turn Inv. Hrs on
  out.invToggled=await page.evaluate(()=>{const m=document.querySelector('.q-menu');if(!m)return 'no menu';
    const it=[...m.querySelectorAll('.q-item')].find(e=>/inv\.?\s*hrs/i.test(e.textContent||''));
    if(!it) return 'no Inv. Hrs item'; it.click(); return 'clicked';});
  console.log('INV TOGGLE:',out.invToggled);
  await sleep(3000);
  await page.keyboard.press('Escape'); await sleep(1200);
  out.headersAfter=await page.evaluate(()=>[...document.querySelectorAll('thead th')].map(e=>(e.textContent||'').trim()));
  console.log('HEADERS NOW',JSON.stringify(out.headersAfter));
  for(const tid of ['action_wip_export_pdf','action_wip_export_csv']){
    const db=dls.length, rb=resp.length;
    await page.click('[data-test-id=btn_dropdown_wip_export]'); await sleep(1200);
    await page.evaluate(t=>{const e=document.querySelector('[data-test-id='+t+']');if(e){e.scrollIntoView();e.click();}},tid);
    await sleep(6000);
    const notif=await page.evaluate(()=>[...document.querySelectorAll('.q-notification__message')].map(e=>e.innerText.trim()));
    console.log('INVHRS EXPORT',tid,'| dl',JSON.stringify(dls.slice(db).map(d=>d.name+':'+d.size)),'| http',JSON.stringify(resp.slice(rb)),'| notif',JSON.stringify(notif));
    out['exp_'+tid]={dl:dls.slice(db),http:resp.slice(rb),notif};
    await page.evaluate(()=>document.querySelectorAll('.q-notification .q-btn').forEach(b=>b.click())); await sleep(800);
  }
  fs.writeFileSync(OUT+'wip-invhrs.json',JSON.stringify({out,dls,resp},null,2));
  await browser.close();
})().catch(e=>{console.error('FATAL',e.message);process.exit(1);});
