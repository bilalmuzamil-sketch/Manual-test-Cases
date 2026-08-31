// The paid work order exposes tabs (link_finance_tab …) and a real nav-bar menu
// (button_work_order_nav_bar_menu). Open both and READ them — that is where an invoice
// document action would live. Read-only: menus are opened to be read, nothing is committed
// (core §7.5 — establish whether a confirmation exists before pressing anything).
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';

const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const EV = `${DIR}/evidence`;
fs.mkdirSync(EV, { recursive: true });
const WO = JSON.parse(fs.readFileSync('/tmp/wo.json', 'utf8'));
const out = { wo: WO, read_at: new Date().toISOString() };

const { browser, page } = await boot('/workorders?tab=complete');
const calls = [];
page.on('request', r => { const u = r.url(); if (/\/api\//.test(u)) calls.push(`${r.method()} ${u.replace(/^https?:\/\/[^/]+/, '')}`); });
const log = (...a) => console.log(...a);

await page.goto(`${APP}/workorders/${WO.id}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 });
// wait for the control to EXIST rather than guessing a duration (the 2026-08-28 lesson:
// a fixed wait mis-reports about half of these as absent)
await page.waitForSelector('[data-test-id="link_finance_tab"], [data-test-id="button_work_order_nav_bar_menu"]',
                           { timeout: 30000 }).catch(() => {});
await page.waitForTimeout(2500);
log('landed:', page.url());

// ---- 1. the nav-bar menu: open, read every item, escape ----
const menuBtn = page.locator('[data-test-id="button_work_order_nav_bar_menu"]').first();
if (await menuBtn.count()) {
  await menuBtn.click({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1800);
  const items = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item, [role=menuitem]')]
    .map(e => ({ text: (e.innerText || '').trim().replace(/\s+/g, ' '), testid: e.getAttribute('data-test-id') || '' }))
    .filter(x => x.text));
  out.nav_menu = items;
  log(`nav-bar menu items: ${items.length}`);
  items.forEach(i => log(`   ${JSON.stringify(i.text).slice(0, 50).padEnd(52)} testid=${i.testid}`));
  await page.screenshot({ path: `${EV}/wo-navbar-menu.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);
} else { log('nav-bar menu button not present'); }

// ---- 2. the finance tab ----
const fin = page.locator('[data-test-id="link_finance_tab"]').first();
if (await fin.count()) {
  await fin.click({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(4000);
  const t = await page.evaluate(() => document.body?.innerText || '');
  out.finance_tab = { url: page.url(), chars: t.length };
  log(`\nfinance tab -> ${page.url().replace(APP, '')} (${t.length} chars)`);
  const ctl = await page.evaluate(() => {
    const seen = new Set(), o = [];
    for (const el of document.querySelectorAll('button,[role=button],[data-test-id],a,.q-item,[role=menuitem],[role=tab]')) {
      const tx = (el.innerText || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ');
      const id = el.getAttribute('data-test-id') || '';
      if ((!tx && !id) || tx.length > 70) continue;
      const k = tx + '|' + id;
      if (seen.has(k)) continue;
      seen.add(k); o.push({ t: tx, id });
    }
    return o;
  });
  out.finance_controls = ctl;
  const rx = /invoice|estimate|print|pdf|preview|document|credit|email|download|generate|send|receipt/i;
  const hits = ctl.filter(c => rx.test(c.t + ' ' + c.id));
  log(`finance-tab controls: ${ctl.length} | document-related: ${hits.length}`);
  hits.slice(0, 30).forEach(c => log(`   ${JSON.stringify(c.t).slice(0, 46).padEnd(48)} testid=${c.id}`));
  await page.screenshot({ path: `${EV}/wo-finance-tab.png`, fullPage: true });
  log('\nfinance-tab text (first 700 chars):');
  log(JSON.stringify(t.slice(0, 700)));
} else { log('finance tab link not present'); }

out.api_calls = [...new Set(calls)].filter(c => /invoice|document|print|pdf|finance|payment|estimate/i.test(c));
log('\ndocument/finance API calls observed:');
out.api_calls.forEach(c => log('   ', c));
fs.writeFileSync(`${DIR}/finance-and-menu.json`, JSON.stringify(out, null, 1));
await browser.close();
