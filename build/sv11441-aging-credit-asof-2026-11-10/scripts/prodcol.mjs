import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; const R={}; await s.go('/reports/ar-aging-collection'); await p.waitForTimeout(7000);
const col=(await s.api('/api/reporting/account-receivable/collections-report?pagination[page]=1&pagination[rowsPerPage]=500&pagination[sortBy]=&pagination[descending]=false&asOfDate=2026-11-10T23:59:59.999Z')).json?.data;
const fl=JSON.stringify(col); const i=fl.indexOf('-12.34'); R.json=fl.slice(Math.max(0,i-600),i+200);
const row=p.locator('tbody tr',{hasText:'Alpha Freight ZZ96929'}).first(); await row.scrollIntoViewIfNeeded(); const bb=await row.boundingBox(); await p.mouse.click(bb.x+20,bb.y+bb.height/2); await p.waitForTimeout(3000);
await row.scrollIntoViewIfNeeded(); await p.screenshot({path:'../ev/prod/ar-collection-alpha.png'});
R.rows=await p.evaluate(()=>{const rs=[...document.querySelectorAll('tbody tr')].filter(r=>r.offsetParent); const k=rs.findIndex(r=>/Alpha Freight ZZ96929/.test(r.innerText)); return rs.slice(k,k+3).map(r=>{const b=r.getBoundingClientRect(); return [r.innerText.replace(/\s+/g,' '),Math.round(b.x),Math.round(b.y),Math.round(b.width),Math.round(b.height)];});});
R.heads=await p.evaluate(()=>[...document.querySelectorAll('thead th')].map(t=>{const b=t.getBoundingClientRect(); return [t.innerText.trim(),Math.round(b.x),Math.round(b.width)];}));
fs.writeFileSync('../ev/prod/collection-alpha.json',JSON.stringify(R,null,1)); console.log(JSON.stringify(R,null,1).slice(0,2500)); await s.close(); process.exit(0);
