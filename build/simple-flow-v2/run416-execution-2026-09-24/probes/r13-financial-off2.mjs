// Turning See Financial Data off raises its own "this will also disable..." dialog before the save.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ROLE='c29fd819-f798-49b5-87f0-92948c859e9a';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 10000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const perms = async () => ((await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json())?.data?.fe_permissions||[]);
await page.goto(`https://app.shopview.com/administration/roles-permissions/${ROLE}/edit`, {waitUntil:'domcontentloaded'});
await page.waitForTimeout(12000);
console.log(await page.evaluate(() => { const card=[...document.querySelectorAll('.cross-toggles__card')].find(c=>/See Financial Data/.test(c.innerText||''));
  const tg=card.querySelector('.q-toggle'); const was=tg.getAttribute('aria-checked'); tg.scrollIntoView({block:'center'}); (tg.querySelector('input')||tg).click(); return 'switch was ' + was; }));
await page.waitForTimeout(3500);
// the "Disable See Financial Data?" dialog
const d1 = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
  if (!d) return null; const buttons=[...d.querySelectorAll('button,.q-btn')].map(b=>(b.innerText||'').trim()).filter(Boolean);
  const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Disable|Yes|Confirm|Continue|OK)$/i.test((x.innerText||'').trim()));
  if (b) { b.click(); return 'buttons ' + JSON.stringify(buttons) + ' -> pressed ' + (b.innerText||'').trim(); }
  return 'buttons ' + JSON.stringify(buttons) + ' -> nothing matched'; });
console.log('disable dialog:', d1);
await page.waitForTimeout(3500);
await page.screenshot({ path: `${EV}/financial-disable-dialog.png` });
console.log(await page.evaluate(()=>{ const b=[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width).find(x=>/^(Save|Create)$/i.test((x.innerText||'').trim()));
  if(!b) return 'no Save'; b.click(); return 'pressed '+(b.innerText||'').trim(); }));
await page.waitForTimeout(5000);
console.log(await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0]; if(!d) return 'no second dialog';
  const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/Anyway|^Save$|^Confirm$|^Yes$/i.test((x.innerText||'').trim()));
  if (b) { b.click(); return 'pressed ' + (b.innerText||'').trim(); } return 'dialog: '+(d.innerText||'').replace(/\s+/g,' ').slice(0,180); }));
await page.waitForTimeout(12000);
const after = await perms();
console.log('permissions:', after.length, '| holds seeFinancialData:', after.includes('seeFinancialData'));
fs.writeFileSync(`${EV}/fe-permissions-nofin.json`, JSON.stringify(after,null,1));
await browser.close();
