// Back end: add a processing fee naming a template that is a plain fee (not a processing fee) — the PR names the template.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const WO={branch:'88207a22-4650-4b85-9d19-f7b0b9b7a1e7',prod:'0ecff689-f076-4b1e-be98-d1fcaf650988'}[env]; const LOC='b617914c-16e9-4485-8e8b-193cd86aa416';
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
if(env==='prod'){ await s.go('/workorders'); await s.page.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC); }
const H=env==='prod'?{'x-location-id':LOC}:{}; const t=(await s.api('/api/adjustment-templates',{headers:H})).json; const L=t?.data?.collection||t?.data||[];
const arr=Array.isArray(L)?L:Object.values(L).find(Array.isArray)||[]; console.log('templates',arr.length,arr.slice(0,6).map(x=>(x.kind||x.type)+':'+x.name).join(' | '));
if(!arr.find(x=>(x.kind||x.type)!=='processing_fee')){ const c=await s.api('/api/adjustment-templates',{method:'POST',headers:Object.assign({'Content-Type':'application/json'},H),body:JSON.stringify(JSON.parse(process.env.BODY||'{}'))}); console.log('create',c.status,JSON.stringify(c.json||c.text).slice(0,400)); if(c.status>=300){ await s.close(); process.exit(0);} const t2=(await s.api('/api/adjustment-templates',{headers:H})).json; arr.splice(0,arr.length,...((t2?.data?.collection||t2?.data||[])));
}
const fee=arr.find(x=>(x.kind||x.type)!=='processing_fee'); if(!fee){ console.log('no plain template'); process.exit(0); }
const r=await s.api('/api/work-orders/adjustments/add',{method:'POST',headers:Object.assign({'Content-Type':'application/json'},H),body:JSON.stringify({workOrderId:WO,kind:'processing_fee',name:'ZZ',calculationType:'pct_grand_total',amount:3,maxCap:null,scope:'whole_wo',targetId:null,taxable:false,templateId:fee.id,description:null})});
console.log('template',fee.name,fee.id,'->',r.status,JSON.stringify(r.json||r.text).slice(0,250));
await s.close(); process.exit(0);
