import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09/fullwalk';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv8683','/administration/settings','admin');
await page.waitForTimeout(7000);
console.log('URL:', page.url());
// confirm cookie/session valid (not bounced to google)
if(/accounts\.google|login/.test(page.url())){ console.log('SESSION EXPIRED - cookie bounced'); await browser.close(); process.exit(2); }
// click the Work Orders tab
await page.locator('[role=tab]:has-text("Work Orders"), .q-tab:has-text("Work Orders")').first().click().catch(()=>{});
await page.waitForTimeout(3000);
// dump toggle groups + labels + descriptions + Save button
const dump=await page.evaluate(L=>{const lab=eval(L);
  const groups=[...document.querySelectorAll('.q-item__label--header,.text-caption,.text-overline,h6,.text-subtitle2')].map(lab).filter(t=>/WORKFLOW|LINE REQUIREMENT|PARTS/i.test(t));
  const toggles=[...document.querySelectorAll('.q-toggle')].map(t=>{const row=t.closest('.q-item,.row,div');return row?lab(row).slice(0,90):'';}).filter(Boolean);
  const save=[...document.querySelectorAll('button,.q-btn')].map(lab).find(t=>/save settings/i.test(t));
  return {groups:[...new Set(groups)], toggles:[...new Set(toggles)], save};
}, lab);
console.log('GROUPS:', JSON.stringify(dump.groups));
console.log('SAVE BTN:', JSON.stringify(dump.save));
console.log('TOGGLES+DESC:'); dump.toggles.forEach(t=>console.log('  -',t));
await page.screenshot({path:OUT+'/area1-settings-workorders.png',fullPage:true}).catch(()=>{});
// C44557/44558: toggle a setting to raise the confirmation dialog, read it, then Cancel (no save)
await page.evaluate(()=>{const t=[...document.querySelectorAll('.q-toggle')].find(x=>/ordering parts/i.test(x.closest('.q-item,.row,div')?.textContent||''));if(t)t.click();});
await page.waitForTimeout(2000);
const confirm=await page.evaluate(L=>{const lab=eval(L);const d=document.querySelector('.q-dialog,[role=dialog]');if(!d)return null;return {title:(d.querySelector('h1,h2,h3,.text-h6,.q-toolbar__title')?.textContent||'').trim().slice(0,60),body:lab(d).slice(0,220),buttons:[...d.querySelectorAll('button,.q-btn')].map(lab).filter(Boolean).slice(0,6)};}, lab);
console.log('CHANGE CONFIRM DIALOG:', JSON.stringify(confirm));
await page.screenshot({path:OUT+'/area1-change-confirm.png',fullPage:true}).catch(()=>{});
// cancel it (do not persist)
await page.evaluate(()=>{const b=[...document.querySelectorAll('.q-dialog button,.q-dialog .q-btn')].find(x=>/cancel|no|dismiss/i.test(x.textContent||''));if(b)b.click();});
await browser.close();
