import {sess} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync('/tmp/sv12193/seed-branch.json','utf8')); const s=await sess(); const p=s.page;
await s.go('/workorders/'+S.W.W2.id+'/timesheets'); await p.waitForTimeout(8000);
const rows=await p.evaluate(()=>[...document.querySelectorAll('tbody tr, .q-item')].filter(r=>/Active|Stephenson|Wilcox/.test(r.innerText)).map(r=>({t:r.innerText.replace(/\s+/g,' ').slice(0,140),ids:[...r.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id'))})));
const r0=p.locator('tbody tr',{hasText:'Wilcox'}).first(); if(await r0.count()){ await r0.hover(); await p.waitForTimeout(700); rows.push({hover:await r0.evaluate(r=>[...r.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))}); }
console.log(JSON.stringify(rows,null,1).slice(0,1800)); await p.screenshot({path:'../ev/wo-timesheets-page.png'}); await s.close(); process.exit(0);
