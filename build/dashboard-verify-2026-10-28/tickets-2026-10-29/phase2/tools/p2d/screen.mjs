// Worker p2d screen evidence (29 Oct 2026). Rule 99: browser timezoneId = the location's zone, process TZ = the zone,
// session change-location'd by boot2; all three recorded in meta.json. deviceScaleFactor 2 (boxes feed annotate_v2.py). SECRET-FREE.
// Usage: TZ=<zone> node screen.mjs <MODE>
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const APP = 'https://app.staging.shopview.com';
const L = { hd: ['b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Asia/Karachi', 'Staging Heavy Duty - 9919'], leth: ['f8a8b802-7780-4b16-bf10-343caeb616b2', 'America/Edmonton', 'Staging Lethbridge - 4310'],
  dvi: ['39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto', 'DVI Test'] };
const MODES = { D6b: 'hd', D4b: 'hd', D7c: 'dvi', D7d: 'hd', D1: 'hd', D2: 'leth', D3: 'hd', D4: 'hd', D5: 'hd', D6: 'hd', D7: 'dvi', D7b: 'hd' };
const mode = process.argv[2]; const [WP, TZ, LOCN] = L[MODES[mode]];
if (process.env.TZ !== TZ) { console.log('process TZ must be', TZ); process.exit(3); }
const OUT = `/tmp/cln/p2d/ev/${mode}`; fs.mkdirSync(OUT, { recursive: true });
const { browser, page } = await boot2('admin', { workplaceId: WP, timezone: TZ, contextOptions: { viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2, timezoneId: TZ, acceptDownloads: true } });
await page.evaluate(w => localStorage.setItem('location', JSON.stringify(w)), WP);
const meta = { mode, location: LOCN, location_tz: TZ, process_TZ: process.env.TZ, process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, observed_at_utc: new Date().toISOString(), shots: {}, notes: {} };
meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
meta.date_requests = [];
page.on('request', r => { const u = decodeURIComponent(r.url()); if (/api\.staging/.test(u) && /(start_date|end_date|asOfDate|created_after|created_before|range=)/.test(u)) meta.date_requests.push(u.replace(/^https:\/\/api\.staging\.shopview\.com/, '').slice(0, 400)); });
meta.browser_now = await page.evaluate(() => new Date().toString());
const B = b => b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
const box = async loc => B(await loc.first().boundingBox().catch(() => null));
const txt = async loc => (await loc.first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
const appKey = async () => { meta.app_timezone_key = await page.evaluate(() => localStorage.getItem('timezone')).catch(() => null); };
const save = () => fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1));
const shot = async (name, extra = {}) => { await appKey(); await page.screenshot({ path: `${OUT}/${name}.png` }); meta.shots[name] = { ...extra, header: (await txt(page.locator('header'))).slice(0, 200) }; save(); };
const go = async (p, wait = 12000) => { await page.goto(APP + p, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(wait);
  meta.appVersion = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null); };
const rowBox = async (t, scope = page) => { const r = scope.locator('tr').filter({ hasText: t }).first(); await r.evaluate(e => e.scrollIntoView({ block: 'center' })).catch(() => {}); await page.waitForTimeout(800); return { box: await box(r), text: await txt(r) }; };
try {
if (mode === 'D1') {
  await go('/customers/1c385fee-d4cc-46f4-b20a-b8e01987e0ff/invoices', 14000);
  const r1 = await rowBox('P2-2352'); const d1 = await rowBox('DEP-4763');
  r1.box = await box(page.locator('tr').filter({ hasText: 'P2-2352' })); d1.box = await box(page.locator('tr').filter({ hasText: 'DEP-4763' }));
  await shot('1-customer-invoices-tab', { p2352: r1, dep: d1, heads: await page.locator('thead th').allInnerTexts().catch(() => []) });
  await go('/reports/ar-aging-detail', 14000);
  meta.notes.date_chip = await txt(page.locator('button, .q-btn, .q-field').filter({ hasText: 'Date' }));
  const cur = page.locator('tr').filter({ hasText: /Current \(/ }).first();
  await cur.getByText('arrow_drop_down').first().click().catch(() => {}); await page.waitForTimeout(4000);
  const r2 = await rowBox('P2-2352'); r2.box = await box(page.locator('tr').filter({ hasText: 'P2-2352' }));
  meta.notes.dep_on_ar = await page.getByText('DEP-4763').count();
  await shot('2-ar-aging-detail', { p2352: r2, heads: await page.locator('thead th').allInnerTexts().catch(() => []), dateBox: await box(page.getByText('Date', { exact: false })) });
}
if (mode === 'D2' || mode === 'D3') {
  await go('/reports/batch-transactions', 14000);
  if (mode === 'D3') {
    const r = await rowBox('S2-16924'); r.box = await box(page.locator('tr').filter({ hasText: 'S2-16924' }));
    await shot('1-ibs-ready-to-send', { s16924: r, rows: await page.locator('tbody tr').allInnerTexts().catch(() => []), tab: await box(page.getByText('Ready To Send', { exact: true })) });
  } else {
    await page.getByText('Sent', { exact: true }).first().click(); await page.waitForTimeout(7000);
    const row = page.locator('tr').filter({ hasText: 'Oct 2, 2026' }).first();
    meta.notes.collapsed = await txt(row);
    await row.getByText('expand_more').first().click().catch(async () => { await row.click(); }); await page.waitForTimeout(6000);
    meta.notes.main = (await page.locator('main').innerText()).slice(0, 3000);
    await page.setViewportSize({ width: 1600, height: 1500 }); await page.waitForTimeout(1500);
    const inv = [];
    for (const n of ['S3-17282', 'S3-17353', 'S3-17447', 'S3-17436', 'S3-17479', 'S3-16509', 'S3-17497', 'S3-17496', 'S3-16914']) inv.push({ n, box: await box(page.locator('tr').filter({ hasText: n })), text: await txt(page.locator('tr').filter({ hasText: n })) });
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
    await shot('1-ibs-sent-batch', { batch: { box: await box(page.locator('tr').filter({ hasText: 'Oct 2, 2026' })), text: await txt(page.locator('tr').filter({ hasText: 'Oct 2, 2026' })) }, inv });
  }
}
if (mode === 'D4') {
  const resp = []; page.on('response', async r => { if (r.url().includes('/api/notes?')) { try { const j = await r.json(); resp.push({ url: decodeURIComponent(r.url()).slice(0, 300), n: j?.data?.notes?.length, pag: j?.data?.pagination }); } catch {} } });
  await go('/reports/notes-report', 15000);
  meta.notes.top = (await page.locator('main').innerText()).slice(0, 600);
  await shot('0-notes-top', { chips: await txt(page.locator('main')) });
  for (let i = 0; i < 60; i++) { await page.mouse.wheel(0, 4000); await page.waitForTimeout(350); }
  await page.waitForTimeout(5000);
  meta.notes.cards = await page.locator('.note-item').count();
  const last = page.locator('.note-item').last(); await last.scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(1500);
  meta.notes.requests = resp; meta.notes.bottom = (await page.locator('main').innerText()).slice(-800);
  meta.notes.pager = await page.locator('.q-pagination, [class*="pagination"], button:has-text("Load more"), button:has-text("Show more")').count();
  await shot('1-notes-bottom', { last: await box(last), lastText: await txt(last) });
}
if (mode === 'D5' || mode === 'D6') {
  await go('/reports/unexported-items', 15000);
  meta.notes.tabs = await txt(page.locator('.q-tabs'));
  const heads = await page.locator('thead th').allInnerTexts().catch(() => []); meta.notes.heads = heads;
  const rows = await page.locator('tbody tr').evaluateAll(trs => trs.map(tr => [...tr.querySelectorAll('td')].map(td => td.innerText.trim())));
  meta.notes.first_rows = rows.slice(0, 40); meta.notes.n_rows = rows.length;
  save();
  if (mode === 'D5') {
    // show a credit memo row with a blank No. next to an invoice row that has one
    const cm = page.locator('tbody tr').filter({ hasText: 'Credit Memo' }).first();
    await cm.evaluate(e => e.scrollIntoView({ block: 'center' })).catch(() => {}); await page.waitForTimeout(1000);
    const vis = await page.locator('tbody tr').evaluateAll(trs => trs.map(tr => { const r = tr.getBoundingClientRect(); return { y: r.y, h: r.height, x: r.x, w: r.width, cells: [...tr.querySelectorAll('td')].map(td => td.innerText.trim()) }; }).filter(o => o.y > 0 && o.y < 1000));
    await shot('1-qb-unexported-customers', { cm: { box: await box(cm), text: await txt(cm) }, visible: vis.map(v => ({ box: { x: Math.round(v.x * 2), y: Math.round(v.y * 2), w: Math.round(v.w * 2), h: Math.round(v.h * 2) }, cells: v.cells })), heads, headBoxes: await page.locator('thead th').evaluateAll(ths => ths.map(t => { const r = t.getBoundingClientRect(); return { t: t.innerText.trim(), x: Math.round(r.x * 2), y: Math.round(r.y * 2), w: Math.round(r.width * 2), h: Math.round(r.height * 2) }; })) });
  } else {
    const target = process.argv[3] || 'DEP-4798';
    await page.mouse.move(1000, 600);
    for (let i = 0; i < 60 && !(await page.locator('tbody tr').filter({ hasText: target }).count()); i++) { await page.mouse.wheel(0, 700); await page.waitForTimeout(700); }
    meta.notes.found = await page.locator('tbody tr').filter({ hasText: target }).count();
    meta.notes.bottom = (await txt(page.locator('.q-table__bottom'))).slice(0, 300);
    const r = page.locator('tbody tr').filter({ hasText: target }).first();
    await r.evaluate(e => e.scrollIntoView({ block: 'center' })).catch(() => {}); await page.waitForTimeout(1000);
    const vis = await page.locator('tbody tr').evaluateAll(trs => trs.map(tr => { const r = tr.getBoundingClientRect(); return { y: r.y, h: r.height, x: r.x, w: r.width, cells: [...tr.querySelectorAll('td')].map(td => td.innerText.trim()) }; }).filter(o => o.y > 0 && o.y < 1000));
    await shot('1-qb-unexported-duplicate', { target: { box: await box(r), text: await txt(r) }, visible: vis.map(v => ({ box: { x: Math.round(v.x * 2), y: Math.round(v.y * 2), w: Math.round(v.w * 2), h: Math.round(v.h * 2) }, cells: v.cells })) });
  }
}
if (mode === 'D7' || mode === 'D7b') {
  const S = JSON.parse(fs.readFileSync('/tmp/cln/p2d/seed_d7.json', 'utf8'));
  const range = mode === 'D7' ? 'Today' : 'Last Month';
  if (mode === 'D7') {
    await go(`/customers/${S.company_id}`, 12000);
    meta.notes.cust_before = (await page.locator('main').innerText()).slice(0, 800);
    await shot('1-customer-before', { term: await box(page.getByText('Credit term', { exact: false })) });
    if (!process.argv.includes('--noedit')) {
      await page.locator('button:has(i:text("edit_note"))').first().click(); await page.waitForTimeout(3000);
      await page.locator('[data-test-id="select_customer_credit_term"]').click(); await page.waitForTimeout(1200);
      meta.notes.term_options = await page.locator('.q-menu .q-item').allInnerTexts();
      await page.locator('.q-menu .q-item').filter({ hasText: /^Net 30$/ }).first().click(); await page.waitForTimeout(800);
      await page.locator('[data-test-id="button_save_customer"]').click(); await page.waitForTimeout(6000);
    }
    await go(`/customers/${S.company_id}`, 12000);
    meta.notes.cust_after = (await page.locator('main').innerText()).slice(0, 800);
    await shot('2-customer-after', { term: await box(page.getByText('Credit term', { exact: false })), termBlock: await box(page.getByText('Credit term', { exact: false }).locator('..')) });
  }
  await go('/reports/sales', 12000);
  await page.getByText('Export Reports', { exact: true }).first().click(); await page.waitForTimeout(2500);
  const dlg = page.locator('.q-dialog').last();
  await dlg.locator('[data-test-id="select_report_name"]').click(); await page.waitForTimeout(1000);
  meta.notes.report_options = await page.locator('.q-menu .q-item').allInnerTexts(); save();
  await page.locator('.q-menu .q-item').filter({ hasText: 'Customer Invoice' }).first().click(); await page.waitForTimeout(800);
  await dlg.locator('[data-test-id="select_date_range"]').click(); await page.waitForTimeout(1000);
  meta.notes.range_options = await page.locator('.q-menu .q-item').allInnerTexts(); save();
  await page.locator('.q-menu .q-item').filter({ hasText: range }).first().click(); await page.waitForTimeout(800);
  await shot('3-export-dialog', { dialog: await box(dlg), text: await txt(dlg) });
  const dlP = page.waitForEvent('download', { timeout: 120000 });
  await dlg.getByRole('button', { name: 'Export' }).click();
  const dl = await dlP; const fn = `${OUT}/${dl.suggestedFilename()}`; await dl.saveAs(fn); meta.notes.download = fn;
  const csv = fs.readFileSync(fn, 'utf8'); const lines = csv.split(/\r?\n/);
  const want = mode === 'D7' ? [S.display] : ['S2-31597', 'S2-32052', 'S2-32271'];
  const pick = [lines[0], ...lines.filter(l => want.some(w => l.startsWith(w + ',') || l.startsWith('"' + w + '"')))];
  meta.notes.csv_rows = pick; save();
  // show the downloaded file's rows as a plain table (what a spreadsheet would show)
  const parse = l => { const o = []; let c = '', q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === ',' && !q) { o.push(c); c = ''; } else c += ch; } o.push(c); return o; };
  const cols = ['InvoiceNo', 'Customer', 'InvoiceDate', 'DueDate', 'Terms', 'ItemAmount']; const H = parse(pick[0]); const ix = cols.map(c => H.indexOf(c));
  const html = `<html><body style="font:16px Arial;padding:24px;background:#fff"><div style="margin-bottom:10px;color:#444">Downloaded file: ${dl.suggestedFilename()} (columns shown: ${cols.join(', ')})</div><table border=1 cellpadding=8 style="border-collapse:collapse">` +
    `<tr>${cols.map(c => `<th id="h_${c}">${c}</th>`).join('')}</tr>` + pick.slice(1).map((l, i) => { const v = parse(l); return `<tr id="r${i}">${ix.map((k, j) => `<td id="c${i}_${cols[j]}">${v[k] ?? ''}</td>`).join('')}</tr>`; }).join('') + '</table></body></html>';
  const p2 = await page.context().newPage(); await p2.setContent(html); await p2.waitForTimeout(500);
  const cb = {}; for (let i = 0; i < pick.length - 1; i++) for (const c of cols) cb[`${i}_${c}`] = B(await p2.locator(`#c${i}_${c}`).boundingBox());
  await p2.screenshot({ path: `${OUT}/4-export-file.png` }); meta.shots['4-export-file'] = { cells: cb, termsHead: B(await p2.locator('#h_Terms').boundingBox()) }; save();
}
if (mode === 'D7c' || mode === 'D7d') {
  const S = JSON.parse(fs.readFileSync('/tmp/cln/p2d/seed_d7.json', 'utf8'));
  const WO = mode === 'D7c' ? S.wo : process.argv[3];
  await go(`/workorders/${WO}/lines`, 12000);
  await page.getByText('Finance', { exact: true }).first().click(); await page.waitForTimeout(9000);
  const main = page.locator('main'); meta.notes.finance = (await txt(main)).slice(0, 3000);
  const cod = main.getByText('COD', { exact: false });
  meta.notes.cod_count = await cod.count();
  await cod.first().scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(800);
  await shot('5-invoice-finance', { cod: await box(cod), terms: await box(main.getByText(/Terms/i)), due: await box(main.getByText(/Due/i)) });
}
if (mode === 'D4b') {
  const resp = []; page.on('response', async r => { if (r.url().includes('/api/notes?')) { try { const j = await r.json(); resp.push({ url: decodeURIComponent(r.url()).slice(0, 400), n: j?.data?.notes?.length, pag: j?.data?.pagination }); } catch {} } });
  const rng = process.argv[3] || 'last_week';
  await go('/reports/notes-report?range=' + rng, 15000);
  meta.notes.range = rng; meta.notes.chip = await txt(page.getByText('Date Range', { exact: false }));
  await shot('0-top', { chip: await box(page.getByText('Date Range', { exact: false })) });
  let prev = -1; for (let i = 0; i < 80; i++) { await page.mouse.wheel(0, 5000); await page.waitForTimeout(400); if (i % 10 === 9) { const c = await page.locator('.note-item').count(); if (c === prev) break; prev = c; } }
  await page.waitForTimeout(5000);
  meta.notes.cards = await page.locator('.note-item').count(); meta.notes.requests = resp;
  const last = page.locator('.note-item').last(); await last.evaluate(e => e.scrollIntoView({ block: 'end' })).catch(() => {}); await page.waitForTimeout(1500);
  meta.notes.lastText = (await txt(last)).slice(0, 300);
  meta.notes.loadMore = await page.locator('button:has-text("Load more"), button:has-text("Show more"), .q-pagination').count();
  meta.notes.chip_visible_at_bottom = await page.getByText('Date Range', { exact: false }).first().isVisible().catch(() => null);
  await shot('1-bottom-' + rng, { last: await box(last), chip: await box(page.getByText('Date Range', { exact: false })) });
}
if (mode === 'D6b') {
  await go('/customers/1c385fee-d4cc-46f4-b20a-b8e01987e0ff/invoices', 14000);
  const tog = page.getByText('Open only', { exact: true }); meta.notes.toggle = await tog.count();
  await tog.first().click().catch(() => {}); await page.waitForTimeout(6000);   // show all (open and closed)
  await page.mouse.move(1000, 600);
  const seen = new Map();
  for (let i = 0; i < 80; i++) {
    const rows = await page.locator('tbody tr').evaluateAll(trs => trs.map(tr => tr.innerText.replace(/\s+/g, ' ').trim()));
    for (const r of rows) if (/Oct 2[12], 2026/.test(r)) seen.set(r, 1);
    if (rows.some(r => /Oct 1\d, 2026|Sep \d+, 2026/.test(r))) break;
    await page.mouse.wheel(0, 700); await page.waitForTimeout(600);
  }
  meta.notes.oct22_rows = [...seen.keys()].filter(r => /Oct 22, 2026/.test(r));
  const cm = page.locator('tr').filter({ hasText: 'CM2-4533' }).first(); await cm.evaluate(e => e.scrollIntoView({ block: 'center' })).catch(() => {}); await page.waitForTimeout(1000);
  await shot('2-testvt1-invoices-cm2-4533', { cm: await box(cm), text: await txt(cm) });
}
} finally { save(); console.log(JSON.stringify({ mode, v: meta.appVersion, browser_zone: meta.browser_zone, process_zone: meta.process_zone, notes: meta.notes }, null, 1).slice(0, 5000)); await browser.close(); }
