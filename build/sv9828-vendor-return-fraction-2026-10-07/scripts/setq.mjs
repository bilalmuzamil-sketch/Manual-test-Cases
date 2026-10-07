import {ob,j} from './lib.mjs';
const [id,bin,q]=process.argv.slice(2); const s=await ob();
const r=await s.api('/api/inventory/parts/cycle-count',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({part_quantities:[{id,bins:[{id:bin,quantity:Number(q)}]}]})});
console.log('cycle-count',r.status,j(r.json,150)); const x=(await s.api('/api/inventory/parts/'+id)).json.data.part; console.log('now',x.quantity); await s.close();
