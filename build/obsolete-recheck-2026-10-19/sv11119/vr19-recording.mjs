// SV-11119 silent recording: two browsers reorder Vic Hover's column; refresh; later save should win
import {session,toView} from './rec.mjs'; import fs from 'fs';
const VP={width:1440,height:900}; const D='/tmp/qa11310/vid19';
const A=await session({vp:VP,record:D+'/A'}); const rAw=Date.now(); const B=await session({quick:'admin',vp:VP,record:D+'/B'}); const rBw=Date.now();
const log={mk:await A.marker(),rAw,rBw};
const OWN=['display','tab','density','collapsedGroups']; const gp=async s=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const p0A=await gp(A), p0B=await gp(B);
const find=`[...document.querySelectorAll('[data-test-id^=board_column_header_]')].find(e=>/Vic Hover/.test(e.innerText))`;
const col=async p=>{ for(let i=0;i<120;i++){ const ok=await p.evaluate(f=>{const h=eval(f); if(h){ h.scrollIntoView({inline:'center',block:'nearest'}); return true;} document.querySelector('[data-test-id=board_view_scroller]').scrollLeft+=600; return false;},find); if(ok) break; await p.waitForTimeout(250);} await p.waitForTimeout(1200);
 return p.evaluate(f=>{const h=eval(f); return [...h.closest('.board-column__panel').querySelectorAll('.board-card')].map(c=>{const r=c.getBoundingClientRect(); const t=c.innerText; return {n:(t.match(/S\d*-\d+/)||[])[0],c:((t.match(/(Zeta|Alpha|Mid)/)||[''])[0]),x:r.x+r.width/2,y:r.y};});},find); };
const drag=async(p,from,to)=>{ await p.mouse.move(from.x,from.y,{steps:14}); await p.waitForTimeout(400); await p.mouse.down(); for(const d of [3,6,9,12]){ await p.mouse.move(from.x+d,from.y+d); await p.waitForTimeout(40);} for(let i=1;i<=30;i++){ await p.mouse.move(from.x+(to.x-from.x)*i/30,from.y+(to.y-from.y)*i/30); await p.waitForTimeout(50);} await p.waitForTimeout(700); await p.mouse.up(); await p.waitForTimeout(2500); };
const nm=o=>o.slice(0,3).map(x=>x.c).join(', ');
try{
 for(const s of [A,B]){ await s.go('/workorders?tab=all&search=QA1019'); await s.page.waitForTimeout(3000); await toView(s.page,'board_view'); await s.page.waitForTimeout(2500); }
 const a0=await col(A.page), b0=await col(B.page); log.wR=Date.now(); log.start={A:nm(a0),B:nm(b0)};
 await A.caption(`Browser 1. Column "Vic Hover" starts: ${nm(a0)}`,{hold:100}); await B.caption(`Browser 2. Same column, same start: ${nm(b0)}`,{hold:2500});
 await A.caption(`Browser 1: drag ${a0[2].c} (3rd card) to the top`,{hold:1200});
 await drag(A.page,{x:a0[2].x,y:a0[2].y+40},{x:a0[0].x,y:a0[0].y+8}); const a1=await col(A.page); log.A1=nm(a1);
 await A.caption(`Browser 1 saved: ${nm(a1)}`,{hold:100});
 await B.caption(`Browser 2, no refresh: drag ${b0[1].c} (2nd card) to the top`,{hold:1200});
 await drag(B.page,{x:b0[1].x,y:b0[1].y+40},{x:b0[0].x,y:b0[0].y+8}); const b1=await col(B.page); log.B1=nm(b1);
 await B.caption(`Browser 2 saved last: ${nm(b1)}. This should win.`,{hold:2500});
 await A.caption('Refresh both browsers',{hold:100}); await B.caption('Refresh both browsers',{hold:800});
 await Promise.all([A.page.reload(),B.page.reload()]); await A.page.waitForTimeout(5000);
 const a2=await col(A.page), b2=await col(B.page); log.A2=nm(a2); log.B2=nm(b2);
 const ok=log.B2===log.B1;
 await A.caption(`After refresh: ${nm(a2)}`,{hold:100}); await B.caption(`After refresh: ${nm(b2)}. ${ok?'Browser 2 order kept':'Expected '+log.B1+' (FAILED)'}`,{hold:3500});
}catch(e){ log.err=e.message.slice(0,300); }
for(const [s,p0] of [[A,p0A],[B,p0B]]){ try{ const cur=await gp(s); const v={...cur}; for(const k of OWN) v[k]=p0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})}); }catch(e){} }
log.rA=await A.close(); log.rB=await B.close(); fs.writeFileSync(D+'/run.json',JSON.stringify(log,null,1)); console.log(JSON.stringify(log));
