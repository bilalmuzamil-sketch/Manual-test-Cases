import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/parts/orders');
const get=async(q)=>{ let all=[],pg=1; while(true){ const r=await s.api(`/api/inventory/orders?pagination%5BrowsPerPage%5D=30&pagination%5Bpage%5D=${pg}&${q}`); const c=r.json?.data?.collection||r.json?.data?.items||[]; if(pg===1&&!c.length) console.log('raw',JSON.stringify(r.json).slice(0,300)); all.push(...c); if(c.length<30||pg>200)break; pg++; } return all; };
const out={};
for(const [k,q] of [['none','pagination%5BsortBy%5D=&pagination%5Bdescending%5D=false&search='],['vasc','pagination%5BsortBy%5D=vendorNames&pagination%5Bdescending%5D=false&search='],['vdesc','pagination%5BsortBy%5D=vendorNames&pagination%5Bdescending%5D=true&search=']]){
  const a=await get(q); out[k]=a.map(x=>({id:x.id,n:x.order_number,v:x.vendorNames,st:x.status_label,rec:x.status})); console.log(k,a.length, 'uniq',new Set(a.map(x=>x.id)).size);}
if(out.none[0]) console.log('sample keys',Object.keys((await s.api('/api/inventory/orders?pagination%5BrowsPerPage%5D=1&pagination%5Bpage%5D=1&search=')).json.data.collection[0]).join(','));
fs.writeFileSync(`../ev/orders-${process.env.ENV||'branch'}.json`,JSON.stringify(out)); await s.browser.close();
