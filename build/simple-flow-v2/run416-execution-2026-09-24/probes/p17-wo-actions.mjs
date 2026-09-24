// Read a work order's part rows and menus in whatever settings state the org is in now.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo, bodyText, actions } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ID = process.argv[2], TAG = process.argv[3];
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 9000 });
page.setDefaultTimeout(20000);
const st = (await (await ctx.request.get(`https://${APIH}/api/organizations/settings`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json()).data;
console.log('settings now:', JSON.stringify({ordering:st.requireOrderingParts, autoPick:st.autoPickInventoryParts, autoApprove:st.autoApproveLines, receiving:st.requireVendorInvoiceNumber}));
await openWo(page, ID);
const t = await bodyText(page);
fs.writeFileSync(`${EV}/${TAG}.txt`, t);
await page.screenshot({ path: `${EV}/${TAG}.png`, fullPage: true });
console.log('Order on screen?', /\bOrder\b/.test(t), '| Pick?', /\bPick\b/.test(t), '| Receive?', /\bReceive\b/.test(t));
const acts = await actions(page);
console.log('=== buttons ==='); for (const a of acts) console.log((a.disabled?'[off] ':'      ')+a.t.slice(0,60));
const menus = [];
const all = page.locator('button:has-text("more_vert"), .q-btn:has-text("more_vert")');
const n = await all.count();
for (let i = 0; i < Math.min(n, 10); i++) {
  try { await all.nth(i).click({ timeout: 7000 }); await page.waitForTimeout(2000);
    const items = await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.innerText||'').trim().replace(/\s+/g,' ')).filter(Boolean));
    menus.push(items); console.log(`menu#${i}:`, JSON.stringify(items));
    await page.keyboard.press('Escape'); await page.waitForTimeout(900);
  } catch(e){ menus.push(['ERR '+e.message.split('\n')[0]]); console.log(`menu#${i} ERR`); }
}
fs.writeFileSync(`${EV}/${TAG}-menus.json`, JSON.stringify({settings:st, buttons:acts, menus}, null, 1));
await browser.close();
