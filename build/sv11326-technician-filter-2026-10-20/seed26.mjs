import {session} from './rec.mjs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:1});
let r=await s.api('/api/work-orders/lines/3ce4a515-8265-4f78-b4e0-c0e35d840b9e/technicians',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({staffIds:['c57d19d7-dc2b-4472-a11d-984c61b01c0e']})}); console.log('put techs',r.status,JSON.stringify(r.json).slice(0,200));
r=await s.api('/api/work-orders/view/47aa6c32-219b-4dc1-8421-4e2ff08d59a6'); const w=r.json.data.work_order; console.log(w.display_number,w.status,'lead',w.tech_assigned_id);
r=await s.api('/api/work-orders/lines/47aa6c32-219b-4dc1-8421-4e2ff08d59a6'); console.log(JSON.stringify((r.json.data.collection[0].tasks||[]).map(t=>[t.first_name,t.tech_assigned_id])));
await s.close();
