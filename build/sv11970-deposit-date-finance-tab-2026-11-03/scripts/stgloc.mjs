import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const rs=f=>fs.readFileSync('/tmp/staging/'+f,'utf8').trim();
const s=await open({env:'staging',cookies:{sv_sso_session:rs('sso'),PHPSESSID:rs('phpsess'),cf_clearance:rs('cfc')},quick:'admin',dir:'/tmp/qa53',vp:{width:1440,height:900}});
const wp=(await s.api('/api/workplaces')).json?.data?.collection||[]; for(const w of wp) console.log('WP',w.id,'|',w.name,'|',w.timezone);
const my=(await s.api('/api/staff/my-workplaces')).json?.data; console.log('MY',JSON.stringify(my).slice(0,600));
const v=(await s.api('/api/vehicles?company_id=a63836b3-ae77-4bb9-8f13-3784e0e22212')).json?.data; const vs=v?.collection||v?.vehicles||v||[]; console.log('VEH',(Array.isArray(vs)?vs:[]).length);
await s.close(); process.exit(0);
