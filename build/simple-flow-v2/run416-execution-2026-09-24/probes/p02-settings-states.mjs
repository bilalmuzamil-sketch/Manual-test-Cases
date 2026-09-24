// Read each Work Orders setting's label AND its on/off state two independent ways:
// (a) from the screen (Quasar toggle truthy class + aria-checked), (b) from the org settings the app itself reads.
// Two ways because a single reading that says "all off" is exactly what a broken selector looks like (Rule 104).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const { browser, page, ctx, APIH, version } = await bootProdLogin('/administration/settings', { settle: 16000 });

const tabs = page.locator('[role=tab], .q-tab'); const n = await tabs.count();
for (let i = n - 1; i >= 0; i--) { if ((await tabs.nth(i).innerText()).trim() === 'Work Orders') { await tabs.nth(i).click(); break; } }
await page.waitForTimeout(6000);
await page.screenshot({ path: `${EV}/C44549-settings-work-orders.png` });

const screen = await page.evaluate(() => {
  const out = [];
  for (const tg of document.querySelectorAll('.q-toggle')) {
    const inner = tg.querySelector('.q-toggle__inner');
    const cls = inner ? inner.className.toString() : '';
    // the label sits beside the toggle - walk up to the row that carries both
    let row = tg, label = '', desc = '';
    for (let i = 0; i < 6 && row; i++) {
      const txt = (row.innerText || '').trim();
      if (txt.length > 3) { const L = txt.split('\n').filter(Boolean); label = L[0]; desc = L.slice(1).join(' '); break; }
      row = row.parentElement;
    }
    out.push({ label, desc: desc.slice(0, 160), truthy: /truthy/.test(cls), aria: tg.getAttribute('aria-checked'), innerCls: cls });
  }
  return out;
});
fs.writeFileSync(`${EV}/C44549-toggle-rows.json`, JSON.stringify({ build: version, screen }, null, 1));
console.log('=== SCREEN ==='); for (const r of screen) console.log((r.truthy ? 'ON  ' : 'off ') + '| ' + r.label + ' || aria=' + r.aria);

const api = await ctx.request.get(`https://${APIH}/api/organizations/settings`, { headers: { Accept: 'application/json' }, ignoreHTTPSErrors: true });
const body = api.status() === 200 ? await api.json() : { status: api.status(), text: (await api.text()).slice(0, 300) };
fs.writeFileSync(`${EV}/org-settings-api.json`, JSON.stringify(body, null, 1));
console.log('=== WHAT THE APP ITSELF READS ==='); console.log(JSON.stringify(body?.data || body).slice(0, 2000));
await browser.close();
