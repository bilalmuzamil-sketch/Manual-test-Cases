// Runs V1R-32 / V1R-53 / V1R-87 through the screen. usage: node run.js <KEY> <env>   (env: qa-tech | qa)
// Writes shots (2x, landscape viewport) + <KEY>-<env>.json with checks, element boxes (2x px) for annotation.
const fs = require('fs'); const path = require('path');
const lib = require('./lib.js');
const OUT = path.resolve(__dirname, '../shots'); fs.mkdirSync(OUT, { recursive: true });
const [KEY, ENVN] = process.argv.slice(2);
const sleep = lib.sleep;
const chk = (what, ok, saw) => ({ what, ok: !!ok, saw: String(saw) });
async function box(page, sel) { const el = page.locator(sel).first(); if (!(await el.count())) return null; const b = await el.boundingBox(); return b ? [Math.round(b.x * 2), Math.round(b.y * 2), Math.round(b.width * 2), Math.round(b.height * 2)] : null; }
async function shot(page, name) { const f = `${KEY} ${ENVN} - ${name}.png`.replace(/[\/:]/g, '-'); await page.screenshot({ path: path.join(OUT, f) }); return f; }
async function marker(page) { return page.evaluate(() => (document.querySelector('meta[name="app-version"]') || {}).content || null); }
async function who(page) { return page.evaluate(() => { try { return JSON.parse(localStorage.getItem('user')).data.details.email; } catch (e) { return null; } }); }
async function partyInfo(page, sel) {
  return page.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const cs = getComputedStyle(e);
    return { tag: e.tagName, tid: e.getAttribute('data-test-id'), text: e.innerText.trim(), href: e.getAttribute('href'), inLink: !!e.closest('a'), color: cs.color, cursor: cs.cursor, textDecoration: cs.textDecorationLine }; }, sel);
}
const C = {};
C['V1R-32'] = async (page, app, R) => {
  await lib.reportsHome(page, app); R.shots.push({ f: await shot(page, 'step 1 Reports menu'), boxes: { nav: await box(page, '[data-test-id="report_nav_aging_summary_report"]') } });
  await lib.nav(page, 'A/R Aging Summary'); const t = await lib.title(page); R.url2 = page.url();
  const first = page.locator('[data-test-id^="text_arsum_party_"], a[data-test-id^="link_arsum_party_"]').first();
  const nLinks = await page.locator('a[data-test-id^="link_arsum_party_"]').count(); const nPlain = await page.locator('[data-test-id^="text_arsum_party_"]').count();
  const tid = await first.getAttribute('data-test-id'); const sel = `[data-test-id="${tid}"]`;
  await first.hover(); await sleep(800); const info = await partyInfo(page, sel);
  R.shots.push({ f: await shot(page, 'step 3 pointing at the first customer name'), boxes: { name: await box(page, sel), title: await box(page, 'main [data-test-id="page_arsum_report"]') } });
  const before = page.url(); await first.click(); await lib.settle(page, 2500); const after = page.url(); const t2 = await lib.title(page);
  R.shots.push({ f: await shot(page, 'step 4 after clicking the customer name'), boxes: { name: await box(page, sel) } });
  R.identity = { customer: info && info.text, customerId: tid && tid.split('_').pop(), linksOnPage: nLinks, plainNamesOnPage: nPlain };
  R.checks = [chk('Step 2: A/R Aging Summary opens', t === 'A/R Aging Summary', `${t} ${R.url2}`),
    chk('Step 3: the name is plain text (not blue)', info && !info.inLink && info.tag !== 'A', JSON.stringify(info) + ` | ${nLinks} customer links, ${nPlain} plain names on the page`),
    chk('Step 4: nothing opens; you stay on A/R Aging Summary', before === after && t2 === 'A/R Aging Summary', `before ${before} after ${after} title ${t2}`)];
};
C['V1R-53'] = async (page, app, R) => {
  await lib.reportsHome(page, app); R.shots.push({ f: await shot(page, 'step 1 Reports menu'), boxes: { nav: await box(page, '[data-test-id="report_nav_ap_aging_summary_report"]') } });
  await lib.nav(page, 'A/P Aging Summary'); const t = await lib.title(page);
  const first = page.locator('a[data-test-id^="link_apsum_party_"], [data-test-id^="text_apsum_party_"]').first();
  const tid = await first.getAttribute('data-test-id'); const sel = `[data-test-id="${tid}"]`; const info = await partyInfo(page, sel);
  const nLinks = await page.locator('a[data-test-id^="link_apsum_party_"]').count(); const nPlain = await page.locator('[data-test-id^="text_apsum_party_"]').count();
  await first.hover(); await sleep(600);
  R.shots.push({ f: await shot(page, 'step 3 the first vendor name'), boxes: { name: await box(page, sel) } });
  await first.click(); await lib.settle(page, 3000); await page.waitForSelector('tr[data-test-id], .q-table__bottom--nodata', { timeout: 30000 }).catch(() => {});
  const t2 = await lib.title(page); const chipV = await lib.chip(page, 'vendorIds'); const u = page.url();
  R.shots.push({ f: await shot(page, 'step 4 page title and Vendor chip'), boxes: { title: await box(page, 'main[data-test-id^="page_"]'), chip: await box(page, '[data-test-id="filter_chip_vendorIds"]') } });
  const rowsTxt = (await lib.rows(page)).slice(0, 6).map((r) => r.text.slice(0, 90));
  R.identity = { vendor: info && info.text, vendorId: tid && tid.split('_').pop(), linksOnPage: nLinks, plainNamesOnPage: nPlain, firstRowsAfter: rowsTxt };
  R.checks = [chk('Step 2: A/P Aging Summary opens', t === 'A/P Aging Summary', t),
    chk('Step 3: the first vendor name is a link that can be clicked', info && (info.tag === 'A' || info.inLink), JSON.stringify(info) + ` | ${nLinks} vendor links, ${nPlain} plain names`),
    chk('Step 4: A/P Unpaid Invoices opens narrowed to that vendor', t2 === 'A/P Unpaid Invoices' && chipV && info && chipV.includes(info.text), `title "${t2}", Vendor chip "${chipV}", address ${u}`)];
};
C['V1R-87'] = async (page, app, R) => {
  const NB = 'ZZAUTOTEST AR R03 Location B', NA = 'ZZAUTOTEST AR R13 Payment After', NC = 'ZZAUTOTEST AR V1R-87 Location C';
  await lib.reportsHome(page, app); await lib.nav(page, 'A/R Aging Detail'); const t = await lib.title(page);
  const opened = await lib.openAll(page); const rs = await lib.rows(page);
  const docs = rs.filter((r) => r.cells && r.cells.type);
  const pick = (n, num) => docs.find((d) => d.text.includes(n) && (!num || d.text.includes(num)));
  const B = pick(NB, '17835'), A = pick(NA, '17834'), Cc = pick(NC);
  fs.writeFileSync(path.join(OUT, `${KEY} ${ENVN} - rows.json`), JSON.stringify({ count: docs.length, B, A, C: Cc, buckets: rs.filter((r) => /_toggle_|_row_(days|current)/.test(r.tid)).map((r) => r.text.slice(0, 60)) }, null, 1));
  R.identity = { lines: docs.length, bucketsOpened: opened, B: B && { text: B.text.slice(0, 160), link: B.link }, A: A && { text: A.text.slice(0, 160), link: A.link }, C: Cc && { text: Cc.text.slice(0, 160), link: Cc.link, plain: Cc.plain } };
  // step 4-6: location B invoice -> prompt -> Cancel
  let dlg = '', btns = [], t6 = '', u6 = '';
  if (B && B.link) {
    await page.locator(`[data-test-id="${B.link.tid}"]`).scrollIntoViewIfNeeded(); await sleep(500);
    R.shots.push({ f: await shot(page, 'step 3 location B invoice listed'), boxes: { b: await box(page, `[data-test-id="${B.link.tid}"]`) } });
    await page.click(`[data-test-id="${B.link.tid}"]`); await sleep(1500);
    dlg = await page.evaluate(() => { const d = document.querySelector('.q-dialog'); return d ? d.innerText.replace(/\s+/g, ' ').trim() : ''; });
    btns = await page.evaluate(() => { const d = document.querySelector('.q-dialog'); return d ? [...d.querySelectorAll('button')].map((b) => (b.innerText || b.getAttribute('aria-label') || '').trim()) : []; });
    R.shots.push({ f: await shot(page, 'step 5 Switch location prompt'), boxes: { dialog: await box(page, '.q-dialog .q-card') } });
    const cancel = page.locator('.q-dialog').getByRole('button', { name: /^Cancel$/ }); if (await cancel.count()) await cancel.click(); await lib.settle(page, 1500);
    t6 = await lib.title(page); u6 = page.url();
  }
  // step 7: point at the location C invoice ID
  let c7 = null;
  if (Cc) {
    const sel = Cc.link ? `[data-test-id="${Cc.link.tid}"]` : null;
    const plainSel = await page.evaluate((n) => { const tr = [...document.querySelectorAll('tr[data-test-id]')].find((r) => r.innerText.includes(n) && r.querySelector('[data-test-id$="_cell_type"], [data-test-id*="_cell_"]'));
      if (!tr) return null; const idCell = tr.querySelector('[data-test-id$="_cell_id"], [data-test-id$="_cell_number"]'); const s = idCell ? idCell.querySelector('[data-test-id]') || idCell : null; return s ? s.getAttribute('data-test-id') : (idCell ? idCell.getAttribute('data-test-id') : null); }, NC);
    const target = sel || (plainSel ? `[data-test-id="${plainSel}"]` : null);
    if (target) { const el = page.locator(target).first(); await el.scrollIntoViewIfNeeded(); await el.hover(); await sleep(800);
      c7 = await partyInfo(page, target); c7.rowText = Cc.text.slice(0, 160); c7.cursorAfterHover = c7.cursor;
      R.shots.push({ f: await shot(page, 'step 7 pointing at the location C invoice ID'), boxes: { c: await box(page, target) } }); }
  }
  // step 8: location A invoice opens directly
  let u8 = '';
  if (A && A.link) { await page.locator(`[data-test-id="${A.link.tid}"]`).scrollIntoViewIfNeeded(); await sleep(400);
    R.shots.push({ f: await shot(page, 'step 8 location A invoice before click'), boxes: { a: await box(page, `[data-test-id="${A.link.tid}"]`) } });
    await page.click(`[data-test-id="${A.link.tid}"]`); await lib.settle(page, 3000); u8 = page.url();
    R.shots.push({ f: await shot(page, 'step 8 location A invoice opened'), boxes: {} }); }
  R.checks = [chk('Step 2: A/R Aging Detail opens', t === 'A/R Aging Detail', t),
    chk('Step 3: every bucket opened; the three invoices are listed', B && A && Cc, `${docs.length} lines; B ${!!B}, A ${!!A}, C ${!!Cc}`),
    chk('Step 5 (PRD S7-R3): "Switch location?" with "This work order is in Staging Lethbridge - 4310. Switch your active location to view it?", Cancel left, Switch location right, close ×', /Switch location\?/.test(dlg) && dlg.includes('This work order is in Staging Lethbridge - 4310. Switch your active location to view it?') && btns.indexOf('Cancel') > -1 && btns.indexOf('Cancel') < btns.indexOf('Switch location'), `${dlg} | buttons ${JSON.stringify(btns)}`),
    chk('Step 6: you stay on the report', t6 === 'A/R Aging Detail', `${t6} ${u6}`),
    chk('Step 7 (PRD S7-R1): the location C invoice ID is plain text', c7 && !c7.inLink && c7.tag !== 'A', JSON.stringify(c7)),
    chk('Step 8: the location A invoice opens its finance page directly', /\/workorders\/[0-9a-f-]+\/finance/.test(u8), u8 || 'no link')];
};
(async () => {
  const x = await lib.open(ENVN); const { page, app, browser } = x;
  const R = { key: KEY, env: ENVN, startUtc: new Date().toISOString(), shots: [] };
  try { await page.goto(app + '/reports', { waitUntil: 'domcontentloaded' }); await lib.settle(page, 1500); R.marker = await marker(page); R.user = await who(page);
    await C[KEY](page, app, R); } catch (e) { R.error = String(e && e.stack || e).slice(0, 800); try { R.shots.push({ f: await shot(page, 'error') }); } catch (e2) {} }
  R.endUtc = new Date().toISOString(); R.markerEnd = await marker(page).catch(() => null);
  fs.writeFileSync(path.join(OUT, `${KEY} ${ENVN}.json`), JSON.stringify(R, null, 1));
  console.log(JSON.stringify({ key: KEY, env: ENVN, user: R.user, marker: R.marker, markerEnd: R.markerEnd, error: R.error, identity: R.identity, checks: R.checks }, null, 1).slice(0, 3500));
  await browser.close();
})();
