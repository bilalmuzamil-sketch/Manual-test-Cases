import {session,toView,dens} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={mk:await s.marker(),cells:[]}; console.log('mk',out.mk.version);
const OWN=['display','tab','density','collapsedGroups']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const read=(n)=>p.evaluate((n)=>{const c=[...document.querySelectorAll('.board-card')].find(e=>e.innerText.includes(n)); if(!c) return null; const cs=getComputedStyle(c); const r=c.getBoundingClientRect(); return {cls:c.className,shadow:cs.boxShadow,border:cs.borderColor,transform:cs.transform,x:+r.x.toFixed(2),y:+r.y.toFixed(2),w:+r.width.toFixed(2),h:+r.height.toFixed(2),noShadow:/no-shadow/.test(c.className)};},n);
const pix=async(r,tag)=>{ const pad=14; const clip={x:Math.max(0,r.x-pad),y:Math.max(0,r.y-pad),width:r.w+2*pad,height:r.h+2*pad}; const f=`/tmp/qa11310/ex/hv94-${tag}.png`; await p.screenshot({path:f,clip}); return f; };
const cell=async(label,n)=>{ await p.mouse.move(5,890); await p.waitForTimeout(500); const rest=await read(n); if(!rest){ out.cells.push({label,n,err:'card not found'}); console.log(label,n,'not found'); return; } const f0=await pix(rest,label+'-rest');
 await p.mouse.move(rest.x+rest.w/2,rest.y+rest.h*0.6,{steps:8}); await p.waitForTimeout(700); const hov=await read(n); const f1=await pix(rest,label+'-hover');
 const c={label,n,rest,hov,moved:rest.x!==hov.x||rest.y!==hov.y||rest.w!==hov.w||rest.h!==hov.h,files:[f0,f1]}; out.cells.push(c); console.log(label,n,'| rest',rest.shadow,rest.border,'| hover',hov.shadow,hov.border,'| moved',c.moved,'| noShadowClass',hov.noShadow,'| tf',hov.transform); };
try{
 await s.go('/workorders?tab=all&search=S2-34941'); await p.waitForTimeout(3000); await toView(p,'board_view'); await p.waitForTimeout(2500);
 for(const d of ['compact','regular','comfortable']){ await dens(p,d); await p.waitForTimeout(1500); await cell('light-'+d+'-unassigned-rfr','S2-34941'); }
 await s.go('/workorders?tab=all&search=S2-16688'); await p.waitForTimeout(3000); await toView(p,'board_view'); await p.waitForTimeout(2500);
 await p.evaluate(async()=>{ const sc=[...document.querySelectorAll('*')].find(e=>e.scrollWidth>e.clientWidth+500&&getComputedStyle(e).overflowX!=='visible'); for(let i=0;i<200;i++){ const c=[...document.querySelectorAll('.board-card')].find(e=>/S2-16688/.test(e.innerText)); if(c){ c.scrollIntoView({inline:'center',block:'nearest'}); return; } sc.scrollLeft+=900; await new Promise(r=>setTimeout(r,80)); } }); await p.waitForTimeout(1500);
 await cell('light-paid-tech-column','S2-16688');
 await s.go('/workorders?tab=all&search=Lamkin'); await p.waitForTimeout(3000); await toView(p,'board_view'); await p.waitForTimeout(2500);
 const cards=await p.evaluate(()=>[...document.querySelectorAll('.board-card')].filter(c=>{const r=c.getBoundingClientRect(); return r.left>=0&&r.right<=1440&&r.top>150&&r.bottom<890;}).map(c=>(c.innerText.match(/S\d-\d+/)||[])[0]).slice(0,6)); out.lamkin=cards;
 for(const n of cards.slice(0,4)) await cell('light-lamkin',n);
 // dark theme
 out.theme0=await p.evaluate(()=>document.documentElement.className+'|'+document.body.className);
 const tgl=await p.$('[data-test-id=button_toggle_theme],[data-test-id=toggle_dark_mode],[data-test-id=button_theme]'); out.themeBtn=!!tgl;
 if(!tgl){ await p.evaluate(()=>{document.body.classList.add('body--dark'); document.body.classList.remove('body--light');}); out.themeHow='body--dark class set (comparison only)'; } else { await tgl.click(); await p.waitForTimeout(1500); out.themeHow='app toggle'; }
 await p.waitForTimeout(1000); for(const n of cards.slice(0,2)) await cell('dark-lamkin',n);
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
const cur=await getP(); const vv={...cur}; for(const k of OWN) vv[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:vv})});
out.mkEnd=await s.marker(); fs.mkdirSync('/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16/sv11394-retest-2026-10-19',{recursive:true}); fs.writeFileSync('/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16/sv11394-retest-2026-10-19/hv94.json',JSON.stringify(out,null,1)); await s.close(); console.log('theme',out.themeHow,out.theme0,'DONE');
