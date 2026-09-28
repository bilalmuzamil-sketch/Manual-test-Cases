// C44597 run 2 needs a work order with two or more OPEN lines. New lines start needing approval
// (that setting is on), so add two and approve both.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from '../probes/lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO=process.env.WO||'281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(40000);
const lines=async()=>await page.evaluate(()=>[...document.querySelectorAll('tr')]
  .filter(t=>/^\d+\s+more_vert/.test((t.innerText||'').replace(/\s+/g,' ').trim())&&t.getBoundingClientRect().height)
  .map(t=>{const b=[...t.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>{const r=e.getBoundingClientRect();return {t:(e.innerText||'').replace(/\s+/g,' ').trim(),x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};})
      .filter(a=>a.t&&!/more_vert/.test(a.t));
    return {t:(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,72),actions:b};}));
await openWo(page,WO); await page.waitForTimeout(9000);
console.log('lines before:'); (await lines()).forEach(l=>console.log('   ',l.t));
for(let i=1;i<=2;i++){
  await openWo(page,WO); await page.waitForTimeout(6000);
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(x=>(x.innerText||'').trim()==='New Line'); if(b)b.click();});
  await page.waitForTimeout(6000);
  const what=page.locator('.q-dialog .q-field:has-text("What Are You Doing") input, .q-dialog .q-field:has-text("What Are You Doing") textarea').first();
  if(await what.count()){ await what.click(); await what.fill(`ZZAUTOTEST open line ${i}`); await page.waitForTimeout(1200); }
  const why=page.locator('.q-dialog .q-field:has-text("Why Are You Doing It") input, .q-dialog .q-field:has-text("Why Are You Doing It") textarea').first();
  if(await why.count()) await why.fill('so that every open line can be completed at once').catch(()=>{});
  console.log(`line ${i}:`,await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
    if(!d)return 'the dialog closed'; const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^Save & Close$/i.test((x.innerText||'').replace(/\s+/g,' ').trim()));
    if(!b)return 'no Save & Close'; if(b.disabled||/disabled/.test(b.className||''))return 'Save & Close will not press';
    b.click(); return 'saved';}));
  await page.waitForTimeout(8000);
}
// approve everything that offers it
await openWo(page,WO); await page.waitForTimeout(9000);
for(let round=0;round<4;round++){
  const rr=await lines();
  const a=rr.find(l=>l.actions.some(x=>/^Approve$/i.test(x.t))&&/ZZAUTOTEST open line/.test(l.t));
  if(!a){ console.log('nothing left to approve'); break; }
  const btn=a.actions.find(x=>/^Approve$/i.test(x.t));
  console.log('approving:',a.t.slice(0,44));
  await page.mouse.click(btn.x,btn.y); await page.waitForTimeout(5000);
  const d=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    if(!q)return null; const c=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>({e,t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')}))
      .filter(x=>x.t&&!/^(cancel|close|×)$/i.test(x.t));
    if(!c.length)return 'a dialog with nothing to press'; const b=c[c.length-1];
    if(b.dis)return '"'+b.t+'" will not press'; b.e.click(); return 'confirmed with "'+b.t+'"';});
  if(d) console.log('  ',d);
  await page.waitForTimeout(6000);
  await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
}
const final=await lines();
console.log('\nlines now:'); final.forEach(l=>console.log('   ',l.t));
const open=final.filter(l=>/Approved/.test(l.t)).length;
console.log('\n>>> open approved lines on this work order:',open);
fs.writeFileSync(`${EV}/s46-two-open-lines.json`,JSON.stringify({lines:final.map(l=>l.t),open},null,1));
await browser.close();
