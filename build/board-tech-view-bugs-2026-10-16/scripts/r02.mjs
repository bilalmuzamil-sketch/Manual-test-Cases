import {session} from './rec.mjs'; import fs from 'fs';
const quick=process.argv[2]||'admin'; const s=await session({quick,vp:{width:1200,height:800},dpr:1});
const get=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
const before=JSON.parse(fs.readFileSync('/tmp/qa11310/pref02-before'+(quick==='admin'?'':'-'+quick)+'.json'));
const cur=await get(); const st=(await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:{...cur,pinnedTechnicianIds:before.pinnedTechnicianIds,technicianOrder:before.technicianOrder,collapsedGroups:before.collapsedGroups}})})).status;
const a=await get(); console.log(st,['pinnedTechnicianIds','technicianOrder','collapsedGroups'].map(k=>k+':'+(JSON.stringify(a[k])===JSON.stringify(before[k]))).join(' '),'pins',JSON.stringify(a.pinnedTechnicianIds)); await s.close();
