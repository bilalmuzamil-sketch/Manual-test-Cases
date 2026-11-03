import {prod1} from '../common.mjs'; const s=await prod1('/tmp/qa75');
const f=(await s.api('/api/auth/me/fe-permissions')).json?.data; console.log((f?.fe_permissions||[]).join(','));
const st=(await s.api('/api/staff?limit=300')).json?.data; const all=st?.collection||st||[]; const me=(Array.isArray(all)?all:[]).filter(x=>/bilal\.muzamil@shopview\.com/i.test(x.email||'')); console.log('ME',JSON.stringify(me.map(x=>[x.id,x.role_label||x.role,x.role_id])));
await s.close(); process.exit(0);
