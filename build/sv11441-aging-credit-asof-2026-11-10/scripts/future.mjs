import {sess,arr} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/reports/ap-unpaid-invoices'); await s.page.waitForTimeout(3000); const B='/api/reporting/reports/'; const g=async u=>(await s.api(B+u)).json?.data; const R={};
const loc=d=>new Date(new Date(d).getTime()-6*3600e3).toISOString().slice(0,10); // America/Edmonton is UTC-6 all year from June 2026 (IANA 2026c)
const un=[]; for(let pg=1;pg<60;pg++){ const x=arr(await g(`ap-unpaid-invoices?asOfDate=2026-11-10&pagination[page]=${pg}&pagination[rowsPerPage]=100&pagination[sortBy]=date&pagination[descending]=false`)); un.push(...x); if(x.length<100) break; }
const bill=un.flatMap(v=>v.rows).find(r=>r.dueDate&&(new Date(r.dueDate)-new Date(r.date))>=11*864e5);
R.bill=[bill?.documentNumber,bill?.vendorName,bill?.date,bill?.dueDate];
const D=new Date(new Date(loc(bill.dueDate)+'T12:00:00Z').getTime()-10*864e5).toISOString().slice(0,10); R.asOf=D;
const un2=[]; for(let pg=1;pg<60;pg++){ const x=arr(await g(`ap-unpaid-invoices?asOfDate=${D}&pagination[page]=${pg}&pagination[rowsPerPage]=100&pagination[sortBy]=date&pagination[descending]=false`)); un2.push(...x); if(x.length<100) break; }
const r2=un2.flatMap(v=>v.rows).find(r=>r.documentId===bill.documentId); R.unpaid=[r2?.dueDate,r2?.daysPastDue];
let det=null; for(let pg=1;pg<200&&!det;pg++){ const x=arr(await g(`ap-aging-detail/buckets/current/rows?asOfDate=${D}&pagination[page]=${pg}&pagination[rowsPerPage]=100&pagination[sortBy]=vendor_name&pagination[descending]=false`)); det=x.find(r=>r.documentId===bill.documentId); if(x.length<100) break; }
R.detailCurrent=[det?.documentNumber,det?.daysPastDue];
console.log(JSON.stringify(R)); fs.writeFileSync('../ev/future-bill.json',JSON.stringify(R,null,1)); await s.close(); process.exit(0);
