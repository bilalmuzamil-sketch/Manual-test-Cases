import {sess} from './common.mjs';
const s=await sess(); const p=s.page; const WO=process.env.WO;
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(2500); await s.glideClick('link_finance_tab'); await p.waitForTimeout(7000);
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>{const r=e.getBoundingClientRect(); return r.y<110&&r.y>60&&r.x>700;}).map(e=>{const r=e.getBoundingClientRect(); return e.getAttribute('data-test-id')+'@'+Math.round(r.x)+'x'+Math.round(r.width);}).join(' ')));
await p.screenshot({path:'../ev/dbg-3.png'}); await s.close(); process.exit(0);
