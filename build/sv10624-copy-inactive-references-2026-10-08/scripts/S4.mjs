import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:1,vp:{width:1600,height:1000}}); const p=s.page; await s.go('/accounting/sales/invoices'); const R=JSON.parse(fs.readFileSync('ids.json')); const N=JSON.parse(fs.readFileSync('new-invoice.json'));
const api=(u,m,b)=>s.api(u,m?{method:m,headers:{'content-type':'application/json',accept:'application/json'},body:JSON.stringify(b||{})}:null);
const HD='01a1117a-5e2c-7172-8fb4-6ef37b8641e7', D=N.line_type_account_defaults;
let r=await api('/api/accounting/invoices','POST',{customer_id:R.customer,invoice_date:'2026-10-08',location_id:R.location,memo:'ZZAUTOTEST SV-10624 source invoice (taxed)',tax_code_id:R.tax,tax_amount:10.5,lines:[{line_type:'labor',description:'ZZ labor line (Heavy Duty)',quantity:1,unit_price:100,amount:100,account_id:D.labor,location_id:HD},{line_type:'parts',description:'ZZ parts line (ZZ location)',quantity:2,unit_price:25,amount:50,account_id:D.parts,location_id:R.location}]});
console.log('invoice2',r.status,j(r.json,400),r.json?.invoice?.invoice_number,r.json?.invoice?.tax_total,r.json?.invoice?.total); R.invoice2=r.json?.invoice?.id; R.invoice2_no=r.json?.invoice?.invoice_number; fs.writeFileSync('ids.json',JSON.stringify(R,null,1));
await s.go('/accounting/sales/invoices/'+(R.invoice2||R.invoice)); await p.waitForTimeout(3500);
console.log('detail ids',await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(v=>/copy|action|button/i.test(v)).filter((v,i,a)=>a.indexOf(v)===i).join(' ')));
await s.close();
