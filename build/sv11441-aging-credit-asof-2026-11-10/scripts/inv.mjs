import {sess,post,arr} from './common.mjs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000); const WO=process.env.WO;
await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
const st=await s.api('/api/work-orders/view/'+WO); const w=st.json?.data?.work_order||st.json?.data; console.log('wo',w?.number||w?.display_number,w?.status,w?.total_price||w?.totalPrice);
const r=await post(s,'/api/invoices/create',{work_order_id:WO}); console.log('invoice',r.status,JSON.stringify(r.json).slice(0,300));
await s.close(); process.exit(0);
