// WIP download probe: observe the product's OWN download request, never guess the shape.
const {boot}=require('./boot.cjs');
const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/report-suite/build-viu-2026-08-12/evidence/';
(async()=>{
  const {browser,page,ctx}=await boot();
  const reqs=[], dls=[], errs=[];
  page.on('request',r=>{ if(/\/api\//.test(r.url())) reqs.push({t:Date.now(),m:r.method(),u:r.url(),pd:(r.postData()||'').slice(0,600)}); });
  page.on('response',async r=>{ if(/\/api\//.test(r.url())&&r.status()>=400) errs.push({s:r.status(),u:r.url(),body:(await r.text().catch(()=>'')).slice(0,400)}); });
  ctx.on('page',p=>dls.push({popup:p.url()}));
  page.on('download',async d=>{ const p=OUT+'dl-'+Date.now()+'-'+d.suggestedFilename(); try{await d.saveAs(p);}catch(e){} dls.push({file:d.suggestedFilename(),saved:p,url:d.url()}); });

  await page.goto('https://sv8582.qa.shopview.com/reports/work-in-progress',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(9000);
  const step={};
  step.url=page.url();
  // harvest tabs + row counts + toolbar text nodes
  step.surface=await page.evaluate(()=>{
    const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const texts=[]; let n; while(n=tw.nextNode()){const t=n.nodeValue.trim(); if(t&&t.length<90) texts.push(t);}
    return {texts:[...new Set(texts)],
      testids:[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))],
      rows:document.querySelectorAll('tbody tr').length,
      tabs:[...document.querySelectorAll('.q-tab, [role=tab]')].map(e=>({t:(e.textContent||'').trim(),sel:e.getAttribute('aria-selected')}))};
  });
  await page.screenshot({path:OUT+'wip-landing.png',fullPage:false});
  fs.writeFileSync(OUT+'wip-step1.json',JSON.stringify(step,null,2));
  console.log('URL',step.url,'ROWS',step.surface.rows);
  console.log('TABS',JSON.stringify(step.surface.tabs));
  console.log('TESTIDS',step.surface.testids.filter(x=>/down|export|menu|dot|more|pdf|csv/i.test(x)).join(' | '));
  fs.writeFileSync(OUT+'wip-reqs-1.json',JSON.stringify({reqs,errs},null,2));
  await browser.close();
})().catch(e=>{console.error('FATAL',e.message);process.exit(1);});
