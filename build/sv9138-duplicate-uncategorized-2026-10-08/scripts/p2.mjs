import {op,ob,j} from './lib.mjs';
const env=process.argv[2]; const s= env==='prod'? await op(): await ob(); const p=s.page;
await s.go('/parts/inventory'); await p.waitForTimeout(2000);
const nb=await p.evaluate(()=>{const e=[...document.querySelectorAll('button')].find(b=>/new/i.test(b.innerText)&&/part|inventory/i.test(b.innerText)); if(!e)return null; const r=e.getBoundingClientRect(); return {t:e.innerText.trim(),tid:e.getAttribute('data-test-id'),x:r.x+r.width/2,y:r.y+r.height/2};});
console.log('new',j(nb)); await p.mouse.click(nb.x,nb.y); await p.waitForTimeout(2000);
const tids=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')));
console.log(tids.join(' '));
const cat=tids.find(t=>/categ/i.test(t)); console.log('cat',cat);
if(cat){ const b=await s.box(cat); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1500);
 const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>JSON.stringify(e.innerText)));
 console.log('options',opts.length,opts.slice(0,8).join(' , '));
 await p.screenshot({path:`/tmp/qa9138/${env}-dropdown.png`}); }
await s.close();
