import {session,toView} from './rec.mjs';
const s=await session({vp:{width:1440,height:900},dpr:1}); const p=s.page;
await s.go('/workorders?tab=all&search='+encodeURIComponent('ZZAUTOTEST F2 Tech Pin Order')); await p.waitForTimeout(4500); await toView(p,'list'); await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>{const tbl=document.querySelector('.q-table__container'); const ths=[...tbl.querySelectorAll('thead th')].map(t=>t.innerText.replace(/arrow_drop_(up|down)/,'').trim()); return [...tbl.querySelectorAll('tbody tr')].map(r=>{const td=r.querySelectorAll(':scope > td'); return td[ths.indexOf('Number')]?.innerText.trim()+' -> '+td[ths.indexOf('Lead Technician')]?.innerText.trim();}).join(' | ');}));
await toView(p,'tech_view'); await s.close();
