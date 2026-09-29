import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
const { page, browser } = await boot('/customers', { key:'admin', settle:12000 });
try {
  await page.setViewportSize({width:1440,height:900});
  for (const q of ['zzautotest.nophone@staging.shopview.local','zzautotest.nophone@','nophone','ZZAUTOTEST']) {
    await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(600);
    await page.keyboard.press('Control+k'); await page.waitForTimeout(1400);
    const i=page.locator('.search-modal input');
    await i.click({clickCount:3}); await i.fill(''); await i.type(q,{delay:45});
    await page.waitForTimeout(5200);
    await page.evaluate(()=>{const t=[...document.querySelectorAll('.search-tabs__tab')].find(e=>/^\s*Customer/i.test(e.innerText.trim())); if(t)t.click();});
    await page.waitForTimeout(2300);
    const rows=await page.evaluate(()=>[...document.querySelectorAll('.search-row')].slice(0,3).map(r=>({
      title:(r.querySelector('.search-row__title')?.innerText||'').replace(/\s+/g,' ').trim(),
      meta:(r.querySelector('.search-row__meta')?.innerText||'').replace(/\s+/g,' ').trim()})));
    console.log(`\n"${q}" ->`, JSON.stringify(rows,null,0).slice(0,400));
  }
} finally { await browser.close(); }
