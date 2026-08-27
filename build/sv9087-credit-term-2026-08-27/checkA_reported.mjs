import { open, APP, WP } from './api.mjs';
import { seedTerm } from './lib.mjs';
import fs from 'node:fs';
const WO='59bdf363-5bfd-4b90-81b1-348cf46fccd6', CID='ebe26bb2-48ab-44bd-b517-f15567887f21';
const dir='/home/user/Manual-test-Cases/build/sv9087-credit-term-2026-08-27/evidence';
const s=await open(); const p=s.page; const log=(...a)=>console.log(...a); const A=(m,pp,b)=>s.api(m,pp,b);
const clickTid=async(t)=>{const b=await p.evaluate(i=>{const e=document.querySelector(`[data-test-id="${i}"]`);if(!e)return null;const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,dis:e.disabled};},t);if(b&&!b.dis)await p.mouse.click(b.x+b.w/2,b.y+b.h/2);return b;};
const dlgBtn=async(re)=>{const b=await p.evaluate(rx=>{const d=[...document.querySelectorAll('.q-dialog')].pop();if(!d)return null;const b=[...d.querySelectorAll('button')].find(x=>new RegExp(rx,'i').test((x.innerText||'').trim()));if(!b)return null;const r=b.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,txt:b.innerText.trim()};},re);if(b)await p.mouse.click(b.x+b.w/2,b.y+b.h/2);return b;};
async function snap(tag){
  await p.waitForTimeout(1500);
  const st=await p.evaluate(()=>{
    const body=document.body.innerText;
    const badge=[...document.querySelectorAll('.q-badge, .q-chip, [class*=badge]')].map(e=>e.innerText.trim()).filter(x=>/complete|invoiced|reversed|approved|paid|over limit/i.test(x));
    const di=document.querySelector('[data-test-id="date_input_invoice_date"]'); const inp=di&&(di.tagName==='INPUT'?di:di.querySelector('input'));
    const invField=inp?inp.value:null;
    const invDoc=(body.match(/invoice date:\s*([a-z]{3} \d{1,2}, \d{4})/i)||[])[1]||null;
    const due=(body.match(/due date:\s*([a-z]{3} \d{1,2}, \d{4})/i)||[])[1]||null;
    const errs=[...document.querySelectorAll('.q-notification,.text-negative')].map(e=>e.innerText.replace(/\s+/g,' ')).filter(e=>/error|ooo|cannot|invalid/i.test(e));
    const blank=body.trim().length<120;
    return {badge:[...new Set(badge)], invField, invDoc, due, errs, blank};
  });
  const wv=(await A('GET','/api/work-orders/view/'+WO)).json.data.work_order;
  log(`[${tag}] status=${wv.status} inv_status=${wv.invoice_status} created=${wv.is_invoice_created} | badge=${JSON.stringify(st.badge)} | invField=${st.invField} invDoc=${st.invDoc} due=${st.due} | blank=${st.blank} | errs=${JSON.stringify(st.errs).slice(0,120)}`);
  await p.screenshot({path:`${dir}/RA-${tag}.png`,fullPage:true});
  return {...st, apiStatus:wv.status, invCreated:wv.is_invoice_created};
}
async function gotoFinance(){ await p.goto(`${APP}/workorders/${WO}/finance`,{waitUntil:'domcontentloaded',timeout:60000}); await p.waitForTimeout(9000); }
async function reverse(){ await clickTid('button_wo_invoice_menu'); await p.waitForTimeout(1500); await clickTid('menu_item_reverse'); await p.waitForTimeout(2000); const c=await dlgBtn('reverse|confirm|yes'); await p.waitForTimeout(5000); return c; }
async function setDate(mmddyyyy){ const box=await p.evaluate(()=>{const di=document.querySelector('[data-test-id="date_input_invoice_date"]');const inp=di&&(di.tagName==='INPUT'?di:di.querySelector('input'));if(!inp)return null;const r=inp.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,cur:inp.value};});
  if(!box) return null; await p.mouse.click(box.x+box.w/2,box.y+box.h/2); await p.waitForTimeout(400);
  await p.keyboard.down('Control'); await p.keyboard.press('KeyA'); await p.keyboard.up('Control'); await p.keyboard.press('Delete');
  await p.keyboard.type(mmddyyyy,{delay:70}); await p.keyboard.press('Tab'); await p.waitForTimeout(3500); return box.cur; }
async function createInvoice(){ const ci=await clickTid('button_create_invoice'); if(!ci||ci.dis) return {dis:true}; await p.waitForTimeout(5000); const cf=await dlgBtn('create|confirm|yes|proceed|^ok$'); if(cf) await p.waitForTimeout(6000); // close payment dialog if it auto-opens
  await p.evaluate(()=>{const e=document.querySelector('[data-test-id="button_close_payment_dialog"]');if(e)e.click();}); await p.waitForTimeout(1500); return {dis:false}; }

await A('POST','/api/iam/change-location',{workplace_id:WP,workplace_timezone:'America/Edmonton'});
log('seed NET 30:', JSON.stringify(await seedTerm(s,CID,'NET 30')));
// reset to Complete (reverse if currently invoiced)
await gotoFinance();
let wv=(await A('GET','/api/work-orders/view/'+WO)).json.data.work_order;
if(wv.is_invoice_created){ log('reversing pre-existing invoice to reach Complete...'); await reverse(); await gotoFinance(); }
// STATE 1 - COMPLETE
await snap('1-complete');
// STATE 2 - INVOICED (original date = today)
await createInvoice(); await gotoFinance(); await snap('2-invoiced');
// STATE 3 - REVERSED
await reverse(); await gotoFinance(); await snap('3-reversed');
// STATE 4 - RE-INVOICE: date defaults to today; CHANGE it BACK to an earlier date (the reported crash)
const before=await setDate('08/21/2026');
log('changed invoice date from '+before+' back to 08/21/2026');
await snap('4a-date-changed-back');   // crash test: error? due recompute?
await createInvoice(); await gotoFinance(); await snap('4b-reinvoiced-backdated');
fs.writeFileSync('/tmp/sv9087/ra-state.json',JSON.stringify({WO,CID}));
await s.browser.close();
