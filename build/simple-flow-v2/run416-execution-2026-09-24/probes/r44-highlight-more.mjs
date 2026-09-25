// Two things:
//  (a) C44571 item 2 - does selecting a row highlight the WHOLE line, its story, labour and parts?
//      Measured by background colour on the line row and on the rows that belong to it, not by eye.
//  (b) C44572 is marked as passing, and it asserts "More contains, in order: Authorization required,
//      Split to new work order, Decline". With two approved lines selected I saw More holding ONLY
//      "Split work order". If that holds up, that case is a FALSE PASS - the worst kind, because a
//      false pass is believed for ever. Read More under three different selections before judging.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,page}=await bootProdLogin('/workorders',{settle:12000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
const R={};
await openWo(page,'068f9856-9d28-4500-a3dd-dd6d7aafb15a'); await page.waitForTimeout(8000);
const ids=await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean));
const rowColours=async()=>await page.evaluate(()=>{
  const out=[];let cur=null;
  for(const tr of document.querySelectorAll('tr')){
    const m=(tr.className||'').match(/line-row-([0-9a-f-]+)/);
    if(m) cur=m[1].slice(0,6);
    const r=tr.getBoundingClientRect(); if(!r.width||!r.height) continue;
    const s=getComputedStyle(tr);
    out.push({line:cur, kind:m?'LINE':'child', bg:s.backgroundColor,
      t:(tr.innerText||'').replace(/\s+/g,' ').slice(0,44)});
  } return out;});
const tick=async(id)=>{const tr=page.locator(`tr.line-row-${id}`).first();
  await tr.scrollIntoViewIfNeeded().catch(()=>{});await tr.hover().catch(()=>{});await page.waitForTimeout(900);
  const cb=page.locator(`[data-test-id="line_checkbox_${id}"]`);
  if(await cb.count()){await cb.first().click({timeout:9000}).catch(()=>{});await page.waitForTimeout(1800);} };
const readMore=async()=>{const r=await page.evaluate(()=>{const b=document.querySelector('.bulk-action-bar');
    if(!b)return 'no bar'; const m=[...b.querySelectorAll('button,.q-btn')].find(x=>/^More/.test((x.innerText||'').trim()));
    if(!m)return 'NO More button rendered'; m.click(); return 'opened';});
  if(r!=='opened') return r;
  await page.waitForTimeout(2200);
  const items=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
    return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
      .map(i=>({t:(i.innerText||'').trim(),disabled:i.classList.contains('disabled')||/q-item--disabled/.test(i.className)})):null;});
  await page.keyboard.press('Escape'); await page.waitForTimeout(900); return items;};
const barText=async()=>await page.evaluate(()=>{const b=document.querySelector('.bulk-action-bar');return b?(b.innerText||'').replace(/\s+/g,' ').trim():null;});

// (a) highlight
R.coloursBefore=await rowColours();
await tick(ids[0]);
R.coloursAfter=await rowColours();
const before=new Map(R.coloursBefore.map((r,i)=>[i,r.bg]));
const changed=R.coloursAfter.map((r,i)=>({...r,was:before.get(i)})).filter(r=>r.was&&r.bg!==r.was);
R.highlighted=changed.map(r=>({line:r.line,kind:r.kind,bg:r.bg,was:r.was,t:r.t}));
console.log('=== (a) rows whose background changed when ONE line was ticked ===');
if(!R.highlighted.length) console.log('   none - nothing was highlighted');
for(const r of R.highlighted) console.log('   ',r.kind.padEnd(5),'line',r.line,'|',r.was,'->',r.bg,'|',JSON.stringify(r.t));
await page.screenshot({path:`${EV}/p4d-highlight.png`,clip:{x:290,y:60,width:1390,height:420}}).catch(()=>{});
console.log('   bar:',JSON.stringify(await barText()));
console.log('   More:',JSON.stringify(await readMore()));

// (b) two approved lines
await tick(ids[1]);
R.bar2=await barText(); R.more2=await readMore();
console.log('\n=== (b) two approved lines ===');
console.log('   bar :',JSON.stringify(R.bar2));
console.log('   More:',JSON.stringify(R.more2));

// (c) add a part to the selection
const partCb=await page.evaluate(()=>{const c=[...document.querySelectorAll('[data-test-id^="part_checkbox"], input[type=checkbox]')]
  .filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height;}); return c.length;});
console.log('\n   visible checkboxes on the page:',partCb);
const partIds=await page.evaluate(()=>[...document.querySelectorAll('[data-test-id]')]
  .map(e=>e.getAttribute('data-test-id')).filter(x=>/part.*checkbox|checkbox.*part/i.test(x)).slice(0,5));
console.log('   part checkbox handles:',JSON.stringify(partIds));
if(partIds.length){ await page.evaluate((id)=>{const e=document.querySelector(`[data-test-id="${id}"]`); if(e) e.click();},partIds[0]);
  await page.waitForTimeout(2200);
  R.bar3=await barText(); R.more3=await readMore();
  console.log('   bar with a part added :',JSON.stringify(R.bar3));
  console.log('   More                  :',JSON.stringify(R.more3)); }
fs.writeFileSync(`${EV}/p4d-highlight-more.json`,JSON.stringify(R,null,1));
await browser.close();
