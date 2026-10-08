// Variant A (row 2): tab2 changes Memo inline AND Account; tab1 typed only Memo -> Reload: memo = tab1 typed, account = tab2's, payee = latest.
// Variant B (row 3): tab1 changes Account (6100) + Memo; tab2 changes Account to 5100 and Payee -> Reload: account stays 6100 (typed), payee = tab2's.
import {ob} from './lib.mjs'; import fs from 'fs'; import {R,mk,dlg,geo,dlgBox,row,netlog,DT} from './h.mjs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page; const L=[]; const t0=Date.now(); const G={};
netlog(p,'tab1',L,t0); const A=mk(s,p); const p2=await s.ctx.newPage(); await p2.setViewportSize({width:1600,height:1000}); netlog(p2,'tab2',L,t0); const B=mk(s,p2);
// ---- A
let id=R.rows['2']; L.push('A row before '+JSON.stringify(await row(s,id)));
await p.bringToFront(); await A.open(); await A.edit(id);
await p2.bringToFront(); await B.open();
await B.click('button_expand_accounting_bank_transactions_'+id); await B.type('input_inline_memo_'+id+'_accounting_bank_transactions','ZZ other tab memo A'); await p2.keyboard.press('Tab'); await p2.waitForTimeout(2500);
await B.setAccount('select_inline_account_'+id+'_accounting_bank_transactions','5100','5100 Shop Supplies'); await p2.waitForTimeout(2500);
L.push('A tab2 changed memo+account; row '+JSON.stringify(await row(s,id)));
await p.bringToFront(); await A.type('input_memo_'+DT,'ZZ my typed memo A'); await A.click('button_save_'+DT); await p.waitForTimeout(3000); L.push('A after Save '+JSON.stringify(await dlg(p)));
await p.screenshot({path:'T2a-banner.png'}); G.Ab={dlg:await dlgBox(p),...await geo(p,['banner_error_'+DT,'input_memo_'+DT,'select_category_'+DT])};
await A.click('button_reload_'+DT); await p.waitForTimeout(2500); L.push('A after Reload '+JSON.stringify(await dlg(p)));
await p.screenshot({path:'T2a-reload.png'}); G.Ar={dlg:await dlgBox(p),...await geo(p,['input_memo_'+DT,'select_category_'+DT,'input_payee_'+DT])};
await A.click('button_save_'+DT); await p.waitForTimeout(3500); L.push('A after Save2 '+JSON.stringify(await dlg(p))); L.push('A row after '+JSON.stringify(await row(s,id)));
// ---- B
id=R.rows['3']; L.push('B row before '+JSON.stringify(await row(s,id)));
await A.open(); await A.edit(id);
await p2.bringToFront(); await B.open(); await B.setAccount('select_inline_account_'+id+'_accounting_bank_transactions','5100','5100 Shop Supplies'); await p2.waitForTimeout(2500);
await B.edit(id); await B.type('input_payee_'+DT,'ZZ other tab payee B'); await B.click('button_save_'+DT); await p2.waitForTimeout(3000); L.push('B tab2 saved: '+JSON.stringify(await dlg(p2))+' row '+JSON.stringify(await row(s,id)));
await p.bringToFront(); await A.setAccount('select_category_'+DT,'6100','6100 Insurance'); await A.type('input_memo_'+DT,'ZZ my typed memo B'); await A.click('button_save_'+DT); await p.waitForTimeout(3000); L.push('B after Save '+JSON.stringify(await dlg(p)));
await A.click('button_reload_'+DT); await p.waitForTimeout(2500); L.push('B after Reload '+JSON.stringify(await dlg(p)));
await p.screenshot({path:'T2b-reload.png'}); G.Br={dlg:await dlgBox(p),...await geo(p,['input_memo_'+DT,'select_category_'+DT,'input_payee_'+DT])};
await A.click('button_save_'+DT); await p.waitForTimeout(3500); L.push('B after Save2 '+JSON.stringify(await dlg(p))); L.push('B row after '+JSON.stringify(await row(s,id)));
fs.writeFileSync('T2.json',JSON.stringify({L,G},null,1)); console.log(L.filter(x=>!/SEND GET/.test(x)).join('\n'));
await s.close();
