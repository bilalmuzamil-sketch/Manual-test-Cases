import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
const { page, browser } = await boot('/customers', { key:'admin', settle:12000, deviceScaleFactor:2 });
try {
  await page.setViewportSize({width:1440,height:900});
  await page.keyboard.press('Control+k'); await page.waitForTimeout(1400);
  const i=page.locator('.search-modal input');
  await i.click({clickCount:3}); await i.fill(''); await i.type('nophone',{delay:45});
  await page.waitForTimeout(5200);
  await page.evaluate(()=>{const t=[...document.querySelectorAll('.search-tabs__tab')].find(e=>/^\s*Customer/i.test(e.innerText.trim())); if(t)t.click();});
  await page.waitForTimeout(2400); await page.mouse.move(0,0); await page.waitForTimeout(400);
  await page.locator('.search-modal').screenshot({path:'/tmp/claude-0/t1-nophone.png'});
  console.log(await page.evaluate(()=>document.querySelector('.search-row')?.innerText.replace(/\s+/g,' ').trim()));
} finally { await browser.close(); }
