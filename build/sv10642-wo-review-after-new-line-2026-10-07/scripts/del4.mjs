import {ob,j} from './lib.mjs'; import fs from 'fs';
const {wo}=JSON.parse(fs.readFileSync('wo-C.json'));
const s=await ob(); const p=s.page; await s.go(`/workorders/${wo}/lines`);
const badge=async()=>p.evaluate(()=>document.querySelector('[data-test-id="badge_wo_status"]')?.innerText.trim());
console.log('badge before',await badge());
const L=(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="badge_line_status_"]')].map(e=>({id:e.getAttribute('data-test-id').replace('badge_line_status_',''),st:e.innerText.trim()})))).find(l=>/approval/i.test(l.st));
const nb=await s.box('line_number_'+L.id); await p.mouse.click(nb.x+200,nb.y,{button:'right'}); await p.waitForTimeout(1200);
const tid='menu-item_delete_line_'+L.id; let b=await s.box(tid); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1500);
const st=await p.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`);return e?{txt:e.innerText.trim(),cls:e.className}:null;},tid); console.log('after 1st click',j(st));
const dl=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(e=>e.innerText.trim().slice(0,200))); console.log('dialog',j(dl));
if(st){ await s.shot('C-delete-confirm','shots'); b=await s.box(tid); await p.mouse.click(b.x,b.y); await p.waitForTimeout(2500); }
else if(dl.length){ await s.shot('C-delete-confirm','shots'); const c=await p.evaluate(()=>{const e=[...document.querySelectorAll('.q-dialog button')].find(b=>/delete|yes|confirm/i.test(b.innerText));const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};}); await p.mouse.click(c.x,c.y); await p.waitForTimeout(2500);}
console.log('writes',s.writes.filter(w=>!/envelope|quick-login/.test(w)).join('\n'));
await s.go(`/workorders/${wo}/lines`); console.log('badge after',await badge());
const btns=await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().width>0).map(e=>e.innerText.trim()).filter(t=>/review|complete|approve|decline/i.test(t))); console.log('buttons',j(btns));
await s.shot('C-after-delete','shots');
const v=await s.api('/api/work-orders/view/'+wo); console.log('api status',v.json?.data?.work_order?.status??v.json?.data?.status);
await s.close();
