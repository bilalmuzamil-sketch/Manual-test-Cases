// S2-908 is now INVOICED, which unblocks five checks at once. Gather every observation they need in
// one pass rather than one visit each:
//   C44600 - Create invoice ran the wizard, invoiced, and opened the payment screen
//   C44597 - where a run opened by Create invoice ends
//   C44601 - once an invoice exists, no finish action is offered
//   C44605 - reordering is refused on an invoiced work order
//   C44588 - the receive modal after invoicing
//   C44563 - Create invoice completes the open approved lines
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
const R={};
await openWo(page,WO); await page.waitForTimeout(10000);
R.onWO=await page.evaluate(()=>!!([...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||''))));
R.state=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>4&&r.height>4;};
  const hdrRow=[...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||''));
  const cut=hdrRow?hdrRow.getBoundingClientRect().top:260;
  return { woBadges:[...document.querySelectorAll('.q-badge')].filter(vis).map(b=>(b.innerText||'').trim()).slice(0,6),
    lines:[...document.querySelectorAll('tr[class*="line-row-"]')].map(r=>({
      status:[...r.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()).join('+'),
      buttons:[...r.querySelectorAll('button,.q-btn')].filter(vis).map(e=>(e.innerText||'').trim()).filter(Boolean)})),
    header:[...document.querySelectorAll('button,.q-btn')].filter(e=>vis(e)&&e.getBoundingClientRect().top<cut)
      .map(e=>({text:(e.innerText||'').replace(/\s+/g,' ').trim(),
        label:e.getAttribute('aria-label')||e.getAttribute('title')||null,
        disabled:e.disabled===true||e.getAttribute('aria-disabled')==='true'||/disabled/.test(e.className||'')}))
      .filter(b=>(b.text||b.label)&&!/^(ShopHub|Work Orders|Schedule|Customers|Parts|Reports|timer|notifications|Truck|Inventory|QA|SANKAN|Import|For Ryan)/.test(b.text||'')),
    dragHandles:[...document.querySelectorAll('*')].filter(e=>/drag_indicator/.test((e.textContent||'').trim())&&vis(e)).length,
    receiveButtons:[...document.querySelectorAll('button,.q-btn')].filter(e=>vis(e)&&/^Receive/i.test((e.innerText||'').trim())).map(e=>(e.innerText||'').trim()),
    addPart:/Add Part/i.test(document.body.innerText),
    newLine:/New Line/i.test(document.body.innerText) };});
console.log('on the work order:',R.onWO,'| badges:',JSON.stringify(R.state.woBadges));
console.log('\nlines:'); R.state.lines.forEach(l=>console.log('   ',l.status||'(none)','->',JSON.stringify(l.buttons)));
console.log('\nheader controls:');
R.state.header.forEach(h=>console.log('   ',JSON.stringify(h.text).padEnd(22),'| label',JSON.stringify(h.label).padEnd(18),'|',h.disabled?'DISABLED':'enabled'));
console.log('\ndrag handles on parts:',R.state.dragHandles,'| Receive buttons:',JSON.stringify(R.state.receiveButtons));
console.log('"Add Part" offered:',R.state.addPart,'| "New Line" offered:',R.state.newLine);
// the header three-dot
const dot=await page.evaluate(()=>{const c=[];
  document.querySelectorAll('button,.q-btn,i').forEach(b=>{if(!/more_vert/.test((b.innerText||b.textContent||'').trim()))return;
    const r=b.getBoundingClientRect(); if(!r.width||r.y>200)return; c.push({x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)});});
  c.sort((a,b)=>b.x-a.x); return c[0]||null;});
if(dot){ await page.mouse.click(dot.x,dot.y); await page.waitForTimeout(2200);
  R.headerMenu=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const r=x.getBoundingClientRect();return r.width>20&&r.height>20;}).pop();
    return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
      .map(i=>(i.innerText||'').trim()+(/disabled/.test(i.className)?' [disabled]':'')):null;});
  console.log('header three-dot now holds:',JSON.stringify(R.headerMenu));
  await page.keyboard.press('Escape'); await page.waitForTimeout(900); }
// a line's own menu on an invoiced work order
const lineIds=await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean));
if(lineIds.length){
  const id=lineIds[0]; const tr=page.locator('tr.line-row-'+id).first();
  await tr.scrollIntoViewIfNeeded().catch(()=>{}); await tr.hover().catch(()=>{}); await page.waitForTimeout(1200);
  const spot=await page.evaluate((lid)=>{const row=document.querySelector('tr.line-row-'+lid); if(!row)return null;
    const rb=row.getBoundingClientRect(); const c=[];
    document.querySelectorAll('button,.q-btn,i,.q-icon').forEach(b=>{if(!/more_vert/.test((b.innerText||b.textContent||'').trim()))return;
      const r=b.getBoundingClientRect(); if(!r.width)return; const cy=r.y+r.height/2;
      if(cy>=rb.top-2&&cy<=rb.bottom+2) c.push({x:Math.round(r.x+r.width/2),y:Math.round(cy)});});
    c.sort((a,b)=>a.x-b.x); return c[0]||null;},id);
  if(spot){ await page.mouse.click(spot.x,spot.y); await page.waitForTimeout(1900);
    R.lineMenu=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const r=x.getBoundingClientRect();return r.width>20&&r.height>20;}).pop();
      return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
        .map(i=>(i.innerText||'').trim()+(/disabled/.test(i.className)?' [disabled]':'')):null;});
    console.log('a line\'s menu on an invoiced work order:',JSON.stringify(R.lineMenu));
    await page.keyboard.press('Escape'); await page.waitForTimeout(800); }
}
// a part's menu - is Move (reorder) still offered?
R.partMenu=await page.evaluate(()=>{const rows=[...document.querySelectorAll('tr')].filter(t=>/drag_indicator/.test(t.innerText||''));
  return {partRows:rows.length};});
console.log('part rows still showing a drag handle:',JSON.stringify(R.partMenu));
await page.screenshot({path:`${EV}/r63-invoiced.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/r63-invoiced.json`,JSON.stringify(R,null,1));
await browser.close();
