import {sess} from './common.mjs';
const s=await sess(); const p=s.page;
await s.go(`/workorders/${process.env.WO}/lines`); await p.waitForTimeout(2500);
await s.glideClick('button_add_part'); await p.waitForTimeout(2500);
await p.screenshot({path:'../ev/uicap3.png'});
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id')).filter(t=>!/^(item_|line_|link_)/.test(t)).slice(-60).join(' ')));
await s.close();
