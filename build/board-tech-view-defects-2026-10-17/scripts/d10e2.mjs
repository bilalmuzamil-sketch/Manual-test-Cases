import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:1}); const p=s.page; const out={mk:await s.marker()};
const OWN=['display','collapsedGroups','tab'];
const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
const putP=async v=>(await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})})).status;
const prefs0=await getP();
const act=()=>p.evaluate(()=>{const a=document.activeElement; const r=a.getBoundingClientRect(); return {tid:(a.dataset?.testId||a.tagName).replace(/[0-9a-f-]{36}/,'<id>'),num:((a.innerText||'').match(/S\d-\d+/)||[''])[0],txt:(a.innerText||'').replace(/\s+/g,' ').trim().slice(0,30),y:Math.round(r.y)};});
const tabIn=async(max=15)=>{ for(let i=0;i<max;i++){ await p.keyboard.press('Tab'); await p.waitForTimeout(300); const a=await act(); if(/tech_view_row_<id>$|tech_view_group_|board_card_<id>$|board_column_header_/.test(a.tid)) return a; } return null; };
const toSearch=async()=>{ await p.mouse.move(1435,895); await p.focus('[data-test-id=button_new_work_order]'); await p.waitForTimeout(300); };
try{
 // Tech View last-focused row (not the first)
 await s.go('/workorders?tab=all&search=Lamkin'); await p.waitForTimeout(3500); await toView(p,'tech_view'); await p.waitForTimeout(2000);
 for(let k=0;k<2;k++){ if(/Expand/.test(await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'))) break; await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);} await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(3000);
 await toSearch(); out.first=await tabIn(); let a=out.first; for(let i=0;i<60;i++){ await p.keyboard.press('ArrowDown'); await p.waitForTimeout(200); a=await act(); if(a.num==='S2-16218') break; } out.picked=a;
 await toSearch(); out.back=await tabIn(); console.log('tech last-focused: first',out.first.num,'picked',JSON.stringify(out.picked),'-> back in',JSON.stringify(out.back));
 // Board: long column, focus 3rd card, scroll column so it is out of view, tab back in
 await s.go('/workorders?tab=all'); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3000);
 await toSearch(); out.b0=await tabIn(); for(let i=0;i<2;i++){ await p.keyboard.press('ArrowDown'); await p.waitForTimeout(400);} out.bF=await act();
 const col=await p.evaluate(()=>{const b=document.activeElement.closest('.board-column__body'); const r=b.getBoundingClientRect(); return {x:r.x+100,y:r.y+300};}); await p.mouse.move(col.x,col.y); await p.mouse.wheel(0,2500); await p.waitForTimeout(1500);
 out.bAway=await p.evaluate(()=>{const b=document.querySelector('.board-column__body'); const br=b.getBoundingClientRect(); const cards=[...b.querySelectorAll('[data-test-id^=board_card_]')].filter(c=>/^board_card_[0-9a-f-]{36}$/.test(c.dataset.testId)); const vis=cards.map(c=>({n:c.innerText.match(/S\d-\d+/)[0],t:Math.round(c.getBoundingClientRect().top),b:Math.round(c.getBoundingClientRect().bottom)})).filter(c=>c.b>br.top&&c.t<br.bottom); return {scrollTop:b.scrollTop,colTop:Math.round(br.top),vis:vis.slice(0,4)};});
 await toSearch(); out.bBack=await tabIn(); console.log('board: focused',out.bF.num,'| after scroll',JSON.stringify(out.bAway),'| back in ->',JSON.stringify(out.bBack));
 // Board: focused card still in view -> returns to it
 await toSearch(); await tabIn(); out.bStill=await act(); await toSearch(); out.bStillBack=await tabIn(); console.log('board still in view:',out.bStill.num,'->',out.bStillBack.num); out.colOfBack=await p.evaluate(()=>document.activeElement.closest('[data-test-id^=board_column_]')?.dataset.testId||document.activeElement.closest('.board-column__panel')?.innerText.split('\n')[0]); console.log('column of landing',out.colOfBack);
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; console.log('put',await putP(v));
fs.writeFileSync('/home/user/Manual-test-Cases/build/board-tech-view-defects-2026-10-17/sv11422/ev/d10e-31ad1e1.json',JSON.stringify(out,null,1)); await s.close();
