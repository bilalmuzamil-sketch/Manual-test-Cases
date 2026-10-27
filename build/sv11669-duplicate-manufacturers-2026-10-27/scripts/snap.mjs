import {sess} from './lib.mjs'; import fs from 'fs'; const tag=process.argv[2];
const s=await sess(); const a=Object.values((await s.api('/api/parts-catalogue/manufacturers')).json.data).find(Array.isArray);
fs.writeFileSync(`../data/${tag}.json`,JSON.stringify(a.map(m=>({id:m.value,name:m.label})),null,1));
const n=x=>String(x??'').trim().toLowerCase().replace(/\s+/g,' '); const c={}; a.forEach(m=>c[n(m.label)]=(c[n(m.label)]||0)+1);
console.log(tag,'total',a.length,'distinct',Object.keys(c).length,'blank',c['']||0,'dupes',JSON.stringify(Object.entries(c).filter(([k,v])=>v>1)));
await s.browser.close(); process.exit(0);
