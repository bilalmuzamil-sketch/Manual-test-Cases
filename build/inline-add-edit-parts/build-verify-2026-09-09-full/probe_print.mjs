import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-09-full';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const ctx=await (await import('/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs')).boot('sv9315','/workorders/6a529a5f-dff9-4c13-9636-b41500e585f0/lines','admin');
const {browser,page}=ctx;
await page.waitForTimeout(8000);
// listen for a new tab/window (print may open a new tab)
let printPage=null;
ctx.browser.on('targetcreated',()=>{});
const pagesBefore=browser.contexts()[0].pages().length;
// open WO header menu, click Print Work Order
await page.evaluate(L=>{const lab=eval(L);const btns=[...document.querySelectorAll('.q-btn,button')].filter(b=>/more_vert/i.test(b.textContent||''));btns.sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top);if(btns[0])btns[0].click();}, lab);
await page.waitForTimeout(1200);
const [popup]=await Promise.all([
  browser.contexts()[0].waitForEvent('page',{timeout:8000}).catch(()=>null),
  page.evaluate(L=>{const lab=eval(L);const it=[...document.querySelectorAll('.q-menu .q-item')].find(e=>/print work order/i.test(lab(e)));if(it)it.click();}, lab)
]);
await page.waitForTimeout(4000);
const target = popup || page;
await target.waitForTimeout(3000).catch(()=>{});
console.log('PRINT URL:', target.url());
const layout=await target.evaluate(()=>{
  const txt=document.body.innerText.replace(/\s+/g,' ');
  const has=k=>new RegExp(k,'i').test(txt);
  return {len:txt.length, headings:[...document.querySelectorAll('h1,h2,h3,th,.print-header')].map(e=>e.textContent.trim()).filter(Boolean).slice(0,20),
    markers:{workOrder:has('work order'),customer:has('customer'),vehicle:has('vehicle|asset'),parts:has('parts'),labor:has('labor|labour'),total:has('total'),summary:has('summary'),signature:has('signature')}};
}).catch(e=>({err:String(e).slice(0,80)}));
console.log('PRINT LAYOUT:', JSON.stringify(layout));
await target.screenshot({path:OUT+'/print-view-v2636.png',fullPage:true}).catch(()=>{});
await browser.close();
