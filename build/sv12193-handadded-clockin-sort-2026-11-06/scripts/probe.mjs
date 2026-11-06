import {sess,arr} from './common.mjs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(5000);
console.log('marker',JSON.stringify(await s.marker()));
const me=(await s.api('/api/auth/me')).json?.data; console.log('me',me?.email,me?.staff_id, me?.workplace_id||'');
const wps=arr((await s.api('/api/staff/my-workplaces')).json?.data); console.log('wps',wps.map(w=>w.name+'|'+w.id.slice(0,8)+'|'+w.timezone).join(' ; '));
const l=arr((await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=8&pagination[sortBy]=clockedInTechnicians&pagination[descending]=true&showMyWorkOrders=0')).json?.data);
console.log('top by clocked in', l.map(x=>x.number+':'+x.clockedInTechniciansCount+':'+(x.clockedInTechnicians||[]).map(n=>n.firstName).join('/')).join('  '));
await s.close(); process.exit(0);
