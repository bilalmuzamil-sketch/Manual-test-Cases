import {session,toView,dens} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={mk:await s.marker(),cells:[]};
const OWN=['display','tab','density','collapsedGroups']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const theme=async t=>{await s.glideClick('profile_menu_button'); await p.waitForTimeout(900); await s.glideClick(`button_night_mode_${t}`); await p.waitForTimeout(1500); await p.keyboard.press('Escape').catch(()=>{}); await p.waitForTimeout(800);};
const read=(n)=>p.evaluate((n)=>{const c=[...document.querySelectorAll('.board-card')].find(e=>e.innerText.includes(n)); if(!c) return null; const cs=getComputedStyle(c); const r=c.getBoundingClientRect(); const col=c.closest('.board-column__body')?.getBoundingClientRect(); return {shadow:cs.boxShadow,border:cs.borderColor,transform:cs.transform,x:+r.x.toFixed(2),y:+r.y.toFixed(2),w:+r.width.toFixed(2),h:+r.height.toFixed(2),colL:col&&+col.left.toFixed(1),colR:col&&+col.right.toFixed(1)};},n);
const lum=async(r)=>{ const buf=await p.screenshot({clip:{x:r.x+20,y:r.y+r.h+1,width:r.w-40,height:6}}); return buf; };
const cell=async(label,n)=>{ await p.mouse.move(5,890); await p.waitForTimeout(500); const rest=await read(n); if(!rest){ out.cells.push({label,n,err:'not found'}); console.log(label,n,'not found'); return; }
 await p.screenshot({path:`/tmp/qa11310/ex/hv94b-${label}-${n}-rest.png`,clip:{x:Math.max(0,rest.x-16),y:rest.y-16,width:rest.w+32,height:rest.h+32}});
 await p.mouse.move(rest.x+rest.w/2,rest.y+rest.h*0.6,{steps:8}); await p.waitForTimeout(700); const hov=await read(n);
 await p.screenshot({path:`/tmp/qa11310/ex/hv94b-${label}-${n}-hover.png`,clip:{x:Math.max(0,rest.x-16),y:rest.y-16,width:rest.w+32,height:rest.h+32}});
 const c={label,n,rest,hov,moved:rest.x!==hov.x||rest.y!==hov.y||rest.w!==hov.w||rest.h!==hov.h}; out.cells.push(c); console.log(label,n,'| rest',rest.shadow.slice(0,30),'| hover',hov.shadow.slice(0,60),'| border',rest.border,'->',hov.border,'| moved',c.moved); };
try{
 await s.go('/workorders?tab=all'); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3000); await dens(p,'regular');
 const vis=await p.evaluate(()=>{const cs=[...document.querySelectorAll('.board-card')].filter(c=>{const r=c.getBoundingClientRect(); return r.left>=0&&r.right<=1440&&r.top>200&&r.bottom<885;}); const byCol={}; for(const c of cs){ const k=Math.round(c.getBoundingClientRect().left); (byCol[k]=byCol[k]||[]).push((c.innerText.match(/S\d-\d+/)||[])[0]); } return byCol;});
 out.visible=vis; console.log('visible columns',JSON.stringify(vis).slice(0,300));
 const cols=Object.keys(vis).map(Number).sort((a,b)=>a-b); const picks=[];
 picks.push(['first-col-top',vis[cols[0]][0]]); picks.push(['first-col-2nd',vis[cols[0]][1]]);
 if(cols.length>1) picks.push(['2nd-col-top',vis[cols[1]][0]]); picks.push(['rightmost-col-top',vis[cols[cols.length-1]][0]]);
 for(const [l,n] of picks) if(n) await cell('light-'+l,n);
 const statuses=await p.evaluate(()=>[...document.querySelectorAll('.board-card')].map(c=>({n:(c.innerText.match(/S\d-\d+/)||[])[0],lock:!!c.querySelector('[data-test-id*=lock],.lucide-lock,svg.lock'),st:(c.querySelector('.q-badge')||{}).innerText})).filter(x=>/Invoiced|Paid/.test(x.st||'')).slice(0,1));
 out.lockedPick=statuses;
 await theme('dark'); out.cls=await p.evaluate(()=>document.body.className.match(/body--(dark|light)/)?.[0]); console.log('theme now',out.cls);
 for(const [l,n] of picks.slice(0,2)) if(n) await cell('dark-'+l,n);
 await theme('light'); out.clsEnd=await p.evaluate(()=>document.body.className.match(/body--(dark|light)/)?.[0]);
 // Tech View row hover unchanged (light grey row, no shadow)
 await toView(p,'tech_view'); await p.waitForTimeout(2500);
 const row=await p.evaluate(()=>{const r=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].find(e=>/^tech_view_row_[0-9a-f-]{36}$/.test(e.dataset.testId)&&e.getBoundingClientRect().top>200); const b=r.getBoundingClientRect(); return {n:(r.innerText.match(/S\d-\d+/)||[])[0],x:b.x+300,y:b.y+b.height/2,bg:getComputedStyle(r).backgroundColor,sh:getComputedStyle(r).boxShadow};});
 await p.mouse.move(row.x,row.y,{steps:6}); await p.waitForTimeout(600);
 out.techRow={...row,hoverBg:await p.evaluate(n=>{const r=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].find(e=>e.innerText.includes(n)); const cs=getComputedStyle(r); const td=r.querySelector('td'); return cs.backgroundColor+' | td '+(td?getComputedStyle(td).backgroundColor:'')+' | shadow '+cs.boxShadow;},row.n)};
 console.log('tech row',JSON.stringify(out.techRow));
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
const cur=await getP(); const vv={...cur}; for(const k of OWN) vv[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:vv})});
out.mkEnd=await s.marker(); fs.writeFileSync('/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16/sv11394-retest-2026-10-19/hv94b.json',JSON.stringify(out,null,1)); await s.close(); console.log('clsEnd',out.clsEnd,'DONE');
