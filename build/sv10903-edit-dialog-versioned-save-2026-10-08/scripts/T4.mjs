import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page; const R=JSON.parse(fs.readFileSync('ids.json')); const L=[]; const t0=Date.now(); const ts=()=>((Date.now()-t0)/1000).toFixed(1);
const hook=(pg,tag)=>{ pg.on('response',async r=>{ if(/bank-transactions\/[^/]+\/(details|party|splits)/.test(r.url())){ let b=''; try{b=await r.text()}catch(e){} L.push(ts()+` ${tag} ${r.request().method()} ${r.status()} `+(JSON.parse(b||'{}').error||'')+' body='+(r.request().postData()||'').slice(0,160)); }}); };
hook(p,'tab1');
const mk=pg=>{ const box=async t=>{ await pg.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.scrollIntoView({block:'center',inline:'center'}),t); await pg.waitForTimeout(200); const e=await pg.$(`[data-test-id="${t}"]`); if(!e) return null; const q=await e.boundingBox(); return q&&{x:q.x+q.width/2,y:q.y+q.height/2}; };
 const click=async t=>{ const b=await box(t); if(!b) throw new Error('no '+t); await pg.mouse.click(b.x,b.y); await pg.waitForTimeout(600); };
 const open=async()=>{ await pg.goto(s.host.app+'/accounting/banking/transactions',{waitUntil:'domcontentloaded'}); await pg.waitForTimeout(4500); await click('card_account_accounting_bank_transactions_'+R.bank); await pg.waitForTimeout(2500); };
 return {box,click,open}; };
const menuState=async id=>p.evaluate(id=>{const q=t=>document.querySelector(`[data-test-id="${t}_accounting_bank_transactions_${id}"]`); const st=e=>e?(e.classList.contains('disabled')||e.getAttribute('aria-disabled')==='true'):null; return {editDisabled:st(q('button_edit')),splitDisabled:st(q('button_split'))};},id);
const A=mk(p); await A.open(); const p2=await s.ctx.newPage(); await p2.setViewportSize({width:1600,height:1000}); hook(p2,'tab2'); const B=mk(p2); await B.open(); await p.bringToFront();
// --- 4a: lock from the Edit dialog's own 409, then Cancel
const id4=R.rows['6'];
await A.click('button_actions_accounting_bank_transactions_'+id4); await A.click('button_edit_accounting_bank_transactions_'+id4); await p.waitForTimeout(800);
await p2.bringToFront(); await B.click('button_expand_accounting_bank_transactions_'+id4); await B.click('input_inline_memo_'+id4+'_accounting_bank_transactions'); await p2.keyboard.type('ZZ tab2 memo 4'); await p2.keyboard.press('Tab'); await p2.waitForTimeout(2500);
await p.bringToFront(); await A.click('input_payee_accounting_bank_details'); await p.keyboard.type('ZZ Payee 4'); await A.click('button_save_accounting_bank_details'); await p.waitForTimeout(3000);
L.push(ts()+' banner: '+await p.evaluate(()=>document.querySelector('[data-test-id="banner_error_accounting_bank_details"]')?.innerText.replace(/\s+/g,' ')));
L.push('save state: '+await p.evaluate(()=>!!document.querySelector('[data-test-id="button_cancel_accounting_bank_details"]'))); console.log(L.join('\n')); await A.click('button_cancel_accounting_bank_details'); await p.waitForTimeout(800);
await A.click('button_actions_accounting_bank_transactions_'+id4); await p.waitForTimeout(500); L.push(ts()+' row 4 menu after dialog conflict + Cancel: '+JSON.stringify(await menuState(id4))); await p.screenshot({path:'T4a-menu-locked.png'}); await p.keyboard.press('Escape'); await p.waitForTimeout(400);
L.push('row 4 text: '+await p.evaluate(id=>document.querySelector(`[data-test-id="row_accounting_bank_transactions_${id}"]`)?.innerText.replace(/\s+/g,' '),id4));
L.push('row 4 tids: '+JSON.stringify(await p.evaluate(id=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>t.includes(id)&&/reload|notice|stale/.test(t)),id4)));
await p.screenshot({path:'T4a-row.png'}); console.log(L.join('\n'));
if(await A.box('button_reload_party_accounting_bank_transactions_'+id4)){ await A.click('button_reload_party_accounting_bank_transactions_'+id4); } else { L.push('NO row reload button; reopening the dialog is blocked?'); }
await p.waitForTimeout(2500);
await A.click('button_actions_accounting_bank_transactions_'+id4); await p.waitForTimeout(500); L.push(ts()+' row 4 menu after row Reload: '+JSON.stringify(await menuState(id4))); await p.keyboard.press('Escape'); await p.waitForTimeout(400);
// later write on the same row still runs: inline memo then Edit-dialog payee
await A.click('button_expand_accounting_bank_transactions_'+id4).catch(()=>{}); await p.waitForTimeout(400);
const memoVal=await p.evaluate(id=>document.querySelector(`[data-test-id="input_inline_memo_${id}_accounting_bank_transactions"]`)?.value,id4); L.push('row 4 memo field after Reload: '+memoVal);
await A.click('input_inline_memo_'+id4+'_accounting_bank_transactions'); await p.keyboard.press('Control+A'); await p.keyboard.type('ZZ tab1 memo 4 after reload'); await p.keyboard.press('Tab'); await p.waitForTimeout(2500);
await A.click('button_actions_accounting_bank_transactions_'+id4); await A.click('button_edit_accounting_bank_transactions_'+id4); await p.waitForTimeout(800); await A.click('input_payee_accounting_bank_details'); await p.keyboard.type('ZZ Payee 4'); await A.click('button_save_accounting_bank_details'); await p.waitForTimeout(3000);
const t=(await s.api('/api/accounting/bank-transactions?account_id='+R.chart+'&per_page=20')).json.bank_transactions.find(x=>x.id===id4); L.push('row 4 saved: memo='+t.memo+' payee='+t.payee_name+' v='+t.mutation_version);
// row 3 (locked in T3 in another session) - fresh page shows it unlocked; normal edit regression on row 5
const id5=R.rows['7']; await A.click('button_actions_accounting_bank_transactions_'+id5); await A.click('button_edit_accounting_bank_transactions_'+id5); await p.waitForTimeout(800);
await A.click('input_memo_accounting_bank_details'); await p.keyboard.type('ZZ plain edit 5'); await A.click('input_payee_accounting_bank_details'); await p.keyboard.type('ZZ Payee 5'); await A.click('button_save_accounting_bank_details'); await p.waitForTimeout(2500);
L.push(ts()+' row 5 notif: '+await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ')).join('|')));
const t5=(await s.api('/api/accounting/bank-transactions?account_id='+R.chart+'&per_page=20')).json.bank_transactions.find(x=>x.id===id5); L.push('row 5 saved: memo='+t5.memo+' payee='+t5.payee_name+' v='+t5.mutation_version);
fs.writeFileSync('T4.json',JSON.stringify(L,null,1)); console.log(L.join('\n'));
await s.close();
