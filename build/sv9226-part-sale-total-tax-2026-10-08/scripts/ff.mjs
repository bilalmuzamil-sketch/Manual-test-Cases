// node ff.mjs snapshot | off <Name> | restore
import {ob,j} from './lib.mjs'; import fs from 'fs';
const [mode,name]=process.argv.slice(2); const s=await ob(); const ORG='d55bc308-e61a-438d-b5f1-c7a73c89d49f';
const cur=async()=>(await s.api('/api/organization/feature-flags?organization_id='+ORG)).json.data.features;
const set=async ids=>s.api('/api/organization/feature-flags',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({organization_id:ORG,feature_flag_ids:ids})});
const c=await cur();
if(mode==='snapshot'){ fs.writeFileSync('flags-before.json',JSON.stringify(c,null,1)); console.log('saved',c.map(x=>x.name).join(',')); }
if(mode==='off'){ const ids=c.filter(x=>x.name!==name).map(x=>x.featureFlagId); const r=await set(ids); console.log('off',name,r.status,(await cur()).map(x=>x.name).join(',')); }
if(mode==='restore'){ const b=JSON.parse(fs.readFileSync('flags-before.json')); const r=await set(b.map(x=>x.featureFlagId)); const now=await cur(); console.log('restore',r.status,'equal',JSON.stringify(now.map(x=>x.featureFlagId).sort())===JSON.stringify(b.map(x=>x.featureFlagId).sort()),now.map(x=>x.name).join(',')); }
await s.close();
