import {session} from './rec.mjs';
const s=await session({}); const g=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
const cur=await g(); const want={tab:'all',sortBy:'status',density:'comfortable',display:'tech_view',filters:{status:[]},descending:true,collapsedGroups:[]};
console.log('before',JSON.stringify(Object.fromEntries(Object.keys(want).map(k=>[k,cur[k]]))));
const v={...cur,...want}; const r=await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})});
const a=await g(); console.log(r.status,'after',JSON.stringify(Object.fromEntries(Object.keys(want).map(k=>[k,a[k]]))), 'pins/order kept', JSON.stringify(a.technicianOrder)===JSON.stringify(cur.technicianOrder));
await s.close();
