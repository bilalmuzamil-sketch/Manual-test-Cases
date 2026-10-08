import {ob,j} from './lib.mjs';
const s=await ob(); const d=(await s.api('/api/roles/224da903-6f11-4c79-98f2-d1bd3c4ea892')).json?.data; console.log(j(d,1500));
await s.close();
