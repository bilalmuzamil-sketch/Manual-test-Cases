import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
const W='d973d775-8e53-443b-912d-a56f6dafd54d';
for(const p of ['/api/work-orders/lines/'+W,'/api/work-orders/view/'+W,'/api/work-orders/'+W]){
  const r=await s.api(p); const t=JSON.stringify(r.json??r.text); const keys=[...new Set([...t.matchAll(/"([a-zA-Z_]*[Aa]djust[a-zA-Z_]*)"/g)].map(m=>m[1]))];
  console.log(p,r.status,t.length,keys);
}
// find what the work order page calls
const urls=new Set(); s.page.on('request',q=>{const u=q.url(); if(u.includes('api')&&/adjust|fee|discount/i.test(u)) urls.add(q.method()+' '+u.replace(/https:\/\/[^/]+/,''));});
await s.go('/workorders/'+W+'/lines'); await s.page.waitForTimeout(4000);
await s.go('/workorders/'+W+'/finance'); await s.page.waitForTimeout(4000);
console.log([...urls]);
await s.browser.close(); process.exit(0);
