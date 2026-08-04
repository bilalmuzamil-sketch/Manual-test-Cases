import { login, api } from './qa8582.mjs';
const t=await login('admin'); const S=t.sessCookie;
const HD='b3c8c820-f815-4cf1-8938-10956c5ee71a',LE='f8a8b802-7780-4b16-bf10-343caeb616b2';
const PID='2233f83f-c915-45bf-9170-2370cb83425a', CAT='dbc8e4da-65d7-4fdd-871d-3b744d0c8afd';
const p=(n,r,l=500)=>console.log('#',n,r.status,(typeof r.body==='string'?r.body:JSON.stringify(r.body)).slice(0,l));
const pv=async()=>{const r=await api(S,'GET',`/api/reporting/reports/parts-velocity?type=both&range=this_year&locations=${HD},${LE}&search=ZZAUTOTEST&pagination[page]=1&pagination[rowsPerPage]=20`);
  return {status:r.status, rows:(r.body?.data?.collection||[]).map(x=>({pn:x.part_number,type:x.type,oh:x.on_hand,us:x.units_sold,rev:x.revenue,loc:x.location,min:x.min,max:x.max}))};};
console.log('PV BEFORE core flag:', JSON.stringify(await pv(),null,1));
// try to set is_core
p('inv change empty', await api(S,'POST','/api/inventory/parts/change',{}));
for(const b of [{part_id:PID,is_core:true},{id:PID,is_core:true},{inventory_part_id:PID,is_core:true}]){
  p('inv change '+JSON.stringify(Object.keys(b)), await api(S,'POST','/api/inventory/parts/change',b));
}
p('cat change empty', await api(S,'POST','/api/parts-catalogue/change-catalogue-part',{}));
p('cat change core', await api(S,'POST','/api/parts-catalogue/change-catalogue-part',{id:CAT,catalogue_part_id:CAT,name:'ZZAUTOTEST core item',part_number:'ZZAUTOTEST-CORE-1',tags:[],is_core:true}));
const list=await api(S,'GET','/api/inventory/parts?search=ZZAUTOTEST&pagination[rowsPerPage]=5');
console.log('is_core now:', JSON.stringify((list.body?.data?.collection||[]).map(x=>({pn:x.part_number,is_core:x.is_core,core_charge:x.core_charge}))));
