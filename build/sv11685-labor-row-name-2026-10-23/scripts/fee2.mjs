import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
for(const u of ['/api/bookkeeping/products-and-services','/api/bookkeeping/items','/api/bookkeeping/accounts','/api/bookkeeping/connection','/api/bookkeeping/companies','/api/bookkeeping/integrations']){const r=await s.api(u); console.log(u,r.status,JSON.stringify(r.json).slice(0,400));}
const p=s.page; const reqs=[]; p.on('request',r=>{if(/bookkeeping|quickbooks|integration/i.test(r.url())) reqs.push(r.method()+' '+r.url().replace(/https:\/\/[^/]+/,'').slice(0,160));});
await p.evaluate(()=>localStorage.setItem('bookkeeping_enabled','true'));
await s.go('/administration/QuickBooks'); await p.waitForTimeout(8000);
console.log('url',p.url()); console.log([...new Set(reqs)].join('\n'));
console.log('text',(await p.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(0,1200));
await p.screenshot({path:'/tmp/qa11685/w/fee/qb-page.png',fullPage:true});
process.exit(0);
