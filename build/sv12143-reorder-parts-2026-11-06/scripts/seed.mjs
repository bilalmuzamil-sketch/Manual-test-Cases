// WO + one canned line + N vendor parts on that line; then open Lines, expand the line, dump the part rows' controls
import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const s=await sess(); const p=s.page; await s.go('/workorders'); await p.waitForTimeout(3000); const P=(u,b)=>post(s,u,b);
const ws=arr((await s.api('/api/staff/my-workplaces')).json?.data); const W=ENV==='prod'?ws.find(w=>/Trucks Hill 2/.test(w.name)):ws.find(w=>w.id.startsWith('b3c8c820')); await P('/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone});
const me=await s.api('/api/auth/me'); console.log('me',me.status); const company=process.env.COMPANY;
const veh=arr((await s.api('/api/vehicles?company_id='+company)).json?.data); console.log('company',company,'veh',veh.length,'cl',0); const cl=arr((await s.api('/api/work-orders/canned-lines?limit=200')).json?.data).filter(x=>x.workplace_id===W.id&&Number(x.total_parts)===0);
const c=await P('/api/work-orders/create',{company_id:company,vehicle_id:veh[0].id,workplace_id:W.id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true}); const id=c.json.data.work_order_id;
await P(`/api/work-orders/${id}/lines/create-from-canned-line`,{canned_line_id:cl[0].id,status:'authorized'}); const L=arr((await s.api('/api/work-orders/lines/'+id)).json?.data)[0].line_id;
const cats=arr((await s.api('/api/inventory/categories')).json?.data); const cat=(cats[0]?.value||cats[0]?.id);
const names=(process.env.PARTS||'ZZ-HARDLINE-A,ZZ-COMPRESSOR,ZZ-HARDLINE-B').split(','); const parts=[];
for(const n of names){ const r=await P('/api/work-orders/part/make-request',{line:L,work_order:id,description:n,quantity:1,part_source_type:'vendor',part_number:n,sell_price:10,cost:5,part_category_id:cat}); parts.push({n,st:r.status,id:r.json?.data?.id||r.json?.data?.part_request_id}); }
if(process.env.INV){ const IP=arr((await s.api('/api/inventory/parts?pagination[page]=1&pagination[rowsPerPage]=500')).json?.data).find(x=>x.part_number===process.env.INV); const r=await P('/api/work-orders/part/make-request',{line:L,work_order:id,description:IP.name,quantity:1,part_source_type:'inventory',inventory_part_id:IP.id,part_number:IP.part_number,sell_price:20,part_category_id:IP.category||cat}); parts.push({n:IP.part_number,inv:true,st:r.status,res:JSON.stringify(r.json).slice(0,200)}); }
const v=(await s.api('/api/work-orders/view/'+id)).json.data; const num=(v.work_order||v).display_number||(v.work_order||v).number; console.log('WO',num,id,'line',L,JSON.stringify(parts));
fs.writeFileSync(`/tmp/sv12143-${ENV}.json`,JSON.stringify({id,num,L,parts,W},null,1));
await s.go('/workorders/'+id+'/lines'); await p.waitForTimeout(7000); const ex=p.locator(`[data-test-id="button_line_expand_${L}"]`); if(await ex.count()){ await ex.click(); await p.waitForTimeout(2500); }
const ids=await p.evaluate(()=>{const m={}; for(const e of document.querySelectorAll('[data-test-id]')){const k=e.getAttribute('data-test-id').replace(/[0-9a-f-]{36}/g,'<id>'); m[k]=(m[k]||0)+1;} return m;}); console.log('ids',JSON.stringify(Object.fromEntries(Object.entries(ids).filter(([k])=>/part|drag|handle|sort|order|row/i.test(k)))));
await p.screenshot({path:`../ev/${ENV}-line-expanded.png`}); await s.close(); process.exit(0);
