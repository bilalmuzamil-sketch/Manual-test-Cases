// Section 1: the six A/R and A/P reports, untouched (as-of = the default; set AS_OF=YYYY-MM-DD to choose a day instead,
// which the after-check MUST do: AS_OF=2026-11-12). Plus, for the two Detail reports, every bucket expanded (staging extra).
const { open, APP, stamp, dir, rows } = require('./stg');
const fs = require('fs');
const OUT = dir('1-six-reports');
const AS_OF = process.env.AS_OF || '';
const R = [['ar-aging-summary', 'AR Aging Summary', true], ['ar-aging-detail', 'AR Aging Detail', true], ['ar-aging-collection', 'AR Aging Collection', true],
  ['ap-aging-summary', 'AP Aging Summary', false], ['ap-aging-detail', 'AP Aging Detail', false], ['ap-unpaid-invoices', 'AP Unpaid Invoices', false]];
async function pickDay(page, iso) { // open the as-of chip and click the day (same month as shown) — fail loudly otherwise
  await page.click('[data-test-id="filter_chip_asOfDate"]'); await page.waitForTimeout(800);
  const d = String(Number(iso.slice(8)));
  await page.locator('[data-test-id="filter_single_date_asOfDate"] button').filter({ hasText: new RegExp('^' + d + '$') }).first().click();
  await page.waitForTimeout(800); await page.keyboard.press('Escape'); await page.waitForTimeout(4000);
}
(async () => {
  const { browser, ctx, page } = await open();
  const notes = [`Started ${stamp()}`];
  for (const [slug, name, isAR] of R) {
    await page.goto(APP + '/reports/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('[data-test-id$="_report_table"], table', { timeout: 60000 });
    await page.waitForTimeout(6000);
    if (AS_OF) await pickDay(page, AS_OF);
    const asOf = await page.locator('[data-test-id="filter_chip_asOfDate"]').first().innerText().catch(() => '?');
    const chips = await page.evaluate(() => [...document.querySelectorAll('[data-test-id^="filter_chip_"]')].map((e) => e.getAttribute('data-test-id') + '=' + e.innerText.replace(/\s+/g, ' ').trim()));
    await page.screenshot({ path: `${OUT}/${name} - full page.png`, fullPage: true });
    const r = await rows(page);
    fs.writeFileSync(`${OUT}/${name} - rows.txt`, r.join('\n') + '\n');
    const scroll = await page.evaluate(() => { const t = document.querySelector('table'); let e = t; while (e && e !== document.body) { const s = getComputedStyle(e); if (/(auto|scroll)/.test(s.overflowY) && e.scrollHeight > e.clientHeight + 5) return { h: e.scrollHeight, c: e.clientHeight }; e = e.parentElement; } return null; });
    let shots = 1;
    if (scroll) {
      for (let y = 0, i = 1; y < scroll.h; y += scroll.c - 40, i++) {
        await page.evaluate((y) => { const t = document.querySelector('table'); let e = t; while (e && e !== document.body) { const s = getComputedStyle(e); if (/(auto|scroll)/.test(s.overflowY) && e.scrollHeight > e.clientHeight + 5) { e.scrollTop = y; return; } e = e.parentElement; } }, y);
        await page.waitForTimeout(400);
        await page.screenshot({ path: `${OUT}/${name} - part ${i}.png` }); shots = i;
      }
    }
    let print = '';
    if (isAR) {
      const btn = page.locator('[data-test-id="ar_report_print"]').first();
      if (await btn.count()) {
        const pop = ctx.waitForEvent('page', { timeout: 60000 }).catch(() => null);
        const dl = page.waitForEvent('download', { timeout: 60000 }).catch(() => null);
        await btn.click();
        const [p, d] = await Promise.all([pop, dl]);
        if (d) { await d.saveAs(`${OUT}/${name} - print.${d.suggestedFilename().split('.').pop() || 'pdf'}`); print = 'download ' + d.suggestedFilename(); }
        else if (p) { await p.waitForLoadState('load').catch(() => {}); await p.waitForTimeout(4000); await p.pdf({ path: `${OUT}/${name} - print.pdf`, printBackground: true }).catch(async () => { await p.screenshot({ path: `${OUT}/${name} - print.png`, fullPage: true }); }); print = 'print window ' + p.url().slice(0, 80); await p.close(); }
        else { await page.waitForTimeout(2000); print = 'no window or download'; await page.screenshot({ path: `${OUT}/${name} - after print click.png` }); }
      } else print = 'no print button (ar_report_print) on this page';
    }
    let extra = '';
    if (/Detail/.test(name)) { // staging extra: every bucket expanded, so document-level rows can be compared
      const tg = await page.locator('[data-test-id*="aging_detail_report_toggle_"]').all();
      for (const t of tg) { await t.click(); await page.waitForTimeout(1500); }
      await page.waitForTimeout(2500);
      const er = await rows(page);
      fs.writeFileSync(`${OUT}/${name} - all buckets expanded - rows.txt`, er.join('\n') + '\n');
      await page.screenshot({ path: `${OUT}/${name} - all buckets expanded - full page.png`, fullPage: true });
      extra = ` · all ${tg.length} buckets expanded: ${er.length} rows`;
    }
    notes.push(`${name}: ${asOf.replace(/\s+/g, ' ').replace(/keyboard_arrow_down|calendar_today/g, '').trim()} · ${r.length} table rows · ${shots} screenshot(s)${print ? ' · print: ' + print : ''}${extra} · filter chips: ${chips.join(' ; ').replace(/keyboard_arrow_down|calendar_today|place|person|cancel/g, '')} · ${stamp()}`);
    console.log(notes[notes.length - 1]);
  }
  notes.push(`Finished ${stamp()}`);
  fs.writeFileSync(`${OUT}/NOTES.txt`, notes.join('\n') + '\n');
  await browser.close();
})();
