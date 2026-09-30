import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
const { page, browser } = await boot('/customers', { key:'admin', settle:12000 });
try {
  await page.setViewportSize({width:1440,height:900});
  await page.keyboard.press('Control+k'); await page.waitForTimeout(1400);
  const i=page.locator('.search-modal input');
  await i.click({clickCount:3}); await i.fill(''); await i.type('ZZLONGROW',{delay:45});
  await page.waitForTimeout(5500);
  await page.evaluate(()=>{const t=[...document.querySelectorAll('.search-tabs__tab')].find(e=>/^\s*Part sales/i.test(e.innerText.trim())); if(t)t.click();});
  await page.waitForTimeout(2400);
  const rows=await page.evaluate(()=>[...document.querySelectorAll('.search-row')].map(r=>({
    text:r.innerText.replace(/\s+/g,' ').trim(),
    badge:r.querySelector('.search-row__badge,[data-test-id=search_row_status_badge],.q-badge')?.innerText.trim()??null,
    meta:[...r.querySelectorAll('.search-row__meta-part')].map(p=>p.innerText.trim())})));
  console.log(JSON.stringify(rows,null,1));
  const MONEY=/[$]\s?[\d,]+\.?\d*/;
  console.log('rows showing a price:', rows.filter(r=>MONEY.test(r.text)).length, 'of', rows.length);
} finally { await browser.close(); }
