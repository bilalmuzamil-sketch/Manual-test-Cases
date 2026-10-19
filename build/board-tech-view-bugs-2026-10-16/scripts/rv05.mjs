import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900}}); const p=s.page; const out={mk:await s.marker(),rows:{}};
console.log('mk',JSON.stringify(out.mk));
const OWN=['display','tab','density','collapsedGroups']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const tip=()=>p.evaluate(()=>{const t=[...document.querySelectorAll('.q-tooltip')].find(x=>x.getBoundingClientRect().height>0); return t?t.innerText.trim():null;});
const WOS=['S2-36237','S2-36736','S2-17528','S2-34941','S2-36633','S2-36632','S2-36630','S2-36772','S2-36634','S2-34827','S2-36332','S2-36683'];
const HOVER=['S2-34941','S2-17528'];
try{
for(const wo of WOS){ const r={};
 for(const v of ['board_view','list','tech_view']){
  await s.go(`/workorders?tab=all&search=${wo}`); await p.waitForTimeout(2500); await toView(p,v); await p.waitForTimeout(2000);
  const m=await p.evaluate(({v,wo})=>{ const root=v==='board_view'?[...document.querySelectorAll('.board-card')].find(c=>c.innerText.includes(wo)):[...document.querySelectorAll('tbody tr')].find(t=>t.innerText.includes(wo)); if(!root) return null;
    const bs=[...root.querySelectorAll('.q-badge')]; const pl=bs.find(b=>!b.classList.contains('q-badge--floating')&&/[A-Za-z]/.test(b.innerText)); if(!pl) return {nopill:true};
    const cs=getComputedStyle(pl), pb=pl.getBoundingClientRect(), rb=root.getBoundingClientRect();
    const ct=bs.filter(b=>/^\d+$/.test(b.innerText.trim())).map(e=>{const b=e.getBoundingClientRect(); return {t:e.innerText.trim(),c:getComputedStyle(e).backgroundColor,x:b.x+b.width/2,y:b.y+b.height/2};});
    return {t:pl.innerText.trim(),w:+pb.width.toFixed(1),h:+pb.height.toFixed(1),bg:cs.backgroundColor,fg:cs.color,top:+(pb.top-rb.top).toFixed(1),right:+(rb.right-pb.right).toFixed(1),counts:ct};},{v,wo});
  if(m&&HOVER.includes(wo)&&m.counts){ m.tips=[]; for(const c of m.counts){ await p.mouse.move(5,5); await p.waitForTimeout(300); await p.mouse.move(c.x,c.y,{steps:6}); await p.waitForTimeout(900); m.tips.push(await tip()); } }
  if(m&&m.counts) m.counts=m.counts.map(c=>c.t+':'+c.c);
  r[v]=m;
 }
 out.rows[wo]=r; console.log(wo,JSON.stringify(r));
}}catch(e){ console.log('ERR',e.message.slice(0,200)); }
const cur=await getP(); const vv={...cur}; for(const k of OWN) vv[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:vv})});
out.mkEnd=await s.marker(); fs.writeFileSync('/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16/sv11405/data/recheck-31ad1e1.json',JSON.stringify(out,null,1)); await s.close(); console.log('DONE');
