import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'prod',dir:'/tmp/qa52',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim(),vp:{width:1440,height:900}});
const c=(await s.api('/api/customers?limit=300')).json.data; const rows=c.collection||c.customers||c;
const zz=(Array.isArray(rows)?rows:[]).filter(r=>/ZZAUTOTEST/i.test(r.name||r.company_name||''));
console.log('customers',Array.isArray(rows)?rows.length:JSON.stringify(c).slice(0,200),'zz',zz.length);
for(const r of zz.slice(0,25)){ const id=r.id||r.company_id; const v=(await s.api('/api/vehicles?company_id='+id)).json?.data; const vs=v?.collection||v?.vehicles||v||[]; if(Array.isArray(vs)&&vs.length){ console.log('PICK',id,'|',r.name||r.company_name,'| vehicle',vs[0].id); break; } }
await s.close(); process.exit(0);
