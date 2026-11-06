import {sess,post} from './common.mjs'; import fs from 'fs'; const s=await sess();
const ids=process.env.WOS.split(','); const t0=Date.now();
const res=await Promise.all(ids.map(id=>post(s,'/api/invoices/create',{work_order_id:id}).then(r=>({id:id.slice(0,8),status:r.status,ms:Date.now()-t0,body:JSON.stringify(r.json??r.text).slice(0,220)}))));
for(const r of res) console.log(JSON.stringify(r)); fs.appendFileSync('../ev/'+process.env.ENV+'-race-log.jsonl',JSON.stringify({at:new Date().toISOString(),res})+'\n');
await s.close(); process.exit(0);
