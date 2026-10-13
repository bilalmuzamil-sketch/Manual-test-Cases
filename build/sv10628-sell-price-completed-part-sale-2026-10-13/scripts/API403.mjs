import {ob,J,post} from './lib.mjs'; import fs from 'fs'; import {resetRole,assignRole} from './roles.mjs';
const roles=JSON.parse(fs.readFileSync('roles.json')); const tech=JSON.parse(fs.readFileSync('tech-before.json')); const cr=JSON.parse(fs.readFileSync('custom-role.json')); const out={};
let a=await ob({dpr:1}); await assignRole(a,tech,cr.id); await a.close();
const s=await ob({dpr:1,quick:'tech'}); await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
out.fe=(await s.api('/api/auth/me/fe-permissions')).json.data.fe_permissions;
const l=(await s.api('/api/work-orders/lines/6c6bb614-e7b0-4f48-aa76-053f7b29d33b')).json; const parts=(l.collection||l.data?.collection||[]).flatMap(x=>x.parts||[]); const pt=parts.find(x=>x.part_number==='FF5324');
out.read=l.errors?J(l.errors):'ok'; out.price0=pt?.sell_price;
if(pt){ const r=await post(s,'/api/work-orders/parts/change',{id:pt.id,work_order_id:'6c6bb614-e7b0-4f48-aa76-053f7b29d33b',part_category_id:pt.part_category_id||pt.category_id,description:pt.description,quantity:pt.quantity,sell_price:99,margin:0,discount:0,core_charge:0,status:'Authorized'}); out.change=r.status+' '+J(r.json,200); }
const l2=(await s.api('/api/work-orders/lines/6c6bb614-e7b0-4f48-aa76-053f7b29d33b')).json; out.price1=((l2.collection||l2.data?.collection||[]).flatMap(x=>x.parts||[]).find(x=>x.part_number==='FF5324')||{}).sell_price;
await s.close();
a=await ob({dpr:1}); await resetRole(a,roles.find(r=>r.name==='Technician').id); await assignRole(a,tech,roles.find(r=>r.name==='Technician').id); const st=(await a.api('/api/staff?limit=200&search=tech%40shopview.com')).json; out.restored=(st.collection||st.data?.collection||st.data).find(x=>x.email==='tech@shopview.com').role_label; await a.close();
fs.writeFileSync('runs/api403.json',JSON.stringify(out,null,1)); console.log(J(out,800));
