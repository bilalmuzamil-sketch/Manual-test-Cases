// Careful re-read of the bulk bar: is it really the headers that are replaced, what is in More,
// is there a Deselect all, and what happens with two and then all lines selected.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ID=process.argv[2], TAG=process.argv[3];
const { browser, page } = await bootProdLogin('/workorders', { settle: 9000 });
page.setDefaultTimeout(18000);
await openWo(page, ID); await page.waitForTimeout(3000);
const headers = async () => await page.evaluate(()=>[...document.querySelectorAll('th')].map(h=>({t:(h.innerText||'').trim(), visible: h.getBoundingClientRect().width>0 && getComputedStyle(h).visibility!=='hidden'})).filter(h=>h.t));
const bar = async () => await page.evaluate(() => {
  const el = [...document.querySelectorAll('*')].filter(e => /^\d+ selected/.test((e.innerText||'').trim()) && e.querySelectorAll('button,.q-btn').length)
    .sort((a,b)=>a.innerText.length-b.innerText.length)[0];
  if (!el) return null;
  return { tag: el.tagName+'.'+(el.className||'').toString().slice(0,70),
    inThead: !!el.closest('thead'),
    text: (el.innerText||'').replace(/\s+/g,' ').trim().slice(0,500),
    buttons: [...el.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>({t:(b.innerText||'').trim().replace(/\s+/g,' '), disabled:b.disabled===true||b.getAttribute('aria-disabled')==='true'||/disabled/.test((b.className||'').toString()), title:b.getAttribute('title')||b.getAttribute('aria-label')||''})),
    separators: el.querySelectorAll('.q-separator,hr').length };
});
console.log('HEADERS before:', JSON.stringify(await headers()));
const rowIds = await page.evaluate(()=>[...document.querySelectorAll('tr[class*="line-row-"]')].map(tr=>(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1]));
async function tick(i){ const tr=page.locator(`tr.line-row-${rowIds[i]}`).first(); await tr.scrollIntoViewIfNeeded().catch(()=>{}); await tr.hover(); await page.waitForTimeout(800);
  await page.locator(`[data-test-id="line_checkbox_${rowIds[i]}"]`).first().click({timeout:8000}); }
const snap = {};
await tick(0); await page.waitForTimeout(2500);
snap.one = { bar: await bar(), headers: await headers() };
console.log('\nONE SELECTED bar:', JSON.stringify(snap.one.bar,null,1));
console.log('headers while selected:', JSON.stringify(snap.one.headers));
await page.screenshot({path:`${EV}/${TAG}-one.png`});
await tick(1); await page.waitForTimeout(2500);
snap.two = { bar: await bar() };
console.log('\nTWO SELECTED bar:', JSON.stringify(snap.two.bar,null,1));
await page.screenshot({path:`${EV}/${TAG}-two.png`});
for (let i=2;i<rowIds.length;i++){ try{ await tick(i); await page.waitForTimeout(700);}catch(e){} }
await page.waitForTimeout(2000);
snap.all = { bar: await bar() };
console.log('\nALL SELECTED bar:', JSON.stringify(snap.all.bar,null,1));
await page.screenshot({path:`${EV}/${TAG}-all.png`});
// More
const more = page.locator('button:has-text("More"), .q-btn:has-text("More")').first();
if (await more.count()) { await more.click(); await page.waitForTimeout(2500);
  snap.more = await page.evaluate(()=>{ const m=document.querySelector('.q-menu'); return m? {text:(m.innerText||'').trim(), items:[...m.querySelectorAll('.q-item')].map(e=>(e.innerText||'').trim())} : null; });
  console.log('\nMORE:', JSON.stringify(snap.more));
  await page.screenshot({path:`${EV}/${TAG}-more.png`}); await page.keyboard.press('Escape'); await page.waitForTimeout(800); }
snap.deselectPresent = await page.locator('button:has-text("Deselect"), .q-btn:has-text("Deselect")').count();
console.log('Deselect all buttons:', snap.deselectPresent);
// close control
const close = page.locator('[title="Clear selection"], [aria-label="Clear selection"]').first();
if (await close.count()) { await close.click(); await page.waitForTimeout(2500);
  snap.afterClose = { bar: await bar(), headers: await headers() };
  console.log('after close -> bar:', !!snap.afterClose.bar, '| headers:', JSON.stringify(snap.afterClose.headers.map(h=>h.t))); }
fs.writeFileSync(`${EV}/${TAG}-bulkbar.json`, JSON.stringify(snap,null,1));
await browser.close();
