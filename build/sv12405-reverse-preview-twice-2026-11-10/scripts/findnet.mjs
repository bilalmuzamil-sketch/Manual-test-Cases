import {sess} from './common.mjs';
const s=await sess(); const out=[];
const r=await s.api(`/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=40&filters[0][field]=status&filters[0][value]=complete`);
const w=r.json?.data?.work_orders||[]; console.log('n',w.length,'keys',Object.keys(w[0]||{}).filter(k=>/compan|custom|term/i.test(k)).join(','));
const seen={};
for(const x of w){ const cid=x.companyId||x.company_id; if(!cid||seen[cid]) continue; seen[cid]=1;
  const c=await s.api('/api/companies/'+cid); const d=c.json?.data?.company||c.json?.data||{};
  const t=JSON.stringify(d).match(/"(payment_?[tT]erms?[^"]*|terms?[^"]*|credit_?terms?[^"]*)":("[^"]*"|\{[^}]*\}|null|\d+)/g);
  console.log(x.number,x.companyName,x.id,c.status,(t||[]).slice(0,3).join(' '));
}
await s.close(); process.exit(0);
