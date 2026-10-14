import {ob,J} from './lib.mjs';
const s=await ob(); console.log('marker',J(await s.marker(),200));
console.log('me',J((await s.api('/api/auth/me')).json?.data,200));
const w=await s.api('/api/staff/my-workplaces'); console.log('wps',J((w.json?.data?.collection||w.json?.data||[]).map(x=>[x.id,x.name,x.timezone]),500));
const cl=await s.api('/api/canned-lines?limit=5'); console.log('canned',cl.status,J(cl.json?.data,300));
const cat=await s.api('/api/parts-catalogue/categories'); console.log('cats',cat.status,J(cat.json?.data,300));
const v=await s.api('/api/vendors?limit=5'); console.log('vendors',v.status,J(v.json?.data,300));
const os=await s.api('/api/organizations/settings'); const st=os.json?.data; console.log('settings keys',J(Object.keys(st?.settings||st||{}),600));
await s.close();
