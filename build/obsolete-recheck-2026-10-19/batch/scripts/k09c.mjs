import {session,toView} from './rec.mjs'; import fs from 'fs';
const view=process.argv[2]||'tech_view'; const q=process.argv[3]||'';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:1}); const p=s.page; const out={view,q,steps:[]};
const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
const putP=async v=>(await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})})).status;
const prefs0=await getP();
const info=()=>p.evaluate(()=>{const a=document.activeElement; const r=a.getBoundingClientRect(); const tips=[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].filter(t=>t.getBoundingClientRect().height>0).map(t=>t.innerText.trim().replace(/\s+/g,' ').slice(0,80));
 return {tag:a.tagName,tid:(a.dataset?.testId||'').replace(/[0-9a-f-]{36}/,'<id>'),label:a.getAttribute('aria-label')||'',text:(a.innerText||'').trim().replace(/\s+/g,' ').slice(0,30),full:(a.innerText||'').replace(/\s+/g,' '),y:Math.round(r.y),x:Math.round(r.x),tips};});
await s.go('/workorders?tab=all'+(q?'&search='+encodeURIComponent(q):'')); await p.waitForTimeout(3500); await toView(p,view); await p.waitForTimeout(2500); if(view==='tech_view'){ for(let k=0;k<2;k++){ if(/Expand/.test(await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'))) break; await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);} await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(3000);} await p.mouse.move(700,880);
await p.focus('[data-test-id=button_new_work_order]'); await p.keyboard.press('Tab'); await p.waitForTimeout(500); out.entry=await info(); console.log('entry',JSON.stringify(out.entry));
const target=process.argv[4]; // work order number to reach with arrows
let prev=''; for(let i=0;i<80&&target;i++){ const x=await info(); if(x.full.includes(target)) break; let key='ArrowDown'; if(view!=='tech_view'&&x.full===prev) key='ArrowRight'; prev=x.full; await p.keyboard.press(key); await p.waitForTimeout(300); if(view!=='tech_view'&&key==='ArrowRight') prev=''; }
out.at=await info(); console.log('at',JSON.stringify(out.at));
for(let i=0;i<+(process.argv[5]||10);i++){ await p.keyboard.press('Tab'); await p.waitForTimeout(600); const x=await info(); out.steps.push(x); console.log(i,JSON.stringify(x).slice(0,260)); }
{ const cur=await getP(); out.put=await putP({...cur,collapsedGroups:prefs0.collapsedGroups}); out.restored=JSON.stringify((await getP()).collapsedGroups)===JSON.stringify(prefs0.collapsedGroups); console.log('restored',out.restored); }
fs.writeFileSync(`/tmp/qa11310/ev09/k09c-${view}-${target}.json`,JSON.stringify(out,null,1)); await s.close();
