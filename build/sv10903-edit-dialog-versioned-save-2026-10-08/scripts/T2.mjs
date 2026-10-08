import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page; const R=JSON.parse(fs.readFileSync('ids.json')); const id=R.rows['2']; const L=[]; const t0=Date.now(); const ts=()=>((Date.now()-t0)/1000).toFixed(1);
const hook=(pg,tag)=>{ pg.on('request',r=>{ if(/bank-transactions\/[^/]+\/(details|party|splits)/.test(r.url())) L.push(ts()+` ${tag} SEND `+r.method()+' '+r.url().split('/').pop()+' '+(r.postData()||'').slice(0,250)); }); pg.on('response',async r=>{ if(/bank-transactions\/[^/]+\/(details|party|splits)/.test(r.url())){ let b=''; try{b=await r.text()}catch(e){} L.push(ts()+` ${tag} RECV `+r.status()+' '+b.replace(/"bank_transaction":\{.*?"mutation_version":(\d+).*$/,'v=$1').slice(0,200)); }}); };
hook(p,'tab1');
const mk=pg=>{ const box=async t=>{ await pg.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.scrollIntoView({block:'center',inline:'center'}),t); await pg.waitForTimeout(200); const e=await pg.$(`[data-test-id="${t}"]`); if(!e) return null; const q=await e.boundingBox(); return q&&{x:q.x+q.width/2,y:q.y+q.height/2}; };
 const click=async t=>{ const b=await box(t); if(!b) throw new Error('no '+t); await pg.mouse.click(b.x,b.y); await pg.waitForTimeout(600); };
 const pickItem=async label=>{ for(let i=0;i<10;i++){ const o=await pg.evaluate(l=>{const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>x.getBoundingClientRect().width>0&&x.innerText.includes(l)); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};},label); if(o){ await pg.mouse.click(o.x,o.y); await pg.waitForTimeout(500); return; } await pg.waitForTimeout(300);} throw new Error('no item '+label); };
 const open=async()=>{ await pg.goto(s.host.app+'/accounting/banking/transactions',{waitUntil:'domcontentloaded'}); await pg.waitForTimeout(4500); await click('card_account_accounting_bank_transactions_'+R.bank); await pg.waitForTimeout(2500); };
 return {box,click,pickItem,open}; };
const A=mk(p); await A.open();
await A.click('button_actions_accounting_bank_transactions_'+id); await A.click('button_edit_accounting_bank_transactions_'+id); await p.waitForTimeout(800); L.push(ts()+' tab1: Edit dialog open on ZZ10903-2');
// tab 2 changes the account inline
const p2=await s.ctx.newPage(); await p2.setViewportSize({width:1600,height:1000}); hook(p2,'tab2'); const B=mk(p2); await B.open();
await B.click('select_inline_account_'+id+'_accounting_bank_transactions'); await p2.keyboard.type('5100'); await p2.waitForTimeout(900); await B.pickItem('5100 Shop Supplies'); await p2.waitForTimeout(2500); L.push(ts()+' tab2: Account changed to 5100 Shop Supplies COGS'); await p2.screenshot({path:'T2-tab2.png'});
// tab 1 edits memo + payee and saves
await p.bringToFront(); await A.click('input_memo_accounting_bank_details'); await p.keyboard.type('ZZ dialog memo 2'); await A.click('input_payee_accounting_bank_details'); await p.keyboard.type('ZZ Payee 2');
await A.click('button_save_accounting_bank_details'); await p.waitForTimeout(3000);
const dlg=async()=>p.evaluate(()=>{const b=document.querySelector('[data-test-id="banner_error_accounting_bank_details"]'); const sv=document.querySelector('[data-test-id="button_save_accounting_bank_details"]'); const v=t=>document.querySelector(`[data-test-id="${t}"]`)?.value; return {banner:b?.innerText.replace(/\s+/g,' '),reload:!!document.querySelector('[data-test-id="button_reload_accounting_bank_details"]'),dismiss:!!document.querySelector('[data-test-id="button_dismiss_error_accounting_bank_details"]'),saveDisabled:sv?(sv.disabled||sv.classList.contains('disabled')||sv.getAttribute('aria-disabled')==='true'):null,memo:v('input_memo_accounting_bank_details'),payee:v('input_payee_accounting_bank_details'),account:v('select_category_accounting_bank_details'),open:!!sv};});
L.push(ts()+' tab1 dialog after Save: '+JSON.stringify(await dlg())); await p.screenshot({path:'T2-banner.png'});
const geo=await p.evaluate(()=>{const r=t=>{const e=document.querySelector(`[data-test-id="${t}"]`); const q=e?.getBoundingClientRect(); return q?[q.x,q.y,q.width,q.height].map(Math.round):null;}; return {banner:r('banner_error_accounting_bank_details'),reload:r('button_reload_accounting_bank_details'),save:r('button_save_accounting_bank_details'),memo:r('input_memo_accounting_bank_details'),payee:r('input_payee_accounting_bank_details'),account:r('select_category_accounting_bank_details'),dialog:(()=>{const q=document.querySelector('.q-dialog .q-card')?.getBoundingClientRect(); return q?[q.x,q.y,q.width,q.height].map(Math.round):null;})()};}); L.push('geo banner '+JSON.stringify(geo));
// Enter must not submit
await A.click('input_memo_accounting_bank_details'); await p.keyboard.press('Enter'); await p.waitForTimeout(1500); L.push(ts()+' pressed Enter in memo (should send nothing)');
// Reload
await A.click('button_reload_accounting_bank_details'); await p.waitForTimeout(3000); L.push(ts()+' tab1 dialog after Reload: '+JSON.stringify(await dlg())); await p.screenshot({path:'T2-after-reload.png'});
// save again with memo
await A.click('input_memo_accounting_bank_details'); await p.keyboard.press('Control+A'); await p.keyboard.type('ZZ dialog memo 2'); await A.click('button_save_accounting_bank_details'); await p.waitForTimeout(3500);
L.push(ts()+' after second Save: '+JSON.stringify(await dlg())+' notif '+await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ')).join('|')));
const t=(await s.api('/api/accounting/bank-transactions?account_id='+R.chart+'&per_page=20')).json.bank_transactions.find(x=>x.id===id); L.push('saved row: account='+t.category_account_name+' memo='+t.memo+' payee='+t.payee_name+' v='+t.mutation_version);
fs.writeFileSync('T2.json',JSON.stringify(L,null,1)); console.log(L.join('\n'));
await s.close();
