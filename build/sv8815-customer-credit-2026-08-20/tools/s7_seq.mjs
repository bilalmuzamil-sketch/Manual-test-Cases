// The product's own interaction: TICK the row you want to credit (checkbox_select_parts_{id}),
// fill Reason, submit with button_confirm_dialog. Then reopen and credit the other part.
import { open, ensureHD, mode } from '/tmp/sv8815-staging/boot.mjs';
import * as L from '/tmp/sv8815-staging/lib.mjs';
import fs from 'node:fs';
const CID='b3aa863a-665d-4096-8a14-b6c0bd9d50ee';
const PS='0ac0762a-e107-4b0f-b483-36ff445b23fa';
const A='5361e7d2-4bf4-4e18-a113-9920ccab2ed3', B='93256d50-233e-4edc-8822-2c2ee4dd6ed9';
const s=await open(); const p=s.page; const out={steps:[]};
await ensureHD(s);
out.mode=await mode(s); out.ps=await L.psView(s,PS);
out.build=await p.evaluate(()=>document.querySelector('meta[name=app-version]')?.content);
console.log('build',out.build,'| mode',out.mode,'| invoice',out.ps.num,'frozen tax',out.ps.tax);
const net=[];
p.on('request',rq=>{const u=rq.url();
  if(/calculate-tax|credit-memos/.test(u)&&rq.method()!=='GET'){
    net.push({dir:'REQ',u:u.replace(s.API,''),body:String(rq.postData()||'').slice(0,1500)});
    if(/credit-memos/.test(u)) console.log('   >>> POST credit-memos:',String(rq.postData()||'').slice(0,800));}});
p.on('response',async r=>{const u=r.url();
  if(/calculate-tax|credit-memos/.test(u)){let t='';try{t=(await r.text()).slice(0,700)}catch(e){}
    net.push({dir:'RESP',status:r.status(),u:u.replace(s.API,''),body:t});
    console.log('   NET',r.status(),u.replace(s.API,''),t.slice(0,280));}});

const openDialog=async()=>{
  await p.goto(`${s.APP}/customers/${CID}/invoices`,{waitUntil:'domcontentloaded',timeout:60000});
  await p.waitForTimeout(14000);
  const num=out.ps.num.replace(/^P-?/,'');
  const cb=await p.evaluate(n=>{for(const tr of document.querySelectorAll('tr')){
    if((tr.innerText||'').includes(n)){const c=tr.querySelector('input[type=checkbox], .q-checkbox');
      if(c){c.scrollIntoView({block:'center',behavior:'instant'});const r=c.getBoundingClientRect();
        return {x:r.x,y:r.y,w:r.width,h:r.height};}}} return null;},num);
  if(!cb) throw new Error('invoice row not found');
  await p.mouse.click(cb.x+cb.w/2,cb.y+cb.h/2); await p.waitForTimeout(3000);
  await L.clickTestId(s,'button_issue_credit_customer'); await p.waitForTimeout(11000);
};
const read=async()=>await p.evaluate(()=>{const g=id=>{const e=document.querySelector(`[data-test-id="${id}"]`);return e?e.innerText.trim():null;};
  const t=document.querySelector('[data-test-id="table_parts_return"]');
  const btn=document.querySelector('[data-test-id="button_confirm_dialog"]');
  return {subtotal:g('currency_text_parts_return_subtotal'),tax:g('currency_text_parts_return_tax'),
    total:g('currency_text_parts_return_total'),submitEnabled:btn?!btn.disabled:null,
    rows:t?[...t.querySelectorAll('tbody tr')].map(tr=>tr.innerText.replace(/\n/g,' | ')).filter(x=>x.trim()):null};});
const creditOne=async(partId,label,reason)=>{
  await openDialog();
  const before=await read();
  console.log(`\n[${label}] dialog default:`,JSON.stringify({tax:before.tax,sub:before.subtotal,rows:before.rows}));
  await L.clickTestId(s,'checkbox_select_parts_'+partId);
  await p.waitForTimeout(10000);
  const picked=await read();
  console.log(`[${label}] after ticking the row:`,JSON.stringify({tax:picked.tax,sub:picked.subtotal,total:picked.total,submit:picked.submitEnabled}));
  await p.screenshot({path:`/tmp/sv8815-staging/S7-${label}-selected.png`,fullPage:true});
  // Reason
  const rb=await L.clickTestId(s,'input_credit_memo_reason').catch(()=>null);
  if(rb){ await p.keyboard.type(reason,{delay:20}); await p.waitForTimeout(1500); }
  const st=await read();
  console.log(`[${label}] submit enabled after reason:`,st.submitEnabled);
  if(st.submitEnabled){
    await L.clickTestId(s,'button_confirm_dialog');
    await p.waitForTimeout(13000);
    const notif=await p.evaluate(()=>[...document.querySelectorAll('.q-notification__message')].map(e=>e.innerText.trim()));
    console.log(`[${label}] notifications:`,JSON.stringify(notif));
    await p.screenshot({path:`/tmp/sv8815-staging/S7-${label}-posted.png`,fullPage:true});
    return {before,picked,posted:true,notif};
  }
  await p.screenshot({path:`/tmp/sv8815-staging/S7-${label}-blocked.png`,fullPage:true});
  return {before,picked,posted:false};
};
out.steps.push(await creditOne(A,'A','ZZAUTOTEST SV-8815 credit part A'));
out.steps.push(await creditOne(B,'B','ZZAUTOTEST SV-8815 credit part B'));
out.net=net;
out.psFinal=await L.psView(s,PS);
console.log('\ninvoice after both credits:',JSON.stringify(out.psFinal));
fs.writeFileSync('/tmp/sv8815-staging/S7.json',JSON.stringify(out,null,1));
await s.browser.close();
