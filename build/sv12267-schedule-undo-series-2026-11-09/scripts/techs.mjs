import {sess,arr} from './common.mjs'; const s=await sess();
const L=arr((await s.api('/api/staff?limit=200')).json?.data).filter(x=>/tech/i.test(x.role_label||'')&&x.is_active&&x.workplace_id?.startsWith('b3c8'));
console.log(L.map(x=>x.first_name+' '+x.last_name).join(' | ')); await s.close(); process.exit(0);
