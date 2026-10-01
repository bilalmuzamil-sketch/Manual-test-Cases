import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
const D='/home/user/Manual-test-Cases/build/global-search/shortword-2026-10-01/pics/';
const { page, browser } = await boot('/customers', { key:'admin', settle:12000, viewport:{width:1680,height:1000}, deviceScaleFactor:2 });
page.setDefaultTimeout(25000);
async function shot(term, tab, name){
  await page.keyboard.press('Escape'); await page.waitForTimeout(350);
  await page.keyboard.press('Control+k'); await page.waitForTimeout(1100);
  await page.fill('.search-modal input',''); await page.waitForTimeout(250);
  await page.type('.search-modal input', term, {delay:35}); await page.waitForTimeout(3200);
  if(tab && tab!=='All'){ await page.evaluate(l=>{const t=[...document.querySelectorAll('.search-tabs__tab')]
    .find(e=>e.innerText.replace(/\s*\(\d+\)/,'').trim().toLowerCase()===l.toLowerCase()); if(t)t.click();},tab);
    await page.waitForTimeout(2200); }
  await page.mouse.move(0,0); await page.waitForTimeout(350);
  const el=await page.$('.search-modal'); await (el||page).screenshot({path:D+name});
  const n=await page.evaluate(()=>document.querySelectorAll('.search-row').length);
  console.log(name.padEnd(34), `${n} rows`);
}
// the core pair: works / blank, same word, one letter apart
await shot('Santa','Work orders','wo-exact-Santa.png');
await shot('Saxta','Work orders','wo-blank-Saxta.png');
// the contradiction: same damage shape, opposite outcome on another tab
await shot('Johxson','Assets','asset-works-Johxson.png');
await shot('Adxms','Purchase orders','po-blank-Adxms.png');
// two more blanks for coverage
await shot('Abxdi','Vendor invoices','vi-blank-Abxdi.png');
await shot('Adrxan','Part sales','ps-missing-Adrxan.png');
console.log('SHOTS DONE');
await browser.close();
