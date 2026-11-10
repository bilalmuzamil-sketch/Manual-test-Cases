import {sess} from './common.mjs'; import fs from 'fs';
const EV='../ev'; const s=await sess(); const p=s.page; const net=[];
p.on('response',r=>{ if(/\/api\/inventory\/returns\/[^?]/.test(r.url())) net.push([r.status(),r.url().replace(/^https:\/\/[^/]+/,'')]); });
const res={marker:await s.marker()};
const list=(await s.api('/api/inventory/returns?limit=3')).json?.data?.collection||[]; res.own=list[0]?{id:list[0].vendor_return_id,vendor:list[0].vendor_name,cm:list[0].credit_memo_number}:null;
const RAND='3f6c2b1e-9d4a-4c8e-b7a1-5e2d9c0f1a77';
const r=await s.api('/api/inventory/returns/'+RAND); res.rand={st:r.status,body:JSON.stringify(r.json).slice(0,200)};
await s.go('/parts/return/'+RAND); await p.waitForTimeout(7000);
res.screen=await p.evaluate(()=>document.querySelector('main')?.innerText.replace(/\s+/g,' ').slice(0,300));
res.notes=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(x=>x.innerText.replace(/\s+/g,' ')));
await p.screenshot({path:EV+'/prod-01-unknown-id.png'});
if(res.own){ const o=await s.api('/api/inventory/returns/'+res.own.id); res.ownst=o.status; }
res.net=net; fs.writeFileSync(EV+'/prod.json',JSON.stringify(res,null,1)); console.log(JSON.stringify(res,null,1));
await s.close(); process.exit(0);
