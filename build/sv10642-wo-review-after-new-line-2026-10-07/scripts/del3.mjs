import {ob,j} from './lib.mjs'; import fs from 'fs';
const {wo}=JSON.parse(fs.readFileSync('wo-C.json'));
const s=await ob(); const p=s.page; await s.go(`/workorders/${wo}/lines`);
const L=(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="badge_line_status_"]')].map(e=>({id:e.getAttribute('data-test-id').replace('badge_line_status_',''),st:e.innerText.trim()})))).find(l=>/approval/i.test(l.st));
const all=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/delete|remove|menu|more|kebab|context/i.test(t)));
console.log('tids',j([...new Set(all)],800));
// try right-click on the line name
const nb=await s.box('line_number_'+L.id); await p.mouse.click(nb.x+200,nb.y,{button:'right'}); await p.waitForTimeout(1200);
const m=await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id],.q-menu .q-item')].map(e=>(e.getAttribute('data-test-id')||'')+':'+e.innerText.trim()));
console.log('right-click menu',j(m,600)); await s.shot('C-rightclick','shots');
await s.close();
