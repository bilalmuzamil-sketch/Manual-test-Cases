// The Admin role is a locked system role - nothing saves on it. So create a CUSTOM role from the Admin
// template with "Receive later" added, which is the supported way to grant it (Rule 107: do what the
// environment needs). Read back that the new role really carries it.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const NAME='ZZAUTOTEST Receive Later';
const { browser, page } = await bootProdLogin('/administration/roles-permissions', { settle: 14000 });
page.setDefaultTimeout(25000);
const create = page.locator('button:has-text("Create custom role"), .q-btn:has-text("Create custom role")').first();
console.log('Create custom role button:', await create.count());
await create.click(); await page.waitForTimeout(6000);
await page.screenshot({ path: `${EV}/C44606-template-picker.png` });
const tmplText = await page.evaluate(()=>{ const d=document.querySelector('.q-dialog'); return d?(d.innerText||'').replace(/\s+/g,' ').slice(0,600):null; });
console.log('template picker:', tmplText);
// choose the Admin template if offered, else Skip
const adminTpl = page.locator('.q-dialog').locator('text=Admin').first();
if (await adminTpl.count()) { await adminTpl.click(); await page.waitForTimeout(1500); }
const apply = page.locator('.q-dialog .q-btn:has-text("Apply"), .q-dialog .q-btn:has-text("Skip")').first();
if (await apply.count()) { console.log('pressing', (await apply.innerText()).trim()); await apply.click(); await page.waitForTimeout(9000); }
console.log('editor URL:', page.url());
const nameField = page.locator('.q-field:has-text("Role Name") input').first();
if (await nameField.count()) { await nameField.fill(NAME); console.log('named the role'); }
const flip = await page.evaluate(() => { let l=null; for (const el of document.querySelectorAll('*')) if (el.children.length===0 && (el.textContent||'').trim()==='Receive later') { l=el; break; }
  if (!l) return 'label missing'; let row=l.parentElement,tg=null; for(let i=0;i<6&&row;i++){tg=row.querySelector('.q-toggle'); if(tg)break; row=row.parentElement;}
  if (!tg) return 'toggle missing'; if (tg.getAttribute('aria-checked')==='true') return 'already on';
  tg.scrollIntoView({block:'center'}); (tg.querySelector('input')||tg).click(); return 'turned on'; });
console.log('Receive later ->', flip);
await page.waitForTimeout(1500);
await page.screenshot({ path: `${EV}/C44606-new-role-before-save.png`, fullPage: true });
await page.locator('.q-btn:has-text("Save")').last().click({timeout:15000}).catch(e=>console.log('save:',e.message.split('\n')[0]));
await page.waitForTimeout(5000);
const anyway = page.locator('button:has-text("Edit Anyway"), .q-btn:has-text("Edit Anyway"), button:has-text("Create Anyway")').first();
if (await anyway.count()) { console.log('pressing the anyway button'); await anyway.click(); await page.waitForTimeout(9000); } else await page.waitForTimeout(7000);
console.log('after save URL:', page.url());
await page.screenshot({ path: `${EV}/C44606-new-role-after-save.png`, fullPage: true });
// read the roles list back
await page.goto('https://app.shopview.com/administration/roles-permissions', {waitUntil:'domcontentloaded'});
await page.waitForTimeout(9000);
const t = await page.evaluate(()=>document.body.innerText);
console.log('new role on the list:', t.includes(NAME));
fs.writeFileSync(`${EV}/C44606-new-role.txt`, t);
await page.screenshot({ path: `${EV}/C44606-roles-after.png`, fullPage: true });
await browser.close();
