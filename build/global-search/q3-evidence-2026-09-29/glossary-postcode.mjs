import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
// 🔴 Sign in on a route staging definitely has, THEN navigate. Handing the deep customer URL
// straight to the sign-in page produces "no DEV MODE Admin button", which reads as a broken
// environment and is not - it is the sign-in page never being reached.
const { page, browser } = await boot('/customers', { key:'admin', settle:12000 });
try {
  await page.goto('https://app.staging.shopview.com/customers/b3406baf-3b85-424a-a2c8-c3ed5f4da4b0/work-orders',
                  { waitUntil:'domcontentloaded' });
  await page.waitForTimeout(9000);
  const s = await page.evaluate(()=>document.body.innerText.replace(/[ \t]+/g,' '));
  const i = s.indexOf('Address');
  console.log('customer page address block:', JSON.stringify(s.slice(i, i+120)));
  await page.keyboard.press('Control+k'); await page.waitForTimeout(1600);
  console.log('search box placeholder:', JSON.stringify(await page.evaluate(()=>document.querySelector('.search-modal input')?.placeholder)));
  console.log('tab labels:', JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.search-tabs__tab')].map(e=>e.innerText.replace(/\s*\(\d+\)/,'').trim()))));
} finally { await browser.close(); }
