import {prod1} from '../common.mjs'; const s=await prod1('/tmp/qa75');
const f=(await s.api('/api/auth/me/fe-permissions')).json?.data; console.log('view_mode',f?.view_mode,'n',f?.fe_permissions?.length); console.log('portal-ish',(f?.fe_permissions||[]).filter(x=>/portal|send|approval|customer/i.test(x)).join(','));
const me=(await s.api('/api/auth/me')).json?.data; console.log('ME',JSON.stringify({role:me?.role_label||me?.role?.name||me?.role_name,roleId:me?.role_id||me?.role?.id}).slice(0,300));
const st=(await s.api('/api/organizations/settings')).json?.data; console.log('SETTINGS portal keys',JSON.stringify(Object.fromEntries(Object.entries(st||{}).filter(([k])=>/portal|approval/i.test(k)))).slice(0,600));
for(const u of ['/api/customer-portal/payment-settings','/api/customer-portal/settings']){ const r=await s.api(u); console.log(u,r.status,JSON.stringify(r.json||r.text).slice(0,300)); }
await s.close(); process.exit(0);
