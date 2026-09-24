// Put myself in the new role (Admin template + Receive later), prove the permission arrived, then
// read the Receive control on a part that is Awaiting. Restore my role afterwards.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo, bodyText } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const NEW='ZZAUTOTEST Receive Later', OLD='Admin';
const WO='79476028-70b2-44c7-9e34-0eddc62c15af';
const { browser, page, ctx, APIH } = await bootProdLogin('/administration/staff', { settle: 14000 });
page.setDefaultTimeout(25000);
const perms = async () => { const j = await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json(); return (j?.data?.fe_permissions||[]).length; };
console.log('permissions now:', await perms());
const t0 = await page.evaluate(()=>document.body.innerText);
fs.writeFileSync(`${EV}/staff-page.txt`, t0);
console.log('staff page:', page.url(), '| Bilal on it:', t0.includes('Bilal'));

async function setMyRole(roleName) {
  await page.goto('https://app.shopview.com/administration/staff', {waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
  const row = page.locator('tr', { hasText: 'bilal.muzamil@shopview.com' }).first();
  if (!(await row.count())) { console.log('my staff row not found'); return false; }
  await row.scrollIntoViewIfNeeded().catch(()=>{}); await row.click(); await page.waitForTimeout(7000);
  console.log('staff editor URL:', page.url());
  await page.screenshot({ path: `${EV}/staff-editor.png`, fullPage: true });
  // find the role picker and choose the role
  const sel = page.locator('.q-field:has-text("Role") ').first();
  if (await sel.count()) { await sel.click(); await page.waitForTimeout(2500);
    const opt = page.locator('.q-menu .q-item', { hasText: roleName }).first();
    if (await opt.count()) { await opt.click(); await page.waitForTimeout(2000); console.log('chose', roleName); }
    else { console.log('role not offered:', roleName, await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.innerText||'').trim()).join(' | '))); } }
  const btns = await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width).map(x=>(x.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean));
  console.log('buttons:', JSON.stringify(btns.slice(-6)));
  const ok = await page.evaluate(()=>{ const b=[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width).find(x=>/^(Save|Update|Save Changes)$/i.test((x.innerText||'').trim()));
    if(!b) return 'no save'; b.click(); return 'pressed '+(b.innerText||'').trim(); });
  console.log('save:', ok); await page.waitForTimeout(9000);
  return true;
}
await setMyRole(NEW);
console.log('permissions after the role change:', await perms());
await openWo(page, WO); await page.waitForTimeout(4500);
const t = await bodyText(page);
const info = await page.evaluate(() => [...document.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width && /^Receive/.test((b.innerText||'').trim()))
  .map(b => ({ text:(b.innerText||'').trim(), parentHTML:(b.parentElement||{}).innerHTML?.slice(0,400), siblings: b.parentElement? [...b.parentElement.querySelectorAll('button,.q-btn')].map(x=>(x.innerText||'').trim()):[] })));
console.log('Receive controls:', JSON.stringify(info.map(x=>({t:x.text, sib:x.siblings}))));
console.log('a caret beside Receive:', JSON.stringify(info.map(x=>/arrow_drop_down|expand_more/.test(x.parentHTML||''))));
console.log('"Receive later" on the page:', t.includes('Receive later'));
await page.screenshot({ path: `${EV}/C44592-split-button.png`, fullPage: true });
fs.writeFileSync(`${EV}/C44592-split.json`, JSON.stringify({ info, hasText: t.includes('Receive later') }, null, 1));
// put my role back
await setMyRole(OLD);
console.log('permissions restored:', await perms());
await browser.close();
