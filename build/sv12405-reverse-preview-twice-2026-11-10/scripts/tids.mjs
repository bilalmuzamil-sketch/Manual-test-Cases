import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go(`/workorders/${process.env.WO}/lines`); await p.waitForTimeout(2500); await s.glideClick('link_finance_tab'); await p.waitForTimeout(7000);
console.log(await p.evaluate(()=>[...document.querySelectorAll('button,[data-test-id]')].filter(e=>/Create Invoice/i.test(e.innerText||'')).map(e=>e.tagName+' '+(e.getAttribute('data-test-id')||'-')+' '+(e.closest('[data-test-id]')?.getAttribute('data-test-id')||'')).join(' | ')));
await s.close(); process.exit(0);
