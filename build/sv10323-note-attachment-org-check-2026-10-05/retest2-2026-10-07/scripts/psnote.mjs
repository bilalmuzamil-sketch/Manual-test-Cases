import {ob,j} from './lib.mjs'; const s=await ob({dpr:2}); const p=s.page;
await s.go('/parts/part-sale/156fa0e7-b811-4602-94d4-6c02021b06c6/notes'); await p.waitForTimeout(2000);
const b=await p.evaluate(()=>{const e=[...document.querySelectorAll('button')].find(x=>/New Note/.test(x.innerText)&&x.getBoundingClientRect().width>0);if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};}); console.log('new note btn',j(b));
if(b){await p.mouse.click(b.x,b.y); await p.waitForTimeout(2000);
 const d=await p.evaluate(()=>{const dl=document.querySelector('.q-dialog');return dl?{text:dl.innerText.replace(/\n+/g,' | ').slice(0,700),tids:[...dl.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id'))}:null;}); console.log(j(d,1500));
 const sel=await p.evaluate(()=>{const e=document.querySelector('.q-dialog [data-test-id*="reference"],.q-dialog [data-test-id*="line"],.q-dialog [data-test-id*="target"]');if(!e)return null;const r=e.getBoundingClientRect();return {tid:e.getAttribute('data-test-id'),x:r.x+r.width/2,y:r.y+r.height/2};});
 if(sel){await p.mouse.click(sel.x,sel.y); await p.waitForTimeout(1200); console.log('options',j(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim().replace(/\n/g,' ')))));}
 await s.shot('psnote','shots');}
await s.close();
