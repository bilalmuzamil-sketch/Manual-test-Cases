import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
const r=await s.api('/api/bookkeeping/integration/options-sync',{method:'POST',headers:{'content-type':'application/json'},body:'{}'}); console.log('sync',r.status,JSON.stringify(r.json).slice(0,300));
for(let i=0;i<12;i++){ const o=(await s.api('/api/bookkeeping/integration/options-sync')).json?.data; console.log(i,JSON.stringify(o)); if(o&&o.status!=='running'&&o.status!=='queued'&&o.status!=='pending'&&i>0) break; await s.page.waitForTimeout(5000);}
const g=(await s.api('/api/bookkeeping/integration')).json.data; console.log('collection',JSON.stringify(g.collection).slice(0,400));
const ps=await s.api('/api/bookkeeping/products-and-services'); console.log('products',ps.status,JSON.stringify(ps.json).slice(0,300));
process.exit(0);
