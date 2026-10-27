import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
const P=async(p,b)=>{const r=await s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('POST',p,JSON.stringify(b).slice(0,160),'->',r.status,JSON.stringify(r.json||r.text).slice(0,300)); return r;};
const T=(await s.api('/api/adjustment-templates')).json.data.templates; const t=T[0];
await P(`/api/adjustment-templates/${t.id}/change`,{kind:'fee',name:t.name,description:null,calculationType:'pct_labor',defaultAmount:10,defaultScope:'labor_line',defaultMaxCap:null,autoApply:true,taxable:false});
await P('/api/adjustment-templates',{kind:'discount',name:'ZZAUTOTEST labor discount 5',description:null,calculationType:'pct_labor',defaultAmount:5,defaultScope:'labor_line',defaultMaxCap:null,autoApply:true,taxable:false});
console.log(JSON.stringify((await s.api('/api/adjustment-templates')).json.data.templates.map(x=>[x.name,x.defaultScope,x.autoApply])));
process.exit(0);
