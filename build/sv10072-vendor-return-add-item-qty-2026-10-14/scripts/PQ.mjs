import {op,J,post} from './lib.mjs';
const s=await op(); await post(s,'/api/iam/change-location',{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'});
for(const id of process.argv.slice(2)){ const d=(await s.api('/api/inventory/parts/'+id)).json?.data; const h=(await s.api(`/api/parts/history/${id}?pagination[rowsPerPage]=30&pagination[page]=1&pagination[sortBy]=&pagination[descending]=false&search=`)).json?.data?.collection||[]; console.log(id.slice(0,8),'qty',(d?.part||d)?.quantity,'history',h.length,J(h.map(x=>[x.eventName,x.startingQuantity,x.remainingQuantity]),300)); }
await s.close();
