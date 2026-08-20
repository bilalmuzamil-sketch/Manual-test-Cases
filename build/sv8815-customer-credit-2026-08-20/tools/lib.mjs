// Reusable staging helpers for the SV-8815 customer-credit test.
import fs from 'node:fs';
export const PS='027bc02e-2704-4db2-bfcf-45019ab81561';   // part sale P-1341
export async function openLocationDialog(s){
  const p=s.page;
  await p.goto(s.APP+'/administration/locations',{waitUntil:'domcontentloaded',timeout:60000});
  await p.waitForTimeout(12000);
  const row=await p.evaluate(()=>{for(const tr of document.querySelectorAll('tr')){
    if(/Staging Heavy Duty/.test(tr.innerText||'')){const e=tr.querySelector('[data-test-id="button_edit_workplace"]');
      if(e){const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};}}} return null;});
  if(!row) throw new Error('no edit control on the Locations list');
  await p.mouse.click(row.x+row.w/2,row.y+row.h/2);
  await p.waitForTimeout(7000);
}
// Click a control by its CENTRE, scrolling it into the viewport first and RE-MEASURING
// afterwards. page.mouse uses VIEWPORT coordinates: a control below the fold is clicked
// at nothing at all and the click silently does nothing (playbook §U.0b trap 2).
export async function clickTestId(s,testId){
  const p=s.page;
  const box=await p.evaluate(id=>{
    const e=document.querySelector(`[data-test-id="${id}"]`);
    if(!e) return null;
    e.scrollIntoView({block:'center',behavior:'instant'});
    const r=e.getBoundingClientRect();
    return {x:r.x,y:r.y,w:r.width,h:r.height,inViewport:r.y>=0&&r.bottom<=window.innerHeight,
            topmost:(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)||{}).tagName};
  },testId);
  if(!box) throw new Error('control not found: '+testId);
  await p.waitForTimeout(600);
  const box2=await p.evaluate(id=>{const e=document.querySelector(`[data-test-id="${id}"]`);
    const r=e.getBoundingClientRect();
    return {x:r.x,y:r.y,w:r.width,h:r.height,inViewport:r.y>=0&&r.bottom<=window.innerHeight};},testId);
  if(!box2.inViewport) throw new Error('control still off-screen after scrolling: '+testId+' '+JSON.stringify(box2));
  await p.mouse.click(box2.x+box2.w/2,box2.y+box2.h/2);
  return box2;
}
export async function roundingField(s){
  return await s.page.evaluate(()=>{
    const e=document.querySelector('[data-test-id="select_sales_tax_rounding_mode"]');
    if(!e) return null; const i=e.tagName==='INPUT'?e:e.querySelector('input');
    return {value:i?i.value:null,banner:!!document.querySelector('[data-test-id="banner_sales_tax_rounding_changed"]')};});
}
// Set the rounding mode BY CLICKING the dialog, and prove it stored.
export async function setModeByClicking(s,wantLabel){
  const p=s.page; const sent=[];
  const onReq=rq=>{ if(/workplaces\/change/.test(rq.url())&&rq.method()!=='GET'){
    let b=null; try{b=JSON.parse(rq.postData()||'{}')}catch(e){b={}}
    sent.push({sales_tax_rounding_mode:b.sales_tax_rounding_mode,keys:Object.keys(b).length});}};
  p.on('request',onReq);
  await openLocationDialog(s);
  const before=await roundingField(s);
  const sel=await p.evaluate(()=>{const e=document.querySelector('[data-test-id="select_sales_tax_rounding_mode"]');
    e.scrollIntoView({block:'center',behavior:'instant'});
    const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};});
  await p.mouse.click(sel.x+sel.w-30,sel.y+sel.h/2); await p.waitForTimeout(3000);
  const pick=await p.evaluate(w=>{for(const e of document.querySelectorAll('.q-menu .q-item')){
    if(e.innerText.toLowerCase().includes(w.toLowerCase())){const r=e.getBoundingClientRect();
      return{x:r.x,y:r.y,w:r.width,h:r.height};}} return null;},wantLabel);
  if(!pick) throw new Error('option not offered: '+wantLabel);
  await p.mouse.click(pick.x+pick.w/2,pick.y+pick.h/2); await p.waitForTimeout(3500);
  const afterPick=await roundingField(s);
  await clickTestId(s,'button_save_workplace');
  await p.waitForTimeout(11000);
  p.off('request',onReq);
  return {before,afterPick,sent};
}
export async function psView(s,id=PS){
  const r=await s.api('GET','/api/work-orders/view/'+id);
  const w=r.json.data.work_order;
  return {num:w.number,sub:w.sub_total,tax:w.total_tax_cost,total:w.total_cost,
          invoiceId:w.invoice_id,invoiceStatus:w.invoice_status,status:w.status,
          accountId:w.customer_account_id,companyId:w.company_id};
}
