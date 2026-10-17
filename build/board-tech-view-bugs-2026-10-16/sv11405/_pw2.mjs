import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={};
const OWN=['display','tab','density','collapsedGroups']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const ws=sel=>p.evaluate(sel=>[...new Set([...document.querySelectorAll(sel)].map(e=>e.innerText.trim()+'@'+e.getBoundingClientRect().width.toFixed(1)).filter(x=>/^[A-Z][a-zA-Z ]+@/.test(x)))],sel);
for(const st of ['paid','invoiced']){
 await s.go(`/workorders?tab=all&status=${st}`); await p.waitForTimeout(3500); await toView(p,'list'); await p.waitForTimeout(2500); out[st+'-list']=await ws('tbody tr .q-badge:not(.q-badge--floating)'); await p.screenshot({path:`/tmp/qa11310/ex/pw2-${st}-list.png`});
 await toView(p,'tech_view'); await p.waitForTimeout(3000); out[st+'-tech']=await ws('[data-test-id^=tech_view_row_] .q-badge:not(.q-badge--floating)'); await p.screenshot({path:`/tmp/qa11310/ex/pw2-${st}-tech.png`});
 await toView(p,'board_view'); await p.waitForTimeout(3000); out[st+'-board']=await ws('.board-card .q-badge:not(.q-badge--floating)'); await p.screenshot({path:`/tmp/qa11310/ex/pw2-${st}-board.png`});
 console.log(st,JSON.stringify({l:out[st+'-list'],t:out[st+'-tech'],b:out[st+'-board']})); }
const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})});
fs.writeFileSync('/tmp/qa11310/ex/pw2.json',JSON.stringify(out,null,1)); await s.close();
