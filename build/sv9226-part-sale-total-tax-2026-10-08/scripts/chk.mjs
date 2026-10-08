import {ob,j} from './lib.mjs'; import fs from 'fs'; import {fin} from './fin.mjs';
const s=await ob({vp:{width:1900,height:1000}}); let all=[];for(let pg=1;pg<=5;pg++){const c=(await s.api(`/api/part-sales?pagination%5BrowsPerPage%5D=100&pagination%5Bpage%5D=${pg}`)).json.data.partSales;all=all.concat(c);if(c.length<100)break;}
for(const f of process.argv.slice(2)){ const {id,num}=JSON.parse(fs.readFileSync(f)); const r=await fin(s,id); const i=r.indexOf('Total'); const c=Math.round(parseFloat(r[i+1].replace(/[$,]/g,''))*100); const l=all.find(x=>x.number===num)?.totalPrice; console.log(num,'list',l,'detail',c,l===c?'MATCH':'DIFF',j(r)); }
await s.close();
