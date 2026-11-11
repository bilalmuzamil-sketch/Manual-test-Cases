// open one group by its filter, then repeatedly bring the LAST document row into view and count rows each time
import {sess} from './common.mjs'; import fs from 'fs';
const REP=process.env.REP||'ap-unpaid-invoices', NAME=process.env.NAME||'Apex Truck & Trailer Repair', KEY=REP.startsWith('ar')?'customerIds':'vendorIds', TAG=process.env.TAG||'apex';
const s=await sess(); const p=s.page; let reqs=0; p.on('request',r=>{ if(/\/api\/reports/.test(r.url())) reqs++; });
await s.go('/reports/'+REP); await p.waitForTimeout(8000);
await s.glideClick('filter_chip_'+KEY); await p.waitForTimeout(1500);
await s.glideClick('filter_search_'+KEY); await p.keyboard.type(NAME.slice(0,12),{delay:40}); await p.waitForTimeout(3000);
const opt=await p.evaluate(([n,K])=>{const e=[...document.querySelectorAll(`[data-test-id^="filter_option_${K}_"]`)].find(x=>x.innerText.trim()===n||x.innerText.trim().startsWith(n)); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}},[NAME,KEY]);
await p.mouse.click(opt.x,opt.y); await p.waitForTimeout(1200); await p.keyboard.press('Escape'); await p.waitForTimeout(5000);
const tg=await p.evaluate(n=>{const tr=[...document.querySelectorAll('tr')].find(r=>r.innerText.includes(n)); const b=tr.querySelector('[data-test-id*="_toggle_"]'); const r=b.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,head:tr.innerText.replace(/\s+/g,' ').slice(0,90)}},NAME);
console.log('group',tg.head); const r0=reqs; await p.mouse.click(tg.x,tg.y); await p.waitForTimeout(5000);
const docs=()=>p.evaluate(()=>{ const d=[...document.querySelectorAll('tbody tr')].filter(r=>/^\w{3} \d{1,2}, \d{4}/.test(r.innerText.trim())); return {n:d.length,last:d.length?d[d.length-1].innerText.replace(/\s+/g,' ').slice(0,70):''}; });
const out=[]; let c=await docs(); out.push({step:'opened',...c,reqs:reqs-r0}); console.log('opened:',JSON.stringify(c),'report requests since open:',reqs-r0);
await p.screenshot({path:`../ev/${TAG}-0-opened.png`});
for(let i=1;i<=6;i++){ await p.evaluate(()=>{ const d=[...document.querySelectorAll('tbody tr')].filter(r=>/^\w{3} \d{1,2}, \d{4}/.test(r.innerText.trim())); d[d.length-1].scrollIntoView({block:'end'}); });
  await p.waitForTimeout(2500); c=await docs(); out.push({step:'scroll '+i,...c,reqs:reqs-r0}); console.log(`after bringing the last row into view ${i}:`,JSON.stringify(c),'reqs:',reqs-r0);
  if(i<=3) await p.screenshot({path:`../ev/${TAG}-${i}-scroll.png`}); }
fs.writeFileSync(`../ev/${TAG}-steps.json`,JSON.stringify({marker:await s.marker(),group:tg.head,out},null,1)); await s.close(); process.exit(0);
