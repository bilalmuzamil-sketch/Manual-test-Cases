import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page; const R=JSON.parse(fs.readFileSync('ids.json')); const L=[]; const G={};
const mk=pg=>{ const box=async t=>{ await pg.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.scrollIntoView({block:'center',inline:'center'}),t); await pg.waitForTimeout(200); return pg.evaluate(t=>{const e=[...document.querySelectorAll(`[data-test-id="${t}"]`)].map(x=>x.getBoundingClientRect()).filter(q=>q.width>0).pop(); return e?{x:e.x+e.width/2,y:e.y+e.height/2}:null;},t); };
 const click=async t=>{ const b=await box(t); if(!b) throw new Error('no '+t); await pg.mouse.click(b.x,b.y); await pg.waitForTimeout(700); };
 const pickItem=async label=>{ for(let i=0;i<10;i++){ const o=await pg.evaluate(l=>{const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>x.getBoundingClientRect().width>0&&x.innerText.includes(l)); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};},label); if(o){ await pg.mouse.click(o.x,o.y); await pg.waitForTimeout(500); return; } await pg.waitForTimeout(300);} throw new Error('no item '+label); };
 const open=async()=>{ await pg.goto(s.host.app+'/accounting/banking/transactions',{waitUntil:'domcontentloaded'}); await pg.waitForTimeout(4500); await click('card_account_accounting_bank_transactions_'+R.bank); await pg.waitForTimeout(2500); };
 return {box,click,pickItem,open}; };
const geo=(pg,ts)=>pg.evaluate(ts=>Object.fromEntries(ts.map(t=>{const e=[...document.querySelectorAll(`[data-test-id="${t}"]`)].map(x=>x.getBoundingClientRect()).filter(q=>q.width>0).pop(); return [t,e?[e.x,e.y,e.width,e.height].map(Math.round):null];})),ts);
const dlgBox=pg=>pg.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog .q-card')].map(x=>x.getBoundingClientRect()).filter(q=>q.width>0).pop(); return q?[q.x,q.y,q.width,q.height].map(Math.round):null;});
const A=mk(p); await A.open(); const p2=await s.ctx.newPage(); await p2.setViewportSize({width:1600,height:1000}); const B=mk(p2); await B.open(); await p.bringToFront();
// ---- Item 2 on ZZ10903-4
const id4=R.rows['4']; const memo4=(await s.api('/api/accounting/bank-transactions?account_id='+R.chart+'&per_page=30')).json.bank_transactions.find(x=>x.id===R.rows['4'])?.status; L.push('row 4 status before: '+memo4);
await A.open(); await A.click('button_actions_accounting_bank_transactions_'+id4); await A.click('button_edit_accounting_bank_transactions_'+id4); await p.waitForTimeout(800);
await p2.bringToFront(); await B.open(); await B.click('button_actions_accounting_bank_transactions_'+id4); await B.click('button_match_menu_accounting_bank_transactions_'+id4); await p2.waitForTimeout(1200);
await B.click('button_pick_entry_accounting_bank_match_'+R.je4); await p2.waitForTimeout(600);
await p2.screenshot({path:'W2-match-dialog.png'}); await B.click('button_confirm_dialog'); await p2.waitForTimeout(1200);
const after=await p2.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].filter(e=>e.getBoundingClientRect().width>0).map(e=>(e.getAttribute('data-test-id')||'')+'|'+e.innerText.trim()));
L.push('after Match entry, dialog buttons: '+JSON.stringify(after));
const sure=await p2.evaluate(()=>{const e=[...document.querySelectorAll('.q-dialog button')].find(x=>x.getBoundingClientRect().width>0&&/are you sure|confirm|match entry/i.test(x.innerText)); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText};});
if(sure&&/are you sure/i.test(sure.t)){ await p2.mouse.click(sure.x,sure.y); await p2.waitForTimeout(1500); L.push('clicked second confirm: '+sure.t); }
const steps='clicked';
await p2.waitForTimeout(2500); L.push('match steps '+JSON.stringify(steps).slice(0,200)+' notif: '+await p2.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ')).join('|')));
const st=(await s.api('/api/accounting/bank-transactions?account_id='+R.chart+'&per_page=30&tab=categorized')).json.bank_transactions.find(x=>x.id===id4); L.push('ZZ10903-4 status now '+st?.status);
await p.bringToFront(); await A.click('input_memo_accounting_bank_details'); await p.keyboard.type('ZZ memo typed'); await A.click('button_save_accounting_bank_details');
let toast=''; for(let i=0;i<16&&!toast;i++){ toast=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ')).join('|')); if(!toast) await p.waitForTimeout(200); }
await p.waitForTimeout(300); G.i2={dialog:await dlgBox(p),toast:await p.evaluate(()=>{const q=[...document.querySelectorAll('.q-notification')].map(x=>x.getBoundingClientRect()).filter(q=>q.width>0).pop(); return q?[q.x,q.y,q.width,q.height].map(Math.round):null;}),...await geo(p,['input_memo_accounting_bank_details','button_save_accounting_bank_details'])};
await p.screenshot({path:'W2-i2-toast.png'}); L.push('i2 toast: '+toast+' | banner? '+await p.evaluate(()=>!!document.querySelector('[data-test-id="banner_error_accounting_bank_details"]'))+' dismiss? '+await p.evaluate(()=>!!document.querySelector('[data-test-id="button_dismiss_error_accounting_bank_details"]'))+' dialog open? '+await p.evaluate(()=>!!document.querySelector('[data-test-id="button_save_accounting_bank_details"]')));
fs.writeFileSync('W2.json',JSON.stringify({L,G},null,1)); console.log(L.join('\n')); console.log(JSON.stringify(G));
await s.close();
