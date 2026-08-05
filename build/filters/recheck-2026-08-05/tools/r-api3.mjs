import {api} from './boot.mjs';
import fs from 'fs';
const R=JSON.parse(fs.readFileSync('/tmp/frc/obs/r-api.json','utf8'));
const P='pagination[rowsPerPage]=30&pagination[page]=1&pagination[sortBy]=vehicle&pagination[descending]=false';
const cust='54d98c61-217d-44ad-89bb-79005c902fff'; // Lastone Construction
R._custId=cust; R._custName='Lastone Construction';
async function q(name,qs){
  const r=await api('GET','/api/work-orders?'+qs);
  const wo=(r.body&&r.body.data&&r.body.data.work_orders)||[];
  R[name]={status:r.status,info:{n:wo.length,statuses:[...new Set(wo.map(w=>w.status))],customers:[...new Set(wo.map(w=>(w.company&&w.company.name)||w.companyName))]}};
  console.log(name,r.status,wo.length,JSON.stringify(R[name].info.statuses),JSON.stringify(R[name].info.customers));
}
await q('A01_status_customer',`${P}&filters[0][field]=status&filters[0][value]=paid&filters[1][field]=company_id&filters[1][value]=${cust}`);
await q('A02_multi_status_or',`${P}&filters[0][field]=status&filters[0][value]=estimate&filters[1][field]=company_id&filters[1][value]=${cust}`);
await q('A02b_two_statuses',`${P}&filters[0][field]=status&filters[0][value]=estimate&filters[1][field]=status&filters[1][value]=paid&filters[2][field]=company_id&filters[2][value]=${cust}`);
await q('A05_nomatch',`${P}&filters[0][field]=status&filters[0][value]=declined&filters[1][field]=company_id&filters[1][value]=${cust}`);
fs.writeFileSync('/tmp/frc/obs/r-api.json',JSON.stringify(R,null,1));
