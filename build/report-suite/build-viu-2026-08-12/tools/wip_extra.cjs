const {boot}=require('./boot.cjs'); const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/report-suite/build-viu-2026-08-12/evidence/';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const {browser,page}=await boot(); const dls=[],resp=[];
  page.on('download',async d=>{const f=OUT+'x-'+Date.now()+'-'+d.suggestedFilename();try{await d.saveAs(f);}catch(e){}
    dls.push({name:d.suggestedFilename(),size:(()=>{try{return fs.statSync(f).size}catch(e){return -1}})()});});
  page.on('response',async r=>{if(/\/export\?/.test(r.url())){let b='';try{if(r.status()>=400)b=(await r.text()).slice(0,300);}catch(e){}
    resp.push({s:r.status(),q:r.url().split('?')[1].slice(0,200),err:b});}});
  await page.goto('https://sv8582.qa.shopview.com/reports/work-in-progress',{waitUntil:'domcontentloaded',timeout:120000});
  await sleep(9000);
  const out={};
  // A) the column-selection control: what is offered, and is Inv. Hrs there
  const colBtn=await page.evaluate(()=>{const c=[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id'));return c.filter(x=>/col|field|setting|gear|display/i.test(x));});
  out.colCandidates=colBtn; console.log('COL CANDIDATES',JSON.stringify(colBtn));
  out.allTestIds=await page.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))]);
  console.log('ALL TESTIDS',JSON.stringify(out.allTestIds));
  // B) Empty export: narrow the date range to a window with no rows
  out.toolbarText=await page.evaluate(()=>{const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const a=[];let n;while(n=tw.nextNode()){const t=n.nodeValue.trim();if(t&&t.length<70)a.push(t);}return [...new Set(a)];});
  fs.writeFileSync(OUT+'wip-extra.json',JSON.stringify({out,dls,resp},null,2));
  await page.screenshot({path:OUT+'wip-toolbar.png'});
  await browser.close();
})().catch(e=>{console.error('FATAL',e.message);process.exit(1);});
