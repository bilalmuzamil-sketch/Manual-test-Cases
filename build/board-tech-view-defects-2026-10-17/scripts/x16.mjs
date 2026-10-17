import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={mk:await s.marker()}; const Q='ZZAUTOTEST F1 Assigned To Me';
const OWN=['display','collapsedGroups','tab']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const B=e=>{const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};};
try{
 await s.go('/workorders?tab=all&search='+encodeURIComponent(Q)); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3000);
 await p.evaluate(()=>{const sc=document.querySelector('[data-test-id=board_view_scroller]'); sc.scrollLeft=sc.scrollWidth;}); await p.waitForTimeout(1500);
 for(let i=0;i<40;i++){ if(await p.evaluate(()=>{const h=document.querySelector('[data-test-id=board_column_header_deleted]'); if(h){h.scrollIntoView({inline:'center',block:'nearest'}); return true;} document.querySelector('[data-test-id=board_view_scroller]').scrollLeft-=700; return false;})) break; await p.waitForTimeout(300);} await p.waitForTimeout(1000); await p.mouse.move(700,880);
 out.board=await p.evaluate(()=>{const h=document.querySelector('[data-test-id=board_column_header_deleted]'); const pan=h.closest('.board-column__panel'); const nb=[...document.querySelectorAll('[data-test-id^=board_column_drag_handle_]')].map(e=>{const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};}).filter(r=>r.x>320&&r.x<1100)[0]; const r=x=>{const b=x.getBoundingClientRect(); return {x:b.x,y:b.y,w:b.width,h:b.height};}; return {header:r(h),badge:r(h.querySelector('.q-badge')),panel:r(pan),normalGrip:nb};});
 await p.screenshot({path:'/tmp/qa11310/ex/x16-board.png'}); console.log('board',JSON.stringify(out.board));
 await toView(p,'tech_view'); await p.waitForTimeout(2500);
 for(let k=0;k<2;k++){ if(/Expand/.test(await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'))) break; await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);} await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);
 for(let i=0;i<90;i++){ if(await p.$('[data-test-id=tech_view_group_deleted]')) break; await p.evaluate(()=>{document.querySelector('.q-table__middle').scrollTop+=500;}); await p.waitForTimeout(350);}
 await p.evaluate(()=>document.querySelector('[data-test-id=tech_view_group_deleted]').scrollIntoView({block:'center'})); await p.waitForTimeout(1200); await p.mouse.move(700,100);
 out.tech=await p.evaluate(()=>{const g=document.querySelector('[data-test-id=tech_view_group_deleted]'); const r=x=>{const b=x.getBoundingClientRect(); return {x:b.x,y:b.y,w:b.width,h:b.height};}; const prev=[...document.querySelectorAll('[data-test-id^=tech_view_group_drag_handle_]')].map(r).filter(b=>b.y>0&&b.y<g.getBoundingClientRect().y).pop(); return {group:r(g),badge:r(g.querySelector('.q-badge')),normalGrip:prev};});
 await p.screenshot({path:'/tmp/qa11310/ex/x16-tech.png'}); console.log('tech',JSON.stringify(out.tech));
 await s.go('/workorders?tab=all&search=S2-36641'); await p.waitForTimeout(3500); await toView(p,'list'); await p.waitForTimeout(3000); await p.mouse.move(700,880);
 out.list=await p.evaluate(()=>{const heads=[...document.querySelectorAll('thead th')].map(t=>t.innerText.replace('arrow_drop_up','').trim()); const i=heads.indexOf('Lead Technician'); const row=[...document.querySelectorAll('tbody tr')].find(r=>/S2-36641/.test(r.innerText)); const c=row.children[i]; const b=c.getBoundingClientRect(); return {text:c.innerText.trim(),x:b.x,y:b.y,w:b.width,h:b.height};});
 await p.screenshot({path:'/tmp/qa11310/ex/x16-list.png'}); console.log('list',JSON.stringify(out.list));
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})});
fs.writeFileSync('/tmp/qa11310/ex/x16.json',JSON.stringify(out,null,1)); await s.close();
