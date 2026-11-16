// STEP 1 (read-only): capture every Settings page that can change a WO's life or its invoice, at the test location. SECRET-FREE.
// Records each control's on-screen label + value (toggle aria-checked, field value), plus a full-page screenshot and text dump.
import fs from 'fs';
import { start, call, zones, APP, OUT, LOC } from './common.mjs';
const EV = OUT + '/evidence/settings'; fs.mkdirSync(EV, { recursive: true });
const RAW = '/tmp/cln/rgwo/settings-raw'; fs.mkdirSync(RAW, { recursive: true });
const { browser, page } = await start({ workplaceId: LOC.id, timezone: LOC.tz });
const z0 = await zones(page, LOC.tz);
async function extract() {
  return page.evaluate(() => {
    const vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const lab = el => (el.innerText || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
    const out = [];
    document.querySelectorAll('.q-toggle, .q-checkbox, .q-radio').forEach(el => { if (!vis(el)) return; out.push({ kind: el.classList.contains('q-toggle') ? 'toggle' : el.classList.contains('q-radio') ? 'radio' : 'checkbox', label: lab(el), value: el.getAttribute('aria-checked'), testid: el.getAttribute('data-test-id') || el.closest('[data-test-id]')?.getAttribute('data-test-id') || null }); });
    document.querySelectorAll('.q-field').forEach(el => { if (!vis(el)) return; const l = el.querySelector('.q-field__label')?.innerText?.trim() || el.closest('[data-test-id]')?.getAttribute('data-test-id') || ''; const inp = el.querySelector('input, textarea'); const sel = el.querySelector('.q-field__native span, .q-field__native')?.innerText?.trim(); out.push({ kind: el.classList.contains('q-select') ? 'select' : 'field', label: l, value: (inp && inp.value) || sel || '', testid: el.querySelector('[data-test-id]')?.getAttribute('data-test-id') || null }); });
    return out;
  });
}
async function snap(name, route, tabs = []) {
  await page.goto(APP + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);
  const res = [];
  const one = async (tabName) => {
    const fn = `${name}${tabName ? '-' + tabName.replace(/\W+/g, '_') : ''}`;
    await page.screenshot({ path: `${EV}/${fn}.png`, fullPage: true });
    const text = await page.locator('main').first().innerText().catch(() => page.locator('body').innerText());
    fs.writeFileSync(`${RAW}/${fn}.txt`, text);
    res.push({ page: name, route, tab: tabName || null, url: page.url(), at_utc: new Date().toISOString(), controls: await extract(), screenshot: `evidence/settings/${fn}.png` });
  };
  if (!tabs.length) await one(null);
  for (const t of tabs) {
    const tab = page.locator('.q-tab, [role=tab]').filter({ hasText: new RegExp('^\\s*' + t + '\\s*$') }).first();
    if (await tab.count()) { await tab.scrollIntoViewIfNeeded(); await tab.click({ force: true }); await page.waitForTimeout(3000); await one(t); }
    else res.push({ page: name, tab: t, missing: true });
  }
  return res;
}
const all = [];
all.push(...await snap('01-settings', '/administration/settings', ['Organization', 'Invoice', 'Work Orders']));
for (const [n, r] of [['02-locations', '/administration/locations'], ['03-taxes', '/administration/taxes'], ['04-labor-rates', '/administration/labour-types'], ['05-canned-lines', '/administration/canned-lines'], ['06-fees-discounts', '/administration/adjustment-templates'], ['07-pricing', '/administration/pricing'], ['08-bin-locations', '/administration/bins'], ['09-categories', '/administration/categories'], ['10-payment-methods', '/administration/payment-methods']]) all.push(...await snap(n, r));
// API read-backs of the same settings (reading only)
const api = {};
for (const p of ['/api/organizations/settings', '/api/workplaces', '/api/taxes', '/api/labour-types', '/api/pricing-rules/list?limit=200&page=1', '/api/organization/feature-flags?organization_id=d55bc308-e61a-438d-b5f1-c7a73c89d49f', '/api/payment-methods', '/api/adjustment-templates']) { const r = await call(page, 'GET', p); api[p] = { s: r.s, j: r.j }; }
fs.writeFileSync(`${RAW}/api.json`, JSON.stringify(api, null, 1));
const z1 = await zones(page, LOC.tz);
fs.writeFileSync(`${RAW}/capture.json`, JSON.stringify({ zones_start: z0, zones_end: z1, pages: all }, null, 1));
for (const p of all) console.log(p.page, p.tab, p.missing ? 'MISSING' : p.controls.length + ' controls');
await browser.close();
