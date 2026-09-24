// "See Financial Data" is a toggle inside a .cross-toggles__card. Turn it off on the limited role and
// prove seeFinancialData actually leaves my permission list.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ROLE='c29fd819-f798-49b5-87f0-92948c859e9a';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 10000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const perms = async () => ((await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json())?.data?.fe_permissions||[]);
console.log('before:', (await perms()).length, '| holds seeFinancialData:', (await perms()).includes('seeFinancialData'));
await page.goto(`https://app.shopview.com/administration/roles-permissions/${ROLE}/edit`, {waitUntil:'domcontentloaded'});
await page.waitForTimeout(12000);
const r = await page.evaluate(() => {
  const card = [...document.querySelectorAll('.cross-toggles__card')].find(c => /See Financial Data/.test(c.innerText||''));
  if (!card) return 'no See Financial Data card';
  const tg = card.querySelector('.q-toggle'); if (!tg) return 'card has no switch';
  const was = tg.getAttribute('aria-checked');
  tg.scrollIntoView({ block: 'center' }); (tg.querySelector('input') || tg).click();
  return 'switch was ' + was;
});
console.log(r);
await page.waitForTimeout(2500);
await page.screenshot({ path: `${EV}/financial-toggled.png` });
const saved = await page.evaluate(()=>{ const b=[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width).find(x=>/^(Save|Create)$/i.test((x.innerText||'').trim()));
  if(!b) return 'no Save'; b.click(); return 'pressed '+(b.innerText||'').trim(); });
console.log(saved); await page.waitForTimeout(5000);
const anyway = await page.evaluate(()=>{ const d=document.querySelector('.q-dialog'); if(!d) return 'no dialog';
  const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/Anyway/i.test((x.innerText||'').trim())); if(b){b.click(); return 'pressed Edit Anyway';} return 'dialog: '+(d.innerText||'').replace(/\s+/g,' ').slice(0,150); });
console.log(anyway); await page.waitForTimeout(11000);
const after = await perms();
console.log('after:', after.length, '| holds seeFinancialData:', after.includes('seeFinancialData'));
fs.writeFileSync(`${EV}/fe-permissions-nofin.json`, JSON.stringify(after,null,1));
await browser.close();
