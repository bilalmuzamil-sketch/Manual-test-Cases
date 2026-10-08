import {ob,j} from './lib.mjs'; import fs from 'fs';
const {id}=JSON.parse(fs.readFileSync('x.json')); const s=await ob({vp:{width:1600,height:1000}}); const p=s.page;
await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(3000);
let b=await s.box('button_part_sale_nav_bar_menu'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(900);
b=await s.box('menu_item_add_parts_sale_adjustment'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1800);
console.log('DLG',(await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText||'')).replace(/\n+/g,' | ').slice(0,900));
console.log(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')+':'+e.tagName).join(' ')));
await p.screenshot({path:'/tmp/qa9226/fee-dialog.png'});
await s.close();
