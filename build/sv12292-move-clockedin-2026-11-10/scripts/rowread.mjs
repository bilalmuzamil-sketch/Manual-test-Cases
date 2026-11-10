import {sess,arr} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync('/tmp/sv12292/seed-branch.json','utf8')); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
for(const k of (process.env.KS||'H2').split(',')){ const w=S.W[k]; const l=arr((await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=20&showMyWorkOrders=0&search='+encodeURIComponent(w.number))).json?.data).find(x=>x.id===w.id); const n=(l?.clockedInTechnicians||[]).map(x=>x.firstName+' '+x.lastName); console.log(n.length===l?.clockedInTechniciansCount?'MATCH':'MISMATCH',w.number,JSON.stringify(n),'count',l?.clockedInTechniciansCount); }
await s.close(); process.exit(0);
