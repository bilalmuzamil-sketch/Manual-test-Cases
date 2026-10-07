import {ob,j} from './lib.mjs'; const s=await ob({dpr:2}); const p=s.page;
for(const q of ['search=S-17581','search=17581','query=S-17581']){ const r=await s.api('/api/work-orders?limit=20&'+q); const w=(r.json?.data?.work_orders||[]).find(x=>x.number==='S-17581'); console.log(q,r.status,w?j({st:w.status,statusInStock:w.statusInStock,parts:w.partRequestsCount,req:w.statusRequestedCount}):'-'); }
await s.go('/workorders?tab=work_orders'); await p.waitForTimeout(1500);
const sb=await p.evaluate(()=>{const e=[...document.querySelectorAll('button,div,span')].find(x=>x.innerText&&x.innerText.trim()==='Search'&&x.getBoundingClientRect().width>0);const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};});
await p.mouse.click(sb.x,sb.y); await p.waitForTimeout(800); await p.keyboard.type('S-17581',{delay:60}); await p.waitForTimeout(3000);
const row=await p.evaluate(()=>{const r=[...document.querySelectorAll('tr')].find(t=>t.innerText.includes('S-17581'));if(!r)return null;const c=[...r.querySelectorAll('*')].filter(e=>e.children.length===0&&/^\d+$/.test(e.innerText.trim())&&e.getBoundingClientRect().width<30).map(e=>{const rr=e.getBoundingClientRect();return {t:e.innerText.trim(),bg:getComputedStyle(e.closest('[class*=badge]')||e).backgroundColor,g:[rr.x,rr.y,rr.width,rr.height].map(Math.round)};});return {txt:r.innerText.replace(/\s+/g,' ').slice(0,150),c};});
console.log('row',j(row,600)); await s.shot('B7-list','shots');
await s.close();
