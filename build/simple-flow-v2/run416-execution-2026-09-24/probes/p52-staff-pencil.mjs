import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo, bodyText } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='79476028-70b2-44c7-9e34-0eddc62c15af';
const { browser, page, ctx, APIH } = await bootProdLogin('/administration/staff?roles=Admin', { settle: 14000 });
page.setDefaultTimeout(25000);
const perms = async () => { const j = await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json(); return (j?.data?.fe_permissions||[]).length; };
async function openMe() {
  await page.goto('https://app.shopview.com/administration/staff?roles=Admin', {waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
  const row = page.locator('tr', { hasText: 'bilal.muzamil@shopview.com' }).first();
  if (!(await row.count())) return 'no row';
  await row.hover(); await page.waitForTimeout(1200);
  const controls = await row.locator('button, .q-btn').count();
  console.log('controls on my row:', controls);
  for (let i = 0; i < controls; i++) {
    const txt = (await row.locator('button, .q-btn').nth(i).innerText().catch(()=>'')).trim();
    console.log('  control', i, JSON.stringify(txt));
  }
  const pencil = row.locator('button:has-text("edit"), .q-btn:has-text("edit")').first();
  if (await pencil.count()) { await pencil.click(); await page.waitForTimeout(8000); return 'clicked the pencil -> ' + page.url(); }
  return 'no pencil';
}
console.log(await openMe());
await page.screenshot({ path: `${EV}/staff-my-editor.png`, fullPage: true });
const dlg = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
  return d? { text:(d.innerText||'').replace(/\s+/g,' ').slice(0,700), fields:[...d.querySelectorAll('.q-field')].map(f=>(f.innerText||'').split('\n')[0]), buttons:[...d.querySelectorAll('button,.q-btn')].map(b=>(b.innerText||'').trim()).filter(Boolean) } : null; });
console.log('editor dialog:', JSON.stringify(dlg,null,1));
fs.writeFileSync(`${EV}/staff-editor-dialog.json`, JSON.stringify(dlg,null,1));
await browser.close();
