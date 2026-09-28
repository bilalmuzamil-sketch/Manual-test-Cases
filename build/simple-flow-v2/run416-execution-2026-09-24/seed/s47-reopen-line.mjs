// Two open lines are needed. Rather than making new ones, reopen the completed line the way the QA
// lead described: its three-dot menu moves it to authorization required, and it can then be
// approved again - leaving two approved (open) lines on the work order.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from '../probes/lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(35000);
const R={};
const lineRows=async()=>await page.evaluate(()=>[...document.querySelectorAll('tr')]
  .filter(t=>/^\d+\s+more_vert/.test((t.innerText||'').replace(/\s+/g,' ').trim())&&t.getBoundingClientRect().height)
  .map(t=>{const mv=[...t.querySelectorAll('button,.q-btn,i')].filter(e=>/more_vert/.test((e.innerText||e.textContent||'').trim())&&e.getBoundingClientRect().width)[0];
    const acts=[...t.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>{const r=e.getBoundingClientRect();return {t:(e.innerText||'').replace(/\s+/g,' ').trim(),x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};})
      .filter(a=>a.t&&!/more_vert/.test(a.t));
    const r=mv?mv.getBoundingClientRect():null;
    return {t:(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,70),
      dot:r?{x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)}:null, acts};}));
await openWo(page,WO); await page.waitForTimeout(9000);
R.before=(await lineRows()).map(l=>l.t);
console.log('before:'); R.before.forEach(l=>console.log('   ',l));
const done=(await lineRows()).find(l=>/Complete/.test(l.t)&&!/Approved/.test(l.t));
if(!done){ console.log('no completed line to reopen'); await browser.close(); process.exit(0); }
console.log('\nreopening:',done.t.slice(0,44));
await page.mouse.click(done.dot.x,done.dot.y); await page.waitForTimeout(2300);
R.menu=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
  return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
    .map(i=>{const r=i.getBoundingClientRect();return {t:(i.innerText||'').trim(),dis:/disabled/.test(i.className),x:Math.round(r.x+30),y:Math.round(r.y+r.height/2)};}):[];});
console.log('its menu:',JSON.stringify(R.menu.map(m=>m.t+(m.dis?' [off]':''))));
const auth=R.menu.find(m=>/authorization required|needs approval|uncomplete|reopen/i.test(m.t)&&!m.dis);
if(!auth){ console.log('the menu offers no way to reopen it'); await page.keyboard.press('Escape'); await browser.close(); process.exit(0); }
await page.mouse.click(auth.x,auth.y); console.log('chose',JSON.stringify(auth.t)); await page.waitForTimeout(6000);
for(let i=0;i<2;i++){
  const d=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    if(!q)return null; return (q.innerText||'').replace(/\s+/g,' ').trim().slice(0,200);});
  if(!d) break; console.log('  it asks:',JSON.stringify(d));
  console.log('  ',await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    const c=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>({e,t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')}))
      .filter(x=>x.t&&!/^(cancel|close|×)$/i.test(x.t));
    if(!c.length)return 'nothing to press'; const b=c[c.length-1];
    if(b.dis)return '"'+b.t+'" will not press'; b.e.click(); return 'pressed "'+b.t+'"';}));
  await page.waitForTimeout(5000);
}
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(10000);
let rr=await lineRows();
console.log('\nafter reopening:'); rr.forEach(l=>console.log('   ',l.t));
// approve it back to open
const needs=rr.find(l=>l.acts.some(a=>/^Approve$/i.test(a.t))&&/Fdgfdg/.test(l.t));
if(needs){ const b=needs.acts.find(a=>/^Approve$/i.test(a.t));
  console.log('\napproving it:',needs.t.slice(0,40));
  await page.mouse.click(b.x,b.y); await page.waitForTimeout(6000);
  const d=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    if(!q)return 'no dialog'; const c=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>({e,t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')}))
      .filter(x=>x.t&&!/^(cancel|close|×)$/i.test(x.t));
    if(!c.length)return 'nothing to press'; const b=c[c.length-1]; if(b.dis)return '"'+b.t+'" will not press';
    b.e.click(); return 'confirmed with "'+b.t+'"';});
  console.log('  ',d); await page.waitForTimeout(6000);
  await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(10000); }
R.after=(await lineRows()).map(l=>l.t);
console.log('\nlines now:'); R.after.forEach(l=>console.log('   ',l));
R.open=R.after.filter(l=>/Approved/.test(l)).length;
console.log('\n>>> open approved lines:',R.open);
fs.writeFileSync(`${EV}/s47-reopen-line.json`,JSON.stringify(R,null,1));
await browser.close();
