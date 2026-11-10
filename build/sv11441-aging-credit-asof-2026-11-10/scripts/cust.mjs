import {sess,arr} from './common.mjs';
const s=await sess(); await s.go('/reports/ar-aging-detail'); await s.page.waitForTimeout(3000); const D=process.env.ASOF||'2026-11-10';
const c=arr((await s.api(`/api/reporting/reports/ar-aging-collection?asOfDate=${D}&pagination[page]=1&pagination[rowsPerPage]=200`)).json?.data);
const a=c.find(x=>/Andrews/.test(x.name)); console.log('collection Andrews',JSON.stringify(a?.rows?.map(r=>[r.transactionType,r.documentNumber,r.date,r.dueDate,r.daysPastDue,r.openBalanceCents])));
const sm=arr((await s.api(`/api/reporting/reports/ar-aging-summary?asOfDate=${D}&pagination[page]=1&pagination[rowsPerPage]=200`)).json?.data).find(x=>/Andrews/.test(x.customerName)); console.log('summary Andrews',JSON.stringify(sm));
const cms=(await s.api('/api/credit-memos?customer_account_id=4255e024-938c-4514-83d9-95f1a0a7f324')); console.log('cm list',cms.status,JSON.stringify(cms.json).slice(0,300));
await s.close(); process.exit(0);
