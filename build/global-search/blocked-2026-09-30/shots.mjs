import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
const { page, browser } = await boot('/customers', { key:'admin', settle:12000, viewport:{width:1680,height:1000}, deviceScaleFactor:2 });
const D='/home/user/Manual-test-Cases/build/global-search/blocked-2026-09-30/pics/';
import fs from 'fs'; fs.mkdirSync(D,{recursive:true});
async function shot(term, tab, name){
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  await page.keyboard.press('Control+k'); await page.waitForTimeout(1200);
  await page.fill('.search-modal input',''); await page.waitForTimeout(300);
  await page.type('.search-modal input', term, {delay:45}); await page.waitForTimeout(3500);
  if (tab) { await page.evaluate((lab)=>{const t=[...document.querySelectorAll('.search-tabs__tab')]
      .find(e=>e.innerText.replace(/\s*\(\d+\)/,'').trim().toLowerCase()===lab.toLowerCase()); if(t)t.click();},tab);
    await page.waitForTimeout(2500); }
  await page.mouse.move(0,0); await page.waitForTimeout(400);
  const el = await page.$('.search-modal');
  await (el||page).screenshot({ path: D+name });
  console.log('shot', name);
}
await shot('H8A3X9','Customers','C146221-postal-code.png');
await shot('.Brake Parts','Parts','C146241-category.png');
await shot('zzhidden.vendor@staging.shopview.local','Vendors','C146250-vendor-email.png');
await shot('9',null,'C146301-one-character.png');
await shot('99',null,'C146301-two-characters.png');
await browser.close();
