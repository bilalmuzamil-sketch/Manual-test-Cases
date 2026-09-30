import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
const { page, browser } = await boot('/customers', { key:'admin', settle:12000 });
async function q(term){
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  await page.keyboard.press('Control+k'); await page.waitForTimeout(1200);
  await page.fill('.search-modal input',''); await page.waitForTimeout(300);
  await page.type('.search-modal input', term, {delay:45}); await page.waitForTimeout(3500);
  const r = await page.evaluate(()=>[...document.querySelectorAll('.search-row')]
    .map(x=>x.innerText.replace(/\s*\n\s*/g,' | ').trim()));
  const hit = r.filter(x=>/7 Star Truck Repair/.test(x));
  console.log(JSON.stringify(term).padEnd(12), 'rows', String(r.length).padStart(3),
              '| 7 Star row:', hit.length?hit[0].slice(0,110):'NOT FOUND');
}
for (const t of ['H8A3X9','H8A3','8A3X9','H8A3X','A3X9','H8A 3X9']) await q(t);
await browser.close();
