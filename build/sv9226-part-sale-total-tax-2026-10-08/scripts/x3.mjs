import {ob,j} from './lib.mjs'; import fs from 'fs';
const {id}=JSON.parse(fs.readFileSync('x.json')); const s=await ob({vp:{width:1600,height:1000}}); const p=s.page;
await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(3000);
const kebabs=await p.evaluate(()=>[...document.querySelectorAll('button,i')].filter(x=>x.innerText.trim()==='more_vert'&&x.getBoundingClientRect().width>0).map(e=>{const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,tid:e.closest('[data-test-id]')?.getAttribute('data-test-id')};}));
console.log('kebabs',j(kebabs));
for(const k of kebabs){ await p.mouse.click(k.x,k.y); await p.waitForTimeout(1000); console.log('menu@',Math.round(k.x),Math.round(k.y),j(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.innerText.trim().replace(/\n.*/,'')+' ['+(e.getAttribute('data-test-id')||'')+']')),600)); await p.keyboard.press('Escape'); await p.waitForTimeout(500); }
await s.close();
