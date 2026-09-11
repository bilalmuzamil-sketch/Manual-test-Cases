import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com';
const log=(...a)=>console.log(a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const s=await boot('sv9872','/administration/invoices-import','admin'); const page=s.page;
await page.setViewportSize({width:1600,height:1100});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const net=[]; page.on('request',r=>{const u=r.url(); if(/\/api\//.test(u)) net.push(r.method()+' '+u.replace(/^https?:\/\/[^/]+/,''));});
await page.waitForTimeout(13000);
// the page's own visible body (below the nav)
log('main region:', await page.evaluate(()=>{const m=document.querySelector('main')||document.body;
  return (m.innerText||'').replace(/\s+/g,' ').slice(-700);}));
const dlp=page.waitForEvent('download',{timeout:30000}).catch(()=>null);
await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('a,button,.q-btn')].filter(isVis).find(e=>/Download Template/i.test(t(e)));
  if(b)b.click();},VIS);
const d=await dlp;
if(d){ const p=`${DIR}/evidence/invoice-import-template.csv`; await d.saveAs(p); log('downloaded ->',p, fs.statSync(p).size,'bytes');
  log('CONTENT:'); log(fs.readFileSync(p,'utf8').slice(0,1500)); }
else { log('no download event; calls:', JSON.stringify(net.slice(-8))); }
await s.browser.close(); process.exit(0);
