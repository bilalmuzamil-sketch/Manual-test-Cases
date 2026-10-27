import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
let r=await s.api('/api/work-orders?limit=5&page=1'); console.log('list',r.status,JSON.stringify(r.json).slice(0,600));
r=await s.api('/api/work-orders/adjustments?workOrderId=d973d775-8e53-443b-912d-a56f6dafd54d'); console.log('adj',r.status,JSON.stringify(r.json).slice(0,400));
r=await s.api('/api/work-orders/adjustments'); console.log('adj-all',r.status,JSON.stringify(r.json??r.text).slice(0,300));
await s.browser.close(); process.exit(0);
