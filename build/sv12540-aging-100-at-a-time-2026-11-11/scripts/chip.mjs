import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/reports/'+(process.env.REP||'ar-aging-collection')); await p.waitForTimeout(8000);
await s.glideClick(process.env.CHIP||'filter_chip_customerIds'); await p.waitForTimeout(2500);
await p.screenshot({path:'../ev/chip-open.png'});
console.log(await p.evaluate(()=>[...document.querySelectorAll('.q-menu,.q-dialog,[role=dialog],[role=listbox]')].map(m=>m.className.toString().slice(0,60)+' || '+m.innerText.replace(/\s+/g,' ').slice(0,300)+' || '+[...m.querySelectorAll('[data-test-id],input')].map(e=>e.getAttribute('data-test-id')||('input:'+e.placeholder)).slice(0,30).join(',')).join('\n')));
await s.close(); process.exit(0);
