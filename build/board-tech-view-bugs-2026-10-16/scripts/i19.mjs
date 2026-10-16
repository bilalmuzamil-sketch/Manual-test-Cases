import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1600,height:1000},dpr:2}); const p=s.page; const mk=await s.marker();
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
const scan=()=>p.evaluate(()=>{const out={};
  const desc=e=>{const tid=e.closest('[data-test-id]')?.getAttribute('data-test-id')?.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/,'<id>'); return tid;};
  for(const sv of document.querySelectorAll('svg[data-icon]')){ const r=sv.getBoundingClientRect(); if(!r.width) continue; const k=desc(sv)+' :: '+sv.getAttribute('data-icon')+' '+Math.round(r.width)+'px '+getComputedStyle(sv).color; out[k]=(out[k]||0)+1; }
  for(const i of document.querySelectorAll('i.q-icon, i.material-icons, .material-icons')){ const r=i.getBoundingClientRect(); if(!r.width) continue; const k=desc(i)+' :: MATERIAL '+i.innerText.trim()+' '+Math.round(r.width)+'px'; out[k]=(out[k]||0)+1; }
  return out;});
const res={mk};
for(const v of ['list','tech_view','board_view']){ await toView(p,v); await p.waitForTimeout(1500); res[v]=await scan(); await p.screenshot({path:`/tmp/qa11310/i19-${v}.png`}); console.log('=====',v); for(const [k,c] of Object.entries(res[v]).sort()) console.log(c,k); }
fs.writeFileSync('/tmp/qa11310/i19.json',JSON.stringify(res,null,1)); await s.close();
