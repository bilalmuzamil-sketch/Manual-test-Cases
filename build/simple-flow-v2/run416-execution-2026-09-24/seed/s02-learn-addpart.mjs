// Learn the Add Part flow by driving it on a throwaway line and watching what the app sends.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from '../probes/lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/seed';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a'; // S2-908
const { browser, page } = await bootProdLogin('/workorders', { settle: 10000 });
page.setDefaultTimeout(25000);
const calls=[];
page.on('request', r=>{ const u=r.url(); if (u.includes('/api/') && !u.includes('sentry') && r.method()!=='GET') calls.push({m:r.method(), u:u.replace('https://api.shopview.com',''), body:(r.postData()||'').slice(0,500)}); });
page.on('response', async r=>{ const u=r.url(); if (u.includes('/api/') && !u.includes('sentry') && r.request().method()!=='GET') calls.push({s:r.status(), u:u.replace('https://api.shopview.com',''), body:(await r.text().catch(()=>'')).slice(0,400)}); });
await openWo(page, WO); await page.waitForTimeout(4000);
const add = page.locator('.q-btn:has-text("Add Part"), button:has-text("Add Part")').first();
console.log('Add Part buttons:', await page.locator('.q-btn:has-text("Add Part"), button:has-text("Add Part")').count());
await add.click(); await page.waitForTimeout(6000);
await page.screenshot({ path: `${EV}/addpart-dialog.png`, fullPage: true });
const dlg = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
  if (!d) return null;
  return { text:(d.innerText||'').replace(/\s+/g,' ').slice(0,900),
    fields:[...d.querySelectorAll('.q-field')].map(f=>(f.innerText||'').split('\n')[0]),
    tabs:[...d.querySelectorAll('[role=tab], .q-tab')].map(e=>(e.innerText||'').trim()),
    buttons:[...d.querySelectorAll('button,.q-btn')].map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean) }; });
console.log('ADD PART DIALOG:', JSON.stringify(dlg,null,1));
fs.writeFileSync(`${EV}/addpart-dialog.json`, JSON.stringify({dlg, calls}, null, 1));
await page.keyboard.press('Escape');
await browser.close();
