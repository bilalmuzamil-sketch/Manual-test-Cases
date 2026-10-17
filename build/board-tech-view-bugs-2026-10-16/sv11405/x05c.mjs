import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={mk:await s.marker()};
const OWN=['display','tab','density','collapsedGroups']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const R=e=>{const b=e.getBoundingClientRect(); return {x:b.x,y:b.y,w:b.width,h:b.height,t:(e.innerText||'').trim()};};
const firstPill=sel=>p.evaluate(sel=>{const e=[...document.querySelectorAll(sel)].find(e=>{const b=e.getBoundingClientRect(); return b.top>150&&b.bottom<880&&b.left>=0&&b.right<=1440&&/^[A-Z]/.test(e.innerText.trim());}); if(!e) return null; const b=e.getBoundingClientRect(); return {x:b.x,y:b.y,w:b.width,h:b.height,t:e.innerText.trim()};},sel);
try{
 // counted pill on a card vs List
 await s.go('/workorders?tab=all&search=S2-34941'); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3000);
 for(let i=0;i<120;i++){ if(await p.evaluate(()=>[...document.querySelectorAll('.board-card')].some(c=>{const r=c.getBoundingClientRect(); return r.left>=0&&r.right<=1440&&r.width>0;}))) break; await p.evaluate(()=>{document.querySelector('[data-test-id=board_view_scroller]').scrollLeft+=700;}); await p.waitForTimeout(250);}
 out.card=await p.evaluate(()=>{const c=[...document.querySelectorAll('.board-card')].find(c=>{const r=c.getBoundingClientRect(); return r.left>=0&&r.right<=1440&&r.width>0;}); const B=e=>{const b=e.getBoundingClientRect(); return {x:b.x,y:b.y,w:b.width,h:b.height,t:e.innerText.trim()};}; const bs=[...c.querySelectorAll('.q-badge')]; return {card:B(c),pill:B(bs.find(b=>!b.classList.contains('q-badge--floating')&&/[A-Z]/.test(b.innerText))),counts:bs.filter(b=>/^\d+$/.test(b.innerText.trim())).map(B)};});
 const rc=out.card.counts[0]; await p.mouse.move(rc.x+rc.w/2,rc.y+rc.h/2,{steps:6}); await p.waitForTimeout(1200); out.cardTip=await p.evaluate(()=>{const t=[...document.querySelectorAll('.q-tooltip')].find(x=>x.getBoundingClientRect().height>0); if(!t) return null; const b=t.getBoundingClientRect(); return {x:b.x,y:b.y,w:b.width,h:b.height,t:t.innerText.trim()};}); await p.screenshot({path:'/tmp/qa11310/ex/x05c-card.png'});
 await toView(p,'list'); await p.waitForTimeout(2500);
 out.list=await p.evaluate(()=>{const tr=[...document.querySelectorAll('tbody tr')].find(t=>t.innerText.includes('S2-34941')); const B=e=>{const b=e.getBoundingClientRect(); return {x:b.x,y:b.y,w:b.width,h:b.height,t:e.innerText.trim()};}; const bs=[...tr.querySelectorAll('.q-badge')]; return {pill:B(bs.find(b=>!b.classList.contains('q-badge--floating')&&/[A-Z]/.test(b.innerText))),counts:bs.filter(b=>/^\d+$/.test(b.innerText.trim())).map(B)};});
 const lc=out.list.counts[0]; await p.mouse.move(lc.x+lc.w/2,lc.y+lc.h/2,{steps:6}); await p.waitForTimeout(1200); out.listTip=await p.evaluate(()=>{const t=[...document.querySelectorAll('.q-tooltip')].find(x=>x.getBoundingClientRect().height>0); if(!t) return null; const b=t.getBoundingClientRect(); return {x:b.x,y:b.y,w:b.width,h:b.height,t:t.innerText.trim()};}); await p.screenshot({path:'/tmp/qa11310/ex/x05c-list.png'});
 console.log('card',JSON.stringify(out.card.pill),JSON.stringify(out.cardTip),'| list',JSON.stringify(out.list.pill),JSON.stringify(out.listTip));
 // Paid filter in 3 views
 await s.go('/workorders?tab=all&status=paid'); await p.waitForTimeout(3500);
 for(const v of ['list','tech_view','board_view']){ await toView(p,v); await p.waitForTimeout(3000); await p.mouse.move(1435,895);
  out['paid-'+v]=await firstPill(v==='list'?'tbody tr .q-badge:not(.q-badge--floating)':v==='tech_view'?'[data-test-id^=tech_view_row_] .q-badge:not(.q-badge--floating)':'.board-card .q-badge:not(.q-badge--floating)'); await p.screenshot({path:`/tmp/qa11310/ex/x05c-paid-${v}.png`}); console.log('paid',v,JSON.stringify(out['paid-'+v])); }
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})});
fs.writeFileSync('/tmp/qa11310/ex/x05c.json',JSON.stringify(out,null,1)); await s.close();
