import {sess} from './common.mjs'; const s=await sess(); const p=s.page; const WO=process.env.WO;
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(2000); await s.glideClick('link_finance_tab'); await p.waitForTimeout(5000);
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0&&r.y<300}).map(e=>e.getAttribute('data-test-id')+(e.innerText?'='+e.innerText.replace(/\s+/g,' ').slice(0,30):'')).join(' | ')));
await s.close();
