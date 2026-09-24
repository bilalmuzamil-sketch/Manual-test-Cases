// Visit several work orders in one session and dump the part rows, badges, buttons and every ... menu.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo, bodyText, actions } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const TAG = process.argv[2] || 'state';
const WOS = process.argv.slice(3).map(s => { const [n, id] = s.split('='); return { n, id }; });
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 9000 });
page.setDefaultTimeout(18000);
const st = (await (await ctx.request.get(`https://${APIH}/api/organizations/settings`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json()).data;
console.log('SETTINGS NOW:', JSON.stringify({requireOrdering:st.requireOrderingParts, autoPick:st.autoPickInventoryParts, autoApprove:st.autoApproveLines, receiving:st.requireVendorInvoiceNumber}));
const out = { tag: TAG, settings: st, wos: [] };
for (const w of WOS) {
  console.log('\n######', w.n, w.id);
  await openWo(page, w.id);
  const t = await bodyText(page);
  await page.screenshot({ path: `${EV}/${TAG}-${w.n}.png`, fullPage: true });
  fs.writeFileSync(`${EV}/${TAG}-${w.n}.txt`, t);
  const words = ['Order', 'Pick', 'Receive', 'Awaiting', 'In stock', 'In Stock', 'Ordered', 'Received', 'Returned', 'Auth To Order', 'Picked', 'Needs Approval', 'Approve', 'Decline'];
  const hits = {}; for (const x of words) hits[x] = t.includes(x);
  console.log('words on screen:', JSON.stringify(hits));
  const acts = (await actions(page)).filter(a => !/ShopHub|Work Orders|Schedule|Customers|Parts|Reports|Clock In|notifications|Trucks Hill/.test(a.t));
  console.log('buttons:', JSON.stringify(acts.map(a => (a.disabled ? '[off]' : '') + a.t.slice(0, 40))));
  const menus = [];
  const all = page.locator('button:has-text("more_vert"), .q-btn:has-text("more_vert")');
  const n = await all.count();
  for (let i = 0; i < Math.min(n, 10); i++) {
    try { await all.nth(i).click({ timeout: 6000 }); await page.waitForTimeout(1800);
      const items = await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.innerText||'').trim().replace(/\s+/g,' ')).filter(Boolean));
      menus.push(items); console.log(` menu#${i}:`, JSON.stringify(items));
      await page.keyboard.press('Escape'); await page.waitForTimeout(800);
    } catch(e){ menus.push(['ERR']); }
  }
  out.wos.push({ ...w, hits, acts, menus });
}
fs.writeFileSync(`${EV}/${TAG}-multi.json`, JSON.stringify(out, null, 1));
await browser.close();
