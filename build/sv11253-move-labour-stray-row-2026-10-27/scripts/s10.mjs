import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess(); const W=JSON.parse(fs.readFileSync('../data/wo1.json')); const B=W.lines[1];
await s.go(`/workorders/${W.wo}/lines`); await s.waitFor('line_number_'+B);
let b=await s.box('line_number_'+B); await s.page.mouse.click(b.x+250,b.y,{button:'right'}); await s.page.waitForTimeout(900);
b=await s.box('menu-item_edit_labor'); await s.page.mouse.click(b.x,b.y); await s.waitFor('select_technician');
b=await s.box('select_technician'); await s.page.mouse.click(b.x,b.y); await s.page.waitForTimeout(1200);
const opts=await s.page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim().replace(/\n/g,' ')));
console.log(opts.length, opts.join(' | '));
await s.browser.close(); process.exit(0);
