import {sess,j} from './common.mjs';
const s=await sess();
let r=await s.api('/api/staff?limit=400'); const d=r.json?.data; console.log('staffkeys',Object.keys(d||{}).join(','), Array.isArray(d)?d.length:'');
const arr=Array.isArray(d)?d:(d?.collection||d?.staff||d?.items||[]); const me=arr.find(x=>/admin@shopview\.com/.test(JSON.stringify(x))); console.log('me',String(JSON.stringify(me)).slice(0,600));
r=await s.api('/api/work-orders/lines/b94d839f-0d91-4fdd-bf00-26fdd3d557ac'); console.log('lines',JSON.stringify(r.json).slice(0,700));
await s.close(); process.exit(0);
