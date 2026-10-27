import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
const P=async(p,b)=>{const r=await s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('POST',p,JSON.stringify(b).slice(0,160),'->',r.status,JSON.stringify(r.json||r.text).slice(0,400)); return r;};
const base={name:'ZZAUTOTEST labor fee 10%',kind:'fee',calculationType:'pct_labor',scope:'labor_line',taxable:false};
for(const extra of [{amount:'10'},{value:10},{percent:10},{amount:10.5}]){ const r=await P('/api/adjustment-templates',{...base,...extra}); if(r.status<300) break; }
process.exit(0);
