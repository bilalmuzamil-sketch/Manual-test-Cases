import {ob,J} from './lib.mjs';
const s=await ob(); console.log('marker',J(await s.marker(),200)); console.log('url',s.page.url());
const r=await s.api('/api/organizations/settings'); console.log('settings',r.status, J(r.json?.data?.organizationId,60));
const w=await s.api('/api/staff/my-workplaces'); console.log('workplaces',w.status,J((w.json?.data||[]).map?.(x=>[x.name,x.id]),400));
await s.close();
