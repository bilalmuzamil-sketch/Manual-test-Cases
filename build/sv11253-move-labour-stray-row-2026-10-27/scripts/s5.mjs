import {sess,st} from './lib.mjs'; import fs from 'fs';
const s=await sess(); const W=JSON.parse(fs.readFileSync('../data/wo1.json'));
await s.go(`/workorders/${W.wo}/lines`); await s.waitFor('button_add_labor_adjustment_'+W.lines[0]);
const b=await s.box('button_add_labor_adjustment_'+W.lines[0]); await s.page.mouse.click(b.x,b.y); await s.page.waitForTimeout(800);
console.log(await s.page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item, .q-menu [data-test-id]')].map(e=>(e.dataset.testId||'')+' :: '+e.innerText.trim().replace(/\n/g,' ')).join('\n')));
await s.page.screenshot({path:'/tmp/qa11685/w/l3.png'});
await s.browser.close(); process.exit(0);
