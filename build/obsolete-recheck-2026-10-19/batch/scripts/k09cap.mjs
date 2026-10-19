import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={mk:await s.marker(),shots:{}};
const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
const putP=async v=>(await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})})).status;
const prefs0=await getP();
const geo=()=>p.evaluate(()=>{const R=e=>{const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};}; const a=document.activeElement; const tips=[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].filter(t=>t.getBoundingClientRect().height>0); const m=[...document.querySelectorAll('.q-menu')].find(m=>m.getBoundingClientRect().height>0);
 return {active:{tid:a.dataset?.testId||'',label:a.getAttribute('aria-label')||'',...R(a)},tip:tips[0]?{text:tips[0].innerText.trim(),...R(tips[0])}:null,menu:m?R(m):null,row:a.closest('tr,[data-test-id^=board_card_]')?R(a.closest('tr,[data-test-id^=board_card_]')):null};});
const shot=async k=>{ await p.waitForTimeout(700); out.shots[k]=await geo(); await p.screenshot({path:`/tmp/qa11310/ev09/cap-${k}.png`}); console.log(k,JSON.stringify(out.shots[k]).slice(0,300)); };
const act=()=>p.evaluate(()=>{const a=document.activeElement; return {tid:a.dataset?.testId||'',full:(a.innerText||'').replace(/\s+/g,' ')};});
const reach=async(view,target)=>{ await p.focus('[data-test-id=button_new_work_order]'); await p.keyboard.press('Tab'); await p.waitForTimeout(400); let prev=''; for(let i=0;i<80;i++){ const x=await act(); if(x.full.includes(target)) return true; let key='ArrowDown'; if(view!=='tech_view'&&x.full===prev) key='ArrowRight'; prev=x.full; await p.keyboard.press(key); await p.waitForTimeout(250); if(key==='ArrowRight') prev=''; } return false; };
const tabTo=async(re,max=12)=>{ for(let i=0;i<max;i++){ await p.keyboard.press('Tab'); await p.waitForTimeout(450); const x=await act(); if(re.test(x.tid)) return x; } return null; };
try{
 // Tech View avatars
 await s.go('/workorders?tab=all&search=Lamkin'); await p.waitForTimeout(3500); await toView(p,'tech_view'); await p.waitForTimeout(2000);
 for(let k=0;k<2;k++){ if(/Expand/.test(await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'))) break; await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);} await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(3000); await p.mouse.move(700,895);
 out.reachT=await reach('tech_view','S2-12718'); await tabTo(/^avatar_technician_/); await shot('tv-avatar1');
 await tabTo(/^avatar_group_overflow/); await shot('tv-overflow');
 // Board View avatars
 await toView(p,'board_view'); await p.waitForTimeout(2500); await p.mouse.move(700,895);
 out.reachB=await reach('board_view','S2-12718'); await tabTo(/^avatar_technician_/); await shot('bv-avatar1');
 await tabTo(/^avatar_group_overflow/); await shot('bv-overflow');
 // Columns menu (Tech View)
 await s.go('/workorders?tab=all'); await p.waitForTimeout(3000); await toView(p,'tech_view'); await p.waitForTimeout(2000); await p.mouse.move(700,895);
 await p.focus('[data-test-id=button_tech_view_column_selection]'); await p.keyboard.press('Enter'); await p.waitForTimeout(1000); await tabTo(/toggle_tech_view_column_unit/,6); await p.keyboard.press('Space'); await p.waitForTimeout(1500); await shot('tv-columns-unit-off');
 await p.keyboard.press('Space'); await p.waitForTimeout(1200); await p.keyboard.press('Escape'); await p.waitForTimeout(800);
 // chip x
 await p.focus('[data-test-id=filter_chip_status]'); await p.keyboard.press('Enter'); await p.waitForTimeout(1000); for(let i=0;i<3;i++){ await p.keyboard.press('Tab'); await p.waitForTimeout(300);} await p.keyboard.press('Space'); await p.waitForTimeout(1800); await p.keyboard.press('Escape'); await p.waitForTimeout(1500);
 await p.keyboard.press('Tab'); await p.waitForTimeout(500); const x=await act(); out.xFocused=x.tid; await shot('tv-chip-x');
 await p.keyboard.press('Enter'); await p.waitForTimeout(2500); out.afterX=await p.evaluate(()=>document.querySelector('[data-test-id=filter_chip_status]').innerText.replace(/\s+/g,' ')); await shot('tv-chip-cleared');
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
const cur=await getP(); const ch=Object.keys(prefs0).filter(k=>JSON.stringify(prefs0[k])!==JSON.stringify(cur[k])); if(ch.length){ const v={...cur}; for(const k of ch) v[k]=prefs0[k]; out.put=await putP(v);} out.restoredKeys=ch;
console.log(JSON.stringify({reachT:out.reachT,reachB:out.reachB,xFocused:out.xFocused,afterX:out.afterX,restored:ch}));
fs.writeFileSync('/tmp/qa11310/ev09/cap.json',JSON.stringify(out,null,1)); await s.close();
