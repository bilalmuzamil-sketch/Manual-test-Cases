import {op,J,post,setLoc} from './lib.mjs'; import fs from 'fs';
const base=JSON.parse(fs.readFileSync('base-change.json')); const W=JSON.parse(fs.readFileSync('wo1.json'));
const s=await op({dpr:1}); await setLoc(s);
const all=(await s.api('/api/work-orders/lines/'+W.wo)).json; const c=all.collection||all.data?.collection||[];
console.log('parts on lines',J(c.flatMap(l=>(l.parts||[]).map(p=>[p.id.slice(0,8),p.status,p.status_val,p.quantity]))));
const r=await post(s,'/api/work-orders/parts/change',Object.assign({},base,{status:'Authorized',quantity:30,description:'ZZAUTOTEST Round jacketed 2 wire cable ft'})); console.log('restore 39f69d19',r.status,J(r.json,150));
const all2=(await s.api('/api/work-orders/lines/'+W.wo)).json; const c2=all2.collection||all2.data?.collection||[];
console.log('after',J(c2.flatMap(l=>(l.parts||[]).map(p=>[p.id.slice(0,8),p.status,p.status_val,p.quantity]))));
await s.close();
