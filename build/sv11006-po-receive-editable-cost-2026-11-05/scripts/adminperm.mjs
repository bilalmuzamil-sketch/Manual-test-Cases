import {sess} from './common.mjs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1500);
const roles=(await s.api('/api/organizations/d55bc308-e61a-438d-b5f1-c7a73c89d49f/roles')).json?.data; const L=Array.isArray(roles)?roles:(roles?.collection||[]); const admin=L.find(r=>/^admin/i.test(r.name));
const fp=(await s.api('/api/roles/'+admin.id)).json?.data?.fe_permissions||[]; const codes=fp.map(x=>x.code||x);
console.log('admin',admin.name,'perms',codes.length,'has woReceivedLater',codes.includes('woReceivedLater')); await s.close(); process.exit(0);
