// C44572 is marked as PASSING and says More holds, in order: Authorization required, Split to new work
// order, Decline. Two selections today gave More with ONE item. Before calling a passing check wrong -
// which is the most expensive kind of mistake to get backwards - run the selections the case actually
// describes: every open line, and a selection that includes a PART (whose tick box only exists while
// its row is hovered, which is why the last pass counted zero part checkboxes).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,page}=await bootProdLogin('/workorders',{settle:12000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
const R={};
await openWo(page,'068f9856-9d28-4500-a3dd-dd6d7aafb15a'); await page.waitForTimeout(8000);
const bar=async()=>await page.evaluate(()=>{const b=document.querySelector('.bulk-action-bar');return b?(b.innerText||'').replace(/\s+/g,' ').trim():null;});
const more=async()=>{const r=await page.evaluate(()=>{const b=document.querySelector('.bulk-action-bar');
    if(!b)return 'no bar';const m=[...b.querySelectorAll('button,.q-btn')].find(x=>/^More/.test((x.innerText||'').trim()));
    if(!m)return 'NO More button';m.click();return 'opened';});
  if(r!=='opened')return r; await page.waitForTimeout(2200);
  const it=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
    return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
      .map(i=>(i.innerText||'').trim()+(i.classList.contains('disabled')||/q-item--disabled/.test(i.className)?' [disabled]':'')):null;});
  await page.keyboard.press('Escape');await page.waitForTimeout(800);return it;};
const ids=await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean));

// (1) EVERY open line
for(const id of ids){const tr=page.locator(`tr.line-row-${id}`).first();
  await tr.scrollIntoViewIfNeeded().catch(()=>{});await tr.hover().catch(()=>{});await page.waitForTimeout(700);
  const cb=page.locator(`[data-test-id="line_checkbox_${id}"]`);
  if(await cb.count()){await cb.first().click({timeout:9000}).catch(()=>{});await page.waitForTimeout(1200);} }
await page.waitForTimeout(2500);
R.allLinesBar=await bar(); R.allLinesMore=await more();
console.log('=== every open line selected ('+ids.length+') ===');
console.log('   bar :',JSON.stringify(R.allLinesBar));
console.log('   More:',JSON.stringify(R.allLinesMore));
await page.screenshot({path:`${EV}/p4f-all-lines.png`,clip:{x:290,y:60,width:1390,height:200}}).catch(()=>{});

// (2) what tick boxes does a PART row expose when hovered?
const partRow=await page.evaluate(()=>{const rows=[...document.querySelectorAll('tr')]
    .filter(t=>/drag_indicator/.test(t.innerText||'')&&!/line-row-/.test(t.className||''));
  if(!rows.length)return null; const r=rows[0].getBoundingClientRect();
  return {y:Math.round(r.y+r.height/2), x:Math.round(r.x+40), t:(rows[0].innerText||'').replace(/\s+/g,' ').slice(0,60)};});
console.log('\n   first part row:',JSON.stringify(partRow));
if(partRow){
  await page.mouse.move(partRow.x,partRow.y); await page.waitForTimeout(1500);
  R.partHandles=await page.evaluate(()=>[...document.querySelectorAll('[data-test-id]')]
    .filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height;})
    .map(e=>e.getAttribute('data-test-id')).filter(x=>/check/i.test(x)).slice(0,12));
  console.log('   tick-box handles visible while that part row is hovered:',JSON.stringify(R.partHandles));
  const partCb=(R.partHandles||[]).find(h=>!/line_checkbox/.test(h));
  if(partCb){ await page.evaluate((h)=>{const e=document.querySelector(`[data-test-id="${h}"]`); if(e)e.click();},partCb);
    await page.waitForTimeout(2500);
    R.withPartBar=await bar(); R.withPartMore=await more();
    console.log('\n=== with a part added to the selection ===');
    console.log('   bar :',JSON.stringify(R.withPartBar));
    console.log('   More:',JSON.stringify(R.withPartMore));
    await page.screenshot({path:`${EV}/p4f-with-part.png`,clip:{x:290,y:60,width:1390,height:200}}).catch(()=>{}); }
  else console.log('   no part tick box appeared on hover - cannot add a part this way');
}
fs.writeFileSync(`${EV}/p4f-more-contents.json`,JSON.stringify(R,null,1));
await browser.close();
