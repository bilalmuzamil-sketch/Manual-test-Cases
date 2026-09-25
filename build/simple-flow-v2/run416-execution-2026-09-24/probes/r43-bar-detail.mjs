// Three questions left on the bulk action bar, each measured rather than eyeballed:
//  (1) The source says the bar "replaces the column headers" and "never covers the work order's own
//      tabs". The bar lands at y=88 and the headers stay at y=138 - so WHAT did it replace? Check the
//      tab labels themselves, one at a time, before and after.
//  (2) close: does it clear the selection AND dismiss the bar, with the headers back?
//  (3) A group holding nothing should render NO divider. Select a line with no parts and count them.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const TABS=['Lines','Parts','Notes','Stats','Finance'];
const {browser,page}=await bootProdLogin('/workorders',{settle:12000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
const R={};
const state=async()=>await page.evaluate((TABS)=>{
  const vis=e=>{if(!e)return false;const r=e.getBoundingClientRect();if(!r.width||!r.height)return false;
    const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&s.opacity!=='0';};
  const bb=e=>{if(!e)return null;const r=e.getBoundingClientRect();return{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};};
  const tabs={};
  for(const name of TABS){
    const el=[...document.querySelectorAll('[role=tab],.q-tab,.q-tab__label,a,div,span')]
      .filter(e=>e.children.length<3 && new RegExp('^'+name+'( \\\\(\\\\d+\\\\))?$').test((e.textContent||'').trim()))
      .find(e=>vis(e));
    tabs[name]=el?{box:bb(el),text:(el.textContent||'').trim()}:null;
  }
  const bar=document.querySelector('.bulk-action-bar');
  const hdr=[...document.querySelectorAll('tr')].find(x=>/Name\/Description/.test(x.innerText||''));
  return { tabs, bar: bar?{box:bb(bar),text:(bar.innerText||'').replace(/\s+/g,' ').trim(),
      dividers:[...bar.querySelectorAll('[class*="divider"]')].filter(vis).map(e=>Math.round(e.getBoundingClientRect().x))}:null,
    header: hdr?{box:bb(hdr),visible:vis(hdr)}:null,
    ticked: document.querySelectorAll('input[type=checkbox]:checked').length };},TABS);
const pick=async(n)=>{const ids=await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean));
  for(const id of ids.slice(0,n)){const tr=page.locator(`tr.line-row-${id}`).first();
    await tr.hover().catch(()=>{});await page.waitForTimeout(800);
    const cb=page.locator(`[data-test-id="line_checkbox_${id}"]`);
    if(await cb.count()){await cb.first().click({timeout:9000}).catch(()=>{});await page.waitForTimeout(1500);} }
  await page.waitForTimeout(2200); return ids;};

await openWo(page,'068f9856-9d28-4500-a3dd-dd6d7aafb15a'); await page.waitForTimeout(8000);
R.before=await state();
console.log('BEFORE any selection:');
for(const t of TABS) console.log('   tab',t.padEnd(8),R.before.tabs[t]?('shown at y='+R.before.tabs[t].box.y+'  "'+R.before.tabs[t].text+'"'):'NOT SHOWN');
console.log('   bar:',R.before.bar?'present':'absent','| column headers visible:',R.before.header&&R.before.header.visible);

await pick(2);
R.selected=await state();
console.log('\nAFTER selecting two lines:');
for(const t of TABS) console.log('   tab',t.padEnd(8),R.selected.tabs[t]?('STILL SHOWN at y='+R.selected.tabs[t].box.y):'GONE');
console.log('   bar at y=',R.selected.bar&&R.selected.bar.box.y,'|',JSON.stringify(R.selected.bar&&R.selected.bar.text));
console.log('   dividers at x:',JSON.stringify(R.selected.bar&&R.selected.bar.dividers));
console.log('   column headers visible:',R.selected.header&&R.selected.header.visible,'at y=',R.selected.header&&R.selected.header.box.y);
await page.screenshot({path:`${EV}/p4c-selected.png`,clip:{x:290,y:50,width:1390,height:200}}).catch(()=>{});

// (2) close
await page.evaluate(()=>{const b=document.querySelector('.bulk-action-bar');
  const c=[...b.querySelectorAll('button,.q-btn,i')].find(x=>/close/.test((x.textContent||'').trim()));if(c)c.click();});
await page.waitForTimeout(3000);
R.afterClose=await state();
console.log('\nAFTER pressing close:');
console.log('   bar:',R.afterClose.bar?'STILL THERE':'dismissed','| ticked boxes:',R.afterClose.ticked,
            '| column headers back:',R.afterClose.header&&R.afterClose.header.visible);
for(const t of TABS) console.log('   tab',t.padEnd(8),R.afterClose.tabs[t]?('back at y='+R.afterClose.tabs[t].box.y):'still gone');
await page.screenshot({path:`${EV}/p4c-after-close.png`,clip:{x:290,y:50,width:1390,height:200}}).catch(()=>{});

// (3) a selection whose parts group is empty - the last line has no parts
const ids=await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean));
const last=ids[ids.length-1];
const tr=page.locator(`tr.line-row-${last}`).first();
await tr.scrollIntoViewIfNeeded().catch(()=>{}); await tr.hover().catch(()=>{}); await page.waitForTimeout(900);
const cb=page.locator(`[data-test-id="line_checkbox_${last}"]`);
if(await cb.count()){await cb.first().click({timeout:9000}).catch(()=>{});await page.waitForTimeout(2500);}
R.oneLine=await state();
console.log('\nONE line selected (its parts group should be empty):');
console.log('   bar reads :',JSON.stringify(R.oneLine.bar&&R.oneLine.bar.text));
console.log('   dividers  :',JSON.stringify(R.oneLine.bar&&R.oneLine.bar.dividers),
            '| count:',(R.oneLine.bar&&R.oneLine.bar.dividers||[]).length);
await page.screenshot({path:`${EV}/p4c-one-line.png`,clip:{x:290,y:50,width:1390,height:200}}).catch(()=>{});
R.deselectAnywhere=await page.evaluate(()=>/Deselect/i.test(document.body.innerText));
console.log('   "Deselect" anywhere on the page:',R.deselectAnywhere);
fs.writeFileSync(`${EV}/p4c-bar-detail.json`,JSON.stringify(R,null,1));
await browser.close();
