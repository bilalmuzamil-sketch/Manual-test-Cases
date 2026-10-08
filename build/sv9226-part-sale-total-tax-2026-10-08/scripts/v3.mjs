import {ob,j} from './lib.mjs'; import fs from 'fs';
const all=JSON.parse(fs.readFileSync('ps-all.json')); const x=all.find(r=>r.number==='P9667-250');
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page;
const v=(await s.api('/api/work-orders/view/'+x.id)).json.data.work_order; const cid=v.company?.id||v.company_id||v.company; console.log('company',j(cid),'vehicle keys',j(Object.keys(v).filter(k=>/vehic|asset/i.test(k))), j(v.vehicle,200));
await s.go(`/customers/${typeof cid==='string'?cid:cid.id}/vehicles`); await p.waitForTimeout(3500);
const r=await p.evaluate(()=>{const tr=[...document.querySelectorAll('tbody tr')].find(t=>/Ford Escape|BAHUTYV09T63EV7NS/.test(t.innerText)); if(!tr) return null; const g=tr.getBoundingClientRect(); return {x:g.x+200,y:g.y+g.height/2,t:tr.innerText.replace(/\s+/g,' ').slice(0,120)};});
console.log('row',j(r)); if(r){ await p.mouse.click(r.x,r.y); await p.waitForTimeout(3500); }
console.log('url',p.url()); console.log((await p.evaluate(()=>document.querySelector('.q-page')?.innerText||document.body.innerText)).replace(/\n+/g,' | ').slice(0,700));
await p.screenshot({path:'/tmp/qa9226/vehicle2.png'}); await s.close();
