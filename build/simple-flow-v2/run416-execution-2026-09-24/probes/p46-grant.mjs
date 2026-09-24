// Grant "Receive later" for real: the editor asks "Similar role already exists" and needs Edit Anyway.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo, bodyText } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ROLE='2a43e6cb-34ab-4475-bd02-242361a725f5';
const WO='79476028-70b2-44c7-9e34-0eddc62c15af';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 9000 });
page.setDefaultTimeout(25000);
const perms = async () => { const j = await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json(); return (j?.data?.fe_permissions||[]); };
const before = await perms(); console.log('permissions before:', before.length);

async function setReceiveLater(on) {
  await page.goto(`https://app.shopview.com/administration/roles-permissions/${ROLE}/edit`, {waitUntil:'domcontentloaded'});
  await page.waitForTimeout(11000);
  const now = await page.evaluate((want) => {
    let label=null; for (const el of document.querySelectorAll('*')) if (el.children.length===0 && (el.textContent||'').trim()==='Receive later') { label=el; break; }
    let row=label.parentElement, tg=null; for (let i=0;i<6&&row;i++){ tg=row.querySelector('.q-toggle'); if(tg)break; row=row.parentElement; }
    const isOn = tg.getAttribute('aria-checked')==='true';
    if (isOn === want) return 'already ' + (want?'on':'off');
    tg.scrollIntoView({block:'center'}); (tg.querySelector('input')||tg).click(); return 'flipped';
  }, on);
  console.log('toggle:', now);
  if (now.startsWith('already')) return;
  await page.waitForTimeout(1500);
  await page.locator('.q-btn:has-text("Save")').last().click({timeout:15000});
  await page.waitForTimeout(4000);
  const anyway = page.locator('button:has-text("Edit Anyway"), .q-btn:has-text("Edit Anyway")').first();
  if (await anyway.count()) { console.log('pressing Edit Anyway'); await anyway.click(); await page.waitForTimeout(9000); }
  else { console.log('no Edit Anyway dialog'); await page.waitForTimeout(6000); }
  await page.screenshot({ path: `${EV}/C44606-grant-${on?'on':'off'}.png` });
}
await setReceiveLater(true);
const mid = await perms();
console.log('permissions after the grant:', mid.length, '| added:', mid.length - before.length);
if (mid.length === before.length) { console.log('STILL NOT GRANTED - stopping rather than judging on a broken setup'); }
else {
  await openWo(page, WO); await page.waitForTimeout(4500);
  const t = await bodyText(page);
  const info = await page.evaluate(() => [...document.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width && /^Receive/.test((b.innerText||'').trim()))
    .map(b => ({ text:(b.innerText||'').trim(), siblings: b.parentElement ? [...b.parentElement.querySelectorAll('button,.q-btn')].map(x=>(x.innerText||'').trim()) : [], parentHTML: (b.parentElement||{}).innerHTML?.slice(0,400) })));
  console.log('Receive controls:', JSON.stringify(info.map(x=>({t:x.text, sib:x.siblings}))));
  console.log('caret beside Receive:', JSON.stringify(info.map(x=>/arrow_drop_down|expand_more/.test(x.parentHTML||''))));
  console.log('"Receive later" text on the page:', t.includes('Receive later'));
  await page.screenshot({ path: `${EV}/C44592-split-button.png`, fullPage: true });
  // click any caret and read what it offers
  const caret = page.locator('button:has-text("arrow_drop_down"), .q-btn:has-text("arrow_drop_down"), button:has-text("expand_more")').last();
  if (await caret.count()) { await caret.click().catch(()=>{}); await page.waitForTimeout(2200);
    const items = await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.innerText||'').trim()).filter(Boolean));
    console.log('the caret offers:', JSON.stringify(items));
    await page.screenshot({ path: `${EV}/C44592-caret-menu.png` }); }
  fs.writeFileSync(`${EV}/C44592-split.json`, JSON.stringify({ info, hasText: t.includes('Receive later') }, null, 1));
}
await setReceiveLater(false);
console.log('permissions restored to:', (await perms()).length);
await browser.close();
