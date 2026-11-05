import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; const gets=[]; p.on('response',async r=>{ try{ if(r.request().method()==='GET'&&/\/api\//.test(r.url())){ const t=await r.text(); if(/permission/i.test(r.url())||/"code"/.test(t)) gets.push([r.url().replace(/^https:\/\/[^/]+/,''),t]); } }catch(e){} });
const roles=(await s.api('/api/organizations/d55bc308-e61a-438d-b5f1-c7a73c89d49f/roles')).json?.data; const L=Array.isArray(roles)?roles:(roles?.collection||[]); const admin=L.find(r=>/^admin/i.test(r.name));
await s.go('/administration/roles-permissions/'+admin.id+'/edit'); await p.waitForTimeout(4000);
for(const [u,t] of gets){ console.log(u,t.length,'later:',(t.match(/[^"]{0,40}[Ll]ater[^"]{0,40}/g)||[]).slice(0,5)); }
fs.writeFileSync('/tmp/sv11006/perm-gets.json',JSON.stringify(gets)); await s.close(); process.exit(0);
