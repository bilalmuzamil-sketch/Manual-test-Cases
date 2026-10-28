import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa26'});
const r=await s.api('/api/work-orders/lines/90a95f29-f405-4763-834d-6e3a237f8c33'); console.log('lines',r.status,JSON.stringify(r.json||r.text).slice(0,200));
const a=await s.api('/api/work-orders/90a95f29-f405-4763-834d-6e3a237f8c33/adjustments'); console.log('adj',a.status,JSON.stringify(a.json||a.text).slice(0,400));
await s.go('/parts/part-sale/90a95f29-f405-4763-834d-6e3a237f8c33/part-requests'); await s.page.waitForTimeout(8000); console.log('url',s.page.url()); await s.page.screenshot({path:'/tmp/s11631-alive.png'});
await s.close(); process.exit(0);
