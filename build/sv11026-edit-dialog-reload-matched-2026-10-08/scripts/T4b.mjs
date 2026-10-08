import {ob} from './lib.mjs'; import fs from 'fs'; import {R,mk,dlg,row,netlog,DT} from './h.mjs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page; const L=[]; const t0=Date.now();
netlog(p,'tab1',L,t0); const A=mk(s,p); p.on('framenavigated',f=>{ if(f===p.mainFrame()) L.push(((Date.now()-t0)/1000).toFixed(1)+' NAVIGATED '+f.url()); });
let mode='500'; await p.route('**/bank-transactions/*/details',async r=>{ if(r.request().method()==='PUT'&&mode==='500'){ mode=null; L.push('INDUCED 500'); return r.fulfill({status:500,contentType:'application/json',body:JSON.stringify({message:'Server Error'})}); } return r.continue(); });
const id=R.rows['5']; await A.open(); await A.edit(id); await A.type('input_memo_'+DT,'ZZ typed memo 5');
await A.click('button_save_'+DT);
for(let i=0;i<12;i++){ await p.waitForTimeout(250); try{ L.push(((Date.now()-t0)/1000).toFixed(1)+' '+p.url()+' '+JSON.stringify(await dlg(p))); }catch(e){ L.push('eval err '+e.message.slice(0,60)); } if(i===1) await p.screenshot({path:'T4b-500-early.png'}); }
await p.screenshot({path:'T4b-500-late.png'});
console.log(L.filter(x=>!/SEND GET/.test(x)).join('\n'));
await s.close();
