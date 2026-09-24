// Change my own Role in the Edit Staff Member dialog, prove the permission arrived, read the Receive
// control, then change the Role back. (Rule 107 - do what the environment needs; restore afterwards.)
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo, bodyText } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='79476028-70b2-44c7-9e34-0eddc62c15af';
const { browser, page, ctx, APIH } = await bootProdLogin('/administration/staff?roles=Admin', { settle: 14000 });
page.setDefaultTimeout(25000);
const perms = async () => { const j = await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json(); return (j?.data?.fe_permissions||[]).length; };
async function switchRole(fromFilter, to) {
  await page.goto(`https://app.shopview.com/administration/staff?roles=${encodeURIComponent(fromFilter)}`, {waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
  const row = page.locator('tr', { hasText: 'bilal.muzamil@shopview.com' }).first();
  if (!(await row.count())) return 'no row under filter ' + fromFilter;
  await row.hover(); await page.waitForTimeout(1000);
  await row.locator('.q-btn:has-text("edit")').first().click(); await page.waitForTimeout(6000);
  const opened = await page.evaluate(() => { const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
    const f=[...d.querySelectorAll('.q-field')].find(x=>/^Role/.test((x.innerText||'').trim())); if(!f) return 'no Role field';
    f.scrollIntoView({block:'center'}); f.click(); return 'opened'; });
  await page.waitForTimeout(3000);
  const chose = await page.evaluate((n)=>{ const it=[...document.querySelectorAll('.q-menu .q-item')].find(e=>(e.innerText||'').trim()===n);
    if(!it) return 'not offered: '+[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.innerText||'').trim()).join(' | ').slice(0,300);
    it.click(); return 'chose '+n; }, to);
  console.log(' role picker:', opened, '|', chose);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${EV}/staff-role-${to.replace(/\W/g,'')}.png` });
  const saved = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
    const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/Save/.test((x.innerText||'').trim())); if(!b) return 'no save'; b.click(); return 'pressed '+(b.innerText||'').trim(); });
  console.log(' save:', saved); await page.waitForTimeout(9000);
  return saved;
}
console.log('permissions before:', await perms());
console.log(await switchRole('Admin', 'ZZAUTOTEST Receive Later'));
const got = await perms(); console.log('permissions after:', got);
if (got !== 58) {
  await openWo(page, WO); await page.waitForTimeout(5000);
  const t = await bodyText(page);
  const info = await page.evaluate(() => [...document.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width && /^Receive/.test((b.innerText||'').trim()))
    .map(b => ({ text:(b.innerText||'').trim(), parentHTML:(b.parentElement||{}).innerHTML?.slice(0,500) })));
  console.log('Receive controls:', JSON.stringify(info.map(x=>x.text)));
  console.log('a caret next to it:', JSON.stringify(info.map(x=>/arrow_drop_down|expand_more/.test(x.parentHTML||''))));
  console.log('"Receive later" on the page:', t.includes('Receive later'));
  await page.screenshot({ path: `${EV}/C44592-split-button.png`, fullPage: true });
  // click the caret if there is one
  const caret = page.locator('.q-btn:has-text("arrow_drop_down")').last();
  if (await caret.count()) { await caret.click().catch(()=>{}); await page.waitForTimeout(2200);
    const items = await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.innerText||'').trim()).filter(Boolean));
    console.log('the caret offers:', JSON.stringify(items)); await page.screenshot({ path: `${EV}/C44592-caret.png` }); }
  fs.writeFileSync(`${EV}/C44592-split.json`, JSON.stringify({perms:got, info, hasText:t.includes('Receive later')},null,1));
} else console.log('role change did not land - not judging');
console.log(await switchRole('ZZAUTOTEST Receive Later', 'Admin'));
console.log('permissions restored:', await perms());
await browser.close();
