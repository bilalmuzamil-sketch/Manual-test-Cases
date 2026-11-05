import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1200);
const roles=(await s.api('/api/organizations/d55bc308-e61a-438d-b5f1-c7a73c89d49f/roles')).json?.data; const L=Array.isArray(roles)?roles:(roles?.collection||[]);
for(const r of L){ const d=(await s.api('/api/roles/'+r.id)).json?.data; const codes=(d.fe_permissions||[]).map(x=>x.code||x); console.log(r.name.padEnd(24),'SFD',d.cross_toggles?.seeFinancialData,'|',codes.filter(c=>/order|receiv|inventory|parts/i.test(c)).join(',')); }
const st=(await s.api('/api/staff?limit=200')).json?.data; const SL=Array.isArray(st)?st:(st?.collection||[]); fs.writeFileSync('/tmp/sv11006/staff.json',JSON.stringify(SL,null,1)); const t=SL.find(x=>x.email==='tech@shopview.com'); console.log('tech',JSON.stringify(t).slice(0,300));
await s.close(); process.exit(0);
