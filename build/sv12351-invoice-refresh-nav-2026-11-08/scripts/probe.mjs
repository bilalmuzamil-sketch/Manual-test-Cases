import {sess} from './common.mjs';
const s=await sess(); const p=s.page;
await s.go(`/workorders/${process.env.WO}/finance`); await p.waitForTimeout(4000);
console.log(p.url());
console.log(await p.evaluate(()=>[...document.querySelectorAll('input,textarea')].map(e=>`${e.getAttribute('aria-label')}|${e.name}|${e.getAttribute('data-test-id')}|${e.closest('[data-test-id]')?.getAttribute('data-test-id')}`).join('\n')));
console.log(await p.evaluate(()=>[...document.querySelectorAll('.q-tab')].map(e=>e.innerText.trim()+'|'+e.getAttribute('data-test-id')).join(' ; ')));
await p.screenshot({path:'../ev/probe-finance.png'}); await s.close();
