import {sess} from './common.mjs';
const s=await sess(); await s.go('/reports/ar-aging-detail'); await s.page.waitForTimeout(4000);
const B='/api/reporting/reports/';
for(const u of ['ar-aging-detail?asOfDate=2026-11-10','ar-aging-collection?asOfDate=2026-11-10&pagination[page]=1&pagination[rowsPerPage]=3','ap-aging-detail?asOfDate=2026-11-10','ap-unpaid-invoices?asOfDate=2026-11-10&pagination[page]=1&pagination[rowsPerPage]=3','ar-aging-summary?asOfDate=2026-11-10&pagination[page]=1&pagination[rowsPerPage]=2']){ const r=await s.api(B+u); console.log('==',u,r.status, JSON.stringify(r.json).slice(0,900)); }
await s.close(); process.exit(0);
