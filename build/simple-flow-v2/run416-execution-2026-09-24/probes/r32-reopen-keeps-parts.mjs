// The one sub-item left: does a reopened line keep its parts? (C44565 item 2). The last pass found
// "no line with parts" because the part rows only exist in the DOM once the line is EXPANDED.
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
    if(!i||s.has(i))continue;s.add(i);
    o.push({id:i,badges:[...tr.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()),
      buttons:[...tr.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean)});}return o;});}
async function expandAll(page){ const n=await page.evaluate(()=>{let c=0;
    document.querySelectorAll('tr[class*="line-row-"]').forEach(row=>{
      const b=[...row.querySelectorAll('button,.q-btn,i,.q-icon')].find(x=>/expand_more/.test((x.innerText||x.textContent||'').trim()));
      if(b){b.click();c++;}}); return c;});
  await page.waitForTimeout(4000); return n; }
// The part rows are NOT siblings of the line row - the sibling walk exits at once, which is why the
// last pass reported "no line with parts" on a work order that plainly has them. Read the WHOLE work
// order's part list instead and compare it either side of the reopen.
async function allParts(page){return await page.evaluate(()=>[...document.querySelectorAll('tr')]
  .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim())
  .filter(t=>/\b(Received|Picked|In Stock|Awaiting|Ordered|Quoted|Auth To Order)\b/.test(t))
  .map(t=>t.slice(0,130)).sort());}
async function openLineMenu(page,id){const tr=page.locator(`tr.line-row-${id}`).first();
  await tr.scrollIntoViewIfNeeded().catch(()=>{});await tr.hover().catch(()=>{});await page.waitForTimeout(1200);
  const spot=await page.evaluate((lid)=>{const row=document.querySelector(`tr.line-row-${lid}`);if(!row)return null;
    const rb=row.getBoundingClientRect();const c=[];
    document.querySelectorAll('button,.q-btn,i,.q-icon').forEach(b=>{if(!/more_vert/.test((b.innerText||b.textContent||'').trim()))return;
      const r=b.getBoundingClientRect();if(!r.width||!r.height)return;const cy=r.y+r.height/2;
      if(cy>=rb.top-2&&cy<=rb.bottom+2)c.push({x:Math.round(r.x+r.width/2),y:Math.round(cy)});});
    c.sort((a,b)=>a.x-b.x);return c[0]||null;},id);
  if(!spot)return null;await page.mouse.click(spot.x,spot.y).catch(()=>{});await page.waitForTimeout(1900);return await vmenu(page);}

const {browser,page}=await bootProdLogin('/workorders',{settle:11000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(25000);
const R={};
await openWo(page,'068f9856-9d28-4500-a3dd-dd6d7aafb15a'); await page.waitForTimeout(7000);
console.log('expanded', await expandAll(page), 'lines');
let ls=await lines(page); let target=null;
// a line that HOLDS parts is the one whose own menu offers "Receive parts (n)"
for(const l of ls){ const mm=await openLineMenu(page,l.id);
  const rp=(mm||[]).find(i=>/^Receive parts \(/i.test(i.t));
  console.log('  line',l.badges.join('+'),'->',rp?rp.t:'no parts waiting');
  await page.keyboard.press('Escape'); await page.waitForTimeout(700);
  if(rp&&!target){target={...l,holds:rp.t};} }
if(!target){console.log('no line holds parts'); await browser.close(); process.exit(0);}
R.line=target.badges.join('+'); R.holds=target.holds; R.partsBefore=await allParts(page);
console.log('\nchosen line:',R.line,'\n  parts before:',JSON.stringify(R.partsBefore));
await page.evaluate((lid)=>{const row=document.querySelector(`tr.line-row-${lid}`);
  const b=[...row.querySelectorAll('button,.q-btn')].find(x=>/^Complete$/i.test((x.innerText||'').trim()));if(b)b.click();},target.id);
await page.waitForTimeout(5000);
R.completeDialog=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
  if(!d)return null;const o=(d.innerText||'').replace(/\s+/g,' ').slice(0,250);
  const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Complete|Yes|Confirm|OK|Continue|Finish)$/i.test((x.innerText||'').trim()));if(b)b.click();return o;});
console.log('  complete dialog:',JSON.stringify(R.completeDialog));
await page.waitForTimeout(6000);await page.reload({waitUntil:'domcontentloaded'});await page.waitForTimeout(9000);
await expandAll(page);
ls=await lines(page);let now=ls.find(l=>l.id===target.id);
R.afterComplete=now?now.badges:null;console.log('  status after Complete:',JSON.stringify(R.afterComplete));
const m=await openLineMenu(page,target.id);
const un=(m||[]).find(i=>/^Uncomplete/i.test(i.t));
console.log('  Uncomplete offered:',!!un);
if(un){await page.mouse.click(un.box.x,un.box.y);await page.waitForTimeout(5000);
  await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];if(!d)return;
    const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Uncomplete|Yes|Confirm|OK|Continue)$/i.test((x.innerText||'').trim()));if(b)b.click();});
  await page.waitForTimeout(6000);await page.reload({waitUntil:'domcontentloaded'});await page.waitForTimeout(9000);
  await expandAll(page);
  ls=await lines(page);now=ls.find(l=>l.id===target.id);
  R.afterReopen=now?now.badges:null;R.partsAfter=await allParts(page);
  R.partsSame=JSON.stringify(R.partsBefore)===JSON.stringify(R.partsAfter);
  console.log('\n  status after reopen:',JSON.stringify(R.afterReopen));
  console.log('  parts after       :',JSON.stringify(R.partsAfter));
  console.log('  PARTS UNCHANGED   :',R.partsSame);
  await page.screenshot({path:`${EV}/p3h-reopen-keeps-parts.png`,fullPage:true}).catch(()=>{});}
fs.writeFileSync(`${EV}/p3h-reopen-keeps-parts.json`,JSON.stringify(R,null,1));
console.log('\nwritten');
await browser.close();
