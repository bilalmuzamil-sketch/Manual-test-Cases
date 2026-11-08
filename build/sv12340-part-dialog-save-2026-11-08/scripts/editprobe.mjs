import {sess} from './common.mjs';
const s=await sess(); const p=s.page;
await s.go(`/workorders/${process.env.WO}/lines`); await p.waitForTimeout(3000);
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/part/i.test(t)&&!/inline/.test(t)).slice(0,30).join(' ')));
await s.close();
