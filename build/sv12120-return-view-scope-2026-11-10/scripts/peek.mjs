import {sess} from './common.mjs';
const s=await sess(); const p=s.page;
console.log('marker',JSON.stringify(await s.marker()));
const j=async u=>{const r=await s.api(u); return r;};
const me=await s.api('/api/auth/me'); console.log('me',JSON.stringify(me).slice(0,400));
const r=await s.api('/api/inventory/returns?limit=5'); console.log('returns',JSON.stringify(r).slice(0,600));
await s.close(); process.exit(0);
