import {sess} from './common.mjs';
const s=await sess(); const p=s.page;
const r=await s.api(`/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=15&filters[0][field]=status&filters[0][value]=complete`);
const w=r.json?.data?.work_orders||[];
for(const x of w.slice(0,+(process.env.MAX||8))){ await s.go(`/workorders/${x.id}/finance`); await p.waitForTimeout(6000);
  const t=await p.evaluate(()=>((document.body.innerText.match(/Terms\s*\n?\s*[A-Za-z0-9 ]{2,12}/)||['?'])[0]).replace(/\s+/g,' '));
  console.log(x.number,'|',x.companyName,'|',x.id,'|',t,'| url',p.url().replace(/^https:\/\/[^/]+/,'')); }
await s.close(); process.exit(0);
