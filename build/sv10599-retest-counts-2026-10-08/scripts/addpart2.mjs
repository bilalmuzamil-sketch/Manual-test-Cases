// node addpart.mjs <label> <partNumber> <qty> <shotprefix>   -- inline Add Part row on the line
import {ob,j} from './lib.mjs'; import fs from 'fs';
const [label,pn,qty,pre]=process.argv.slice(2); const {wo}=JSON.parse(fs.readFileSync(`wo-${label}.json`));
const s=await ob({dpr:2}); const p=s.page; await s.go(`/workorders/${wo}/lines`);
let b=await s.box('button_add_part'); const IDX=Number(process.env.IDX||0); if(IDX){ b=await p.evaluate(i=>{const e=[...document.querySelectorAll('[data-test-id="button_add_part"]')][i]; e.scrollIntoView({block:'center'}); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};},IDX); } await p.mouse.click(b.x,b.y); await s.waitFor('select_inline_part_number');
b=await s.box('select_inline_part_number'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(500); await p.keyboard.type(pn,{delay:60}); await p.waitForTimeout(2800);
const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>{const r=e.getBoundingClientRect();return {t:e.innerText.trim().replace(/\n+/g,' | ').slice(0,200),x:r.x+r.width/2,y:r.y+r.height/2,g:[r.x,r.y,r.width,r.height].map(Math.round)};}));
console.log('opts',j(opts.map(o=>o.t),900)); await s.shot(pre+'-picker','shots'); fs.writeFileSync(`shots/${pre}-picker.json`,JSON.stringify(opts));
const o=opts.find(x=>x.t.includes(pn))||opts[0]; await p.mouse.click(o.x,o.y); await p.waitForTimeout(1800);
const row=await p.evaluate(()=>{const r=document.querySelector('[data-test-id="inline_part_row"]');return r?r.innerText.replace(/\n+/g,' | ').slice(0,400):null;}); console.log('row',row);
const q=p.locator('[data-test-id="input_inline_part_quantity"]'); const tag=await q.evaluate(e=>e.tagName); await (tag==='INPUT'?q:q.locator('input')).fill(qty); await p.waitForTimeout(600);
await s.shot(pre+'-row','shots');
b=await s.box('button_save_inline_part'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(3500);
const err=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.trim())); console.log('toasts',j(err));
console.log('writes',s.writes.filter(w=>!/envelope|quick-login|touch/.test(w)).map(w=>w.slice(0,260)).join('\n'));
await s.close();
