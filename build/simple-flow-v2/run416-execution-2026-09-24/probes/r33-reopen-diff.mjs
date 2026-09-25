// Final sub-item: does a reopened line keep its parts? (C44565 item 2)
// Use S2-810's first Complete line - it demonstrably HOLDS received or picked parts, because that is
// the very reason its Decline is disabled. Snapshot EVERY row of the lines table either side of the
// reopen and diff them, rather than keyword-filtering (a keyword list is a guess about the wording).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
async function vmenu(page){return await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const r=x.getBoundingClientRect();return r.width>20&&r.height>20;});
  if(!m.length)return null;const el=m[m.length-1];
  return [...el.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width).map(i=>({t:(i.innerText||'').trim().replace(/\s+/g,' '),
    disabled:i.classList.contains('disabled')||/q-item--disabled/.test(i.className),
    box:(()=>{const r=i.getBoundingClientRect();return{x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};})()})).filter(i=>i.t);});}
async function lines(page){return await page.evaluate(()=>{const s=new Set(),o=[];
  for(const tr of document.querySelectorAll('tr[class*="line-row-"]')){const i=(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1];
    if(!i||s.has(i))continue;s.add(i);o.push({id:i,badges:[...tr.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim())});}return o;});}
async function openLineMenu(page,id){const tr=page.locator(`tr.line-row-${id}`).first();
  await tr.scrollIntoViewIfNeeded().catch(()=>{});await tr.hover().catch(()=>{});await page.waitForTimeout(1200);
  const spot=await page.evaluate((lid)=>{const row=document.querySelector(`tr.line-row-${lid}`);if(!row)return null;
    const rb=row.getBoundingClientRect();const c=[];
    document.querySelectorAll('button,.q-btn,i,.q-icon').forEach(b=>{if(!/more_vert/.test((b.innerText||b.textContent||'').trim()))return;
      const r=b.getBoundingClientRect();if(!r.width||!r.height)return;const cy=r.y+r.height/2;
      if(cy>=rb.top-2&&cy<=rb.bottom+2)c.push({x:Math.round(r.x+r.width/2),y:Math.round(cy)});});
    c.sort((a,b)=>a.x-b.x);return c[0]||null;},id);
  if(!spot)return null;await page.mouse.click(spot.x,spot.y).catch(()=>{});await page.waitForTimeout(1900);return await vmenu(page);}
// EVERY row of the lines table, in order, unfiltered
async function snapshot(page){return await page.evaluate(()=>[...document.querySelectorAll('tr')]
  .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean));}

const {browser,page}=await bootProdLogin('/workorders',{settle:11000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(25000);
const R={};
await openWo(page,'fe72110c-7ff6-47f8-8f83-e3ea447a5280'); await page.waitForTimeout(8000);
R.before=await snapshot(page);
console.log('rows before:',R.before.length);
R.before.forEach((r,i)=>console.log('   ',i,r.slice(0,110)));
let ls=await lines(page);
const comp=ls.find(l=>l.badges.some(b=>/^Complete$/i.test(b)));
const m=await openLineMenu(page,comp.id);
const un=(m||[]).find(i=>/^Uncomplete/i.test(i.t));
const dec=(m||[]).find(i=>/^Decline$/i.test(i.t));
R.declineDisabled=dec?dec.disabled:null;
console.log('\nchosen Complete line; its Decline is disabled:',R.declineDisabled,'(so it holds received or picked parts)');
if(un){await page.mouse.click(un.box.x,un.box.y);await page.waitForTimeout(5000);
  await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];if(!d)return;
    const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Uncomplete|Yes|Confirm|OK|Continue)$/i.test((x.innerText||'').trim()));if(b)b.click();});
  await page.waitForTimeout(6000);await page.reload({waitUntil:'domcontentloaded'});await page.waitForTimeout(10000);
  ls=await lines(page);const now=ls.find(l=>l.id===comp.id);
  R.statusAfter=now?now.badges:null;
  R.after=await snapshot(page);
  console.log('\nstatus after reopen:',JSON.stringify(R.statusAfter),'| rows after:',R.after.length);
  const a=new Set(R.before),b=new Set(R.after);
  R.gone=[...a].filter(x=>!b.has(x)); R.added=[...b].filter(x=>!a.has(x));
  console.log('rows that DISAPPEARED:',JSON.stringify(R.gone.map(x=>x.slice(0,110))));
  console.log('rows that APPEARED  :',JSON.stringify(R.added.map(x=>x.slice(0,110))));
  await page.screenshot({path:`${EV}/p3i-after-reopen.png`,fullPage:true}).catch(()=>{});
  // restore
  await page.evaluate((lid)=>{const row=document.querySelector(`tr.line-row-${lid}`);
    const b=[...row.querySelectorAll('button,.q-btn')].find(x=>/^Complete$/i.test((x.innerText||'').trim()));if(b)b.click();},comp.id);
  await page.waitForTimeout(4500);
  await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];if(!d)return;
    const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Complete|Yes|Confirm|OK|Continue|Pick All)$/i.test((x.innerText||'').trim()));if(b)b.click();});
  await page.waitForTimeout(6000);await page.reload({waitUntil:'domcontentloaded'});await page.waitForTimeout(8000);
  const l3=await lines(page);const back=l3.find(l=>l.id===comp.id);R.restored=back?back.badges:null;
  console.log('restored to:',JSON.stringify(R.restored));}
fs.writeFileSync(`${EV}/p3i-reopen-diff.json`,JSON.stringify(R,null,1));
console.log('\nwritten');
await browser.close();
