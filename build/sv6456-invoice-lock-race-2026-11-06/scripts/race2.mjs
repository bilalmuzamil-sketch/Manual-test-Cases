import {sess,post} from './common.mjs'; import fs from 'fs'; const s=await sess();
const [wo,dep]=process.env.PAIR.split(','); const t0=Date.now();
const [a,b]=await Promise.all([post(s,'/api/invoices/create',{work_order_id:wo}),post(s,`/api/deposits/${dep}/reverse`,{})]);
const out={invoice:{status:a.status,body:JSON.stringify(a.json??a.text).slice(0,260)},reverse:{status:b.status,body:JSON.stringify(b.json??b.text).slice(0,200)}};
console.log(JSON.stringify(out)); fs.appendFileSync('../ev/'+process.env.ENV+'-race2-log.jsonl',JSON.stringify({at:new Date().toISOString(),wo,dep,...out})+'\n');
await s.close(); process.exit(0);
