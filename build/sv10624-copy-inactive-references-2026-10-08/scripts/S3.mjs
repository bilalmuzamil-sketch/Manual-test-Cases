import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:1}); await s.go('/accounting/sales/invoices'); const R=JSON.parse(fs.readFileSync('ids.json')); const B=JSON.parse(fs.readFileSync('new-bill.json'));
const api=(u,m,b)=>s.api(u,m?{method:m,headers:{'content-type':'application/json',accept:'application/json'},body:JSON.stringify(b||{})}:null);
const inv=(await api('/api/accounting/invoices/'+R.invoice)).json; const iv=inv.invoice||inv; console.log('invoice tax_code_id',iv.tax_code_id,'tax',iv.tax_total, 'lines',j((iv.lines||[]).map(l=>[l.description,l.location_id,l.location_name]),400)); console.log('show keys',Object.keys(inv).join(','));
const HD='01a1117a-5e2c-7172-8fb4-6ef37b8641e7', D=B.line_type_account_defaults;
let r=await api('/api/accounting/vendor-bills','POST',{vendor_id:R.vendor,bill_number:'ZZ10624-BILL-1',bill_date:'2026-10-08',memo:'ZZAUTOTEST SV-10624 source bill',tax_code_id:R.tax,tax_amount:3.5,lines:[{line_type:'operating_expense',description:'ZZ expense line (ZZ location)',quantity:1,unit_price:50,amount:50,account_id:D.operating_expense,location_id:R.location}]});
console.log('bill',r.status,j(r.json,400)); R.bill=r.json?.bill?.id||r.json?.vendor_bill?.id;
fs.writeFileSync('ids.json',JSON.stringify(R,null,1)); console.log(JSON.stringify(R));
await s.close();
