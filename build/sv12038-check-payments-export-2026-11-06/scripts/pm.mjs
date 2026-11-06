import {sess,arr} from './common.mjs';
const s=await sess();
for(const u of ['/api/customer-account/payment-methods','/api/payment-methods','/api/organizations/payment-methods']){ const r=await s.api(u); console.log(u, JSON.stringify(r).slice(0,1500)); }
await s.close();
