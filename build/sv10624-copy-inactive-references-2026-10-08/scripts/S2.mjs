import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:1}); await s.go('/accounting/sales/invoices'); const R=JSON.parse(fs.readFileSync('ids.json')); const N=JSON.parse(fs.readFileSync('new-invoice.json'));
const api=(u,m,b)=>s.api(u,m?{method:m,headers:{'content-type':'application/json',accept:'application/json'},body:JSON.stringify(b||{})}:null);
const HD='01a1117a-5e2c-7172-8fb4-6ef37b8641e7', D=N.line_type_account_defaults;
let r=await api('/api/accounting/invoices','POST',{customer_id:R.customer,invoice_date:'2026-10-08',location_id:R.location,memo:'ZZAUTOTEST SV-10624 source invoice',tax_code_id:R.tax,lines:[{line_type:'labor',description:'ZZ labor line (Heavy Duty)',quantity:1,unit_price:100,amount:100,account_id:D.labor,location_id:HD},{line_type:'parts',description:'ZZ parts line (ZZ location)',quantity:2,unit_price:25,amount:50,account_id:D.parts,location_id:R.location}]});
console.log('invoice',r.status,j(r.json,500)); R.invoice=r.json?.invoice?.id; R.invoice_no=r.json?.invoice?.invoice_number;
const bn=await api('/api/accounting/vendor-bills/new'); fs.writeFileSync('new-bill.json',JSON.stringify(bn.json,null,1)); console.log('bills/new',bn.status,Object.keys(bn.json||{}).join(','), j(bn.json?.line_types,300));
fs.writeFileSync('ids.json',JSON.stringify(R,null,1));
await s.close();
