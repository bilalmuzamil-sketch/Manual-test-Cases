import {sess} from './common.mjs';
const s=await sess(); await s.go('/parts/orders');
for(const k of ['order_number','workOrderNumber']){ let a=[],pg=1; while(true){ const r=await s.api(`/api/inventory/orders?pagination%5BrowsPerPage%5D=30&pagination%5Bpage%5D=${pg}&pagination%5BsortBy%5D=${k}&pagination%5Bdescending%5D=false&search=`); const c=r.json.data.collection; a.push(...c); if(c.length<30)break; pg++;}
 console.log(process.env.ENV||'branch',k, a.map(x=>k==='order_number'?x.order_number+'('+x.raw_number+')':(x.workOrderDisplayNumber??x.workOrderNumber??'-')).join(' ').slice(0,700)); }
await s.browser.close();
