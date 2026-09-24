// C44552 / C44557(2) / C44553: turn Require Picking Inventory Parts ON, look for a Pick action on an
// inventory part, then turn it OFF and read what the confirmation actually says about stock.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWoSettings, readWoSettings } from './lib2.mjs';
import { openWo, bodyText } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const INV_WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a'; // S2-908 carries an inventory part on an approved line
const { browser, page, ctx, APIH } = await bootProdLogin('/administration/settings', { settle: 14000 });
page.setDefaultTimeout(25000);
const G = async p => { const r = await ctx.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true}); return await r.json().catch(()=>null); };
const out = {};

async function flip(label, expectDir) {
  await page.goto('https://app.shopview.com/administration/settings',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
  await openWoSettings(page);
  const r0 = await readWoSettings(page);
  const idx = r0.settings.findIndex(s => s.label === label);
  console.log(`\n--- ${label}: currently ${r0.settings[idx].on ? 'ON' : 'off'}, flipping to ${expectDir}`);
  await page.locator('.q-tab-panel:has-text("Save Settings") .q-toggle').nth(idx).click();
  await page.waitForTimeout(3500);
  const dlg = await page.evaluate(()=>{const d=document.querySelector('.q-dialog');return d?(d.innerText||'').trim():null;});
  console.log('DIALOG:', dlg && dlg.replace(/\n+/g,' | '));
  await page.screenshot({ path: `${EV}/C44557-picking-${expectDir}-dialog.png` });
  const aff = page.locator('.q-dialog').locator(`button:has-text("Turn ${expectDir}"), .q-btn:has-text("Turn ${expectDir}")`).first();
  await aff.click();
  await page.waitForTimeout(3000);
  await page.locator('.q-tab-panel:has-text("Save Settings") .q-btn:has-text("Save Settings")').first().click({timeout:20000}).catch(e=>console.log('save:',e.message.split('\n')[0]));
  await page.waitForTimeout(8000);
  const st = (await G('/api/organizations/settings')).data;
  console.log('stored autoPickInventoryParts =', st.autoPickInventoryParts, '(require picking =', !st.autoPickInventoryParts, ')');
  return { dialog: dlg, stored: st };
}

// stock levels before, so the "deducted from stock" claim can be checked
const invBefore = await G('/api/inventory/parts?pagination%5BrowsPerPage%5D=50&pagination%5Bpage%5D=1&pagination%5BsortBy%5D=&pagination%5Bdescending%5D=false&supply_filter=all&search=');
fs.writeFileSync(`${EV}/inventory-before.json`, JSON.stringify(invBefore,null,1));

out.on = await flip('Require Picking Inventory Parts', 'On');
await openWo(page, INV_WO);
const t1 = await bodyText(page);
fs.writeFileSync(`${EV}/C44552-picking-ON-S2-908.txt`, t1);
await page.screenshot({ path: `${EV}/C44552-picking-ON-S2-908.png`, fullPage: true });
const exact1 = await page.evaluate(() => [...document.querySelectorAll('button, .q-btn, .q-item')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').trim()).filter(t=>['Order','Pick','Receive','Return'].includes(t)));
console.log('exact action buttons with picking ON:', JSON.stringify(exact1));
const badges1 = await page.evaluate(()=>[...new Set([...document.querySelectorAll('.q-badge,.q-chip')].map(e=>(e.innerText||'').trim()).filter(x=>x&&x.length<25))]);
console.log('badges with picking ON:', JSON.stringify(badges1));
out.pickingOnScreen = { exact: exact1, badges: badges1 };

out.off = await flip('Require Picking Inventory Parts', 'Off');
const invAfter = await G('/api/inventory/parts?pagination%5BrowsPerPage%5D=50&pagination%5Bpage%5D=1&pagination%5BsortBy%5D=&pagination%5Bdescending%5D=false&supply_filter=all&search=');
fs.writeFileSync(`${EV}/inventory-after.json`, JSON.stringify(invAfter,null,1));
fs.writeFileSync(`${EV}/C44552-C44557-picking.json`, JSON.stringify(out,null,1));
await browser.close();
