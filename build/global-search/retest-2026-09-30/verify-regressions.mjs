// Rule 104: a negative finding must prove the instrument worked. Every negative read below is
// paired with a positive control taken in the SAME run through the SAME selector - otherwise a
// renamed class after today's deploy would fake all 19 "regressions" at once.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
const { page, browser } = await boot('/customers', { key:'admin', settle:12000 });
async function read(term, tab){
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  await page.keyboard.press('Control+k'); await page.waitForTimeout(1200);
  await page.fill('.search-modal input',''); await page.waitForTimeout(300);
  await page.type('.search-modal input', term, {delay:45}); await page.waitForTimeout(3500);
  if(tab){ await page.evaluate(l=>{const t=[...document.querySelectorAll('.search-tabs__tab')]
    .find(e=>e.innerText.replace(/\s*\(\d+\)/,'').trim().toLowerCase()===l.toLowerCase()); if(t)t.click();},tab);
    await page.waitForTimeout(2500); }
  return await page.evaluate(()=>({
    tabs: [...document.querySelectorAll('.search-tabs__tab')].map(e=>e.innerText.replace(/\s+/g,' ').trim()),
    rows: [...document.querySelectorAll('.search-row')].slice(0,4).map(r=>({
      text: r.innerText.replace(/\s*\n\s*/g,' | ').slice(0,130),
      markSpecific: [...r.querySelectorAll('mark.search-highlight')].map(m=>m.innerText),
      markAny:      [...r.querySelectorAll('mark')].map(m=>m.innerText),
      em:           [...r.querySelectorAll('em, i, .approx, .search-row__approx')].map(m=>m.innerText.trim()).filter(Boolean),
    })),
  }));
}
const show=(lbl,r)=>{ console.log('### '+lbl); console.log('   tabs:', r.tabs.slice(0,4).join(' | '));
  r.rows.forEach((x,i)=>console.log(`   [${i}] ${x.text}\n        mark.search-highlight=${JSON.stringify(x.markSpecific)} anyMark=${JSON.stringify(x.markAny)} em=${JSON.stringify(x.em)}`)); };

// POSITIVE CONTROL: an exact match must still highlight through the same selector.
show('CONTROL exact match "Rowcheck" (highlighting MUST appear here)', await read('Rowcheck','Customers'));
// The claimed fuzzy regression.
show('FUZZY "ZZSOFTHIT" work orders', await read('ZZSOFTHIT','Work orders'));
show('FUZZY "Petersn" (spec example of a typo)', await read('Petersn','Customers'));
// The Purchase Order / Vendor Invoice block.
show('PURCHASE ORDERS "786"', await read('786','Purchase orders'));
show('VENDOR INVOICES "I2-965"', await read('I2-965','Vendor invoices'));
// The All-tab group cap.
show('ALL TAB "a" (group caps and Show all)', await read('a',null));
await browser.close();
