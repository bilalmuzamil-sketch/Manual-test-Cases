import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:1}); await s.go('/accounting/sales/invoices'); const R=JSON.parse(fs.readFileSync('ids.json')); const N=JSON.parse(fs.readFileSync('new-invoice.json'));
const api=(u,m,b)=>s.api(u,m?{method:m,headers:{'content-type':'application/json',accept:'application/json'},body:JSON.stringify(b||{})}:null);
const gst=N.tax_codes.find(t=>t.name==='GST');
let r=await api('/api/accounting/tax-codes/'+R.tax,'PUT',{name:'ZZAUTOTEST SV-10624 Tax',rate:0.07,account_id:gst.account_id}); console.log('tax map',r.status,j(r.json,300));
const HD='01a1117a-5e2c-7172-8fb4-6ef37b8641e7', D=N.line_type_account_defaults;
r=await api('/api/accounting/invoices','POST',{customer_id:R.customer,invoice_date:'2026-10-08',location_id:R.location,memo:'ZZAUTOTEST SV-10624 source invoice (taxed)',tax_code_id:R.tax,tax_amount:10.5,lines:[{line_type:'labor',description:'ZZ labor line (Heavy Duty)',quantity:1,unit_price:100,amount:100,account_id:D.labor,location_id:HD},{line_type:'parts',description:'ZZ parts line (ZZ location)',quantity:2,unit_price:25,amount:50,account_id:D.parts,location_id:R.location}]});
console.log('invoice2',r.status,r.json?.invoice?.invoice_number,r.json?.invoice?.tax_total,r.json?.invoice?.total,r.status>299?j(r.json,300):''); R.invoice2=r.json?.invoice?.id; R.invoice2_no=r.json?.invoice?.invoice_number; fs.writeFileSync('ids.json',JSON.stringify(R,null,1));
await s.close();
