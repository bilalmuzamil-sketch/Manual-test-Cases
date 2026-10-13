// add another generic part (as the inline row does) and print its id
import {op,J,post,setLoc} from './lib.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync('wo1.json')); const n=process.argv[2]||'2'; const q=Number(process.argv[3]||30);
const s=await op({dpr:1}); await setLoc(s);
const r=await post(s,'/api/work-orders/part/make-request',{work_order:W.wo,line:W.line,description:'Round jacketed 2 wire cable ft (generic '+n+')',quantity:q,part_source_type:'vendor',part_number:'ZZGENERIC-CABLE-'+n,sell_price:0});
console.log(r.json.data.id); await s.close();
