// SV-11467: status pill vs count bubbles, per density and view
import {session,toView,dens} from './rec.mjs'; import fs from 'fs';
const [view='tech_view',D='compact',search='',DPR='1',W='1600']=process.argv.slice(2);
const s=await session({vp:{width:+W,height:+(process.env.VH||900)},dpr:+DPR}); const p=s.page;
const gp=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const p0=await gp();
const out={view,D,search,mk:await s.marker()}; const tag=`${view}-${D}${search?'-'+search:''}${DPR!=='1'?'-hd':''}`;
try{
 await s.go('/workorders?tab=all'); await p.waitForTimeout(3500); await toView(p,view); await p.waitForTimeout(2500);
 if(view!=='list') { await dens(p,D); out.dens=await p.evaluate(()=>document.querySelector('[data-test-id=button_density]')?.getAttribute('aria-label')); }
 if(search){ await p.click('[data-test-id=page_search_toggle]').catch(()=>{}); await p.waitForTimeout(600); await p.fill('[data-test-id=page_search_input]',search); await p.waitForTimeout(4000); }
 const tg=await p.$('[data-test-id=button_tech_view_group_toggle_unassigned]'); if(tg && await tg.getAttribute('aria-expanded')==='false'){ await tg.click(); await p.waitForTimeout(2500); }
 out.rows=await p.evaluate(()=>{
  const res=[]; const dbg={tr:document.querySelectorAll('tr').length,badges:document.querySelectorAll('.service-actions .q-badge, .parts-actions .q-badge').length}; res.dbg=dbg; for(const row of document.querySelectorAll('tr')){
   const bs=[...row.querySelectorAll('.service-actions .q-badge, .parts-actions .q-badge')]; if(!bs.length) continue;
   const td=bs[0].closest('td'); const tr=td.getBoundingClientRect(); if(tr.bottom<0||tr.top>innerHeight) continue;
   // status text = text nodes in the cell that are not inside a badge
   const w=document.createTreeWalker(td,NodeFilter.SHOW_TEXT); let n, rs=[], txt='';
   while(n=w.nextNode()){ if(!n.textContent.trim()|| n.parentElement.closest('.service-actions, .parts-actions')) continue; const rg=document.createRange(); rg.selectNodeContents(n); for(const r of rg.getClientRects()) rs.push(r); txt+=n.textContent.trim()+' '; }
   if(!rs.length) continue;
   const T={l:Math.min(...rs.map(r=>r.left)),r:Math.max(...rs.map(r=>r.right)),t:Math.min(...rs.map(r=>r.top)),b:Math.max(...rs.map(r=>r.bottom))};
   // the pill = nearest ancestor of the first text node with a background and a radius
   let pe=rs.length? document.elementFromPoint((T.l+T.r)/2,(T.t+T.b)/2):null; let pill=null; for(let e=pe;e&&e!==td;e=e.parentElement){ const cs=getComputedStyle(e); if(cs.backgroundColor!=='rgba(0, 0, 0, 0)'&&parseFloat(cs.borderRadius)>0){pill=e;break;} }
   const P=pill?pill.getBoundingClientRect():null;
   const B=bs.map(b=>{const r=b.getBoundingClientRect(); const hx=Math.max(0,Math.min(r.right,T.r)-Math.max(r.left,T.l)); const vy=Math.max(0,Math.min(r.bottom,T.b)-Math.max(r.top,T.t)); return {c:b.classList.contains('bg-red-5')?'red':'blue',n:b.textContent.trim(),x:+r.left.toFixed(1),y:+r.top.toFixed(1),w:+r.width.toFixed(1),h:+r.height.toFixed(1),overText_h:+hx.toFixed(1),overText_v:+vy.toFixed(1)};});
   const wo=(row.innerText.match(/S\d*-\d+/)||[])[0];
   res.push({wo,status:txt.trim(),text:{l:+T.l.toFixed(1),r:+T.r.toFixed(1),t:+T.t.toFixed(1),b:+T.b.toFixed(1),h:+(T.b-T.t).toFixed(1)},pill:P?{x:+P.left.toFixed(1),y:+P.top.toFixed(1),w:+P.width.toFixed(1),h:+P.height.toFixed(1)}:null,badges:B,
     coverPct:Math.round(100*Math.max(...B.map(b=>b.overText_h>0?b.overText_v:0))/(T.b-T.t))});
  } return {dbg,res};}); out.dbg=out.rows.dbg; out.rows=out.rows.res;
 await p.screenshot({path:`/tmp/qa11310/s467/${tag}.png`});
}catch(e){ out.err=e.message.slice(0,300); }
try{ const cur=await gp(); const v={...cur}; for(const k of ['display','tab','density','collapsedGroups']) v[k]=p0[k]; out.restore=(await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})})).status; }catch(e){}
fs.writeFileSync(`/tmp/qa11310/s467/${tag}.json`,JSON.stringify(out,null,1));
console.log(view,D,search,out.mk?.version,'rows',out.rows?.length,out.err||'');
for(const r of (out.rows||[]).slice(0,40)) console.log(r.wo,'|',r.status,'| text',r.text.t,'-',r.text.b,'| pill',r.pill&&r.pill.h,'| badges',r.badges.map(b=>b.c+b.n+'@'+b.y+'(+'+b.h+')').join(' '),'| cover%',r.coverPct);
await s.close();
