import {sess,arr} from './common.mjs';
const s=await sess(); await s.go('/reports/ar-aging-detail'); await s.page.waitForTimeout(3000);
const c=arr((await s.api(`/api/reporting/reports/ar-aging-collection?asOfDate=2026-11-10&pagination[page]=1&pagination[rowsPerPage]=500`)).json?.data);
const d=c.flatMap(x=>(x.rows||[]).filter(r=>r.transactionType==='Deposit').map(r=>[x.name,r.documentNumber,r.date,r.daysPastDue,r.openBalanceCents,JSON.stringify(r.link)]));
console.log('customers',c.length,'deposit rows',d.length); console.log(d.slice(0,10).map(x=>x.join(' | ')).join('\n'));
await s.close(); process.exit(0);
