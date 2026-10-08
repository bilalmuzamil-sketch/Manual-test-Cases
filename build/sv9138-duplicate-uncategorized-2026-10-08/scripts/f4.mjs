import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:2,vp:{width:1600,height:900}}); const p=s.page; const G={};
const g=async q=>p.evaluate(q=>{const e=document.querySelector(q); if(!e) return null; const r=e.getBoundingClientRect(); return {t:e.innerText,x:r.x,y:r.y,w:r.width,h:r.height};},q);
await s.go('/administration/categories'); await p.waitForTimeout(2000);
// rename
let b; const t=await s.box('page_search_toggle'); await p.mouse.click(t.x,t.y); await p.waitForTimeout(600); await p.keyboard.type('ZZAUTOTEST-9138-Cat'); await p.waitForTimeout(3500);
const r=await p.evaluate(()=>{const e=[...document.querySelectorAll('[data-test-id^="category_row_"]')].find(x=>x.innerText.trim()==='ZZAUTOTEST-9138-Cat'); const b=e.getBoundingClientRect(); return {x:b.x+b.width/2,y:b.y+b.height/2};});
await p.mouse.click(r.x,r.y); await p.waitForTimeout(1500);
await p.fill('[data-test-id="category_name_input"]',''); await p.click('[data-test-id="category_name_input"]'); await p.keyboard.type('UNCATEGORIZED',{delay:30}); await p.waitForTimeout(3500);
b=await s.box('category_save_button'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(900);
G.renDialog=await g('.q-dialog .q-card'); G.renInput=await g('[data-test-id="category_name_input"]'); G.notif=await g('.q-notification');
await p.screenshot({path:'/tmp/qa9138/F-rename-refused.png'});
G.add=JSON.parse(fs.readFileSync('/tmp/qa9138/F-refuse-geo.json')); fs.writeFileSync('/tmp/qa9138/F-refuse-geo.json',JSON.stringify(G,null,1));
console.log(j(G,1500));
await s.close();
