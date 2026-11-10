import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; await s.go('/reports/ap-aging-detail'); await p.waitForTimeout(4000);
const opts=await p.evaluate(()=>0); 
await p.click('[data-test-id="filter_chip_pastDue"]'); await p.waitForTimeout(1500);
console.log('pastDue options',await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="filter_option_pastDue_"]')].map(x=>x.getAttribute('data-test-id'))));
await p.keyboard.press('Escape');
const base=s.host.api+'/api/reporting/reports/';
const cases=(process.env.CASES||'').split('|');
const out=[];
for(const q of cases){ const t0=Date.now();
  const r=await p.evaluate(async u=>{ try{const r=await fetch(u,{credentials:'include'}); const t=await r.text(); return {st:r.status,ct:r.headers.get('content-type'),len:t.length,head:t.slice(0,220)};}catch(e){return {err:String(e)}} },base+q);
  const rec={q,secs:Math.round((Date.now()-t0)/1000),...r}; if(rec.ct&&rec.ct.includes('pdf')) rec.head='(pdf)'; out.push(rec); console.log(JSON.stringify(rec)); }
fs.writeFileSync('../ev/pdf500-recheck/sizes-'+(process.env.TAG||'x')+'.json',JSON.stringify(out,null,1));
await s.close(); process.exit(0);
