// Reload that fails: row 4 locked by a refused inline save while the Edit window is open; the list refresh behind Reload is made to fail (induced) -> banner + typed edits must stay; then a real Reload re-bases and saves.
import {ob} from './lib.mjs'; import fs from 'fs'; import {R,mk,dlg,geo,dlgBox,row,netlog,DT} from './h.mjs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page; const L=[]; const t0=Date.now(); const G={};
netlog(p,'tab1',L,t0); const A=mk(s,p); const id=R.rows['4']; L.push('row4 before '+JSON.stringify(await row(s,id)));
let hold=null, holding=false; let failList=false;
await p.route('**/bank-transactions/*/details',async r=>{ if(holding&&r.request().method()==='PUT'&&!hold){ L.push('HOLDING inline details PUT'); await new Promise(res=>{hold=res;}); } return r.continue(); });
await p.route('**/accounting/bank-transactions?*',async r=>{ if(failList&&r.request().method()==='GET'){ L.push('INDUCED 500 on list refresh'); return r.fulfill({status:500,contentType:'application/json',body:'{"message":"Server Error"}'}); } return r.continue(); });
await A.open();
const p2=await s.ctx.newPage(); await p2.setViewportSize({width:1600,height:1000}); netlog(p2,'tab2',L,t0); const B=mk(s,p2); await B.open();
await B.setAccount('select_inline_account_'+id+'_accounting_bank_transactions','6100','6100 Insurance'); await p2.waitForTimeout(2500); L.push('tab2 set Account; row '+JSON.stringify(await row(s,id)));
await p.bringToFront(); holding=true;
await A.click('button_expand_accounting_bank_transactions_'+id); await A.type('input_inline_memo_'+id+'_accounting_bank_transactions','ZZ inline memo 4'); await p.keyboard.press('Tab'); await p.waitForTimeout(1500);
await A.edit(id); L.push('Edit open while inline save held: '+JSON.stringify(await dlg(p)));
await A.type('input_payee_'+DT,'ZZ typed payee 4'); await A.click('button_save_'+DT); await p.waitForTimeout(1500); L.push('dialog Save clicked (queued?) '+JSON.stringify(await dlg(p)));
holding=false; hold&&hold(); await p.waitForTimeout(4000); L.push('after releasing inline save: '+JSON.stringify(await dlg(p)));
await p.screenshot({path:'T5a-banner.png'});
failList=true; if((await dlg(p)).reload){ await A.click('button_reload_'+DT); await p.waitForTimeout(3000); L.push('after Reload with failing refresh: '+JSON.stringify(await dlg(p))); await p.screenshot({path:'T5b-reload-failed.png'}); G.fail={dlg:await dlgBox(p),...await geo(p,['banner_error_'+DT,'button_reload_'+DT,'input_payee_'+DT,'input_memo_'+DT,'select_category_'+DT,'button_save_'+DT])}; }
failList=false; if((await dlg(p)).reload){ await A.click('button_reload_'+DT); await p.waitForTimeout(3000); L.push('after real Reload: '+JSON.stringify(await dlg(p))); await p.screenshot({path:'T5c-reloaded.png'}); }
if((await dlg(p)).open&&!(await dlg(p)).saveDisabled){ await A.click('button_save_'+DT); await p.waitForTimeout(3500); L.push('after Save: '+JSON.stringify(await dlg(p))); }
L.push('row4 after '+JSON.stringify(await row(s,id)));
L.push('row4 Edit enabled in grid? '+await p.evaluate(id=>{const e=document.querySelector(`[data-test-id="notice_party_accounting_bank_transactions_${id}"]`); return 'notice:'+(e?e.innerText.replace(/\s+/g,' '):'none');},id));
fs.writeFileSync('T5.json',JSON.stringify({L,G},null,1)); console.log(L.filter(x=>!/SEND GET/.test(x)).join('\n'));
await s.close();
