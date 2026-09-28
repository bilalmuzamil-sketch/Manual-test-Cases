// C44605 step 2: reorder parts on a line belonging to an INVOICED work order.
// The case's Expected says such a reorder is rejected. S2-908 is invoiced (seeded in s22).
// Read what the product offers there: is the part's Move/Move up/Move down offered at all,
// and if offered, does acting on it change anything?
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={wo:WO};
// watch what the server is asked and what it answers
const calls=[];
page.on('response',async r=>{const u=r.url(); if(/order|move|position|sort/i.test(u)&&/\/api\//.test(u)) calls.push({m:r.request().method(),u:u.split('?')[0].slice(-70),s:r.status()});});
await openWo(page,WO); await page.waitForTimeout(9000);
R.header=await page.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,180));
console.log('the work order reads:',R.header.slice(0,120));
const rows=await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height)
  .map((t,i)=>({i,t:(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,72)})));
console.log('rows:'); rows.forEach(r=>console.log(' ',String(r.i).padStart(3),r.t));
R.rowsBefore=rows.map(r=>r.t);
// can a part row even be dragged here? read the handle
R.dragHandles=await page.evaluate(()=>[...document.querySelectorAll('tr')]
  .filter(t=>/drag_indicator/.test(t.innerText||'')&&t.getBoundingClientRect().height).length);
console.log('part rows offering a drag handle:',R.dragHandles);
// open the first part's own menu and read what it offers
const spot=await page.evaluate(()=>{const row=[...document.querySelectorAll('tr')].find(t=>/drag_indicator|\(\w/.test(t.innerText||'')&&/more_vert/.test(t.innerText||'')&&!/^\d+\s+more_vert/.test((t.innerText||'').replace(/\s+/g,' ').trim())&&t.getBoundingClientRect().height);
  if(!row)return null; const b=[...row.querySelectorAll('button,.q-btn,i')].find(e=>/more_vert/.test((e.innerText||e.textContent||'').trim())&&e.getBoundingClientRect().width);
  if(!b)return null; const r=b.getBoundingClientRect(); return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2),row:(row.innerText||'').replace(/\s+/g,' ').trim().slice(0,60)};});
if(spot){ console.log('opening the menu on:',JSON.stringify(spot.row));
  await page.mouse.click(spot.x,spot.y); await page.waitForTimeout(2200);
  R.partMenu=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
    return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
      .map(i=>({t:(i.innerText||'').trim(),disabled:/disabled/.test(i.className)})):[];});
  console.log('the part menu offers:',JSON.stringify(R.partMenu));
  await page.screenshot({path:`${EV}/r89-invoiced-part-menu.png`}).catch(()=>{});
  await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
} else { console.log('no part row with its own menu on this work order'); R.partMenu=null; }
R.calls=calls;
console.log('what the server was asked:',JSON.stringify(calls));
fs.writeFileSync(`${EV}/r89-invoiced-reorder.json`,JSON.stringify(R,null,1));
await browser.close();
