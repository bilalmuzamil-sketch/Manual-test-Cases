// Section 6669: select lines and read the bulk action bar - its layout, its actions, its counts,
// Deselect all and the close control. Serves C44571-C44582 and C53486.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ID=process.argv[2], TAG=process.argv[3];
const { browser, page } = await bootProdLogin('/workorders', { settle: 9000 });
page.setDefaultTimeout(18000);
await openWo(page, ID);
await page.waitForTimeout(3000);

const headersBefore = await page.evaluate(()=>[...document.querySelectorAll('th')].map(h=>(h.innerText||'').trim()).filter(Boolean));
console.log('COLUMN HEADERS before any selection:', JSON.stringify(headersBefore));
const boxes = page.locator('tr[class*="line-row-"] input[type=checkbox], tr[class*="line-row-"] .q-checkbox');
const n = await boxes.count();
console.log('checkboxes on line rows:', n);
if (!n) { console.log('NO CHECKBOXES - the bulk bar cannot be raised from this screen'); await page.screenshot({path:`${EV}/${TAG}-no-checkboxes.png`, fullPage:true}); await browser.close(); process.exit(0); }

const readBar = async () => await page.evaluate(() => {
  // the bar replaces the column headers, so look in the table head area and any sticky toolbar
  const cands = [...document.querySelectorAll('thead, .q-table__top, [class*=bulk], [class*=toolbar], .q-toolbar')]
    .filter(e => /selected/i.test(e.innerText || ''));
  const bar = cands[0];
  if (!bar) return null;
  return { text: (bar.innerText||'').replace(/\s+/g,' ').trim().slice(0,600),
    buttons: [...bar.querySelectorAll('button, .q-btn')].filter(b=>b.getBoundingClientRect().width)
      .map(b=>({t:(b.innerText||'').trim(), disabled:b.disabled===true||b.getAttribute('aria-disabled')==='true'||/disabled/.test((b.className||'').toString()), title:b.getAttribute('title')||b.getAttribute('aria-label')||''})),
    dividers: bar.querySelectorAll('.q-separator, hr').length };
});

// the tick boxes only appear on hover, so hover the row first
const rowIds = await page.evaluate(()=>[...document.querySelectorAll('tr[class*="line-row-"]')].map(tr=>(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1]));
async function tick(i) {
  const tr = page.locator(`tr.line-row-${rowIds[i]}`).first();
  await tr.scrollIntoViewIfNeeded().catch(()=>{}); await tr.hover(); await page.waitForTimeout(900);
  const cb = page.locator(`[data-test-id="line_checkbox_${rowIds[i]}"]`).first();
  await cb.click({ timeout: 8000 });
}
await tick(0); await page.waitForTimeout(2500);
let bar = await readBar();
console.log('\n=== BAR with ONE line selected ==='); console.log(JSON.stringify(bar, null, 1));
await page.screenshot({ path: `${EV}/${TAG}-bulk-1.png` });
const headersNow = await page.evaluate(()=>[...document.querySelectorAll('th')].map(h=>(h.innerText||'').trim()).filter(Boolean));
console.log('column headers while selected:', JSON.stringify(headersNow));

if (n > 1) { await tick(1); await page.waitForTimeout(2000); bar = await readBar();
  console.log('\n=== BAR with TWO selected ==='); console.log(JSON.stringify(bar, null, 1));
  await page.screenshot({ path: `${EV}/${TAG}-bulk-2.png` }); }

// More
const more = page.locator('button:has-text("More"), .q-btn:has-text("More")').first();
let moreItems = null;
if (await more.count()) { await more.click(); await page.waitForTimeout(2000);
  moreItems = await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.innerText||'').trim().replace(/\s+/g,' ')).filter(Boolean));
  console.log('MORE contains:', JSON.stringify(moreItems));
  await page.screenshot({ path: `${EV}/${TAG}-bulk-more.png` });
  await page.keyboard.press('Escape'); await page.waitForTimeout(1000); }
else console.log('no More button');

// Deselect all, then close
const deselect = page.locator('button:has-text("Deselect all"), .q-btn:has-text("Deselect all")').first();
let afterDeselect = null;
if (await deselect.count()) { await deselect.click(); await page.waitForTimeout(2500);
  afterDeselect = { bar: await readBar(), headers: await page.evaluate(()=>[...document.querySelectorAll('th')].map(h=>(h.innerText||'').trim()).filter(Boolean)) };
  console.log('after Deselect all -> bar still there?', !!afterDeselect.bar, '| headers back?', JSON.stringify(afterDeselect.headers));
  await page.screenshot({ path: `${EV}/${TAG}-after-deselect.png` }); }
else console.log('no Deselect all button');
fs.writeFileSync(`${EV}/${TAG}-bulk.json`, JSON.stringify({ headersBefore, headersNow, bar, moreItems, afterDeselect }, null, 1));
await browser.close();
