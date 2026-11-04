import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const rs=f=>fs.readFileSync('/tmp/staging/'+f,'utf8').trim();
const s=await open({env:'staging',cookies:{sv_sso_session:rs('sso'),PHPSESSID:rs('phpsess'),cf_clearance:rs('cfc')},quick:'admin',dir:'/tmp/qa53',vp:{width:1440,height:900}});
const {setLoc}=await import('./loc.mjs'); await setLoc(s,'DVI Test');
const l=(await s.api('/api/customer-deposits/list?accountId=44685592-d66b-4260-8a21-0a60ba29a0f3')).json?.data?.collection||[];
const d=l.find(x=>x.creditNumber==='DEP-4823'); console.log('WO',d?.workOrderId,d?.workOrderNumber);
const w=(await s.api('/api/work-orders/view/'+d?.workOrderId)).json?.data; const wo=w?.work_order||w; console.log('STATE',wo?.display_number,wo?.status,wo?.invoice_status,wo?.workplace_id);
await s.close(); process.exit(0);
