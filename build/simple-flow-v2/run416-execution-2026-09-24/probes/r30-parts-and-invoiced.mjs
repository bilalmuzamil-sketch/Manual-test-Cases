// Close the last gaps on Problem 3:
//  1. Is Complete ever disabled for a parts reason? (C44565 item 1) - look at an Approved line that
//     still has outstanding parts and read the button's own state, not the page's look.
//  2. Does a reopen leave the parts alone? (C44565 item 2) - EXPAND the line first; the part rows are
//     inside the expanded area, which is why the last pass saw an empty list on a line that has parts.
//  3. Is Uncomplete blocked once the work order is invoiced or paid? (C44602 item 3) - the QA lead's
//     own point 2026-09-25. Find an invoiced work order and read the menu there.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
async function vmenu(page){ return await page.evaluate(()=>{
  const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const r=x.getBoundingClientRect();return r.width>20&&r.height>20;});
  if(!m.length)return null; const el=m[m.length-1];
  return [...el.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width).map(i=>({
    t:(i.innerText||'').trim().replace(/\s+/g,' '),disabled:i.classList.contains('disabled')||/q-item--disabled/.test(i.className),
    box:(()=>{const r=i.getBoundingClientRect();return{x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};})()})).filter(i=>i.t);});}
async function lines(page){ return await page.evaluate(()=>{const s=new Set(),o=[];
  for(const tr of document.querySelectorAll('tr[class*="line-row-"]')){const i=(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1];
    if(!i||s.has(i))continue;s.add(i);const r=tr.getBoundingClientRect();
    o.push({id:i,badges:[...tr.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()),top:Math.round(r.top),bottom:Math.round(r.bottom),
      buttons:[...tr.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>({
        t:(b.innerText||'').replace(/\s+/g,' ').trim(),
        disabled:b.disabled===true||b.getAttribute('aria-disabled')==='true'||/disabled/.test(b.className||'')})).filter(b=>b.t)});} return o;});}
async function openLineMenu(page,id){ const tr=page.locator(`tr.line-row-${id}`).first();
  await tr.scrollIntoViewIfNeeded().catch(()=>{}); await tr.hover().catch(()=>{}); await page.waitForTimeout(1200);
  const spot=await page.evaluate((lid)=>{const row=document.querySelector(`tr.line-row-${lid}`); if(!row)return null;
    const rb=row.getBoundingClientRect(); const c=[];
    document.querySelectorAll('button,.q-btn,i,.q-icon').forEach(b=>{ if(!/more_vert/.test((b.innerText||b.textContent||'').trim()))return;
      const r=b.getBoundingClientRect(); if(!r.width||!r.height)return; const cy=r.y+r.height/2;
      if(cy>=rb.top-2&&cy<=rb.bottom+2) c.push({x:Math.round(r.x+r.width/2),y:Math.round(cy)});});
    c.sort((a,b)=>a.x-b.x); return c[0]||null;},id);
  if(!spot)return null; await page.mouse.click(spot.x,spot.y).catch(()=>{}); await page.waitForTimeout(1900);
  return await vmenu(page);}
// expand every line so the part rows are actually on screen
async function expandAll(page){ const ids=(await lines(page)).map(l=>l.id);
  for(const id of ids){ await page.evaluate((lid)=>{const row=document.querySelector(`tr.line-row-${lid}`); if(!row)return;
    const b=[...row.querySelectorAll('button,.q-btn,i')].find(x=>/expand_more/.test((x.innerText||x.textContent||'').trim())); if(b)b.click();},id);
    await page.waitForTimeout(900);} await page.waitForTimeout(2500);}
async function parts(page){ return await page.evaluate(()=>[...document.querySelectorAll('tr')]
  .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim())
  .filter(t=>/\b(Received|Picked|In Stock|Awaiting|Ordered|Quoted|Auth To Order|Core)\b/.test(t) && !/line-row/.test(t)).slice(0,14));}

const { browser, page } = await bootProdLogin('/workorders',{settle:11000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(25000);
const R={};
const S908='068f9856-9d28-4500-a3dd-dd6d7aafb15a', S810='fe72110c-7ff6-47f8-8f83-e3ea447a5280';

// ---- 1. Complete on an approved line that still has outstanding parts ----
await openWo(page,S908); await page.waitForTimeout(7000); await expandAll(page);
const l908=await lines(page);
R.completeButtons = l908.map(l=>({status:l.badges.join('+'), buttons:l.buttons}));
R.partsOn908 = await parts(page);
console.log('=== 1. approved lines and their buttons:');
for(const l of R.completeButtons) console.log('   ', l.status, '->', JSON.stringify(l.buttons));
console.log('   outstanding parts present:', JSON.stringify(R.partsOn908.slice(0,6)));
R.completeEverDisabled = R.completeButtons.some(l=>l.buttons.some(b=>/^Complete$/i.test(b.t)&&b.disabled));
console.log('   Complete disabled anywhere:', R.completeEverDisabled);
await page.screenshot({path:`${EV}/p3f-complete-enabled.png`,fullPage:true}).catch(()=>{});

// ---- 2. reopen with REAL parts on the line ----
await openWo(page,S810); await page.waitForTimeout(7000); await expandAll(page);
R.partsBefore = await parts(page);
console.log('\n=== 2. S2-810 parts BEFORE:', JSON.stringify(R.partsBefore));
let ls=await lines(page);
const comp=ls.find(l=>l.badges.some(b=>/^Complete$/i.test(b)));
const menu=await openLineMenu(page,comp.id);
const un=(menu||[]).find(i=>/^Uncomplete/i.test(i.t));
if(un){ await page.mouse.click(un.box.x,un.box.y); await page.waitForTimeout(5000);
  await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0]; if(!d)return;
    const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Uncomplete|Yes|Confirm|OK|Continue)$/i.test((x.innerText||'').trim())); if(b)b.click();});
  await page.waitForTimeout(5000); await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000); await expandAll(page);
  ls=await lines(page); const now=ls.find(l=>l.id===comp.id);
  R.statusAfter = now?now.badges:null; R.partsAfter = await parts(page);
  R.partsSame = JSON.stringify(R.partsBefore)===JSON.stringify(R.partsAfter);
  console.log('   status after reopen:', JSON.stringify(R.statusAfter));
  console.log('   parts AFTER :', JSON.stringify(R.partsAfter));
  console.log('   parts identical:', R.partsSame);
  await page.screenshot({path:`${EV}/p3f-parts-after-reopen.png`,fullPage:true}).catch(()=>{});
  // restore
  if(now){ await page.evaluate((lid)=>{const row=document.querySelector(`tr.line-row-${lid}`);
      const b=[...row.querySelectorAll('button,.q-btn')].find(x=>/^Complete$/i.test((x.innerText||'').trim())); if(b)b.click();},now.id);
    await page.waitForTimeout(4000);
    await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0]; if(!d)return;
      const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Complete|Yes|Confirm|OK|Continue)$/i.test((x.innerText||'').trim())); if(b)b.click();});
    await page.waitForTimeout(5000); await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(7000);
    const l3=await lines(page); const back=l3.find(l=>l.id===comp.id); R.restored=back?back.badges:null;
    console.log('   restored to:', JSON.stringify(R.restored)); }
}
// ---- 3. an INVOICED work order: is Uncomplete blocked there? ----
const wos = await page.evaluate(async()=>{ const r=await fetch('/api/work-orders?pagination[rowsPerPage]=60&pagination[page]=1&search=&showMyWorkOrders=0',{headers:{Accept:'application/json'}});
  const j=await r.json(); return (j.data?.work_orders||[]).map(w=>({id:w.id,num:w.work_order_number||w.number,st:w.status||w.state,inv:w.invoice_id||w.invoiced||w.is_invoiced||null}));});
R.invoicedCandidates = wos.filter(w=>/invoic|paid/i.test(JSON.stringify(w))).slice(0,8);
console.log('\n=== 3. work orders that look invoiced/paid:', JSON.stringify(R.invoicedCandidates));
for (const w of R.invoicedCandidates.slice(0,3)) {
  await openWo(page,w.id); await page.waitForTimeout(7000);
  const li=await lines(page); const c=li.find(l=>l.badges.some(b=>/^Complete$/i.test(b)))||li[0];
  if(!c) continue;
  const m=await openLineMenu(page,c.id);
  const u=(m||[]).find(i=>/^Uncomplete/i.test(i.t));
  R.invoiced = R.invoiced||[];
  R.invoiced.push({wo:w.num, status:c.badges.join('+'), menu:(m||[]).map(i=>i.t+(i.disabled?' [disabled]':'')), uncompleteOffered:!!u, uncompleteDisabled:u?u.disabled:null});
  console.log('   ', w.num, c.badges.join('+'), '-> Uncomplete offered:', !!u, 'disabled:', u?u.disabled:'n/a');
  await page.screenshot({path:`${EV}/p3f-invoiced-${w.num}.png`}).catch(()=>{});
  await page.keyboard.press('Escape'); await page.waitForTimeout(700);
}
fs.writeFileSync(`${EV}/p3f-parts-invoiced.json`, JSON.stringify(R,null,1));
console.log('\nwritten');
await browser.close();
