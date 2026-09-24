// Before saying an action is missing: hover each line row, open every menu on it, and search the whole
// page for the words. A hidden-until-hover control is the commonest way a reading like this lies (Rule 104).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ID=process.argv[2], TAG=process.argv[3];
const WANT = ['Request part','Delete line','Authorization required','Authorization Required','Decline','Uncomplete','Approve','Complete'];
const { browser, page } = await bootProdLogin('/workorders', { settle: 9000 });
page.setDefaultTimeout(18000);
await openWo(page, ID);
await page.waitForTimeout(3000);
const ids = await page.evaluate(()=>[...document.querySelectorAll('tr[class*="line-row-"]')].map(tr=>(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1]));
const out = [];
for (const id of ids) {
  const tr = page.locator(`tr.line-row-${id}`).first();
  await tr.scrollIntoViewIfNeeded().catch(()=>{});
  await tr.hover().catch(()=>{});
  await page.waitForTimeout(1200);
  const after = await page.evaluate((i) => {
    const tr = document.querySelector(`tr.line-row-${i}`); if (!tr) return null;
    return { badges: [...tr.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()),
      buttons: [...tr.querySelectorAll('button, .q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>({t:(b.innerText||'').trim(), title:b.getAttribute('title')||b.getAttribute('aria-label')||'', disabled: b.disabled===true||b.getAttribute('aria-disabled')==='true'||/disabled/.test((b.className||'').toString())})) };
  }, id);
  // open every menu button on that row
  const btns = page.locator(`tr.line-row-${id} button:has-text("more_vert"), tr.line-row-${id} .q-btn:has-text("more_vert")`);
  const n = await btns.count(); const menus = [];
  for (let k = 0; k < n; k++) { try { await btns.nth(k).click({timeout:5000}); await page.waitForTimeout(1600);
    menus.push(await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.innerText||'').trim().replace(/\s+/g,' ')).filter(Boolean)));
    await page.keyboard.press('Escape'); await page.waitForTimeout(800); } catch(e){ menus.push(['ERR']); } }
  out.push({ id, hovered: after, menus });
  console.log('LINE', (after?.badges||[]).join(','), '| on hover:', JSON.stringify((after?.buttons||[]).map(b=>(b.disabled?'[off]':'')+(b.t||b.title))), '| menus:', JSON.stringify(menus));
}
const page_text = await page.evaluate(()=>document.body.innerText);
console.log('\n=== the words anywhere on the page ===');
for (const w of WANT) console.log(' ', w, '->', page_text.includes(w));
fs.writeFileSync(`${EV}/${TAG}-hover.json`, JSON.stringify({ out, present: Object.fromEntries(WANT.map(w=>[w, page_text.includes(w)])) }, null, 1));
await browser.close();
