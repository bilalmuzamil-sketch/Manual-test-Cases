import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/reports/punch-clock-activities'); await p.waitForTimeout(8000);
console.log('buttons',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent).map(b=>b.innerText.replace(/\s+/g,' ').trim().slice(0,30)+'|'+(b.getAttribute('data-test-id')||'')))));
const add=p.locator('[data-test-id="button_new_timesheet"]').first(); console.log('add count',await add.count());
if(await add.count()){ await add.click(); await p.waitForTimeout(2500); console.log('dialog',await p.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?d.innerText.replace(/\n+/g,' | ').slice(0,600):null;})); const lab=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog .q-field__label, .q-dialog label')].map(e=>e.innerText.trim())); console.log('labels',JSON.stringify(lab)); console.log('fields',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id'))))); }
await p.screenshot({path:'ev/timesheet-add-probe.png'}); await s.close(); process.exit(0);
