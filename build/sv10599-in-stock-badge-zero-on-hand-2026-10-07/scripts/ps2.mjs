import {ob,j} from './lib.mjs'; import fs from 'fs';
const {id}=JSON.parse(fs.readFileSync('ps.json')); const s=await ob({dpr:2}); const p=s.page;
await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(1500);
if(!(await s.box('select_part'))){ const b=await s.box('button_add_part'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1200); }
const add=async(pn,last)=>{ let b=await s.box('select_part'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(500); await p.keyboard.type(pn,{delay:60}); await p.waitForTimeout(2500);
  const o=await p.evaluate(pn=>{const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>x.innerText.includes(pn)&&/Inventory/.test(x.innerText));const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText.replace(/\n+/g,' | ')};},pn); console.log('opt',o.t); await p.mouse.click(o.x,o.y); await p.waitForTimeout(1800);
  const bins=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="input_bin_quantity_"]')].map(e=>e.getAttribute('data-test-id'))); console.log('bins',j(bins));
  if(bins.length){const l=p.locator(`[data-test-id="${bins[0]}"]`); const tag=await l.evaluate(e=>e.tagName); await (tag==='INPUT'?l:l.locator('input')).fill('1'); await p.waitForTimeout(500);}
  b=await s.box(last?'button_workorder_part_save':'button_workorder_part_save_add_part'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(3000); };
await add('401-10B',false); await add('84-2005',true);
let b=await s.box('button_part_sale_action_authorized'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(3000);
const d=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(e=>e.innerText.replace(/\n+/g,' | ').slice(0,300))); console.log('dialog',j(d));
console.log('writes',s.writes.filter(w=>!/envelope|quick-login|touch/.test(w)).map(w=>w.slice(0,170)).join('\n'));
await s.close();
