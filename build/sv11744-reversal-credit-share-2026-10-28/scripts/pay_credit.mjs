// creates a credit memo (API set-up), then on SCREEN ticks the given invoices + the credit and pays with the credit only
// usage: node pay_credit.mjs <env> <tag> <memoAmount> <invoiceDisplayNumbers comma>
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,tag,memoAmt,invs]=[process.argv[2],process.argv[3],+process.argv[4],process.argv[5].split(',')]; const S=JSON.parse(fs.readFileSync(`/tmp/s11744/seed-${env}-${tag}.json`,'utf8'));
const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'11744',cookies,dir:(process.env.QA_DIR||'/tmp/qa23'),user:'bilal.muzamil@shopview.com'}); const p=s.page;
const post=(pp,b)=>s.api(pp,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const acct=S.wos[0].inv.data.customer_account_id;
if(memoAmt>0){ const m=await post('/api/credit-memos',{customer_account_id:acct,amount:memoAmt}); console.log('memo',m.status,JSON.stringify(m.json).slice(0,200)); }
const caps=[]; p.on('request',r=>{ if(r.method()!=='GET'&&/shopview\.com\/api\//.test(r.url())) caps.push(r.method()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' :: '+(r.postData()||'').slice(0,1500)); });
await s.go(`/customers/${S.cid}/invoices`); await p.waitForTimeout(3000);
const rows=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id="table-unpaid-transactions"] tbody tr')].map((tr,i)=>({i,t:(tr.innerText||'').replace(/\s+/g,' ').trim().slice(0,140)})));
console.log(rows.map(r=>r.i+': '+r.t).join('\n'));
const want=rows.filter(r=>invs.some(n=>r.t.includes(n))||(!process.env.NOCREDIT&&/CM-|Credit/i.test(r.t))).map(r=>r.i);
for(const i of want){ const b=await p.evaluate(ix=>{ const tr=document.querySelectorAll('[data-test-id="table-unpaid-transactions"] tbody tr')[ix]; const c=tr.querySelector('.q-checkbox,[role=checkbox]'); const r=(c||tr.querySelector('td')).getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; },i); await p.mouse.click(b.x,b.y); await p.waitForTimeout(300); }
await p.screenshot({path:`/tmp/s11744/${tag}-ticked.png`});
const nb=await p.evaluate(()=>{const e=document.querySelector('[data-test-id="button_new_payment"]'); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,dis:e.disabled||e.getAttribute('aria-disabled')};}); console.log('new payment button',JSON.stringify(nb));
await p.mouse.click(nb.x,nb.y); await p.waitForTimeout(2500);
const D=await p.evaluate(()=>(document.querySelector('.q-dialog')?.innerText||'').replace(/\s+/g,' ').slice(0,900)); console.log('dialog:',D);
await p.screenshot({path:`/tmp/s11744/${tag}-dialog.png`});
const meth=process.argv[6]||'Cash'; { const sb=await p.evaluate(()=>{const e=document.querySelector('[data-test-id="select_payment_method"]'); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};}); await p.mouse.click(sb.x,sb.y); await p.waitForTimeout(1500); console.log('menu items:',await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item, [role=option]')].map(e=>(e.innerText||'').trim()).join('|')));
  const o=await p.evaluate(m=>{ const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>(x.innerText||'').trim().toLowerCase()===m.toLowerCase()); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; },meth); if(o){ await p.mouse.click(o.x,o.y); await p.waitForTimeout(600);} }
const ins=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog input')].filter(e=>e.getBoundingClientRect().width>0).map(e=>({tid:e.getAttribute('data-test-id')||e.closest('[data-test-id]')?.getAttribute('data-test-id'),v:e.value})));
console.log('inputs',JSON.stringify(ins));
if(!process.env.NORETYPE) for(const h of await p.$$('.q-dialog table input')){ const v=await h.inputValue(); if(/^[0-9.]+$/.test(v)&&+v>0){ await h.click({clickCount:3}); await h.type(v); await p.keyboard.press('Tab'); await p.waitForTimeout(500);} }
if(process.env.ROWAMT){ for(const kv of process.env.ROWAMT.split(',')){ const [no,v]=kv.split('='); const rows=await p.$$('.q-dialog table tbody tr'); for(const tr of rows){ if(((await tr.innerText())||'').includes(no)){ let h=null; for(const i of await tr.$$('input')){ if(await i.isVisible()) h=i; } await h.click({clickCount:3}); await h.type(v); await p.keyboard.press('Tab'); await p.waitForTimeout(500); } } } }
await p.fill('[data-test-id="input_memo"]','ZZAUTOTEST '+tag); await p.keyboard.press('Tab'); await p.waitForTimeout(800);
if(process.argv[7]){ await p.fill('[data-test-id="input_payment_amount"]',process.argv[7]); await p.keyboard.press('Tab'); await p.waitForTimeout(600); }
console.log('dialog after:',await p.evaluate(()=>(document.querySelector('.q-dialog')?.innerText||'').replace(/\s+/g,' ').slice(0,600)));
await p.screenshot({path:`/tmp/s11744/${tag}-dialog-ready.png`});
const mk=await p.evaluate(()=>{const e=document.querySelector('[data-test-id="button_make_payment"]'); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,dis:e.disabled};});
console.log('make payment',JSON.stringify(mk));
console.log('errors:',await p.evaluate(()=>[...document.querySelectorAll('.q-dialog .q-field--error')].map(e=>(e.innerText||'').replace(/\s+/g,' ').slice(0,80)).join(' || ')));
console.log('vue state:',await p.evaluate(()=>{ const el=document.querySelector('[data-test-id="button_make_payment"]'); let c=el.__vueParentComponent; for(let i=0;i<12&&c;i++){ const st=c.setupState; if(st&&('disableMakePaymentButton' in st)) return JSON.stringify({form:st.isFormValid,zero:st.hasZeroAmountSelectedInvoice,total:st.totalAmountToPay,method:st.paymentMethod,req:st.requiresCashPayment,dep:st.isDepositOverpayment,sel:(st.selectedInvoiceTransactions||[]).length}); c=c.parent; } return 'not found'; }));
console.log('select state',await p.evaluate(()=>{const e=document.querySelector('[data-test-id="select_payment_method"]'); return e.className+' aria-disabled='+e.getAttribute('aria-disabled')+' '+(e.closest('.q-field')?.className||'');}));
if(mk){ await p.mouse.move(mk.x,mk.y); await p.waitForTimeout(1500); console.log('tooltip:',await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].map(e=>e.innerText).join(' | '))); } if(mk&&!mk.dis&&!process.env.DRY){ await p.mouse.click(mk.x,mk.y); await p.waitForTimeout(4000); }
console.log('requests:\n'+caps.filter(x=>!/recent-entities/.test(x)).join('\n'));
await s.close();
