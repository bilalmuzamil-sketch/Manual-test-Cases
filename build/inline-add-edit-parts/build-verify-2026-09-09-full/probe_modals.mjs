import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-09-full';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv9315','/workorders/6a529a5f-dff9-4c13-9636-b41500e585f0/lines','admin');
await page.waitForTimeout(8000);
console.log('URL:', page.url());
// open Add Part inline row
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/add part/i.test(lab(e))&&lab(e).length<24);if(b){b.scrollIntoView();b.click();}}, lab);
await page.waitForTimeout(2500);
// open More options menu (in the inline row) - capture its items
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn,a,.q-item')].find(e=>/more options/i.test(lab(e)));if(b)b.click();}, lab);
await page.waitForTimeout(1500);
const moreMenu=await page.evaluate(L=>{const lab=eval(L);const items=[...document.querySelectorAll('.q-menu .q-item,.q-menu .q-item__label')].map(lab).filter(Boolean);return [...new Set(items)];}, lab);
console.log('MORE-OPTIONS MENU ITEMS:', JSON.stringify(moreMenu));
// the New Part Request modal (if it opened directly) - full field + button capture
const modal=await page.evaluate(L=>{const lab=eval(L);const d=document.querySelector('.q-dialog,[role=dialog]');if(!d)return null;
  const fields=[...d.querySelectorAll('.q-field__label')].map(lab).filter(Boolean);
  const btns=[...d.querySelectorAll('button,.q-btn')].map(e=>{const c=e.cloneNode(true);c.querySelectorAll('svg').forEach(n=>n.remove());return (c.textContent||'').replace(/\s+/g,' ').trim();}).filter(Boolean);
  const title=(d.querySelector('h1,h2,h3,.text-h6,.q-toolbar__title')?.textContent||'').trim();
  return {title:title.slice(0,40),fields:[...new Set(fields)],buttons:[...new Set(btns)]};}, lab);
console.log('NEW-PART-REQUEST MODAL:', JSON.stringify(modal));
await page.screenshot({path:OUT+'/npr-modal-v2636.png',fullPage:true}).catch(()=>{});
await browser.close();
