import {session} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900},dpr:2}); const p=s.page; const log={};
const all=[]; for(let pg=1;pg<=5;pg++){ const r=(await s.api(`/api/part-sales?pagination[page]=${pg}&pagination[rowsPerPage]=50`)).json.data.partSales; all.push(...r); if(r.length<50) break; }
const by={}; for(const x of all){ (by[x.status]=by[x.status]||[]).push(x); } log.counts=Object.fromEntries(Object.entries(by).map(([k,v])=>[k,v.length]));
log.by={};
for(const st of Object.keys(by)){ const x=by[st][0]; await s.go(`/parts/part-sale/${x.id}/part-requests`); await p.waitForTimeout(4500); await p.keyboard.press('Escape').catch(()=>{});
 const o=await p.evaluate(()=>{const e=document.querySelector('[data-test-id=select_sales_rep], [data-test-id=sales_rep_readonly]'); const card=[...document.querySelectorAll('.q-card')][0]; return {tid:e?.dataset.testId||null,v:e?e.innerText.replace(/\s+/g,' ').trim():null,card:card?.innerText.replace(/\s+/g,' ').slice(0,160)};}); log.by[st]={n:x.number,...o};
 if(st==='estimate'){ await p.mouse.move(700,880); await p.screenshot({path:'/tmp/qa11310/ex21/ps-estimate.png'}); log.estRect=await p.evaluate(()=>{const e=document.querySelector('[data-test-id=select_sales_rep]'); if(!e) return null; const f=e.closest('.q-field'); const a=f.getBoundingClientRect(); return {x:a.x,y:a.y,w:a.width,h:a.height};}); } }
fs.writeFileSync('/tmp/qa11310/ex21/cap23b.json',JSON.stringify(log,null,1)); console.log(JSON.stringify(log).slice(0,2500)); await s.close();
