// Same test, but PROVE the permission actually landed before reading the screen (Rule 104):
// read the account's own permission list before and after, and only then judge the split button.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo, bodyText } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ROLE='2a43e6cb-34ab-4475-bd02-242361a725f5';
const WO='79476028-70b2-44c7-9e34-0eddc62c15af';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 10000 });
page.setDefaultTimeout(25000);
const perms = async () => { const r = await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`, {headers:{Accept:'application/json'},ignoreHTTPSErrors:true}); const j = await r.json(); return (j?.data?.fe_permissions||[]); };
const before = await perms();
fs.writeFileSync(`${EV}/fe-permissions-before.json`, JSON.stringify(before,null,1));
console.log('permissions I hold:', before.length);
console.log('anything mentioning receive/later:', JSON.stringify(before.filter(p=>/receiv|later/i.test(JSON.stringify(p)))));

await page.goto(`https://app.shopview.com/administration/roles-permissions/${ROLE}/edit`, {waitUntil:'domcontentloaded'});
await page.waitForTimeout(11000);
const state = await page.evaluate(() => {
  let label=null; for (const el of document.querySelectorAll('*')) if (el.children.length===0 && (el.textContent||'').trim()==='Receive later') { label=el; break; }
  if (!label) return {err:'label not found'};
  let row = label.parentElement, tg = null;
  for (let i=0;i<6 && row;i++){ tg = row.querySelector('.q-toggle'); if (tg) break; row = row.parentElement; }
  if (!tg) return {err:'no toggle near the label'};
  return { before: tg.getAttribute('aria-checked'), rowText:(row.innerText||'').replace(/\s+/g,' ').slice(0,120) };
});
console.log('role editor:', JSON.stringify(state));
if (!state.err) {
  await page.evaluate(() => { let label=null; for (const el of document.querySelectorAll('*')) if (el.children.length===0 && (el.textContent||'').trim()==='Receive later') { label=el; break; }
    let row=label.parentElement, tg=null; for (let i=0;i<6&&row;i++){ tg=row.querySelector('.q-toggle'); if(tg)break; row=row.parentElement; }
    tg.scrollIntoView({block:'center'}); (tg.querySelector('input')||tg).click(); });
  await page.waitForTimeout(2000);
  const after = await page.evaluate(() => { let label=null; for (const el of document.querySelectorAll('*')) if (el.children.length===0 && (el.textContent||'').trim()==='Receive later') { label=el; break; }
    let row=label.parentElement, tg=null; for (let i=0;i<6&&row;i++){ tg=row.querySelector('.q-toggle'); if(tg)break; row=row.parentElement; }
    return tg.getAttribute('aria-checked'); });
  console.log('toggle now reads:', after);
  await page.screenshot({ path: `${EV}/C44606-toggle-on.png` });
  const save = page.locator('.q-btn:has-text("Save"), button:has-text("Save")').last();
  console.log('Save buttons:', await page.locator('.q-btn:has-text("Save"), button:has-text("Save")').count());
  await save.click({timeout:15000}).catch(e=>console.log('save click:',e.message.split('\n')[0]));
  await page.waitForTimeout(9000);
  await page.screenshot({ path: `${EV}/C44606-after-save.png` });
  console.log('URL after save:', page.url());
}
const mid = await perms();
console.log('permissions after the grant:', mid.length, '| changed:', JSON.stringify(mid)!==JSON.stringify(before));
fs.writeFileSync(`${EV}/fe-permissions-after.json`, JSON.stringify(mid,null,1));
const added = mid.filter(p=>!before.some(b=>JSON.stringify(b)===JSON.stringify(p)));
console.log('what was added:', JSON.stringify(added));
if (!added.length) { console.log('THE GRANT DID NOT LAND - not judging the split button on this reading'); }
else {
  await openWo(page, WO); await page.waitForTimeout(4000);
  const t = await bodyText(page);
  const info = await page.evaluate(() => [...document.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width && /^Receive/.test((b.innerText||'').trim()))
    .map(b => ({ text:(b.innerText||'').trim(), parentHTML:(b.parentElement||{}).innerHTML?.slice(0,300) })));
  console.log('Receive controls with the permission:', JSON.stringify(info.map(x=>x.text)));
  console.log('caret markers next to it:', JSON.stringify(info.map(x=>/arrow_drop_down|expand_more/.test(x.parentHTML||''))));
  console.log('"Receive later" on the page:', t.includes('Receive later'));
  await page.screenshot({ path: `${EV}/C44592-with-permission.png`, fullPage: true });
  fs.writeFileSync(`${EV}/C44592-with-permission.json`, JSON.stringify({ added, info, hasWords: t.includes('Receive later') }, null, 1));
}
await browser.close();
