import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-09-full';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv9315','/workorders/6a529a5f-dff9-4c13-9636-b41500e585f0/lines','admin');
const context = page.context();
await page.waitForTimeout(8000);
let newPage=null;
context.on('page', p=>{ newPage=p; });
// intercept window.print to avoid a blocking native dialog
await page.addInitScript(()=>{ window.print=()=>{window.__printed=true;}; });
await page.evaluate(()=>{ window.print=()=>{window.__printed=true;}; });
// open WO header menu -> Print Work Order
await page.evaluate(L=>{const lab=eval(L);const btns=[...document.querySelectorAll('.q-btn,button')].filter(b=>/more_vert/i.test(b.textContent||''));btns.sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top);if(btns[0])btns[0].click();}, lab);
await page.waitForTimeout(1000);
await page.evaluate(L=>{const lab=eval(L);const it=[...document.querySelectorAll('.q-menu .q-item')].find(e=>/print work order/i.test(lab(e)));if(it)it.click();}, lab);
await page.waitForTimeout(6000);
const printed=await page.evaluate(()=>!!window.__printed).catch(()=>false);
console.log('window.print called?', printed, ' newTab?', !!newPage, ' mainURL:', page.url());
let tgt = newPage || page;
try{ await tgt.waitForLoadState('domcontentloaded',{timeout:5000}); }catch(e){}
await tgt.waitForTimeout(2000);
console.log('TARGET URL:', tgt.url());
const layout=await tgt.evaluate(()=>{
  const txt=document.body.innerText.replace(/\s+/g,' ');
  return {len:txt.length, sample:txt.slice(0,500),
    headers:[...document.querySelectorAll('h1,h2,h3,th,.header,[class*=print]')].map(e=>e.textContent.trim()).filter(Boolean).slice(0,25)};
}).catch(e=>({err:String(e)}));
console.log('PRINT VIEW:', JSON.stringify(layout));
await tgt.screenshot({path:OUT+'/printview2-v2636.png',fullPage:true}).catch(()=>{});
await browser.close();
