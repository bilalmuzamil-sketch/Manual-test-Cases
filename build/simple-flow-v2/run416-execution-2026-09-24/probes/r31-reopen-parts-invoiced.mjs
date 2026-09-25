// Last two gaps on Problem 3.
//  2b. Reopen a line THAT HOLDS PARTS and compare the parts either side. S2-810's completed line has
//      no parts of its own, so complete a line on S2-908 (which does) and reopen that one.
//  3.  Is Uncomplete blocked once the work order is invoiced or paid, as the QA lead says? Read the
//      work-order list through ctx.request on the API host - an in-page fetch('/api/..') hits
//      app.shopview.com and comes back as the SPA's HTML, which is not a fact about the API.
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
    if(!i||s.has(i))continue;s.add(i);
    o.push({id:i,badges:[...tr.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()),
      buttons:[...tr.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width)
        .map(b=>({t:(b.innerText||'').replace(/\s+/g,' ').trim(),disabled:b.disabled===true||/disabled/.test(b.className||'')})).filter(b=>b.t)});} return o;});}
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
// the part rows that belong to ONE line, read from that line's own block
async function partsOfLine(page,lid){ return await page.evaluate((id)=>{
  const row=document.querySelector(`tr.line-row-${id}`); if(!row) return null;
  const out=[]; let n=row.nextElementSibling;
  while(n && !/line-row-/.test(n.className||'')){ const t=(n.innerText||'').replace(/\s+/g,' ').trim();
    if(t && /\b(Received|Picked|In Stock|Awaiting|Ordered|Quoted|Auth To Order|Core)\b/.test(t)) out.push(t.slice(0,120));
    n=n.nextElementSibling; }
  return out; },lid);}

const { browser, ctx, page, APIH } = await bootProdLogin('/workorders',{settle:11000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(25000);
const g=async p=>{const r=await ctx.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
  const t=await r.text(); let j=null; try{j=JSON.parse(t);}catch{} return {s:r.status(),j};};
const R={}; const S908='068f9856-9d28-4500-a3dd-dd6d7aafb15a';

// ---- 2b. complete a line that holds parts, then reopen it ----
await openWo(page,S908); await page.waitForTimeout(7000);
let ls=await lines(page);
let target=null;
for(const l of ls){ const p=await partsOfLine(page,l.id); if(p&&p.length){ target={...l,parts:p}; break; } }
console.log('=== 2b. line with parts:', target? target.badges.join('+') : 'none found');
if(target){
  console.log('   its parts:', JSON.stringify(target.parts));
  R.partsBefore=target.parts;
  // complete it
  await page.evaluate((lid)=>{const row=document.querySelector(`tr.line-row-${lid}`);
    const b=[...row.querySelectorAll('button,.q-btn')].find(x=>/^Complete$/i.test((x.innerText||'').trim())); if(b)b.click();},target.id);
  await page.waitForTimeout(4500);
  const wiz=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
    if(!d)return null; const o={text:(d.innerText||'').replace(/\s+/g,' ').slice(0,260),buttons:[...d.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').trim()).filter(Boolean)};
    const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Complete|Yes|Confirm|OK|Continue|Finish)$/i.test((x.innerText||'').trim())); if(b)b.click(); return o;});
  console.log('   complete dialog:', JSON.stringify(wiz));
  await page.waitForTimeout(6000); await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
  ls=await lines(page); let now=ls.find(l=>l.id===target.id);
  R.statusAfterComplete=now?now.badges:null;
  console.log('   status after Complete:', JSON.stringify(R.statusAfterComplete));
  // now reopen it
  const m=await openLineMenu(page,target.id);
  const un=(m||[]).find(i=>/^Uncomplete/i.test(i.t));
  console.log('   Uncomplete offered on it:', !!un);
  if(un){ await page.mouse.click(un.box.x,un.box.y); await page.waitForTimeout(4500);
    await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0]; if(!d)return;
      const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Uncomplete|Yes|Confirm|OK|Continue)$/i.test((x.innerText||'').trim())); if(b)b.click();});
    await page.waitForTimeout(6000); await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
    ls=await lines(page); now=ls.find(l=>l.id===target.id);
    R.statusAfterReopen=now?now.badges:null;
    R.partsAfter=await partsOfLine(page,target.id);
    R.partsSame=JSON.stringify(R.partsBefore)===JSON.stringify(R.partsAfter);
    console.log('   status after reopen:', JSON.stringify(R.statusAfterReopen));
    console.log('   its parts after   :', JSON.stringify(R.partsAfter));
    console.log('   PARTS UNCHANGED   :', R.partsSame);
    await page.screenshot({path:`${EV}/p3g-reopen-with-parts.png`,fullPage:true}).catch(()=>{}); }
}
// ---- 3. an invoiced / paid work order ----
const wo=await g('/api/work-orders?pagination%5BrowsPerPage%5D=100&pagination%5Bpage%5D=1&search=&showMyWorkOrders=0');
const arr=wo.j?.data?.work_orders||[];
const statuses={}; for(const w of arr){const s=w.status?.label||w.status?.value||w.status||'?'; statuses[s]=(statuses[s]||0)+1;}
console.log('\n=== 3. work-order statuses on the branch:', JSON.stringify(statuses));
const inv=arr.filter(w=>/invoic|paid/i.test(w.status?.label||w.status?.value||w.status||'')).slice(0,4);
R.invoicedFound=inv.map(w=>({num:w.work_order_number||w.number,status:w.status?.label||w.status}));
console.log('   invoiced/paid ones:', JSON.stringify(R.invoicedFound));
R.invoiced=[];
for(const w of inv.slice(0,3)){
  await openWo(page,w.id); await page.waitForTimeout(7000);
  const li=await lines(page); const c=li.find(l=>l.badges.some(b=>/^Complete$/i.test(b)))||li[0];
  if(!c){ console.log('   ', w.work_order_number,'- no lines'); continue; }
  const m=await openLineMenu(page,c.id);
  const u=(m||[]).find(i=>/^Uncomplete/i.test(i.t));
  R.invoiced.push({wo:w.work_order_number||w.number,status:w.status?.label||w.status,line:c.badges.join('+'),
    menu:(m||[]).map(i=>i.t+(i.disabled?' [disabled]':'')),uncompleteOffered:!!u,uncompleteDisabled:u?u.disabled:null});
  console.log('   ',w.work_order_number,'|line',c.badges.join('+'),'-> Uncomplete offered:',!!u,'disabled:',u?u.disabled:'n/a');
  console.log('      menu:',JSON.stringify((m||[]).map(i=>i.t+(i.disabled?' [d]':''))));
  await page.screenshot({path:`${EV}/p3g-invoiced-${w.work_order_number}.png`}).catch(()=>{});
  await page.keyboard.press('Escape'); await page.waitForTimeout(700);
}
fs.writeFileSync(`${EV}/p3g-reopen-invoiced.json`,JSON.stringify(R,null,1));
console.log('\nwritten');
await browser.close();
