import {sess,arr} from './common.mjs'; const s=await sess();
const r=await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=500&pagination[sortBy]=&pagination[descending]=false&filters[0][field]=status&filters[0][value]=invoiced&search=&showMyWorkOrders=0');
const w=arr(r.json?.data); const by={}; for(const x of w){ const k=x.companyName; (by[k]=by[k]||[]).push(x); }
console.log('invoiced',w.length, 'keys', Object.keys(w[0]||{}).join(',').slice(0,500));
for(const [k,v] of Object.entries(by).filter(([k,v])=>v.length>=2).slice(0,12)) console.log(v.length,k,v.map(x=>(x.order_number||x.number)+':'+(x.totalPrice/100)+':'+x.id).join(' '));
await s.close(); process.exit(0);
