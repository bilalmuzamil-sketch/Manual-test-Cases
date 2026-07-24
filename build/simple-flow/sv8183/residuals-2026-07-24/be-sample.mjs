// be-sample.mjs — for each in-scope role: reassign qa_reassign, switch-user, hit key endpoints
// with empty/partial body. 403 = BE ENFORCED (blocked); 400/422 = PASSED (reached, not BE-enforced).
import fs from 'fs';
import { login, api, switchUser } from './lib.mjs';
const QA_STAFF='0ca87d16-c9bf-4387-825c-304ba37687b9';
const QA_UID='01221b93-47b1-497f-bf74-30601453a469';
const WP='4665d389-4824-47a8-8083-f70535a99d67';
const roles={
 'ServiceManager':'ca2b0818-29e8-48e5-960a-79dd8cc74c58',
 'SeniorServiceAdvisor':'b7e0b1eb-efb9-4afd-b517-26dd08a478e5',
 'Foreman':'a9328e5c-71a7-4190-8140-a0959b7e88ea',
 'TimeClock':'e35b0211-23e1-401e-bf45-ce8d1772bfa6',
};
const ADMIN='3f2a106c-1a4d-41e5-9533-a409a9480c41';
const RESOLVE_WO='bd159aeb-c7e4-4e81-98c1-004d321950ce';
const endpoints=[
 ['accept (receive)','POST','/api/inventory/orders/accept',{}],
 ['pre-resolve-cores','POST',`/api/work-orders/${RESOLVE_WO}/pre-resolve-cores`,{}],
 ['returns/create','POST','/api/inventory/returns/create',{}],
 ['part/make-request (add part)','POST','/api/work-orders/part/make-request',{}],
 ['parts/delete (cancel part)','POST','/api/work-orders/parts/delete',{}],
];
async function reassign(sess,roleId){
  return api(sess,'POST',`/api/staff/${QA_STAFF}/change`,{first_name:'QA',last_name:'Reassign mr6j7w8y',email:'qa_reassign_mr6j7w8y@yopmail.com',role_id:roleId,workplace_id:WP,job_title:null,salary_type:null,salary:null,billable:0,clockable:false,departments:['LocAtion/Shop Time (Shop hand)','QB Location/Shop Time (Shop hand)']});
}
const out={};
for (const [name,id] of Object.entries(roles)){
  let l = await login('admin');
  await reassign(l.sessCookie,id);
  l = await login('admin');
  const sw = await switchUser(l.sessCookie, QA_UID);
  const fe = await api(l.sessCookie,'GET','/api/auth/me/fe-permissions');
  const pc=(fe.body?.data?.fe_permissions||[]).length;
  const row={perms:pc};
  for (const [label,m,p,b] of endpoints){
    const r = await api(l.sessCookie,m,p,b);
    row[label]=r.status+(r.status===403?' ENFORCED':' passed');
  }
  out[name]=row;
  console.log(name,'perms',pc,JSON.stringify(row));
}
// restore qa_reassign to Admin
let l = await login('admin');
await reassign(l.sessCookie,ADMIN);
const chk = await login('admin'); const sw=await switchUser(chk.sessCookie,QA_UID);
const fe=await api(chk.sessCookie,'GET','/api/auth/me/fe-permissions');
console.log('RESTORE qa_reassign -> Admin, perms now', (fe.body?.data?.fe_permissions||[]).length);
fs.writeFileSync('evidence/be-sample-3roles.json', JSON.stringify(out,null,1));
