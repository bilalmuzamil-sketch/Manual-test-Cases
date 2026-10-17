import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={mk:await s.marker()};
const OWN=['display','collapsedGroups','tab']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const tip=()=>p.evaluate(()=>{const t=[...document.querySelectorAll('.q-tooltip')].filter(x=>x.getBoundingClientRect().height>0)[0]; if(!t) return null; const r=t.getBoundingClientRect(); return {text:t.innerText.replace(/\s+/g,' '),x:r.x,y:r.y,w:r.width,h:r.height};});
const hov=async(name,sel)=>{ const b=await p.evaluate(sel=>{const e=eval(sel); e.scrollIntoView({block:'center',inline:'center'}); const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,text:e.innerText.trim()};},sel); await p.waitForTimeout(700);
 const b2=await p.evaluate(sel=>{const r=eval(sel).getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};},sel);
 await p.mouse.move(b2.x+b2.w/2-80,b2.y+b2.h/2+60); await p.waitForTimeout(400); await p.mouse.move(b2.x+b2.w/2,b2.y+b2.h/2,{steps:8}); await p.waitForTimeout(1300);
 const t=await tip(); out[name]={el:{...b2,text:b.text},tip:t,above:t?t.y+t.h<=b2.y:null}; await p.screenshot({path:`/tmp/qa11310/ex/x95-${name}.png`}); console.log(name,JSON.stringify(out[name])); await p.mouse.move(5,890); await p.waitForTimeout(600); };
try{
 await s.go('/workorders?tab=all&search=S2-16688'); await p.waitForTimeout(3500); await toView(p,'tech_view'); await p.waitForTimeout(2500);
 for(let k=0;k<2;k++){ if(/Expand/.test(await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'))) break; await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);} await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);
 const R="[...document.querySelectorAll('tr')].find(t=>/S2-16688/.test(t.innerText)&&/^tech_view_row_/.test(t.dataset.testId||''))";
 await hov('tech-avatar',R+".querySelector('[data-test-id^=avatar_technician_]')");
 await hov('tech-plusN',R+".querySelector('[data-test-id=avatar_group_overflow]')");
 await s.go('/workorders?tab=all&search=S2-16688'); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3000);
 for(let i=0;i<40;i++){ const f=await p.evaluate(()=>[...document.querySelectorAll('.board-card')].some(c=>/S2-16688/.test(c.innerText))); if(f) break; await p.evaluate(()=>{document.querySelector('[data-test-id=board_view_scroller]').scrollLeft+=900;}); await p.waitForTimeout(500);}
 const C="[...document.querySelectorAll('.board-card')].find(c=>/S2-16688/.test(c.innerText))";
 await hov('board-avatar',C+".querySelector('.board-card__crew .q-avatar, [data-test-id^=avatar_technician_]')");
 await hov('board-plusN',C+".querySelector('[data-test-id=avatar_group_overflow]')");
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})});
fs.writeFileSync('/tmp/qa11310/ex/x95.json',JSON.stringify(out,null,1)); await s.close();
