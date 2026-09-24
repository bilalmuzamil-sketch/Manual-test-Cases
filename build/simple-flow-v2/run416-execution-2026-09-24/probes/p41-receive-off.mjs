// C44552(2) / C44569(2): with "Require Receiving Parts Before Completion" OFF, does Receive move into
// the part's ... menu rather than disappear, and do outstanding parts stop blocking invoicing?
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWoSettings, readWoSettings } from './lib2.mjs';
import { openWo, bodyText } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='79476028-70b2-44c7-9e34-0eddc62c15af'; // S2-925 - has an Awaiting part
const { browser, page, ctx, APIH } = await bootProdLogin('/administration/settings', { settle: 15000 });
page.setDefaultTimeout(25000);
const stored = async () => (await (await ctx.request.get(`https://${APIH}/api/organizations/settings`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json()).data;
const out = { before: await stored() };

async function look(tag) {
  await openWo(page, WO); await page.waitForTimeout(3000);
  const t = await bodyText(page);
  const exact = await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').trim()).filter(x=>['Order','Pick','Receive','Return'].includes(x)));
  const menus = [];
  const mv = page.locator('button:has-text("more_vert"), .q-btn:has-text("more_vert")');
  const n = await mv.count();
  for (let i=0;i<Math.min(n,8);i++){ try{ await mv.nth(i).click({timeout:6000}); await page.waitForTimeout(1700);
    menus.push(await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.innerText||'').trim().replace(/\s+/g,' ')).filter(Boolean)));
    await page.keyboard.press('Escape'); await page.waitForTimeout(700); }catch(e){menus.push(['ERR']);} }
  await page.screenshot({ path: `${EV}/C44552-receive-${tag}.png`, fullPage: true });
  fs.writeFileSync(`${EV}/C44552-receive-${tag}.txt`, t);
  console.log(`[${tag}] row action buttons:`, JSON.stringify(exact));
  console.log(`[${tag}] menus:`, JSON.stringify(menus));
  return { exact, menus };
}
out.receivingOn = await look('ON');

// turn receiving OFF
await page.goto('https://app.shopview.com/administration/settings',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await openWoSettings(page);
const r = await readWoSettings(page);
const i = r.settings.findIndex(s=>s.label==='Require Receiving Parts Before Completion');
await page.locator('.q-tab-panel:has-text("Save Settings") .q-toggle').nth(i).click(); await page.waitForTimeout(3000);
const aff = page.locator('.q-dialog').locator('button:has-text("Turn Off"), .q-btn:has-text("Turn Off")').first();
if (await aff.count()) { await aff.click(); await page.waitForTimeout(2500); }
await page.locator('.q-tab-panel:has-text("Save Settings") .q-btn:has-text("Save Settings")').first().click({timeout:20000}).catch(e=>console.log('save:',e.message.split('\n')[0]));
await page.waitForTimeout(8000);
console.log('stored now requireVendorInvoiceNumber =', (await stored()).requireVendorInvoiceNumber);
out.receivingOff = await look('OFF');

// put it back on
await page.goto('https://app.shopview.com/administration/settings',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await openWoSettings(page);
const r2 = await readWoSettings(page);
const i2 = r2.settings.findIndex(s=>s.label==='Require Receiving Parts Before Completion');
await page.locator('.q-tab-panel:has-text("Save Settings") .q-toggle').nth(i2).click(); await page.waitForTimeout(3000);
const aff2 = page.locator('.q-dialog').locator('button:has-text("Turn On"), .q-btn:has-text("Turn On")').first();
if (await aff2.count()) { await aff2.click(); await page.waitForTimeout(2500); }
await page.locator('.q-tab-panel:has-text("Save Settings") .q-btn:has-text("Save Settings")').first().click({timeout:20000}).catch(()=>{});
await page.waitForTimeout(8000);
out.after = await stored();
console.log('RESTORED:', JSON.stringify(out.after)===JSON.stringify(out.before), JSON.stringify(out.after));
fs.writeFileSync(`${EV}/C44552-receiving.json`, JSON.stringify(out,null,1));
await browser.close();
