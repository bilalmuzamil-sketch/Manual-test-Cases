// QuickBooks connection signals on staging + any bookkeeping/unexported record for invoice S2-38197.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const LOC='b3c8c820-f815-4cf1-8938-10956c5ee71a';
const s=await open({env:'staging',ticket:'staging',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin'});
const H={headers:{'x-location-id':LOC}};
for(const u of ['/api/bookkeeping/products-and-services','/api/bookkeeping/integration','/api/work-orders/adjustments/adjustment-item-mapping-status']){ const r=await s.api(u,H); console.log(u,r.status,JSON.stringify(r.json||r.text).slice(0,220)); }
const p=s.page; const got=[]; p.on('response',async r=>{ if(/\/api\//.test(r.url())&&r.request().method()==='GET'&&/unexport|bookkeeping/i.test(r.url())){ try{got.push(r.url().replace(/^https:\/\/[^/]+/,'')+' '+(await r.text()).slice(0,300));}catch{} } });
await s.go('/reports/unexported-items'); await p.waitForTimeout(6000); console.log(got.join('\n'));
console.log('page has S2-38197',await p.evaluate(()=>document.body.innerText.includes('S2-38197')), (await p.evaluate(()=>document.querySelector('main, .q-page')?.innerText.replace(/\s+/g,' ').slice(0,300))));
await s.close(); process.exit(0);
