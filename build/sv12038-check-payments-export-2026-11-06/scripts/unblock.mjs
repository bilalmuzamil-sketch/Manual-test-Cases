import {sess,post} from './common.mjs'; const s=await sess(); const out={};
const list=async(t)=>(await s.api(`/api/organizations/finance/payment-methods?pagination[page]=1&pagination[rowsPerPage]=200&type=${t}`)).json?.data?.collection||[];
for(const t of [1,2]){ const L=await list(t); const by={}; for(const x of L){(by[x.code.toLowerCase()]??=[]).push(x.name);} const dup=Object.entries(by).filter(([k,v])=>v.length>1);
  console.log(`${process.env.ENV||'branch'} type ${t}: ${L.length} methods; same-code groups: ${JSON.stringify(dup)}`); console.log('  ',L.map(x=>x.name+'='+x.code).join(' | ')); }
if(process.env.RACE){ const n='ZZ12038 Race '+Date.now()%100000; const rs=await Promise.all([1,2,3].map(()=>post(s,'/api/organizations/finance/payment-methods/create',{name:n,type:1})));
  console.log('race',n,rs.map(r=>r.status+':'+JSON.stringify(r.json).slice(0,90)).join(' || '));
  const L=await list(1); console.log('rows with that name:',L.filter(x=>x.name===n).length); }
await s.close(); process.exit(0);
