import {session,toView,dens} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={mk:await s.marker()};
const OWN=['display','tab','density','collapsedGroups','filters']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
await s.go('/workorders?tab=all&search=S2-17495'); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3000); await dens(p,'regular'); await p.waitForTimeout(1500);
const c=await p.evaluate(()=>{const e=[...document.querySelectorAll('.board-card')].find(e=>e.innerText.includes('S2-17495')); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};}); out.card=c; console.log(JSON.stringify(c));
if(c){ const clip={x:c.x-20,y:c.y-20,width:c.w+40,height:c.h+40}; out.clip=clip;
 await p.mouse.move(700,60); await p.waitForTimeout(600); await p.screenshot({path:'ex41/same-rest.png',clip}); await p.screenshot({path:'ex41/same-rest-full.png'});
 await p.mouse.move(c.x+c.w/2,c.y+c.h*0.6,{steps:8}); await p.waitForTimeout(800); await p.screenshot({path:'ex41/same-hover.png',clip}); await p.screenshot({path:'ex41/same-hover-full.png'});
 out.hov=await p.evaluate(()=>{const e=[...document.querySelectorAll('.board-card')].find(e=>e.innerText.includes('S2-17495')); return getComputedStyle(e).boxShadow;}); }
const cur=await getP(); const vv={...cur}; for(const k of OWN) vv[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:vv})});
out.restored=JSON.stringify(await getP())===JSON.stringify(prefs0); out.mkEnd=await s.marker(); fs.writeFileSync('ex41/same.json',JSON.stringify(out,null,1)); await s.close(); console.log(out.hov,out.restored,out.mkEnd.version);
