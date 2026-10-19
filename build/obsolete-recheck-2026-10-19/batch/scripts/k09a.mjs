import {session,toView} from './rec.mjs'; import fs from 'fs';
const view=process.argv[2]||'tech_view'; const N=+process.argv[3]||45;
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:1}); const p=s.page; const out={view,steps:[]};
const info=()=>p.evaluate(()=>{const a=document.activeElement; const r=a.getBoundingClientRect(); const tips=[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].filter(t=>t.getBoundingClientRect().height>0).map(t=>t.innerText.trim().replace(/\s+/g,' ').slice(0,80));
 const anc=a.closest('[data-test-id]'); return {tag:a.tagName,tid:a.dataset?.testId||'',anc:anc&&anc!==a?anc.dataset.testId.slice(0,50):'',role:a.getAttribute('role')||'',label:a.getAttribute('aria-label')||'',text:(a.innerText||'').trim().replace(/\s+/g,' ').slice(0,40),y:Math.round(r.y),x:Math.round(r.x),tips};});
await s.go('/workorders?tab=all'); await p.waitForTimeout(3500); await toView(p,view); await p.waitForTimeout(2500);
await p.focus('[data-test-id=page_search_toggle]'); out.start=p.url();
for(let i=0;i<N;i++){ await p.keyboard.press('Tab'); await p.waitForTimeout(350); const x=await info(); out.steps.push(x); console.log(i,JSON.stringify(x).slice(0,260)); }
fs.writeFileSync(`/tmp/qa11310/ev09/k09a-${view}.json`,JSON.stringify(out,null,1)); await s.close();
