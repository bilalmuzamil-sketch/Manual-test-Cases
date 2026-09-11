// Seed an imported invoice, then test C53568: imported invoices are unaffected by the setting.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P50.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872','/administration/invoices-import','admin'); const page=s.page;
await page.setViewportSize({width:1600,height:1100});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const net=[]; page.on('request',r=>{const u=r.url(); if(/\/api\//.test(u)) net.push({m:r.method(),u:u.replace(/^https?:\/\/[^/]+/,'')});});
const seen=()=>{const c=net.slice(); net.length=0; return c;};
await page.waitForTimeout(14000);
R.url=page.url();
R.text=await page.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,1200));
R.controls=await page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('button,.q-btn,input,a,select')].filter(isVis)
    .map(e=>`${e.tagName}[${e.type||''}]:${((e.innerText||e.value||e.getAttribute('aria-label')||'')).replace(/\s+/g,' ').trim().slice(0,40)}`).slice(0,30);},VIS);
R.fileInputs=await page.evaluate(()=>[...document.querySelectorAll('input[type=file]')].map(i=>({accept:i.accept,name:i.name,id:i.id})));
log('URL:', R.url);
log('page text:', R.text.slice(0,600));
log('controls:', JSON.stringify(R.controls));
log('file inputs:', JSON.stringify(R.fileInputs));
log('calls:', JSON.stringify(seen().filter(c=>/import/i.test(c.u)).map(c=>c.m+' '+c.u)));
await page.screenshot({path:`${DIR}/evidence/P50-invoices-import.png`, fullPage:true});
save();
// look for a template download that tells us the required columns
const dl=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('a,button,.q-btn')].filter(isVis)
    .filter(e=>/template|sample|download|example/i.test(t(e))).map(e=>({t:t(e),href:e.getAttribute('href')}));},VIS);
R.templateLinks=dl; log('template links:', JSON.stringify(dl));
save();
log('done'); await s.browser.close(); process.exit(0);
