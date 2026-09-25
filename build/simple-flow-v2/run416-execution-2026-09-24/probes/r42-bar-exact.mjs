// The divider's class gave away the bar's real handle: bulk-action-bar. Stop guessing the container
// by "smallest element containing the word selected" - that heuristic swept in the whole tab strip and
// made the geometry unreadable. Target the component itself, and record x AND y for everything.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,page}=await bootProdLogin('/workorders',{settle:12000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
const R={};
await openWo(page,'068f9856-9d28-4500-a3dd-dd6d7aafb15a'); await page.waitForTimeout(8000);
const snap=async(tag)=>await page.evaluate((t)=>{
  const _tag=t;
  const bb=e=>{if(!e)return null;const r=e.getBoundingClientRect();return{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};};
  const vis=e=>{if(!e)return false;const r=e.getBoundingClientRect();if(!r.width||!r.height)return false;
    const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&s.opacity!=='0';};
  const bar=document.querySelector('[class*="bulk-action-bar"]:not([class*="__"])')||document.querySelector('[class*="bulk-action-bar"]');
  const hdr=[...document.querySelectorAll('tr')].find(x=>/Name\/Description/.test(x.innerText||''));
  const tabs=[...document.querySelectorAll('*')].find(x=>/^Lines \(\d+\)/.test((x.innerText||'').trim())&&x.children.length<12);
  return { tag:_tag,
    bar: bar?{box:bb(bar),cls:(bar.className||'').toString(),text:(bar.innerText||'').replace(/\s+/g,' ').trim(),visible:vis(bar)}:null,
    header: hdr?{box:bb(hdr),visible:vis(hdr),text:(hdr.innerText||'').replace(/\s+/g,' ').trim().slice(0,90)}:null,
    tabs: tabs?{box:bb(tabs),visible:vis(tabs),text:(tabs.innerText||'').replace(/\s+/g,' ').trim().slice(0,90)}:null,
    firstLine: bb(document.querySelector('tr[class*="line-row-"]')),
    barChildren: bar?[...bar.querySelectorAll('*')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height;})
      .map(e=>{const r=e.getBoundingClientRect();const own=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(' ').trim();
        return own||e.children.length===0?{t:(own||(e.textContent||'').trim()).replace(/\s+/g,' ').slice(0,40),x:Math.round(r.x),y:Math.round(r.y),cls:(e.className||'').toString().slice(0,44)}:null;})
      .filter(Boolean):[] };},tag);

R.before=await snap('before');
console.log('BEFORE  bar:',R.before.bar?'present':'ABSENT','| header:',JSON.stringify(R.before.header&&R.before.header.box),'| tabs:',JSON.stringify(R.before.tabs&&R.before.tabs.box));
const ids=await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean));
for(const id of ids.slice(0,2)){const tr=page.locator(`tr.line-row-${id}`).first();
  await tr.hover().catch(()=>{});await page.waitForTimeout(900);
  const cb=page.locator(`[data-test-id="line_checkbox_${id}"]`);
  if(await cb.count()){await cb.first().click({timeout:9000}).catch(()=>{});await page.waitForTimeout(1600);} }
await page.waitForTimeout(2500);
R.after=await snap('after');
console.log('\nAFTER selecting two lines');
console.log('  BAR    box:',JSON.stringify(R.after.bar&&R.after.bar.box),'\n         cls:',R.after.bar&&R.after.bar.cls,'\n         text:',JSON.stringify(R.after.bar&&R.after.bar.text));
console.log('  HEADER box:',JSON.stringify(R.after.header&&R.after.header.box),'visible:',R.after.header&&R.after.header.visible);
console.log('  TABS   box:',JSON.stringify(R.after.tabs&&R.after.tabs.box),'visible:',R.after.tabs&&R.after.tabs.visible,'|',JSON.stringify(R.after.tabs&&R.after.tabs.text));
console.log('  first line: before',JSON.stringify(R.before.firstLine),'after',JSON.stringify(R.after.firstLine));
console.log('\n  inside the bar, in order (x,y):');
const seen=new Set();
for(const c of (R.after.barChildren||[]).sort((a,b)=>a.x-b.x)){ if(!c.t||seen.has(c.t+c.x))continue; seen.add(c.t+c.x);
  console.log('    x='+String(c.x).padStart(5),'y='+String(c.y).padStart(4),JSON.stringify(c.t),c.cls?('· '+c.cls):''); }
// does the bar OVERLAP the tabs or the header?
const ov=(a,b)=>!a||!b?null:!(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y);
R.overlapsTabs=ov(R.after.bar&&R.after.bar.box,R.after.tabs&&R.after.tabs.box);
R.overlapsHeader=ov(R.after.bar&&R.after.bar.box,R.after.header&&R.after.header.box);
R.headerStillVisible=R.after.header&&R.after.header.visible;
R.pageShifted=JSON.stringify(R.before.firstLine)!==JSON.stringify(R.after.firstLine);
console.log('\n  bar overlaps the work order tabs :',R.overlapsTabs);
console.log('  bar overlaps the column headers  :',R.overlapsHeader);
console.log('  column headers still visible     :',R.headerStillVisible);
console.log('  anything on the page shifted     :',R.pageShifted);
R.deselect=await page.evaluate(()=>/Deselect/i.test(document.body.innerText));
console.log('  the words "Deselect all" anywhere:',R.deselect);
await page.screenshot({path:`${EV}/p4b-bar.png`}).catch(()=>{});
await page.screenshot({path:`${EV}/p4b-bar-crop.png`,clip:{x:300,y:60,width:1380,height:220}}).catch(()=>{});
fs.writeFileSync(`${EV}/p4b-bar-exact.json`,JSON.stringify(R,null,1));
await browser.close();
