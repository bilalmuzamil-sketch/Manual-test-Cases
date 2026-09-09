import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-09-full';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv9315','/workorders?tab=work_orders','admin');
await page.waitForTimeout(7000);
// find status filter tabs / the WO list statuses available
const tabs=await page.evaluate(L=>{const lab=eval(L);return [...new Set([...document.querySelectorAll('.q-tab,[role=tab],.q-chip,a')].map(lab).filter(t=>/estimate|approved|review|complete|invoic|paid|declin|all/i.test(t)&&t.length<20))];}, lab);
console.log('WO LIST STATUS TABS/FILTERS:', JSON.stringify(tabs));
// look through rows for a Declined or Completed WO
const statuses=await page.evaluate(L=>{const lab=eval(L);return [...new Set([...document.querySelectorAll('table tbody tr')].map(r=>{const m=lab(r).match(/Estimate|Approved|Ready for Review|Complete|Invoiced|Paid|Declined/i);return m?m[0]:null;}).filter(Boolean))];}, lab);
console.log('STATUSES VISIBLE IN LIST:', JSON.stringify(statuses));
// open a Declined WO if present, else a Complete one
const opened=await page.evaluate(L=>{const lab=eval(L);for(const kw of ['Declined','Complete','Invoiced','Paid']){const tr=[...document.querySelectorAll('table tbody tr')].find(r=>new RegExp(kw,'i').test(lab(r))&&/S9315-/.test(lab(r)));if(tr){const cell=[...tr.cells].find(c=>/S9315-/.test(c.textContent||''));(cell||tr.cells[2]).click();return kw;}}return null;}, lab);
console.log('OPENED WO STATUS:', JSON.stringify(opened));
await page.waitForTimeout(6000);
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{});
await page.waitForTimeout(3500);
const controls=await page.evaluate(L=>{const lab=eval(L);const it=document.body.innerText;return {addPart:/add part/i.test(it), editControls:[...document.querySelectorAll('tr')].some(r=>/\([A-Za-z0-9]/.test(lab(r))&&/edit/i.test(r.innerHTML))};}, lab);
console.log('ON THIS STATUS -> Add Part visible?', controls.addPart, ' edit control on part rows?', controls.editControls);
await page.screenshot({path:OUT+'/declined-lines-v2636.png',fullPage:true}).catch(()=>{});
await browser.close();
