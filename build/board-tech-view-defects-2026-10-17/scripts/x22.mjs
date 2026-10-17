import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={mk:await s.marker()};
const OWN=['display','collapsedGroups','tab']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const act=()=>p.evaluate(()=>{const a=document.activeElement; const r=a.getBoundingClientRect(); const cs=getComputedStyle(a); return {tid:(a.dataset?.testId||a.tagName).replace(/[0-9a-f-]{36}/,'<id>'),num:(a.innerText.match(/S\d-\d+/)||[])[0],txt:(a.innerText||'').replace(/\s+/g,' ').trim().slice(0,40),ring:cs.outlineStyle+' '+cs.outlineWidth+' '+cs.outlineColor,x:r.x,y:r.y,w:r.width,h:r.height};});
const tabIn=async(max=15)=>{ for(let i=0;i<max;i++){ await p.keyboard.press('Tab'); await p.waitForTimeout(300); const a=await act(); if(/tech_view_row_|tech_view_group_|board_card_|board_column_header_/.test(a.tid)) return a; } return null; };
const fromSearch=async()=>{ await p.click('[data-test-id=page_search_clear]').catch(()=>{}); };
const open=async(q,view)=>{ await s.go('/workorders?tab=all&search='+encodeURIComponent(q)); await p.waitForTimeout(3500); await toView(p,view); await p.waitForTimeout(2500); };
const expandAll=async()=>{ for(let k=0;k<2;k++){ if(/Expand/.test(await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'))) break; await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);} await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500); };
const startTab=async()=>{ const b=await p.evaluate(()=>{const e=document.querySelector('[data-test-id=page_search_clear]')||document.querySelector('[data-test-id=button_new_work_order]'); const r=e.getBoundingClientRect(); return {x:r.x,y:r.y};}); await p.evaluate(()=>{(document.querySelector('[data-test-id=page_search_clear]')||document.querySelector('[data-test-id=button_new_work_order]')).focus();}); };
const shot=async n=>{ await p.mouse.move(1435,895); await p.waitForTimeout(400); await p.screenshot({path:`/tmp/qa11310/ex/x22-${n}.png`}); };
try{
 // 1 first tab
 await open('ZZAUTOTEST F3 Keyboard Reach','tech_view'); await expandAll(); await startTab(); out.first=await tabIn(); await shot('1-first'); console.log('first',JSON.stringify(out.first));
 // 2 arrow onto header, tab out, shift-tab back in
 await p.keyboard.press('ArrowUp'); await p.waitForTimeout(500); out.header=await act(); await shot('2a-header'); await p.keyboard.press('Shift+Tab'); await p.waitForTimeout(400); out.out=await act(); await p.keyboard.press('Tab'); await p.waitForTimeout(500); out.back=await act(); await shot('2b-back'); console.log('header',JSON.stringify(out.header),'out',out.out.tid,'back',JSON.stringify(out.back));
 // 3 all collapsed
 await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500); out.label=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'); await startTab(); out.collapsed=await tabIn(); await shot('3-collapsed'); console.log('collapsed',out.label,JSON.stringify(out.collapsed));
 await expandAll();
 // 4 Unassigned empty: S2-16688
 await open('S2-16688','tech_view'); await expandAll(); await startTab(); out.unEmpty=await tabIn(); await shot('4-unassigned-empty'); console.log('unEmpty',JSON.stringify(out.unEmpty));
 // 5 Unassigned collapsed: search "Truck"
 await open('Truck','tech_view'); await expandAll(); await p.click('[data-test-id=button_tech_view_group_toggle_unassigned]').catch(async()=>{ await p.click('[data-test-id=tech_view_group_unassigned] [data-test-id^=button_tech_view_group_toggle_]'); }); await p.waitForTimeout(2000);
 out.firstTechRow=await p.evaluate(()=>{const r=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].filter(e=>/^tech_view_row_[0-9a-f-]{36}$/.test(e.dataset.testId))[0]; return r?(r.innerText.match(/S\d-\d+/)||[])[0]:null;});
 await startTab(); out.unCollapsed=await tabIn(); await shot('5-unassigned-collapsed'); console.log('unCollapsed',out.firstTechRow,JSON.stringify(out.unCollapsed));
 await p.click('[data-test-id=button_tech_view_group_toggle_unassigned]').catch(()=>{}); await p.waitForTimeout(1500);
 // 6 Board first tab
 await open('ZZAUTOTEST F3 Keyboard Reach','board_view'); await startTab(); out.board=await tabIn(); await shot('6-board-first'); console.log('board',JSON.stringify(out.board));
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})});
fs.writeFileSync('/tmp/qa11310/ex/x22.json',JSON.stringify(out,null,1)); await s.close();
