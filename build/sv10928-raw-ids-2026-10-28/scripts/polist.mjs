import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env]=process.argv.slice(2);
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
const r=await s.api('/api/inventory/orders?limit=60'); const L=r.json?.data?.orders||r.json?.data||[]; const arr=Array.isArray(L)?L:Object.values(L).find(Array.isArray)||[];
console.log('n',arr.length, JSON.stringify(arr[0]).slice(0,300));
for(const o of arr.filter(o=>o.status==='ordered'||o.status==='draft').slice(0,8)){ const d=await s.api('/api/inventory/orders/'+o.id); const it=d.json?.data?.order?.items||[];
  console.log(o.id,o.status,o.number||o.order_number,'items',it.length,it.slice(0,3).map(i=>(i.part_number||'')+':'+(i.manufacturer_id||i.manufacturer||'-')).join(','), 'keys',it[0]?Object.keys(it[0]).filter(k=>/manu/i.test(k)).join('/'):''); }
await s.close(); process.exit(0);
