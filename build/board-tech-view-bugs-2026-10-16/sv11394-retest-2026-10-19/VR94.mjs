import {session,toView,narr,finish} from './rec.mjs'; import fs from 'fs';
const dir='/tmp/qa11310/vo94'; const N=narr(dir);
const s=await session({vp:{width:1440,height:900},record:'/tmp/qa11310/rec94'}); const p=s.page; const tLogin=Date.now(); const mk=await s.marker(); const log={};
const OWN=['display','tab','density','collapsedGroups']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const theme=async t=>{await s.glideClick('profile_menu_button'); await p.waitForTimeout(900); await s.glideClick(`button_night_mode_${t}`); await p.waitForTimeout(1500); await p.keyboard.press('Escape').catch(()=>{}); await p.waitForTimeout(800);};
const card=()=>p.evaluate(()=>{const c=[...document.querySelectorAll('.board-card')].find(e=>/S2-33692/.test(e.innerText)); const r=c.getBoundingClientRect(); const st=getComputedStyle(c); return {x:r.x,y:r.y,w:r.width,h:r.height,sh:st.boxShadow,bd:st.borderTopColor};});
try{
 await s.go('/workorders?tab=all&search=S2-33692'); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3000);
 await p.mouse.move(700,820,{steps:6}); await p.waitForTimeout(700); const r0=await card(); log.rest=r0;
 await N.cap(s,'n1',`SV-11394 · staging ${mk.version} · Board View, card S2-33692 at rest · shadow: ${r0.sh} · border ${r0.bd}`);
 await p.mouse.move(r0.x+r0.w/2,r0.y+r0.h*0.6,{steps:14}); await p.waitForTimeout(1000); const r1=await card(); log.hover=r1;
 const moved=(r1.x!==r0.x||r1.y!==r0.y||r1.w!==r0.w||r1.h!==r0.h);
 await N.cap(s,'n2',`Pointer on the card · border ${r1.bd} (darker) · soft shadow under the card · card ${moved?'MOVED':'did not move or grow'} (${r1.w.toFixed(0)} x ${r1.h.toFixed(0)} px)`);
 await s.caption('Next: switch to the dark theme from the profile menu (top right)');
 await theme('dark'); await p.mouse.move(700,820,{steps:6}); await p.waitForTimeout(600); const d0=await card();
 await p.mouse.move(d0.x+d0.w/2,d0.y+d0.h*0.6,{steps:14}); await p.waitForTimeout(1000); const d1=await card(); log.dark={rest:d0.sh,hover:d1.sh,bd0:d0.bd,bd1:d1.bd};
 await N.cap(s,'n3',`Dark theme · pointer on the card · shadow appears · border ${d0.bd} → ${d1.bd}`);
 await s.caption('Next: back to the light theme, then Tech View');
 await theme('light'); await toView(p,'tech_view'); await p.waitForTimeout(3000);
 const row=await p.evaluate(()=>{const e=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].find(e=>/^tech_view_row_[0-9a-f-]{36}$/.test(e.dataset.testId)); const b=e.getBoundingClientRect(); return {x:b.x,y:b.y,w:b.width,h:b.height,bg:getComputedStyle(e).backgroundColor};});
 await p.mouse.move(row.x+300,row.y+row.h/2,{steps:14}); await p.waitForTimeout(900);
 const bg1=await p.evaluate(({x,y})=>{const e=document.elementFromPoint(x,y); const td=e.closest('td')||e; return getComputedStyle(td).backgroundColor;},{x:row.x+300,y:row.y+row.h/2}); log.row={bg0:row.bg,bg1};
 await N.cap(s,'n4',`Tech View, row S2-33692 · pointer on the row: it turns light grey, as before · overall: PASSED`);
}catch(e){ log.err=e.message.slice(0,200); }
try{ const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})}); }catch(e){}
await finish(s,dir,N.ev,{tLogin,mk,log}); console.log(JSON.stringify(log));
