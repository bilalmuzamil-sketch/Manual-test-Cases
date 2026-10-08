// Other save errors in the window. Row 5: induced server error (500) then induced network drop, then a clean save. Row 6: a real server refusal (overlong memo).
import {ob} from './lib.mjs'; import fs from 'fs'; import {R,mk,dlg,geo,dlgBox,row,netlog,DT} from './h.mjs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page; const L=[]; const t0=Date.now(); const G={};
netlog(p,'tab1',L,t0); const A=mk(s,p); p.on('framenavigated',f=>{ if(f===p.mainFrame()) L.push(((Date.now()-t0)/1000).toFixed(1)+' NAVIGATED '+f.url()); });
let mode=null; await p.route('**/bank-transactions/*/details',async r=>{ if(r.request().method()==='PUT'&&mode==='500'){ mode=null; L.push('INDUCED 500 on details PUT'); return r.fulfill({status:500,contentType:'application/json',body:JSON.stringify({message:'Server Error'})}); } if(r.request().method()==='PUT'&&mode==='drop'){ mode=null; L.push('INDUCED network drop on details PUT'); return r.abort('connectionreset'); } return r.continue(); });
try{
let id=R.rows['5']; L.push('row5 before '+JSON.stringify(await row(s,id)));
await A.open(); await A.edit(id); await A.type('input_memo_'+DT,'ZZ typed memo 5'); await A.type('input_payee_'+DT,'ZZ typed payee 5');
mode='500'; await A.click('button_save_'+DT); await p.waitForTimeout(2500); L.push('row5 after 500: '+JSON.stringify(await dlg(p)));
await p.screenshot({path:'T4-500.png'}); G.e500={dlg:await dlgBox(p),...await geo(p,['banner_error_'+DT,'button_dismiss_error_'+DT,'button_save_'+DT,'input_memo_'+DT,'input_payee_'+DT])};
const hasDismiss=(await dlg(p)).dismiss; if(hasDismiss){ await A.click('button_dismiss_error_'+DT); await p.waitForTimeout(1200); L.push('row5 after Dismiss: '+JSON.stringify(await dlg(p))); }
mode='drop'; await A.click('button_save_'+DT); await p.waitForTimeout(2500); L.push('row5 after drop: '+JSON.stringify(await dlg(p))); await p.screenshot({path:'T4-drop.png'});
if((await dlg(p)).dismiss){ await A.click('button_dismiss_error_'+DT); await p.waitForTimeout(1200); }
await A.click('button_save_'+DT); await p.waitForTimeout(3000); L.push('row5 clean save: '+JSON.stringify(await dlg(p))); L.push('row5 after '+JSON.stringify(await row(s,id)));
id=R.rows['6']; await A.open(); await A.edit(id); const long='ZZ'+'x'.repeat(1200);
await p.evaluate(([t,v])=>{},['','']); await A.click('input_memo_'+DT); await p.keyboard.insertText(long);
await A.click('button_save_'+DT); await p.waitForTimeout(3000); L.push('row6 after long memo save: '+JSON.stringify(await dlg(p)).slice(0,600));
await p.screenshot({path:'T4-long.png'}); G.long={dlg:await dlgBox(p),...await geo(p,['banner_error_'+DT,'button_dismiss_error_'+DT,'button_save_'+DT,'input_memo_'+DT])};
L.push('row6 after '+JSON.stringify(await row(s,id)).slice(0,300));
}catch(e){ L.push('CRASH '+e.message.slice(0,120)+' url '+p.url()); await p.screenshot({path:'T4-crash.png'}).catch(()=>{}); }
fs.writeFileSync('T4.json',JSON.stringify({L,G},null,1)); console.log(L.filter(x=>!/SEND GET/.test(x)).join('\n').slice(0,6000));
await s.close();
