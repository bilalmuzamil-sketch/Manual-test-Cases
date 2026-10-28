// prints useful record ids per env
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'10928',cookies,dir:(process.env.QA_DIR||'/tmp/qa21'),user:'bilal.muzamil@shopview.com'});
const q=o=>new URLSearchParams(o).toString(); const out={};
const tryget=async(k,p,f)=>{ const r=await s.api(p); out[k]=r.status===200?f(r.json):('HTTP '+r.status+' '+JSON.stringify(r.json||r.text).slice(0,120)); };
await tryget('wo','/api/work-orders?'+q({'pagination[page]':1,'pagination[rowsPerPage]':50,'pagination[sortBy]':'companyName','pagination[descending]':false,search:'',showMyWorkOrders:0}),j=>j.data.work_orders.filter(w=>w.partRequestsCount>3&&w.linesCount>1).slice(0,3).map(w=>[w.id,w.number,w.status,w.companyName,w.partRequestsCount,w.unreceivedPartRequestsCount]));
await tryget('ps','/api/part-sales?'+q({'pagination[page]':1,'pagination[rowsPerPage]':20,'pagination[sortBy]':'companyName','pagination[descending]':false,search:''}),j=>JSON.stringify(j.data).slice(0,300));
await tryget('orders','/api/inventory/orders?limit=5',j=>JSON.stringify(j.data).slice(0,400));
await tryget('deliveries','/api/inventory/deliveries?limit=5',j=>JSON.stringify(j.data).slice(0,400));
await tryget('staff','/api/staff?limit=5',j=>JSON.stringify(j.data).slice(0,300));
await tryget('customers','/api/customers?limit=5',j=>JSON.stringify(j.data).slice(0,300));
console.log(JSON.stringify(out,null,1)); await s.close();
