import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
const r=await s.api('/api/bookkeeping/integration'); fs.writeFileSync('/tmp/qa11685/w/fee/integration-before.json',JSON.stringify(r.json,null,1)); const j=JSON.stringify(r.json);
console.log(r.status,j.length); console.log(j.slice(0,1500));
console.log('keys with fee/discount/adjust:',[...new Set(j.match(/"[a-zA-Z_]*(fee|Fee|discount|Discount|adjust|Adjust)[a-zA-Z_]*"/g))]);
const o=(await s.api('/api/bookkeeping/integration/options-sync')).json; console.log('options-sync',JSON.stringify(o).slice(0,300));
process.exit(0);
