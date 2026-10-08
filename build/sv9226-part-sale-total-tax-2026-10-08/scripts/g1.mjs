import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page;
await s.go('/parts/part-sales'); await p.waitForTimeout(2000);
let b=await s.box('global_search_trigger'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(800); await p.keyboard.type('P9667-447',{delay:50}); await p.waitForTimeout(3500);
const res=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog *, .q-menu *')].filter(e=>e.childElementCount===0&&/\$\d/.test(e.innerText||'')).map(e=>{const r=e.getBoundingClientRect();return {t:e.parentElement.innerText.replace(/\n+/g,' | ').slice(0,160),x:r.x,y:r.y,w:r.width,h:r.height};}));
console.log('search results with money',j(res,900)); await p.screenshot({path:'/tmp/qa9226/search.png'});
// finance tab for invoiced + paid
const all=JSON.parse(fs.readFileSync('ps-all.json')); const inv=all.find(x=>x.number==='P9667-445'); const paid=all.find(x=>x.status==='paid'&&x.totalPrice>0&&/P9667/.test(x.number));
for(const x of [inv,paid]){ await s.go(`/parts/part-sale/${x.id}/finance`); await p.waitForTimeout(3500); const t=(await p.evaluate(()=>document.querySelector('.q-page')?.innerText||'')).replace(/\n+/g,' | '); console.log('FIN',x.number,x.status,'list',x.totalPrice,'|',t.slice(0,900)); await p.screenshot({path:`/tmp/qa9226/financetab-${x.number}.png`}); }
await s.close();
