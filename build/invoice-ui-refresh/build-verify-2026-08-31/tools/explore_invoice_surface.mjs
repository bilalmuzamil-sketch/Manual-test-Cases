// Find how THIS build reaches the invoice document. Exploration, read-only, no clicks on
// anything destructive (core §7.5 — a probe may open a dialog to read it, never press a commit
// control to discover what happens).
//
// Writes everything to files; prints a bounded summary. The output is the target list the
// per-case walk needs: which routes exist, which document types are reachable, what the
// on-screen labels actually are.
import { boot, APP, apiGet } from './boot8218.mjs';
import fs from 'fs';

const EV = 'build/invoice-ui-refresh/build-verify-2026-08-31/evidence';
fs.mkdirSync(EV, { recursive: true });
const out = { read_at: new Date().toISOString(), routes: {}, workorder: null, actions: [], notes: [] };

const { browser, page, errs } = await boot('/workorders?tab=complete');
const log = (...a) => console.log(...a);

async function snap(name) {
  await page.screenshot({ path: `${EV}/${name}.png` }).catch(() => {});
}
async function textOf() { return await page.evaluate(() => document.body?.innerText || ''); }

log('landed:', page.url());
out.routes['/workorders?tab=complete'] = { url: page.url(), chars: (await textOf()).length };

// ---- 1. find a work order row and its id, from the DOM (never by a displayed string alone) ----
const rows = await page.evaluate(() => {
  const as = [...document.querySelectorAll('a[href*="/workorders/"]')];
  return as.slice(0, 12).map(a => ({ href: a.getAttribute('href'), text: (a.innerText || '').trim().slice(0, 40) }));
});
out.workorder_links = rows;
log(`work-order links found: ${rows.length}`);
rows.slice(0, 5).forEach(r => log('   ', r.href, '|', JSON.stringify(r.text)));

// ---- 2. open one and inventory what actions the build offers ----
if (rows.length) {
  const href = rows[0].href;
  await page.goto(APP + href, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  const txt = await textOf();
  out.workorder = { href, url: page.url(), chars: txt.length };
  log(`\nopened ${href} -> ${page.url()} (${txt.length} chars)`);
  await snap('workorder-detail');

  // every button / menu item label the build offers, verbatim
  const controls = await page.evaluate(() => {
    const sel = 'button, [role=button], a[href], [data-test-id], .q-item, [role=menuitem]';
    const seen = new Set(); const out = [];
    for (const el of document.querySelectorAll(sel)) {
      const t = (el.innerText || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ');
      const id = el.getAttribute('data-test-id') || '';
      if (!t && !id) continue;
      const k = t + '|' + id;
      if (seen.has(k) || t.length > 60) continue;
      seen.add(k);
      out.push({ text: t, testid: id, tag: el.tagName.toLowerCase() });
    }
    return out;
  });
  out.actions = controls;
  log(`controls on the work-order page: ${controls.length}`);
  const interesting = controls.filter(c => /invoice|estimate|print|pdf|preview|document|payment|credit|email|download|more|action/i.test(c.text + ' ' + c.testid));
  log('\nthose that look document-related:');
  interesting.slice(0, 30).forEach(c => log(`    ${JSON.stringify(c.text).slice(0, 46).padEnd(48)} testid=${c.testid}`));
  out.document_related = interesting;
}

// ---- 3. probe likely document routes WITHOUT clicking anything that commits ----
for (const r of ['/invoices', '/estimates', '/invoicing', '/documents']) {
  try {
    await page.goto(APP + r, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);
    const t = await textOf();
    const isLogin = /\/login/.test(page.url());
    out.routes[r] = { url: page.url(), chars: t.length, login_bounce: isLogin,
                      head: t.slice(0, 120).replace(/\n/g, ' | ') };
    log(`route ${r.padEnd(12)} -> ${page.url().replace(APP, '')} ${t.length} chars${isLogin ? '  [LOGIN BOUNCE]' : ''}`);
  } catch (e) {
    out.routes[r] = { error: String(e).slice(0, 120) };
    log(`route ${r.padEnd(12)} -> ERROR ${String(e).slice(0, 80)}`);
  }
}

// ---- 4. what the API says exists, as a cross-check on the UI ----
for (const ep of ['/api/invoices', '/api/work-orders?limit=1', '/api/settings/invoice']) {
  const r = await apiGet(ep);
  out.notes.push({ endpoint: ep, status: r.status });
  log(`api ${ep.padEnd(28)} -> HTTP ${r.status}`);
}

if (errs.length) { out.page_errors = errs.slice(0, 5); log('\npage errors:', errs.slice(0, 3)); }
fs.writeFileSync(`${EV}/../explore-invoice-surface.json`, JSON.stringify(out, null, 1));
log('\nwrote explore-invoice-surface.json + screenshots');
await browser.close();
