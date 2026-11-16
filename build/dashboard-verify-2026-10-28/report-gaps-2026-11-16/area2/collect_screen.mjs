// Area 2 — screen facts for every report: export menu + every download (saved to /tmp, never committed), the
// notification text, the column chooser (toggle, reload = memory, restore), header sorting, unnamed controls and
// keyboard reach. Heavy Duty, Asia/Karachi, 1536x864, light. Facts only; checks are made in check_area2.py against
// quoted documents. Run: TZ=Asia/Karachi node collect_screen.mjs [report ...]
import fs from 'fs'; import { boot, LOC, APP, sleep, rule99, save } from '../tools/sboot.mjs';
const EV = new URL('./evidence/', import.meta.url).pathname; const DL = '/tmp/cln/rg16/a2/'; fs.mkdirSync(DL, { recursive: true });
const ALL = ['work-in-progress', 'technician-utilization', 'shop-billing-efficiency', 'punch-clock-activities', '/timesheets', 'sales-by-customer', 'sales-by-representative', 'sales', 'service-advisor-analysis', 'technician-efficiency', 'ar-aging-summary', 'ar-aging-detail', 'ar-aging-collection', 'ap-aging-summary', 'ap-aging-detail', 'ap-unpaid-invoices'];
const REPS = process.argv.slice(2).length ? process.argv.slice(2) : ALL; const loc = LOC.HD;
const { browser, ctx, page } = await boot(loc, { viewport: { width: 1536, height: 864 } }); const start = await rule99(page, loc);
const net = []; page.on('request', r => { const u = r.url(); if (u.includes('api.staging') && /reporting|report|timesheet|punch|aging|account-|export|pdf/.test(u)) net.push({ t: Date.now(), m: r.method(), u: u.replace('https://api.staging.shopview.com', '') }); });
const T = s => (s || '').replace(/\s+/g, ' ').trim();
async function facts() { return page.evaluate(() => { const T = s => (s || '').replace(/\s+/g, ' ').trim(); const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const heads = [...document.querySelectorAll('thead th')].filter(vis).map(th => ({ t: T(th.innerText), sortable: th.classList.contains('sortable'), cls: [...th.classList].filter(c => /sort|asc|desc/.test(c)).join(' '), aria_sort: th.getAttribute('aria-sort') }));
  const totals = [...document.querySelectorAll('tr')].map(r => T(r.innerText)).filter(t => /^(Totals?|Summary)\b/i.test(t)).slice(0, 3);
  const firstRows = [...document.querySelectorAll('tbody tr')].filter(vis).map(r => T(r.innerText)).filter(t => t && !/^(Totals?|Summary)\b/i.test(t)).slice(0, 4);
  const named = e => T(e.getAttribute('aria-label')) || T(e.getAttribute('aria-labelledby') && document.getElementById(e.getAttribute('aria-labelledby'))?.innerText) || T(e.innerText) || T(e.getAttribute('title')) || (e.id && T(document.querySelector(`label[for="${e.id}"]`)?.innerText));
  const ctrls = [...document.querySelectorAll('main button, main [role="button"], main input, main a[href], main [tabindex="0"]')].filter(vis);
  const unnamed = ctrls.filter(e => !named(e)).map(e => ({ tag: e.tagName, cls: (e.className || '').toString().slice(0, 60), icon: T(e.querySelector('.q-icon, i')?.innerText), tid: e.getAttribute('data-test-id') }));
  const exp = document.querySelector('[aria-label="Export report"]') || [...document.querySelectorAll('button')].find(b => /more_horiz|more_vert/.test(b.innerText) && vis(b)) || [...document.querySelectorAll('button')].find(b => /^(Print|Export|Download)/i.test(T(b.innerText)) && vis(b));
  const col = document.querySelector('[aria-label="Column Selection"]') || [...document.querySelectorAll('button')].find(b => /width_normal|view_column/.test(b.innerText) && vis(b));
  const mark = (e, k) => e && e.setAttribute('data-a2', k); mark(exp, 'export'); mark(col, 'columns');
  return { url: location.pathname + location.search, title: T(document.querySelector('h1, h2, .page-title, .text-h5, .text-h6')?.innerText), heads, totals, firstRows,
    export_btn: exp ? { aria: exp.getAttribute('aria-label'), text: T(exp.innerText), tooltip: exp.getAttribute('title') } : null,
    column_btn: col ? { aria: col.getAttribute('aria-label'), text: T(col.innerText) } : null, controls: ctrls.length, unnamed_controls: unnamed.slice(0, 12), unnamed_count: unnamed.length, sideways: document.documentElement.scrollWidth > innerWidth }; }); }
async function menuItems() { return page.evaluate(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().height > 0).at(-1); if (!m) return null;
  return [...m.querySelectorAll('.q-item, [role="menuitem"], .q-checkbox, label, button')].map(e => ({ t: (e.innerText || '').replace(/\s+/g, ' ').trim(), checked: e.querySelector('[aria-checked]')?.getAttribute('aria-checked') ?? e.getAttribute('aria-checked'), disabled: e.getAttribute('aria-disabled') || (e.classList.contains('disabled') ? 'true' : null) })).filter(x => x.t); }); }
async function toasts() { return page.evaluate(() => [...document.querySelectorAll('.q-notification')].map(n => (n.innerText || '').replace(/\s+/g, ' ').trim())); }
async function load(rep) { const url = APP + (rep.startsWith('/') ? rep : '/reports/' + rep); await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForLoadState('networkidle', { timeout: 40000 }).catch(() => {}); await sleep(7000); }
const out = { start, reports: {} };
for (const rep of REPS) {
  const R = { report: rep }; out.reports[rep] = R; const key = rep.replace(/\//g, '');
  try {
    await load(rep); R.first = await facts(); await page.screenshot({ path: EV + key + '.png' });
    // ---- keyboard: Tab through the page, note what receives focus (first 60 stops)
    await page.mouse.click(5, 300).catch(() => {}); const stops = [];
    for (let i = 0; i < 60; i++) { await page.keyboard.press('Tab'); stops.push(await page.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
      return { tag: e.tagName, a2: e.getAttribute('data-a2'), name: (e.getAttribute('aria-label') || e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40), visible_focus: cs.outlineStyle !== 'none' || cs.boxShadow !== 'none' || !!e.querySelector('.q-focus-helper'), on_screen: r.width > 0 }; })); }
    R.keyboard = { reached_export: stops.some(s => s?.a2 === 'export'), reached_columns: stops.some(s => s?.a2 === 'columns'), stops: stops.filter(Boolean).slice(0, 60) };
    if (R.keyboard.reached_export) { await page.focus('[data-a2="export"]').catch(() => {}); await page.keyboard.press('Enter'); await sleep(900); R.keyboard.enter_opens_export_menu = !!(await menuItems()); await page.keyboard.press('Escape'); await sleep(500); }
    // ---- export menu + every download
    R.downloads = [];
    if (R.first.export_btn) {
      await page.locator('[data-a2="export"]').click(); await sleep(1000); R.export_menu = await menuItems(); await page.keyboard.press('Escape'); await sleep(500);
      for (const it of (R.export_menu || []).filter(x => /pdf|csv|download|print|export/i.test(x.t))) {
        net.length = 0; await page.locator('[data-a2="export"]').click(); await sleep(900);
        const dlP = page.waitForEvent('download', { timeout: 45000 }).catch(() => null); const popP = ctx.waitForEvent('page', { timeout: 45000 }).catch(() => null);
        await page.locator('.q-menu').last().getByText(it.t, { exact: true }).first().click().catch(e => null);
        const first = await Promise.race([dlP, popP, sleep(46000).then(() => null)]); await sleep(1500);
        const d = { item: it.t, toasts: await toasts(), requests: net.filter(x => /export|pdf|print/.test(x.u)).map(x => x.m + ' ' + x.u.slice(0, 260)) };
        if (first && first.suggestedFilename) { d.filename = first.suggestedFilename(); const p = DL + key + '__' + d.filename; await first.saveAs(p); d.saved = p; d.bytes = fs.statSync(p).size; }
        else if (first && first.url) { d.popup_url = first.url().slice(0, 200); await first.close().catch(() => {}); }
        else d.result = 'no file and no new tab within 45 s';
        R.downloads.push(d); console.log(rep, 'download', it.t, d.filename || d.popup_url || d.result, d.toasts.join(' | ').slice(0, 120));
        await page.keyboard.press('Escape'); await sleep(2500);
      }
    }
    // ---- column chooser: toggle one column off, reload (memory), toggle back
    if (R.first.column_btn) {
      await page.locator('[data-a2="columns"]').click(); await sleep(1000); R.column_menu = await menuItems();
      const opt = (R.column_menu || []).find(x => x.checked === 'true' && x.disabled !== 'true' && x.t);
      if (opt) {
        await page.locator('.q-menu').last().getByText(opt.t, { exact: true }).first().click(); await sleep(1500); await page.keyboard.press('Escape'); await sleep(1000);
        R.columns = { toggled_off: opt.t, heads_after_toggle: (await facts()).heads.map(h => h.t) };
        await load(rep); const f2 = await facts(); R.columns.heads_after_reload = f2.heads.map(h => h.t);
        R.columns.remembered = !R.columns.heads_after_reload.includes(opt.t) && R.columns.heads_after_toggle.length === R.columns.heads_after_reload.length;
        await page.locator('[data-a2="columns"]').click(); await sleep(1000); await page.locator('.q-menu').last().getByText(opt.t, { exact: true }).first().click(); await sleep(1500); await page.keyboard.press('Escape'); await sleep(800);
        R.columns.heads_after_restore = (await facts()).heads.map(h => h.t);
      } else { await page.keyboard.press('Escape'); }
    }
    // ---- sorting: each sortable header, twice (asc, desc), first 6 headers
    R.sorting = []; const sortable = R.first.heads.filter(h => h.sortable).slice(0, 6);
    for (const h of sortable) {
      const row = { header: h.t, clicks: [] };
      for (let k = 0; k < 2; k++) { net.length = 0; await page.locator('thead th.sortable', { hasText: h.t }).first().click().catch(() => {}); await sleep(3500); const f = await facts();
        row.clicks.push({ head: f.heads.find(x => x.t === h.t), firstRows: f.firstRows.slice(0, 3), requests: net.filter(x => /sort/i.test(x.u)).map(x => x.u.slice(0, 220)).slice(0, 2) }); }
      R.sorting.push(row);
    }
  } catch (e) { R.error = String(e).slice(0, 300); }
  save(EV + 'screen-facts.json', out); console.log(rep, 'done', R.error || '', 'export', !!R.first?.export_btn, 'cols', !!R.first?.column_btn, 'sortable', R.sorting?.length);
}
out.end = await rule99(page, loc); save(EV + 'screen-facts.json', out); await browser.close();
