// Lists open (ordered/draft) stock POs at the current location; prod sends Trucks Hill 2.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env]=process.argv.slice(2);
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
const H=env==='prod'?{headers:{'x-location-id':'b617914c-16e9-4485-8e8b-193cd86aa416'}}:{};
const r=await s.api('/api/inventory/orders?limit=100',H); const L=r.json?.data?.orders||r.json?.data||[]; const arr=Array.isArray(L)?L:Object.values(L).find(Array.isArray)||[];
const st={}; arr.forEach(o=>st[o.status]=(st[o.status]||0)+1); console.log('n',arr.length,JSON.stringify(st));
for(const o of arr.filter(o=>!['fulfilled','received','canceled','cancelled'].includes(o.status)).slice(0,6)){ const d=await s.api('/api/inventory/orders/'+o.id,H); const ord=d.json?.data?.order||{}; const it=ord.items||[];
  console.log(o.id,o.status,o.number||o.order_number||o.raw_number,'wo',ord.work_order_id||'-','items',it.length,it.map(i=>i.part_number+':'+i.quantity+'/'+(i.quantity_received??'')).join(',')); }
await s.close(); process.exit(0);
