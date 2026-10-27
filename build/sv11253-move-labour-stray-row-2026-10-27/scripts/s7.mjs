import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess(); const W=JSON.parse(fs.readFileSync('../data/wo1.json')); const A=W.lines[0];
await s.go(`/workorders/${W.wo}/lines`); await s.waitFor('line_checkbox_'+A);
const vis=()=>s.page.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent||e.closest('.q-menu')).map(e=>e.dataset.testId+(e.innerText?' «'+e.innerText.trim().slice(0,30).replace(/\n/g,' ')+'»':'')));
const before=new Set(await vis());
let b=await s.box('line_checkbox_'+A); await s.page.mouse.click(b.x,b.y); await s.page.waitForTimeout(1000);
console.log('after tick:',(await vis()).filter(x=>!before.has(x)).join(' | '));
await s.page.screenshot({path:'/tmp/qa11685/w/l5.png'});
// three-dots in toolbar near New Line
const dots=await s.page.evaluate(()=>{const e=[...document.querySelectorAll('button')].find(b=>b.offsetParent&&b.querySelector('i')&&/more_vert|dots/.test(b.innerHTML)&&b.getBoundingClientRect().y<130); if(!e)return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,id:e.dataset.testId};});
console.log('dots',dots); if(dots){ await s.page.mouse.click(dots.x,dots.y); await s.page.waitForTimeout(800); console.log(await s.page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.dataset.testId||'')+' :: '+e.innerText.trim()).join('\n'))); }
await s.page.screenshot({path:'/tmp/qa11685/w/l6.png'});
await s.browser.close(); process.exit(0);
