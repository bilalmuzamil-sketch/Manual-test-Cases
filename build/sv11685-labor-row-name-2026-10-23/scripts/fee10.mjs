import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
const WO='d973d775-8e53-443b-912d-a56f6dafd54d', LINE='741ee1b2-1445-4e23-b63b-14e46ceafb2f';
const P=async(p,b)=>{const r=await s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('POST',p,JSON.stringify(b).slice(0,160),'->',r.status,JSON.stringify(r.json||r.text).slice(0,300)); return r;};
const T=(await s.api('/api/adjustment-templates')).json.data.templates; console.log('templates',JSON.stringify(T).slice(0,500)); const t=T.find(x=>/ZZAUTOTEST labor fee 10/.test(x.name));
await P('/api/work-orders/adjustments/add',{workOrderId:WO,kind:'fee',name:t.name,calculationType:'pct_labor',amount:10,scope:'labor_line',targetId:LINE,taxable:false,templateId:t.id});
process.exit(0);
