import {ob,j} from './lib.mjs'; import fs from 'fs'; import {fin} from './fin.mjs';
const {id}=JSON.parse(fs.readFileSync('y.json')); const s=await ob({dpr:2,vp:{width:1700,height:1000}}); const p=s.page;
await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(3500);
const r=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map((tr,i)=>{const b=[...tr.querySelectorAll('button,i')].filter(x=>/reply|undo|keyboard_return/.test(x.innerText.trim())).map(x=>{const g=x.getBoundingClientRect();return {i,t:x.innerText.trim(),tid:x.closest('[data-test-id]')?.getAttribute('data-test-id'),x:g.x+g.width/2,y:g.y+g.height/2};}); return {i,core:/Core for/.test(tr.innerText),b};}).filter(x=>x.b.length));
console.log(j(r,900));
const core=r.find(x=>x.core); if(core){ const bt=core.b[0]; await p.mouse.move(bt.x,bt.y); await p.waitForTimeout(1500); console.log('tip',j(await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(e=>e.innerText)))); await p.mouse.click(bt.x,bt.y); await p.waitForTimeout(2000);
 console.log('dialog',(await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText||'NONE')).replace(/\n+/g,' | ').slice(0,900));
 console.log(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')).join(' ')));
 await p.screenshot({path:'/tmp/qa9226/core-return-dialog.png'}); }
await s.close();
