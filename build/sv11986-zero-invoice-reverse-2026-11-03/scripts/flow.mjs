// usage: ENV=branch|prod node flow.mjs <woId> <customerId> <tag> [skipReinvoice]
// On screen: (A) try Reverse while Paid, (B) delete the payment on Customer > Payments, (C) read statuses, (D) Reverse, (E) Create Invoice again.
import {sess} from './common.mjs'; import fs from 'fs';
const [WO,CID,TAG,NORE]=process.argv.slice(2); const OUT=`ev/${TAG}`; fs.mkdirSync(OUT,{recursive:true}); const s=await sess(); const p=s.page;
const R={marker:await s.marker(),utc:new Date().toISOString(),wo:WO,steps:[]}; const caps=[];
p.on('response',async r=>{const q=r.request(); if(q.method()!=='GET'&&r.url().includes('/api/')){let b='';try{b=(await r.text()).slice(0,400)}catch{} caps.push({m:q.method(),u:r.url().replace(/^https:\/\/[^/]+/,''),st:r.status(),req:(q.postData()||'').slice(0,300),res:b});}});
let n=0; const shot=async name=>{n++; const f=`${OUT}/${String(n).padStart(2,'0')}-${name}.png`; await p.screenshot({path:f}); return f;};
const state=async label=>{ const v=(await s.api('/api/work-orders/view/'+WO)).json?.data; const w=v?.work_order||v||{}; const st={label,wo_status:w.status,invoice_status:w.invoice_status,invoice_id:w.invoice_id,is_invoice_created:w.is_invoice_created,amount_paid:w.amount_paid,balance:w.balance,total:w.total_cost};
  const acc=w.customer_account_id||R.acc; if(acc){ const pl=(await s.api(`/api/customer-payment/list?accountId=${acc}&pagination%5BrowsPerPage%5D=1000&pagination%5BsortBy%5D=date&pagination%5Bdescending%5D=true`)).json?.data?.collection||[]; st.payments=pl.filter(x=>(x.payment_statements||[]).some(ps=>ps.work_order_id===WO)).map(x=>({id:x.id,amt:x.payment_statements_amount,status:(x.payment_statements||[]).map(ps=>ps.payment_statement_status).join(',')})); }
  R.steps.push(st); return st; };
const dlg=()=>p.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].pop(); return d?{text:d.innerText.replace(/\s+/g,' ').slice(0,400),btns:[...d.querySelectorAll('button')].map(b=>({t:b.innerText.trim(),id:b.getAttribute('data-test-id')}))}:null;});
const toasts=()=>p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(x=>x.innerText.replace(/\s+/g,' ')));
const confirm=async(tag)=>{ const out=[]; for(let i=0;i<3;i++){ const d=await dlg(); if(!d) break; out.push(d); const b=d.btns.find(b=>/are you sure/i.test(b.t))||d.btns.find(b=>/^(yes|confirm|delete|remove|reverse|ok|continue|submit)/i.test(b.t)&&!/cancel|no/i.test(b.t)); if(!b) break;
   await shot(`${tag}-dialog-${i+1}`); await p.locator('.q-dialog button',{hasText:b.t}).last().click(); await p.waitForTimeout(1800); } out.push({toasts:await toasts()}); return out; };
const finMenu=async()=>{ await s.go(`/workorders/${WO}/finance`); await p.waitForTimeout(7000); for(let i=0;i<2;i++){const x=p.locator('.q-dialog [data-test-id="button_close_dialog"]').first(); if(await x.count()){await x.click().catch(()=>{}); await p.waitForTimeout(600);}}
  const badge=await p.locator('[data-test-id="badge_wo_status"]').first().innerText().catch(()=>null); await p.click('[data-test-id="button_wo_invoice_menu"]'); await p.waitForTimeout(1000);
  const items=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(i=>({id:i.getAttribute('data-test-id'),t:i.innerText.trim(),dis:i.classList.contains('disabled')||i.getAttribute('aria-disabled')==='true'}))); return {badge,items}; };
const reverse=async tag=>{ const m=await finMenu(); const r={badge:m.badge,menu:m.items}; await shot(`${tag}-menu`); const it=m.items.find(i=>/revers/i.test(i.t)); if(!it){r.err='no reverse item'; await p.keyboard.press('Escape'); return r;}
  await p.locator('.q-menu .q-item',{hasText:it.t}).first().click(); await p.waitForTimeout(1800); r.afterClick={dialog:await dlg(),toasts:await toasts()}; await shot(`${tag}-after-click`);
  r.confirm=await confirm(tag); await p.waitForTimeout(1500); await shot(`${tag}-result`); return r; };
await state('start'); R.A_reverseWhilePaid=await reverse('A-reverse-while-paid'); await state('after A');
// B: delete the payment on Customer > Payments
await s.go(`/customers/${CID}/payments`); await p.waitForTimeout(6000); const pid=R.steps[0].payments?.[0]?.id; R.paymentId=pid; await shot('B-payments-before');
if(pid){ await p.click(`[data-test-id="button_remove_payment_${pid}"]`); await p.waitForTimeout(1500); R.B_delete={dialog:await dlg(),confirm:await confirm('B-delete-payment')}; await s.go(`/customers/${CID}/payments`); await p.waitForTimeout(6000); await shot('B-payments-after');
  R.B_rows=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(t=>t.innerText.replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,4)); }
await state('after B delete payment');
await s.go(`/workorders/${WO}/finance`); await p.waitForTimeout(6000); R.C_badge=await p.locator('[data-test-id="badge_wo_status"]').first().innerText().catch(()=>null); await shot('C-finance-after-delete');
await s.go(`/customers/${CID}/invoices`); await p.waitForTimeout(6000); R.C_invoiceRows=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(t=>t.innerText.replace(/\s+/g,' ').trim()).filter(t=>/S\d|Invoice/.test(t)).slice(0,4)); await shot('C-customer-invoices');
R.D_reverse=await reverse('D-reverse'); await state('after D reverse');
const dn=((await s.api('/api/work-orders/view/'+WO)).json?.data?.work_order||{}).display_number;
await s.go(`/customers/${CID}/invoices`); await p.waitForTimeout(6000); R.D_invoiceRows=await p.evaluate(dn=>[...document.querySelectorAll('tbody tr')].map(t=>t.innerText.replace(/\s+/g,' ').trim()).filter(t=>t.includes(dn)).slice(0,4),dn); await shot('D-customer-invoices-after-reverse');
await s.go(`/workorders?search=${encodeURIComponent(dn)}`); await p.waitForTimeout(6000); R.D_woList=await p.evaluate(dn=>[...document.querySelectorAll('tbody tr')].map(t=>t.innerText.replace(/\s+/g,' ').trim()).filter(t=>t.includes(dn)).slice(0,2),dn); await shot('D-wo-list-after-reverse');
if(!NORE){ await s.go(`/workorders/${WO}/finance`); await p.waitForTimeout(7000); const ci=p.locator('[data-test-id="button_create_invoice"]'); R.E={createBtn:await ci.count()}; if(R.E.createBtn){ await ci.first().click(); await p.waitForTimeout(2500); R.E.confirm=await confirm('E-create-invoice'); await p.waitForTimeout(2500); await shot('E-reinvoiced'); } await state('after E re-invoice'); }
R.caps=caps.filter(c=>!/collect|log/.test(c.u)); fs.writeFileSync(`${OUT}/result.json`,JSON.stringify(R,null,1)); console.log(JSON.stringify({steps:R.steps,A:R.A_reverseWhilePaid,B:R.B_delete,Brows:R.B_rows,C:R.C_invoiceRows,D:R.D_reverse,E:R.E,caps:R.caps.map(c=>c.m+' '+c.u+' '+c.st+' '+c.res.slice(0,150))},null,1).slice(0,9000));
await s.close(); process.exit(0);
