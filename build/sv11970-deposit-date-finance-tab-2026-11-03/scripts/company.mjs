// usage: [ENV=branch] node company.mjs   -> first customer (ZZAUTOTEST preferred) that has a vehicle
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'prod'; const rd=f=>fs.readFileSync('/tmp/sv11970/'+f,'utf8').trim();
const s=ENV==='prod'? await open({env:'prod',dir:'/tmp/qa52',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim(),vp:{width:1440,height:900}})
 : await open({env:'branch',ticket:'11970',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:'admin',dir:'/tmp/qa51',vp:{width:1440,height:900}});
const c=(await s.api('/api/customers?limit=300')).json.data; const rows=(c.collection||c.customers||c); const list=Array.isArray(rows)?rows:[];
list.sort((a,b)=>(/ZZAUTOTEST/i.test(b.name||'')?1:0)-(/ZZAUTOTEST/i.test(a.name||'')?1:0));
console.log('customers',list.length);
for(const r of list.slice(0,40)){ const id=r.id||r.company_id; const v=(await s.api('/api/vehicles?company_id='+id)).json?.data; const vs=v?.collection||v?.vehicles||v||[]; if(Array.isArray(vs)&&vs.length){ console.log('PICK',id,'|',r.name,'| vehicle',vs[0].id); break; } }
await s.close(); process.exit(0);
