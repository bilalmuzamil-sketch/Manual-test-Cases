import {api} from './boot.mjs';
const r=await api('GET','/api/customers/list-options?search=ZZAUTOTEST');
console.log('list-options ZZAUTOTEST ->',r.status, JSON.stringify(r.body).slice(0,400));
const r2=await api('GET','/api/customers?search=ZZAUTOTEST&limit=20');
const b=JSON.stringify(r2.body);
console.log('customers search ->',r2.status,'contains ZZAUTOTEST:', b.includes('ZZAUTOTEST'));
