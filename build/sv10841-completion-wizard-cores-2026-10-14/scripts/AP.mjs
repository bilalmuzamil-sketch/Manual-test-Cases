import {ob,J,post} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const v=process.argv[2]==='on'; const s=await ob(); await loc(s);
const st=(await s.api('/api/organizations/settings')).json?.data; fs.writeFileSync('settings-before-'+Date.now()+'.json',JSON.stringify(st));
console.log('before autoPick',st.autoPickInventoryParts);
const r=await post(s,'/api/organizations/settings/change',{...st,autoPickInventoryParts:v}); console.log('change',r.status,J(r.json,300));
const st2=(await s.api('/api/organizations/settings')).json?.data; const diff=Object.keys(st2).filter(k=>JSON.stringify(st2[k])!==JSON.stringify(st[k])); console.log('after autoPick',st2.autoPickInventoryParts,'changed keys',J(diff));
await s.close();
