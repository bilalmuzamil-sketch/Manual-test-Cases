import {ob,j} from './lib.mjs'; import fs from 'fs';
const all=JSON.parse(fs.readFileSync('ps-all.json')); const x=all.find(r=>r.number==='P9667-250');
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page;
const v=(await s.api('/api/work-orders/view/'+x.id)).json.data.work_order; const vid=v.vehicle?.id||v.vehicle_id; console.log('vehicle',vid);
await s.go(`/customers/vehicle/${vid}`); await p.waitForTimeout(3000);
const tabs=await p.evaluate(()=>[...document.querySelectorAll('.q-page [data-test-id^="route_tab"], .q-page [role=tab], .q-page .q-tab, .q-page a')].map(e=>e.innerText.trim().replace(/\n/g,' ')).filter(Boolean).slice(0,40)); console.log('url',p.url(),'tabs',j(tabs,900));
const t=await p.evaluate(()=>{const e=[...document.querySelectorAll('.q-page *')].find(x=>x.childElementCount<3&&/^Part Sales/i.test((x.innerText||'').trim())); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};});
if(t){ await p.mouse.click(t.x,t.y); await p.waitForTimeout(3000); const hs=await p.evaluate(()=>[...document.querySelectorAll('thead th')].map(t=>t.innerText.trim())); const rows=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').slice(0,140))); console.log('url',p.url(),'headers',j(hs),'rows',j(rows,900)); await p.screenshot({path:'/tmp/qa9226/vehicle-tab.png'}); }
await s.close();
