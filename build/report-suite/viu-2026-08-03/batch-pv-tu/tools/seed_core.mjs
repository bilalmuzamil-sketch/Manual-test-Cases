import { login, api } from './qa8582.mjs';
import fs from 'fs';
const t=await login('admin'); const S=t.sessCookie;
const HD='b3c8c820-f815-4cf1-8938-10956c5ee71a',LE='f8a8b802-7780-4b16-bf10-343caeb616b2';
const p=(n,r,l=600)=>console.log('#',n,r.status,(typeof r.body==='string'?r.body:JSON.stringify(r.body)).slice(0,l));
// learn the required fields
p('empty', await api(S,'POST','/api/inventory/parts/create',{}));
const bodies=[
 {part_number:'ZZAUTOTEST-CORE-1', name:'ZZAUTOTEST core part', workplace_id:HD, quantity:5, is_core:true},
 {part_number:'ZZAUTOTEST-CORE-1', name:'ZZAUTOTEST core part', workplace_id:HD, quantity:5, is_core:true, purchase_price:10, sell_price:20, min:0, max:10},
];
for(const b of bodies){ p(JSON.stringify(Object.keys(b)), await api(S,'POST','/api/inventory/parts/create',b)); }
