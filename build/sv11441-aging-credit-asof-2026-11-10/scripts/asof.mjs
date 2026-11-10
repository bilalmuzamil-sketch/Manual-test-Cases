import {sess,arr} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/reports/ar-aging-summary'); await s.page.waitForTimeout(3000); const B='/api/reporting/reports/'; const R={};
const g=async u=>(await s.api(B+u)).json?.data;
const rows=async(rep,bucket,d,sort)=>{ let out=[]; for(let pg=1;pg<200;pg++){ const x=arr(await g(`${rep}/buckets/${bucket}/rows?asOfDate=${d}&pagination[page]=${pg}&pagination[rowsPerPage]=100&pagination[sortBy]=${sort}&pagination[descending]=false`)); out=out.concat(x); if(x.length<100) break; } return out; };
const find=async(rep,doc,d,sort)=>{ for(const b of ['current','days_1_to_30','days_31_to_60','days_61_to_90','days_91_plus']){ const r=(await rows(rep,b,d,sort)).find(x=>x.documentNumber===doc); if(r) return {asOf:d,bucket:b,pastDue:r.daysPastDue,due:r.dueDate,type:r.transactionType}; } return {asOf:d,notFound:true}; };
// earlier As of: A/R credit memo CM11315-3841 (Jul 23 2026), A/P vendor credit C-13662 (Aug 31 2026)
R.arEarlier=[await find('ar-aging-detail','CM11315-3841','2026-07-23','customer_name'),await find('ar-aging-detail','CM11315-3841','2026-07-24','customer_name')];
R.apEarlier=[await find('ap-aging-detail','C-13662','2026-08-31','vendor_name'),await find('ap-aging-detail','C-13662','2026-09-01','vendor_name')];
// bills: Abadi bill 5956 due 2026-05-05 -> as of due day, day after, 10 days before
R.bill=[await find('ap-aging-detail','5956','2026-05-05','vendor_name'),await find('ap-aging-detail','5956','2026-05-06','vendor_name'),await find('ap-aging-detail','5956','2026-04-25','vendor_name')];
// A/P Unpaid: vendor credits C-13665 / C-13666
const un=[]; for(let pg=1;pg<60;pg++){ const x=arr(await g(`ap-unpaid-invoices?asOfDate=2026-11-10&pagination[page]=${pg}&pagination[rowsPerPage]=100&pagination[sortBy]=date&pagination[descending]=false`)); un.push(...x); if(x.length<100) break; }
R.unpaidVendors=un.length; const ab=un.find(v=>/Abadi/.test(v.name)); R.unpaidAbadi=ab?.rows?.map(r=>[r.transactionType,r.documentNumber,r.dueDate,r.daysPastDue]);
// Summary = Detail, as of today, Past due Any
for(const [sum,det] of [['ar-aging-summary','ar-aging-detail'],['ap-aging-summary','ap-aging-detail']]){ const st=(await g(`${sum}?asOfDate=2026-11-10&pagination[page]=1&pagination[rowsPerPage]=1`))?.totals; const dg=(await g(`${det}?asOfDate=2026-11-10`))?.groups;
  const m={current:'currentCents',days_1_to_30:'days1To30Cents',days_31_to_60:'days31To60Cents',days_61_to_90:'days61To90Cents',days_91_plus:'days91PlusCents'}; R['parity_'+sum]=dg.map(x=>[x.bucket,st[m[x.bucket]],x.openBalanceCents,st[m[x.bucket]]===x.openBalanceCents]); }
// all rows of A/R Collection (all pages) + A/P Unpaid at today for the calendar-day check
const col=[]; for(let pg=1;pg<60;pg++){ const x=arr(await g(`ar-aging-collection?asOfDate=2026-11-10&pagination[page]=${pg}&pagination[rowsPerPage]=100&pagination[sortBy]=date&pagination[descending]=false`)); col.push(...x); if(x.length<100) break; }
R.calrows={ar:col.flatMap(c=>c.rows.map(r=>[r.documentNumber,r.locationName,r.dueDate,r.daysPastDue])),ap:un.flatMap(v=>v.rows.map(r=>[r.documentNumber,r.locationName,r.dueDate,r.daysPastDue]))};
const wps=arr((await s.api('/api/staff/my-workplaces')).json?.data); R.tz=Object.fromEntries(wps.map(w=>[w.name,w.timezone]));
fs.writeFileSync('../ev/asof-checks.json',JSON.stringify(R,null,1)); const {calrows,...rest}=R; console.log(JSON.stringify(rest,null,0).slice(0,3500)); console.log('calrows',calrows.ar.length,calrows.ap.length);
await s.close(); process.exit(0);
