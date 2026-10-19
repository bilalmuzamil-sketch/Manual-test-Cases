import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={mk:await s.marker()};
const OWN=['display','tab','density','collapsedGroups']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
await s.go('/workorders?tab=all&search=Lamkin'); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3000);
const card=async()=>p.evaluate(()=>{const c=[...document.querySelectorAll('.board-card')][1]||[...document.querySelectorAll('.board-card')][0]; const r=c.getBoundingClientRect(); return {n:(c.innerText.match(/S\d-\d+/)||[])[0],x:r.x,y:r.y,w:r.width,h:r.height};});
const c=await card(); out.card=c; const clip={x:c.x-20,y:c.y-20,width:c.w+40,height:c.h+40};
await p.mouse.move(5,890); await p.waitForTimeout(500); await p.screenshot({path:'/tmp/qa11310/ex/cmp94-rest.png',clip});
await p.mouse.move(c.x+c.w/2,c.y+c.h*0.6,{steps:8}); await p.waitForTimeout(800); await p.screenshot({path:'/tmp/qa11310/ex/cmp94-hover.png',clip});
// comparison only: switch off the list's paint containment (developer tools equivalent)
await p.evaluate(()=>document.querySelectorAll('.q-virtual-scroll__content').forEach(e=>e.style.contain='none'));
await p.mouse.move(5,890); await p.waitForTimeout(400); await p.mouse.move(c.x+c.w/2,c.y+c.h*0.6,{steps:8}); await p.waitForTimeout(800); await p.screenshot({path:'/tmp/qa11310/ex/cmp94-hover-nocontain.png',clip});
const cur=await getP(); const vv={...cur}; for(const k of OWN) vv[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:vv})});
fs.writeFileSync('/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16/sv11394-retest-2026-10-19/cmp94.json',JSON.stringify(out,null,1)); await s.close(); console.log(JSON.stringify(out));
