// Two careful reads: (a) the three-dot menu that sits on the LINE row itself, (b) the More button
// inside the dark bulk bar - scoped to that bar, not the ShopHub module switcher.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ID=process.argv[2], TAG=process.argv[3];
const { browser, page } = await bootProdLogin('/workorders', { settle: 9000 });
page.setDefaultTimeout(18000);
await openWo(page, ID); await page.waitForTimeout(3000);
const out = { lineMenus: [], bulk: null };

const rowIds = await page.evaluate(()=>[...document.querySelectorAll('tr[class*="line-row-"]')].map(tr=>(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1]));
console.log('line rows:', rowIds.length);
for (const id of rowIds) {
  const tr = page.locator(`tr.line-row-${id}`).first();
  await tr.scrollIntoViewIfNeeded().catch(()=>{}); await tr.hover(); await page.waitForTimeout(900);
  const btns = page.locator(`tr.line-row-${id} .q-btn, tr.line-row-${id} button`);
  const n = await btns.count();
  const status = await page.evaluate(i=>{const tr=document.querySelector(`tr.line-row-${i}`);return [...tr.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()).join(',');}, id);
  for (let k = 0; k < n; k++) {
    const t = (await btns.nth(k).innerText().catch(()=>'')).trim();
    if (!/more_vert|more_horiz/.test(t)) continue;
    try { await btns.nth(k).click({ timeout: 6000 }); await page.waitForTimeout(1800);
      const items = await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.innerText||'').trim().replace(/\s+/g,' ')).filter(Boolean));
      console.log(`[${status}] menu button #${k}:`, JSON.stringify(items));
      out.lineMenus.push({ status, btn: k, items });
      await page.screenshot({ path: `${EV}/${TAG}-linemenu-${status.replace(/[^A-Za-z]/g,'')}-${k}.png` });
      await page.keyboard.press('Escape'); await page.waitForTimeout(800);
    } catch(e){ console.log(`[${status}] menu #${k} ERR`); }
  }
}
// now the bulk bar's own More
async function tick(i){ const tr=page.locator(`tr.line-row-${rowIds[i]}`).first(); await tr.hover(); await page.waitForTimeout(700);
  await page.locator(`[data-test-id="line_checkbox_${rowIds[i]}"]`).first().click({timeout:8000}); }
await tick(0); await page.waitForTimeout(2500);
const barInfo = await page.evaluate(() => {
  const el = [...document.querySelectorAll('div')].filter(e => /\bselected\b/.test(e.innerText||'') && e.querySelector('button,.q-btn') && (e.innerText||'').length < 120)
    .sort((a,b)=>a.innerText.length-b.innerText.length)[0];
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const th = document.querySelector('th');
  return { text:(el.innerText||'').replace(/\s+/g,' ').trim(), rect:{top:r.top,height:r.height},
    headerTop: th ? th.getBoundingClientRect().top : null, headerVisible: th ? th.getBoundingClientRect().height > 0 : null,
    buttons:[...el.querySelectorAll('button,.q-btn')].map(b=>({t:(b.innerText||'').replace(/\s+/g,' ').trim(), title:b.getAttribute('title')||b.getAttribute('aria-label')||''})),
    separators: el.querySelectorAll('.q-separator,hr').length };
});
console.log('\nBULK BAR:', JSON.stringify(barInfo,null,1));
out.bulk = barInfo;
// click the More that lives inside that bar
const moreInBar = page.locator('div:has-text("selected") >> button:has-text("More"), .q-btn:has-text("More")').last();
if (await moreInBar.count()) { await moreInBar.click(); await page.waitForTimeout(2500);
  const m = await page.evaluate(()=>{ const menus=[...document.querySelectorAll('.q-menu')].filter(x=>x.getBoundingClientRect().width);
    return menus.map(x=>({text:(x.innerText||'').replace(/\s+/g,' ').slice(0,300), items:[...x.querySelectorAll('.q-item')].map(e=>(e.innerText||'').trim().replace(/\s+/g,' '))})); });
  console.log('MORE menus open:', JSON.stringify(m,null,1));
  out.more = m;
  await page.screenshot({ path: `${EV}/${TAG}-bulk-more.png` }); }
fs.writeFileSync(`${EV}/${TAG}-linemenus.json`, JSON.stringify(out,null,1));
await browser.close();
