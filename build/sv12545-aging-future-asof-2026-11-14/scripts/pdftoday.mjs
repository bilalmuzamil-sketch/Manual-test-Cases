import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess({dir:'/tmp/qa83'}); const p=s.page; await s.go('/reports/ar-aging-summary'); await p.waitForTimeout(3000);
const u=s.host.api+'/api/reporting/reports/ar-aging-summary/export?asOfDate=2026-11-14&timezone=Asia%2FKarachi&pagination[page]=1&pagination[rowsPerPage]=30&pagination[sortBy]=customer_name&pagination[descending]=false&format=pdf';
const r=await p.evaluate(async u=>{const r=await fetch(u,{credentials:'include'}); const a=new Uint8Array(await r.arrayBuffer()); let s=''; for(let i=0;i<a.length;i++) s+=String.fromCharCode(a[i]); return {st:r.status,b:btoa(s)}},u);
fs.writeFileSync('../ev/side-arsum-today-all.pdf',Buffer.from(r.b,'base64')); console.log(r.st); await s.close(); process.exit(0);
