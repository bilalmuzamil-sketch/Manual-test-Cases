// Decline is greyed on every existing line, because each holds received or picked parts - which is
// the rule a different check already confirmed. So build a line whose parts have NOT arrived, decline
// it, and watch what happens to them (C44570). Also try the other route the check names: sending the
// line back with Authorization required.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const lineMenu=async(id)=>{const tr=page.locator('tr.line-row-'+id).first();
  await tr.scrollIntoViewIfNeeded().catch(()=>{}); await tr.hover().catch(()=>{}); await page.waitForTimeout(1100);
  const spot=await page.evaluate((lid)=>{const row=document.querySelector('tr.line-row-'+lid); if(!row)return null;
    const rb=row.getBoundingClientRect(); const c=[];
    document.querySelectorAll('button,.q-btn,i,.q-icon').forEach(b=>{if(!/more_vert/.test((b.innerText||b.textContent||'').trim()))return;
      const r=b.getBoundingClientRect(); if(!r.width)return; const cy=r.y+r.height/2;
      if(cy>=rb.top-2&&cy<=rb.bottom+2) c.push({x:Math.round(r.x+r.width/2),y:Math.round(cy)});});
    c.sort((a,b)=>a.x-b.x); return c[0]||null;},id);
  if(!spot) return [];
  await page.mouse.click(spot.x,spot.y); await page.waitForTimeout(1900);
  return await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
    return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
      .map(i=>{const q=i.getBoundingClientRect();return {t:(i.innerText||'').trim(),dis:/disabled/.test(i.className),x:Math.round(q.x+30),y:Math.round(q.y+q.height/2)};}):[];});};
await openWo(page,WO); await page.waitForTimeout(9000);
// new line
console.log('adding a line with a part that has not arrived');
await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(e=>(e.innerText||'').trim()==='New Line'&&e.getBoundingClientRect().width); if(b)b.click();});
await page.waitForTimeout(5500);
const ins=page.locator('.q-dialog input:visible');
if(await ins.count()){ await ins.nth(0).click(); await ins.nth(0).type('ZZAUTOTEST decline line',{delay:35});
  if(await ins.count()>1){ await ins.nth(1).click(); await ins.nth(1).type('ZZAUTOTEST',{delay:35}); }
  await page.waitForTimeout(1200);
  await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^Save & Close$/i.test((x.innerText||'').replace(/\s+/g,' ').trim())); if(b)b.click();});
  await page.waitForTimeout(8000); }
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await page.evaluate(()=>{for(const r of document.querySelectorAll('tr[class*="line-row-"]')){
  const b=[...r.querySelectorAll('button,.q-btn')].find(x=>/^Approve$/i.test((x.innerText||'').trim())); if(b){b.click();return;}}});
await page.waitForTimeout(5000); await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
// add a part to that new (last) line
await page.evaluate(()=>{const all=[...document.querySelectorAll('*')].filter(x=>/^\+?\s*Add Part$/i.test((x.textContent||'').trim())&&x.getBoundingClientRect().width)
    .sort((a,b)=>b.getBoundingClientRect().y-a.getBoundingClientRect().y); if(all.length){all[0].scrollIntoView({block:'center'});all[0].click();}});
await page.waitForTimeout(4500);
const put=async(src,val)=>{const ix=await page.evaluate((s)=>{const re=new RegExp(s,'i');
    const i=[...document.querySelectorAll('input')].filter(x=>x.getBoundingClientRect().width);
    return i.findIndex(x=>re.test(((x.closest('.q-field')||{}).innerText||'')+' '+(x.getAttribute('placeholder')||'')));},src);
  if(ix<0)return; const b=page.locator('input:visible').nth(ix);
  await b.click({timeout:9000}).catch(()=>{}); await b.fill('').catch(()=>{}); await b.type(val,{delay:40}); await page.waitForTimeout(2000);};
await put('Part number','ZZAUTOTEST-DECLINE'); await page.keyboard.press('Escape').catch(()=>{});
await put('Description','ZZAUTOTEST decline part'); await put('^Qty','1'); await put('Sell price','25');
await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width&&!/disabled/.test(e.className||''))
  .find(e=>/^(Save|Add)$/i.test((e.innerText||'').trim())); if(b)b.click();});
await page.waitForTimeout(6000); await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.partBefore=await page.evaluate(()=>{const t=[...document.querySelectorAll('tr')].find(x=>/ZZAUTOTEST-DECLINE/.test(x.innerText||''));
  return t?(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,100):null;});
console.log('the part before:',JSON.stringify(R.partBefore));
// decline that line
const ids=await page.evaluate(()=>[...document.querySelectorAll('tr[class*="line-row-"]')]
  .map(r=>({id:(r.className.match(/line-row-([0-9a-f-]+)/)||[])[1],txt:(r.innerText||'').replace(/\s+/g,' ').slice(0,50)}))
  .filter(x=>/ZZAUTOTEST decline line/.test(x.txt)));
console.log('the new line:',JSON.stringify(ids));
if(ids.length){
  const items=await lineMenu(ids[0].id);
  console.log('its menu:',JSON.stringify(items.map(i=>i.t+(i.dis?' [disabled]':''))));
  R.declineOffered=items.some(i=>/^Decline$/i.test(i.t)&&!i.dis);
  const dec=items.find(i=>/^Decline$/i.test(i.t)&&!i.dis);
  if(dec){ await page.mouse.click(dec.x,dec.y); await page.waitForTimeout(4500);
    const d=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
      if(!q)return null; const t=(q.innerText||'').replace(/\s+/g,' ').slice(0,200);
      const b=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width&&!/disabled/.test(e.className||''))
        .find(e=>/^(Decline|Yes|Confirm|OK)$/i.test((e.innerText||'').trim())); if(b)b.click(); return t;});
    console.log('   declining asked:',d?JSON.stringify(d):'nothing');
    await page.waitForTimeout(6000); await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
    R.partAfter=await page.evaluate(()=>{const t=[...document.querySelectorAll('tr')].find(x=>/ZZAUTOTEST-DECLINE/.test(x.innerText||''));
      return t?(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,100):'the part row is gone';});
    R.lineAfter=await page.evaluate(()=>{const r=[...document.querySelectorAll('tr[class*="line-row-"]')].find(x=>/ZZAUTOTEST decline line/.test(x.innerText||''));
      return r?[...r.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()).join('+'):null;});
    console.log('\nthe line is now:',JSON.stringify(R.lineAfter));
    console.log('the part is now :',JSON.stringify(R.partAfter));
    await page.screenshot({path:`${EV}/r78-after.png`,fullPage:true}).catch(()=>{}); }
  else console.log('   Decline is not offered even on this line');
}
fs.writeFileSync(`${EV}/r78-decline.json`,JSON.stringify(R,null,1));
await browser.close();
