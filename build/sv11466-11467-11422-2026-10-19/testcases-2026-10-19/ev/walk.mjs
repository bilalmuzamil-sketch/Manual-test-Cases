import {session,toView,dens} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={mk:await s.marker()};
const OWN=['display','collapsedGroups','tab']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const act=()=>p.evaluate(()=>{const a=document.activeElement; const r=a.getBoundingClientRect(); const cs=getComputedStyle(a); return {tid:(a.dataset?.testId||a.tagName).replace(/[0-9a-f-]{36}/,'<id>'),num:(a.innerText.match(/S\d-\d+/)||[])[0],txt:(a.innerText||'').replace(/\s+/g,' ').trim().slice(0,40),ring:cs.outlineStyle+' '+cs.outlineWidth+' '+cs.outlineColor,x:r.x,y:r.y,w:r.width,h:r.height};});
const tabIn=async(max=15)=>{ for(let i=0;i<max;i++){ await p.keyboard.press('Tab'); await p.waitForTimeout(300); const a=await act(); if(/tech_view_row_|tech_view_group_|board_card_|board_column_header_/.test(a.tid)) return a; } return null; };
const fromSearch=async()=>{ await p.click('[data-test-id=page_search_clear]').catch(()=>{}); };
const open=async(q,view)=>{ await s.go('/workorders?tab=all&search='+encodeURIComponent(q)); await p.waitForTimeout(3500); await toView(p,view); await p.waitForTimeout(2500); };
const expandAll=async()=>{ await p.waitForSelector('[data-test-id=button_tech_view_collapse_all]',{timeout:45000}); for(let k=0;k<2;k++){ if(/Expand/.test(await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'))) break; await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);} await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500); };
const startTab=async()=>{ const b=await p.evaluate(()=>{const e=document.querySelector('[data-test-id=page_search_clear]')||document.querySelector('[data-test-id=button_new_work_order]'); const r=e.getBoundingClientRect(); return {x:r.x,y:r.y};}); await p.evaluate(()=>{(document.querySelector('[data-test-id=page_search_clear]')||document.querySelector('[data-test-id=button_new_work_order]')).focus();}); };
const prof=async()=>{ await p.click('[data-test-id=profile_menu_button]'); await p.waitForTimeout(1200); };
const pickLoc=async name=>{ await prof(); await p.click('[data-test-id=select_location]'); await p.waitForTimeout(1200); const ok=await p.evaluate(n=>{const it=[...document.querySelectorAll('.q-menu .q-item')].find(e=>e.innerText.trim().replace(/^check\s*/,'')===n); if(!it) return [...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim()); it.click(); return true;},name); await p.waitForTimeout(6000); return ok; };
const curLoc=async()=>{ await prof(); await p.click('[data-test-id=select_location]'); await p.waitForTimeout(1200); const c=await p.evaluate(()=>{const it=[...document.querySelectorAll('.q-menu .q-item')].find(e=>/^check/.test(e.innerText.trim())); return it?it.innerText.trim().replace(/^check\s*/,''):null;}); await p.keyboard.press('Escape'); await p.waitForTimeout(500); await p.keyboard.press('Escape'); await p.waitForTimeout(500); return c; };
const shot=async n=>{ await p.mouse.move(1435,895); await p.waitForTimeout(400); await p.screenshot({path:`/tmp/qa11310/walk/${n}.png`}); };
const MEAS=()=>{
  const res=[]; const dbg={tr:document.querySelectorAll('tr').length,badges:document.querySelectorAll('.service-actions .q-badge, .parts-actions .q-badge').length}; res.dbg=dbg; for(const row of document.querySelectorAll('tr')){
   const bs=[...row.querySelectorAll('.service-actions .q-badge, .parts-actions .q-badge')]; if(!bs.length) continue;
   const td=bs[0].closest('td'); const tr=td.getBoundingClientRect(); if(tr.bottom<0||tr.top>innerHeight) continue;
   // status text = text nodes in the cell that are not inside a badge
   const w=document.createTreeWalker(td,NodeFilter.SHOW_TEXT); let n, rs=[], txt='';
   while(n=w.nextNode()){ if(!n.textContent.trim()|| n.parentElement.closest('.service-actions, .parts-actions')) continue; const rg=document.createRange(); rg.selectNodeContents(n); for(const r of rg.getClientRects()) rs.push(r); txt+=n.textContent.trim()+' '; }
   if(!rs.length) continue;
   const T={l:Math.min(...rs.map(r=>r.left)),r:Math.max(...rs.map(r=>r.right)),t:Math.min(...rs.map(r=>r.top)),b:Math.max(...rs.map(r=>r.bottom))};
   // the pill = nearest ancestor of the first text node with a background and a radius
   let pe=rs.length? document.elementFromPoint((T.l+T.r)/2,(T.t+T.b)/2):null; let pill=null; for(let e=pe;e&&e!==td;e=e.parentElement){ const cs=getComputedStyle(e); if(cs.backgroundColor!=='rgba(0, 0, 0, 0)'&&parseFloat(cs.borderRadius)>0){pill=e;break;} }
   const P=pill?pill.getBoundingClientRect():null;
   const B=bs.map(b=>{const r=b.getBoundingClientRect(); const hx=Math.max(0,Math.min(r.right,T.r)-Math.max(r.left,T.l)); const vy=Math.max(0,Math.min(r.bottom,T.b)-Math.max(r.top,T.t)); return {c:b.classList.contains('bg-red-5')?'red':'blue',n:b.textContent.trim(),x:+r.left.toFixed(1),y:+r.top.toFixed(1),w:+r.width.toFixed(1),h:+r.height.toFixed(1),overText_h:+hx.toFixed(1),overText_v:+vy.toFixed(1)};});
   const wo=(row.innerText.match(/S\d*-\d+/)||[])[0];
   res.push({wo,status:txt.trim(),text:{l:+T.l.toFixed(1),r:+T.r.toFixed(1),t:+T.t.toFixed(1),b:+T.b.toFixed(1),h:+(T.b-T.t).toFixed(1)},pill:P?{x:+P.left.toFixed(1),y:+P.top.toFixed(1),w:+P.width.toFixed(1),h:+P.height.toFixed(1)}:null,badges:B,
     coverPct:Math.round(100*Math.max(...B.map(b=>b.overText_h>0?b.overText_v:0))/(T.b-T.t))});
  } return {dbg,res};};
const pillShot=async(tag)=>{ const r=await p.evaluate(()=>{const row=[...document.querySelectorAll('tr')].find(t=>/S2-33351/.test(t.innerText)); if(!row) return null; row.scrollIntoView({block:'center'}); return true;}); await p.waitForTimeout(800); const b=await p.evaluate(()=>{const row=[...document.querySelectorAll('tr')].find(t=>/S2-33351/.test(t.innerText)); const r=row.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};}); await p.mouse.move(1435,895); await p.waitForTimeout(300); await p.screenshot({path:`/tmp/qa11310/walk/A-${tag}.png`}); return b; };
try{
 await s.go('/workorders?tab=all'); await p.waitForTimeout(4000); out.loc0=await curLoc(); if(out.loc0!=='Staging Heavy Duty - 9919') out.pick=await pickLoc('Staging Heavy Duty - 9919');
 // ===== Case A (SV-11467): steps 1-6
 await s.go('/workorders?tab=all&search=S2-33351'); await p.waitForTimeout(4500);
 out.A_url=p.url(); out.A_search=await p.evaluate(()=>document.querySelector('[data-test-id=page_search_input]')?.value||null); out.A_tab=await p.evaluate(()=>document.querySelector('.q-tab--active')?.innerText.trim());
 await toView(p,'list'); await p.waitForTimeout(3000); out.A_list_box=await pillShot('1-list'); out.A_list=(await p.evaluate(MEAS)).res.filter(r=>r.wo==='S2-33351');
 await toView(p,'tech_view'); await p.waitForTimeout(3000);
 const tg=await p.$('[data-test-id=button_tech_view_group_toggle_unassigned]'); out.A_unExp=tg?await tg.getAttribute('aria-expanded'):null; if(tg && out.A_unExp==='false'){ await tg.click(); await p.waitForTimeout(2500); }
 out.A_densStart=await p.evaluate(()=>document.querySelector('[data-test-id=button_density]')?.getAttribute('aria-label'));
 for(const D of ['compact','regular','comfortable']){ await dens(p,D); await p.waitForTimeout(1500); out['A_box_'+D]=await pillShot('2-tech-'+D); out['A_'+D]=(await p.evaluate(MEAS)).res.filter(r=>r.wo==='S2-33351'); }
 console.log('A',out.A_url,out.A_search,out.A_tab,out.A_unExp,out.A_densStart, JSON.stringify(['list','compact','regular','comfortable'].map(k=>{const r=(out['A_'+k]||[])[0]; return r?{k,st:r.status,pillH:r.pill&&r.pill.h,cover:r.coverPct,b:r.badges.map(b=>b.c+b.n+'@'+(b.y-r.text.t).toFixed(1))}:{k,none:true};})));
 // ===== Case B (SV-11422): steps 1-6
 await s.go('/workorders?tab=all&search=S2-16688'); await p.waitForTimeout(4500); out.B_search=await p.evaluate(()=>document.querySelector('[data-test-id=page_search_input]')?.value||null);
 await toView(p,'tech_view'); await p.waitForTimeout(3000);
 out.B_collLabel=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'); out.B_collTip=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','title');
 await expandAll(); out.B_collLabel2=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label');
 out.B_pre=await p.evaluate(()=>{const row=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].find(e=>/^tech_view_row_[0-9a-f-]{36}$/.test(e.dataset.testId)&&/S2-16688/.test(e.innerText)); const un=document.querySelector('[data-test-id=tech_view_group_unassigned]'); return {rowY:row&&Math.round(row.getBoundingClientRect().y),vh:innerHeight,un:un&&un.innerText.replace(/\s+/g,' ').slice(0,60)};});
 await p.mouse.move(1435,895); await p.screenshot({path:'/tmp/qa11310/walk/B-1-tech-before.png'});
 await p.click('[data-test-id=page_search_input]'); await p.waitForTimeout(400); out.B_tech=await tabIn(); await p.waitForTimeout(800);
 out.B_techHits=await p.evaluate(()=>{const row=document.activeElement; const b=row.getBoundingClientRect(); return [b.top+3,b.top+b.height/2,b.bottom-3].map(y=>{const e=document.elementFromPoint(400,y); return row.contains(e)?'row':(e.closest('[data-test-id]')?.dataset.testId||e.tagName).replace(/[0-9a-f-]{36}/,'<id>');});});
 await shot('B-2-tech-after'); 
 await toView(p,'board_view'); await p.waitForTimeout(3500); await p.mouse.move(1435,895); await p.screenshot({path:'/tmp/qa11310/walk/B-3-board-before.png'});
 await p.click('[data-test-id=page_search_input]'); await p.waitForTimeout(400); out.B_board=await tabIn(); await p.waitForTimeout(800);
 out.B_boardHits=await p.evaluate(()=>{const c=document.activeElement; const b=c.getBoundingClientRect(); return {vis:[[b.left+10,b.top+10],[b.right-10,b.bottom-10],[(b.left+b.right)/2,(b.top+b.bottom)/2]].map(([x,y])=>{const e=document.elementFromPoint(x,y); return c.contains(e)?'card':(e&&(e.closest('[data-test-id]')?.dataset.testId||e.tagName));}),r:{l:Math.round(b.left),r:Math.round(b.right),t:Math.round(b.top),b:Math.round(b.bottom)},vw:innerWidth}; });
 await shot('B-4-board-after');
 console.log('B',out.B_search,out.B_collLabel,'/',out.B_collTip,'->',out.B_collLabel2,JSON.stringify(out.B_pre),'tech',out.B_tech&&out.B_tech.num,out.B_tech&&out.B_tech.ring,JSON.stringify(out.B_techHits),'board',out.B_board&&out.B_board.num,out.B_board&&out.B_board.ring,JSON.stringify(out.B_boardHits));
}catch(e){ out.err=e.message.slice(0,300); await p.screenshot({path:'/tmp/qa11310/walk/err.png'}); console.log('ERR',out.err); }
try{ if(out.loc0 && out.loc0!=='Staging Heavy Duty - 9919') out.restore=await pickLoc(out.loc0); }catch(e){out.restoreErr=e.message.slice(0,150);}
const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; out.put=(await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})})).status;
out.mkEnd=await s.marker(); fs.writeFileSync('/tmp/qa11310/walk/walk.json',JSON.stringify(out,null,1)); console.log('restore',out.restore,out.put,JSON.stringify(out.mkEnd)); await s.close();
