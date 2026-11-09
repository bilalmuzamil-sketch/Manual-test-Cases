import {sess} from './common.mjs'; const s=await sess(); const p=s.page; const WO=process.env.WO;
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(3000);
const t=await p.evaluate(()=>{const e=document.querySelector('[data-test-id="link_finance_tab"]'); return e?{cls:e.className.slice(0,80),dis:e.getAttribute('aria-disabled')}:null}); console.log('finance tab',JSON.stringify(t));
await s.glideClick('button_work_order_nav_bar_menu'); await p.waitForTimeout(1200);
console.log(await p.evaluate(()=>[...document.querySelectorAll('.q-menu')].map(d=>d.innerText.replace(/\s+/g,' ')+' || '+[...d.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).join(',')).join(' ## ')));
await s.close();
