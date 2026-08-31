// Learn the REAL invoice-document route by driving the UI and watching the network.
// Guessing endpoints is barred (playbook: "do NOT invent any endpoint/ID not recorded here") and
// all nine guesses returned 404 — so this observes what the app itself calls.
//
// Read-only: navigation and menu-opening only. No commit control is pressed (core §7.5).
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';

const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const EV = `${DIR}/evidence`;
fs.mkdirSync(EV, { recursive: true });
const WO = JSON.parse(fs.readFileSync('/tmp/wo.json','utf8'));

const { browser, page, errs } = await boot('/workorders?tab=complete');
const calls = [];
page.on('request', r => {
  const u = r.url();
  if (/\/api\//.test(u)) calls.push(`${r.method()} ${u.replace(/^https?:\/\/[^/]+/, '')}`);
});
const log = (...a) => console.log(...a);
const text = () => page.evaluate(() => document.body?.innerText || '');

// ---- 1. open the work order by id (the list is a virtual-scroll table with no <a href>) ----
await page.goto(`${APP}/workorders/${WO.id}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
const t1 = await text();
log(`WO ${WO.number} (${WO.status}) -> ${page.url().replace(APP, '')}  ${t1.length} chars`);
await page.screenshot({ path: `${EV}/wo-detail.png` });

// ---- 2. inventory EVERY control label the build offers, verbatim ----
const controls = await page.evaluate(() => {
  const seen = new Set(), out = [];
  for (const el of document.querySelectorAll('button,[role=button],[data-test-id],a,[role=menuitem],.q-item')) {
    const t = (el.innerText || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ');
    const id = el.getAttribute('data-test-id') || '';
    if ((!t && !id) || t.length > 70) continue;
    const k = t + '|' + id;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ t, id });
  }
  return out;
});
fs.writeFileSync(`${DIR}/wo-controls.json`, JSON.stringify(controls, null, 1));
log(`controls: ${controls.length}`);
const doc = controls.filter(c => /invoice|estimate|print|pdf|preview|document|payment|credit|email|download/i.test(c.t + ' ' + c.id));
log('document-related controls:');
doc.slice(0, 25).forEach(c => log(`   ${JSON.stringify(c.t).slice(0, 44).padEnd(46)} testid=${c.id}`));

// ---- 3. open any "more/actions" menu to READ it (never press a commit control) ----
for (const sel of ['[data-test-id*="more"]', '[data-test-id*="action"]', 'button:has-text("More")']) {
  const el = page.locator(sel).first();
  if (await el.count().catch(() => 0)) {
    try {
      await el.click({ timeout: 5000 });
      await page.waitForTimeout(1500);
      const items = await page.evaluate(() => [...document.querySelectorAll('.q-item,[role=menuitem]')]
        .map(e => (e.innerText || '').trim().replace(/\s+/g, ' ')).filter(Boolean).slice(0, 40));
      if (items.length) {
        log(`\nmenu via ${sel}:`);
        items.forEach(i => log('    -', JSON.stringify(i).slice(0, 60)));
        fs.writeFileSync(`${DIR}/wo-menu.json`, JSON.stringify({ sel, items }, null, 1));
        await page.screenshot({ path: `${EV}/wo-menu.png` });
      }
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      break;
    } catch (_) {}
  }
}

// ---- 4. what did the app actually call? that is the real endpoint list ----
const uniq = [...new Set(calls)];
fs.writeFileSync(`${DIR}/observed-api-calls.json`, JSON.stringify(uniq, null, 1));
log(`\nAPI calls the app itself made: ${uniq.length}`);
uniq.filter(c => /invoice|document|print|pdf|order|estimate|payment/i.test(c)).slice(0, 20).forEach(c => log('   ', c));
log('\n-- all observed (first 25) --');
uniq.slice(0, 25).forEach(c => log('   ', c));

if (errs.length) log('\npage errors:', errs.slice(0, 3));
await browser.close();
