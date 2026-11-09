import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/workorders'); await p.waitForTimeout(2500);
await s.glideClick('global_search_trigger'); await p.waitForTimeout(1000); await p.keyboard.type('S2-16273',{delay:60}); await p.waitForTimeout(3000);
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0&&/search|result|option/i.test(e.getAttribute('data-test-id'))).map(e=>e.getAttribute('data-test-id')+'|'+e.innerText.replace(/\s+/g,' ').slice(0,60)).join('\n')));
await p.screenshot({path:'../ev/gs-probe.png'}); await s.close();
