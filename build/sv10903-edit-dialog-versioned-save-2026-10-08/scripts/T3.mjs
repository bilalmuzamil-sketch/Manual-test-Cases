import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page; const R=JSON.parse(fs.readFileSync('ids.json')); const L=[]; const t0=Date.now(); const ts=()=>((Date.now()-t0)/1000).toFixed(1);
const hook=(pg,tag)=>{ pg.on('response',async r=>{ if(/bank-transactions\/[^/]+\/(details|party|splits)/.test(r.url())){ let b=''; try{b=await r.text()}catch(e){} L.push(ts()+` ${tag} ${r.request().method()} ${r.status()} `+(JSON.parse(b||'{}').error||'')); }}); };
hook(p,'tab1');
const mk=pg=>{ const box=async t=>{ await pg.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.scrollIntoView({block:'center',inline:'center'}),t); await pg.waitForTimeout(200); const e=await pg.$(`[data-test-id="${t}"]`); if(!e) return null; const q=await e.boundingBox(); return q&&{x:q.x+q.width/2,y:q.y+q.height/2}; };
 const click=async t=>{ const b=await box(t); if(!b) throw new Error('no '+t); await pg.mouse.click(b.x,b.y); await pg.waitForTimeout(600); };
 const open=async()=>{ await pg.goto(s.host.app+'/accounting/banking/transactions',{waitUntil:'domcontentloaded'}); await pg.waitForTimeout(4500); await click('card_account_accounting_bank_transactions_'+R.bank); await pg.waitForTimeout(2500); };
 return {box,click,open}; };
const menuState=async id=>p.evaluate(id=>{const q=t=>document.querySelector(`[data-test-id="${t}_accounting_bank_transactions_${id}"]`); const st=e=>e?{text:e.innerText.replace(/\s+/g,' ').trim(),disabled:e.classList.contains('disabled')||e.getAttribute('aria-disabled')==='true'||e.hasAttribute('disabled')}:null; return {edit:st(q('button_edit')),split:st(q('button_split')),match:st(q('button_match_menu'))};},id);
const A=mk(p); await A.open();
const p2=await s.ctx.newPage(); await p2.setViewportSize({width:1600,height:1000}); hook(p2,'tab2'); const B=mk(p2); await B.open();
// --- 3a: inline save refused -> row locked
const id3=R.rows['3'];
await B.click('button_expand_accounting_bank_transactions_'+id3); await B.click('input_inline_memo_'+id3+'_accounting_bank_transactions'); await p2.keyboard.type('ZZ tab2 memo 3'); await p2.keyboard.press('Tab'); await p2.waitForTimeout(2500); L.push(ts()+' tab2 changed row 3 memo');
await p.bringToFront(); await A.click('button_expand_accounting_bank_transactions_'+id3); await A.click('input_inline_memo_'+id3+'_accounting_bank_transactions'); await p.keyboard.type('ZZ tab1 memo 3'); await p.keyboard.press('Tab'); await p.waitForTimeout(3000);
await A.click('button_actions_accounting_bank_transactions_'+id3); await p.waitForTimeout(600); L.push(ts()+' row 3 menu after the refused inline save: '+JSON.stringify(await menuState(id3)));
await p.screenshot({path:'T3a-row-locked-menu.png'});
const g3=await p.evaluate(id=>{const r=t=>{const e=document.querySelector(`[data-test-id="${t}"]`); const q=e?.getBoundingClientRect(); return q?[q.x,q.y,q.width,q.height].map(Math.round):null;}; return {row:r('row_accounting_bank_transactions_'+id),edit:r('button_edit_accounting_bank_transactions_'+id),split:r('button_split_accounting_bank_transactions_'+id)};},id3); L.push('geo3 '+JSON.stringify(g3));
L.push('row 3 notice: '+await p.evaluate(id=>{const r=document.querySelector(`[data-test-id="row_accounting_bank_transactions_${id}"]`); let n=r?.nextElementSibling; return (r?.innerText+' || '+(n?.innerText||'')).replace(/\s+/g,' ').slice(0,300);},id3));
L.push('row 3 reload tids: '+JSON.stringify(await p.evaluate(id=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>t.includes(id)&&/reload|retry|stale|notice/.test(t)),id3)));
// try clicking the disabled Edit
const eb=await A.box('button_edit_accounting_bank_transactions_'+id3); if(eb){ await p.mouse.click(eb.x,eb.y); await p.waitForTimeout(800); } L.push('dialog opened after clicking disabled Edit? '+await p.evaluate(()=>!!document.querySelector('[data-test-id="button_save_accounting_bank_details"]')));
await p.keyboard.press('Escape'); await p.waitForTimeout(400);
fs.writeFileSync('T3.json',JSON.stringify(L,null,1)); console.log(L.join('\n'));
await s.close();
