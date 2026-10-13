import {ob,J} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:1}); const env=JSON.parse(fs.readFileSync('env.json'));
const r=(await s.api('/api/organizations/'+env.org+'/roles')).json; const l=r.data?.collection||r.data||[]; const x=l.find(y=>y.name==='ZZAUTOTEST SV-10628 View part sales only');
const d=(await s.api('/api/roles/'+x.id)).json.data; console.log(x.id,'perms',d.fe_permissions.map(z=>z.name).join(','),'| toggles',J(d.cross_toggles),'| view',d.view_mode);
fs.writeFileSync('custom-role.json',JSON.stringify({id:x.id,name:x.name},null,1));
await s.close();
