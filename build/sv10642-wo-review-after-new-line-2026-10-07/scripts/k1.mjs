import {ob,j} from './lib.mjs'; import fs from 'fs';
const {wo}=JSON.parse(fs.readFileSync('wo-K.json'));
const s=await ob(); const p=s.page; await s.go(`/workorders/${wo}/lines`);
const num=await p.evaluate(()=>document.querySelector('[data-test-id="text_wo_number"]')?.innerText.trim()); console.log('number',num);
let b=await s.box('button_work_order_nav_bar_menu'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1200);
const m=await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id],.q-menu .q-item')].map(e=>(e.getAttribute('data-test-id')||'')+':'+e.innerText.trim().replace(/\n/g,' ')));
console.log('wo menu',j(m,900)); await s.shot('K-wo-menu','shots');
await p.keyboard.press('Escape');
// list view
await s.go('/workorders?tab=work_orders'); await p.waitForTimeout(1500);
const row=await p.evaluate(n=>{const r=[...document.querySelectorAll('tr')].find(t=>t.innerText.includes(n)); return r?r.innerText.replace(/\s+/g,' ').slice(0,300):null;},num);
console.log('list row',row);
const tabs=await p.evaluate(()=>[...document.querySelectorAll('[role=tab],.q-tab')].map(e=>e.innerText.trim().replace(/\s+/g,' ')).slice(0,15)); console.log('tabs',j(tabs));
await s.shot('K-list','shots');
await s.close();
