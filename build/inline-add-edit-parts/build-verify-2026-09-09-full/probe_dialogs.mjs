import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-09-full';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv9315','/workorders/6a529a5f-dff9-4c13-9636-b41500e585f0/lines','admin');
await page.waitForTimeout(8000);
// open Add Part row, type a description, then click the × / cancel to trigger discard dialog
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/add part/i.test(lab(e))&&lab(e).length<24);if(b)b.click();}, lab);
await page.waitForTimeout(2500);
// type into the description input
await page.evaluate(()=>{const inp=[...document.querySelectorAll('input')].find(i=>/description/i.test(i.getAttribute('aria-label')||i.getAttribute('placeholder')||''));if(inp){inp.focus();inp.value='ZZAUTOTEST';inp.dispatchEvent(new Event('input',{bubbles:true}));}});
await page.waitForTimeout(1000);
// click the close × on the row
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn')].find(e=>{const t=lab(e);return t==='close'||t==='×'||t==='Cancel';});if(b)b.click();}, lab);
await page.waitForTimeout(1500);
const dlg=await page.evaluate(L=>{const lab=eval(L);const d=document.querySelector('.q-dialog,[role=dialog]');if(!d)return null;return {title:(d.querySelector('h1,h2,h3,.text-h6,.q-toolbar__title')?.textContent||'').trim(),body:lab(d).slice(0,160),buttons:[...d.querySelectorAll('button,.q-btn')].map(lab).filter(Boolean)};}, lab);
console.log('DISCARD DIALOG:', JSON.stringify(dlg));
await page.screenshot({path:OUT+'/discard-dialog-v2636.png',fullPage:true}).catch(()=>{});
await browser.close();
