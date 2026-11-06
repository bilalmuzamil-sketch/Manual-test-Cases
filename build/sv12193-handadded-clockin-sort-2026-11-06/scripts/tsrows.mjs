import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/reports/punch-clock-activities'); await p.waitForTimeout(8000);
const rows=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].filter(r=>/S12193/.test(r.innerText)).map(r=>({t:r.innerText.replace(/\s+/g,' ').slice(0,200),ids:[...r.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id'))})));
console.log(JSON.stringify(rows,null,1).slice(0,3000));
const r0=p.locator('tbody tr',{hasText:'S12193-17580'}).first(); if(await r0.count()){ await r0.hover(); await p.waitForTimeout(800); console.log('hover ids',JSON.stringify(await r0.evaluate(r=>[...r.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')+(e.disabled?'(disabled)':''))))); }
await p.screenshot({path:'../ev/ts-activities-rows.png'});
await s.close(); process.exit(0);
