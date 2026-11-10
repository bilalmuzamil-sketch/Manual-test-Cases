import {sess,arr} from './common.mjs';
const s=await sess(); await s.go('/reports/ap-aging-detail'); await s.page.waitForTimeout(3000); const D=process.env.ASOF||'2026-11-10'; const B='/api/reporting/reports/';
const g=(await s.api(`${B}ap-aging-detail?asOfDate=${D}`)).json?.data; console.log('groups',JSON.stringify(g?.groups?.map(x=>[x.bucket,x.rowsNumber,x.openBalanceCents])));
const cur=arr((await s.api(`${B}ap-aging-detail/buckets/current/rows?asOfDate=${D}&pagination[page]=1&pagination[rowsPerPage]=100&pagination[sortBy]=vendor_name&pagination[descending]=false`)).json?.data);
console.log('current rows',cur.length, JSON.stringify(cur.slice(0,5).map(r=>[r.transactionType,r.documentNumber,r.vendorName,r.date,r.dueDate,r.daysPastDue,r.openBalanceCents])));
await s.close(); process.exit(0);
