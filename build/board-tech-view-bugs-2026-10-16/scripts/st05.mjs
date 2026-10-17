import {session} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1200,height:800},dpr:1}); const pick={};
for(const v of ['estimate','approved','in_progress','ready_for_review','complete','invoiced','paid']){
 const r=await s.api(`/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=200&pagination[sortBy]=number&pagination[descending]=true&filters[0][field]=status&filters[0][value]=${v}&search=&showMyWorkOrders=0`);
 const w=r.json.data.work_orders; const withC=w.find(o=>o.serviceActionsCount>0&&(o.partRequestsCount>0||o.unreceivedPartRequestsCount>0))||w.find(o=>o.serviceActionsCount>0||o.partRequestsCount>0); const none=w.find(o=>!o.serviceActionsCount&&!o.partRequestsCount);
 pick[v]={n:w.length,counts:withC&&{num:withC.number,sa:withC.serviceActionsCount,pr:withC.partRequestsCount},plain:none&&none.number}; }
console.log(JSON.stringify(pick)); fs.writeFileSync('/tmp/qa11310/st05.json',JSON.stringify(pick,null,1)); await s.close();
