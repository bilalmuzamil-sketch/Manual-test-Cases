import {sess} from './common.mjs';
const s=await sess({device:'iPhone 12 Pro'}); const p=s.page;
await s.go(`/workorders/${process.env.WO}/lines`); await p.waitForTimeout(3500);
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id')).filter(t=>/clock|task|line|start/i.test(t)).join(' ')));
console.log(await p.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>/start|stop|clock/i.test(e.innerText)).map(e=>`${e.innerText.trim()}|${e.getAttribute('data-test-id')}|${e.closest('[data-test-id]')?.getAttribute('data-test-id')}`).join('\n')));
await p.screenshot({path:'../ev/phone-lines.png'}); await s.close();
