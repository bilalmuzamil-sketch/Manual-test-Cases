// Walk the Settings menu properly instead of guessing routes: enumerate EVERY sidebar row, click
// each one, record where it lands and whether "Invoice Design" is on it. Then check the feature
// flags, and finally grep the built code — if the words are not even in the shipped code, the
// feature is genuinely not on this branch (playbook: walk stalls => grep the build's chunks).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={rows:[], flags:null, chunks:null};
const s = await boot('sv9872','/administration/settings','admin');
const page = s.page;
await page.setViewportSize({width:1600,height:1000});
await page.waitForTimeout(6000);

const sidebar = ()=>page.evaluate(vis=>{const isVis=eval(vis);
  const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('a.q-item,.q-drawer a,.q-list a')].filter(isVis)
    .map((e,i)=>({i, label:t(e).replace(/^[a-z_]+\s/,''), href:e.getAttribute('href')||''}))
    .filter(x=>x.label);}, VIS);
R.sidebar = await sidebar();
log('sidebar rows: %d', R.sidebar.length);
log('%s', JSON.stringify(R.sidebar.map(r=>r.label)));

for (const row of R.sidebar){
  try{
    await page.goto(`${APP}/administration/settings`,{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForTimeout(3500);
    const clicked = await page.evaluate(({vis,label})=>{const isVis=eval(vis);
      const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim().replace(/^[a-z_]+\s/,'');
      const el=[...document.querySelectorAll('a.q-item,.q-drawer a,.q-list a')].filter(isVis)
        .find(e=>t(e)===label);
      if(!el) return false; el.click(); return true;}, {vis:VIS, label:row.label});
    await page.waitForTimeout(5000);
    const r = await page.evaluate(vis=>{const isVis=eval(vis);
      const body=(document.body.innerText||'').replace(/\s+/g,' ');
      return {url:location.href, chars:body.length,
        invoiceDesign:/invoice design/i.test(body),
        modernLegacy:/\bmodern\b/i.test(body) && /\blegacy\b/i.test(body),
        controls:[...document.querySelectorAll('.q-toggle,.q-select,.q-radio,.q-checkbox,select,input')].filter(isVis).length,
        snippet: /invoice design/i.test(body)
          ? body.slice(Math.max(0, body.toLowerCase().indexOf('invoice design')-120), body.toLowerCase().indexOf('invoice design')+320)
          : body.slice(0,110)};}, VIS);
    R.rows.push({label:row.label, clicked, ...r});
    log('%-28s %-46s ctrls=%-3d InvoiceDesign=%s', row.label, r.url.split('.com')[1].slice(0,46), r.controls, r.invoiceDesign);
    if (r.invoiceDesign) await page.screenshot({path:`${DIR}/evidence/P02-FOUND-${row.label.replace(/\W+/g,'-')}.png`, fullPage:true}).catch(()=>{});
  }catch(e){ R.rows.push({label:row.label, error:String(e).slice(0,90)}); log('%-28s ERROR %s', row.label, String(e).slice(0,60)); }
}
fs.writeFileSync(`${DIR}/evidence/P02.json`, JSON.stringify(R,null,1));

// the feature flags list
try{
  await page.goto(`${APP}/administration/feature-flags`,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForTimeout(5000);
  R.flags = await page.evaluate(vis=>{const isVis=eval(vis);
    const body=(document.body.innerText||'').replace(/\s+/g,' ');
    return {url:location.href, hasInvoiceDesign:/invoice design/i.test(body),
      rows:[...document.querySelectorAll('tr,.q-item')].filter(isVis)
        .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(x=>x.length>3).slice(0,60)};}, VIS);
  log('feature flags: %d rows | mentions Invoice Design: %s', (R.flags.rows||[]).length, R.flags.hasInvoiceDesign);
  const hits=(R.flags.rows||[]).filter(x=>/invoice|design/i.test(x));
  log('  flag rows mentioning invoice or design: %s', JSON.stringify(hits).slice(0,400));
  await page.screenshot({path:`${DIR}/evidence/P02-flags.png`, fullPage:true}).catch(()=>{});
}catch(e){ log('feature flags: %s', String(e).slice(0,70)); }

// last resort: is the phrase even in the shipped code?
R.chunks = await page.evaluate(async()=>{
  const srcs=[...document.querySelectorAll('script[src]')].map(s=>s.src);
  const out={scanned:0, hits:[]};
  for (const u of srcs.slice(0,40)){
    try{ const r=await fetch(u); const t=await r.text(); out.scanned++;
      for (const w of ['Invoice Design','invoiceDesign','invoice_design']){
        if (t.includes(w)) out.hits.push({file:u.split('/').pop().slice(0,40), word:w}); }
    }catch(e){}
  }
  return out;});
log('shipped code: scanned %d files | matches for the feature name: %s',
  R.chunks.scanned, JSON.stringify(R.chunks.hits).slice(0,300));
fs.writeFileSync(`${DIR}/evidence/P02.json`, JSON.stringify(R,null,1));
log('done');
await s.browser.close();
process.exit(0);
