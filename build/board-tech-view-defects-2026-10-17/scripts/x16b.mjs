import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:1}); const p=s.page; const out={}; const Q='ZZAUTOTEST F1 Assigned To Me';
const OWN=['display','collapsedGroups','tab']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
for(const n of ['S2-35709','S2-36641']){ const w=(await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=3&search='+n)).json.data.work_orders[0]; out[n]=w.techAssignedId; }
await s.go('/workorders?tab=all&search='+encodeURIComponent(Q)); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3000);
await p.evaluate(()=>{const sc=document.querySelector('[data-test-id=board_view_scroller]'); sc.scrollLeft=sc.scrollWidth;}); await p.waitForTimeout(1500);
out.boardCols=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id=board_column_header_deleted]')].map(h=>({t:h.innerText.replace(/\s+/g,' '),cards:[...h.closest('.board-column__panel').querySelectorAll('.board-card')].map(c=>(c.innerText.match(/S\d-\d+/)||[])[0])})));
await toView(p,'tech_view'); await p.waitForTimeout(2500);
for(let i=0;i<90;i++){ if(await p.$('[data-test-id=tech_view_group_deleted]')) break; await p.evaluate(()=>{document.querySelector('.q-table__middle').scrollTop+=500;}); await p.waitForTimeout(350);}
out.techGroups=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id=tech_view_group_deleted]')].map(g=>g.innerText.replace(/\s+/g,' ')));
console.log(JSON.stringify(out));
const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})});
fs.writeFileSync('/tmp/qa11310/ex/x16b.json',JSON.stringify(out,null,1)); await s.close();
