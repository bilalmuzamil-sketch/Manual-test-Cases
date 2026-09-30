import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
const T=[
 ['C146204 advisor  ','Work order',['Veljkovic','eljkovic','Veljkov']],
 ['C146220 province ','Customer',['ZZQUEBEXA']],
 ['C146221 postcode ','Customer',['H8A3X9','8A3X9','H8A3X','A3X9']],
 ['C146241 category ','Parts',['Brake Parts','rake Parts','Brake Part']],
 ['C146250 email    ','Vendor',['zzhidden.vendor@staging','zzhidden.vendor','hidden.vendor@staging']],
];
const { page, browser } = await boot('/customers', { key:'admin', settle:12000 });
try {
  await page.setViewportSize({width:1440,height:900});
  for (const [label,tab,terms] of T) {
    for (const q of terms) {
      await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(500);
      await page.keyboard.press('Control+k'); await page.waitForTimeout(1300);
      const i=page.locator('.search-modal input');
      await i.click({clickCount:3}); await i.fill(''); await i.type(q,{delay:40});
      await page.waitForTimeout(5000);
      await page.evaluate((tb)=>{const t=[...document.querySelectorAll('.search-tabs__tab')]
        .find(e=>new RegExp('^\\s*'+tb.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i').test(e.innerText.trim())); if(t)t.click();},tab);
      await page.waitForTimeout(2100);
      const r=await page.evaluate(()=>[...document.querySelectorAll('.search-row')].slice(0,3).map(x=>
        x.innerText.replace(/\s+/g,' ').trim().slice(0,105)));
      console.log(`${label} "${q}" -> ${r.length} rows`);
      r.forEach(x=>console.log(`      ${x}`));
      if(r.length) break;
    }
  }
} finally { await browser.close(); }
