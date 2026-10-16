import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1600,height:1000},dpr:2}); const p=s.page; const mk=await s.marker();
const post=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
await s.go('/workorders?tab=all'); await p.waitForTimeout(3000);
console.log('switch',JSON.stringify(await post('/api/iam/change-location',{workplace_id:'8a0d9904-c35d-449a-8bc2-3acf9134b4da',workplace_timezone:'Asia/Karachi'})).slice(0,120));
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
const empty=()=>p.evaluate(()=>{const area=document.querySelector('main')||document.body; const icons=[...area.querySelectorAll('svg[data-icon], i.q-icon')].filter(i=>{const r=i.getBoundingClientRect();return r.width&&r.y>200;}).map(i=>(i.getAttribute('data-icon')||'MAT:'+i.innerText.trim())+'@'+Math.round(i.getBoundingClientRect().width)+'/'+(i.closest('[class*=circle],[class*=icon-wrap],[class*=empty]')?.className||'').slice(0,50)); const txt=[...area.querySelectorAll('*')].filter(e=>e.children.length===0&&e.innerText?.trim()&&e.getBoundingClientRect().y>200&&e.getBoundingClientRect().y<900).map(e=>e.innerText.trim()).slice(0,12); const btns=[...area.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().y>200).map(b=>(b.getAttribute('data-test-id')||'')+':'+b.innerText.trim()); return {icons,txt,btns};});
const out={mk};
for(const v of ['list','tech_view','board_view']){ await toView(p,v); await p.waitForTimeout(2000); out[v]=await empty(); await p.screenshot({path:`/tmp/qa11310/e08-${v}-none.png`}); console.log(v,'NONE',JSON.stringify(out[v])); }
// search active
await p.click('[data-test-id=page_search_toggle]'); await p.waitForTimeout(500); await p.keyboard.type('zzqq',{delay:30}); await p.waitForTimeout(3500);
for(const v of ['board_view','tech_view','list']){ await toView(p,v); await p.waitForTimeout(2000); out[v+'_search']=await empty(); await p.screenshot({path:`/tmp/qa11310/e08-${v}-search.png`}); console.log(v,'SEARCH',JSON.stringify(out[v+'_search'])); }
await p.click('[data-test-id=page_search_toggle]').catch(()=>{}); await p.keyboard.press('Control+A'); await p.keyboard.press('Backspace'); await p.waitForTimeout(2500);
// filter active: Assigned to me
await p.click('[data-test-id=filter_chip_assigned_to_me]'); await p.waitForTimeout(3000);
for(const v of ['list','tech_view','board_view']){ await toView(p,v); await p.waitForTimeout(2000); out[v+'_filter']=await empty(); await p.screenshot({path:`/tmp/qa11310/e08-${v}-filter.png`}); console.log(v,'FILTER',JSON.stringify(out[v+'_filter'])); }
await p.click('[data-test-id=filter_chip_assigned_to_me]'); await p.waitForTimeout(2000);
await toView(p,'tech_view');
console.log('restore',JSON.stringify(await post('/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'Asia/Karachi'})).slice(0,120));
fs.writeFileSync('/tmp/qa11310/e08.json',JSON.stringify(out,null,1)); await s.close();
