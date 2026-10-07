import {ob,j} from './lib.mjs'; import fs from 'fs';
const [pn,q]=process.argv.slice(2); const s=await ob();
const part=(await s.api('/api/inventory/parts?search='+encodeURIComponent(pn))).json.data.collection.find(x=>x.part_number===pn);
const bin=part.binLocations[0]; const r=await s.api('/api/inventory/parts/cycle-count',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({part_quantities:[{id:part.id,bins:[{id:bin.binLocationId,quantity:Number(q)}]}]})});
console.log('cycle-count',r.status,j(r.json,200)); const now=(await s.api('/api/inventory/parts?search='+encodeURIComponent(pn))).json.data.collection.find(x=>x.part_number===pn); console.log(pn,'now',now.quantity);
await s.close();
