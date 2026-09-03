// Evidence for the observed-label file: the "Issue Credit" dialog's own wording, read off the screen.
// The label gate flagged "Issue Store Credit" as never observed - it was used all night to seed data,
// but a label enters the reference only from a probe with committed evidence, never from memory.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const CUST='4f8e5beb-78a2-44ed-9dfe-eebc1bc2e8f4', OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP } = await boot('sv8218', '/customers', 'admin');
const build = await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content);
await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await page.locator('button:has-text("Issue Credit")').first().click(); await page.waitForTimeout(4000);
const snap = () => page.evaluate(()=>{ const x=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].pop();
  const lab=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg').forEach(n=>n.remove());return (c.textContent||'').replace(/\s+/g,' ').trim();};
  return [...x.querySelectorAll('button')].map(lab).filter(Boolean); });
console.log('buttons BEFORE picking an outcome:', JSON.stringify(await snap()));
await page.locator('.q-dialog .q-radio', { hasText: 'Issue Store Credit' }).first().click();
await page.waitForTimeout(1500);
console.log('buttons AFTER picking "Issue Store Credit":', JSON.stringify(await snap()));
const d = await page.evaluate(()=>{ const x=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].pop();
  const lab=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg').forEach(n=>n.remove());return (c.textContent||'').replace(/\s+/g,' ').trim();};
  return { whole: lab(x),
    radios: [...x.querySelectorAll('.q-radio')].map(lab),
    buttons:[...x.querySelectorAll('button')].map(lab).filter(Boolean),
    fieldLabels: [...x.querySelectorAll('label, .q-field__label')].map(lab).filter(Boolean) }; });
console.log('build', build);
console.log(JSON.stringify(d,null,1));
await page.screenshot({path:`${OUT}/issue-credit-dialog.png`});
fs.writeFileSync(`${OUT}/issue-credit-dialog.json`, JSON.stringify({build, ...d},null,1));
await browser.close();
