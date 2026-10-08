// Row 5: after the induced 500 + Dismiss, save again for real -> 200 with the typed values. Row 6: a real server refusal (very long memo).
import {ob} from './lib.mjs'; import fs from 'fs'; import {R,mk,dlg,geo,dlgBox,row,netlog,DT} from './h.mjs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page; const L=[]; const t0=Date.now(); const G={};
netlog(p,'tab1',L,t0); const A=mk(s,p);
let mode='500'; await p.route('**/bank-transactions/*/details',async r=>{ if(r.request().method()==='PUT'&&mode==='500'){ mode=null; L.push('INDUCED 500 on details PUT'); return r.fulfill({status:500,contentType:'application/json',body:JSON.stringify({message:'Server Error'})}); } return r.continue(); });
let id=R.rows['5']; await A.open(); await A.edit(id); await A.type('input_memo_'+DT,'ZZ typed memo 5',true); await A.type('input_payee_'+DT,'ZZ typed payee 5',true);
await A.click('button_save_'+DT); await p.waitForTimeout(2500); L.push('row5 after 500: '+JSON.stringify(await dlg(p)));
await p.screenshot({path:'T4c-500.png'}); G.e500={dlg:await dlgBox(p),...await geo(p,['banner_error_'+DT,'button_dismiss_error_'+DT,'button_save_'+DT,'input_memo_'+DT,'input_payee_'+DT])};
G.toast=await p.evaluate(()=>{const q=[...document.querySelectorAll('.q-notification')].map(x=>x.getBoundingClientRect()).filter(q=>q.width>0).pop(); return q?[q.x,q.y,q.width,q.height].map(Math.round):null;});
await A.click('button_dismiss_error_'+DT); await p.waitForTimeout(1200); L.push('row5 after Dismiss: '+JSON.stringify(await dlg(p)));
await A.click('button_save_'+DT); await p.waitForTimeout(3500); L.push('row5 retry Save: '+JSON.stringify(await dlg(p))); L.push('row5 after '+JSON.stringify(await row(s,id)));
id=R.rows['6']; await A.open(); await A.edit(id); await A.click('input_memo_'+DT); await p.keyboard.insertText('ZZ'+'x'.repeat(1200));
await A.click('button_save_'+DT); await p.waitForTimeout(3000); L.push('row6 long memo save: '+JSON.stringify(await dlg(p)).replace(/x{20,}/g,'xxx…'));
await p.screenshot({path:'T4c-long.png'}); G.long={dlg:await dlgBox(p),...await geo(p,['banner_error_'+DT,'button_dismiss_error_'+DT,'button_save_'+DT,'input_memo_'+DT])};
L.push('row6 after '+JSON.stringify(await row(s,id)).replace(/x{20,}/g,'xxx…'));
fs.writeFileSync('T4c.json',JSON.stringify({L,G},null,1)); console.log(L.filter(x=>!/SEND GET/.test(x)).map(x=>x.replace(/x{20,}/g,'xxx…')).join('\n'));
await s.close();
