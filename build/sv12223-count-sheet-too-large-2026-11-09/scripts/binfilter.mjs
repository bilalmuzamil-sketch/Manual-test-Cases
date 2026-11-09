import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/parts/inventory'); await p.waitForTimeout(3500);
await p.click('[data-test-id="filter_chip_gridLocation"]'); await p.waitForTimeout(1500);
const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id]')].map(e=>e.getAttribute('data-test-id')+' | '+e.innerText.replace(/\s+/g,' ').slice(0,60)).filter(t=>/nassign|none|search|apply|done/i.test(t)));
console.log(opts.join('\n')); await p.screenshot({path:'../ev/binfilter-menu.png'}); await s.browser.close();
