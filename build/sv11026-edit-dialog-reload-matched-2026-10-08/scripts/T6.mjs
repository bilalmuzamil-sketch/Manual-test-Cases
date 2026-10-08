// SV-10903 regression. (a) row 10: inline memo save held in flight, Edit opened, Account changed, Save -> both stick.
// (b) row 6: tab2 changes the row; tab1 inline memo refused -> row notice, Edit/Split disabled, Match enabled; row Reload -> enabled.
// (c) row 2: tab1 Edit open; tab2 Excludes the row; tab1 Save -> message in window?
import {ob} from './lib.mjs'; import fs from 'fs'; import {R,mk,dlg,geo,dlgBox,row,netlog,DT} from './h.mjs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page; const L=[]; const t0=Date.now(); const G={};
netlog(p,'tab1',L,t0); const A=mk(s,p);
let hold=null, holding=false; await p.route('**/bank-transactions/*/details',async r=>{ if(holding&&r.request().method()==='PUT'&&!hold){ L.push('HOLDING inline PUT 8s (induced delay)'); await new Promise(res=>{hold=res; setTimeout(res,8000);}); } return r.continue(); });
// (a)
let id=R.rows['10']; L.push('(a) before '+JSON.stringify(await row(s,id)));
await A.open(); holding=true; await A.click('button_expand_accounting_bank_transactions_'+id); await A.type('input_inline_memo_'+id+'_accounting_bank_transactions','ZZ inline memo 10'); await p.keyboard.press('Tab'); await p.waitForTimeout(800);
await A.edit(id); L.push('(a) Edit open: '+JSON.stringify(await dlg(p))); await A.setAccount('select_category_'+DT,'6100','6100 Insurance'); await A.click('button_save_'+DT); holding=false; await p.waitForTimeout(11000);
L.push('(a) after: '+JSON.stringify(await dlg(p))+' row '+JSON.stringify(await row(s,id)));
// (b)
const p2=await s.ctx.newPage(); await p2.setViewportSize({width:1600,height:1000}); netlog(p2,'tab2',L,t0); const B=mk(s,p2);
id=R.rows['6']; await p.bringToFront(); await A.open(); await p2.bringToFront(); await B.open(); await B.setAccount('select_inline_account_'+id+'_accounting_bank_transactions','5100','5100 Shop Supplies'); await p2.waitForTimeout(2500);
await p.bringToFront(); await A.click('button_expand_accounting_bank_transactions_'+id); await A.type('input_inline_memo_'+id+'_accounting_bank_transactions','ZZ inline memo 6',true); await p.keyboard.press('Tab'); await p.waitForTimeout(3000);
const menu=async()=>{ await A.click('button_actions_accounting_bank_transactions_'+id); await p.waitForTimeout(500); const m=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width>0).map(e=>(e.getAttribute('data-test-id')||'')+'|'+e.innerText.trim()+'|'+(e.classList.contains('disabled')||e.getAttribute('aria-disabled')==='true'?'DISABLED':'enabled'))); await p.keyboard.press('Escape'); await p.waitForTimeout(400); return m; };
L.push('(b) notice: '+await p.evaluate(id=>document.querySelector(`[data-test-id="notice_party_accounting_bank_transactions_${id}"]`)?.innerText.replace(/\s+/g,' '),id)+' menu '+JSON.stringify(await menu()));
await A.click('button_reload_party_accounting_bank_transactions_'+id); await p.waitForTimeout(3000); L.push('(b) after row Reload menu '+JSON.stringify(await menu())+' row '+JSON.stringify(await row(s,id)));
// (c)
id=R.rows['2']; await A.open(); await A.edit(id); await A.type('input_memo_'+DT,'ZZ typed memo 2c',true);
await p2.bringToFront(); await B.open(); await B.click('button_actions_accounting_bank_transactions_'+id); await p2.waitForTimeout(500);
const items=await p2.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width>0).map(e=>(e.getAttribute('data-test-id')||'')+'|'+e.innerText.trim())); L.push('(c) tab2 row menu '+JSON.stringify(items));
const ex=items.find(x=>/exclude/i.test(x)); if(ex){ await B.click(ex.split('|')[0]); await p2.waitForTimeout(1500); const btns=await p2.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].filter(e=>e.getBoundingClientRect().width>0).map(e=>(e.getAttribute('data-test-id')||'')+'|'+e.innerText.trim())); L.push('(c) after Exclude click dialog buttons '+JSON.stringify(btns));
 const c=btns.find(b=>/confirm|exclude|yes/i.test(b)); if(c&&c.split('|')[0]){ await B.click(c.split('|')[0]); await p2.waitForTimeout(1500); const b2=await p2.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].filter(e=>e.getBoundingClientRect().width>0).map(e=>(e.getAttribute('data-test-id')||'')+'|'+e.innerText.trim())); L.push('(c) after confirm '+JSON.stringify(b2)); const sure=b2.find(b=>/are you sure/i.test(b)); if(sure){ await B.click(sure.split('|')[0]); await p2.waitForTimeout(1500);} }
 await p2.waitForTimeout(2000); L.push('(c) row now '+JSON.stringify(await row(s,id)));
 await p.bringToFront(); await A.click('button_save_'+DT); await p.waitForTimeout(3000); L.push('(c) tab1 after Save: '+JSON.stringify(await dlg(p))); await p.screenshot({path:'T6c-excluded.png'}); G.c={dlg:await dlgBox(p),...await geo(p,['banner_error_'+DT,'button_dismiss_error_'+DT,'button_save_'+DT,'input_memo_'+DT])};
 if((await dlg(p)).dismiss){ await A.click('button_dismiss_error_'+DT); await p.waitForTimeout(1200); L.push('(c) after Dismiss: '+JSON.stringify(await dlg(p))); } }
fs.writeFileSync('T6.json',JSON.stringify({L,G},null,1)); console.log(L.filter(x=>!/SEND GET/.test(x)).join('\n'));
await s.close();
