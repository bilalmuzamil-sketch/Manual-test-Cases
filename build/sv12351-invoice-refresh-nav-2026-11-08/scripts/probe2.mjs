import {sess} from './common.mjs';
const s=await sess(); const p=s.page;
await s.go(`/workorders/${process.env.WO}/lines`); await p.waitForTimeout(2000);
const t=await p.evaluate(()=>{const e=document.querySelector('[data-test-id="link_finance_tab"]'); return e?{cls:e.className,dis:e.getAttribute('aria-disabled'),tag:e.tagName,href:e.getAttribute('href')}:null});
console.log(JSON.stringify(t));
await s.glideClick('link_finance_tab'); await p.waitForTimeout(4000); console.log(p.url());
console.log(await p.evaluate(()=>[...document.querySelectorAll('input')].map(e=>e.getAttribute('aria-label')).join(' | ')));
console.log(await p.evaluate(()=>[...document.querySelectorAll('.q-notification,.q-dialog')].map(e=>e.innerText.replace(/\s+/g,' ')).join(' || ')));
await p.screenshot({path:'../ev/probe-after-finance-click.png'}); await s.close();
