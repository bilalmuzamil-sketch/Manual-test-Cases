import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess(); const W=JSON.parse(fs.readFileSync('../data/wo1.json')); const A=W.lines[0];
await s.go(`/workorders/${W.wo}/lines`); await s.waitFor('line_checkbox_'+A);
let b=await s.box('line_checkbox_'+A); await s.page.mouse.click(b.x,b.y); await s.page.waitForTimeout(800);
b=await s.box('button_bulk_more'); await s.page.mouse.click(b.x,b.y); await s.page.waitForTimeout(800);
console.log(await s.page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.dataset.testId||'')+' :: '+e.innerText.trim().replace(/\n/g,' ')).join('\n')));
await s.page.screenshot({path:'/tmp/qa11685/w/l7.png'});
await s.browser.close(); process.exit(0);
