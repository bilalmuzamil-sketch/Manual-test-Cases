import {sess} from './common.mjs';
const s=await sess(); await s.go('/parts/orders');
const get=async q=>{ let a=[],pg=1; while(true){ const r=await s.api(`/api/inventory/orders?pagination%5BrowsPerPage%5D=30&pagination%5Bpage%5D=${pg}&${q}`); if(r.status!==200) return {err:r.status}; const c=r.json.data.collection; a.push(...c); if(c.length<30)break; pg++;} return a; };
const key={workOrderNumber:x=>x.workOrderDisplayNumber??x.workOrderNumber??'',order_number:x=>x.order_number,status:x=>x.status_label,created_on:x=>x.created_on,total_price:x=>+x.total_price_decimal,note:x=>x.note??''};
for(const [k,f] of Object.entries(key)) for(const d of [false,true]){ const a=await get(`pagination%5BsortBy%5D=${k}&pagination%5Bdescending%5D=${d}&search=`); if(a.err){console.log(k,d,'HTTP',a.err);continue;}
  const v=a.map(f); const nn=v.filter(x=>x!==''&&x!=null); let ok=true; for(let i=1;i<nn.length;i++){ const c=typeof nn[i]==='number'?nn[i]-nn[i-1]:String(nn[i]).localeCompare(String(nn[i-1]),undefined,{sensitivity:'base',numeric:true}); if(d?c>0:c<0){ok=false;break;} }
  console.log(k,d?'desc':'asc',a.length,'uniq',new Set(a.map(x=>x.id)).size,'monotonic',ok,'first',JSON.stringify(v[0]),'last',JSON.stringify(v[v.length-1])); }
const c=await get('pagination%5BsortBy%5D=vendorNames&pagination%5Bdescending%5D=false&search=Diesel'); console.log('search Diesel + vendor A-Z',c.length,c.map(x=>(x.vendorNames||[])[0]).join(' / ').slice(0,300));
await s.browser.close();
