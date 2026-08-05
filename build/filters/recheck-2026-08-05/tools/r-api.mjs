// FLT-API re-check on d00239b. Reproduces the exact 13 probes of o-api.json.
import {api} from './boot.mjs';
import fs from 'fs';
const R={build:'v3.4.2-d00239b',when:new Date().toISOString()};
const S=n=>{fs.writeFileSync('/tmp/frc/obs/r-api.json',JSON.stringify(R,null,1));console.log('..'+n);};
const P='pagination[rowsPerPage]=30&pagination[page]=1&pagination[sortBy]=vehicle&pagination[descending]=false';
async function q(name,qs){
  const r=await api('GET','/api/work-orders?'+qs);
  const wo=(r.body&&r.body.data&&r.body.data.work_orders)||[];
  R[name]={status:r.status,info:{n:wo.length,statuses:[...new Set(wo.map(w=>w.status))],customers:[...new Set(wo.map(w=>(w.company&&w.company.name)||w.companyName))]}};
  if(r.status>=400) R[name].err=JSON.stringify(r.body).slice(0,240);
  S(name);
}
const LAST='0016e2c6-6ad6-4b44-ad2a-f55cf138dff9';
// discover Lastone Construction's id so the probes are comparable
{ const r=await api('GET','/api/customers/list-options?search=Lastone');
  const opts=(r.body&&r.body.data)||[]; R._lastone=JSON.stringify(opts).slice(0,300); }
const cust=(()=>{try{const o=JSON.parse(R._lastone);const a=Array.isArray(o)?o:(o.items||o.customers||[]);const m=a.find(x=>/Lastone/i.test(x.name||x.label||''));return m&&(m.id||m.value);}catch{return null}})();
R._custId=cust;
await q('A01_status_customer',`${P}&filters[0][field]=status&filters[0][value]=paid&filters[1][field]=company_id&filters[1][value]=${cust}`);
await q('A02_multi_status_or',`${P}&filters[0][field]=status&filters[0][value]=estimate&filters[1][field]=company_id&filters[1][value]=${cust}`);
await q('A03_unknown_uuid',`${P}&filters[0][field]=company_id&filters[0][value]=00000000-0000-4000-8000-000000000000`);
await q('A03_nonuuid',`${P}&filters[0][field]=company_id&filters[0][value]=not-a-uuid`);
await q('A04_bad_field',`${P}&filters[0][field]=zzz_not_a_field&filters[0][value]=1`);
await q('A04_bad_status',`${P}&filters[0][field]=status&filters[0][value]=zzznotastatus`);
await q('A04_scrambled',`${P}&filters[0][zzz]=status&filters[0][value]=paid`);
await q('A04_array_type',`${P}&filters[0][field]=status&filters[0][value][]=paid`);
await q('A05_nomatch',`${P}&filters[0][field]=status&filters[0][value]=declined&filters[1][field]=company_id&filters[1][value]=${cust}`);
await q('A05_vehiclehere_bad',`${P}&filters[0][field]=vehicleHere&filters[0][value]=banana`);
for(const [k,path] of [['P_get','/api/users/me/preferences/work-orders-list'],['P_neverSavedKey','/api/users/me/preferences/zz-never-saved-key'],['P_badKey','/api/users/me/preferences/']]){
  const r=await api('GET',path);
  R[k]={status:r.status,body:(typeof r.body==='string'?r.body:JSON.stringify(r.body)).slice(0,420)}; S(k);
}
S('done');
