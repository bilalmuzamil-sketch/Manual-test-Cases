// workplace check: a bin that belongs to ANOTHER location must still be refused, with nothing left behind
import {sess} from './common.mjs'; import fs from 'fs'; const s=await sess(); const out=[]; const L=x=>{out.push(x);console.log(x);};
const J=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const ws=(await s.api('/api/staff/my-workplaces')).json.data; const all=(ws.collection||ws); const home=all.find(w=>/9919|Heavy Duty/.test(w.name)); const other=all.find(w=>w.id!==home.id);
L('home '+home.name+' other '+other.name);
L('switch other '+(await J('/api/iam/change-location',{workplace_id:other.id,workplace_timezone:other.timezone})).status);
const a=(await s.api('/api/inventory/parts?pagination[page]=1&pagination[rowsPerPage]=100')).json?.data?.collection||[]; const op=a.find(x=>(x.binLocations||[]).some(b=>b.name!=='Unassigned'))||a[0]; const ob=(op.binLocations||[])[0];
L(`other-location part ${op.part_number} bin ${ob.name} ${ob.binLocationId} workplace ${op.workplace_id}`);
L('switch home '+(await J('/api/iam/change-location',{workplace_id:home.id,workplace_timezone:home.timezone})).status);
const WO='e4215cb8-1388-4db9-b69d-fc5b93c0a121', LID='fdeea74d-c8ed-432e-90e7-59c6c394e129', INV='0007be4d-96b1-4ddf-a94b-026f03f4e35f', CAT='0e446ce2-3793-498f-b969-9ecde2ea2888';
const cnt=async()=>{ let n=0; for(const l of ((await s.api(`/api/work-orders/lines/${WO}`)).json?.data?.collection||[])) n+=(l.part_requests||[]).length; return n; };
const c0=await cnt(); const r=await J('/api/work-orders/part/make-request',{work_order:WO,line:LID,description:'ZZAUTOTEST SV12341',part_source_type:'inventory',inventory_part_id:INV,part_category_id:CAT,sell_price:50,quantity:1,bins:[{id:ob.binLocationId,name:ob.name,quantity:1}]});
L(`T1 bin from another location (${ob.name}): HTTP ${r.status} ${JSON.stringify(r.json?.errors||r.json?.data?.id)} requests ${c0}->${await cnt()}`);
const r2=await J('/api/work-orders/part/make-request',{work_order:WO,line:LID,description:'ZZAUTOTEST SV12341',part_source_type:'inventory',inventory_part_id:op.id,part_category_id:op.category,sell_price:50,quantity:1,bins:[{id:ob.binLocationId,name:ob.name,quantity:1}]});
L(`T2 part AND bin from another location: HTTP ${r2.status} ${JSON.stringify(r2.json?.errors||r2.json?.data?.id)} requests ->${await cnt()}`);
fs.writeFileSync(`../ev/${process.env.TAG}-tenant.txt`,out.join('\n')+'\n'); await s.close();
