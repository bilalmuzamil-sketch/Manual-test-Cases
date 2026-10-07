import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob(); const org=fs.readFileSync('org.txt','utf8').trim();
const ids=JSON.parse(fs.readFileSync('ff-before.json')).data.features.map(f=>f.featureFlagId).filter(x=>x!=='990e383e-fb9d-465c-9aab-d33487ca8bbb');
const r=await s.api('/api/organization/feature-flags',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({organization_id:org,feature_flag_ids:ids})});
console.log('post',r.status,j(r.json,120));
const f=await s.api('/api/organization/feature-flags?organization_id='+org); console.log('now',(f.json?.data?.features||[]).map(x=>x.name).join(','));
await s.close();
