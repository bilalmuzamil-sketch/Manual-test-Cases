import {ob,j} from './lib.mjs';
const s=await ob(); const p=s.page;
const f=await s.api('/api/organization/feature-flags?organization_id=d55bc308-e61a-438d-b5f1-c7a73c89d49f'); console.log('org flags',(f.json.data.features||[]).map(x=>x.name).join(','));
for(const path of ['/api/feature-flags','/api/admin/feature-flags','/api/organization/feature-flags/all']){const r=await s.api(path); console.log(path,r.status,j(r.json||r.text,400));}
await s.go('/administration/feature-flags'); await p.waitForTimeout(2000); console.log('ff page:',(await p.evaluate(()=>document.querySelector('.q-page')?.innerText||document.body.innerText)).slice(0,600));
await s.go('/administration/open-api'); await p.waitForTimeout(2000); console.log('openapi page:',p.url(),(await p.evaluate(()=>document.querySelector('.q-page')?.innerText||'')).slice(0,300));
await s.close();
