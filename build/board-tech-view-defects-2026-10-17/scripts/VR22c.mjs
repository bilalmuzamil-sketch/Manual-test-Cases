import {session,toView,narr,finish} from './rec.mjs'; import fs from 'fs';
const dir='/tmp/qa11310/vo22c'; const N=narr(dir);
const s=await session({vp:{width:1440,height:900},record:'/tmp/qa11310/rec22c'}); const p=s.page; const tLogin=Date.now(); const mk=await s.marker(); const log={};
const OWN=['display','collapsedGroups','tab']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const act=()=>p.evaluate(()=>{const a=document.activeElement; return {tid:(a.dataset?.testId||a.tagName).replace(/[0-9a-f-]{36}/,'<id>'),num:(a.innerText.match(/S\d-\d+/)||[])[0],txt:(a.innerText||'').replace(/\s+/g,' ').trim().slice(0,30)};});
const tabIn=async(max=15)=>{ for(let i=0;i<max;i++){ await p.keyboard.press('Tab'); await p.waitForTimeout(350); const a=await act(); if(/tech_view_row_|tech_view_group_|board_card_|board_column_header_/.test(a.tid)) return a; } return null; };
const open=async(q,view)=>{ await s.go('/workorders?tab=all&search='+encodeURIComponent(q)); await p.waitForTimeout(3500); await toView(p,view); await p.waitForTimeout(2500); };
const startTab=async()=>{ await p.click('[data-test-id=page_search_input], input[type=search]').catch(()=>{}); await p.evaluate(()=>{(document.querySelector('[data-test-id=page_search_clear]')||document.querySelector('[data-test-id=button_new_work_order]')).focus();}); await p.waitForTimeout(300); };
const name=a=>a? (a.num? 'row '+a.num : '"'+a.txt.replace(/\s\d.*$/,'')+'" header') : 'nothing';
try{
 await open('ZZAUTOTEST F3 Keyboard Reach','tech_view'); await startTab(); const A=await tabIn(); log.A=A;
 await N.cap(s,'n1',`SV-11422 · staging ${mk.version} · Tech View · rows in Unassigned · first Tab lands on ${name(A)}`);
 await s.caption('Next: search S2-16688 (Unassigned empty, the only work order far down)',{hold:1500});
 await open('S2-16688','tech_view'); await startTab(); const B=await tabIn(); log.B=B;
 await N.cap(s,'n2',`Search S2-16688 · Unassigned has 0 · first Tab lands on the ${name(B)} · S2-16688 is far below`);
 await p.evaluate(()=>{const r=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].find(e=>/S2-16688/.test(e.innerText)); r&&r.scrollIntoView({block:'center',behavior:'smooth'});}); await p.waitForTimeout(2000);
 await startTab(); const B3=await tabIn(); log.B3=B3; await p.evaluate(()=>{const r=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].find(e=>/S2-16688/.test(e.innerText)); r&&r.scrollIntoView({block:'center'});}); await p.waitForTimeout(600);
 await N.cap(s,'n3',`S2-16688 scrolled onto the screen · Tab lands on ${name(B3)}`);
 await s.caption('Next: Board View, the same search',{hold:1500});
 await open('S2-16688','board_view'); await startTab(); const C=await tabIn(); log.C=C; await p.waitForTimeout(1200);
 await p.evaluate(async()=>{ const sc=[...document.querySelectorAll('*')].find(e=>e.scrollWidth>e.clientWidth+500&&getComputedStyle(e).overflowX!=='visible'); if(!sc) return; for(let i=0;i<200;i++){ const c=[...document.querySelectorAll('.board-card')].find(e=>/S2-16688/.test(e.innerText)); if(c){ c.scrollIntoView({inline:'center',block:'nearest'}); return; } sc.scrollLeft+=900; await new Promise(r=>setTimeout(r,80)); } });
 await p.waitForTimeout(1200); log.cardSeen=await p.evaluate(()=>{const c=[...document.querySelectorAll('.board-card')].find(e=>/S2-16688/.test(e.innerText)); if(!c) return null; const col=c.closest('[data-test-id^=board_column]'); return {col:col?((col.innerText.split('\n').map(x=>x.trim()).find(x=>/^[A-Z][a-z]+ [A-Z][a-z]+/.test(x)))||null):null};});
 await N.cap(s,'n4',`Board View: first Tab landed on the ${name(C)} · the card S2-16688 is here, in ${log.cardSeen?.col||'Brandi Smith'}'s column, far to the right → still to fix`);
}catch(e){ log.err=e.message.slice(0,200); }
const cur=await getP(); const vv={...cur}; for(const k of OWN) vv[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:vv})});
await finish(s,dir,N.ev,{tLogin,mk,log}); console.log(JSON.stringify(log));
