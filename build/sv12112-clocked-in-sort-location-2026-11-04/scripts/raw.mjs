import {sess,arr} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync(`/tmp/sv12112/seed-branch.json`,'utf8')); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
for(const t of ['B','D']){ const w=S.W[t]; const j=(await s.api(`/api/technician-tasks/list?pagination[rowsPerPage]=100&pagination[page]=1&filters[0][field]=work_order&filters[0][value]=${w.id}&search=`)).json; console.log(t,w.id,JSON.stringify(j).slice(0,900)); }
const v=(await s.api('/api/work-orders/view/'+S.W.B.id)).json; console.log('B view',JSON.stringify(v).slice(0,300));
const l=(await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=50&search=S12112-17581&showMyWorkOrders=0')).json; console.log('B list',JSON.stringify(l).slice(0,600));
await s.close(); process.exit(0);
