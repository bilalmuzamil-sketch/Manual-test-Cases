// "Nothing was highlighted" is a negative and my last method was weak: it compared tr background by
// INDEX, which breaks if rows re-render, and a highlight may live on a td, on a class, or as a left
// border rather than the row's own background. Capture the whole row signature - classes, the row's
// background AND its cells' - keyed by LINE ID, not by position.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,page}=await bootProdLogin('/workorders',{settle:12000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
await openWo(page,'068f9856-9d28-4500-a3dd-dd6d7aafb15a'); await page.waitForTimeout(8000);
const sig=async()=>await page.evaluate(()=>{
  const out=[];let cur='(above the first line)';
  for(const tr of document.querySelectorAll('tr')){
    const m=(tr.className||'').match(/line-row-([0-9a-f-]+)/);
    if(m) cur=m[1].slice(0,8);
    const r=tr.getBoundingClientRect(); if(!r.width||!r.height) continue;
    const s=getComputedStyle(tr);
    const cells=[...tr.querySelectorAll('td')].map(td=>getComputedStyle(td).backgroundColor);
    out.push({ key:cur+'|'+(tr.innerText||'').replace(/\s+/g,' ').slice(0,30),
      line:cur, kind:m?'LINE':'child', cls:(tr.className||'').toString(),
      bg:s.backgroundColor, borderLeft:s.borderLeftWidth+' '+s.borderLeftColor, cells:cells.join(','),
      t:(tr.innerText||'').replace(/\s+/g,' ').slice(0,46) });
  } return out;});
const before=await sig();
const ids=await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean));
const target=ids[0];
const tr=page.locator(`tr.line-row-${target}`).first();
await tr.hover().catch(()=>{}); await page.waitForTimeout(900);
const cb=page.locator(`[data-test-id="line_checkbox_${target}"]`);
await cb.first().click({timeout:9000}).catch(()=>{}); await page.waitForTimeout(2500);
// POSITIVE CONTROL (Rule 104): "nothing was highlighted" means nothing at all unless the tick
// actually registered. The bar only exists while something is selected, so its presence - and the
// checked checkbox - prove the instrument worked before any negative is recorded.
const control=await page.evaluate(()=>{const b=document.querySelector('.bulk-action-bar');
  return { barPresent: !!b, barText: b?(b.innerText||'').replace(/\s+/g,' ').trim():null,
           checkedBoxes: document.querySelectorAll('input[type=checkbox]:checked').length };});
console.log('POSITIVE CONTROL - did the tick register?');
console.log('   bulk bar present :', control.barPresent, '|', JSON.stringify(control.barText));
console.log('   checked boxes    :', control.checkedBoxes);
if(!control.barPresent){ console.log('   >>> the tick did NOT register - this run proves nothing about highlighting'); }
// move the mouse well away so a HOVER highlight is not mistaken for a SELECTION highlight
await page.mouse.move(20,700); await page.waitForTimeout(1500);
const after=await sig();
const B=new Map(before.map(r=>[r.key,r]));
const diffs=[];
for(const r of after){ const b=B.get(r.key); if(!b) continue;
  const changes=[];
  if(b.cls!==r.cls) changes.push('class: "'+b.cls+'" -> "'+r.cls+'"');
  if(b.bg!==r.bg) changes.push('row background: '+b.bg+' -> '+r.bg);
  if(b.cells!==r.cells) changes.push('cell backgrounds changed');
  if(b.borderLeft!==r.borderLeft) changes.push('left border: '+b.borderLeft+' -> '+r.borderLeft);
  if(changes.length) diffs.push({line:r.line,kind:r.kind,t:r.t,changes}); }
console.log('the line that was ticked:',target.slice(0,8));
console.log('\nrows that changed in ANY way (class, row background, cell background, left border):');
if(!diffs.length) console.log('   NONE');
for(const d of diffs) console.log('   ',d.kind.padEnd(5),'line',d.line,'|',JSON.stringify(d.t),'\n        ',d.changes.join('\n         '));
const own=diffs.filter(d=>d.line===target.slice(0,8));
console.log('\nrows belonging to the ticked line that changed:',own.length,'of',after.filter(r=>r.line===target.slice(0,8)).length);
console.log('its rows are:'); for(const r of after.filter(r=>r.line===target.slice(0,8))) console.log('    ',r.kind.padEnd(5),JSON.stringify(r.t),'bg='+r.bg);
await page.screenshot({path:`${EV}/p4e-highlight.png`,clip:{x:290,y:60,width:1390,height:460}}).catch(()=>{});
fs.writeFileSync(`${EV}/p4e-highlight.json`,JSON.stringify({target,diffs,after:after.slice(0,14)},null,1));
await browser.close();
