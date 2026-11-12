// Section 1: the six A/R and A/P reports, untouched (as-of = today, the default)
const { open } = require('./prod');
const fs = require('fs');
const OUT = 'out/1-six-reports';
const R = [['ar-aging-summary', 'AR Aging Summary', true], ['ar-aging-detail', 'AR Aging Detail', true], ['ar-aging-collection', 'AR Aging Collection', true],
  ['ap-aging-summary', 'AP Aging Summary', false], ['ap-aging-detail', 'AP Aging Detail', false], ['ap-unpaid-invoices', 'AP Unpaid Invoices', false]];
(async () => {
  const { browser, ctx, page } = await open();
  const notes = [];
  for (const [slug, name, isAR] of R) {
    await page.goto('https://app.shopview.com/reports/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('[data-test-id$="_report_table"], table', { timeout: 60000 });
    await page.waitForTimeout(5000);
    const asOf = await page.locator('[data-test-id="filter_chip_asOfDate"]').first().innerText().catch(() => '?');
    // the whole page, plus the table's own rows as text (every row and the Totals row)
    await page.screenshot({ path: `${OUT}/${name} - full page.png`, fullPage: true });
    const rows = await page.evaluate(() => [...document.querySelectorAll('table tr')].map((tr) => [...tr.children].map((c) => c.innerText.trim().replace(/\s+/g, ' ')).join(' | ')));
    fs.writeFileSync(`${OUT}/${name} - rows.txt`, rows.join('\n') + '\n');
    // does the table scroll inside its own box? then take one screenshot per screen-height of it
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
      const pop = ctx.waitForEvent('page', { timeout: 15000 }).catch(() => null);
      const dl = page.waitForEvent('download', { timeout: 15000 }).catch(() => null);
      await btn.click();
      const [p, d] = await Promise.all([pop, dl]);
      if (d) { const f = `${OUT}/${name} - print.${(d.suggestedFilename().split('.').pop()) || 'pdf'}`; await d.saveAs(f); print = 'download ' + d.suggestedFilename(); }
      else if (p) { await p.waitForLoadState('load').catch(() => {}); await p.waitForTimeout(4000); await p.pdf({ path: `${OUT}/${name} - print.pdf`, printBackground: true }).catch(async () => { await p.screenshot({ path: `${OUT}/${name} - print.png`, fullPage: true }); }); print = 'print window ' + p.url().slice(0, 80); await p.close(); }
      else { await page.waitForTimeout(2000); print = 'no window or download (print opened inside the page)'; await page.pdf ? '' : ''; await page.screenshot({ path: `${OUT}/${name} - after print click.png` }); }
    }
    notes.push(`${name}: ${asOf.replace(/\s+/g, ' ').replace(/keyboard_arrow_down|calendar_today/g, '').trim()} · ${rows.length} table rows · ${shots} screenshot(s)${print ? ' · print: ' + print : ''}`);
    console.log(notes[notes.length - 1]);
  }
  fs.writeFileSync(`${OUT}/NOTES.txt`, notes.join('\n') + '\n');
  await browser.close();
})();
