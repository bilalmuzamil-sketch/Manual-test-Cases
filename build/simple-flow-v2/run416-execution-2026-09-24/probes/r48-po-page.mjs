// Re-test the three purchase-order failures on the CURRENT build (the branch moved to v26.39.1).
//   C44589 - is the list grouped by vendor, with collapsed groups and rollups?
//   C44590 - does a row expand into a per-purchase-order panel?
//   C53488 - what does selecting rows actually raise? My note said "a bar with nothing in it but a
//            cross", and the equivalent claim on the work order turned out to be my own selector.
// Same discipline as the work-order bar: find the bar by its own class, list EVERY element that owns
// text, open More, and prove the tick registered before calling anything empty.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const APP='https://app.shopview.com';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,page}=await bootProdLogin('/parts/orders',{settle:14000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
const R={};
await page.waitForTimeout(6000);
R.url=page.url();
console.log('on:',R.url);

// ---- C44589: grouping, rollups, collapse ----
R.layout=await page.evaluate(()=>{
  const heads=[...document.querySelectorAll('th')].map(t=>(t.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean);
  const rows=[...document.querySelectorAll('tbody tr')].filter(t=>t.getBoundingClientRect().height).length;
  const txt=document.body.innerText;
  return { columnHeadings:heads, bodyRows:rows,
    expandAll:/Expand all/i.test(txt), vendorMissing:/Vendor [Mm]issing/.test(txt),
    rollupLike:(txt.match(/\d+\s+POs?,\s*\d+\s+parts?/g)||[]),
    groupHeaderElements:[...document.querySelectorAll('[class*="group"]')].filter(e=>e.getBoundingClientRect().height)
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').slice(0,60)).slice(0,8),
    collapsedControls:[...document.querySelectorAll('[class*="expand"],[aria-expanded]')].filter(e=>e.getBoundingClientRect().height)
      .map(e=>({t:(e.innerText||'').trim().slice(0,24),exp:e.getAttribute('aria-expanded')})).slice(0,8) };});
console.log('\n=== C44589 layout ===');
console.log('  column headings:',JSON.stringify(R.layout.columnHeadings));
console.log('  rows in the table:',R.layout.bodyRows);
console.log('  "Expand all" present:',R.layout.expandAll,'| vendor-missing wording:',R.layout.vendorMissing);
console.log('  rollups like "3 POs, 6 parts":',JSON.stringify(R.layout.rollupLike));
console.log('  anything that looks like a group header:',JSON.stringify(R.layout.groupHeaderElements));
await page.screenshot({path:`${EV}/p5a-po-list.png`,fullPage:false}).catch(()=>{});

// ---- C44590: does a row expand? ----
const firstRow=await page.evaluate(()=>{const r=[...document.querySelectorAll('tbody tr')].filter(t=>t.getBoundingClientRect().height)[0];
  if(!r)return null; const b=r.getBoundingClientRect();
  return {y:Math.round(b.y+b.height/2),x:Math.round(b.x+b.width/2),t:(r.innerText||'').replace(/\s+/g,' ').slice(0,90),
    buttons:[...r.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean)};});
console.log('\n=== C44590 expand ===');
console.log('  first row:',JSON.stringify(firstRow));
if(firstRow){
  const rowsBefore=await page.evaluate(()=>document.querySelectorAll('tbody tr').length);
  await page.mouse.click(firstRow.x,firstRow.y); await page.waitForTimeout(3500);
  const after=await page.evaluate(()=>({rows:document.querySelectorAll('tbody tr').length,
    dialog:(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
      return d?(d.innerText||'').replace(/\s+/g,' ').slice(0,160):null;})(),
    panelWords:['vendor invoice','invoice date','delivery note','Receive parts','Deselect all']
      .filter(w=>new RegExp(w,'i').test(document.body.innerText))}));
  R.expand={rowsBefore,...after};
  console.log('  rows before',rowsBefore,'-> after',after.rows,'| a dialog opened:',after.dialog?('yes: '+after.dialog.slice(0,80)):'no');
  console.log('  panel wording found on the page:',JSON.stringify(after.panelWords));
  await page.screenshot({path:`${EV}/p5a-po-rowclick.png`}).catch(()=>{});
  if(after.dialog) { await page.keyboard.press('Escape'); await page.waitForTimeout(2000); }
}
// ---- C53488: select rows and read the bar PROPERLY ----
await page.goto(`${APP}/parts/orders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
const ticked=await page.evaluate(()=>{const boxes=[...document.querySelectorAll('tbody tr')]
    .map(r=>r.querySelector('.q-checkbox,[type=checkbox],[data-test-id*="checkbox"]')).filter(Boolean);
  boxes.slice(0,2).forEach(b=>b.click()); return boxes.length;});
console.log('\n=== C53488 selection ===');
console.log('  row tick boxes found:',ticked);
await page.waitForTimeout(3000);
R.bar=await page.evaluate(()=>{
  const bar=document.querySelector('[class*="bulk-action-bar"]:not([class*="__"])')||document.querySelector('[class*="bulk-action-bar"]');
  if(!bar) return {found:false, anySelectedText:/\d+\s+selected/i.test(document.body.innerText)};
  const walk=(e,out)=>{for(const c of e.children){const own=[...c.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(' ').trim();
      const t=own||(c.children.length===0?(c.textContent||'').trim():''); const r=c.getBoundingClientRect();
      if(t&&r.width&&r.height) out.push({t:t.replace(/\s+/g,' ').slice(0,40),x:Math.round(r.x),cls:(c.className||'').toString().slice(0,40)});
      walk(c,out);} return out;};
  return {found:true, cls:(bar.className||'').toString(), text:(bar.innerText||'').replace(/\s+/g,' ').trim(),
    items:walk(bar,[]).sort((a,b)=>a.x-b.x),
    dividers:[...bar.querySelectorAll('[class*="divider"]')].filter(e=>e.getBoundingClientRect().width||e.getBoundingClientRect().height).length,
    buttons:[...bar.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean)};});
console.log('  bar found:',R.bar.found,'| class:',R.bar.cls||'-');
console.log('  bar reads:',JSON.stringify(R.bar.text||R.bar.anySelectedText));
console.log('  buttons  :',JSON.stringify(R.bar.buttons));
console.log('  dividers :',R.bar.dividers);
if(R.bar.items) { console.log('  every text element in the bar:');
  for(const i of R.bar.items) console.log('     x='+String(i.x).padStart(5),JSON.stringify(i.t)); }
await page.screenshot({path:`${EV}/p5a-po-bar.png`}).catch(()=>{});
if(R.bar.found){
  const m=await page.evaluate(()=>{const b=document.querySelector('[class*="bulk-action-bar"]');
    const x=[...b.querySelectorAll('button,.q-btn')].find(e=>/^More/.test((e.innerText||'').trim())); if(!x)return 'NO More button'; x.click(); return 'opened';});
  if(m==='opened'){await page.waitForTimeout(2200);
    R.more=await page.evaluate(()=>{const mm=[...document.querySelectorAll('.q-menu')].filter(x=>{const r=x.getBoundingClientRect();return r.width>20&&r.height>20;}).pop();
      return mm?[...mm.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width).map(i=>(i.innerText||'').trim()):null;});
    console.log('  More holds:',JSON.stringify(R.more));}
  else console.log('  More:',m);
}
fs.writeFileSync(`${EV}/p5a-po-page.json`,JSON.stringify(R,null,1));
await browser.close();
