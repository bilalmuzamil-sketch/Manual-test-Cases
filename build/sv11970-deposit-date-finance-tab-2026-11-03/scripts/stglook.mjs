import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const rs=f=>fs.readFileSync('/tmp/staging/'+f,'utf8').trim();
const s=await open({env:'staging',cookies:{sv_sso_session:rs('sso'),PHPSESSID:rs('phpsess'),cf_clearance:rs('cfc')},quick:'admin',dir:'/tmp/qa53',vp:{width:1440,height:900}});
console.log('marker',JSON.stringify(await s.marker()));
const wp=(await s.api('/api/workplaces')).json?.data?.collection||[]; const d=wp.find(w=>/DVI Test/i.test(w.name||'')); console.log('DVI',d?.id,d?.name,d?.timezone);
const c=(await s.api('/api/customers?limit=50&search=P2C%20DEP')).json?.data; const rows=c?.collection||c?.customers||c||[]; for(const r of (Array.isArray(rows)?rows:[])) console.log('CUST',r.id||r.company_id,r.name);
const w=(await s.api('/api/work-orders?search=S1-38222&limit=5')).json?.data; const ws=w?.collection||w?.work_orders||w||[]; for(const r of (Array.isArray(ws)?ws:[]).slice(0,3)) console.log('WO',r.id,r.display_number||r.number,r.status||r.status_value,r.workplace_id);
await s.close(); process.exit(0);
