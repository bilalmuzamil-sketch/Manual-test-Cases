import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-09-full';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv9315','/workorders?tab=work_orders','admin');
await page.waitForTimeout(7000);
const build=await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.getAttribute('content'));
console.log('BUILD:', build, 'URL:', page.url());
// open a work order in an editable status. Click a row's customer/number cell.
const rows=await page.evaluate(L=>{const lab=eval(L);const tb=document.querySelector('table');return tb?[...tb.querySelectorAll('tbody tr')].slice(0,10).map((tr,i)=>({i,t:[...tr.cells].map(lab).join(' | ').slice(0,70)})):[];}, lab);
console.log('WO ROWS:', JSON.stringify(rows.slice(0,6),null,0));
// open first WO
await page.locator('table tbody tr').first().locator('td').nth(2).click().catch(()=>{});
await page.waitForTimeout(6000);
console.log('WO URL:', page.url());
await page.locator('.q-tab:has-text("Lines"), [role=tab]:has-text("Lines")').first().click().catch(()=>{});
await page.waitForTimeout(4000);
// find the Add Part button in a line's Parts section
const addbtns=await page.evaluate(L=>{const lab=eval(L);return [...new Set([...document.querySelectorAll('button,.q-btn,a')].map(lab).filter(t=>/add part/i.test(t)&&t.length<24))];}, lab);
console.log('ADD-PART BUTTONS:', JSON.stringify(addbtns));
await page.screenshot({path:OUT+'/inline-lines-v2636.png',fullPage:true}).catch(()=>{});
// click Add Part
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/add part/i.test(lab(e))&&lab(e).length<24);if(b){b.scrollIntoView();b.click();}}, lab);
await page.waitForTimeout(3000);
// capture the inline add row fields + controls
const row=await page.evaluate(L=>{const lab=eval(L);
  const inputs=[...document.querySelectorAll('input,.q-field__label,label,select')].map(e=>({ph:e.getAttribute&&e.getAttribute('placeholder'),lab:lab(e).slice(0,30)})).filter(x=>x.ph||x.lab);
  const btns=[...document.querySelectorAll('button,.q-btn')].map(lab).filter(t=>t&&t.length<20);
  return {placeholders:[...new Set(inputs.map(x=>x.ph).filter(Boolean))].slice(0,15), controls:[...new Set(btns)].slice(0,18)};
}, lab);
console.log('INLINE ROW placeholders:', JSON.stringify(row.placeholders));
console.log('INLINE ROW controls:', JSON.stringify(row.controls));
await page.screenshot({path:OUT+'/inline-addrow-v2636.png',fullPage:true}).catch(()=>{});
await browser.close();
