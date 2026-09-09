import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-09-full';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv9315','/workorders?tab=work_orders','admin');
await page.waitForTimeout(7000);
console.log('BUILD:', await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.getAttribute('content')));
// open an Approved WO by clicking its number cell (a real data row)
await page.evaluate(L=>{const lab=eval(L);const tr=[...document.querySelectorAll('table tbody tr')].find(r=>/Approved/i.test(lab(r))&&/S9315-/.test(lab(r)));if(tr){const cell=[...tr.cells].find(c=>/S9315-/.test(c.textContent||''));(cell||tr.cells[2]).click();}}, lab);
await page.waitForTimeout(6000);
console.log('WO URL:', page.url());
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{});
await page.waitForTimeout(4000);
await page.screenshot({path:OUT+'/lines-v2636.png',fullPage:true}).catch(()=>{});
// Add Part button
const addbtns=await page.evaluate(L=>{const lab=eval(L);return [...new Set([...document.querySelectorAll('button,.q-btn,a')].map(lab).filter(t=>/add part/i.test(t)&&t.length<24))];}, lab);
console.log('ADD-PART BUTTONS:', JSON.stringify(addbtns));
// part-line table headers
const ph=await page.evaluate(L=>{const lab=eval(L);return [...document.querySelectorAll('table thead th')].map(lab).filter(Boolean).slice(0,12);}, lab);
console.log('LINE TABLE HEADERS:', JSON.stringify(ph));
// click Add Part -> inline row
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/add part/i.test(lab(e))&&lab(e).length<24);if(b){b.scrollIntoView();b.click();}}, lab);
await page.waitForTimeout(3000);
const row=await page.evaluate(L=>{const lab=eval(L);
  const inputs=[...document.querySelectorAll('input')].map(e=>e.getAttribute('placeholder')||e.getAttribute('aria-label')).filter(Boolean);
  const flabels=[...document.querySelectorAll('.q-field__label,label')].map(lab).filter(t=>t&&t.length<24);
  const btns=[...document.querySelectorAll('button,.q-btn')].map(lab).filter(t=>t&&t.length<20);
  return {inputs:[...new Set(inputs)].slice(0,15), flabels:[...new Set(flabels)].slice(0,15), controls:[...new Set(btns)].slice(0,20)};
}, lab);
console.log('INLINE INPUTS:', JSON.stringify(row.inputs));
console.log('INLINE FIELD LABELS:', JSON.stringify(row.flabels));
console.log('INLINE CONTROLS:', JSON.stringify(row.controls));
await page.screenshot({path:OUT+'/addrow-v2636.png',fullPage:true}).catch(()=>{});
// More options in the inline row
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn,a,.q-item')].find(e=>/more options/i.test(lab(e)));if(b)b.click();}, lab);
await page.waitForTimeout(2500);
const modal=await page.evaluate(L=>{const lab=eval(L);const d=document.querySelector('.q-dialog,[role=dialog]');if(!d)return null;return {title:(d.querySelector('h1,h2,h3,.text-h6,.q-toolbar__title')?.textContent||'').trim().slice(0,40),fields:[...d.querySelectorAll('.q-field__label,label')].map(lab).filter(Boolean).slice(0,16),buttons:[...d.querySelectorAll('button,.q-btn')].map(lab).filter(Boolean).slice(0,8)};}, lab);
console.log('MORE-OPTIONS MODAL:', JSON.stringify(modal));
await page.screenshot({path:OUT+'/moreopts-modal-v2636.png',fullPage:true}).catch(()=>{});
await browser.close();
