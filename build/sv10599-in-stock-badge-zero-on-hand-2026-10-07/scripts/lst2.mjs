import {ob,j} from './lib.mjs'; const s=await ob({dpr:2}); const p=s.page;
await s.go('/workorders?tab=work_orders'); await p.waitForTimeout(1500);
const sb=await p.evaluate(()=>{const e=[...document.querySelectorAll('button,div,span')].find(x=>x.innerText&&x.innerText.trim()==='Search'&&x.getBoundingClientRect().width>0);const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};});
await p.mouse.click(sb.x,sb.y); await p.waitForTimeout(800); await p.keyboard.type('S-17581',{delay:60}); await p.waitForTimeout(3000);
await p.mouse.move(214*1, 210); await p.waitForTimeout(1500);
const tips=await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>{const r=e.getBoundingClientRect();return {t:e.innerText.trim(),g:[r.x,r.y,r.width,r.height].map(Math.round)};}));
console.log('tip',j(tips)); await s.shot('B8-list-tip','shots');
const w=(await s.api('/api/work-orders?limit=100&search=S10599-17581')).json?.data?.work_orders||[]; console.log('api',j(w.map(x=>({n:x.number,inStock:x.statusInStock,req:x.statusRequestedCount,auth:x.statusAuthToOrderCount}))));
await s.close();
