// Why did the permission not land? Watch what the role editor actually sends when Save is pressed.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ROLE='2a43e6cb-34ab-4475-bd02-242361a725f5';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 9000 });
page.setDefaultTimeout(25000);
const calls=[];
page.on('request', r => { if (/\/api\//.test(r.url()) && r.method()!=='GET') calls.push({d:'->',m:r.method(),u:r.url().replace('https://api.shopview.com',''),body:(r.postData()||'').slice(0,600)}); });
page.on('response', async r => { if (/\/api\//.test(r.url()) && r.request().method()!=='GET') calls.push({d:'<-',s:r.status(),u:r.url().replace('https://api.shopview.com',''),body:(await r.text().catch(()=>'')).slice(0,600)}); });
// what role am I actually in?
const me = await (await ctx.request.get(`https://${APIH}/api/iam/view-profile/`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json();
console.log('my role_id:', me.user?.role_id);
await page.goto(`https://app.shopview.com/administration/roles-permissions/${ROLE}/edit`, {waitUntil:'domcontentloaded'});
await page.waitForTimeout(11000);
const roleName = await page.evaluate(()=>{ const i=document.querySelector('input'); return i? i.value : null; });
const locked = await page.evaluate(()=>/System|lock|read.only/i.test(document.body.innerText.slice(0,600)));
console.log('role name in the editor:', roleName, '| looks locked:', locked);
await page.evaluate(() => { let label=null; for (const el of document.querySelectorAll('*')) if (el.children.length===0 && (el.textContent||'').trim()==='Receive later') { label=el; break; }
  let row=label.parentElement, tg=null; for (let i=0;i<6&&row;i++){ tg=row.querySelector('.q-toggle'); if(tg)break; row=row.parentElement; }
  tg.scrollIntoView({block:'center'}); (tg.querySelector('input')||tg).click(); });
await page.waitForTimeout(1500);
await page.locator('.q-btn:has-text("Save"), button:has-text("Save")').last().click({timeout:15000}).catch(e=>console.log('save click:',e.message.split('\n')[0]));
await page.waitForTimeout(9000);
console.log('=== what the editor sent ==='); for (const c of calls) console.log(JSON.stringify(c).slice(0,700));
const t = await page.evaluate(()=>document.body.innerText);
const err = t.match(/(error|failed|cannot|not allowed)[^\n]{0,80}/i);
console.log('any message on screen:', err? err[0] : 'none');
await page.screenshot({ path: `${EV}/C44606-role-save-attempt.png`, fullPage: true });
fs.writeFileSync(`${EV}/C44606-role-save-calls.json`, JSON.stringify(calls,null,1));
await browser.close();
