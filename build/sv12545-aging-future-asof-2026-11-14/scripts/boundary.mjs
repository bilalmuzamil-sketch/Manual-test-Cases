import {sess,get} from './common.mjs'; import fs from 'fs';
const s=await sess({tz:'America/Edmonton'}); const p=s.page; await s.go('/reports/ar-aging-summary'); await p.waitForTimeout(3000);
const csv=async(rep,d,tz)=>{ const u=s.host.api+`/api/reporting/reports/${rep}/export?asOfDate=${d}&timezone=${encodeURIComponent(tz)}&pagination[page]=1&pagination[rowsPerPage]=30&pagination[sortBy]=${rep[1]==='r'?'customer_name':'vendor_name'}&pagination[descending]=false&format=csv`;
  return p.evaluate(async u=>(await fetch(u,{credentials:'include'})).text(),u); };
for(const rep of ['ar-aging-detail','ap-aging-detail']){ const a=await csv(rep,'2026-11-14','America/Edmonton'), b=await csv(rep,'2026-11-15','America/Edmonton');
  fs.writeFileSync(`../ev/bnd-${rep}-1114.csv`,a); fs.writeFileSync(`../ev/bnd-${rep}-1115.csv`,b);
  const sa=new Set(a.split('\n').slice(4).map(l=>l.split(',').slice(1,6).join(','))); const extra=b.split('\n').slice(4).filter(l=>!sa.has(l.split(',').slice(1,6).join(',')));
  console.log(rep,'first line 11/14:',a.split('\n')[0],'| in 11/15 not 11/14:'); extra.slice(0,12).forEach(l=>console.log('   ',l.slice(0,200))); }
await s.close(); process.exit(0);
