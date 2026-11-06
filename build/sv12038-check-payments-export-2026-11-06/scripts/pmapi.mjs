import {sess,post} from './common.mjs'; const s=await sess();
const list=async(t)=>(await s.api(`/api/organizations/finance/payment-methods?pagination[page]=1&pagination[rowsPerPage]=100&type=${t}`)).json?.data?.collection||[];
for(const n of (process.env.NAMES||'').split('|').filter(Boolean)){ const r=await post(s,'/api/organizations/finance/payment-methods/create',{name:n,type:+(process.env.T||1)}); console.log(JSON.stringify(n),r.status,JSON.stringify(r.json).slice(0,200)); }
for(const t of [1,2]) console.log('type',t,JSON.stringify((await list(t)).map(x=>x.name+'|'+x.code+'|'+x.id.slice(0,8))));
await s.close(); process.exit(0);
