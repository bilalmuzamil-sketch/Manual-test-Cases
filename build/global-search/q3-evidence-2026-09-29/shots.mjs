import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
const { page, browser } = await boot('/customers', { key:'admin', settle:12000, deviceScaleFactor:2 });
try {
  await page.setViewportSize({width:1440,height:900});
  async function shot(term, tab, file){
    await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(600);
    await page.keyboard.press('Control+k'); await page.waitForTimeout(1400);
    const i=page.locator('.search-modal input');
    await i.click({clickCount:3}); await i.fill(''); await i.type(term,{delay:45});
    await page.waitForTimeout(5200);
    await page.evaluate((tb)=>{const t=[...document.querySelectorAll('.search-tabs__tab')]
      .find(e=>new RegExp('^\\s*'+tb,'i').test(e.innerText.trim())); if(t)t.click();}, tab);
    await page.waitForTimeout(2300);
    await page.mouse.move(0,0); await page.waitForTimeout(400);
    await page.locator('.search-modal').screenshot({path:file});
    const notes = await page.evaluate(()=>[...document.querySelectorAll('.search-row')].slice(0,4)
      .map(r=>[...r.querySelectorAll('.search-row__meta-part')].map(p=>p.innerText.trim()).join(' | ')));
    console.log(term, JSON.stringify(notes));
  }
  await shot('965','Customers','/tmp/claude-0/q3-965.png');
  await shot('3286','Customers','/tmp/claude-0/q3-3286.png');
  await shot('SVEWU82','Work order','/tmp/claude-0/q3-vin.png');
} finally { await browser.close(); }
