// AFTER the upgrade (staging, 12 Nov 2026): the screen checks for the aging-report tests. Each part writes its own
// NOTES.txt with UTC time and the build marker. Filters are set through the page address (customerIds / asOfDate, read
// from the upgrade's own code) and the chip text is read back to prove they took.
const { open, APP, stamp, dir, rows } = require('./stg');
const fs = require('fs');
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (k) => !ONLY.length || ONLY.includes(k);
const clean = (s) => (s || '').replace(/\s+/g, ' ').replace(/calendar_today|keyboard_arrow_down|person|local_shipping|hourglass_empty|place|cancel/g, '').replace(/\s+/g, ' ').trim();
async function marker(page) { return (await page.request.get(APP + '/').then((r) => r.text())).match(/app-version" content="([^"]+)/)?.[1]; }
async function chips(page) { return page.evaluate(() => [...document.querySelectorAll('[data-test-id^="filter_chip_"]:not([data-test-id^="filter_chip_clear"])')].map((e) => e.innerText.replace(/\s+/g, ' ').trim())); }
async function go(page, url, wait = 9000) { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); await page.waitForTimeout(wait); }
(async () => {
  const { browser, ctx, page } = await open();
  // 1: the six reports untouched, as of 12 Nov 2026 (today: the default)
  if (want('1')) {
    const O = dir('1-six-reports'); const N = [`Started ${stamp()} · build ${await marker(page)}`];
    for (const [slug, name] of [['ar-aging-summary', 'AR Aging Summary'], ['ar-aging-detail', 'AR Aging Detail'], ['ar-aging-collection', 'AR Aging Collection'], ['ap-aging-summary', 'AP Aging Summary'], ['ap-aging-detail', 'AP Aging Detail'], ['ap-unpaid-invoices', 'AP Unpaid Invoices']]) {
      await go(page, APP + '/reports/' + slug);
      const c = await chips(page); const r = await rows(page);
      fs.writeFileSync(`${O}/${name} - rows.txt`, r.join('\n') + '\n');
      await page.screenshot({ path: `${O}/${name} - full page.png`, fullPage: true });
      let ex = '';
      if (/Detail/.test(name)) { const t = page.locator('[data-test-id$="_toggle_all"]').first(); if (await t.count()) { await t.click(); await page.waitForTimeout(6000); const er = await rows(page); fs.writeFileSync(`${O}/${name} - expand all - rows in view.txt`, er.join('\n') + '\n'); await page.screenshot({ path: `${O}/${name} - expand all.png` }); ex = ` · Expand all: ${er.length} rows in view`; } }
      N.push(`${name} (${stamp()}): chips ${c.join(' | ')} · ${r.length} table rows in view${ex}`);
    }
    fs.writeFileSync(`${O}/NOTES.txt`, N.join('\n') + '\n'); console.log(N.join('\n'));
  }
  // 2: the seeded credits, each as of its own date, with its customer / vendor ticked
  if (want('2')) {
    const O = dir('2-credit-memo'); const N = [`Started ${stamp()} · build ${await marker(page)}`];
    for (const [label, slug, q, num, file] of [
      ['CM2-4541 (A/R, dated 12 Nov)', 'ar-aging-detail', 'asOfDate=2026-11-12&customerIds=0fadcac2-658b-4fed-a15a-03f8cfb54b09', 'CM2-4541', 'AR Aging Detail as of 2026-11-12 - customer ticked'],
      ['C-13911 (A/P, dated 12 Nov)', 'ap-aging-detail', 'asOfDate=2026-11-12&vendorIds=20cb96c2-408f-48e9-bd23-3e7c7b1bca28', 'C-13911', 'AP Aging Detail as of 2026-11-12 - vendor ticked']]) {
      await go(page, `${APP}/reports/${slug}?${q}`);
      const c = await chips(page);
      const t = page.locator('[data-test-id$="_toggle_all"]').first(); if (await t.count()) { await t.click(); await page.waitForTimeout(5000); }
      const r = await rows(page); fs.writeFileSync(`${O}/${file} - rows.txt`, r.join('\n') + '\n');
      let bucket = null, hit = null; for (const x of r) { if (/^(arrow_drop_\w+\s*)?(Current|\d+-\d+ days past due|91 or more days past due) \(/.test(x.split(' | ')[0].trim())) bucket = x.split(' | ')[0].replace(/arrow_drop_\w+\s*|expand_\w+\s*|chevron_\w+\s*/g, '').trim(); if (x.includes(num)) { hit = x; break; } }
      const row = page.locator('tr', { hasText: num }).first();
      if (await row.count()) { await row.evaluate((el) => { el.style.outline = '3px solid #e11'; }); }
      await page.screenshot({ path: `${O}/${file} - ${num} row.png`, fullPage: true });
      N.push(`${label} (${stamp()}): chips ${c.join(' | ')}\n  bucket: ${bucket}\n  row: ${hit}`);
    }
    N.push('CM2-4540 (dated 14 Nov) cannot be checked before 14 Nov 2026: the date picker offers no later day.');
    fs.writeFileSync(`${O}/NOTES.txt`, N.join('\n') + '\n'); console.log(N.join('\n'));
  }
  // 6 / C715582: the two drill-down addresses saved before the upgrade, pasted as they are
  if (want('6')) {
    const O = dir('6-drill-down-links'); const N = [`Started ${stamp()} · build ${await marker(page)}`];
    for (const [name, url] of [['A/R Collection, Mobile Truck & Trailer Repair Island Lake', '/reports/ar-aging-collection?customerName=Mobile+Truck+%26+Trailer+Repair+Island+Lake&customerId=023402eb-206e-4a9b-8260-b42cdb330a9a'],
      ['A/P Unpaid Invoices, 123 Cannabis Forestlawn', '/reports/ap-unpaid-invoices?vendorName=123+Cannabis+Forestlawn&vendorId=68c72fe7-8fbe-4795-85aa-7e91fbb54c7e']]) {
      await go(page, APP + '/dashboard', 5000);
      await go(page, APP + url);
      const c = await chips(page);
      const groups = await page.evaluate(() => [...document.querySelectorAll('[data-test-id$="_cell_customer_name"], [data-test-id$="_cell_vendor_name"]')].filter((e) => /_report_row_[0-9a-f-]{36}_cell/.test(e.getAttribute('data-test-id'))).map((e) => e.innerText.trim()));
      const err = await page.evaluate(() => [...document.querySelectorAll('.q-notification, [role=alert]')].map((e) => e.innerText.replace(/\s+/g, ' ').trim()).join(' / '));
      await page.screenshot({ path: `${O}/${name.replace(/[&,]/g, '')}.png` });
      N.push(`${name} (${stamp()}): opened ${page.url()}\n  chips: ${c.join(' | ')}\n  groups listed (${groups.length}): ${groups.join(' ; ')}\n  messages: ${err || 'none'}`);
    }
    fs.writeFileSync(`${O}/NOTES.txt`, N.join('\n') + '\n'); console.log(N.join('\n'));
  }
  // C715479: the research ideas left out do not appear
  if (want('479')) {
    const O = dir('C715479-left-out-ideas'); const N = [`Started ${stamp()} · build ${await marker(page)}`];
    const BAD = /aging period|salesperson|sales rep|parts vs\.? service|last payment|credit limit|send statement|collection note|follow-up|follow up/i;
    await go(page, APP + '/reports/ar-aging-summary');
    const heads = await page.evaluate(() => [...document.querySelectorAll('thead th')].map((e) => e.innerText.trim()).filter(Boolean));
    let c = await chips(page);
    N.push(`Step 1 A/R Summary: filter row: ${c.join(' | ')} · columns: ${heads.join(' | ')} · forbidden words on page: ${(await page.innerText('body')).match(BAD)?.[0] || 'none'}`);
    await page.screenshot({ path: `${O}/1 AR Summary.png` });
    await page.click('[data-test-id="btn_dropdown_arsum_export"]'); await page.waitForTimeout(1200);
    const menu = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item')].map((e) => e.innerText.replace(/\s+/g, ' ').trim()));
    await page.screenshot({ path: `${O}/2 AR Summary menu.png` }); await page.keyboard.press('Escape');
    N.push(`Step 2 ⋯ menu items: ${menu.join(' | ')} · Send statement present: ${menu.some((m) => /send statement/i.test(m))}`);
    await go(page, APP + '/reports/ar-aging-collection');
    N.push(`Step 3 A/R Collection opened: ${page.url()}`);
    const g = page.locator('[data-test-id^="button_ar_aging_collection_report_toggle_"], [data-test-id*="collection_report_toggle_"]').first();
    if (await g.count()) { await g.click(); await page.waitForTimeout(4000); }
    const body4 = await page.innerText('body');
    await page.screenshot({ path: `${O}/4 AR Collection group expanded.png` });
    N.push(`Step 4 group expanded: ${await g.count() ? 'yes (' + await g.getAttribute('data-test-id') + ')' : 'NO TOGGLE FOUND'} · forbidden words: ${body4.match(BAD)?.[0] || 'none'}`);
    await go(page, APP + '/reports/ar-aging-detail');
    c = await chips(page);
    N.push(`Step 5 A/R Detail filter row: ${c.join(' | ')} · forbidden words: ${(await page.innerText('body')).match(BAD)?.[0] || 'none'}`);
    await page.screenshot({ path: `${O}/5 AR Detail.png` });
    fs.writeFileSync(`${O}/NOTES.txt`, N.join('\n') + '\n'); console.log(N.join('\n'));
  }
  // C715462: overpaid invoice, as of 11 Nov 2026, customer A ticked
  if (want('462')) {
    const O = dir('C715462-overpaid-totals'); const N = [`Started ${stamp()} · build ${await marker(page)}`];
    await go(page, APP + '/reports/ar-aging-summary?asOfDate=2026-11-11&customerIds=6df5d452-e832-46b2-a338-ddde92fcc613');
    const c = await chips(page);
    const cells = await page.evaluate(() => { const g = (sel) => [...document.querySelectorAll(sel)].map((e) => e.getAttribute('data-test-id').replace(/^.*_cell_/, '') + '=' + e.innerText.trim()); return { row: g('[data-test-id^="aging_summary_report_row_"][data-test-id*="_cell_"]'), totals: g('[data-test-id^="row_arsum_totals_cell_"]') }; });
    await page.screenshot({ path: `${O}/AR Summary as of 2026-11-11 - customer A.png` });
    N.push(`(${stamp()}) chips: ${c.join(' | ')}\n  customer A row: ${cells.row.join(' · ')}\n  Totals row: ${cells.totals.join(' · ')}`);
    fs.writeFileSync(`${O}/NOTES.txt`, N.join('\n') + '\n'); console.log(N.join('\n'));
  }
  // 5 / C715480: open the switcher, switch to location B, then back to Staging Heavy Duty - 9919 (his location)
  if (want('5')) {
    const O = dir('5-location-switcher'); const N = [`Started ${stamp()} · build ${await marker(page)}`];
    await ctx.unroute(/\/api\/iam\/change-location/);
    await go(page, APP + '/reports/ar-aging-summary');
    const before = { url: page.url(), chips: await chips(page), first: (await rows(page)).slice(0, 4) };
    const btn = clean(await page.locator('[data-test-id="profile_menu_button"]').innerText());
    await page.click('[data-test-id="profile_menu_button"]'); await page.waitForTimeout(1500);
    const sub = page.locator('.q-menu .q-item').filter({ hasText: /Change Location/i }).first();
    await sub.click().catch(() => {}); await page.waitForTimeout(1500);
    const items = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item')].map((e) => e.innerText.replace(/\s+/g, ' ').trim()));
    await page.screenshot({ path: `${O}/AR Aging Summary - location switcher open (locations list).png` });
    N.push(`Step 1 (${stamp()}): button reads "${btn}"; items: ${items.join(' | ')}`);
    async function switchTo(name) {
      const opt = page.locator('.q-menu .q-item').filter({ hasText: new RegExp('^\\s*(check\\s*)?' + name.replace(/[-]/g, '\\-') + '\\s*$') }).first();
      if (!(await opt.count())) return 'option not found';
      await opt.click(); await page.waitForTimeout(9000);
      const dlg = await page.evaluate(() => [...document.querySelectorAll('.q-dialog')].map((e) => e.innerText.replace(/\s+/g, ' ').trim()).join(' / '));
      return `clicked; dialog: ${dlg || 'none'}`;
    }
    const r1 = await switchTo('Staging Lethbridge - 4310');
    const after = { url: page.url(), chips: await chips(page), first: (await rows(page)).slice(0, 4), btn: clean(await page.locator('[data-test-id="profile_menu_button"]').innerText()) };
    await page.screenshot({ path: `${O}/AR Aging Summary - after switching to location B.png` });
    N.push(`Step 2 (${stamp()}): switch to Staging Lethbridge - 4310: ${r1}\n  before: ${JSON.stringify(before)}\n  after:  ${JSON.stringify(after)}`);
    await page.click('[data-test-id="profile_menu_button"]'); await page.waitForTimeout(1500);
    await page.locator('.q-menu .q-item').filter({ hasText: /Change Location/i }).first().click().catch(() => {}); await page.waitForTimeout(1500);
    const r2 = await switchTo('Staging Heavy Duty - 9919');
    const back = clean(await page.locator('[data-test-id="profile_menu_button"]').innerText());
    N.push(`Restore (${stamp()}): switch back to Staging Heavy Duty - 9919: ${r2}; button now reads "${back}"`);
    fs.writeFileSync(`${O}/NOTES.txt`, N.join('\n') + '\n'); console.log(N.join('\n'));
  }
  await browser.close();
})();
