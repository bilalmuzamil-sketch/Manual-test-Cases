import {ob,j} from './lib.mjs'; import fs from 'fs';
const {wo,line}=JSON.parse(fs.readFileSync('wo-B.json')); const s=await ob();
const r=await s.api('/api/work-orders/part/make-request',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({line,work_order:wo,description:'ZZAUTOTEST vendor part',quantity:1,part_source_type:'vendor',part_number:'ZZ10599V',purchase_price:10,sell_price:20})});
console.log('vendor part',r.status,j(r.json,300)); await s.close();
