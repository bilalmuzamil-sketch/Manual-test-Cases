import {ob,j} from './lib.mjs'; import fs from 'fs'; import {fin} from './fin.mjs';
const {id,num}=JSON.parse(fs.readFileSync('y.json')); const s=await ob({dpr:2,vp:{width:1900,height:1000}}); const p=s.page;
const listOf=async()=>{let all=[];for(let pg=1;pg<=5;pg++){const c=(await s.api(`/api/part-sales?pagination%5BrowsPerPage%5D=100&pagination%5Bpage%5D=${pg}`)).json.data.partSales;all=all.concat(c);if(c.length<100)break;} return all.find(x=>x.number===num)?.totalPrice;};
console.log('before list',await listOf());
await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForSelector('[data-test-id="button_part_request_menu_24291b1b-720b-4168-b14c-cd72eabae77c"]',{timeout:30000}); await p.waitForTimeout(800);
let b=await s.box('button_part_request_menu_24291b1b-720b-4168-b14c-cd72eabae77c'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1000);
const items=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.innerText.trim()+'['+(e.getAttribute('data-test-id')||'')+']')); console.log('menu',j(items));
await p.screenshot({path:'/tmp/qa9226/core-4-menu.png'});
const ci=await p.evaluate(()=>{const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>/Cancel Return/i.test(x.innerText)); return e?e.getAttribute('data-test-id'):null;});
if(ci){ b=await s.box(ci); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1500);
 console.log('dialog',(await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText||'')).replace(/\n+/g,' | ').slice(0,500)); await p.screenshot({path:'/tmp/qa9226/core-cancel-1.png'});
 for(let i=0;i<3;i++){ const t=await p.evaluate(()=>{const e=[...document.querySelectorAll('.q-dialog button')].find(b=>/confirm_dialog|confirmation_answer|positive_answer/.test(b.getAttribute('data-test-id')||'')); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText.trim()};}); if(!t) break; console.log('click',t.t); await p.mouse.click(t.x,t.y); await p.waitForTimeout(2000); await p.screenshot({path:`/tmp/qa9226/core-cancel-${i+2}.png`}); console.log('dialog now',(await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText||'CLOSED')).replace(/\n+/g,' | ').slice(0,300)); } }
console.log('writes',s.writes.filter(w=>!/envelope|quick-login|touch/.test(w)).map(w=>w.slice(0,200)).join('\n'));
console.log('list',await listOf(),'fin',j(await fin(s,id)));
await p.waitForSelector('[data-test-id^="badge_part_request_status_"]',{timeout:30000}); await p.waitForTimeout(800);
console.log('rows',j(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="badge_part_request_status_"],[data-test-id^="button_return_core_"]')].map(e=>e.getAttribute('data-test-id').slice(0,28)+':'+e.innerText.trim()))));
await p.screenshot({path:'/tmp/qa9226/core-5-after-cancel.png'});
await s.close();
