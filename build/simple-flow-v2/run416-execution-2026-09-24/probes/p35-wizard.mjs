// C44594-C44598: open the completion wizard from Create invoice on a work order that still has an
// unreceived part, read its steps and buttons, then close it WITHOUT completing anything.
// Also hover the disabled Create invoice on a work order with a Needs Approval line to read its reason (C44599).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const { browser, page } = await bootProdLogin('/workorders', { settle: 9000 });
page.setDefaultTimeout(18000);
const out = {};

// (1) the disabled Create invoice reason, on S2-908
await openWo(page, '068f9856-9d28-4500-a3dd-dd6d7aafb15a'); await page.waitForTimeout(2500);
await page.locator('button:has-text("more_vert"), .q-btn:has-text("more_vert")').first().click(); await page.waitForTimeout(2000);
const ci = page.locator('.q-menu .q-item:has-text("Create invoice")').first();
if (await ci.count()) {
  await ci.hover(); await page.waitForTimeout(2500);
  out.disabledReason = await page.evaluate(() => {
    const tips = [...document.querySelectorAll('.q-tooltip, [role=tooltip]')].map(t=>(t.innerText||'').trim()).filter(Boolean);
    const item = [...document.querySelectorAll('.q-menu .q-item')].find(e=>/Create invoice/.test(e.innerText||''));
    return { tooltips: tips, itemTitle: item ? (item.getAttribute('title')||item.getAttribute('aria-label')||'') : null, itemText: item ? (item.innerText||'').trim() : null };
  });
  console.log('disabled Create invoice ->', JSON.stringify(out.disabledReason));
  await page.screenshot({ path: `${EV}/C44599-disabled-create-invoice.png` });
}
await page.keyboard.press('Escape'); await page.waitForTimeout(1000);

// (2) the wizard, from a work order with an unreceived part (S2-925)
await openWo(page, '79476028-70b2-44c7-9e34-0eddc62c15af'); await page.waitForTimeout(2500);
await page.locator('button:has-text("more_vert"), .q-btn:has-text("more_vert")').first().click(); await page.waitForTimeout(2000);
const items = await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>({t:(e.innerText||'').trim(), disabled:/disabled/.test((e.className||'').toString())})));
console.log('S2-925 ... menu:', JSON.stringify(items));
const ci2 = page.locator('.q-menu .q-item:has-text("Create invoice")').first();
if (await ci2.count()) {
  await ci2.click(); await page.waitForTimeout(7000);
  out.wizard = await page.evaluate(() => {
    const d = [...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
    if (!d) return null;
    return { title: (d.querySelector('.q-card__section, .text-h6, h1,h2,h3')||{}).innerText || null,
      text: (d.innerText||'').trim().slice(0,1200),
      pills: [...d.querySelectorAll('.q-chip, .q-tab, [class*=pill], [class*=step]')].map(e=>(e.innerText||'').trim()).filter(Boolean),
      buttons: [...d.querySelectorAll('button, .q-btn')].map(b=>({t:(b.innerText||'').trim(), disabled:b.disabled===true||/disabled/.test((b.className||'').toString())})).filter(b=>b.t) };
  });
  console.log('\n=== WIZARD ==='); console.log(JSON.stringify(out.wizard, null, 1));
  await page.screenshot({ path: `${EV}/C44594-wizard.png` });
  // leave without completing anything
  await page.keyboard.press('Escape'); await page.waitForTimeout(2000);
  const still = await page.evaluate(()=>!![...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0]);
  console.log('dialog still open after Escape:', still);
  if (still) { const c = page.locator('.q-dialog .q-btn:has-text("close")').first(); if (await c.count()) { await c.click(); await page.waitForTimeout(1500); } }
}
fs.writeFileSync(`${EV}/C44594-wizard.json`, JSON.stringify(out,null,1));
await browser.close();
