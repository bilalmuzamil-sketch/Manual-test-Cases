import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/reports/punch-clock-activities'); await p.waitForTimeout(7000); await p.click('[data-test-id="button_new_timesheet"]'); await p.waitForTimeout(2000);
await p.click('[data-test-id="select_timesheet_staff"]'); await p.waitForTimeout(2000);
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').slice(0,40)))));
await p.keyboard.type('Wil',{delay:80}); await p.waitForTimeout(2500); console.log('typed Wil',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').slice(0,40)))));
await s.close(); process.exit(0);
