import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={};
const OWN=['display','collapsedGroups','tab']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const act=()=>p.evaluate(()=>{const a=document.activeElement; const r=a.getBoundingClientRect(); return {tid:(a.dataset?.testId||a.tagName).replace(/[0-9a-f-]{36}/,'<id>'),num:(a.innerText.match(/S\d-\d+/)||[])[0],txt:(a.innerText||'').replace(/\s+/g,' ').trim().slice(0,30),y:Math.round(r.y)};});
const tabIn=async(max=15)=>{ for(let i=0;i<max;i++){ await p.keyboard.press('Tab'); await p.waitForTimeout(300); const a=await act(); if(/tech_view_row_|tech_view_group_|board_card_|board_column_header_/.test(a.tid)) return a; } return null; };
const start=()=>p.evaluate(()=>(document.querySelector('[data-test-id=page_search_clear]')||document.querySelector('[data-test-id=button_new_work_order]')).focus());
const open=async(q,view)=>{ await s.go('/workorders?tab=all&search='+encodeURIComponent(q)); await p.waitForTimeout(3500); await toView(p,view); await p.waitForTimeout(3000); };
const rowInfo=()=>p.evaluate(()=>{const r=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].filter(e=>/^tech_view_row_[0-9a-f-]{36}$/.test(e.dataset.testId)); return r.map(e=>({n:(e.innerText.match(/S\d-\d+/)||[])[0],y:Math.round(e.getBoundingClientRect().y)}));});
try{
 for(const q of ['S2-16688','M&J Truck Repair']){ for(let rep=1;rep<=2;rep++){ await open(q,'tech_view'); const rows=await rowInfo(); await start(); const a=await tabIn(); out[`${q}#${rep}`]={rows:rows.slice(0,3),stop:a}; console.log(q,rep,JSON.stringify(rows.slice(0,3)),'->',JSON.stringify(a)); if(rep===2){ await p.mouse.move(1435,895); await p.screenshot({path:`/tmp/qa11310/ex/x22b-${q.replace(/\W/g,'')}.png`}); } } }
 // scroll the S2-16688 row into view, then Tab from search
 await open('S2-16688','tech_view'); await p.evaluate(()=>{[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].find(e=>e.innerText.includes('S2-16688'))?.scrollIntoView({block:'center'});}); await p.waitForTimeout(1000); await start(); out.scrolled=await tabIn(); console.log('scrolled first',JSON.stringify(out.scrolled));
 // Board View, Unassigned column empty
 await open('S2-16688','board_view'); const cols=await p.evaluate(()=>[...document.querySelectorAll('.board-card')].map(c=>({n:(c.innerText.match(/S\d-\d+/)||[])[0],x:Math.round(c.getBoundingClientRect().x)}))); await start(); out.board=await tabIn(); out.boardCards=cols; console.log('board cards',JSON.stringify(cols),'->',JSON.stringify(out.board)); await p.mouse.move(1435,895); await p.screenshot({path:'/tmp/qa11310/ex/x22b-board.png'});
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})});
fs.writeFileSync('/tmp/qa11310/ex/x22b.json',JSON.stringify(out,null,1)); await s.close();
