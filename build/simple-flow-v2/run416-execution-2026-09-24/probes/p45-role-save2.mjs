// Retry the grant: make sure the Role Name field is filled, press the editor's own Save, and read
// whatever the screen says back. Then prove the permission landed before judging anything.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ROLE='2a43e6cb-34ab-4475-bd02-242361a725f5';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 9000 });
page.setDefaultTimeout(25000);
const perms = async () => { const j = await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json(); return (j?.data?.fe_permissions||[]).length; };
console.log('permissions before:', await perms());
const calls=[];
page.on('response', async r => { const u=r.url(); if (/\/api\//.test(u) && !u.includes('sentry') && r.request().method()!=='GET') calls.push({s:r.status(),u:u.replace('https://api.shopview.com',''),body:(await r.text().catch(()=>'')).slice(0,300)}); });
await page.goto(`https://app.shopview.com/administration/roles-permissions/${ROLE}/edit`, {waitUntil:'domcontentloaded'});
await page.waitForTimeout(11000);
const fields = await page.evaluate(()=>[...document.querySelectorAll('input')].map(i=>({label:(i.closest('.q-field')?.innerText||'').split('\n')[0], value:i.value, type:i.type})).filter(f=>f.type!=='checkbox'));
console.log('fields in the editor:', JSON.stringify(fields));
const nameInput = page.locator('.q-field:has-text("Role Name") input').first();
if (await nameInput.count()) { const v = await nameInput.inputValue(); console.log('Role Name reads:', JSON.stringify(v));
  if (!v) { await nameInput.fill('Admin'); console.log('filled Role Name with Admin'); } }
await page.evaluate(() => { let label=null; for (const el of document.querySelectorAll('*')) if (el.children.length===0 && (el.textContent||'').trim()==='Receive later') { label=el; break; }
  let row=label.parentElement, tg=null; for (let i=0;i<6&&row;i++){ tg=row.querySelector('.q-toggle'); if(tg)break; row=row.parentElement; }
  tg.scrollIntoView({block:'center'}); (tg.querySelector('input')||tg).click(); });
await page.waitForTimeout(1500);
const saveBtns = await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width && /^Save/.test((b.innerText||'').trim())).map(b=>({t:(b.innerText||'').trim(), disabled:b.disabled===true||/disabled/.test((b.className||'').toString())})));
console.log('Save buttons:', JSON.stringify(saveBtns));
await page.locator('.q-btn:has-text("Save")').last().click({timeout:15000}).catch(e=>console.log('click:',e.message.split('\n')[0]));
await page.waitForTimeout(10000);
await page.screenshot({ path: `${EV}/C44606-save2.png`, fullPage: true });
console.log('writes the page made:'); for (const c of calls) console.log(' ', c.s, c.u, c.body.slice(0,180));
const t = await page.evaluate(()=>document.body.innerText);
const m = t.match(/(required|error|failed|already exists|duplicate)[^\n]{0,100}/i);
console.log('message on screen:', m? m[0] : 'none');
console.log('permissions after:', await perms());
fs.writeFileSync(`${EV}/C44606-save2.json`, JSON.stringify({fields, saveBtns, calls}, null, 1));
await browser.close();
