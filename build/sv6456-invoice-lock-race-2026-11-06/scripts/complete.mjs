import {sess,arr} from './common.mjs'; const s=await sess();
const r=await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=500&pagination[sortBy]=&pagination[descending]=false&filters[0][field]=status&filters[0][value]=complete&search=&showMyWorkOrders=0');
const w=arr(r.json?.data); const by={}; for(const x of w){ (by[x.companyName]=by[x.companyName]||[]).push(x); }
console.log('complete',w.length); for(const [k,v] of Object.entries(by).sort((a,b)=>b[1].length-a[1].length).slice(0,8)) console.log(v.length,k,v.slice(0,5).map(x=>x.number+':'+(x.totalPrice/100)+':'+x.id).join(' '));
await s.close(); process.exit(0);
