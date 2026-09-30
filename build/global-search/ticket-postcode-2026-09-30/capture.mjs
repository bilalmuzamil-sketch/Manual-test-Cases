// Row crops at 2x for the postcode-label ticket (Rule 116: source captured at twice the width shown).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
const D='/home/user/Manual-test-Cases/build/global-search/ticket-postcode-2026-09-30/pics/';
const { page, browser } = await boot('/customers', { key:'admin', settle:12000, viewport:{width:1680,height:1000}, deviceScaleFactor:2 });
async function rowShot(term, tab, match, name){
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  await page.keyboard.press('Control+k'); await page.waitForTimeout(1200);
  await page.fill('.search-modal input',''); await page.waitForTimeout(300);
  await page.type('.search-modal input', term, {delay:45}); await page.waitForTimeout(3500);
  if (tab) { await page.evaluate(l=>{const t=[...document.querySelectorAll('.search-tabs__tab')]
      .find(e=>e.innerText.replace(/\s*\(\d+\)/,'').trim().toLowerCase()===l.toLowerCase()); if(t)t.click();},tab);
    await page.waitForTimeout(2500); }
  await page.mouse.move(0,0); await page.waitForTimeout(400);
  const h = await page.evaluateHandle(m=>[...document.querySelectorAll('.search-row')]
      .find(r=>r.innerText.includes(m)) || document.querySelector('.search-row'), match);
  const el = h.asElement();
  if(!el){ console.log('NO ROW for',name); return; }
  await el.screenshot({ path: D+name });
  const txt = await el.evaluate(e=>e.innerText.replace(/\s*\n\s*/g,' | '));
  console.log(name, '->', txt.slice(0,140));
}
await rowShot('H8A3X9','Customers','Matched:','row-customer-postcode.png');
await rowShot('.Brake Parts','Parts','Category:','row-part-category.png');
await rowShot('zzhidden.vendor@staging.shopview.local','Vendors','Contact match:','row-vendor-contact.png');
await rowShot('7 Star Truck','Customers','7 Star','row-customer-by-name.png');
await browser.close();
