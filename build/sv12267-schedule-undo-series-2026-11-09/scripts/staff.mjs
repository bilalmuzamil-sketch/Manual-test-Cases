import {sess,arr,j} from './common.mjs';
const s=await sess(); const r=(await s.api('/api/staff?limit=200')).json; const L=arr(r?.data);
console.log(L.length, j(Object.keys(L[0]||{})));
for(const x of L.filter(x=>/tech/i.test(x.role_label||x.role||'')).slice(0,12)) console.log(x.id, x.user_id, x.first_name, x.last_name, x.role_label, x.active??x.is_active);
await s.close(); process.exit(0);
