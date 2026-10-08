import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:1}); await s.go('/accounting/sales/invoices'); const R=JSON.parse(fs.readFileSync('ids.json'));
const api=(u,m,b)=>s.api(u,m?{method:m,headers:{'content-type':'application/json',accept:'application/json'},body:JSON.stringify(b||{})}:null);
let r=await api('/api/accounting/customers/'+R.customer,'PUT',{name:'ZZAUTOTEST SV-10624 Customer',is_active:false}); console.log('customer',r.status,j(r.json?.customer?{is_active:r.json.customer.is_active}:r.json,200));
r=await api('/api/accounting/vendors/'+R.vendor,'PUT',{name:'ZZAUTOTEST SV-10624 Vendor',is_active:false}); console.log('vendor',r.status,j(r.json?.vendor?{is_active:r.json.vendor.is_active}:r.json,200));
r=await api('/api/accounting/tax-codes/'+R.tax,'DELETE'); console.log('tax',r.status,j(r.json,200));
r=await api('/api/workplaces/delete','POST',{workplace_id:R.workplace}); console.log('workplace delete',r.status,j(r.json,200));
for(let i=0;i<20;i++){ const l=(await api('/api/accounting/locations')).json; const hit=(l.locations||l.data||l).find?.(x=>x.id===R.location); if(hit&&hit.is_active===false){ console.log('location inactive after',i*10,'s'); break;} if(i===0) console.log('location now',j(hit,200)); await s.page.waitForTimeout(10000); }
const n=(await api('/api/accounting/invoices/new')).json; console.log('New-invoice pickers contain ZZ? customer',!!n.customers.find(c=>c.id===R.customer),'tax',!!n.tax_codes.find(t=>t.id===R.tax),'location',!!n.locations.find(t=>t.id===R.location));
await s.close();
