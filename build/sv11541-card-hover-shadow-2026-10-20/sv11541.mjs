import {session,toView,dens} from './rec.mjs'; import fs from 'fs';
const who=process.argv[2]||'admin';
const s=await session({quick:who,vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={who,mk:await s.marker(),cells:[],anc:{}};
const OWN=['display','tab','density','collapsedGroups']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP(); out.prefs0=prefs0;
const theme=async t=>{await s.glideClick('profile_menu_button'); await p.waitForTimeout(900); await s.glideClick(`button_night_mode_${t}`); await p.waitForTimeout(1500); await p.keyboard.press('Escape').catch(()=>{}); await p.waitForTimeout(800);};
const read=(n)=>p.evaluate((n)=>{const c=[...document.querySelectorAll('.board-card')].find(e=>e.innerText.includes(n)); if(!c) return null; const cs=getComputedStyle(c); const r=c.getBoundingClientRect();
  const anc=[]; let e=c.parentElement; for(let i=0;i<10&&e;i++,e=e.parentElement){const s2=getComputedStyle(e); const q=e.getBoundingClientRect(); if(s2.contain!=='none'||s2.overflowX!=='visible'||s2.overflowY!=='visible'||s2.clipPath!=='none') anc.push({cls:(e.className||'').toString().slice(0,50),contain:s2.contain,ox:s2.overflowX,oy:s2.overflowY,L:+(r.left-q.left).toFixed(1),R:+(q.right-r.right).toFixed(1)}); if(/board-column__panel/.test(e.className)) break;}
  return {shadow:cs.boxShadow,border:cs.borderColor,transform:cs.transform,x:+r.x.toFixed(2),y:+r.y.toFixed(2),w:+r.width.toFixed(2),h:+r.height.toFixed(2),anc};},n);
const cell=async(label,n)=>{ await p.mouse.move(700,60); await p.waitForTimeout(600); const rest=await read(n); if(!rest){ out.cells.push({label,n,err:'not found'}); console.log(label,n,'not found'); return; }
 const clip={x:Math.max(0,rest.x-20),y:rest.y-20,width:rest.w+40,height:rest.h+40};
 await p.screenshot({path:`ex41/${label}-rest.png`,clip});
 await p.mouse.move(rest.x+rest.w*0.5,rest.y+rest.h*0.55,{steps:8}); await p.waitForTimeout(800); const hov=await read(n);
 await p.screenshot({path:`ex41/${label}-hover.png`,clip});
 const c={label,n,clip,rest,hov,moved:rest.x!==hov.x||rest.y!==hov.y||rest.w!==hov.w||rest.h!==hov.h}; out.cells.push(c);
 console.log(label,n,'| rest',rest.shadow.slice(0,24),'| hover',hov.shadow.slice(0,90),'| border',rest.border,'->',hov.border,'| moved',c.moved,'| clippers',JSON.stringify(hov.anc).slice(0,160)); };
try{
 await s.go('/workorders?tab=all'); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3000);
 for(const th of ['light','dark']){ if(th==='dark') await theme('dark'); out['cls_'+th]=await p.evaluate(()=>document.body.className.match(/body--(dark|light)/)?.[0]);
  for(const d of ['compact','regular','comfortable']){ await dens(p,d); await p.waitForTimeout(1500);
   const vis=await p.evaluate(()=>{const cs=[...document.querySelectorAll('.board-card')].filter(c=>{const r=c.getBoundingClientRect(); return r.left>=0&&r.right<=1440&&r.top>215&&r.bottom<880;}); const byCol={}; for(const c of cs){ const k=Math.round(c.getBoundingClientRect().left); (byCol[k]=byCol[k]||[]).push((c.innerText.match(/S\d-\d+/)||[])[0]); } return byCol;});
   const cols=Object.keys(vis).map(Number).sort((a,b)=>a-b);
   const picks=[['unassigned-1',vis[cols[0]][0]],['unassigned-2',vis[cols[0]][1]],['tech-col',vis[cols[1]]?.[0]],['rightmost',vis[cols[cols.length-1]][0]]];
   for(const [l,n] of picks) if(n) await cell(`${who}-${th}-${d}-${l}`,n);
  }}
 await theme('light'); out.clsEnd=await p.evaluate(()=>document.body.className.match(/body--(dark|light)/)?.[0]);
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
const cur=await getP(); const vv={...cur}; for(const k of OWN) vv[k]=prefs0[k]; if(!('density' in prefs0)) delete vv.density; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:vv})});
out.prefsEnd=await getP(); out.restored=JSON.stringify(out.prefsEnd)===JSON.stringify(prefs0); out.mkEnd=await s.marker(); fs.writeFileSync(`ex41/run-${who}.json`,JSON.stringify(out,null,1)); await s.close(); console.log('mk',out.mk.version,out.mkEnd.version,'clsEnd',out.clsEnd,'restored',out.restored);
