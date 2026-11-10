import {sess,arr} from './common.mjs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
const wps=arr((await s.api('/api/staff/my-workplaces')).json?.data); console.log(wps.map(w=>w.id.slice(0,8)+' '+w.name).join(' ; '));
const raw=(await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=5&showMyWorkOrders=0')); console.log(raw.status, JSON.stringify(raw.json).slice(0,400)); const l=[];
console.log(l.map(x=>[x.number||x.display_number,x.status,x.workplace_id?.slice(0,8),x.clockedInTechniciansCount].join(' ')).join('\n'));
await s.close(); process.exit(0);
