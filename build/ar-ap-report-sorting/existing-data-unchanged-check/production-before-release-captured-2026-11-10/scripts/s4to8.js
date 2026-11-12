const { open } = require('./prod');
const fs = require('fs');
const APP = 'https://app.shopview.com/reports/';
const clean = (s) => (s || '').replace(/\s+/g, ' ').replace(/place|keyboard_arrow_down|cancel|person|calendar_today/g, '').trim();
async function nav(page, tid) { await page.click(`[data-test-id="${tid}"]`); await page.waitForTimeout(6000); }
(async () => {
  const { browser, ctx, page } = await open();
  const N = {};
  // ── 4. Sales By Customer: the message when an export fails (network off) ──
  {
    const O = 'out/4-export-failure';
    await page.goto(APP + 'sales-by-customer', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-test-id="btn_dropdown_sbc_export"]', { timeout: 60000 }); await page.waitForTimeout(5000);
    await ctx.setOffline(true);
    await page.click('[data-test-id="btn_dropdown_sbc_export"]'); await page.waitForTimeout(800);
    await page.click('[data-test-id="action_sbc_export_summary_csv"]');
    let msg = '';
    for (let i = 0; i < 20 && !msg; i++) { await page.waitForTimeout(500); msg = await page.evaluate(() => [...document.querySelectorAll('.q-notification, [role=alert], .q-banner')].map((e) => e.innerText.trim()).filter(Boolean).join(' / ')); }
    await page.screenshot({ path: `${O}/Sales By Customer - export with network off.png` });
    await ctx.setOffline(false);
    N[4] = `Network switched off (browser offline), then ⋯ → "Download Summary (CSV)" (production has no plain "Download (CSV)" on Sales By Customer before the release).\nMessage shown: ${msg ? '"' + msg + '"' : 'NO message appeared within 10 seconds'}\nNetwork switched back on.`;
    fs.writeFileSync(`${O}/NOTES.txt`, N[4] + '\n'); console.log('4:', N[4]);
  }
  // ── 5. The location switcher, open, on A/R Aging Summary ──
  {
    const O = 'out/5-location-switcher';
    await page.goto(APP + 'ar-aging-summary', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('table tr', { timeout: 60000 }); await page.waitForTimeout(3000);
    await page.click('[data-test-id="profile_menu_button"]'); await page.waitForTimeout(1500);
    const items = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item, .q-menu [role=menuitem]')].map((e) => e.innerText.trim().replace(/\s+/g, ' ')).filter(Boolean));
    await page.screenshot({ path: `${O}/AR Aging Summary - location switcher open.png` });
    // if the location list is a sub-menu, open it too
    const sub = page.locator('.q-menu .q-item').filter({ hasText: /location|switch/i }).first();
    let subItems = [];
    if (await sub.count()) { await sub.hover(); await sub.click().catch(() => {}); await page.waitForTimeout(1500); subItems = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item')].map((e) => e.innerText.trim().replace(/\s+/g, ' '))); await page.screenshot({ path: `${O}/AR Aging Summary - location switcher open (locations list).png` }); }
    await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
    N[5] = `Opened the switcher at the top right (the button showing the current location, Truck Hill 1).\nItems shown: ${items.join(' | ')}${subItems.length ? '\nAfter opening the location entry: ' + subItems.join(' | ') : ''}`;
    fs.writeFileSync(`${O}/NOTES.txt`, N[5] + '\n'); console.log('5:', N[5]);
  }
  // ── 6. Drill-down links ──
  {
    const O = 'out/6-drill-down-links';
    const out = [];
    for (const [slug, cell, label] of [['ar-aging-summary', 'customer_name', 'customer'], ['ap-aging-summary', 'vendor_name', 'vendor']]) {
      await page.goto(APP + slug, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('table tr', { timeout: 60000 }); await page.waitForTimeout(3000);
      // a row with something overdue (any past-due bucket non-empty)
      const pick = await page.evaluate((cell) => {
        for (const tr of document.querySelectorAll('tr[data-test-id]')) {
          const name = tr.querySelector(`[data-test-id$="_cell_${cell}"]`); if (!name) continue;
          const due = ['days_1_to_30', 'days_31_to_60', 'days_61_to_90', 'days_91_plus'].map((b) => tr.querySelector(`[data-test-id$="_cell_${b}"]`)).filter(Boolean).map((c) => c.innerText.trim());
          if (due.some((v) => v && !/^\$?0(\.00)?$/.test(v) && !/-/.test(v))) return { tid: name.getAttribute('data-test-id'), name: name.innerText.trim() };
        }
        return null;
      }, cell);
      if (!pick) { out.push(`${slug}: no ${label} with an overdue amount found`); continue; }
      const before = page.url();
      const clickable = page.locator(`[data-test-id="${pick.tid}"] a, [data-test-id="${pick.tid}"] span, [data-test-id="${pick.tid}"]`).first();
      const pop = ctx.waitForEvent('page', { timeout: 8000 }).catch(() => null);
      await clickable.click(); const p2 = await pop;
      const target = p2 || page; await target.waitForLoadState('domcontentloaded').catch(() => {}); await target.waitForTimeout(6000);
      const url = target.url();
      await target.screenshot({ path: `${O}/${slug} - clicked ${label} ${pick.name.replace(/[\\/:*?"<>|]/g, '')}.png` });
      out.push(`${slug}: clicked ${label} "${pick.name}" → ${url}${p2 ? ' (opened in a new tab)' : ''}${url === before ? ' (the page address did not change)' : ''}`);
      if (p2) await p2.close();
    }
    N[6] = out.join('\n'); fs.writeFileSync(`${O}/NOTES.txt`, N[6] + '\n'); console.log('6:', N[6]);
  }
  // ── 7. Does the Location filter remember itself between visits? ──
  {
    const O = 'out/7-location-filter-memory';
    const out = [];
    const UNTICK = ['b617914c-16e9-4485-8e8b-193cd86aa416', 'Trucks Hill 2'];
    for (const [slug, name, navTid] of [['sales-by-customer', 'Sales By Customer', 'report_nav_sales_by_customer'], ['inventory-value', 'Inventory Value', 'report_nav_inventory_value'], ['work-in-progress', 'Work In Progress', 'report_nav_work_in_progress']]) {
      await page.goto(APP + slug, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('[data-test-id="filter_chip_locationIds"]', { timeout: 60000 }); await page.waitForTimeout(4000);
      const start = clean(await page.locator('[data-test-id="filter_chip_locationIds"]').innerText());
      await page.click('[data-test-id="filter_chip_locationIds"]'); await page.waitForTimeout(800);
      await page.click(`[data-test-id="filter_option_locationIds_${UNTICK[0]}"]`); await page.waitForTimeout(800);
      await page.keyboard.press('Escape'); await page.waitForTimeout(3000);
      const after = clean(await page.locator('[data-test-id="filter_chip_locationIds"]').innerText());
      await page.screenshot({ path: `${O}/${name} - 1 after unticking ${UNTICK[1]}.png` });
      await nav(page, 'report_nav_aging_summary_report');
      await nav(page, navTid);
      await page.waitForSelector('[data-test-id="filter_chip_locationIds"]', { timeout: 60000 });
      const back = clean(await page.locator('[data-test-id="filter_chip_locationIds"]').innerText());
      await page.click('[data-test-id="filter_chip_locationIds"]'); await page.waitForTimeout(800);
      const ticked = await page.evaluate((id) => document.querySelector(`[data-test-id="filter_option_locationIds_${id}"]`)?.getAttribute('aria-checked'), UNTICK[0]);
      await page.screenshot({ path: `${O}/${name} - 2 back again, location menu open.png` });
      await page.keyboard.press('Escape');
      out.push(`${name}: at first "${start}"; unticked ${UNTICK[1]} → "${after}"; went to A/R Aging Summary and back via the Reports menu → "${back}", ${UNTICK[1]} is ${ticked === 'false' ? 'STILL UNTICKED (the filter remembered)' : ticked === 'true' ? 'TICKED AGAIN (the filter did not remember)' : 'unknown (' + ticked + ')'}; page address ${page.url()}`);
    }
    N[7] = out.join('\n'); fs.writeFileSync(`${O}/NOTES.txt`, N[7] + '\n'); console.log('7:', N[7]);
  }
  // ── 8. Sales By Customer's filter menus ──
  {
    const O = 'out/8-sbc-filter-menus';
    const out = [];
    await page.goto(APP + 'sales-by-customer', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-test-id="filter_chip_locationIds"]', { timeout: 60000 }); await page.waitForTimeout(4000);
    await page.click('[data-test-id="filter_chip_locationIds"]'); await page.waitForTimeout(800);
    await page.click('[data-test-id="filter_clear_selection_locationIds"]'); await page.waitForTimeout(800);
    await page.click('[data-test-id="filter_select_all_locationIds"]'); await page.waitForTimeout(800);
    await page.screenshot({ path: `${O}/1 Location menu after Clear selection then Select all.png` });
    await page.keyboard.press('Escape'); await page.waitForTimeout(3000);
    out.push(`Location: Clear selection, then Select all → chip says "${clean(await page.locator('[data-test-id="filter_chip_locationIds"]').innerText())}"; page address ${page.url()}`);
    await page.click('[data-test-id="filter_chip_customerIds"]'); await page.waitForTimeout(1000);
    const box = page.locator('.q-menu input').first();
    await box.click(); await page.keyboard.type('ZZA', { delay: 150 }); await page.waitForTimeout(2500);
    await page.keyboard.type('UTO', { delay: 150 }); await page.waitForTimeout(2500);
    const val = await box.inputValue().catch(() => '?');
    await page.screenshot({ path: `${O}/2 Customer menu after typing ZZA then UTO.png` });
    out.push(`Customer: clicked the search box once, typed "ZZA", waited 2.5 s, then typed "UTO" without clicking again → the box holds "${val}" (${val === 'ZZAUTO' ? 'the letters kept going into the box' : 'the letters did NOT all go into the box'})`);
    await page.keyboard.press('Escape'); await page.keyboard.press('Escape'); await page.waitForTimeout(1000);
    await page.setViewportSize({ width: 900, height: 900 }); await page.waitForTimeout(2500);
    const row = page.locator('[data-test-id="filter_chip_locationIds"]').locator('xpath=ancestor::*[count(.//*[starts-with(@data-test-id,"filter_chip_")])>=3][1]');
    if (await row.count()) await row.screenshot({ path: `${O}/3 filter row at 900 px.png` });
    await page.screenshot({ path: `${O}/3 whole page at 900 px.png` });
    out.push('Window made 900 px wide: screenshots "3 filter row at 900 px.png" and "3 whole page at 900 px.png"');
    N[8] = out.join('\n'); fs.writeFileSync(`${O}/NOTES.txt`, N[8] + '\n'); console.log('8:', N[8]);
  }
  await browser.close();
})();
