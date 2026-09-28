// Positive control for C44605, through the SCREEN: reorder two parts on an OPEN work order's line
// and confirm the rows actually swap. If the screen can reorder here, then the invoiced work
// order's refusal (409 "status: Invoiced") is the product refusing, not my instrument failing.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const OPEN='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(30000);
const R={};
const net=[];
page.on('response',async r=>{ if(/part-order/.test(r.url())) net.push({s:r.status(), body:(await r.text().catch(()=>'')).slice(0,200)}); });
const partOrder=async()=>await page.evaluate(()=>{
  const rows=[...document.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height);
  const out=[]; let line=null;
  for(const t of rows){ const txt=(t.innerText||'').replace(/\s+/g,' ').trim();
    if(/^\d+\s+more_vert/.test(txt)) line=txt.slice(0,30);
    else if(/^drag_indicator/.test(txt)) out.push(line+' >> '+txt.replace('drag_indicator ','').slice(0,34)); }
  return out;});
await openWo(page,OPEN); await page.waitForTimeout(9000);
R.before=await partOrder();
console.log('part order before:'); R.before.forEach(x=>console.log('  ',x));
// take the LAST part row on the work order and move it up
const spot=await page.evaluate(()=>{const rows=[...document.querySelectorAll('tr')].filter(t=>/^drag_indicator/.test((t.innerText||'').replace(/\s+/g,' ').trim())&&t.getBoundingClientRect().height);
  const row=rows[rows.length-1]; if(!row)return null;
  const b=[...row.querySelectorAll('button,.q-btn,i')].find(e=>/more_vert/.test((e.innerText||e.textContent||'').trim())&&e.getBoundingClientRect().width);
  if(!b)return null; const r=b.getBoundingClientRect();
  return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2),row:(row.innerText||'').replace(/\s+/g,' ').trim().slice(0,44)};});
console.log('\nmoving up:',JSON.stringify(spot&&spot.row));
await page.mouse.click(spot.x,spot.y); await page.waitForTimeout(2200);
const items=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
  return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
    .map(i=>{const q=i.getBoundingClientRect();return {t:(i.innerText||'').trim(),dis:/disabled/.test(i.className),x:Math.round(q.x+30),y:Math.round(q.y+q.height/2)};}):[];});
console.log('menu:',JSON.stringify(items.map(i=>i.t+(i.dis?' [off]':''))));
const up=items.find(i=>/^Move up$/i.test(i.t)&&!i.dis);
if(up){ await page.mouse.click(up.x,up.y); console.log('pressed "Move up"'); await page.waitForTimeout(7000); }
R.net=net; console.log('the server answered:',JSON.stringify(net));
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(11000);
R.after=await partOrder();
console.log('\npart order after:'); R.after.forEach(x=>console.log('  ',x));
R.changed = JSON.stringify(R.before)!==JSON.stringify(R.after);
console.log('\n>>> the screen reordered the parts on an open work order:',R.changed);
fs.writeFileSync(`${EV}/r94-ui-reorder.json`,JSON.stringify(R,null,1));
await browser.close();
