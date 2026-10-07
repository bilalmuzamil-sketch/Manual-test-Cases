// usage: node addline.mjs <label> <canned text> <approved:0|1>  -> adds a line through the New Line dialog
import {ob,j} from './lib.mjs'; import fs from 'fs';
const [label,txt,appr]=[process.argv[2],process.argv[3]||'Battery service',process.argv[4]==='1'];
const {wo}=JSON.parse(fs.readFileSync(`wo-${label}.json`));
const s=await ob(); const p=s.page;
await s.go(`/workorders/${wo}/lines`);
const st0=await p.evaluate(()=>document.querySelector('[data-test-id="badge_wo_status"]')?.innerText.trim()); console.log('badge before',st0);
let b=await s.box('button_new_line'); await p.mouse.click(b.x,b.y); await s.waitFor('select_line_canned_line');
b=await s.box('select_line_canned_line'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(800);
await p.keyboard.type(txt,{delay:40}); await p.waitForTimeout(1800);
const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>{const r=e.getBoundingClientRect();return {t:e.innerText.trim().slice(0,80),x:r.x+r.width/2,y:r.y+r.height/2};}));
console.log('opts',j(opts.map(o=>o.t),400)); const o=opts[0]; await p.mouse.click(o.x,o.y); await p.waitForTimeout(1500);
const chk=await p.evaluate(()=>{const e=document.querySelector('[data-test-id="checkbox_line_approved"]'); return e?.getAttribute('aria-checked');}); console.log('approved checkbox',chk);
if(appr && chk!=='true'){ b=await s.box('checkbox_line_approved'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(500);}
await s.shot(`${label}-dialog-filled`,'shots');
b=await s.box('button_save_close'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(4000); await s.go(`/workorders/${wo}/lines`);
const st1=await p.evaluate(()=>document.querySelector('[data-test-id="badge_wo_status"]')?.innerText.trim()); console.log('badge after',st1);
console.log('writes',s.writes.join('\n'));
const btns=await p.evaluate(()=>[...document.querySelectorAll('button')].map(e=>e.innerText.trim()).filter(t=>/review|complete|approve|decline/i.test(t))); console.log('buttons',j(btns));
await s.shot(`${label}-after-add`,'shots');
const v=await s.api('/api/work-orders/view/'+wo); console.log('api status',v.json?.data?.work_order?.status??v.json?.data?.status);
await s.close();
