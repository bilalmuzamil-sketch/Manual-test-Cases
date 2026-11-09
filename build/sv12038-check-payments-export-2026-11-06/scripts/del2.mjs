import {sess,post} from './common.mjs'; const s=await sess();
const L=(await s.api('/api/organizations/finance/payment-methods?pagination[page]=1&pagination[rowsPerPage]=200&type=1')).json?.data?.collection||[];
for(const x of L.filter(x=>x.code==='PAYROLL__DEDUCTION')){ for(const b of [{id:x.id},{payment_method_id:x.id},{paymentMethodId:x.id}]){ const r=await post(s,'/api/organizations/finance/payment-methods/delete',b); console.log(JSON.stringify(b).slice(0,30),r.status,JSON.stringify(r.json).slice(0,120)); if(r.status<300)break; } }
const L2=(await s.api('/api/organizations/finance/payment-methods?pagination[page]=1&pagination[rowsPerPage]=200&type=1')).json?.data?.collection||[];
console.log(L2.map(x=>x.name+'='+x.code).join(' | ')); await s.close(); process.exit(0);
