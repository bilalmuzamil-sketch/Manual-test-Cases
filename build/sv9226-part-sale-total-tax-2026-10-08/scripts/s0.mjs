import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob(); console.log(j(await s.marker()), (await s.api('/api/iam/view-profile/')).json?.data?.user?.email);
const l=await s.api('/api/part-sales?limit=200'); const all=l.json?.data?.partSales||[]; console.log('n',all.length,'pag',j(l.json?.data?.pagination));
fs.writeFileSync('ps-list.json',JSON.stringify(l.json,null,1));
const by={}; for(const x of all){by[x.status]=(by[x.status]||0)+1;} console.log(j(by));
console.log(j(all.slice(0,5).map(x=>[x.number,x.status,x.totalPrice,x.companyName,x.invoicedDate])));
await s.close();
