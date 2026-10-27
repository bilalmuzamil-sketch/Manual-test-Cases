import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
for(const q of ['rowsPerPage=100&page=2','pagination[page]=2&pagination[rowsPerPage]=100','page=2&limit=100']){
  const r=await s.api('/api/work-orders?'+q); const w=r.json?.data?.work_orders||[]; console.log(q,r.status,w.length,w[0]?.number,JSON.stringify(r.json?.data?.pagination));
}
await s.browser.close(); process.exit(0);
