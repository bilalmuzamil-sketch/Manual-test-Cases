import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob();
let all=[]; for(let pg=1;pg<=30;pg++){ const r=await s.api(`/api/part-sales?pagination%5BrowsPerPage%5D=100&pagination%5Bpage%5D=${pg}`); const c=r.json?.data?.partSales||[]; if(pg===1) console.log('pag',j(r.json?.data?.pagination)); all=all.concat(c); if(c.length<100) break; }
const ids=new Set(all.map(x=>x.id)); console.log('total',all.length,'unique',ids.size);
const by={}; for(const x of all){by[x.status]=(by[x.status]||0)+1;} console.log(j(by));
fs.writeFileSync('ps-all.json',JSON.stringify(all,null,1));
const st=await s.api('/api/part-sales?pagination%5BrowsPerPage%5D=100&pagination%5Bpage%5D=1&status%5B%5D=estimate'); console.log('status param test',st.status,(st.json?.data?.partSales||[]).length);
await s.close();
