// Learn the work-order detail route and the Lines/part row UI by walking the screen (Rule: never guess a route).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO = process.argv[2] || 'S2-861';
const { browser, page } = await bootProdLogin('/workorders', { settle: 14000 });
// search for the work order by its number, then open it
const search = page.locator('input[placeholder*="Search" i]').first();
try { await search.fill(WO); await page.waitForTimeout(5000); } catch(e){ console.log('no search box:', e.message); }
const row = page.locator(`text=${WO}`).first();
await row.click({ timeout: 20000 });
await page.waitForTimeout(9000);
console.log('URL after opening', WO, '->', page.url());
const t = await page.evaluate(()=>document.body.innerText);
fs.writeFileSync(`${EV}/wo-${WO}-detail.txt`, t);
await page.screenshot({ path: `${EV}/wo-${WO}-detail.png` });
const i = t.indexOf('Invoices'); console.log(t.slice(i>0?i:0, i+3000));
const tabs = await page.evaluate(()=>[...document.querySelectorAll('[role=tab], .q-tab')].map(e=>(e.innerText||'').trim()).filter(Boolean));
console.log('TABS:', JSON.stringify(tabs));
await browser.close();
