// My account is currently on the test role that carries Receive later. Read the Receive control on a
// part that is Awaiting, then PUT MY ROLE BACK to Admin - the restore runs whatever the reading shows.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo, bodyText } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='79476028-70b2-44c7-9e34-0eddc62c15af';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 10000 });
page.setDefaultTimeout(20000);
try {
  await openWo(page, WO); await page.waitForTimeout(4500);
  const t = await bodyText(page);
  const info = await page.evaluate(() => [...document.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width && /^Receive/.test((b.innerText||'').trim()))
    .map(b => ({ text:(b.innerText||'').trim(), parentHTML:(b.parentElement||{}).innerHTML?.slice(0,600) })));
  console.log('Receive controls:', JSON.stringify(info.map(x=>x.text)));
  console.log('a caret beside it:', JSON.stringify(info.map(x=>/arrow_drop_down|expand_more/.test(x.parentHTML||''))));
  console.log('"Receive later" anywhere on the page:', t.includes('Receive later'));
  await page.screenshot({ path: `${EV}/C44592-with-permission.png`, fullPage: true });
  // the part's own menu, in case the choice lives there instead
  const mv = page.locator('button:has-text("more_vert"), .q-btn:has-text("more_vert")');
  const menus = []; const n = await mv.count();
  for (let i=0;i<Math.min(n,8);i++){ try{ await mv.nth(i).click({timeout:6000}); await page.waitForTimeout(1600);
    menus.push(await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.innerText||'').trim()).filter(Boolean)));
    await page.keyboard.press('Escape'); await page.waitForTimeout(700);}catch(e){} }
  console.log('menus:', JSON.stringify(menus));
  fs.writeFileSync(`${EV}/C44592-with-permission.json`, JSON.stringify({info, menus, hasText:t.includes('Receive later')},null,1));
} catch (e) { console.log('reading failed:', e.message.split('\n')[0]); }

// --- restore my role no matter what happened above
console.log('\nrestoring my role to Admin');
await page.goto('https://app.shopview.com/administration/staff?roles=' + encodeURIComponent('ZZAUTOTEST Receive Later'), {waitUntil:'domcontentloaded'});
await page.waitForTimeout(9000);
const row = page.locator('tr', { hasText: 'bilal.muzamil@shopview.com' }).first();
console.log('my row found:', await row.count());
await row.hover(); await page.waitForTimeout(1000);
await row.locator('.q-btn:has-text("edit")').first().click(); await page.waitForTimeout(6000);
const opened = await page.evaluate(() => { const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
  const f=[...d.querySelectorAll('.q-field')].find(x=>/^Role/.test((x.innerText||'').trim())); if(!f) return 'no Role field';
  f.scrollIntoView({block:'center'}); f.click(); return 'role field opened'; });
console.log(opened); await page.waitForTimeout(3000);
const chose = await page.evaluate(()=>{ const it=[...document.querySelectorAll('.q-menu .q-item')].find(e=>(e.innerText||'').trim()==='Admin');
  if(!it) return 'Admin not offered: '+[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.innerText||'').trim()).join(' | ').slice(0,200);
  it.click(); return 'chose Admin'; });
console.log(chose); await page.waitForTimeout(2500);
const saved = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
  const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/Save/.test((x.innerText||'').trim())); if(!b) return 'no save'; b.click(); return 'pressed '+(b.innerText||'').trim(); });
console.log(saved); await page.waitForTimeout(9000);
const j = await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json();
console.log('permissions after restoring:', (j?.data?.fe_permissions||[]).length, '(58 means back on Admin)');
await browser.close();
