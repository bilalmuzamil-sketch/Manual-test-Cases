// find short inventory part numbers that appear inside many other part numbers (the EC1 shape)
import {sess,arr} from './common.mjs'; import fs from 'fs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
let all=[]; for(let pg=1;pg<=12;pg++){ const d=arr((await s.api(`/api/inventory/parts?pagination[page]=${pg}&pagination[rowsPerPage]=500`)).json?.data); if(!d.length) break; all.push(...d); }
const pns=all.map(x=>(x.part_number||'').toUpperCase()).filter(Boolean); console.log('parts',pns.length);
const shorts=[...new Set(pns.filter(p=>p.length>=3&&p.length<=6))]; const res=[];
for(const s1 of shorts){ const sup=pns.filter(p=>p!==s1&&p.includes(s1)); const pre=sup.filter(p=>p.startsWith(s1)).length; if(sup.length>=8) res.push([s1,sup.length,pre,sup.slice(0,4).join(' ')]); }
res.sort((a,b)=>b[1]-a[1]); console.log(JSON.stringify(res.slice(0,15))); fs.writeFileSync(`/tmp/sv11413-${process.env.ENV||'branch'}-parts.json`,JSON.stringify(all.map(x=>({id:x.id,pn:x.part_number,name:x.name,wp:x.workplace_id}))));
await s.close(); process.exit(0);
