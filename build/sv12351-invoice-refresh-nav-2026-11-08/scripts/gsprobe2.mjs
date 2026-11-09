import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/workorders/c33308ec-695e-4676-a37c-21fa3f486b54/lines'); await p.waitForTimeout(2500); await s.go('/workorders/38e33787-e746-4f53-ac6d-6a6f31d3062e/lines'); await p.waitForTimeout(2500);
await s.glideClick('global_search_trigger'); await p.waitForTimeout(2000);
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0&&/search|recent/i.test(e.getAttribute('data-test-id'))).map(e=>e.getAttribute('data-test-id')+'|'+e.innerText.replace(/\s+/g,' ').slice(0,80)).join('\n')));
await p.screenshot({path:'../ev/gs-probe2.png'}); await s.close();
