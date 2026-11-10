import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; await s.go('/reports/ap-aging-detail'); await p.waitForTimeout(4000);
const base=s.host.api+'/api/reporting/reports/'; const A='asOfDate=2026-11-10';
const j=async q=>p.evaluate(async u=>{const r=await fetch(u,{credentials:'include'});return r.json();},base+q);
const v=await j('ap-aging/vendors'); const list=(v.data?.collection||v.data||v.collection||v); console.log('vendors',Array.isArray(list)?list.length:Object.keys(v), JSON.stringify(list).slice(0,300));
const ids=list.slice(0,3).map(x=>x.id||x.value);
const tot=d=>(d.data?.groups||[]).reduce((a,g)=>a+g.rowsNumber,0);
console.log('one',tot(await j(`ap-aging-detail?${A}&vendors=${ids[0]}`)));
console.log('comma',tot(await j(`ap-aging-detail?${A}&vendors=${ids.join(',')}`)));
console.log('repeat',tot(await j(`ap-aging-detail?${A}&`+ids.map(i=>'vendors='+i).join('&'))));
console.log('brackets',tot(await j(`ap-aging-detail?${A}&`+ids.map(i=>'vendors[]='+i).join('&'))));
// per-vendor counts for all vendors (bounded)
const counts=[]; for(const x of list){ const id=x.id||x.value; counts.push([id,x.name||x.label,tot(await j(`ap-aging-detail?${A}&vendors=${id}`))]); }
counts.sort((a,b)=>b[2]-a[2]); fs.writeFileSync('../ev/pdf500-recheck/vendor-counts.json',JSON.stringify(counts)); console.log(counts.slice(0,15));
await s.close(); process.exit(0);
