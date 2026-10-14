import {op,J} from './lib.mjs';
const s=await op(); const p=s.page;
console.log('marker',J(await s.marker(),150));
const st=(await s.api('/api/organizations/settings')).json.data; console.log('settings',J(Object.fromEntries(Object.entries(st).filter(([k])=>/require/i.test(k))),300));
await (await import('./lib.mjs')).post(s,'/api/iam/change-location',{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'});
const r=await s.api('/api/work-orders/canned-lines?limit=200'); const L=r.json.data.collection;
console.log('canned',J(L.filter(x=>x.total_parts===0&&(x.fixed_price||x.fixed_line_total)).slice(0,4).map(x=>[x.id,x.canned_line_name,x.fixed_price,x.workplace_id]),600));
await s.close();
