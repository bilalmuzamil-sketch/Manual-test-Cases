import {ob,j} from './lib.mjs'; import fs from 'fs';
const {wo}=JSON.parse(fs.readFileSync('wo-C.json'));
const s=await ob(); const p=s.page; await s.go(`/workorders/${wo}/lines`);
const lines=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="badge_line_status_"]')].map(e=>({id:e.getAttribute('data-test-id').replace('badge_line_status_',''),st:e.innerText.trim()})));
const L=lines.find(l=>/approval/i.test(l.st)); console.log('pending',j(L));
let b=await s.box('line_checkbox_'+L.id); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1200);
const vis=await p.evaluate(()=>[...document.querySelectorAll('button,[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0&&e.getBoundingClientRect().y<140).map(e=>(e.getAttribute('data-test-id')||'')+':'+(e.innerText||'').trim().slice(0,30)));
console.log('top controls',j(vis,800)); await s.shot('C-selected','shots');
await s.close();
