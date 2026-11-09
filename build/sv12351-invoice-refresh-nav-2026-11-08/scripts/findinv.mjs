import {sess} from './common.mjs';
const s=await sess(); console.log('marker',JSON.stringify(await s.marker()));
for (const st of ['invoiced','paid','complete']){
 const r=await s.api(`/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=6&filters[0][field]=status&filters[0][value]=${st}`);
 const w=r.json?.data?.work_orders||[]; console.log(st, r.status, w.length, w.slice(0,6).map(x=>`${x.number}|${x.companyName}|${x.id}`).join(' ; '));
}
await s.close();
