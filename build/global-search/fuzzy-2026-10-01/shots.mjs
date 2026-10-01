import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
const D='/home/user/Manual-test-Cases/build/global-search/fuzzy-2026-10-01/pics/';
const { page, browser } = await boot('/customers', { key:'admin', settle:12000, viewport:{width:1680,height:1000}, deviceScaleFactor:2 });
async function shot(term, tab, name){
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  await page.keyboard.press('Control+k'); await page.waitForTimeout(1200);
  await page.fill('.search-modal input',''); await page.waitForTimeout(300);
  await page.type('.search-modal input', term, {delay:40}); await page.waitForTimeout(3400);
  if(tab){ await page.evaluate(l=>{const t=[...document.querySelectorAll('.search-tabs__tab')]
    .find(e=>e.innerText.replace(/\s*\(\d+\)/,'').trim().toLowerCase()===l.toLowerCase()); if(t)t.click();},tab);
    await page.waitForTimeout(2400); }
  await page.mouse.move(0,0); await page.waitForTimeout(400);
  const el=await page.$('.search-modal'); await (el||page).screenshot({path:D+name});
  const m=await page.evaluate(()=>({marks:[...document.querySelectorAll('.search-row mark')].map(x=>x.innerText),
    first:document.querySelector('.search-row')?.innerText.replace(/\s*\n\s*/g,' | ').slice(0,110)}));
  console.log(name,'marks=',JSON.stringify(m.marks.slice(0,3)),'|',m.first);
}
await shot('Trailer','Customers','ctrl-customers-exact.png');
await shot('rTailer','Customers','bad-customers-fuzzy.png');
await shot('Freightliner','Assets','ctrl-assets-exact.png');
await shot('rFeightliner','Assets','bad-assets-fuzzy.png');
await shot('Stillwater','Purchase orders','ctrl-po-exact.png');
await shot('tSillwater','Purchase orders','bad-po-fuzzy.png');
await browser.close();
