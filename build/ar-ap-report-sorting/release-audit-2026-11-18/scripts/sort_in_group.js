const path = require('path'); const fs = require('fs');
const lib = require('/home/user/Manual-test-Cases/build/ar-ap-report-sorting/v1-regression/staging-run-2026-11-12/tech-tools/lib.js');
const OUT = '/home/user/Manual-test-Cases/build/ar-ap-report-sorting/release-audit-2026-11-18/screen/smoke-2026-11-19';
(async () => { const { browser, page, app } = await lib.open('staging', { width: 1440 }); const out = {};
  for (const slug of ['ar-aging-detail', 'ar-aging-collection', 'ap-aging-detail', 'ap-unpaid-invoices']) {
    await page.goto(`${app}/reports/${slug}`, { waitUntil: 'domcontentloaded' }); await lib.settle(page, 3500);
    const chev = page.locator('thead th').first().locator('button, i, .q-icon').filter({ hasText: /keyboard_arrow/ }).first(); await chev.click(); await lib.settle(page, 5000);
    const docRows = async () => (await page.locator('tbody tr').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ')).filter((t) => /\$/.test(t) && !/^Total/.test(t) && !/days past due \(|Current \(/.test(t)).slice(0, 6).map((t) => t.slice(0, 70));
    const a = await docRows();
    const amt = page.locator('thead th', { hasText: 'Amount' }).first(); await amt.click(); await lib.settle(page, 4000); const b = await docRows();
    await amt.click(); await lib.settle(page, 4000); const c = await docRows();
    const groupsA = (await page.locator('tbody tr').allInnerTexts()).filter((t) => /days past due|Current/.test(t)).map((t) => t.replace(/\s+/g, ' ').slice(0, 30)).slice(0, 5);
    out[slug] = { firstRowsOpening: a, afterAmountClick1: b, afterAmountClick2: c, rowsChanged: JSON.stringify(a) !== JSON.stringify(b), reversed: JSON.stringify(b) !== JSON.stringify(c), groupsStillInOrder: groupsA };
    await page.screenshot({ path: `${OUT}/${slug}-sorted-by-amount.png` });
  }
  fs.writeFileSync(`${OUT}/sort-inside-groups.json`, JSON.stringify(out, null, 1));
  for (const [s, x] of Object.entries(out)) console.log(s, '| rows re-sorted by Amount:', x.rowsChanged, '| second click changes again:', x.reversed, '\n   1st:', x.afterAmountClick1.slice(0, 2).join(' || '), '\n   2nd:', x.afterAmountClick2.slice(0, 2).join(' || '));
  await browser.close(); })().catch((e) => { console.error(e); process.exit(1); });
