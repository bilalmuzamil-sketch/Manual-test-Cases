// SV-11119: two sessions reorder Vic Hover's column; later save should win
import {session,toView} from './rec.mjs'; import fs from 'fs';
const A=await session({vp:{width:1440,height:900}}); const B=await session({quick:process.argv[2]||'tech',vp:{width:1440,height:900}});
const log={mk:await A.marker(), who:{}};
for(const [k,s] of [['A',A],['B',B]]){ const r=await s.api('/api/auth/me/fe-permissions'); log.who[k]=JSON.stringify(r.json?.data?.template_slug||r.json?.data?.view_mode||'').slice(0,40); }
const OWN=['display','tab','density','collapsedGroups']; const gp=async s=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const p0A=await gp(A), p0B=await gp(B);
const col=async p=>{ for(let i=0;i<120;i++){ const ok=await p.evaluate(()=>{const h=[...document.querySelectorAll('[data-test-id^=board_column_header_]')].find(e=>/Vic Hover/.test(e.innerText)); if(h){ h.scrollIntoView({inline:'center',block:'nearest'}); return true;} document.querySelector('[data-test-id=board_view_scroller]').scrollLeft+=900; return false;}); if(ok) break; await p.waitForTimeout(300);} await p.waitForTimeout(1200);
 return p.evaluate(()=>{const h=[...document.querySelectorAll('[data-test-id^=board_column_header_]')].find(e=>/Vic Hover/.test(e.innerText)); const pn=h.closest('.board-column__panel'); return [...pn.querySelectorAll('.board-card')].map(c=>{const r=c.getBoundingClientRect(); const t=c.innerText; return {n:(t.match(/S\d*-\d+/)||[])[0],c:((t.match(/(Zeta|Alpha|Mid)/)||[''])[0]),x:r.x+r.width/2,y:r.y,h:r.height};});}); };
const drag=async(p,from,to)=>{ await p.mouse.move(from.x,from.y,{steps:8}); await p.mouse.down(); for(const d of [3,6,9,12]){ await p.mouse.move(from.x+d,from.y+d); await p.waitForTimeout(40);} for(let i=1;i<=24;i++){ await p.mouse.move(from.x+(to.x-from.x)*i/24,from.y+(to.y-from.y)*i/24); await p.waitForTimeout(55);} await p.waitForTimeout(700); await p.mouse.up(); await p.waitForTimeout(2500); };
const short=o=>o.map(x=>x.c||x.n).join(', ');
try{
 for(const s of [A,B]){ await s.go('/workorders?tab=all&search=ZZ96929'); await s.page.waitForTimeout(3500); await toView(s.page,'board_view'); await s.page.waitForTimeout(3500); }
 const a0=await col(A.page), b0=await col(B.page); log.start={A:short(a0),B:short(b0)}; await A.page.screenshot({path:'/tmp/qa11310/ex20/k4c-A0.png'}); await B.page.screenshot({path:'/tmp/qa11310/ex20/k4c-B0.png'});
 // A: drag the LAST card (Alpha) to the top
 const la=a0[a0.length-1], fa=a0[0]; await drag(A.page,{x:la.x,y:la.y+40},{x:fa.x,y:fa.y+8}); log.A1=short(await col(A.page)); log.toastA=await A.page.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ').trim())); await A.page.screenshot({path:'/tmp/qa11310/ex20/k4c-A1.png'});
 // B (stale view, no refresh): drag the MIDDLE card (Zeta) to the top
 const mb=b0[1], fb=b0[0]; await drag(B.page,{x:mb.x,y:mb.y+40},{x:fb.x,y:fb.y+8}); log.B1=short(await col(B.page)); log.toastB=await B.page.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ').trim())); await B.page.screenshot({path:'/tmp/qa11310/ex20/k4c-B1.png'});
 for(const s of [A,B]){ await s.page.reload(); await s.page.waitForTimeout(5000); }
 log.A2=short(await col(A.page)); log.B2=short(await col(B.page)); await A.page.screenshot({path:'/tmp/qa11310/ex20/k4c-A2.png'}); await B.page.screenshot({path:'/tmp/qa11310/ex20/k4c-B2.png'});
}catch(e){ log.err=e.message.slice(0,300); }
for(const [s,p0] of [[A,p0A],[B,p0B]]){ try{ const cur=await gp(s); const v={...cur}; for(const k of OWN) v[k]=p0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})}); }catch(e){} }
fs.writeFileSync('/tmp/qa11310/ex20/k4c.json',JSON.stringify(log,null,1)); console.log(JSON.stringify(log)); await A.close(); await B.close();
