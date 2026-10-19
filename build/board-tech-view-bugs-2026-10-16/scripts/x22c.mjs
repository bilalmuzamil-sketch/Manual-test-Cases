import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={mk:await s.marker()}; console.log('mk',JSON.stringify(out.mk));
const OWN=['display','collapsedGroups','tab']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const act=()=>p.evaluate(()=>{const a=document.activeElement; const r=a.getBoundingClientRect(); return {tid:(a.dataset?.testId||a.tagName).replace(/[0-9a-f-]{36}/,'<id>'),num:(a.innerText.match(/S\d-\d+/)||[])[0],txt:(a.innerText||'').replace(/\s+/g,' ').trim().slice(0,40),y:Math.round(r.y),x:Math.round(r.x)};});
const tabIn=async(max=15)=>{ for(let i=0;i<max;i++){ await p.keyboard.press('Tab'); await p.waitForTimeout(300); const a=await act(); if(/tech_view_row_|tech_view_group_|board_card_|board_column_header_/.test(a.tid)) return a; } return null; };
const open=async(q,view)=>{ await s.go('/workorders?tab=all&search='+encodeURIComponent(q)); await p.waitForTimeout(3500); await toView(p,view); await p.waitForTimeout(2500); };
const expandAll=async()=>{ for(let k=0;k<2;k++){ if(/Expand/.test(await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'))) break; await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);} await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500); };
const startTab=async()=>{ await p.evaluate(()=>{(document.querySelector('[data-test-id=page_search_clear]')||document.querySelector('[data-test-id=button_new_work_order]')).focus();}); };
const shot=async n=>{ await p.mouse.move(1435,895); await p.waitForTimeout(400); await p.screenshot({path:`/tmp/qa11310/ex/x22c-${n}.png`}); };
const where=()=>p.evaluate(()=>{const r=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].filter(e=>/^tech_view_row_[0-9a-f-]{36}$/.test(e.dataset.testId)).map(e=>{const b=e.getBoundingClientRect(); return {n:(e.innerText.match(/S\d-\d+/)||[])[0],y:Math.round(b.y)};}); const g=[...document.querySelectorAll('[data-test-id^=tech_view_group_]')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,40)).slice(0,4); return {rows:r,groups:g};});
try{
 // A: normal case, rows in Unassigned
 await open('ZZAUTOTEST F3 Keyboard Reach','tech_view'); await expandAll(); await startTab(); out.A=await tabIn(); await shot('A'); console.log('A',JSON.stringify(out.A));
 await p.keyboard.press('ArrowUp'); await p.waitForTimeout(500); out.A_hdr=await act(); await p.keyboard.press('Shift+Tab'); await p.waitForTimeout(400); await p.keyboard.press('Tab'); await p.waitForTimeout(500); out.A_back=await act(); console.log('A header',JSON.stringify(out.A_hdr),'back',JSON.stringify(out.A_back));
 await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500); await startTab(); out.A_coll=await tabIn(); console.log('A collapsed',JSON.stringify(out.A_coll)); await expandAll();
 // B: Unassigned empty, only row off screen (S2-16688), two fresh loads
 for(const k of [1,2]){ await open('S2-16688','tech_view'); await expandAll(); out['B_where'+k]=await where(); await startTab(); out['B'+k]=await tabIn(); await shot('B'+k); console.log('B'+k,JSON.stringify(out['B_where'+k]),JSON.stringify(out['B'+k])); }
 // B3: scroll the row on screen then tab
 await open('S2-16688','tech_view'); await expandAll(); await p.evaluate(()=>{const r=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].find(e=>/S2-16688/.test(e.innerText)); r&&r.scrollIntoView({block:'center'});}); await p.waitForTimeout(1500); out.B3_where=await where(); await startTab(); out.B3=await tabIn(); await shot('B3'); console.log('B3',JSON.stringify(out.B3_where),JSON.stringify(out.B3));
 // C: Board, S2-16688 card off screen to the right
 await open('S2-16688','board_view'); out.C_card=await p.evaluate(()=>{const c=[...document.querySelectorAll('.board-card')].find(e=>/S2-16688/.test(e.innerText)); if(!c) return null; const b=c.getBoundingClientRect(); return {x:Math.round(b.x),y:Math.round(b.y)};}); await startTab(); out.C=await tabIn(); await shot('C'); console.log('C card',JSON.stringify(out.C_card),'tab',JSON.stringify(out.C));
 // D: Board normal first tab
 await open('ZZAUTOTEST F3 Keyboard Reach','board_view'); await startTab(); out.D=await tabIn(); console.log('D',JSON.stringify(out.D));
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})});
out.mkEnd=await s.marker(); fs.writeFileSync('/home/user/Manual-test-Cases/build/board-tech-view-defects-2026-10-17/sv11422/ev/x22c.json',JSON.stringify(out,null,1)); await s.close(); console.log('DONE');
