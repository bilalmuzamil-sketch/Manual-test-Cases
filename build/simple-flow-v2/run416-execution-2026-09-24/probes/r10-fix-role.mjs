// Find the real "See financial data" switch in the limited role and turn it off, then prove the
// seeFinancialData permission has actually gone before judging anything with it.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const { browser, page, ctx, APIH } = await bootProdLogin('/administration/roles-permissions', { settle: 13000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const perms = async () => ((await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json())?.data?.fe_permissions||[]);
console.log('I hold', (await perms()).length, 'permissions');
// open the limited role's editor
const t = await page.evaluate(()=>document.body.innerText);
const rowId = await page.evaluate(()=>{ for (const tr of document.querySelectorAll('tr')) if (/ZZAUTOTEST No Parts Perms/.test(tr.innerText||'')) {
  const m=(tr.outerHTML.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/)||[])[1]; if (m) return m;
  const a=[...tr.querySelectorAll('a[href]')].map(x=>x.getAttribute('href')).find(h=>/roles-permissions\//.test(h)); if (a) return (a.match(/roles-permissions\/([0-9a-f-]+)/)||[])[1]; }
  return null; });
console.log('limited role id:', rowId);
if (!rowId) { console.log('could not find the role row'); await browser.close(); process.exit(0); }
await page.goto(`https://app.shopview.com/administration/roles-permissions/${rowId}/edit`, {waitUntil:'domcontentloaded'});
await page.waitForTimeout(12000);
// list every switch with the label that owns it, so the right one is picked
const switches = await page.evaluate(() => {
  const out = [];
  for (const tg of document.querySelectorAll('.q-toggle')) {
    let row = tg.parentElement, label = '';
    for (let i = 0; i < 8 && row; i++) {
      const txt = (row.innerText || '').trim();
      if (txt && txt.length < 90 && txt.split('\n').length <= 3) { label = txt.split('\n')[0]; break; }
      row = row.parentElement;
    }
    out.push({ label, on: tg.getAttribute('aria-checked') === 'true' });
  }
  return out;
});
fs.writeFileSync(`${EV}/role-switches.json`, JSON.stringify(switches,null,1));
console.log('\nswitches in this role:'); switches.forEach((s,i)=>console.log(' ', i, s.on?'ON ':'off', s.label.slice(0,50)));
// turn off the one whose label mentions financial
const idx = switches.findIndex(s => /financial/i.test(s.label));
console.log('\nfinancial switch at index:', idx, idx>=0? JSON.stringify(switches[idx]) : '');
if (idx >= 0 && switches[idx].on) {
  await page.evaluate((i)=>{ const tg=document.querySelectorAll('.q-toggle')[i]; tg.scrollIntoView({block:'center'}); (tg.querySelector('input')||tg).click(); }, idx);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${EV}/role-financial-off.png` });
  const saved = await page.evaluate(()=>{ const b=[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width).find(x=>/^(Save|Create)$/i.test((x.innerText||'').trim()));
    if(!b) return 'no Save'; b.click(); return 'pressed '+(b.innerText||'').trim(); });
  console.log(saved); await page.waitForTimeout(5000);
  const anyway = await page.evaluate(()=>{ const d=document.querySelector('.q-dialog'); if(!d) return 'no dialog';
    const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/Anyway/i.test((x.innerText||'').trim())); if(b){b.click(); return 'pressed Edit Anyway';} return 'dialog: '+(d.innerText||'').replace(/\s+/g,' ').slice(0,150); });
  console.log(anyway); await page.waitForTimeout(10000);
}
const after = await perms();
console.log('\npermissions now:', after.length, '| seeFinancialData still held:', after.includes('seeFinancialData'));
fs.writeFileSync(`${EV}/fe-permissions-limited2.json`, JSON.stringify(after,null,1));
await browser.close();
