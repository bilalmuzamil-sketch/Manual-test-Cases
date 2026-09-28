// C44605 step 3, using the product's own reorder call as the source of truth.
// Person A opens the line and decides on an order (captured from a real Move up the product made).
// Person B then reorders the same line. Person A saves the order they decided on. What happens?
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const OPEN='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(30000);
const R={}; let sent=null, lineId=null;
page.on('request',req=>{ if(/part-order/.test(req.url())&&req.method()==='PUT'){
  try{ sent=JSON.parse(req.postData()||'{}'); }catch{} lineId=req.url().split('/lines/')[1].split('/')[0]; }});
const moveUp=async(which)=>{
  const spot=await page.evaluate((w)=>{const rows=[...document.querySelectorAll('tr')].filter(t=>/^drag_indicator/.test((t.innerText||'').replace(/\s+/g,' ').trim())&&t.getBoundingClientRect().height);
    const row=rows[w]; if(!row)return null;
    const b=[...row.querySelectorAll('button,.q-btn,i')].find(e=>/more_vert/.test((e.innerText||e.textContent||'').trim())&&e.getBoundingClientRect().width);
    if(!b)return null; const r=b.getBoundingClientRect();
    return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2),row:(row.innerText||'').replace(/\s+/g,' ').trim().slice(0,40)};},which);
  if(!spot) return 'no such row';
  await page.mouse.click(spot.x,spot.y); await page.waitForTimeout(2000);
  const items=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
    return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
      .map(i=>{const q=i.getBoundingClientRect();return {t:(i.innerText||'').trim(),dis:/disabled/.test(i.className),x:Math.round(q.x+30),y:Math.round(q.y+q.height/2)};}):[];});
  const up=items.find(i=>/^Move up$/i.test(i.t)&&!i.dis);
  if(!up){ await page.keyboard.press('Escape'); return 'Move up not offered on '+spot.row; }
  await page.mouse.click(up.x,up.y); await page.waitForTimeout(6000);
  return 'moved up: '+spot.row;
};
await openWo(page,OPEN); await page.waitForTimeout(9000);
console.log('person A:', await moveUp(3));
const personAOrder = sent && JSON.parse(JSON.stringify(sent));
R.personAOrder=personAOrder; R.lineId=lineId;
console.log('person A decided on this order:', JSON.stringify(personAOrder).slice(0,200));
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(10000);
console.log('person B:', await moveUp(2));
console.log('person B sent:', JSON.stringify(sent).slice(0,200));
// person A now saves the order they decided on, from the view they had
const A=await page.evaluate(async({lineId,body})=>{
  const r=await fetch(`https://api.shopview.com/api/work-orders/lines/${lineId}/part-order`,
    {method:'PUT',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  return {status:r.status, answer:(await r.text()).slice(0,220)};},{lineId:R.lineId,body:personAOrder});
R.personASave=A;
console.log('\nperson A saved their older order ->',A.status,String(A.answer).replace(/\s+/g,' ').slice(0,180));
console.log('>>> the second person\'s save was', A.status>=200&&A.status<300 ? 'ACCEPTED (last save wins, quietly)' : 'REFUSED');
fs.writeFileSync(`${EV}/r97-race2.json`,JSON.stringify(R,null,1));
await browser.close();
