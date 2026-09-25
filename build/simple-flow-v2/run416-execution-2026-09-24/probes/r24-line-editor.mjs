// Two of the four "missing" actions may exist under another name. "Request part" may be what the
// product calls "Add Part"; "Delete line" may live in the line's own editor rather than on the row.
// Open the editor and look, before claiming anything is absent (Rule 104).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo, bodyText } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const { browser, page } = await bootProdLogin('/workorders', { settle: 11000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(22000);
const out = {};
await openWo(page, '068f9856-9d28-4500-a3dd-dd6d7aafb15a'); await page.waitForTimeout(6000);
// every control on a line row, including ones that only appear on hover
const ids = await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(tr=>(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean));
const tr = page.locator(`tr.line-row-${ids[0]}`).first();
await tr.hover(); await page.waitForTimeout(1200);
out.rowControls = await page.evaluate((i)=>{ const r=document.querySelector(`tr.line-row-${i}`);
  return [...r.querySelectorAll('button,.q-btn,a')].filter(b=>b.getBoundingClientRect().width)
    .map(b=>({ t:(b.innerText||'').replace(/\s+/g,' ').trim(), title:b.getAttribute('title')||b.getAttribute('aria-label')||'' })); }, ids[0]);
console.log('every control on a line row when hovered:', JSON.stringify(out.rowControls));
// open the line editor - the pencil
const edit = page.locator(`tr.line-row-${ids[0]} .q-btn:has-text("edit"), tr.line-row-${ids[0]} button:has-text("edit")`).first();
console.log('pencil present on the row:', await edit.count());
if (await edit.count()) {
  await edit.click(); await page.waitForTimeout(6000);
  out.editor = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
    if (!d) return null;
    return { text:(d.innerText||'').replace(/\s+/g,' ').slice(0,700),
      buttons:[...d.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean),
      fields:[...d.querySelectorAll('.q-field')].map(f=>(f.innerText||'').split('\n')[0]) }; });
  console.log('\nLINE EDITOR:', JSON.stringify(out.editor,null,1));
  await page.screenshot({ path: `${EV}/line-editor.png`, fullPage: true });
  await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
}
// does "Add Part" behave as a part request? the tab is called Parts and the address says part-requests
const t = await bodyText(page);
out.addPartPresent = t.includes('Add Part');
out.partsTabLabel = (t.match(/Parts \(\d+\)/)||[])[0] || null;
console.log('\n"Add Part" on the work order:', out.addPartPresent, '| the parts tab reads:', out.partsTabLabel);
console.log('the address of that tab is /part-requests, so "Add Part" is how a part is requested here');
fs.writeFileSync(`${EV}/line-editor.json`, JSON.stringify(out,null,1));
await browser.close();
