import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
const WO='d973d775-8e53-443b-912d-a56f6dafd54d';
const P=async(p,b)=>{const r=await s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('POST',JSON.stringify(b).slice(0,120),'->',r.status,JSON.stringify(r.json||r.text).slice(0,300)); return r;};
const L=(await s.api('/api/work-orders/lines/'+WO)).json.data; const line=(L.collection||L.lines||L)[0]; console.log('line keys',Object.keys(line).join(','));
console.log('labor-ish',JSON.stringify(Object.fromEntries(Object.entries(line).filter(([k,v])=>/labo|id$|price|total|time/i.test(k)))).slice(0,600));
for(const sc of ['labor','labour','line']) await P('/api/work-orders/adjustments/add',{workOrderId:WO,kind:'fee',name:'ZZAUTOTEST labor fee',calculationType:'flat',amount:10,scope:sc,targetId:line.id||line.line_id,taxable:false});
process.exit(0);
