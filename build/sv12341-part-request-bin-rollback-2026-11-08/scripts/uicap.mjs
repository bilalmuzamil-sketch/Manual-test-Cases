import {sess} from './common.mjs'; import fs from 'fs';
const WO=process.env.WO; const s=await sess(); const p=s.page; const caps=[];
p.on('request',r=>{ if(/make-request|change-request/.test(r.url())) caps.push({u:r.url(),b:r.postData()}); });
p.on('response',async r=>{ if(/make-request|change-request/.test(r.url())) caps.push({status:r.status(),body:(await r.text().catch(()=>'')).slice(0,400)}); });
p.on('pageerror',e=>caps.push({pageerror:e.message.slice(0,200)}));
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/part|add/i.test(t)).join(' ')));
await s.close(); fs.writeFileSync('../ev/uicap.json',JSON.stringify(caps,null,1));
