import {sess} from './common.mjs';
const s=await sess({dir:'/tmp/qa75'}); const p=s.page;
for(const r of ['ap-unpaid-invoices','ap-aging-detail','ar-aging-detail']){ await s.go('/reports/'+r+'?asOfDate=2026-11-11'); await p.waitForTimeout(9000);
 const g=await p.evaluate(()=>[...document.querySelectorAll('tr')].map(t=>t.innerText.replace(/\s+/g,' ').trim()).filter(t=>/arrow_right/.test(t)).slice(0,25)); console.log(r,JSON.stringify(g).slice(0,1500)); }
await s.close(); process.exit(0);
