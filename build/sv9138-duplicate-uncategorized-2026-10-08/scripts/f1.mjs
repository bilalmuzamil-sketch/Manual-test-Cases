import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:2,vp:{width:1600,height:900}}); const p=s.page; const G={};
const geo=async sel=>p.evaluate(q=>[...document.querySelectorAll(q)].map(e=>{const r=e.getBoundingClientRect();return {t:e.innerText.trim(),x:r.x,y:r.y,w:r.width,h:r.height};}),sel);
G.marker=await s.marker();
// A list
await s.go('/administration/categories'); await p.waitForTimeout(2500);
G.list=(await geo('[data-test-id^="category_row_"]')).slice(0,8); await p.screenshot({path:'/tmp/qa9138/F-branch-list.png'});
// B dropdown
await s.go('/parts/inventory'); await p.waitForTimeout(2000);
let b=await s.box('button_new_inventory_part'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(2000);
b=await s.box('select_category'); G.select=b; await p.mouse.click(b.x,b.y); await p.waitForTimeout(1800);
G.opts=(await geo('.q-menu .q-item')).slice(0,10); await p.screenshot({path:'/tmp/qa9138/F-branch-dropdown.png'});
await p.keyboard.press('Escape'); await p.waitForTimeout(500); await p.keyboard.press('Escape');
// D inventory search
await s.go('/parts/inventory?search=ZZ9138'); await p.waitForTimeout(2500);
G.invUrl=p.url(); G.invHead=await geo('th'); G.invRows=(await geo('tbody tr')).slice(0,30);
await p.screenshot({path:'/tmp/qa9138/F-branch-inventory.png',fullPage:true});
fs.writeFileSync('/tmp/qa9138/F-geo.json',JSON.stringify(G,null,1));
console.log(j(G.marker),G.list.map(x=>x.t).join(' / '),'|',G.opts.map(x=>x.t).join(' / '),'|',G.invUrl,G.invRows.length, G.invHead.map(x=>x.t).join(','));
await s.close();
