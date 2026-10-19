import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={mk:await s.marker()};
const OWN=['display','tab','density','collapsedGroups']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const act=()=>p.evaluate(()=>{const a=document.activeElement; return {tag:a.tagName,tid:a.dataset?.testId||null,txt:(a.innerText||a.getAttribute('aria-label')||'').replace(/\s+/g,' ').trim().slice(0,40)};});
try{
 // SV-11416: List lead cell for S2-36641 (deleted lead)
 await s.go('/workorders?tab=all&search=S2-36641'); await p.waitForTimeout(3000); await toView(p,'list'); await p.waitForTimeout(2500);
 out.list11416=await p.evaluate(()=>{const ths=[...document.querySelectorAll('thead th')].map(t=>t.innerText.trim()); const i=ths.findIndex(t=>/Lead Technician/.test(t)); const tr=[...document.querySelectorAll('tbody tr')].find(t=>/S2-36641/.test(t.innerText)); return {col:i,cell:tr&&i>=0?tr.children[i].innerText.trim():null,headers:ths.slice(0,20)};});
 await p.screenshot({path:'/tmp/qa11310/ex/m19-11416-list.png'}); console.log('11416',JSON.stringify(out.list11416));
 // SV-11409: chip x by keyboard, both views
 for(const v of ['tech_view','board_view']){
  await s.go('/workorders?tab=all&status=paid'); await p.waitForTimeout(3000); await toView(p,v); await p.waitForTimeout(2500);
  const has=await p.$('[data-test-id=filter_chip_clear_status]'); if(!has){ out['x_'+v]={err:'no chip x'}; continue; }
  await p.focus('[data-test-id=filter_chip_clear_status]'); await p.waitForTimeout(300); const before=await act();
  await p.keyboard.press('Enter'); await p.waitForTimeout(2500); const after=await act(); await p.keyboard.press('Tab'); await p.waitForTimeout(400); const next=await act();
  out['x_'+v]={before,after,next,url:await p.evaluate(()=>location.search)}; console.log('x',v,JSON.stringify(out['x_'+v]));
 }
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
const cur=await getP(); const vv={...cur}; for(const k of OWN) vv[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:vv})});
fs.writeFileSync('/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16/sv11409/data/chipx-31ad1e1.json',JSON.stringify(out,null,1)); await s.close(); console.log('DONE');
