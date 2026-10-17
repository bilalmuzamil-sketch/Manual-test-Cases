import {session,toView,dens} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:1}); const p=s.page; const out={};
const OWN=['density','display','tab']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
await s.go('/workorders?tab=all&search=S2-16688'); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3000); await dens(p,'comfortable'); await p.waitForTimeout(1500);
for(let i=0;i<40;i++){ const f=await p.evaluate(()=>[...document.querySelectorAll('.board-card')].some(c=>/S2-16688/.test(c.innerText))); if(f) break; await p.evaluate(()=>{document.querySelector('[data-test-id=board_view_scroller]').scrollLeft+=900;}); await p.waitForTimeout(500);}
for(const k of ['.board-card__crew .q-avatar','[data-test-id=avatar_group_overflow]']){ const b=await p.evaluate(k=>{const e=[...document.querySelectorAll('.board-card')].find(c=>/S2-16688/.test(c.innerText)).querySelector(k); e.scrollIntoView({block:'center',inline:'center'}); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,top:r.top};},k); await p.waitForTimeout(600);
 await p.mouse.move(b.x-80,b.y+60); await p.mouse.move(b.x,b.y,{steps:8}); await p.waitForTimeout(1200);
 const t=await p.evaluate(()=>{const t=[...document.querySelectorAll('.q-tooltip')].filter(x=>x.getBoundingClientRect().height>0)[0]; return t?{text:t.innerText,bottom:t.getBoundingClientRect().bottom}:null;}); out[k]={top:b.top,t,above:t?t.bottom<=b.top:null}; await p.mouse.move(5,890); await p.waitForTimeout(500); }
console.log(JSON.stringify(out));
const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})}); await s.close();
