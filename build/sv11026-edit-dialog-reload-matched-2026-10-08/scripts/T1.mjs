// Issue 1: tab2 changes Account; tab1 typed Memo + Payee; Save -> banner; Reload -> typed kept + latest account; Save -> all saved.
import {ob} from './lib.mjs'; import fs from 'fs'; import {R,mk,dlg,geo,dlgBox,row,netlog,DT} from './h.mjs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page; const id=R.rows['1']; const L=[]; const t0=Date.now(); const G={};
netlog(p,'tab1',L,t0); L.push('row before: '+JSON.stringify(await row(s,id)));
const A=mk(s,p); await A.open(); await A.edit(id); L.push('tab1 Edit open: '+JSON.stringify(await dlg(p)));
const p2=await s.ctx.newPage(); await p2.setViewportSize({width:1600,height:1000}); netlog(p2,'tab2',L,t0); const B=mk(s,p2); await B.open();
await B.setAccount('select_inline_account_'+id+'_accounting_bank_transactions','6100','6100 Insurance'); await p2.waitForTimeout(2500); L.push('tab2 set Account 6100 Insurance; row now '+JSON.stringify(await row(s,id)));
await p.bringToFront(); await A.type('input_memo_'+DT,'ZZ typed memo 1'); await A.type('input_payee_'+DT,'ZZ typed payee 1');
await p.screenshot({path:'T1a-typed.png'}); G.a={dlg:await dlgBox(p),...await geo(p,['input_memo_'+DT,'input_payee_'+DT,'select_category_'+DT,'button_save_'+DT])};
await A.click('button_save_'+DT); await p.waitForTimeout(3000); L.push('after Save: '+JSON.stringify(await dlg(p)));
await p.screenshot({path:'T1b-banner.png'}); G.b={dlg:await dlgBox(p),...await geo(p,['banner_error_'+DT,'button_reload_'+DT,'input_memo_'+DT,'input_payee_'+DT,'select_category_'+DT,'button_save_'+DT])};
await A.click('input_memo_'+DT); await p.keyboard.press('Enter'); await p.waitForTimeout(1500); L.push('Enter pressed in memo during banner');
await A.click('button_reload_'+DT); await p.waitForTimeout(3000); L.push('after Reload: '+JSON.stringify(await dlg(p)));
await p.screenshot({path:'T1c-after-reload.png'}); G.c={dlg:await dlgBox(p),...await geo(p,['input_memo_'+DT,'input_payee_'+DT,'select_category_'+DT,'button_save_'+DT])};
await A.click('button_save_'+DT); await p.waitForTimeout(3500); L.push('after second Save: '+JSON.stringify(await dlg(p)));
await p.screenshot({path:'T1d-saved.png'});
L.push('row after: '+JSON.stringify(await row(s,id)));
fs.writeFileSync('T1.json',JSON.stringify({L,G},null,1)); console.log(L.join('\n'));
await s.close();
