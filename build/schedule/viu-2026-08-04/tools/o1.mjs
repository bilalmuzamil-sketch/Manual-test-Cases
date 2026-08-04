import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot();
const E='/tmp/sviu/evidence/';
async function shot(n){await page.screenshot({path:E+n+'.png'});}
async function dump(sel,label){
  const r=await page.evaluate((s)=>{const els=[...document.querySelectorAll(s)];return els.slice(0,60).map(e=>({t:(e.innerText||'').trim().slice(0,90),tid:e.getAttribute('data-testid')||e.getAttribute('data-cy')||'',cls:(e.className||'').toString().slice(0,60),tag:e.tagName}));},sel);
  console.log('== '+label+' ('+sel+') n='+r.length); r.forEach(x=>console.log('   ',JSON.stringify(x)));
}
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
await shot('01-week-default');
// toolbar
console.log('=== TOOLBAR AREA TEXT ===');
const tb=await page.evaluate(()=>{
  const out=[];
  document.querySelectorAll('button,[role=button],.q-btn,.q-toggle,.q-tab').forEach(e=>{
    const t=(e.innerText||e.getAttribute('aria-label')||'').trim();
    if(t) out.push({t:t.slice(0,60),tid:e.getAttribute('data-testid')||'',cls:(e.className||'').toString().slice(0,70)});
  });
  return out;
});
tb.forEach(x=>console.log(' BTN',JSON.stringify(x)));
console.log('=== all data-testid on page ===');
const tids=await page.evaluate(()=>[...new Set([...document.querySelectorAll('[data-testid]')].map(e=>e.getAttribute('data-testid')))]);
console.log(JSON.stringify(tids,null,0));
await browser.close();
