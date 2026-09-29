// C146291: does an ID match get pinned above the groups? The case says to type S-34379 but the
// row DISPLAYS S2-34379, so before calling this a product fault, try both - if the displayed id
// pins and the case's term does not, the case's term is at fault, not the build.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
const { page, browser } = await boot('/customers', { key:'admin', settle:12000 });
try {
  await page.setViewportSize({width:1440,height:900});
  for (const q of ['S-34379','S2-34379','ZZLONGROW-123786']) {
    await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(600);
    await page.keyboard.press('Control+k'); await page.waitForTimeout(1400);
    const i=page.locator('.search-modal input');
    await i.click({clickCount:3}); await i.fill(''); await i.type(q,{delay:45});
    await page.waitForTimeout(5500);
    await page.evaluate(()=>{const t=[...document.querySelectorAll('.search-tabs__tab')].find(e=>/^\s*All/i.test(e.innerText.trim())); if(t)t.click();});
    await page.waitForTimeout(1600);
    const o=await page.evaluate(()=>{
      const g=document.querySelector('.search-group');
      const rows=[...document.querySelectorAll('.search-row')];
      const top=rows.filter(r=>!g||(g.compareDocumentPosition(r)&Node.DOCUMENT_POSITION_PRECEDING));
      return {totalRows:rows.length, pinnedAboveGroups:top.length,
        pinnedText:top.map(r=>r.innerText.replace(/\s+/g,' ').trim().slice(0,70)),
        groups:[...document.querySelectorAll('.search-group__header')].map(h=>h.innerText.replace(/\s+/g,' ').trim())};
    });
    console.log(`"${q}" ->`, JSON.stringify(o));
  }
} finally { await browser.close(); }
