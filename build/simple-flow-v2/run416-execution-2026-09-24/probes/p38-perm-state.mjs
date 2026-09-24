// C44606: read the "Receive later" toggle's state in every role, and check it is a yes/no toggle
// rather than a CRUD row. Then read the purchase orders page for section 6671.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const { browser, page, ctx, APIH } = await bootProdLogin('/administration/roles-permissions', { settle: 14000 });
page.setDefaultTimeout(20000);
// the roles the app itself lists
// read the role ids straight off the roles list page (never guess an endpoint)
await page.waitForTimeout(4000);
let roleList = await page.evaluate(() => {
  const ids = new Set(); const out = [];
  for (const a of document.querySelectorAll('a[href*="roles-permissions/"]')) {
    const m = a.getAttribute('href').match(/roles-permissions\/([0-9a-f-]+)/);
    if (m && !ids.has(m[1])) { ids.add(m[1]); out.push({ id: m[1], name: (a.closest('tr')?.innerText || a.innerText || '').split('\n')[0].trim() }); }
  }
  return out;
});
if (!roleList.length) {
  // no links - walk the rows and read their data attributes
  roleList = await page.evaluate(() => [...document.querySelectorAll('tr')].map(tr => {
    const m = (tr.outerHTML.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/) || [])[1];
    return m ? { id: m, name: (tr.innerText||'').split('\n').filter(Boolean)[0] } : null;
  }).filter(Boolean));
}
console.log('roles:', JSON.stringify(roleList.map(r=>r.name)));
const out = [];
for (const r of roleList.slice(0, 8)) {
  await page.goto(`https://app.shopview.com/administration/roles-permissions/${r.id}/edit`, {waitUntil:'domcontentloaded'});
  await page.waitForTimeout(8000);
  const info = await page.evaluate(() => {
    // find the row whose own label is "Receive later" and read the control next to it
    let row = null;
    for (const el of document.querySelectorAll('*')) {
      if (el.children.length === 0 && (el.textContent||'').trim() === 'Receive later') { row = el.closest('div[class*=row], li, tr') || el.parentElement; break; }
    }
    if (!row) return { found: false };
    const tg = row.querySelector('.q-toggle');
    const cbs = row.querySelectorAll('.q-checkbox');
    return { found: true, kind: tg ? 'toggle' : (cbs.length ? 'checkboxes x'+cbs.length : 'neither'),
      on: tg ? (tg.getAttribute('aria-checked')==='true') : null, rowText: (row.innerText||'').replace(/\s+/g,' ').slice(0,120) };
  });
  console.log(' ', r.name, '->', JSON.stringify(info));
  out.push({ role: r.name, ...info });
}
fs.writeFileSync(`${EV}/C44606-receive-later-by-role.json`, JSON.stringify(out,null,1));
await page.screenshot({ path: `${EV}/C44606-role-editor-wo-section.png`, fullPage: true });
await browser.close();
