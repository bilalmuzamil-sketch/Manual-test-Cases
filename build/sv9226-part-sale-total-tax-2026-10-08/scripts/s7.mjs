import {ob,j} from './lib.mjs'; import fs from 'fs'; import {fin} from './fin.mjs';
const all=JSON.parse(fs.readFileSync('ps-all.json')); const done=new Set(JSON.parse(fs.readFileSync('all-compare.json')).filter(x=>x.match).map(x=>x.id));
const s=await ob({vp:{width:1600,height:1000}}); const out=[];
for(const x of all.filter(x=>!done.has(x.id))){ const r=await fin(s,x.id); const i=r?r.indexOf('Total'):-1; const tot=i>=0?r[i+1]:null; const cents=tot?Math.round(parseFloat(tot.replace(/[$,]/g,''))*100):null;
  out.push({n:x.number,status:x.status,list:x.totalPrice,detail:tot,detailCents:cents,match:cents===x.totalPrice,company:x.companyName,id:x.id}); fs.writeFileSync('rest-compare.json',JSON.stringify(out,null,1)); }
console.log('done',out.length,'mismatch',out.filter(o=>!o.match).length,j(out.filter(o=>!o.match),2000));
await s.close();
