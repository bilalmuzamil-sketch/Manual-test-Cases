// The cases, performed through the screen on the QA branch (V2). Each returns {verdict, observed, facts}.
// TODAY is the shop's day (America/Edmonton). Dates named in the cases are worked out from it.
const TODAY = '2026-11-11', YDAY = '2026-11-10', FIRST_LAST_MONTH = '2026-10-01', MID_LAST_MONTH = '2026-10-15', END_NEXT_MONTH = '2026-12-31';
const US = (iso) => { const [y, m, d] = iso.split('-'); return `${m}/${d}/${y}`; };
const addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const C = {};
async function go(x, report) { await x.lib.reportsHome(x.page, x.app); await x.lib.nav(x.page, report); }
const verdict = (checks) => { const bad = checks.filter((c) => !c.ok); return { verdict: bad.length ? 'FAIL' : 'PASS', checks, observed: checks.map((c) => `${c.ok ? 'OK' : 'NOT OK'} ${c.what}: ${c.saw}`).join(' | ') }; };
const chk = (what, ok, saw) => ({ what, ok: !!ok, saw: String(saw) });
async function menuAndTitle(x, items, expectTitles, expectPaths) {
  const { page, lib } = x; await lib.reportsHome(page, x.app);
  const navText = await page.evaluate(() => { const n = document.querySelector('[data-test-id="report_nav_aging_summary_report"]'); let p = n; for (let i = 0; i < 6 && p; i++) p = p.parentElement; return p ? p.innerText.replace(/\s+/g, ' ') : ''; });
  x.ev.push(await lib.shot(page, x.key, 'step 2 reports menu'));
  const checks = [];
  return { navText, checks };
}
C['V1R-01'] = async (x) => {
  const { page, lib } = x; await lib.reportsHome(page, x.app);
  const fin = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').match(/Finance.{0,400}/i)?.[0] || '');
  x.ev.push(await lib.shot(page, x.key, 'step 2 Finance part of the Reports menu'));
  const checks = [chk('Step 2: Accounts Receivable heading under Finance with the three reports', /Accounts Receivable/i.test(fin) && /A\/R Aging Summary.*A\/R Aging Detail.*A\/R Aging Collection/.test(fin), fin.slice(0, 250))];
  for (const [i, nm, p] of [[4, 'A/R Aging Summary', '/reports/ar-aging-summary'], [6, 'A/R Aging Detail', '/reports/ar-aging-detail'], [8, 'A/R Aging Collection', '/reports/ar-aging-collection']]) {
    await lib.nav(page, nm); const t = await lib.title(page); const u = new URL(page.url()).pathname;
    x.ev.push(await lib.shot(page, x.key, `step ${i} ${nm.replace('/', '')}`));
    checks.push(chk(`Step ${i}: title "${nm}", address ends ${p}`, t === nm && u.endsWith(p), `title "${t}", address ${page.url()}`));
  }
  return verdict(checks);
};
C['V1R-02'] = async (x) => {
  const { page, lib } = x; await lib.reportsHome(page, x.app);
  const fin = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').match(/Accounts Payable.{0,200}/i)?.[0] || '');
  x.ev.push(await lib.shot(page, x.key, 'step 2 Accounts Payable heading'));
  const checks = [chk('Step 2: heading lists A/P Aging Summary, A/P Aging Detail, A/P Unpaid Invoices', /A\/P Aging Summary.*A\/P Aging Detail.*A\/P Unpaid Invoices/.test(fin), fin.slice(0, 200))];
  for (const [i, nm, tt, p] of [[4, 'A/P Aging Summary', 'A/P Aging Summary', '/reports/ap-aging-summary'], [6, 'A/P Aging Detail', 'A/P Aging Detail', '/reports/ap-aging-detail'], [8, 'A/P Unpaid Invoices', 'A/P Unpaid Invoices Report', '/reports/ap-unpaid-invoices']]) {
    await lib.nav(page, nm); const t = await lib.title(page); const u = new URL(page.url()).pathname;
    x.ev.push(await lib.shot(page, x.key, `step ${i} ${nm.replace('/', '')}`));
    checks.push(chk(`Step ${i}: title "${tt}", address ends ${p}`, t === tt && u.endsWith(p), `title "${t}", address ${page.url()}`));
  }
  return verdict(checks);
};
C['V1R-05'] = async (x) => {
  const { page, lib } = x; await lib.reportsHome(page, x.app); const checks = [];
  for (const [i, nm] of [[3, 'A/R Aging Summary'], [5, 'A/R Aging Detail'], [7, 'A/R Aging Collection'], [9, 'A/P Aging Summary'], [11, 'A/P Aging Detail'], [13, 'A/P Unpaid Invoices']]) {
    await lib.nav(page, nm); const c = await lib.chip(page, 'asOfDate'); x.ev.push(await lib.shot(page, x.key, `step ${i} ${nm.replace('/', '')} date chip`));
    checks.push(chk(`Step ${i}: ${nm} date chip shows today (${US(TODAY)})`, c && c.includes(US(TODAY)), c));
  }
  return verdict(checks);
};
C['V1R-06'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/P Aging Summary');
  await page.click('[data-test-id="filter_chip_asOfDate"]'); await lib.sleep(800);
  const menu = await page.evaluate(() => { const m = document.querySelector('.q-menu'); return m ? m.innerText.replace(/\s+/g, ' ') : ''; });
  const clearCtl = await page.evaluate(() => { const m = document.querySelector('.q-menu'); return m ? [...m.querySelectorAll('button,a,[role=button]')].map((b) => (b.innerText + ' ' + (b.getAttribute('aria-label') || '')).trim()).filter((t) => /clear|reset|remove|none|cancel/i.test(t)) : []; });
  const chipClear = await page.locator('[data-test-id="filter_chip_clear_asOfDate"]').count();
  x.ev.push(await lib.shot(page, x.key, 'step 4 date menu open'));
  await page.keyboard.press('Escape'); await lib.settle(page, 1000);
  const c = await lib.chip(page, 'asOfDate'); const r = await lib.rows(page); const dataRows = r.filter((z) => /_row_[0-9a-f]{8}-/.test(z.tid));
  x.ev.push(await lib.shot(page, x.key, 'step 5 after closing the date menu'));
  return verdict([chk('Step 4: no way to leave the report without a date', clearCtl.length === 0 && chipClear === 0, `clear-type controls in the menu: ${JSON.stringify(clearCtl)}; clear (x) on the chip: ${chipClear}`),
    chk('Step 5: chip still shows a date and the report shows rows', /\d{2}\/\d{2}\/\d{4}/.test(c || '') && dataRows.length > 0, `chip "${c}", ${dataRows.length} vendor rows`)]);
};
C['V1R-07'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Summary');
  const s = await lib.setDate(page, END_NEXT_MONTH); x.ev.push(await lib.shot(page, x.key, 'step 4 picking the last day of next month'));
  const c = await lib.chip(page, 'asOfDate'); if (await page.locator('.q-menu').count()) await page.keyboard.press('Escape');
  x.ev.push(await lib.shot(page, x.key, 'step 5 date chip'));
  return { ...verdict([chk(`Step 4: ${END_NEXT_MONTH} can be picked`, s.ok, s.ok ? 'picked' : s.why), chk('Step 5: chip shows that future date', c && c.includes(US(END_NEXT_MONTH)), c)]),
    expect_fail_outcome: s.ok ? 'differs' : 'matches the stated symptom (dates after today cannot be picked; chip stays on today)' };
};
C['V1R-08'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/P Aging Summary');
  const u = new URL(page.url()); u.searchParams.set('asOfDate', END_NEXT_MONTH); await page.goto(u.toString(), { waitUntil: 'domcontentloaded' }); await lib.settle(page, 2500);
  const c = await lib.chip(page, 'asOfDate'); x.ev.push(await lib.shot(page, x.key, 'step 5 date chip after opening the link'));
  return { ...verdict([chk(`Step 5: chip shows ${US(END_NEXT_MONTH)}`, c && c.includes(US(END_NEXT_MONTH)), `${c} (address now ${page.url()})`)]), expect_fail_outcome: c && c.includes(US(TODAY)) ? 'matches the stated symptom (opens on today)' : 'differs' };
};
C['V1R-09'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Detail');
  const s = await lib.setDate(page, MID_LAST_MONTH); await page.reload({ waitUntil: 'domcontentloaded' }); await lib.settle(page, 2500);
  const c1 = await lib.chip(page, 'asOfDate'); x.ev.push(await lib.shot(page, x.key, 'step 5 after reload'));
  await lib.nav(page, 'A/R Aging Summary'); await page.goBack({ waitUntil: 'domcontentloaded' }); await lib.settle(page, 2500);
  const c2 = await lib.chip(page, 'asOfDate'); const t = await lib.title(page); x.ev.push(await lib.shot(page, x.key, 'step 8 after browser Back'));
  return verdict([chk('Step 3: date set', s.ok, s.ok ? s.chip : s.why), chk(`Step 5: chip still ${US(MID_LAST_MONTH)}`, c1 && c1.includes(US(MID_LAST_MONTH)), c1),
    chk(`Step 8: A/R Aging Detail back on ${US(MID_LAST_MONTH)}`, t === 'A/R Aging Detail' && c2 && c2.includes(US(MID_LAST_MONTH)), `title "${t}", chip ${c2}`)]);
};
C['V1R-10'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/P Unpaid Invoices');
  const s = await lib.setDate(page, FIRST_LAST_MONTH); await lib.nav(page, 'Inventory Value'); await lib.nav(page, 'A/P Unpaid Invoices');
  const c = await lib.chip(page, 'asOfDate'); x.ev.push(await lib.shot(page, x.key, 'step 6 date chip'));
  return verdict([chk('Step 3: date set', s.ok, s.ok ? s.chip : s.why), chk(`Step 6: chip shows today ${US(TODAY)}`, c && c.includes(US(TODAY)), c)]);
};
C['V1R-33'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/P Aging Summary');
  const s = await lib.setDate(page, '2000-01-01'); const txt = await page.evaluate(() => document.querySelector('main').innerText.replace(/\s+/g, ' '));
  x.ev.push(await lib.shot(page, x.key, 'step 4 message on 1 January 2000'));
  return verdict([chk('Step 3: date set to 01/01/2000', s.ok, s.ok ? s.chip : s.why), chk('Step 4: "No record matches these filters" and "Try changing filters to widen your results."', txt.includes('No record matches these filters') && txt.includes('Try changing filters to widen your results.'), txt.match(/No record.{0,120}|No data.{0,80}/)?.[0] || txt.slice(-200))]);
};
async function detailBuckets(x, report, prefix) {
  const { page, lib } = x; await go(x, report);
  const r = (await lib.rows(page)).filter((z) => /_row_(days_|current)/.test(z.tid) && !z.tid.includes('_transaction_'));
  return r;
}
C['V1R-37'] = async (x) => {
  const r = await detailBuckets(x, 'A/R Aging Detail'); x.ev.push(await x.lib.shot(x.page, x.key, 'step 3 bucket rows'));
  const labels = r.map((z) => z.text.replace('keyboard_arrow_right', '').replace(/ Total.*/, '').trim());
  const want = ['91 or more days past due', '61-90 days past due', '31-60 days past due', '1-30 days past due', 'Current'];
  return verdict([chk('Step 3: five buckets in that order, each with its line count in brackets', labels.length === 5 && labels.every((l, i) => l.startsWith(want[i]) && /\(\d+\)$/.test(l)), JSON.stringify(labels))]);
};
C['V1R-54'] = async (x) => {
  const r = await detailBuckets(x, 'A/P Aging Detail'); x.ev.push(await x.lib.shot(x.page, x.key, 'step 3 bucket rows'));
  const want = ['91 or more days past due', '61-90 days past due', '31-60 days past due', '1-30 days past due', 'Current'];
  const ok = r.length === 5 && r.every((z, i) => z.text.includes(want[i]) && z.text.includes('keyboard_arrow_right') && /\(\d+\)/.test(z.text) && /Total \$[-\d,.]+ \$[-\d,.]+/.test(z.text));
  return verdict([chk('Step 3: five buckets in order, each closed, with (count) and "Total" with Amount and Open Balance', ok, JSON.stringify(r.map((z) => z.text)))]);
};
C['V1R-73'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Summary');
  const lbl = await page.locator('[data-test-id="filter_chip_asOfDate"] .filter-chip__label').innerText().catch(() => '');
  const c = await lib.chip(page, 'asOfDate'); x.ev.push(await lib.shot(page, x.key, 'step 3-4 date chip'));
  await page.click('[data-test-id="filter_chip_asOfDate"]'); await lib.sleep(800);
  const clearCtl = await page.evaluate(() => { const m = document.querySelector('.q-menu'); return m ? [...m.querySelectorAll('button')].map((b) => (b.innerText + ' ' + (b.getAttribute('aria-label') || '')).trim()).filter((t) => /clear|reset|remove|none/i.test(t)) : []; });
  const chipClear = await page.locator('[data-test-id="filter_chip_clear_asOfDate"]').count();
  x.ev.push(await lib.shot(page, x.key, 'step 6 date menu'));
  return verdict([chk('Step 3 (PRD): label "As of"', lbl.trim() === 'As of', lbl), chk(`Step 4: today ${US(TODAY)}`, c && c.includes(US(TODAY)), c),
    chk('Step 6: no way to clear the date', clearCtl.length === 0 && chipClear === 0, `${JSON.stringify(clearCtl)}; chip clear ${chipClear}`)]);
};
module.exports = C; Object.assign(module.exports, { TODAY, YDAY, US, addDays, go, verdict, chk });
// ---------- batch 2: A/R Detail with the seeded records ----------
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const FMT = (iso) => { const [y, m, d] = iso.split('-'); return `${MON[+m - 1]} ${+d}, ${y}`; };
const L0 = () => require('./seeded-qa.json');
const CUST = (k) => require('./manifest.json').customers.find((c) => c.key === k).name;
const VEND = (k) => require('./manifest.json').vendors.find((c) => c.key === k).name;
const num = (key) => { const r = L0()[key]; if (!r) return null; if (r.wo_number) return 'S11315-' + r.wo_number.split('-')[1];
  if (r.type === 'credit_memo' && r.number) return r.number.startsWith('CM-') ? 'CM11315-' + r.number.split('-')[1] : r.number;
  if (r.number && r.number.startsWith('DEP-')) return 'DEP11315-' + r.number.split('-')[1]; return r.number || r.memo; };
const docRows = (rs) => rs.filter((r) => r.tid.includes('_transaction_') || /_row_[0-9a-f]{8}-[0-9a-f-]{27}$/.test(r.tid) && r.cells.type);
async function detailFor(x, report, kind, partyName, date, label) {
  const { page, lib } = x; await go(x, report);
  if (date) { const s = await lib.setDate(page, date); if (!s.ok) throw new Error('date: ' + s.why); }
  const p = await lib.pickParty(page, kind, partyName); if (!p.ok) throw new Error(p.why);
  await lib.openAll(page); const rs = await lib.rows(page);
  x.ev.push(await lib.shot(page, x.key, label)); x.ev.push(lib.saveText(x.key, label + ' rows', rs));
  return { rs, docs: docRows(rs), chip: await lib.chip(page, 'asOfDate') };
}
const find = (docs, n) => docs.find((d) => (d.cells.id || d.text).includes(n));
C['V1R-11'] = async (x) => {
  const D = '2026-10-20', inv = num('doc:R11:inv'), cm = num('doc:R11:cm');
  const a = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R11'), D, `steps 3-6 as of ${D}`);
  const b = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R11'), addDays(D, -1), `steps 7-9 as of ${addDays(D, -1)}`);
  return verdict([chk(`Step 5: invoice ${inv} (created ${D}) listed on ${D}`, find(a.docs, inv), a.docs.map((d) => d.text).join(' / ') || 'no lines'),
    chk(`Step 6: credit memo ${cm} (created ${addDays(D, 1)}) not listed on ${D}`, !find(a.docs, cm), a.docs.map((d) => d.cells.id).join(', ') || 'no lines'),
    chk(`Step 9: invoice not listed on ${addDays(D, -1)}`, !find(b.docs, inv), b.docs.map((d) => d.cells.id).join(', ') || 'no lines')]);
};
C['V1R-13'] = async (x) => {
  const D = '2026-10-10', inv = num('doc:R13:inv');
  const a = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R13'), addDays(D, 2), `step 5 as of D+2 ${addDays(D, 2)}`);
  const b = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R13'), addDays(D, 5), `step 8 as of D+5 ${addDays(D, 5)}`);
  const r1 = find(a.docs, inv), r2 = find(b.docs, inv);
  return verdict([chk('Step 5: Amount $100.00, Open balance $100.00', r1 && r1.cells.amount === '$100.00' && r1.cells.open_balance === '$100.00', r1 ? `${r1.cells.amount} / ${r1.cells.open_balance}` : 'invoice not listed'),
    chk('Step 8: Open balance $60.00', r2 && r2.cells.open_balance === '$60.00', r2 ? r2.cells.open_balance : 'invoice not listed')]);
};
C['V1R-15'] = async (x) => {
  const P = '2026-10-06', mid = '2026-10-20', inv = num('doc:R15:inv');
  const a = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R15'), mid, `step 5 as of ${mid} between P and R`);
  const b = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R15'), TODAY, `step 8 as of R ${TODAY}`);
  const r2 = find(b.docs, inv);
  return { ...verdict([chk(`Step 5: invoice ${inv} not listed on ${mid} (paid ${P})`, !find(a.docs, inv), a.docs.map((d) => d.text).join(' / ') || 'no lines'),
    chk('Step 8: listed on day R with Open balance $100.00', r2 && r2.cells.open_balance === '$100.00', r2 ? r2.text : 'not listed')]), note: `Payment dated ${P}; reversed on ${TODAY} (the app stamps a reversal with the moment it is made, so day R is today, not a past day as the precondition says).` };
};
C['V1R-16'] = async (x) => {
  const mid = '2026-10-25', cm = num('doc:R16:cm');
  const a = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R16'), mid, `step 5 as of ${mid}`);
  const b = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R16'), TODAY, `step 8 as of V ${TODAY}`);
  const r1 = find(a.docs, cm);
  return { ...verdict([chk(`Step 5: credit memo ${cm} listed at $-25.00`, r1 && r1.cells.open_balance === '$-25.00', r1 ? `${r1.cells.amount} / ${r1.cells.open_balance}` : 'not listed: ' + a.docs.map((d) => d.text).join(' / ')),
    chk('Step 8: not listed on day V', !find(b.docs, cm), b.docs.map((d) => d.cells.id).join(', ') || 'no lines')]), note: `Credit memo dated 2026-10-22, voided ${TODAY} (day V = today: a void is stamped with the moment it is made).` };
};
C['V1R-17'] = async (x) => {
  const mid = '2026-10-20', A = '2026-10-27', cm = num('doc:R17:cm');
  const a = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R17'), mid, `step 5 as of ${mid}`);
  const b = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R17'), A, `step 8 as of A ${A}`);
  const r1 = find(a.docs, cm);
  return verdict([chk(`Step 5: ${cm} Open balance $-30.00`, r1 && r1.cells.open_balance === '$-30.00', r1 ? r1.cells.open_balance : 'not listed: ' + a.docs.map((d) => d.text).join(' / ')),
    chk('Step 8: not listed on day A', !find(b.docs, cm), b.docs.map((d) => d.text).join(' / ') || 'no lines')]);
};
C['V1R-18'] = async (x) => {
  const f = num('doc:R18:dep_free'), w = num('doc:R18:dep_wo');
  const a = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R18'), null, 'steps 3-5 every bucket open');
  const r1 = find(a.docs, f);
  return verdict([chk(`Step 4: the $50.00 free deposit ${f} listed at $-50.00`, r1 && r1.cells.open_balance === '$-50.00', r1 ? `${r1.cells.amount} / ${r1.cells.open_balance}` : 'not listed'),
    chk(`Step 5: the $70.00 work order deposit ${w} not listed`, !find(a.docs, w) && !a.docs.some((d) => (d.cells.amount || '').includes('70.00')), a.docs.map((d) => d.text).join(' / '))]);
};
C['V1R-40'] = async (x) => {
  const inv = num('doc:R03:inv'); const a = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R03'), null, 'step 5 the location B invoice line');
  const r = find(a.docs, inv); const c = r ? r.cells : {};
  return verdict([chk('Step 5: date, "Invoice", ID, customer full name, location B, due date, Amount, Open balance', r && c.date === FMT('2026-11-06') && c.type === 'Invoice' && c.id === inv && c.customer_name === CUST('R03') && c.location === 'Staging Lethbridge - 4310' && c.due_date === FMT('2026-11-06') && c.amount === '$33.00' && c.open_balance === '$33.00', r ? JSON.stringify(c) : 'not listed')]);
};
C['V1R-03'] = async (x) => {
  const inv = num('doc:R03:inv'); const loc = await x.page.evaluate(() => 1);
  const a = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R03'), null, 'steps 3-4 location B invoice while working at A');
  const working = await x.page.locator('[data-test-id="profile_menu_button"]').innerText();
  const r = find(a.docs, inv);
  return { ...verdict([chk('Precondition: working at location A (top right)', working.includes('Staging Heavy Duty - 9919'), working.replace(/\s+/g, ' ')),
    chk(`Step 4: location B invoice ${inv} listed with location B on its line`, r && r.cells.location === 'Staging Lethbridge - 4310', r ? JSON.stringify(r.cells) : 'not listed')]), note: 'The invoice was dated 6 Nov 2026 (5 days ago); the precondition says "today". It is open today, which is what the step checks.' };
};
C['V1R-41'] = async (x) => {
  const inv = num('doc:R41:inv'); const a = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R41'), null, 'steps 4-6 partly paid invoice');
  const r = find(a.docs, inv);
  return verdict([chk('Step 5: Amount $250.00', r && r.cells.amount === '$250.00', r ? r.cells.amount : 'not listed'), chk('Step 6: Open balance $150.00', r && r.cells.open_balance === '$150.00', r ? r.cells.open_balance : 'not listed')]);
};
C['V1R-42'] = async (x) => {
  const cm = num('doc:R42:cm'); const a = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R42'), null, 'steps 4-7 credit memo line');
  const r = find(a.docs, cm); const before = x.page.url(); let after = before;
  if (r) { await x.page.locator(`tr[data-test-id="${r.tid}"] [data-test-id$="_cell_id"]`).click(); await x.lib.settle(x.page, 1500); after = x.page.url(); x.ev.push(await x.lib.shot(x.page, x.key, 'step 8 after clicking the ID')); }
  return verdict([chk('Step 5: number with the location prefix (like CM1-4411)', r && /^CM\d+-\d+$/.test(r.cells.id), r ? r.cells.id : 'not listed'),
    chk(`Step 6: due date = day C (${FMT('2026-10-26')})`, r && r.cells.due_date === FMT('2026-10-26'), r ? r.cells.due_date : '-'),
    chk('Step 7: $-5.00 and $-5.00', r && r.cells.amount === '$-5.00' && r.cells.open_balance === '$-5.00', r ? `${r.cells.amount} / ${r.cells.open_balance}` : '-'),
    chk('Step 8: clicking the ID opens nothing', r && !r.link && after === before, r ? `link element: ${JSON.stringify(r.link)}; address before ${before} after ${after}` : '-')]);
};
C['V1R-38'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Detail');
  const row = page.locator('[data-test-id="aging_detail_report_row_current"]'); const t1 = (await row.innerText()).replace(/\s+/g, ' ');
  x.ev.push(await lib.shot(page, x.key, 'step 3 Current closed'));
  await page.click('[data-test-id="button_aging_detail_report_toggle_current"]'); await lib.settle(page, 1500);
  const n = (await lib.rows(page)).filter((r) => r.tid.startsWith('aging_detail_report_row_current_transaction_')).length; x.ev.push(await lib.shot(page, x.key, 'step 5 Current open'));
  await page.click('[data-test-id="button_aging_detail_report_toggle_current"]'); await lib.settle(page, 1000);
  const n2 = (await lib.rows(page)).filter((r) => r.tid.startsWith('aging_detail_report_row_current_transaction_')).length; const t3 = (await row.innerText()).replace(/\s+/g, ' ');
  x.ev.push(await lib.shot(page, x.key, 'step 6 Current closed again'));
  return verdict([chk('Step 3: closed, shows "Total" with Amount and Open balance', t1.includes('keyboard_arrow_right') && /Total \$[-\d,.]+ \$[-\d,.]+/.test(t1), t1), chk('Step 5: its lines are shown', n > 0, `${n} lines`), chk('Step 6: closes again', n2 === 0 && t3.includes('keyboard_arrow_right'), `${n2} lines, ${t3}`)]);
};
C['V1R-39'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Detail');
  await page.click('[data-test-id="button_aging_detail_report_toggle_days_1_to_30"]'); await lib.settle(page, 1500); await lib.scrollAll(page);
  const rs = await lib.rows(page); const i = rs.findIndex((r) => r.tid === 'aging_detail_report_row_days_1_to_30');
  const after = rs.slice(i + 1); const lastDoc = after.map((r) => r.tid.startsWith('aging_detail_report_row_days_1_to_30_transaction_')).lastIndexOf(true);
  const next = after[lastDoc + 1]; const bottom = rs[rs.length - 1]; const head = rs[i];
  x.ev.push(await lib.shot(page, x.key, 'steps 4-5 end of 1-30 bucket and Totals')); x.ev.push(lib.saveText(x.key, 'rows', rs.map((r) => [r.tid, r.text])));
  return { ...verdict([chk('Step 4: "Total for 1-30 days past due" with Amount and Open balance', next && /^Total for 1-30 days past due \$[-\d,.]+ \$[-\d,.]+$/.test(next.text), next ? next.text : 'none'),
    chk('Step 5: "Totals" with Amount and Open balance', bottom && /^Totals \$[-\d,.]+ \$[-\d,.]+$/.test(bottom.text), bottom ? bottom.text : 'none')]), facts: { bucket_header: head && head.text, lines_loaded: lastDoc + 1 } };
};
C['V1R-43'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Detail');
  await page.click('[data-test-id="button_aging_detail_report_toggle_current"]'); await lib.settle(page, 1200);
  const open1 = (await lib.rows(page)).filter((r) => r.tid.includes('_transaction_')).length;
  const s = await lib.setDate(page, YDAY); const rs = await lib.rows(page);
  const heads = rs.filter((r) => /aging_detail_report_row_(days_[0-9a-z_]+|current)$/.test(r.tid));
  x.ev.push(await lib.shot(page, x.key, 'step 5 bucket rows after the date change'));
  return verdict([chk('Step 3: Current opened', open1 > 0, `${open1} lines`), chk('Step 4: date set to yesterday', s.ok, s.ok ? s.chip : s.why),
    chk('Step 5: every bucket closed', heads.length === 5 && heads.every((h) => h.text.includes('keyboard_arrow_right')) && !rs.some((r) => r.tid.includes('_transaction_')), heads.map((h) => h.text.slice(0, 40)).join(' / '))]);
};
C['V1R-25'] = async () => ({ verdict: 'BLOCKED', observed: 'Precondition cannot be set up on QA: an invoice with no due date. Rungs tried: (1) the front end\'s invoice create call (POST /api/invoices/create) - its due date is always computed as the invoice date plus the customer\'s credit term (InvoiceBuilder::getDueDate at 8e35ee0d02), the request\'s due_date is not used; (2) no edit call for an invoice\'s due date exists in app/src/api/billing; (3) the case itself is HELD for this reason (needs a developer data fix). What needs to be done: a developer stores one open invoice with an empty due date on QA, then run this case.' });
module.exports = C; Object.assign(module.exports, { TODAY, YDAY, US, addDays, go, verdict, chk, FMT, num, CUST, VEND, detailFor, find, docRows });
// ---------- batch 3: A/R Summary and Collection ----------
const CID = (k) => L0()[`cust:${k}`].id; const VID = (k) => L0()[`vendor:${k}`].id;
const { execSync } = require('child_process');
const pdfText = (p, layout = true) => execSync(`pdftotext ${layout ? '-layout ' : ''}"${p}" -`).toString();
const pdfInfo = (p) => execSync(`pdfinfo "${p}"`).toString();
async function summaryRow(x, report, kind, key, date, label) {
  const { page, lib } = x; await go(x, report);
  if (date) { const s = await lib.setDate(page, date); if (!s.ok) throw new Error('date: ' + s.why); }
  const name = kind === 'customerIds' ? CUST(key) : VEND(key); const id = kind === 'customerIds' ? CID(key) : VID(key);
  const p = await lib.pickParty(page, kind, name); if (!p.ok) throw new Error(p.why);
  const rs = await lib.rows(page); const r = rs.find((z) => z.tid.endsWith('_row_' + id));
  const msg = await page.evaluate(() => document.querySelector('main').innerText.replace(/\s+/g, ' ')).then((t) => (t.match(/No record matches[^.]*\.?( Try[^.]*\.)?/) || [''])[0]);
  x.ev.push(await lib.shot(page, x.key, label));
  return { r, rs, msg, chip: await lib.chip(page, 'asOfDate') };
}
const BK = ['current', 'days_1_to_30', 'days_31_to_60', 'days_61_to_90', 'days_91_plus'];
const bucketsOf = (r) => Object.fromEntries(BK.map((b) => [b, r ? r.cells[b] : undefined]));
C['V1R-14'] = async (x) => {
  const P = '2026-10-12';
  const a = await summaryRow(x, 'A/R Aging Summary', 'customerIds', 'R14', addDays(P, -1), `step 4 as of the day before P ${addDays(P, -1)}`);
  const b = await summaryRow(x, 'A/R Aging Summary', 'customerIds', 'R14', P, `step 6 as of P ${P}`);
  return verdict([chk('Step 4: customer X listed with the invoice amount $80.00', a.r && a.r.cells.total === '$80.00', a.r ? JSON.stringify(a.r.cells) : 'not listed ' + a.msg),
    chk('Step 6: customer X not listed', !b.r, b.r ? JSON.stringify(b.r.cells) : 'not listed; table says: ' + b.msg)]);
};
C['V1R-22'] = async (x) => {
  const D = '2026-08-01'; const plan = [[4, 0, 'current'], [6, 30, 'days_1_to_30'], [8, 31, 'days_31_to_60'], [10, 60, 'days_31_to_60'], [12, 61, 'days_61_to_90'], [14, 90, 'days_61_to_90'], [16, 91, 'days_91_plus']];
  const { page, lib } = x; await go(x, 'A/R Aging Summary'); const p = await lib.pickParty(page, 'customerIds', CUST('R22')); if (!p.ok) throw new Error(p.why);
  const checks = [];
  for (const [st, off, want] of plan) {
    const dt = addDays(D, off); const s = await lib.setDate(page, dt); const r = (await lib.rows(page)).find((z) => z.tid.endsWith('_row_' + CID('R22')));
    x.ev.push(await lib.shot(page, x.key, `step ${st} as of D+${off} ${dt}`));
    const b = bucketsOf(r); const others = BK.filter((k) => k !== want).every((k) => !b[k]);
    checks.push(chk(`Step ${st} (as of ${dt}): $10.00 under ${want}, Total $10.00`, s.ok && r && b[want] === '$10.00' && others && r.cells.total === '$10.00', r ? JSON.stringify(r.cells) : (s.ok ? 'not listed' : s.why)));
  }
  return verdict(checks);
};
C['V1R-23'] = async (x) => {
  const Cd = '2026-09-15';
  const a = await summaryRow(x, 'A/R Aging Summary', 'customerIds', 'R23', addDays(Cd, 1), `step 4 as of C+1 ${addDays(Cd, 1)}`);
  const b = await summaryRow(x, 'A/R Aging Summary', 'customerIds', 'R23', addDays(Cd, 31), `step 6 as of C+31 ${addDays(Cd, 31)}`);
  const A = bucketsOf(a.r), B = bucketsOf(b.r);
  return verdict([chk('Step 4: $-15.00 under 1-30 Days; nothing under Current', A.days_1_to_30 === '$-15.00' && !A.current, JSON.stringify(a.r ? a.r.cells : 'not listed')),
    chk('Step 6: $-15.00 under 31-60 Days', B.days_31_to_60 === '$-15.00', JSON.stringify(b.r ? b.r.cells : 'not listed'))]);
};
C['V1R-28'] = async (x) => {
  const a = await summaryRow(x, 'A/R Aging Summary', 'customerIds', 'R28', null, 'steps 3-4 credit-only customer');
  return verdict([chk('Step 3: customer X listed', a.r, a.r ? a.r.text : 'not listed ' + a.msg), chk('Step 4: Total $-40.00', a.r && a.r.cells.total === '$-40.00', a.r ? a.r.cells.total : '-')]);
};
C['V1R-29'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Summary');
  const heads = await page.evaluate(() => [...document.querySelectorAll('th[data-test-id^="header_arsum_"], [data-test-id^="header_arsum_"]')].map((h) => h.innerText.replace('arrow_drop_up', '').replace('arrow_drop_down', '').trim()).filter(Boolean));
  x.ev.push(await lib.shot(page, x.key, 'step 3 column headings'));
  const a = await summaryRow(x, 'A/R Aging Summary', 'customerIds', 'R29', null, 'steps 4-5 one-bucket customer');
  const b = bucketsOf(a.r); const empties = BK.filter((k) => k !== 'days_1_to_30');
  const want = ['Customer', 'Location', 'Current', '1-30 Days', '31-60 Days', '61-90 Days', '91 And Over', 'Total'];
  return verdict([chk('Step 3: Customer, (Location, new by design), Current, 1-30 Days, 31-60 Days, 61-90 Days, 91 And Over, Total', JSON.stringify(heads) === JSON.stringify(want), JSON.stringify(heads)),
    chk('Step 5: empty buckets blank, not $0.00', a.r && b.days_1_to_30 === '$100.00' && empties.every((k) => b[k] === ''), a.r ? JSON.stringify(a.r.cells) : 'not listed')]);
};
C['V1R-30'] = async (x) => {
  const a = await summaryRow(x, 'A/R Aging Summary', 'customerIds', 'R30', null, 'steps 3-6 netting customer'); const c = a.r ? a.r.cells : {};
  return verdict([chk('Step 4: Current $50.00', c.current === '$50.00', c.current), chk('Step 5: 1-30 Days $70.00', c.days_1_to_30 === '$70.00', c.days_1_to_30), chk('Step 6: Total $120.00', c.total === '$120.00', c.total)]);
};
C['V1R-31'] = async (x) => {
  const a = await summaryRow(x, 'A/R Aging Summary', 'customerIds', 'R31K', null, 'step 3 amount over 1000');
  const b = await summaryRow(x, 'A/R Aging Summary', 'customerIds', 'R31N', null, 'step 4 negative total');
  return verdict([chk('Step 3: "$1,234.56" form', a.r && a.r.cells.total === '$1,234.56' && a.r.cells.days_1_to_30 === '$1,234.56', a.r ? JSON.stringify(a.r.cells) : 'not listed'),
    chk('Step 4: minus after the dollar sign, "$-12.00"', b.r && b.r.cells.total === '$-12.00', b.r ? b.r.cells.total : 'not listed')]);
};
// Collection helpers
async function collectionFor(x, key, date, label, opts = {}) {
  const { page, lib } = x; await go(x, 'A/R Aging Collection');
  if (date) { const s = await lib.setDate(page, date); if (!s.ok) throw new Error('date: ' + s.why); }
  const p = await lib.pickParty(page, 'customerIds', CUST(key)); if (!p.ok) return { notOffered: p.why };
  const before = await lib.rows(page); const grp = before.find((z) => z.tid === 'aging_collection_report_row_' + CID(key));
  if (grp && !opts.noOpen) { await page.click(`[data-test-id="button_aging_collection_report_toggle_${CID(key)}"]`); await lib.settle(page, 1500); await lib.scrollAll(page); }
  const rs = await lib.rows(page); x.ev.push(await lib.shot(page, x.key, label)); x.ev.push(lib.saveText(x.key, label + ' rows', rs));
  return { grp, rs, docs: docRows(rs), msg: await page.evaluate(() => (document.querySelector('main').innerText.replace(/\s+/g, ' ').match(/No record matches[^.]*\./) || [''])[0]) };
}
C['V1R-19'] = async (x) => {
  const R = TODAY, dep = num('doc:R19:dep_free');
  const a = await collectionFor(x, 'R19', addDays(R, -1), `steps 3-5 as of the day before R ${addDays(R, -1)}`);
  const b = await collectionFor(x, 'R19', R, `steps 6-7 as of R ${R}`);
  const r1 = find(a.docs, dep);
  return { ...verdict([chk(`Step 5: deposit ${dep} listed at $-20.00`, r1 && r1.cells.open_balance === '$-20.00', r1 ? JSON.stringify(r1.cells) : 'not listed: ' + a.docs.map((d) => d.text).join(' / ')),
    chk('Step 7: deposit not listed', !find(b.docs, dep), b.docs.map((d) => d.text).join(' / ') || 'no lines ' + b.msg)]), note: `Deposit dated 2026-10-30; its reversal was stamped ${R} (the app ends a free deposit only by reversing the payment that made it). After the reversal the customer's $5.00 invoice that the payment had paid is open again and is listed on day R; the step checks only that the deposit is gone.` };
};
C['V1R-44'] = async (x) => {
  const a = await collectionFor(x, 'R44', null, 'steps 3-6 customer with two past-due invoices');
  const head = a.grp ? a.grp.text : ''; const name = CUST('R44');
  const tot = a.rs.find((r) => r.text.startsWith('Total for ' + name)); const bottom = a.rs[a.rs.length - 1];
  return verdict([chk('Step 3: name with (2) and "Total" with Amount and Open balance', a.grp && head.includes(name + ' (2)') && /Total \$81\.00 \$81\.00/.test(head), head),
    chk(`Step 5: "Total for ${name}" with the two amounts`, tot && /\$81\.00 \$81\.00$/.test(tot.text), tot ? tot.text : 'none'),
    chk('Step 6: "Totals" with Amount and Open balance', bottom && /^Totals \$[-\d,.]+ \$[-\d,.]+$/.test(bottom.text), bottom ? bottom.text : '-')]);
};
C['V1R-45'] = async (x) => {
  const a = await collectionFor(x, 'R45', null, 'steps 3-4 lines of the four-document customer');
  const ids = a.docs.map((d) => d.cells.id); const [A, B, Cc, cm] = ['invA', 'invB', 'invC', 'cm'].map((k) => num('doc:R45:' + k));
  return verdict([chk(`Step 4: invoice A ${A} (5 days past due) and the credit memo ${cm} listed; B ${B} (due today) and C ${Cc} (not yet due) not`, ids.includes(A) && ids.includes(cm) && !ids.includes(B) && !ids.includes(Cc), JSON.stringify(a.docs.map((d) => [d.cells.id, d.cells.due_date, d.cells.past_due])))]);
};
C['V1R-46'] = async (x) => {
  const a = await collectionFor(x, 'R46', null, 'steps 3-4 credit-only customer'); const cm = num('doc:R46:cm');
  return verdict([chk('Step 3: customer X listed', a.grp, a.grp ? a.grp.text : 'not listed ' + (a.msg || a.notOffered || '')), chk(`Step 4: the credit memo ${cm} is its only line`, a.docs.length === 1 && find(a.docs, cm), a.docs.map((d) => d.text).join(' / '))]);
};
C['V1R-47'] = async (x) => {
  const a = await collectionFor(x, 'R47', null, 'steps 3-4 date column'); const dates = a.docs.map((d) => d.cells.date);
  const want = ['2026-10-13', '2026-10-23', '2026-11-02'].map(FMT);
  return verdict([chk('Step 4: oldest at the top, newest at the bottom', JSON.stringify(dates) === JSON.stringify(want), JSON.stringify(dates))]);
};
C['V1R-48'] = async (x) => {
  const a = await collectionFor(x, 'R48', null, 'steps 3-5 invoice and credit memo lines'); const inv = find(a.docs, num('doc:R48:inv')), cm = find(a.docs, num('doc:R48:cm'));
  const c = inv ? inv.cells : {};
  return verdict([chk('Step 4: date, type "Invoice", ID, location, due date, Past due 12, Amount, Open balance', inv && c.date === FMT('2026-10-30') && c.type === 'Invoice' && c.id === num('doc:R48:inv') && c.location === 'Staging Heavy Duty - 9919' && c.due_date === FMT('2026-10-30') && c.past_due === '12' && c.amount === '$48.00' && c.open_balance === '$48.00', inv ? JSON.stringify(c) : 'not listed'),
    chk('Step 5: credit memo Past due 3', cm && cm.cells.past_due === '3', cm ? JSON.stringify(cm.cells) : 'not listed')]);
};
C['V1R-49'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Collection');
  const p = await lib.pickParty(page, 'customerIds', CUST('R36X')); const g1 = (await lib.rows(page)).filter((r) => /^aging_collection_report_row_[0-9a-f-]{36}$/.test(r.tid));
  x.ev.push(await lib.shot(page, x.key, 'step 6 groups after picking X'));
  await page.reload({ waitUntil: 'domcontentloaded' }); await lib.settle(page, 2500); await page.waitForSelector('tr[data-test-id]', { timeout: 30000 }).catch(() => {});
  const g2 = (await lib.rows(page)).filter((r) => /^aging_collection_report_row_[0-9a-f-]{36}$/.test(r.tid)); x.ev.push(await lib.shot(page, x.key, 'step 8 groups after reload'));
  const only = (g) => g.length === 1 && g[0].tid.endsWith(CID('R36X'));
  return verdict([chk('Step 5: X picked', p.ok, p.ok ? p.chip : p.why), chk('Step 6: only customer X', only(g1), g1.map((g) => g.cells.customer_name).join(', ')), chk('Step 8: still only customer X', only(g2), g2.map((g) => g.cells.customer_name).join(', '))]);
};
async function findGroup(x, report, prefix, id) {
  const { page, lib } = x;
  for (let i = 0; i < 80; i++) { if (await page.locator(`[data-test-id$="_row_${id}"]`).count()) { await page.locator(`[data-test-id$="_row_${id}"]`).first().scrollIntoViewIfNeeded(); return true; }
    const last = page.locator('tr[data-test-id]').last(); await last.scrollIntoViewIfNeeded().catch(() => {}); await page.mouse.wheel(0, 3000); await lib.settle(page, 900); }
  return false;
}
const groupsOpen = async (x, prefix) => (await x.lib.rows(x.page)).filter((r) => r.tid.includes('_transaction_') || (r.cells.type && !/^.*_row_[0-9a-f-]{36}$/.test(r.tid))).length;
C['V1R-50'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Collection'); const X = CID('R36X');
  const found = await findGroup(x, 'A/R Aging Collection', 'aging_collection_report', X); if (!found) throw new Error('customer X group not found by scrolling');
  await page.click(`[data-test-id="button_aging_collection_report_toggle_${X}"]`); await lib.settle(page, 1500);
  const o1 = (await lib.rows(page)).filter((r) => r.tid.includes('_transaction_')).length; x.ev.push(await lib.shot(page, x.key, 'step 3 X group open'));
  const s = await lib.setDate(page, YDAY); const o2 = (await lib.rows(page)).filter((r) => r.tid.includes('_transaction_')).length; x.ev.push(await lib.shot(page, x.key, 'step 5 groups after date change'));
  const found2 = await findGroup(x, 'A/R Aging Collection', 'aging_collection_report', X);
  if (found2) { await page.click(`[data-test-id="button_aging_collection_report_toggle_${X}"]`); await lib.settle(page, 1500); }
  const o3 = (await lib.rows(page)).filter((r) => r.tid.includes('_transaction_')).length;
  const p = await lib.pickParty(page, 'customerIds', CUST('R36Z')); const rs = await lib.rows(page); const o4 = rs.filter((r) => r.tid.includes('_transaction_')).length;
  x.ev.push(await lib.shot(page, x.key, 'step 8 groups after picking Z'));
  return verdict([chk('Step 3: X group opened', o1 > 0, `${o1} lines`), chk('Step 4: date set to yesterday', s.ok, s.ok ? s.chip : s.why), chk('Step 5: all groups closed', o2 === 0, `${o2} document lines shown`),
    chk('Step 6: X group opened again', o3 > 0, `${o3} lines`), chk('Step 7: Z picked', p.ok, p.ok ? p.chip : p.why), chk('Step 8: all groups closed', o4 === 0, `${o4} document lines shown; groups: ${rs.filter((r) => /_row_[0-9a-f-]{36}$/.test(r.tid)).map((r) => r.cells.customer_name).join(', ')}`)]);
};
C['V1R-51'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Collection'); const date0 = await lib.chip(page, 'asOfDate');
  const p = await lib.pickParty(page, 'customerIds', CUST('R51'));
  if (!p.ok) { x.ev.push(await lib.shot(page, x.key, 'step 3 customer not offered')); return { verdict: 'BLOCKED', observed: `The Customer chip does not offer "${CUST('R51')}" (a customer with nothing open), as the case foresees: ${p.why}. What needs to be done: nothing in the build; the case's own note says mark Blocked with this note.` }; }
  const txt = await page.evaluate(() => document.querySelector('main').innerText.replace(/\s+/g, ' ')); const clearBtn = page.getByRole('button', { name: /Clear all filters/i });
  x.ev.push(await lib.shot(page, x.key, 'step 4 message'));
  const hasMsg = txt.includes('No record matches these filters'); const hasBtn = await clearBtn.count();
  if (hasBtn) { await clearBtn.first().click(); await lib.settle(page, 2000); }
  const groups = (await lib.rows(page)).filter((r) => /^aging_collection_report_row_[0-9a-f-]{36}$/.test(r.tid)).length; const date1 = await lib.chip(page, 'asOfDate'); const cchip = await lib.chip(page, 'customerIds');
  x.ev.push(await lib.shot(page, x.key, 'step 6 after Clear all filters'));
  return verdict([chk('Step 4: "No record matches these filters" with a "Clear all filters" button', hasMsg && hasBtn, (txt.match(/No record matches.{0,100}/) || ['no message'])[0] + ` | button: ${hasBtn}`),
    chk('Step 6: every customer with past-due documents listed again, date unchanged', groups > 1 && date1 === date0 && /All customers/.test(cchip || ''), `${groups} customer groups loaded, date ${date1} (was ${date0}), customer chip ${cchip}`)]);
};
C['V1R-88'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Collection'); const tot = async () => (await page.locator('[data-test-id="row_arcol_totals_cell_open_balance"]').innerText().catch(() => '')).trim();
  const t0 = await tot(); x.ev.push(await lib.shot(page, x.key, 'step 3 totals'));
  const p = await lib.pickParty(page, 'customerIds', CUST('R36X')); const g = (await lib.rows(page)).find((r) => r.tid === 'aging_collection_report_row_' + CID('R36X'));
  const t1 = await tot(); x.ev.push(await lib.shot(page, x.key, 'steps 5-6 X picked'));
  await page.locator('[data-test-id="filter_chip_clear_customerIds"]').click().catch(async () => { await page.click('[data-test-id="filter_chip_customerIds"]'); await page.click('[data-test-id="filter_select_all_customerIds"]'); await page.keyboard.press('Escape'); });
  await lib.settle(page, 2000); const t2 = await tot(); x.ev.push(await lib.shot(page, x.key, 'step 8 chip cleared'));
  const gx = g ? g.cells.open_balance : null;
  return verdict([chk('Step 6 (PRD S... "Totals row ... now follows the customer or vendor filter"): Totals equals X\'s Open Balance', gx && t1 === gx, `X ${gx}, Totals ${t1} (before ${t0})`), chk('Step 8: back to the step 3 figure', t2 === t0, `${t2} vs ${t0}`)]);
};
// ---------- batch 4: A/P ----------
C['V1R-12'] = async (x) => {
  const D = '2026-10-20', a = await detailFor(x, 'A/P Aging Detail', 'vendorIds', VEND('P12'), D, `steps 3-6 as of ${D}`);
  const b1 = num('doc:P12:billD'), b2 = num('doc:P12:billD1');
  return verdict([chk(`Step 5: bill ${b1} dated ${D} listed`, find(a.docs, b1), a.docs.map((d) => d.text).join(' / ') || 'no lines'), chk(`Step 6: bill ${b2} dated ${addDays(D, 1)} not listed`, !find(a.docs, b2), a.docs.map((d) => d.cells.id).join(', '))]);
};
C['V1R-20'] = async (x) => {
  const D = '2026-10-12', b = num('doc:P20:bill');
  const a1 = await detailFor(x, 'A/P Aging Detail', 'vendorIds', VEND('P20'), addDays(D, 1), `step 5 as of D+1 ${addDays(D, 1)}`);
  const a2 = await detailFor(x, 'A/P Aging Detail', 'vendorIds', VEND('P20'), addDays(D, 4), `step 8 as of D+4 ${addDays(D, 4)}`);
  const r1 = find(a1.docs, b), r2 = find(a2.docs, b);
  return verdict([chk('Step 5: Open Balance $200.00', r1 && r1.cells.open_balance === '$200.00', r1 ? JSON.stringify(r1.cells) : 'not listed'), chk('Step 8: Open Balance $120.00', r2 && r2.cells.open_balance === '$120.00', r2 ? r2.cells.open_balance : 'not listed')]);
};
const vcRow = (docs, amt) => docs.find((d) => /Credit/i.test(d.cells.type || '') && (d.cells.amount || '').includes(amt));
C['V1R-21'] = async (x) => {
  const mid = '2026-10-25', U = '2026-10-30';
  const a = await detailFor(x, 'A/P Aging Detail', 'vendorIds', VEND('P21'), mid, `step 5 as of ${mid}`);
  const b = await detailFor(x, 'A/P Aging Detail', 'vendorIds', VEND('P21'), U, `step 8 as of U ${U}`);
  const r1 = vcRow(a.docs, '35.00');
  return verdict([chk('Step 5: vendor credit listed at $-35.00', r1 && r1.cells.open_balance === '$-35.00', r1 ? JSON.stringify(r1.cells) : 'not listed: ' + a.docs.map((d) => d.text).join(' / ')), chk('Step 8: not listed on day U', !vcRow(b.docs, '35.00'), b.docs.map((d) => d.text).join(' / ') || 'no lines')]);
};
C['V1R-24'] = async (x) => {
  const Cd = '2026-09-02';
  const a = await summaryRow(x, 'A/P Aging Summary', 'vendorIds', 'P24', addDays(Cd, 1), `step 4 as of C+1 ${addDays(Cd, 1)}`);
  const b = await summaryRow(x, 'A/P Aging Summary', 'vendorIds', 'P24', addDays(Cd, 61), `step 6 as of C+61 ${addDays(Cd, 61)}`);
  const A = bucketsOf(a.r), B = bucketsOf(b.r);
  return verdict([chk('Step 4: $-12.00 under 1-30 Days; nothing under Current', A.days_1_to_30 === '$-12.00' && !A.current, JSON.stringify(a.r ? a.r.cells : 'not listed')), chk('Step 6: $-12.00 under 61-90 Days', B.days_61_to_90 === '$-12.00', JSON.stringify(b.r ? b.r.cells : 'not listed'))]);
};
C['V1R-26'] = async () => ({ verdict: 'BLOCKED', observed: 'Precondition cannot be set up: a received bill with NO due date. Rungs tried: (1) receiving a purchase order through the front end\'s own call (POST /api/inventory/orders/accept) for a vendor on COD - the bill still gets a due date (= its invoice date; bill ZZT-P26-BILL, due Nov 06 2026); (2) a vendor with no payment terms cannot be saved - add-vendor answers 400 "credit_term: Missing required parameter"; (3) the code (CreateTransactionWhenDeliveryIsCreated at 8e35ee0d02) only blanks the due date when CreditTerms::getDueDate returns the very same object, which it never does (it always builds a new one), so no new bill can lack a due date. What needs to be done: a developer stores one unpaid bill with an empty due date on QA, then run this case.' });
C['V1R-27'] = async () => ({ verdict: 'BLOCKED', observed: 'Precondition cannot be set up: a bill paid MORE than its amount. Rung tried: the vendor payment call the front end makes (POST /api/parts-catalogue/vendor/payment/create) paying $110.00 on the $100.00 bill ZZT-P27-BILL answers 400 "Vendor transaction cannot be overpaid." The screen\'s payment dialog uses the same call. What needs to be done: a developer stores one overpaid bill on QA (or names an existing one), then run this case.' });
C['V1R-52'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/P Aging Summary');
  const heads = await page.evaluate(() => [...document.querySelectorAll('[data-test-id^="header_apsum_"]')].map((h) => h.innerText.replace(/arrow_drop_(up|down)/, '').trim()).filter(Boolean));
  x.ev.push(await lib.shot(page, x.key, 'step 3 headings'));
  const a = await summaryRow(x, 'A/P Aging Summary', 'vendorIds', 'P52', null, 'steps 4-5 vendor row'); const c = a.r ? a.r.cells : {};
  return { ...verdict([chk('Step 3: Vendor, (Location), Current, 1-30 Days, 31-60 Days, 61-90 Days, 91 And Over, Total', JSON.stringify(heads) === JSON.stringify(['Vendor', 'Location', 'Current', '1-30 Days', '31-60 Days', '61-90 Days', '91 And Over', 'Total']), JSON.stringify(heads)),
    chk('Step 5: Current $90.00, 31-60 Days $280.00, other buckets blank, Total $370.00', c.current === '$90.00' && c.days_31_to_60 === '$280.00' && !c.days_1_to_30 && !c.days_61_to_90 && !c.days_91_plus && c.total === '$370.00', JSON.stringify(c))]), note: 'Bill $300.00 dated Sep 02 2026 (due Oct 02, 40 days past due), bill $90.00 dated Nov 06 (due Dec 06), vendor credit $20.00 dated Oct 07 (35 days old).' };
};
C['V1R-55'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/P Aging Detail');
  await page.click('[data-test-id="button_ap_aging_detail_report_toggle_current"]'); await lib.settle(page, 1500); await lib.scrollAll(page);
  const rs = await lib.rows(page); const i = rs.findIndex((r) => r.tid.endsWith('_row_current')); const after = rs.slice(i + 1);
  const last = after.map((r) => r.tid.includes('_transaction_')).lastIndexOf(true); const next = after[last + 1]; const bottom = rs[rs.length - 1];
  x.ev.push(await lib.shot(page, x.key, 'steps 5-6 end of Current and Totals'));
  return verdict([chk('Step 5: "Total for Current" with Amount and Open Balance', next && /^Total for Current \$[-\d,.]+ \$[-\d,.]+$/.test(next.text), next ? next.text : 'none'), chk('Step 6: "Totals" with Amount and Open Balance', /^Totals \$[-\d,.]+ \$[-\d,.]+$/.test(bottom.text), bottom.text)]);
};
C['V1R-56'] = async (x) => {
  const b = num('doc:P56:bill'); const a = await detailFor(x, 'A/P Aging Detail', 'vendorIds', VEND('P56'), null, 'step 5 location B bill line'); const r = find(a.docs, b); const c = r ? r.cells : {};
  return verdict([chk('Step 5: date, "Invoice", No., vendor name, location B, due date, Past Due, Amount, Open Balance', r && c.date === FMT('2026-11-05') && c.type === 'Invoice' && c.id === b && c.vendor_name === VEND('P56') && c.location === 'Staging Lethbridge - 4310' && c.due_date === FMT('2026-12-05') && c.past_due === '-24' && c.amount === '$56.00' && c.open_balance === '$56.00', r ? JSON.stringify(c) : 'not listed')]);
};
C['V1R-57'] = async (x) => {
  const b = num('doc:P57:bill'); const a = await detailFor(x, 'A/P Aging Detail', 'vendorIds', VEND('P57'), null, 'steps 3-5 bill due in 9 days'); const r = find(a.docs, b);
  return verdict([chk('Step 5: a negative number of days, about -9', r && /^-(8|9|10)$/.test(r.cells.past_due || ''), r ? JSON.stringify(r.cells) : 'not listed')]);
};
C['V1R-58'] = async (x) => {
  const a = await detailFor(x, 'A/P Aging Detail', 'vendorIds', VEND('P58'), null, 'steps 3-7 vendor credit line'); const r = vcRow(a.docs, '25.00'); const c = r ? r.cells : {};
  return verdict([chk('Step 5: Due Date = the credit\'s own date (Nov 01, 2026)', c.due_date === FMT('2026-11-01') && c.date === FMT('2026-11-01'), JSON.stringify(c)), chk('Step 6: Past Due 10', c.past_due === '10', c.past_due), chk('Step 7: $-25.00 and $-25.00', c.amount === '$-25.00' && c.open_balance === '$-25.00', `${c.amount} / ${c.open_balance}`)]);
};
C['V1R-59'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/P Aging Detail');
  await page.click('[data-test-id="button_ap_aging_detail_report_toggle_current"]'); await lib.settle(page, 1500);
  const o1 = (await lib.rows(page)).filter((r) => r.tid.includes('_transaction_')).length; const s = await lib.setDate(page, YDAY);
  const rs = await lib.rows(page); const heads = rs.filter((r) => /_row_(days_[0-9a-z_]+|current)$/.test(r.tid)); x.ev.push(await lib.shot(page, x.key, 'step 5 buckets after date change'));
  return verdict([chk('Step 3: Current opened', o1 > 0, `${o1} lines`), chk('Step 4: yesterday set', s.ok, s.ok ? s.chip : s.why), chk('Step 5: every bucket closed', heads.length === 5 && heads.every((h) => h.text.includes('keyboard_arrow_right')) && !rs.some((r) => r.tid.includes('_transaction_')), heads.map((h) => h.text.slice(0, 30)).join(' / '))]);
};
// A/P Unpaid Invoices
const isGroup = (r) => /_row_[0-9a-f-]{36}$/.test(r.tid) && !r.tid.includes('_transaction_');
async function unpaidFor(x, key, label, date) {
  const { page, lib } = x; await go(x, 'A/P Unpaid Invoices'); if (date) await lib.setDate(page, date);
  const p = await lib.pickParty(page, 'vendorIds', VEND(key)); if (!p.ok) throw new Error(p.why);
  const id = VID(key); const tg = page.locator(`button[data-test-id$="_toggle_${id}"]`); if (await tg.count()) { await tg.first().click(); await lib.settle(page, 1500); }
  const rs = await lib.rows(page); x.ev.push(await lib.shot(page, x.key, label)); x.ev.push(lib.saveText(x.key, label + ' rows', rs));
  return { rs, docs: docRows(rs), grp: rs.find((r) => r.tid.endsWith('_row_' + id)) };
}
C['V1R-60'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/P Unpaid Invoices');
  const groups = (await lib.rows(page)).filter(isGroup); const names = groups.map((g) => (g.cells.vendor_name || g.text).trim());
  x.ev.push(await lib.shot(page, x.key, 'step 3 vendor groups'));
  const sorted = [...names].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
  const fmt = groups.every((g) => /\(\d+\)/.test(g.text) && /Total \$[-\d,.]+ \$[-\d,.]+/.test(g.text));
  const first = groups[0]; await page.locator(`button[data-test-id$="_toggle_${first.tid.split('_row_').pop()}"]`).first().click(); await lib.settle(page, 1500); await lib.scrollAll(page);
  const rs = await lib.rows(page); const tf = rs.find((r) => r.text.startsWith('Total for ')); const bottom = rs[rs.length - 1];
  x.ev.push(await lib.shot(page, x.key, 'steps 5-6 first vendor open'));
  return verdict([chk('Step 3: vendors A to Z, each with (count) and "Total" with Amount and Open Balance', JSON.stringify(names) === JSON.stringify(sorted) && fmt, names.slice(0, 8).join(' | ') + ` ... (${names.length} loaded)`),
    chk('Step 5: "Total for" + vendor name with the two amounts', tf && tf.text.startsWith('Total for ' + names[0]) && /\$[-\d,.]+ \$[-\d,.]+$/.test(tf.text), tf ? tf.text : 'none'), chk('Step 6: "Totals"', /^Totals/.test(bottom.text), bottom.text)]);
};
C['V1R-61'] = async (x) => {
  const a = await unpaidFor(x, 'P61', 'steps 3-4 vendor lines'); const cur = find(a.docs, num('doc:P61:bill_cur')), late = find(a.docs, num('doc:P61:bill_late')), vc = vcRow(a.docs, '8.00');
  return verdict([chk('Step 4: bill not yet due, past-due bill and vendor credit all listed; the not-yet-due bill shows a negative Past Due', cur && late && vc && /^-\d+$/.test(cur.cells.past_due || ''), JSON.stringify(a.docs.map((d) => [d.cells.id, d.cells.type, d.cells.past_due])))]);
};
C['V1R-62'] = async (x) => {
  const a = await unpaidFor(x, 'P62', 'steps 3-4 date column'); const dates = a.docs.map((d) => d.cells.date);
  return verdict([chk('Step 4: oldest at the top', JSON.stringify(dates) === JSON.stringify(['2026-10-27', '2026-11-01', '2026-11-06'].map(FMT)), JSON.stringify(dates))]);
};
C['V1R-63'] = async (x) => {
  const a = await unpaidFor(x, 'P61', 'steps 3-6 vendor credit line'); const vc = vcRow(a.docs, '8.00'); const c = vc ? vc.cells : {};
  return verdict([chk('Step 5: Due Date "—"', c.due_date === '—', c.due_date), chk('Step 6: Past Due "—"', c.past_due === '—', c.past_due)]);
};
C['V1R-64'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/P Unpaid Invoices'); const p = await lib.pickParty(page, 'vendorIds', VEND('P60A'));
  const g1 = (await lib.rows(page)).filter(isGroup); x.ev.push(await lib.shot(page, x.key, 'step 6 groups'));
  await page.reload({ waitUntil: 'domcontentloaded' }); await lib.settle(page, 2500); await page.waitForSelector('tr[data-test-id]', { timeout: 30000 }).catch(() => {});
  const g2 = (await lib.rows(page)).filter(isGroup); x.ev.push(await lib.shot(page, x.key, 'step 8 groups after reload'));
  const only = (g) => g.length === 1 && g[0].tid.endsWith(VID('P60A'));
  return verdict([chk('Step 5: picked', p.ok, p.ok ? p.chip : p.why), chk('Step 6: only vendor Y', only(g1), g1.map((g) => g.text.slice(0, 40)).join(', ')), chk('Step 8: still only vendor Y', only(g2), g2.map((g) => g.text.slice(0, 40)).join(', '))]);
};
C['V1R-65'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/P Unpaid Invoices');
  const u = new URL(page.url()); u.search = `?vendorName=${encodeURIComponent(VEND('P60A'))}&vendorId=${VID('P60A')}`; await page.goto(u.toString(), { waitUntil: 'domcontentloaded' }); await lib.settle(page, 3000);
  await page.waitForSelector('tr[data-test-id]', { timeout: 30000 }).catch(() => {});
  const g = (await lib.rows(page)).filter(isGroup); const c = await lib.chip(page, 'vendorIds'); x.ev.push(await lib.shot(page, x.key, 'step 5 after opening the saved link'));
  return { ...verdict([chk('Step 5: only vendor Y listed and the Vendor chip names it', g.length === 1 && g[0].tid.endsWith(VID('P60A')) && (c || '').includes('ZZAUTOTEST AP P'), `groups: ${g.map((z) => z.text.slice(0, 40)).join(', ')}; chip: ${c}; address now ${page.url()}`)]), link: u.toString() };
};
C['V1R-66'] = async (x) => {
  const a = await unpaidFor(x, 'P60A', 'steps 3 vendor group open'); const r = find(a.docs, num('doc:P60A:bill'));
  if (!r || !r.link) return { verdict: 'FAIL', observed: 'Step 4: the bill number is not a link: ' + (r ? JSON.stringify(r) : 'bill not listed') };
  await x.page.click(`[data-test-id="${r.link.tid}"]`); await x.lib.settle(x.page, 3000); const t = await x.page.evaluate(() => document.querySelector('main') ? document.querySelector('main').innerText.slice(0, 200).replace(/\s+/g, ' ') : '');
  x.ev.push(await x.lib.shot(x.page, x.key, 'step 4 after clicking the bill No'));
  const delivery = L0()['doc:P60A:bill'].delivery;
  return verdict([chk('Step 4: the delivery page of that bill opens', x.page.url().includes(delivery) || /deliver/i.test(x.page.url()), `address ${x.page.url()} (delivery id ${delivery}); page starts: ${t}`)]);
};
C['V1R-67'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/P Unpaid Invoices'); const Y = VID('P60A');
  const found = await findGroup(x, '', 'ap_unpaid_invoices_report', Y);
  const tg = () => page.locator(`button[data-test-id$="_toggle_${Y}"]`).first();
  if (!(await tg().count())) throw new Error('vendor Y group not found');
  await tg().click(); await lib.settle(page, 1500); const o1 = (await lib.rows(page)).filter((r) => r.tid.includes('_transaction_')).length;
  const s = await lib.setDate(page, YDAY); const o2 = (await lib.rows(page)).filter((r) => r.tid.includes('_transaction_')).length; x.ev.push(await lib.shot(page, x.key, 'step 5 after date change'));
  await findGroup(x, '', 'ap_unpaid_invoices_report', Y); if (await tg().count()) { await tg().click(); await lib.settle(page, 1500); }
  const o3 = (await lib.rows(page)).filter((r) => r.tid.includes('_transaction_')).length;
  const p = await lib.pickParty(page, 'vendorIds', VEND('P60B')); const o4 = (await lib.rows(page)).filter((r) => r.tid.includes('_transaction_')).length; x.ev.push(await lib.shot(page, x.key, 'step 8 after picking W'));
  return verdict([chk('Step 3: Y open', o1 > 0, o1), chk('Step 4: yesterday set', s.ok, s.chip || s.why), chk('Step 5: all groups closed', o2 === 0, `${o2} lines`), chk('Step 6: Y open again', o3 > 0, o3), chk('Step 7: W picked', p.ok, p.chip || p.why), chk('Step 8: all groups closed', o4 === 0, `${o4} lines`)]);
};
