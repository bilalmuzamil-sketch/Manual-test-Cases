// Does the role editor save ANYTHING, or only fail on "Receive later"? Two controls:
// (a) flip a DIFFERENT permission on the Admin role and see whether that persists;
// (b) create a brand new role with Receive later on and see whether it persists.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ROLE='2a43e6cb-34ab-4475-bd02-242361a725f5';
const { browser, page } = await bootProdLogin('/administration/roles-permissions', { settle: 13000 });
page.setDefaultTimeout(25000);
const out = {};

// --- (a) a different permission on the same role: "Move labor"
async function flipAndRead(label) {
  await page.goto(`https://app.shopview.com/administration/roles-permissions/${ROLE}/edit`, {waitUntil:'domcontentloaded'});
  await page.waitForTimeout(11000);
  const was = await page.evaluate((L) => { let l=null; for (const el of document.querySelectorAll('*')) if (el.children.length===0 && (el.textContent||'').trim()===L) { l=el; break; }
    if (!l) return null; let row=l.parentElement,tg=null; for(let i=0;i<6&&row;i++){tg=row.querySelector('.q-toggle'); if(tg)break; row=row.parentElement;}
    if(!tg) return null; const s=tg.getAttribute('aria-checked'); tg.scrollIntoView({block:'center'}); (tg.querySelector('input')||tg).click(); return s; }, label);
  if (was === null) return { label, err: 'no toggle' };
  await page.waitForTimeout(1500);
  await page.locator('.q-btn:has-text("Save")').last().click({timeout:15000}).catch(()=>{});
  await page.waitForTimeout(4000);
  const anyway = page.locator('button:has-text("Edit Anyway"), .q-btn:has-text("Edit Anyway")').first();
  if (await anyway.count()) { await anyway.click(); await page.waitForTimeout(9000); } else { await page.waitForTimeout(6000); }
  await page.goto(`https://app.shopview.com/administration/roles-permissions/${ROLE}/edit`, {waitUntil:'domcontentloaded'});
  await page.waitForTimeout(11000);
  const now = await page.evaluate((L) => { let l=null; for (const el of document.querySelectorAll('*')) if (el.children.length===0 && (el.textContent||'').trim()===L) { l=el; break; }
    let row=l.parentElement,tg=null; for(let i=0;i<6&&row;i++){tg=row.querySelector('.q-toggle'); if(tg)break; row=row.parentElement;}
    return tg.getAttribute('aria-checked'); }, label);
  console.log(`${label}: was ${was} -> after save and reload ${now} | persisted: ${was !== now}`);
  return { label, was, now, persisted: was !== now };
}
out.moveLabor = await flipAndRead('Move labor');
if (out.moveLabor.persisted) await flipAndRead('Move labor'); // put it back
out.receiveLater = await flipAndRead('Receive later');
if (out.receiveLater.persisted) { console.log('Receive later DID persist this time'); await flipAndRead('Receive later'); }
fs.writeFileSync(`${EV}/C44606-role-save-control.json`, JSON.stringify(out,null,1));
await browser.close();
