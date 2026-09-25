// Two last things.
//  C44590 - clicking a purchase order NAVIGATES to /order/<id>, a "Purchase Order Details" page. The
//           case asks for a panel that expands IN PLACE on the list. Before saying the capability is
//           absent, read what that detail page actually offers - it may carry the same fields by a
//           different route, and that changes how the finding should be written.
//  C44599 - "There is no Send on the work order header in any state" is a negative I recorded early,
//           with the same method that produced three false negatives since. Read the header properly:
//           every control, plus the three-dot menu, on work orders in different states.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const APP='https://app.shopview.com';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,ctx,page,APIH}=await bootProdLogin('/parts/orders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
const R={};
// ---- C44590: what the Purchase Order Details page offers ----
await page.waitForTimeout(6000);
const target=await page.evaluate(()=>{const r=[...document.querySelectorAll('tbody tr')].filter(t=>t.getBoundingClientRect().height)[0];
  const td=[...r.querySelectorAll('td')][1]; const b=td.getBoundingClientRect(); return {x:Math.round(b.x+b.width/2),y:Math.round(b.y+b.height/2)};});
await page.mouse.click(target.x,target.y); await page.waitForTimeout(6000);
R.detail=await page.evaluate(()=>{
  const t=document.body.innerText;
  const want=['Vendor Invoice','Invoice Number','Invoice Date','Delivery Note','Deselect all','Receive parts','Subtotal','Tax','Total','Sell Price','Assign vendor','Vendor Missing'];
  return { url:location.href,
    fieldsPresent:want.filter(w=>new RegExp(w,'i').test(t)),
    headings:[...document.querySelectorAll('h1,h2,h3,.text-h4,.text-h5,.text-h6')].map(e=>(e.innerText||'').trim()).filter(Boolean).slice(0,8),
    buttons:[...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,20),
    columns:[...document.querySelectorAll('th')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean) };});
console.log('=== C44590 - the Purchase Order Details page ===');
console.log('  url      :',R.detail.url);
console.log('  headings :',JSON.stringify(R.detail.headings));
console.log('  columns  :',JSON.stringify(R.detail.columns));
console.log('  buttons  :',JSON.stringify(R.detail.buttons));
console.log('  of the fields the check wants, present:',JSON.stringify(R.detail.fieldsPresent));
await page.screenshot({path:`${EV}/p5c-po-details.png`,fullPage:true}).catch(()=>{});

// ---- C44599: the work order header, in several states ----
const g=async p=>{const r=await ctx.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
  const t=await r.text();let j=null;try{j=JSON.parse(t);}catch{}return j;};
const wos=(await g('/api/work-orders?pagination%5BrowsPerPage%5D=100&pagination%5Bpage%5D=1&search=&showMyWorkOrders=0'))?.data?.work_orders||[];
const byStatus={};
for(const w of wos){const s=w.status?.label||w.status?.value||w.status||'?'; if(!byStatus[s])byStatus[s]=w;}
console.log('\n=== C44599 - the work order header ===');
console.log('  states available to look at:',JSON.stringify(Object.keys(byStatus)));
R.headers=[];
for(const [st,w] of Object.entries(byStatus).slice(0,6)){
  await openWo(page,w.id); await page.waitForTimeout(7000);
  const h=await page.evaluate(()=>{
    const vis=e=>{const r=e.getBoundingClientRect();return r.width&&r.height;};
    // the header strip: everything above the tab row
    const tabRow=[...document.querySelectorAll('*')].find(e=>/Lines \(\d+\)/.test((e.innerText||'').trim())&&e.children.length<14);
    const cut=tabRow?tabRow.getBoundingClientRect().top:200;
    const btns=[...document.querySelectorAll('button,.q-btn')].filter(e=>vis(e)&&e.getBoundingClientRect().top<cut)
      .map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),
                disabled:e.disabled===true||e.getAttribute('aria-disabled')==='true'||/disabled/.test(e.className||'')}))
      .filter(b=>b.t);
    return {buttons:btns, sendAnywhereOnPage:/\bSend\b/.test(document.body.innerText)};});
  // the header three-dot
  let menu=null;
  const dot=await page.evaluate((cutY)=>{const c=[];
    document.querySelectorAll('button,.q-btn,i').forEach(b=>{if(!/more_vert/.test((b.innerText||b.textContent||'').trim()))return;
      const r=b.getBoundingClientRect(); if(!r.width||r.y>200)return; c.push({x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)});});
    c.sort((a,b)=>b.x-a.x); return c[0]||null;},200);
  if(dot){ await page.mouse.click(dot.x,dot.y); await page.waitForTimeout(2000);
    menu=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const r=x.getBoundingClientRect();return r.width>20&&r.height>20;}).pop();
      return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
        .map(i=>(i.innerText||'').trim()+(i.classList.contains('disabled')||/q-item--disabled/.test(i.className)?' [disabled]':'')):null;});
    await page.keyboard.press('Escape'); await page.waitForTimeout(800); }
  R.headers.push({status:st, wo:w.work_order_number||w.number, buttons:h.buttons, menu, sendAnywhere:h.sendAnywhereOnPage});
  console.log('  ['+st+']', (w.work_order_number||''), '-> header buttons:',JSON.stringify(h.buttons.map(b=>b.t+(b.disabled?' [disabled]':''))));
  console.log('        three-dot:',JSON.stringify(menu),'| the word Send anywhere on the page:',h.sendAnywhereOnPage);
}
fs.writeFileSync(`${EV}/p5c-detail-header.json`,JSON.stringify(R,null,1));
await browser.close();
