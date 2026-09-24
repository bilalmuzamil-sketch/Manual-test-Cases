import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo, bodyText } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const NEW='ZZAUTOTEST Receive Later', OLD='Admin', WO='79476028-70b2-44c7-9e34-0eddc62c15af';
const { browser, page, ctx, APIH } = await bootProdLogin('/administration/staff', { settle: 14000 });
page.setDefaultTimeout(25000);
const perms = async () => { const j = await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json(); return (j?.data?.fe_permissions||[]).length; };

async function setMyRole(roleName) {
  // the list remembers a role filter, so ask for the roles I might be in explicitly
  const want = encodeURIComponent(roleName === 'Admin' ? 'ZZAUTOTEST Receive Later' : 'Admin');
  await page.goto(`https://app.shopview.com/administration/staff?roles=${want}`, {waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
  // clear any role filter the page remembered
  const clear = page.locator('.q-chip .q-icon:has-text("cancel"), button:has-text("Clear")').first();
  if (await clear.count()) { await clear.click().catch(()=>{}); await page.waitForTimeout(3000); }
  const search = page.locator('input[type=search], input[placeholder*="Search" i]').first();
  if (await search.count()) { await search.fill('bilal.muzamil'); await page.waitForTimeout(5000); }
  const t = await page.evaluate(()=>document.body.innerText);
  console.log('my row on the staff list:', t.includes('bilal.muzamil@shopview.com'), '| url', page.url());
  const row = page.locator('tr', { hasText: 'bilal.muzamil@shopview.com' }).first();
  if (!(await row.count())) { await page.screenshot({path:`${EV}/staff-not-found.png`, fullPage:true}); return 'row not found'; }
  await row.click(); await page.waitForTimeout(8000);
  console.log('  editor:', page.url());
  await page.screenshot({ path: `${EV}/staff-editor-${roleName.replace(/\W/g,'')}.png`, fullPage: true });
  const opened = await page.evaluate(() => { const f=[...document.querySelectorAll('.q-field')].find(x=>/Role/i.test((x.innerText||'').split('\n')[0]||''));
    if(!f) return 'no role field'; f.click(); return 'opened: ' + (f.innerText||'').replace(/\s+/g,' ').slice(0,80); });
  console.log(' ', opened); await page.waitForTimeout(3000);
  const chose = await page.evaluate((n) => { const it=[...document.querySelectorAll('.q-menu .q-item')].find(e=>(e.innerText||'').trim().startsWith(n));
    if(!it) return 'not offered; options: ' + [...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.innerText||'').trim()).slice(0,12).join(' | ');
    it.click(); return 'chose ' + n; }, roleName);
  console.log(' ', chose); await page.waitForTimeout(2500);
  const ok = await page.evaluate(()=>{ const b=[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width).find(x=>/^(Save|Update|Save Changes)$/i.test((x.innerText||'').trim()));
    if(!b) return 'no save button: '+[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width).map(x=>(x.innerText||'').trim()).slice(-6).join('|');
    b.click(); return 'pressed '+(b.innerText||'').trim(); });
  console.log(' ', ok); await page.waitForTimeout(9000);
  return ok;
}
console.log('permissions before:', await perms());
console.log(await setMyRole(NEW));
const after = await perms();
console.log('permissions after:', after);
if (after > 58) {
  await openWo(page, WO); await page.waitForTimeout(4500);
  const t = await bodyText(page);
  const info = await page.evaluate(() => [...document.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width && /^Receive/.test((b.innerText||'').trim()))
    .map(b => ({ text:(b.innerText||'').trim(), parentHTML:(b.parentElement||{}).innerHTML?.slice(0,400) })));
  console.log('Receive controls:', JSON.stringify(info.map(x=>x.text)), '| caret:', JSON.stringify(info.map(x=>/arrow_drop_down|expand_more/.test(x.parentHTML||''))));
  console.log('"Receive later" on the page:', t.includes('Receive later'));
  await page.screenshot({ path: `${EV}/C44592-split-button.png`, fullPage: true });
  fs.writeFileSync(`${EV}/C44592-split.json`, JSON.stringify({perms:after, info, hasText:t.includes('Receive later')},null,1));
} else console.log('the role change did not take - not judging the split button on this reading');
console.log(await setMyRole(OLD));
console.log('permissions restored:', await perms());
await browser.close();
