import {ob,j} from './lib.mjs'; import fs from 'fs';
const {wo}=JSON.parse(fs.readFileSync('wo-A.json')); const s=await ob(); const p=s.page; await s.go(`/workorders/${wo}/lines`);
const ab=await p.evaluate(()=>[...document.querySelectorAll('button,[data-test-id]')].filter(e=>/Add Part/.test(e.innerText||'')&&e.getBoundingClientRect().width>0&&e.children.length<4).map(e=>({tid:e.getAttribute('data-test-id'),t:e.innerText.trim(),tag:e.tagName})));
console.log(j(ab,600));
const b=await p.evaluate(()=>{const e=[...document.querySelectorAll('button')].find(x=>/Add Part/.test(x.innerText)&&x.getBoundingClientRect().width>0);const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};});
await p.mouse.click(b.x,b.y); await p.waitForTimeout(2000);
const t=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id')).filter(x=>/part|bin|source|save|qty|quant/i.test(x)));
console.log('after click',j(t,1200)); await s.shot('ap0','shots'); await s.close();
