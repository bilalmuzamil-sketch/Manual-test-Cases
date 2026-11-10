// production BEFORE: today's credits on the current A/R Aging Collection and A/P Aging Detail (API the screens call + screenshots)
import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; const R={marker:await s.marker()}; fs.mkdirSync('../ev/prod',{recursive:true});
const A='2026-11-10T23:59:59.999Z';
await s.go('/reports/ar-aging-collection'); await p.waitForTimeout(7000);
const col=(await s.api(`/api/reporting/account-receivable/collections-report?pagination[page]=1&pagination[rowsPerPage]=500&pagination[sortBy]=&pagination[descending]=false&asOfDate=${A}`)).json?.data;
const flat=JSON.stringify(col); const i=flat.indexOf('CM-4410'); R.colCM=i>0?flat.slice(Math.max(0,i-400),i+250):'not found';
await p.screenshot({path:'../ev/prod/ar-collection.png'});
R.colRows=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].filter(r=>r.offsetParent&&/CM-4410|Alpha Freight ZZ96929/.test(r.innerText)).map(r=>{const b=r.getBoundingClientRect(); return [r.innerText.replace(/\s+/g,' '),Math.round(b.x),Math.round(b.y),Math.round(b.width),Math.round(b.height)];}));
const ap=(await s.api(`/api/reporting/account-payable/aging-detail-report?asOfDate=${A}`)).json?.data; R.apBuckets=Object.fromEntries(Object.entries(ap.buckets).map(([k,v])=>[k,(v.transactions||[]).filter(t=>/ZZMAGENTA/.test(t.vendorName)&&t.type!=='invoice'&&/2026-11-10/.test(t.date)).map(t=>[t.transactionNumber,t.type,t.date,t.dueDate,t.daysPastDue,t.openBalance])]).filter(([k,v])=>v.length));
await s.go('/reports/ap-aging-detail'); await p.waitForTimeout(8000); await p.screenshot({path:'../ev/prod/ap-detail.png'});
fs.writeFileSync('../ev/prod/before.json',JSON.stringify(R,null,1)); console.log(JSON.stringify(R,null,1).slice(0,3000)); await s.close(); process.exit(0);
