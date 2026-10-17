import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900}}); const p=s.page; const out={mk:await s.marker()};
const OWN=['display','tab','density','collapsedGroups']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
for(const q of ['S2-368','S2-363']){ out[q]={};
 for(const v of ['list','tech_view','board_view']){
  await s.go(`/workorders?tab=all&search=${q}`); await p.waitForTimeout(3000); await toView(p,v); await p.waitForTimeout(2500);
  if(v==='tech_view'){ // open every closed group
    for(let i=0;i<6;i++){ const n=await p.evaluate(()=>{const b=[...document.querySelectorAll('[data-test-id^=button_expand],[data-test-id^=toggle_group]')]; return b.length;}); if(!n) break; }
  }
  const r=await p.evaluate(v=>{ const res=[]; const re=/^S2-\d+$/;
    const roots=v==='board_view'?[...document.querySelectorAll('.board-card')]:[...document.querySelectorAll('tbody tr')];
    for(const root of roots){ const num=[...root.querySelectorAll('a,span,div')].map(e=>e.innerText&&e.innerText.trim()).find(t=>re.test(t||'')); const pl=[...root.querySelectorAll('.q-badge')].find(b=>!b.classList.contains('q-badge--floating')&&/[A-Za-z]/.test(b.innerText)); if(!num||!pl) continue; const b=pl.getBoundingClientRect(); const td=pl.closest('td'); res.push({n:num,t:pl.innerText.trim(),w:+b.width.toFixed(1),col:td?+td.getBoundingClientRect().width.toFixed(1):null,grp:v==='tech_view'?(root.closest('table')?[...document.querySelectorAll('table')].indexOf(root.closest('table')):null):null}); }
    return res;},v);
  out[q][v]=r; console.log(q,v,r.length, JSON.stringify(r.slice(0,4)));
 }
}
const cur=await getP(); const vv={...cur}; for(const k of OWN) vv[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:vv})});
fs.writeFileSync('/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16/sv11405/data/widths-mixed.json',JSON.stringify(out,null,1)); await s.close();
