import {ob,j} from './lib.mjs'; import fs from 'fs'; import {fin} from './fin.mjs';
const {id,num}=JSON.parse(fs.readFileSync('y.json')); const s=await ob({vp:{width:1700,height:1000}}); const p=s.page;
await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(3000);
const btns=async()=>p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().width>0).map(b=>b.innerText.trim()+'['+(b.getAttribute('data-test-id')||'')+']').filter(x=>!/^\[|^more_vert/.test(x)));
console.log('buttons',j(await btns(),1200));
let b=await s.box('button_part_sale_action_authorized'); if(b){ await p.mouse.click(b.x,b.y); await p.waitForTimeout(2500); console.log('dialog',j(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(e=>e.innerText.replace(/\n+/g,' | ').slice(0,300))))); }
await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(3000);
console.log('after authorize buttons',j(await btns(),1200));
const pk=await p.evaluate(()=>{const e=[...document.querySelectorAll('button')].find(b=>/^Pick$/.test(b.innerText.trim())&&b.getBoundingClientRect().width>0);if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};});
if(pk){ await p.mouse.click(pk.x,pk.y); await p.waitForTimeout(3000); }
await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(3000);
console.log('rows',j(await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').slice(0,200))),800));
const kb=await p.evaluate(()=>[...document.querySelectorAll('button,i')].filter(x=>x.innerText.trim()==='more_vert'&&x.getBoundingClientRect().y>180&&x.getBoundingClientRect().width>0).map(e=>{const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};}));
for(const k of kb){ await p.mouse.click(k.x,k.y); await p.waitForTimeout(900); console.log('rowmenu',Math.round(k.y),j(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.innerText.trim().replace(/\n.*/,'')+' ['+(e.getAttribute('data-test-id')||'')+']')),500)); await p.keyboard.press('Escape'); await p.waitForTimeout(400);}
console.log('fin',j(await fin(s,id)));
console.log('writes',s.writes.filter(w=>!/envelope|quick-login|touch/.test(w)).map(w=>w.slice(0,160)).join('\n'));
await p.screenshot({path:'/tmp/qa9226/y2.png'}); await s.close();
