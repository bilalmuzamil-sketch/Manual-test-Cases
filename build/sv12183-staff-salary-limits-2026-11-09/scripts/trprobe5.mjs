import {sess,j} from './common.mjs';
const s=await sess();
let r=await s.api('/api/staff?pagination[rowsPerPage]=500&search=ShopView'); const arr=r.json?.data?.collection||[];
const m=arr.filter(x=>/admin@shopview|ShopView/.test(x.email+x.last_name)); console.log('me',j(m.map(x=>({n:x.first_name+' '+x.last_name,e:x.email,id:x.id,salary:x.salary,t:x.salary_type,clock:x.clockable,bill:x.billable,keys:Object.keys(x).join(' ')})))); console.log('n',arr.length, j(arr.map(x=>({n:x.first_name+' '+x.last_name,e:x.email,id:x.id,salary:x.salary,t:x.salary_type,clock:x.clockable,bill:x.billable}))).slice(0,900));
r=await s.api('/api/work-orders/lines/b94d839f-0d91-4fdd-bf00-26fdd3d557ac'); console.log(j((r.json?.data?.collection||[]).map(l=>({id:l.line_id,st:l.status||l.line_status,name:l.line_name,tasks:(l.tasks||[]).map(t=>t.id)}))));
await s.close(); process.exit(0);
