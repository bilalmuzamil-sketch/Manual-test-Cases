import {ob,j} from './lib.mjs'; import fs from 'fs';
const {wo}=JSON.parse(fs.readFileSync('wo-A.json'));
const s=await ob(); const p=s.page;
await s.go(`/workorders/${wo}/lines`);
await s.shot('A1-review-before','shots');
const badge=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/status|badge|new_line|review|complete/i.test(t)).slice(0,40));
console.log('tids',badge.join(' '));
const b=await s.box('button_new_line'); console.log('newline',j(b));
if(b){ await p.mouse.click(b.x,b.y); await p.waitForTimeout(2500); await s.shot('A2-newline-dialog','shots');
 const d=await p.evaluate(()=>{const dl=document.querySelector('[data-test-id="dialog_line"]')||document.querySelector('.q-dialog'); return dl? {text:dl.innerText.slice(0,1200), tids:[...dl.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id'))}:null;});
 console.log(j(d,2500)); }
await s.close();
