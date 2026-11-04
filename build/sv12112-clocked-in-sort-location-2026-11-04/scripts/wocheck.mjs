import {sess,arr} from './common.mjs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
const id=process.env.ID; const v=(await s.api('/api/work-orders/view/'+id)).json?.data; const w=v?.work_order||v; console.log('WO',w?.display_number,w?.workplace_id);
const l=arr((await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=50&pagination[sortBy]=clockedInTechnicians&pagination[descending]=true&search=S12112&showMyWorkOrders=0')).json?.data);
console.log('list desc:',l.map(x=>x.number+' ['+(x.clockedInTechnicians||[]).map(n=>n.firstName+' '+n.lastName).join(', ')+'] count '+x.clockedInTechniciansCount).join(' | '));
await s.close(); process.exit(0);
