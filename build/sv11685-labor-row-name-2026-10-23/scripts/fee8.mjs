import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
const P=async(p,b)=>{const r=await s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('POST',p,JSON.stringify(b).slice(0,120),'->',r.status,JSON.stringify(r.json||r.text).slice(0,400)); return r;};
for(const c of ['fee','discount','fees','discounts','adjustment']) await P('/api/product-and-service/create',{name:'ZZAUTOTEST '+c,category:c});
console.log('mapping after',JSON.stringify((await s.api('/api/bookkeeping/adjustment-item-mapping-status')).json));
process.exit(0);
