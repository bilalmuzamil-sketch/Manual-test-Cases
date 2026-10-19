import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={mk:await s.marker()};
const OWN=['display','tab','density','collapsedGroups']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
await s.go('/workorders?tab=all'); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3000);
out.anc=await p.evaluate(()=>{const c=[...document.querySelectorAll('.board-card')][0]; const cr=c.getBoundingClientRect(); const res=[]; let e=c.parentElement; let i=0; while(e&&i<12){ const cs=getComputedStyle(e); const r=e.getBoundingClientRect(); res.push({cls:(e.className||'').toString().slice(0,60),tag:e.tagName,ox:cs.overflowX,oy:cs.overflowY,clip:cs.clipPath,contain:cs.contain,L:+(cr.left-r.left).toFixed(1),R:+(r.right-cr.right).toFixed(1),T:+(cr.top-r.top).toFixed(1),B:+(r.bottom-cr.bottom).toFixed(1),pl:cs.paddingLeft,pr:cs.paddingRight}); e=e.parentElement; i++; } return {card:{l:cr.left,r:cr.right,cls:c.className.slice(0,80)},res};});
console.log(JSON.stringify(out.anc,null,0).slice(0,2500));
const cur=await getP(); const vv={...cur}; for(const k of OWN) vv[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:vv})});
fs.writeFileSync('/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16/sv11394-retest-2026-10-19/clip94.json',JSON.stringify(out,null,1)); await s.close();
