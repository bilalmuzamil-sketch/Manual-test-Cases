// prints session location, vendors (first few), part categories, and the prod WO from SV-12039
import {sess,arr} from './common.mjs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
const me=(await s.api('/api/auth/me')).json?.data; console.log('me keys',Object.keys(me||{}).slice(0,30).join(','));
const ws=arr((await s.api('/api/staff/my-workplaces')).json?.data); console.log('workplaces',ws.map(w=>w.id.slice(0,8)+':'+w.name).join(' | '));
const v=(await s.api('/api/vendors')); console.log('vendors',v.status,JSON.stringify(v.json).slice(0,400));
const c=(await s.api('/api/inventory/categories?limit=500')); console.log('cats',c.status,JSON.stringify(c.json).slice(0,300));
await s.close(); process.exit(0);
