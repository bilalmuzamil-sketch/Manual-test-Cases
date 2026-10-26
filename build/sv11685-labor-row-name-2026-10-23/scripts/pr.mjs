import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
const p=s.page; const reqs=[]; p.context().on('request',r=>{ if(/invoice|preview|pdf|print/i.test(r.url())&&!/\.js|\.css/.test(r.url())) reqs.push(r.method()+' '+r.url().replace(/https:\/\/[^/]+/,'').slice(0,200)); });
await s.go('/workorders/f94beef2-ce77-4ec3-8d23-be8fb787348f/finance'); await p.waitForTimeout(7000); reqs.length=0;
const popupP=p.context().waitForEvent('page',{timeout:8000}).catch(()=>null);
await p.click('[data-test-id="button_print_invoice"]'); await p.waitForTimeout(6000); const pop=await popupP;
console.log('popup',pop?pop.url().slice(0,120):'none'); console.log([...new Set(reqs)].join('\n'));
process.exit(0);
