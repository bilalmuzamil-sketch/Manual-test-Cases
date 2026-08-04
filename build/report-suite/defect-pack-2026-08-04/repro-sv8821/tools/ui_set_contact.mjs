// ui_set_contact.mjs — on a work order whose Finance tab is disabled ("Please select a contact for
// the asset"), use the product's OWN Contact picker on the customer card, then re-check whether the
// Finance tab enables and Create Invoice succeeds. This completes the user-path story: the product
// tells you what to do, and once you do it, invoicing works.
// Usage: node ui_set_contact.mjs <woId>
import fs from 'fs';
import { boot } from '../../../viu-2026-08-03/tools/boot8582.mjs';
import { APP } from '../../../viu-2026-08-03/tools/qa8582.mjs';
const woId = process.argv[2];
const OUT = '/tmp/sv8821/ui-setcontact'; fs.mkdirSync(OUT, { recursive: true });
const { browser, page } = await boot('admin', { workplaceId: 'b3c8c820-f815-4cf1-8938-10956c5ee71a' });
const calls = [];
page.on('request', r => { if (r.url().includes('/api/') && r.method() !== 'GET') calls.push({ phase: 'req', method: r.method(), url: r.url(), body: r.postData() }); });
page.on('response', async r => { if (!r.url().includes('/api/') || r.request().method() === 'GET') return;
  let b = null; try { b = (await r.text()).slice(0, 500); } catch {}
  calls.push({ phase: 'res', status: r.status(), method: r.request().method(), url: r.url(), reqid: r.headers()['x-request-id'] || null, body: b }); });
const click = async (loc, why) => { const b = await loc.boundingBox().catch(() => null);
  if (!b) { console.log('  !! cannot click:', why); return false; }
  await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); return true; };

await page.goto(APP + `/workorders/${woId}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(7000);
const before = await page.evaluate(() => { const t = [...document.querySelectorAll('[role="tab"]')].find(x => /Finance/.test(x.innerText));
  return t ? (t.getAttribute('aria-disabled') === 'true' || t.className.includes('disabled')) : null; });
console.log('Finance tab disabled BEFORE:', before);
await page.screenshot({ path: `${OUT}/01-before.png`, fullPage: true });

// the Contact picker lives on the customer card in the left column
const contactField = page.locator('.q-field').filter({ hasText: /^\s*Contact/ }).first();
let ok = await click(contactField, 'Contact picker');
if (!ok) ok = await click(page.locator('text=Contact').first(), 'Contact label');
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}/02-contact-menu.png`, fullPage: true });
// the Contact dropdown renders its options INLINE under the field (not in a .q-menu popup),
// so target the option items in the expanded list itself
let optLoc = page.locator('.q-menu:visible .q-item');
if (!(await optLoc.count())) optLoc = page.locator('.q-item:visible, .q-virtual-scroll__content > *:visible');
const opts = await optLoc.allInnerTexts().catch(() => []);
console.log('CONTACT OPTIONS OFFERED:', JSON.stringify(opts.map(o => o.trim().replace(/\s+/g, ' ')).slice(0, 8)));
const pick = (process.argv[3] || '').trim();
if (pick) {
  console.log('picking contact by name:', pick, '->', await click(page.locator(`text="${pick}"`).last(), 'contact ' + pick));
  await page.waitForTimeout(5000);
} else if (opts.length) {
  await click(optLoc.first(), 'first contact');
  await page.waitForTimeout(5000);
}
await page.screenshot({ path: `${OUT}/03-after-contact.png`, fullPage: true });
// picking a contact raises a confirmation: "Would you like to change to the new contact for this
// asset permanently?" — the contact is an attribute of the ASSET, which is why the Finance tab's
// tooltip says "for the asset".
const conf = await page.locator('.q-dialog:visible').innerText().catch(() => '');
if (conf) {
  console.log('CONFIRMATION DIALOG:', conf.replace(/\n+/g, ' | ').slice(0, 300));
  console.log('clicking YES:', await click(page.locator('.q-dialog:visible button').filter({ hasText: /^YES$/i }).first(), 'YES'));
  await page.waitForTimeout(6000);
  await page.screenshot({ path: `${OUT}/03b-after-confirm.png`, fullPage: true });
}
console.log('\n=== WHAT SELECTING A CONTACT SENT ===');
for (const c of calls) { const p = c.url.replace(/^https:\/\/[^/]+/, '');
  if (c.phase === 'req') console.log('  REQ ', c.method, p, '\n        body:', String(c.body || '').slice(0, 400));
  else console.log('  RES ', c.status, p); }

const after = await page.evaluate(() => { const t = [...document.querySelectorAll('[role="tab"]')].find(x => /Finance/.test(x.innerText));
  return t ? (t.getAttribute('aria-disabled') === 'true' || t.className.includes('disabled')) : null; });
console.log('\nFinance tab disabled AFTER selecting a contact:', after);

if (after === false) {
  const fin = page.locator('[role="tab"]').filter({ hasText: 'Finance' }).first();
  await click(fin, 'Finance tab'); await page.waitForTimeout(4500);
  const n = await page.locator('button').filter({ hasText: /Create Invoice/i }).count();
  console.log('"Create Invoice" buttons now on screen:', n);
  const mark = calls.length;
  if (n) { await click(page.locator('button').filter({ hasText: /Create Invoice/i }).first(), 'Create Invoice');
    await page.waitForTimeout(6000);
    await page.screenshot({ path: `${OUT}/04-after-create-invoice.png`, fullPage: true });
    console.log('\n=== WHAT CREATE INVOICE SENT (from the screen) ===');
    for (const c of calls.slice(mark)) { const p = c.url.replace(/^https:\/\/[^/]+/, '');
      if (c.phase === 'req') console.log('  REQ ', c.method, p, '\n        body:', String(c.body || '').slice(0, 600));
      else console.log('  RES ', c.status, p, c.reqid ? '| reqid ' + c.reqid : '', c.status >= 400 ? '\n        body: ' + c.body : ''); }
  }
}
fs.writeFileSync(`${OUT}/calls.json`, JSON.stringify(calls, null, 1));
await browser.close();
console.log('evidence:', OUT);
