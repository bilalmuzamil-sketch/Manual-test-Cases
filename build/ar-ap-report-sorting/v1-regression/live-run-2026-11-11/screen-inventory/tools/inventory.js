// What a user can SEE and DO on every report, V1 (prod) and V2 (QA). Resumable: skips reports already in out/<env>/<slug>.json
const { open } = require('./env');
const fs = require('fs');
const env = process.argv[2];
const OUT = `out/${env}`; fs.mkdirSync(OUT, { recursive: true });
const T = (s) => (s || '').replace(/\s+/g, ' ').trim();
(async () => {
  const { browser, page, app } = await open(env);
  await page.goto(app + '/reports', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(10000);
  const nav = await page.evaluate(() => [...document.querySelectorAll('a[href*="/reports/"]')].map((a) => ({ text: a.innerText.trim().replace(/\s+/g, ' '), href: a.getAttribute('href'), tid: a.getAttribute('data-test-id') })).filter((x) => x.text));
  const seen = new Set(); const reports = nav.filter((n) => { const s = n.href.split('?')[0]; if (seen.has(s)) return false; seen.add(s); return true; });
  fs.writeFileSync(`${OUT}/_nav.json`, JSON.stringify({ captured_at: new Date().toISOString(), marker: await page.evaluate(() => document.querySelector('meta[name="app-version"]')?.content), nav }, null, 1));
  await page.screenshot({ path: `${OUT}/_reports-home.png` });
  for (const r of reports) {
    const slug = r.href.split('?')[0].split('/').filter(Boolean).pop();
    if (fs.existsSync(`${OUT}/${slug}.json`)) continue;
    const rec = { slug, nav_text: r.text, nav_tid: r.tid };
    try {
      await page.goto(app + r.href, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(9000);
      rec.url = page.url(); rec.title = await page.title();
      rec.heading = T(await page.locator('h1, .text-h5, .text-h6').first().innerText().catch(() => ''));
      rec.controls = await page.evaluate(() => [...document.querySelectorAll('main [data-test-id], main button, main [role=button], main a[href]')].filter((e) => !e.closest('table, .q-table, .q-menu')).map((e) => ({ tid: e.getAttribute('data-test-id'), aria: e.getAttribute('aria-label'), text: (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 80), tag: e.tagName })).filter((x) => x.tid || x.aria || x.text).slice(0, 120));
      rec.headers = await page.evaluate(() => [...document.querySelectorAll('thead th, [role=columnheader]')].map((e) => e.innerText.trim().replace(/\s+/g, ' ')));
      rec.row_count = await page.locator('tbody tr').count();
      rec.rows_sample = await page.evaluate(() => [...document.querySelectorAll('tbody tr')].slice(0, 4).map((tr) => tr.innerText.trim().replace(/\s+/g, ' | ').slice(0, 300)));
      rec.footer = await page.evaluate(() => [...document.querySelectorAll('tfoot tr, tr[class*=total i], [data-test-id*=total i]')].slice(0, 4).map((e) => e.innerText.trim().replace(/\s+/g, ' | ').slice(0, 300)));
      rec.row_links = await page.evaluate(() => [...document.querySelectorAll('tbody tr a[href], tbody tr [data-test-id*=link i]')].slice(0, 6).map((a) => ({ text: a.innerText.trim(), href: a.getAttribute('href'), target: a.getAttribute('target'), tid: a.getAttribute('data-test-id') })));
      rec.body_text_head = T(await page.locator('main').innerText().catch(() => '')).slice(0, 1500);
      await page.screenshot({ path: `${OUT}/${slug}.png`, fullPage: true });
      // every filter chip: open it, record the panel
      rec.filters = [];
      const chips = await page.locator('[data-test-id^="filter_chip_"]').all();
      for (const c of chips.slice(0, 12)) {
        const tid = await c.getAttribute('data-test-id'); const label = T(await c.innerText());
        let panel = '';
        try { await c.click({ timeout: 4000 }); await page.waitForTimeout(1200); panel = T(await page.locator('.q-menu').last().innerText({ timeout: 3000 })).slice(0, 1200); await page.screenshot({ path: `${OUT}/${slug}__${tid}.png` }); } catch (e) { panel = 'ERR ' + e.message.slice(0, 80); }
        await page.keyboard.press('Escape'); await page.waitForTimeout(500);
        rec.filters.push({ tid, label, panel });
      }
      // ⋯ / export / print menus
      rec.menus = [];
      const menuBtns = await page.locator('[data-test-id^="btn_dropdown_"], [data-test-id*="export" i]:not([data-test-id^="action_"]), [data-test-id*="print" i], button[aria-label*="more" i]').all();
      for (const b of menuBtns.slice(0, 5)) {
        const tid = await b.getAttribute('data-test-id'); let items = '';
        try { await b.click({ timeout: 4000 }); await page.waitForTimeout(1000); items = await page.evaluate(() => [...document.querySelectorAll('.q-menu [data-test-id], .q-menu .q-item')].map((e) => (e.getAttribute('data-test-id') || '') + '=' + e.innerText.trim().replace(/\s+/g, ' ')).join(' | ')); } catch (e) { items = 'ERR ' + e.message.slice(0, 80); }
        await page.keyboard.press('Escape'); await page.waitForTimeout(500);
        for (const p of page.context().pages().slice(1)) await p.close();
        rec.menus.push({ tid, items });
      }
    } catch (e) { rec.error = e.message.slice(0, 300); }
    fs.writeFileSync(`${OUT}/${slug}.json`, JSON.stringify(rec, null, 1));
    console.log(env, slug, rec.error ? 'ERROR' : `${rec.headers?.length} cols, ${rec.row_count} rows, ${rec.filters?.length} filters, ${rec.menus?.length} menus`);
  }
  await browser.close();
})();
