import {sess,post,arr} from './common.mjs'; import fs from 'fs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
const ws=arr((await s.api('/api/staff/my-workplaces')).json?.data); const W=ws.find(w=>w.id.startsWith('b3c8c820')); await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone});
let all=[]; for(let pg=1;pg<=5;pg++){ const d=arr((await s.api(`/api/inventory/parts?pagination[page]=${pg}&pagination[rowsPerPage]=500&search=${process.env.Q}`)).json?.data); if(!d.length) break; all.push(...d); }
const q=process.env.Q.toLowerCase(); const hit=all.filter(x=>((x.name||'')+' '+(x.part_number||'')).toLowerCase().includes(q)); const start=hit.filter(x=>(x.name||'').toLowerCase().startsWith(q)||(x.part_number||'').toLowerCase().startsWith(q));
console.log(W.name,'inventory search rows',all.length,'contain',hit.length,'start-with',start.length,'mid-only',hit.length-start.length);
fs.writeFileSync(`/tmp/sv11413-${process.env.ENV}-inv-${q}.json`,JSON.stringify(hit.map(x=>({id:x.id,pn:x.part_number,name:x.name,wp:x.workplace_id}))));
console.log('has 4--FLT3030LCB20:',hit.some(x=>x.part_number==='4--FLT3030LCB20')); await s.close(); process.exit(0);
