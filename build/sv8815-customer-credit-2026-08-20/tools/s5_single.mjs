// Credit ONE part only, by zeroing the other row's "Qty To Credit".
// pro-rata from the frozen 0.51  -> 0.26   |   recompute-the-remainder -> 0.25
import { open, ensureHD, mode } from '/tmp/sv8815-staging/boot.mjs';
import * as L from '/tmp/sv8815-staging/lib.mjs';
import fs from 'node:fs';
const CID='b3aa863a-665d-4096-8a14-b6c0bd9d50ee';
const PS=process.argv[2]||'0ac0762a-e107-4b0f-b483-36ff445b23fa';
const ZERO=process.argv[3];                 // part id whose qty is set to 0
const TAG=process.argv[4]||'S5';
const s=await open(); const p=s.page; const out={tag:TAG,zeroed:ZERO};
await ensureHD(s);
out.mode=await mode(s); out.ps=await L.psView(s,PS);
out.build=await p.evaluate(()=>document.querySelector('meta[name=app-version]')?.content);
console.log('build:',out.build,'| mode:',out.mode,'| invoice tax frozen at:',out.ps.tax);
const net=[];
p.on('request',rq=>{if(/calculate-tax/.test(rq.url())&&rq.method()!=='GET')
  net.push({dir:'REQ',body:String(rq.postData()||'')});});
p.on('response',async r=>{if(/calculate-tax/.test(r.url())){
  let t=''; try{t=(await r.text()).slice(0,600)}catch(e){}
  net.push({dir:'RESP',status:r.status(),body:t}); console.log('   calculate-tax',r.status(),t.slice(0,300));}});

await p.goto(`${s.APP}/customers/${CID}/invoices`,{waitUntil:'domcontentloaded',timeout:60000});
await p.waitForTimeout(14000);
const num=out.ps.num.replace(/^P-?/,'');
const cb=await p.evaluate(n=>{for(const tr of document.querySelectorAll('tr')){
  if((tr.innerText||'').includes(n)){const c=tr.querySelector('input[type=checkbox], .q-checkbox');
    if(c){c.scrollIntoView({block:'center',behavior:'instant'});const r=c.getBoundingClientRect();
      return {x:r.x,y:r.y,w:r.width,h:r.height};}}} return null;},num);
await p.mouse.click(cb.x+cb.w/2,cb.y+cb.h/2); await p.waitForTimeout(3000);
await L.clickTestId(s,'button_issue_credit_customer'); await p.waitForTimeout(11000);
const read=async()=>await p.evaluate(()=>{const g=id=>{const e=document.querySelector(`[data-test-id="${id}"]`);return e?e.innerText.trim():null;};
  const t=document.querySelector('[data-test-id="table_parts_return"]');
  return {subtotal:g('currency_text_parts_return_subtotal'),tax:g('currency_text_parts_return_tax'),
    total:g('currency_text_parts_return_total'),
    rows:t?[...t.querySelectorAll('tbody tr')].map(tr=>tr.innerText.replace(/\n/g,' | ')).filter(x=>x.trim()):null};});
out.defaultState=await read();
console.log('\nDEFAULT (both parts credited):',JSON.stringify(out.defaultState,null,1));
await p.screenshot({path:`/tmp/sv8815-staging/${TAG}a-default-both.png`,fullPage:true});

// zero the other row's quantity
const id=`input_parts_return_quantity_${ZERO}`;
const box=await p.evaluate(i=>{const e=document.querySelector(`[data-test-id="${i}"]`);
  if(!e) return null; const inp=e.tagName==='INPUT'?e:e.querySelector('input');
  inp.scrollIntoView({block:'center',behavior:'instant'});
  const r=inp.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,val:inp.value};},id);
out.zeroBox=box; console.log('qty input for the row being zeroed:',JSON.stringify(box));
if(!box) throw new Error('qty input not found: '+id);
await p.mouse.click(box.x+box.w/2,box.y+box.h/2); await p.waitForTimeout(500);
await p.keyboard.press('Control+A'); await p.keyboard.type('0',{delay:80});
await p.keyboard.press('Tab');
await p.waitForTimeout(11000);
out.singleState=await read();
console.log('\nONE PART CREDITED:',JSON.stringify(out.singleState,null,1));
await p.screenshot({path:`/tmp/sv8815-staging/${TAG}b-one-part.png`,fullPage:true});
out.net=net;
const tax=(out.singleState.tax||'').replace(/[^0-9.]/g,'');
console.log('\n=== credit tax on ONE $5.10 part, invoice frozen at 0.51:',out.singleState.tax);
console.log(tax==='0.26' ? 'PRO-RATA FROM THE FROZEN TAX (0.26) - what the ticket intends'
  : tax==='0.25' ? 'RECOMPUTE-THE-REMAINDER (0.25) - NOT pro-rata from the frozen tax'
  : 'UNEXPECTED: '+out.singleState.tax);
fs.writeFileSync(`/tmp/sv8815-staging/${TAG}.json`,JSON.stringify(out,null,1));
await s.browser.close();
