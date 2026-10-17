import {session} from './rec.mjs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:1});
for(const q of ['limit=500','pagination[limit]=500','pagination[rowsPerPage]=500','limit=500&include_inactive=1','search=Haynes','limit=500&search=Peck']){ const r=await s.api('/api/staff?'+q); const c=r.json?.data?.collection||[]; console.log(q,r.status,c.length,JSON.stringify(r.json?.data?.pagination||{}).slice(0,150), c.filter(x=>/Haynes|Peck|Johnson|Olson|Wang|ShopView/.test(x.first_name+' '+x.last_name)).map(x=>x.first_name+' '+x.last_name+'|'+x.id.slice(0,8)+'|'+(x.staff_id||'').slice(0,8)).join(', ')); }
await s.close();
