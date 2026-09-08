import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const ROLE='04cfb2b8-3e29-41be-a4ee-5d589bad7974';
const s=await boot('sv9315','/administration/roles-permissions/'+ROLE+'/edit','admin');
const page=s.page; await page.waitForTimeout(6000);
const before=await page.evaluate(()=>{const seg=[...document.querySelectorAll('.wo-settings__segment')].find(e=>/--active/.test(e.className));return seg?(seg.textContent||'').trim():'?';});
console.log('saved view mode BEFORE restore:', before);
// click Tech view segment robustly
await page.evaluate(()=>{const seg=[...document.querySelectorAll('.wo-settings__segment')].find(e=>(e.textContent||'').trim()==='Tech view');if(seg)seg.click();});
await page.waitForTimeout(1000);
const nowActive=await page.evaluate(()=>{const seg=[...document.querySelectorAll('.wo-settings__segment')].find(e=>/--active/.test(e.className));return seg?(seg.textContent||'').trim():'?';});
console.log('after clicking Tech view, active =', nowActive);
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/^Save$/.test(lab(e)));if(b)b.setAttribute('data-sv','1');}, lab);
await page.locator('[data-sv="1"]').click().catch(()=>{}); await page.waitForTimeout(4000);
console.log('saved.');
await s.browser.close();
// reopen fresh to verify persisted
const s2=await boot('sv9315','/administration/roles-permissions/'+ROLE+'/edit','admin');
await s2.page.waitForTimeout(6000);
const after=await s2.page.evaluate(()=>{const seg=[...document.querySelectorAll('.wo-settings__segment')].find(e=>/--active/.test(e.className));return seg?(seg.textContent||'').trim():'?';});
console.log('saved view mode AFTER restore (fresh open):', after);
await s2.browser.close();
