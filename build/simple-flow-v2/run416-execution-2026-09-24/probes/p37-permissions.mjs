// C44606: is there a "Received later" permission in the Work Orders section of a role, as a yes/no
// toggle, and is it off by default in every role? Read the roles list and every role's editor.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const { browser, page, ctx, APIH } = await bootProdLogin('/administration/roles-permissions', { settle: 15000 });
page.setDefaultTimeout(20000);
const t = await page.evaluate(()=>document.body.innerText);
fs.writeFileSync(`${EV}/C44606-roles-list.txt`, t);
await page.screenshot({ path: `${EV}/C44606-roles-list.png`, fullPage: true });
console.log('ROLES PAGE:', page.url());
console.log(t.slice(Math.max(0,t.indexOf('Invoices')+9), 1600));
// open the first role's editor and search the permission list
const pencil = page.locator('button:has-text("edit"), .q-btn:has-text("edit")').first();
if (await pencil.count()) { await pencil.click(); await page.waitForTimeout(9000); }
console.log('editor URL:', page.url());
const et = await page.evaluate(()=>document.body.innerText);
fs.writeFileSync(`${EV}/C44606-role-editor.txt`, et);
await page.screenshot({ path: `${EV}/C44606-role-editor.png`, fullPage: true });
for (const w of ['Received later','Receive later','Received Later','Receive Later','Pick Parts','Order Parts','See Financial Data','Work Orders']) console.log(' ', w, '->', et.includes(w));
// use the editor's own search box if there is one
const search = page.locator('input[placeholder*="Search" i]').first();
if (await search.count()) { await search.fill('later'); await page.waitForTimeout(4000);
  const after = await page.evaluate(()=>document.body.innerText);
  fs.writeFileSync(`${EV}/C44606-role-editor-search-later.txt`, after);
  await page.screenshot({ path: `${EV}/C44606-role-editor-search.png`, fullPage: true });
  console.log('\n=== searching the permission list for "later" ==='); console.log(after.slice(Math.max(0,after.indexOf('Invoices')+9), 2000)); }
await browser.close();
