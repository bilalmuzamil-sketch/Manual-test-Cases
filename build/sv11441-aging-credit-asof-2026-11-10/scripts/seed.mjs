import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/reports/ar-aging-detail'); await s.page.waitForTimeout(3000); const P=(u,b)=>post(s,u,b); const R={};
const CUST='4255e024-938c-4514-83d9-95f1a0a7f324', VEND='98c705a1-ba42-42c1-b291-303deb797d3b';
let r=await P('/api/credit-memos',{customer_account_id:CUST,amount:12.34}); R.cm=[r.status,JSON.stringify(r.json).slice(0,300)];
const wos=arr((await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=50&showMyWorkOrders=0&search='+encodeURIComponent("Andrews'"))).json?.data?.work_orders);
R.wos=wos.slice(0,8).map(w=>[w.number||w.display_number,w.status,w.company_id===CUST,w.workplace_id?.slice(0,8)].join(' '));
const wo=wos.find(w=>/approved|in_progress|estimate|review/i.test(w.status||'')&&(w.company_id===CUST||true));
if(wo){ r=await P('/api/deposits',{work_order_id:wo.id,amount:5.67,payment_method:'CASH',deposit_date:new Date().toISOString().slice(0,10),memo:'ZZAUTOTEST SV-11441 today'}); R.dep=[wo.number||wo.display_number,r.status,JSON.stringify(r.json).slice(0,300)]; }
r=await P('/api/parts-catalogue/vendor/credit/create',{vendorId:VEND,amount:7.89,memo:'ZZAUTOTEST SV-11441 today'}); R.vc=[r.status,JSON.stringify(r.json).slice(0,300)];
console.log(JSON.stringify(R,null,1)); fs.writeFileSync('../ev/seed.json',JSON.stringify(R,null,1)); await s.close(); process.exit(0);
