// Matched elsewhere: tab2 matches the row; tab1 Edit dialog Save -> message inside window + Dismiss, Save disabled; Dismiss; grid row state.
import {ob} from './lib.mjs'; import fs from 'fs'; import {R,mk,dlg,geo,dlgBox,row,netlog,DT} from './h.mjs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page; const L=[]; const t0=Date.now(); const G={};
netlog(p,'tab1',L,t0); const A=mk(s,p); const p2=await s.ctx.newPage(); await p2.setViewportSize({width:1600,height:1000}); netlog(p2,'tab2',L,t0); const B=mk(s,p2);
const variants=[['7',async()=>{await A.type('input_memo_'+DT,'ZZ typed memo 7');}],['8',async()=>{await A.setAccount('select_category_'+DT,'6100','6100 Insurance');}],['9',async()=>{await A.type('input_payee_'+DT,'ZZ typed payee 9'); await A.type('input_memo_'+DT,'ZZ typed memo 9');}]];
for(const [k,doEdit] of variants){ const id=R.rows[k]; L.push(`== row ${k} before `+JSON.stringify(await row(s,id)));
 await p.bringToFront(); await A.open(); await A.edit(id); await doEdit(); L.push(`row ${k} tab1 typed: `+JSON.stringify(await dlg(p)));
 await p2.bringToFront(); await B.open(); await B.click('button_actions_accounting_bank_transactions_'+id); await B.click('button_match_menu_accounting_bank_transactions_'+id); await p2.waitForTimeout(1500);
 await B.click('button_pick_entry_accounting_bank_match_'+R['je'+k]); await p2.waitForTimeout(600); await B.click('button_confirm_dialog'); await p2.waitForTimeout(3000);
 L.push(`row ${k} tab2 matched; row now `+JSON.stringify(await row(s,id)));
 await p.bringToFront(); const cnt=()=>p.evaluate(id=>!!document.querySelector(`[data-test-id="button_actions_accounting_bank_transactions_${id}"]`),id); L.push(`row ${k} tab1 grid row visible before save: `+await cnt());
 await A.click('button_save_'+DT); let st; for(let i=0;i<10;i++){ await p.waitForTimeout(300); st=await dlg(p); if(st.toasts.length||st.banner) break; } L.push(`row ${k} right after Save: `+JSON.stringify(st));
 await p.waitForTimeout(2500); const st2=await dlg(p); L.push(`row ${k} 3s after Save: `+JSON.stringify(st2)+' grid row visible: '+await cnt());
 await p.screenshot({path:`T3-${k}-msg.png`}); G[k]={dlg:await dlgBox(p),...await geo(p,['banner_error_'+DT,'button_dismiss_error_'+DT,'button_save_'+DT,'input_memo_'+DT,'input_payee_'+DT,'select_category_'+DT])};
 // Enter in memo must send nothing while Save is disabled
 await A.click('input_memo_'+DT); await p.keyboard.press('Enter'); await p.waitForTimeout(1200); L.push(`row ${k} Enter pressed in memo`);
 await A.click('button_dismiss_error_'+DT); await p.waitForTimeout(1500); L.push(`row ${k} after Dismiss: `+JSON.stringify(await dlg(p))+' grid row visible: '+await cnt());
 await p.screenshot({path:`T3-${k}-dismissed.png`});
 L.push(`row ${k} after `+JSON.stringify(await row(s,id)));
}
fs.writeFileSync('T3.json',JSON.stringify({L,G},null,1)); console.log(L.filter(x=>!/SEND GET/.test(x)).join('\n'));
await s.close();
