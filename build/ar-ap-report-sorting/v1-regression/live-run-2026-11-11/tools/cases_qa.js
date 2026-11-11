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
module.exports._helpers = () => ({ infoIcon, BLOCK_CHART });
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
  const { page, lib } = x; await go(x, 'A/P Unpaid Invoices'); await page.waitForSelector('tr[data-test-id^="ap_unpaid_invoices_report_row_"]', { timeout: 60000 }); await lib.settle(page, 1000);
  const groups = (await lib.rows(page)).filter(isGroup); const names = groups.map((g) => (g.cells.vendor_name || g.text).trim());
  x.ev.push(await lib.shot(page, x.key, 'step 3 vendor groups'));
  const fold = (s) => s.toLowerCase().replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/ß/g, 'ss').normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  const sorted = [...names].sort((a, b) => (fold(a) < fold(b) ? -1 : fold(a) > fold(b) ? 1 : 0)); // A to Z as a reader sees it: letters folded (æ = ae), case ignored
  const fmt = groups.every((g) => /\(\d+\)/.test(g.text) && /Total \$[-\d,.]+ \$[-\d,.]+/.test(g.text));
  const first = groups[0]; await page.locator(`button[data-test-id$="_toggle_${first.tid.split('_row_').pop()}"]`).first().click(); await lib.settle(page, 1500);
  const rs = await lib.rows(page); x.ev.push(lib.saveText(x.key, 'rows after opening the first vendor', rs.slice(0, 60))); const tf = rs.find((r) => r.text.startsWith('Total for ')); const bottom = rs[rs.length - 1];
  x.ev.push(await lib.shot(page, x.key, 'steps 5-6 first vendor open'));
  const bad = names.findIndex((n, i) => n !== sorted[i]);
  const bottomTot = (await lib.rows(page)).find((r) => /^row_apunp_totals/.test(r.tid) || r.text.startsWith('Totals'));
  return verdict([chk('Step 3: vendors A to Z, each with (count) and "Total" with Amount and Open Balance', JSON.stringify(names) === JSON.stringify(sorted) && fmt, (bad >= 0 ? `first out of order at #${bad}: "${names[bad]}" (sorted would be "${sorted[bad]}"); ` : '') + names.join(' | ') + ` (${names.length} loaded); count/total format ok: ${fmt}`),
    chk('Step 5: "Total for" + vendor name with the two amounts', tf && tf.text.startsWith('Total for ' + names[0]) && /\$[-\d,.]+ \$[-\d,.]+$/.test(tf.text), tf ? tf.text : 'none'), chk('Step 6: "Totals"', bottomTot && /^Totals/.test(bottomTot.text), bottomTot ? bottomTot.text : 'none')]);
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
// ---------- batch 5: location switch, info icons, PDFs, planned changes ----------
async function switchLocation(page, lib, name) {
  await page.click('[data-test-id="profile_menu_button"]'); await lib.sleep(1000);
  await page.click('[data-test-id="select_location"]'); await lib.sleep(1000);
  await page.locator('.q-menu .q-item', { hasText: name }).last().click(); await lib.settle(page, 3000);
  const ok = page.getByRole('button', { name: /^(Switch|Confirm|Yes|Change)/i }); if (await ok.count()) { await ok.first().click(); await lib.settle(page, 3000); }
  if (await page.locator('.q-menu').count()) await page.keyboard.press('Escape');
  return (await page.locator('[data-test-id="profile_menu_button"]').innerText()).replace(/\s+/g, ' ');
}
C['V1R-04'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Summary'); const s = await lib.setDate(page, FIRST_LAST_MONTH);
  let now = ''; try { now = await switchLocation(page, lib, 'Staging Lethbridge - 4310'); } finally {}
  await lib.settle(page, 2000); const t = await lib.title(page); const c = await lib.chip(page, 'asOfDate'); x.ev.push(await lib.shot(page, x.key, 'step 5 after switching to location B'));
  const back = await switchLocation(page, lib, 'Staging Heavy Duty - 9919'); x.ev.push(await lib.shot(page, x.key, 'cleanup switched back to location A'));
  return { ...verdict([chk('Step 3: date set', s.ok, s.chip || s.why), chk('Step 4: switched to B', now.includes('Lethbridge'), now), chk(`Step 5: still on A/R Aging Summary, chip ${US(FIRST_LAST_MONTH)}`, t === 'A/R Aging Summary' && (c || '').includes(US(FIRST_LAST_MONTH)), `title "${t}", chip ${c}, address ${page.url()}`)]), cleanup: 'switched back: ' + back };
};
async function infoIcon(x, report, iconSel, label) {
  const { page, lib } = x; await go(x, report); await lib.settle(page, 3000);
  const err = await page.evaluate(() => /Something went wrong loading this section/.test(document.body.innerText));
  if (err) { x.ev.push(await lib.shot(page, x.key, 'section failed to load')); return { blocked: true }; }
  const icon = page.locator(iconSel).first(); if (!(await icon.count())) { x.ev.push(await lib.shot(page, x.key, 'icon not found')); return { missing: true }; }
  const tip = async () => page.evaluate(() => [...document.querySelectorAll('.q-tooltip, .q-menu, [role="tooltip"]')].filter((e) => e.offsetParent !== null || getComputedStyle(e).display !== 'none').map((e) => e.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean).join(' | '));
  const r = {};
  await icon.hover(); await lib.sleep(1200); r.hover = await tip(); x.ev.push(await lib.shot(page, x.key, `${label} pointer on the icon`));
  await page.mouse.move(5, 500); await lib.sleep(1200); r.away = await tip();
  await icon.click(); await lib.sleep(1000); r.click1 = await tip(); x.ev.push(await lib.shot(page, x.key, `${label} after first click`));
  await icon.click(); await lib.sleep(1000); await page.mouse.move(5, 500); await lib.sleep(800); r.click2 = await tip();
  return r;
}
const BLOCK_CHART = 'automation browser cannot load the chart section; needs a person - the screen works on the QA lead\'s device (11 Nov 2026)';
C['V1R-68'] = async (x) => {
  const r = await infoIcon(x, 'Parts Velocity', '[data-test-id*="info"][data-test-id*="units_sold"], th:has-text("Units Sold") i:has-text("info"), [aria-label*="Units Sold"]', 'step 3');
  if (r.blocked) return { verdict: 'BLOCKED', observed: BLOCK_CHART }; if (r.missing) return { verdict: 'BLOCKED', observed: 'Automation could not locate the info icon beside "Units Sold" (one attempt); needs a person.' };
  const { page, lib } = x; let r7 = '', r8 = '';
  let tabs = 0, found = false; await page.evaluate(() => document.activeElement && document.activeElement.blur()); for (let i = 0; i < 200; i++) { tabs++; await page.keyboard.press('Tab'); const f = await page.evaluate(() => { const a = document.activeElement; return a ? (a.getAttribute('aria-label') || '') + ' ' + (a.getAttribute('data-test-id') || '') : ''; }); if (/^Units Sold:|units_sold_info/.test(f.trim()) || /icon_pv_units_sold_info/.test(f)) { found = true; await lib.sleep(900); r7 = await page.evaluate(() => [...document.querySelectorAll('.q-tooltip, [role="tooltip"]')].map((e) => e.innerText.trim()).join(' | ')); break; } }
  await page.keyboard.press('Escape'); await lib.sleep(800); r8 = await page.evaluate(() => [...document.querySelectorAll('.q-tooltip, [role="tooltip"]')].map((e) => e.innerText.trim()).join(' | '));
  const want = 'Units taken out of inventory stock on invoiced work orders in this date range.';
  return verdict([chk('Step 3: explanation appears, starting with the quoted sentence', r.hover.startsWith(want), r.hover), chk('Step 4: disappears', !r.away, r.away || '(nothing)'), chk('Step 5: click shows it', r.click1.startsWith(want), r.click1), chk('Step 6: click again hides it', !r.click2, r.click2 || '(nothing)'), chk('Step 7: Tab focus shows it', r7.startsWith(want), (r7 || '(nothing)') + ` [icon reached by Tab: ${found}, after ${tabs} presses]`), chk('Step 8: Escape hides it', !r8, r8 || '(nothing)')]);
};
C['V1R-69'] = async (x) => {
  const r = await infoIcon(x, 'Technician Utilization', '[aria-label*="Est. Lost Labor"], :text("Est. Lost Labor") >> xpath=.. >> i:has-text("info")', 'step 3');
  if (r.blocked) return { verdict: 'BLOCKED', observed: BLOCK_CHART }; if (r.missing) return { verdict: 'BLOCKED', observed: 'Automation could not locate the Est. Lost Labor info icon (one attempt); needs a person.' };
  return verdict([chk('Step 3: explanation appears', r.hover, r.hover), chk('Step 4: disappears', !r.away, r.away || '(nothing)'), chk('Step 5: click shows it', r.click1, r.click1), chk('Step 6: click again hides it', !r.click2, r.click2 || '(nothing)')]);
};
C['V1R-70'] = async (x) => {
  const r = await infoIcon(x, 'Work In Progress', 'main i:has-text("info_outline"):not([data-test-id^="icon_"]), main [data-test-id*="summary"] i:has-text("info")', 'step 3');
  if (r.blocked) return { verdict: 'BLOCKED', observed: BLOCK_CHART }; if (r.missing) return { verdict: 'BLOCKED', observed: 'Automation could not locate the summary-strip info icon (one attempt); needs a person.' };
  return verdict([chk('Step 3: explanation appears', r.hover, r.hover), chk('Step 4: disappears', !r.away, r.away || '(nothing)'), chk('Step 5: click shows it', r.click1, r.click1), chk('Step 6: click again hides it', !r.click2, r.click2 || '(nothing)')]);
};
async function openOtherLocationLink(x, path, label) {
  const { page, lib } = x; await lib.reportsHome(page, x.app); const before = (await page.locator('[data-test-id="profile_menu_button"]').innerText()).replace(/\s+/g, ' ');
  await page.goto(x.app + path, { waitUntil: 'domcontentloaded' }); await lib.settle(page, 3000);
  const dlg = await page.evaluate(() => { const d = document.querySelector('.q-dialog'); return d ? d.innerText.replace(/\s+/g, ' ').trim() : ''; }); x.ev.push(await lib.shot(page, x.key, `${label} prompt`));
  const cancel = page.locator('.q-dialog').getByRole('button', { name: /^Cancel$/ }); if (await cancel.count()) { await cancel.click(); }
  await lib.sleep(1200); const note = await lib.notices(page); await lib.settle(page, 1500);
  const url = page.url(); x.ev.push(await lib.shot(page, x.key, `${label} after Cancel`));
  const after = (await page.locator('[data-test-id="profile_menu_button"]').innerText()).replace(/\s+/g, ' ');
  return { before, dlg, note: note.join(' | '), url, after };
}
C['V1R-71'] = async (x) => {
  const wo = L0()['doc:R71:wo']; const r = await openOtherLocationLink(x, `/workorders/${wo.wo}?locationId=f8a8b802-7780-4b16-bf10-343caeb616b2`, 'step 2'); // the link a note-mention email carries (useWorkOrderLocationResolver)
  return verdict([chk('Precondition: at location A', r.before.includes('Heavy Duty'), r.before), chk('Step 2: "Switch location?" asking to switch to location B', /Switch location\?/.test(r.dlg) && r.dlg.includes('Staging Lethbridge - 4310'), r.dlg),
    chk('Step 4: on the work order list with "Switch cancelled. Returning to work orders."', /\/workorders\/?(\?|$)/.test(new URL(r.url).pathname + new URL(r.url).search) && r.note.includes('Switch cancelled. Returning to work orders.'), `address ${r.url}; message "${r.note}"; still at ${r.after}`)]);
};
C['V1R-72'] = async (x) => {
  const ps = L0()['doc:R71:ps']; const r = await openOtherLocationLink(x, `/parts/part-sale/${ps.id}?locationId=f8a8b802-7780-4b16-bf10-343caeb616b2`, 'step 2'); // the part sale link carries ?locationId as well
  return verdict([chk('Precondition: at location A', r.before.includes('Heavy Duty'), r.before), chk('Step 2: "Switch location?" with "This part sale is in Staging Lethbridge - 4310. Switch your active location to view it?"', /Switch location\?/.test(r.dlg) && r.dlg.includes('This part sale is in Staging Lethbridge - 4310. Switch your active location to view it?'), r.dlg),
    chk('Step 4: on the part sales list with "Switch canceled. Returning to part sales."', /part-sales/.test(r.url) && r.note.includes('Switch canceled. Returning to part sales.'), `address ${r.url}; message "${r.note}"`)]);
};
// PDFs
C['V1R-34'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Summary'); const f = await lib.exportFile(page, 'arsum', 'pdf', x.key, 'step 4 A-R Summary PDF');
  if (!f.ok) return { verdict: 'FAIL', observed: 'Step 4: no PDF downloaded' };
  const txt = pdfText(f.path); const info = pdfInfo(f.path); const pages = txt.split('\f').filter((p) => p.trim());
  const p1 = pages[0].split('\n').filter((l) => l.trim()); const last = pages[pages.length - 1].split('\n').filter((l) => l.trim());
  const size = (info.match(/Page size:\s+([\d.]+) x ([\d.]+)/) || []).slice(1).map(Number); const nPages = Number((info.match(/Pages:\s+(\d+)/) || [])[1]);
  x.ev.push(lib.saveText(x.key, 'PDF text first and last lines', { info, page1_top: p1.slice(0, 6), page1_bottom: p1.slice(-3), last_page_bottom: last.slice(-4) }));
  // an empty BUCKET printed as $0.00 is what step 8 forbids; a customer whose documents net to a $0.00 Total is a value, not an empty bucket
  const zeroRows = txt.split('\n').filter((l) => !/Totals/.test(l) && /\$0\.00/.test(l.replace(/\s*\(?-?\$[\d,.]+\)?\s*$/, ''))).length;
  return verdict([chk('Step 6: report name, organization name, "As of" with the date', /A\/R Aging Summary/.test(p1.slice(0, 4).join(' ')) && /As of/.test(p1.slice(0, 5).join(' ')), p1.slice(0, 4).join(' / ')),
    chk('Step 7: "Software Powered by ShopView" and "Page 1 of N"; landscape', /Software Powered by ShopView/.test(p1.slice(-3).join(' ')) && new RegExp(`Page 1 of ${nPages}`).test(p1.slice(-3).join(' ')) && size[0] > size[1], `${p1.slice(-2).join(' / ')}; size ${size.join(' x ')}; ${nPages} pages`),
    chk('Step 8: a Totals row last; empty buckets blank', last.some((l) => /^\s*Totals/.test(l)) && zeroRows === 0, `${last.slice(-3).join(' / ')}; customer lines with $0.00: ${zeroRows}`)]);
};
C['V1R-35'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Detail'); const p = await lib.pickParty(page, 'customerIds', CUST('R13'));
  const head = (await lib.rows(page)).find((r) => r.tid === 'aging_detail_report_row_days_61_to_90'); x.ev.push(await lib.shot(page, x.key, 'step 3 empty bucket count'));
  const f = await lib.exportFile(page, 'ardet', 'pdf', x.key, 'step 5 A-R Detail PDF'); const txt = f.ok ? pdfText(f.path) : '';
  x.ev.push(lib.saveText(x.key, 'PDF text', { text: txt.split('\n').filter((l) => l.trim()) }));
  const has = /61-90 days past due/.test(txt); const tot = /Total for 61-90 days past due\s+\$?0\.00/.test(txt.replace(/\s+/g, ' '));
  return { ...verdict([chk('Step 3: bucket shows (0)', head && head.text.includes('61-90 days past due (0)'), head ? head.text : '-'), chk('Step 7: PDF prints the empty bucket heading and "Total for 61-90 days past due" with $0.00', has && tot, has ? 'heading printed' : 'no "61-90 days past due" anywhere in the PDF; buckets printed: ' + (txt.match(/(91 or more|61-90|31-60|1-30) days past due|Current/g) || []).join(', '))]),
    expect_fail_outcome: !has ? 'matches the stated symptom (only buckets holding a document are printed)' : 'differs', note: 'Narrowed with the Customer chip to ZZAUTOTEST AR R13 Payment After, whose only open document sits in 31-60, so four buckets are empty.' };
};
C['V1R-36'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Collection'); const p = await lib.pickParty(page, 'customerIds', CUST('R36X'));
  const f = await lib.exportFile(page, 'arcol', 'pdf', x.key, 'step 5 A-R Collection PDF'); const txt = f.ok ? pdfText(f.path) : '';
  x.ev.push(lib.saveText(x.key, 'PDF text', { text: txt.split('\n').filter((l) => l.trim()) }));
  const others = (txt.match(/ZZAUTOTEST AR R\d+[A-Z]? [A-Za-z ]+/g) || []).filter((n) => !n.startsWith(CUST('R36X')));
  return verdict([chk('Step 7: only customer X, with its lines, "Total for" X and a Totals row', txt.includes(CUST('R36X')) && txt.includes(num('doc:R36X:inv')) && new RegExp('Total for ' + CUST('R36X')).test(txt.replace(/\s+/g, ' ')) && /Totals/.test(txt) && !txt.includes(CUST('R36Z')) && others.length === 0, `customer X present: ${txt.includes(CUST('R36X'))}; Z present: ${txt.includes(CUST('R36Z'))}; other ZZAUTOTEST customers: ${others.join(', ') || 'none'}; lines: ${txt.split('\n').filter((l) => l.trim()).length}`)]);
};
C['V1R-79'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Detail');
  const printer = await page.locator('main i:has-text("print"), main [aria-label*="Print" i]').count();
  await page.click('[data-test-id="btn_dropdown_ardet_export"]'); await lib.sleep(700);
  const items = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item')].map((e) => e.innerText.trim())); const aria = await page.locator('[data-test-id="btn_dropdown_ardet_export"]').getAttribute('aria-label');
  x.ev.push(await lib.shot(page, x.key, 'step 4 Export menu')); await page.keyboard.press('Escape');
  const f = await lib.exportFile(page, 'ardet', 'pdf', x.key, 'step 5 PDF'); const txt = f.ok ? pdfText(f.path) : ''; const p1 = (txt.split('\f')[0] || '').split('\n').filter((l) => l.trim());
  return verdict([chk('Step 3: no printer button', printer === 0, `${printer} printer controls`), chk('Step 4 (PRD): Export menu with "Download (PDF)" and "Download (CSV)" (labelled "Export report")', JSON.stringify(items) === JSON.stringify(['Download (PDF)', 'Download (CSV)']), `${JSON.stringify(items)}; button label: ${aria}`),
    chk('Step 5 (PRD): the PDF downloads as a file', f.ok, f.ok ? f.suggested : 'no download'), chk('Step 7: report name, organization name, "As of"', /A\/R Aging Detail/.test(p1.slice(0, 4).join(' ')) && /As of/.test(p1.slice(0, 5).join(' ')), p1.slice(0, 4).join(' / ')),
    chk('Step 8: "Software Powered by ShopView" and "Page 1 of N"', /Software Powered by ShopView/.test(p1.slice(-3).join(' ')) && /Page 1 of \d+/.test(p1.slice(-3).join(' ')), p1.slice(-2).join(' / '))]);
};
C['V1R-80'] = async (x) => {
  const { page, lib } = x; const a = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R42'), null, 'steps 3-4 credit memo on screen'); const r = find(a.docs, num('doc:R42:cm'));
  const f = await lib.exportFile(page, 'ardet', 'pdf', x.key, 'step 6 PDF'); const txt = f.ok ? pdfText(f.path) : ''; const line = txt.split('\n').find((l) => l.includes(num('doc:R42:cm'))) || '';
  x.ev.push(lib.saveText(x.key, 'PDF credit memo line', { line }));
  return verdict([chk('Step 4: on screen "$-5.00"', r && r.cells.amount === '$-5.00', r ? r.cells.amount : 'not listed'), chk('Step 9 (PRD): in the PDF "(-$5.00)" and date like "Oct 26 2026"', line.includes('(-$5.00)') && line.includes('Oct 26 2026'), line.trim().replace(/\s+/g, ' '))]);
};
C['V1R-81'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Summary'); const n0 = (await lib.rows(page)).length;
  await page.context().setOffline(true); await page.click('[data-test-id="btn_dropdown_arsum_export"]'); await lib.sleep(600);
  let dl = null; page.once('download', (d) => { dl = d; }); await page.click('[data-test-id="action_arsum_export_pdf"]'); await lib.sleep(4000);
  const msgs = await lib.notices(page); x.ev.push(await lib.shot(page, x.key, 'step 6 messages while offline'));
  await page.context().setOffline(false); await lib.sleep(1500); const n1 = (await lib.rows(page)).length; x.ev.push(await lib.shot(page, x.key, 'step 8 report after network back'));
  return verdict([chk('Step 6 (PRD): nothing downloads and exactly one message "We couldn\'t export this report. Please try again."', !dl && msgs.length === 1 && msgs[0].includes("We couldn't export this report. Please try again."), `download: ${!!dl}; messages: ${JSON.stringify(msgs)}`), chk('Step 8: report still on screen with its rows', n1 > 0 && n1 >= n0 - 1, `${n1} rows (before ${n0})`)]);
};
C['V1R-82'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/P Aging Detail'); const heads = (await lib.rows(page)).filter((r) => /_row_(days_[0-9a-z_]+|current)$/.test(r.tid)); const counts = heads.map((h) => Number((h.text.match(/\((\d+)\)/) || [])[1]));
  await page.click('[data-test-id="btn_dropdown_apdet_export"]'); await lib.sleep(600); let dl = null; page.once('download', (d) => { dl = d; });
  await page.click('[data-test-id="action_apdet_export_pdf"]'); const msgs = []; for (let k = 0; k < 30; k++) { for (const m of await lib.notices(page)) if (!msgs.includes(m)) msgs.push(m); if (msgs.length && k > 12) break; await lib.sleep(300); }
  page.removeAllListeners('download'); let dlInfo = null; if (dl) { const f = `${x.key} - step 4 what downloaded.pdf`; await dl.saveAs(require('path').join(lib.EVID, f)); x.ev.push(f); dlInfo = { name: dl.suggestedFilename(), bytes: require('fs').statSync(require('path').join(lib.EVID, f)).size }; try { dlInfo.pages = (pdfInfo(require('path').join(lib.EVID, f)).match(/Pages:\s+(\d+)/) || [])[1]; } catch (e) { dlInfo.pages = 'not a readable PDF'; } } x.ev.push(await lib.shot(page, x.key, 'step 5 PDF message'));
  const csv = await lib.exportFile(page, 'apdet', 'csv', x.key, 'step 7 A-P Detail CSV'); let docRowsN = null, sample = [];
  if (csv.ok) { const lines = require('fs').readFileSync(csv.path, 'utf8').split(/\r?\n/).filter((l) => l.trim()); sample = lines.slice(0, 8); docRowsN = lines.filter((l) => /^\uFEFF?"?(91 or more days past due|\d+-\d+ days past due|Current)"?,/.test(l)).length; }
  x.ev.push(lib.saveText(x.key, 'CSV head and counts', { bucket_counts: counts, sum: counts.reduce((a, b) => a + b, 0), csv_document_rows: docRowsN, first_lines: sample }));
  await lib.nav(page, 'A/R Aging Detail'); const ar = await lib.exportFile(page, 'ardet', 'pdf', x.key, 'step 12 A-R Detail PDF');
  const sum = counts.reduce((a, b) => a + b, 0);
  return { ...verdict([chk('Precondition: A/P Detail over 2,000 lines', sum > 2000, `${counts.join(' + ')} = ${sum}`), chk('Step 5 (PRD): no download and "This report is too large for PDF. Export it as CSV, or narrow the filters, then try again."', !dl && msgs.some((m) => m.includes('This report is too large for PDF. Export it as CSV, or narrow the filters, then try again.')), `download: ${JSON.stringify(dlInfo)}; messages ${JSON.stringify(msgs)}`),
    chk('Step 9: CSV has one row per document = sum of bucket counts', docRowsN === sum, `CSV document rows ${docRowsN} vs ${sum}`), chk('Step 12: A/R Detail (under 2,000 lines) still gives a PDF', ar.ok, ar.ok ? ar.suggested : 'no download')]), facts: { counts } };
};
C['V1R-83'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Summary'); const s = await lib.setDate(page, MID_LAST_MONTH);
  const f = await lib.exportFile(page, 'arsum', 'pdf', x.key, 'step 5 PDF'); const p1 = f.ok ? pdfText(f.path).split('\n').filter((l) => l.trim()).slice(0, 6) : [];
  x.ev.push(lib.saveText(x.key, 'PDF heading', { p1 }));
  return verdict([chk('Step 3: date set', s.ok, s.chip || s.why), chk('Step 7 (PRD): "As of Oct 15, 2026" under the report and organization names', p1.some((l) => /As of Oct 15, 2026/.test(l)) && !p1.some((l) => /Oct 16, 2026/.test(l)), p1.join(' / '))]);
};
C['V1R-84'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Detail'); const head = page.locator('[data-test-id="aging_detail_report_row_days_1_to_30"]'); const count = Number(((await head.innerText()).match(/\((\d+)\)/) || [])[1]);
  await page.click('[data-test-id="button_aging_detail_report_toggle_days_1_to_30"]'); await lib.settle(page, 2000);
  const first = (await lib.rows(page)).filter((r) => r.tid.startsWith('aging_detail_report_row_days_1_to_30_transaction_')).length; x.ev.push(await lib.shot(page, x.key, 'step 5 first load'));
  const seen = new Set(); let tf = null;
  for (let i = 0; i < 40; i++) { const rs = await lib.rows(page); rs.filter((r) => r.tid.startsWith('aging_detail_report_row_days_1_to_30_transaction_')).forEach((r) => seen.add(r.tid)); tf = rs.find((r) => r.text.startsWith('Total for 1-30 days past due')) || tf; if (tf && seen.size >= count) break; await page.locator('tr[data-test-id]').last().scrollIntoViewIfNeeded().catch(() => {}); await page.mouse.wheel(0, 4000); await lib.settle(page, 900); }
  x.ev.push(await lib.shot(page, x.key, 'step 8 end of bucket'));
  return verdict([chk('Step 3: count in brackets', count > 100, count), chk('Step 5 (PRD): 100 lines first', first === 100, first), chk('Step 7: every line there, total = count', seen.size === count, `${seen.size} distinct lines seen`), chk('Step 8: "Total for" the bucket with Amount and Open balance', tf && /\$[-\d,.]+ \$[-\d,.]+$/.test(tf.text), tf ? tf.text : 'none')]);
};
C['V1R-85'] = async (x) => {
  const a1 = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R13'), null, 'step 4 invoice type'); const a2 = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R42'), null, 'step 5 credit memo type');
  const a3 = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R18'), null, 'step 6 deposit type'); const b = await detailFor(x, 'A/P Aging Detail', 'vendorIds', VEND('P93'), null, 'steps 9-10 bill and vendor credit types');
  const t = (docs, n) => { const r = find(docs, n); return r ? r.cells.type : 'not listed'; }; const bill = t(b.docs, num('doc:P93:bill')); const vc = (b.docs.find((d) => d.cells.id && d.cells.id.startsWith('C-')) || { cells: {} }).cells.type;
  return verdict([chk('Step 4: "Invoice"', t(a1.docs, num('doc:R13:inv')) === 'Invoice', t(a1.docs, num('doc:R13:inv'))), chk('Step 5 (PRD): "Credit Memo"', t(a2.docs, num('doc:R42:cm')) === 'Credit Memo', t(a2.docs, num('doc:R42:cm'))), chk('Step 6 (PRD): "Deposit"', t(a3.docs, num('doc:R18:dep_free')) === 'Deposit', t(a3.docs, num('doc:R18:dep_free'))), chk('Step 9: "Invoice"', bill === 'Invoice', bill), chk('Step 10 (PRD): "Vendor Credit"', vc === 'Vendor Credit', vc)]);
};
C['V1R-86'] = async (x) => {
  const a = await collectionFor(x, 'R74', null, 'steps 3-5 dates'); const cm = find(a.docs, num('doc:R74:cm_today')), inv = find(a.docs, num('doc:R74:inv'));
  return verdict([chk('Step 4 (PRD): today written out "Nov 11, 2026", not "Today"', cm && cm.cells.date === 'Nov 11, 2026', cm ? cm.cells.date : 'not listed'), chk('Step 5: older date "Nov 1, 2026"', inv && inv.cells.date === 'Nov 1, 2026', inv ? inv.cells.date : 'not listed')]);
};
C['V1R-74'] = async (x) => {
  const a = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R74'), null, 'steps 3-6 two credit memos'); const t8 = find(a.docs, num('doc:R74:cm_today')), t6 = find(a.docs, num('doc:R74:cm_yday'));
  const c = await collectionFor(x, 'R74', null, 'steps 7-9 collection'); const c8 = find(c.docs, num('doc:R74:cm_today'));
  return verdict([chk('Step 4 (PRD S1-R5a): the $8.00 credit memo dated today is under Current', t8 && t8.tid.includes('_row_current_'), t8 ? t8.tid.split('_transaction_')[0] : 'not listed'), chk('Step 6: the $6.00 credit memo dated yesterday is under 1-30 days past due', t6 && t6.tid.includes('_row_days_1_to_30_'), t6 ? t6.tid.split('_transaction_')[0] : 'not listed'), chk('Step 9: Past Due of the $8.00 credit memo is 0', c8 && c8.cells.past_due === '0', c8 ? c8.cells.past_due : 'not listed')]);
};
C['V1R-75'] = async (x) => {
  const a = await detailFor(x, 'A/P Aging Detail', 'vendorIds', VEND('P75'), null, 'steps 3-7 two vendor credits'); const v9 = vcRow(a.docs, '9.00'), v4 = vcRow(a.docs, '4.00');
  return { ...verdict([chk('Step 4 (PRD S1-R5a): the $9.00 vendor credit dated today is under Current', v9 && v9.tid.includes('_row_current_'), v9 ? v9.tid.split('_transaction_')[0] : 'not listed'), chk('Step 5: Past Due 0', v9 && v9.cells.past_due === '0', v9 ? v9.cells.past_due : '-'), chk('Step 7: the $4.00 credit dated yesterday under 1-30 days past due', v4 && v4.tid.includes('_row_days_1_to_30_'), v4 ? v4.tid.split('_transaction_')[0] : 'not listed')]), note: 'Run before 18:00Z: an extra $9.00 credit made at 18:00Z today (retired, see SEEDED.md) only appears after that time.' };
};
C['V1R-76'] = async () => ({ verdict: 'BLOCKED', observed: 'Precondition cannot be set up: an invoice paid MORE than its amount. Rung tried: the payment call the front end makes (POST /api/customer-account/create-customer-payment) applying $120.00 to the $100.00 invoice of ZZAUTOTEST AR R76 Overpaid answers 400 "Transaction cannot be overpaid." Paying more than an invoice in the app instead makes a separate deposit for the excess (proved on R18/R19), which is not an overpaid invoice. What needs to be done: a developer stores one overpaid invoice on QA (or names an existing one), then run this case.' });
C['V1R-77'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Summary'); const first = (await lib.rows(page)).find((r) => /^aging_summary_report_row_[0-9a-f-]{36}$/.test(r.tid));
  await page.click(`[data-test-id="${first.tid}_cell_total"]`); await lib.settle(page, 1500); const t1 = await lib.title(page); x.ev.push(await lib.shot(page, x.key, 'step 4 after clicking the Total amount'));
  await page.click(`[data-test-id="${first.tid}_cell_customer_name"] a, [data-test-id^="link_arsum_party_"]`); await lib.settle(page, 2500); const t2 = await lib.title(page); const cc = await lib.chip(page, 'customerIds');
  x.ev.push(await lib.shot(page, x.key, 'step 6 after clicking the customer name'));
  return verdict([chk('Step 4 (PRD): still on A/R Aging Summary', t1 === 'A/R Aging Summary', t1), chk('Step 6: A/R Aging Collection open, narrowed to that customer', t2 === 'A/R Aging Collection' && (cc || '').includes(first.cells.customer_name.slice(0, 10)), `title "${t2}", chip ${cc} (row customer ${first.cells.customer_name})`)]);
};
C['V1R-78'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Summary'); const s = await lib.setDate(page, FIRST_LAST_MONTH); await lib.pickParty(page, 'customerIds', CUST('R22'));
  await page.click(`[data-test-id="link_arsum_party_${CID('R22')}"]`); await lib.settle(page, 2500);
  const t = await lib.title(page), c = await lib.chip(page, 'asOfDate'), cc = await lib.chip(page, 'customerIds'); x.ev.push(await lib.shot(page, x.key, 'steps 5-7 after clicking the customer'));
  return { ...verdict([chk('Step 3: date set', s.ok, s.chip || s.why), chk('Step 5: A/R Aging Collection open', t === 'A/R Aging Collection', t), chk(`Step 6 (PRD): date chip ${US(FIRST_LAST_MONTH)}`, (c || '').includes(US(FIRST_LAST_MONTH)), c), chk('Step 7: Customer chip names customer X', (cc || '').includes('ZZAUTOTEST AR R'), `${cc} (address ${page.url()})`)]), note: 'Customer X found on A/R Summary by first ticking it in the Customer chip (the long list loads 30 at a time).' };
};
C['V1R-87'] = async (x) => {
  const { page, lib } = x; const a = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R03'), null, 'step 3 location B invoice');
  const r = find(a.docs, num('doc:R03:inv')); let dlg = '', url1 = '', t1 = '';
  if (r && r.link) { await page.click(`[data-test-id="${r.link.tid}"]`); await lib.sleep(1500); dlg = await page.evaluate(() => { const d = document.querySelector('.q-dialog'); return d ? d.innerText.replace(/\s+/g, ' ').trim() : ''; }); x.ev.push(await lib.shot(page, x.key, 'step 5 prompt'));
    const btns = await page.evaluate(() => { const d = document.querySelector('.q-dialog'); return d ? [...d.querySelectorAll('button')].map((b) => (b.innerText || b.getAttribute('aria-label') || '').trim()) : []; }); dlg += ' | buttons: ' + JSON.stringify(btns);
    const cancel = page.locator('.q-dialog').getByRole('button', { name: /^Cancel$/ }); if (await cancel.count()) await cancel.click(); await lib.settle(page, 1500); url1 = page.url(); t1 = await lib.title(page); }
  const b = await detailFor(x, 'A/R Aging Detail', 'customerIds', CUST('R13'), null, 'step 8 location A invoice'); const ra = find(b.docs, num('doc:R13:inv')); let url2 = '';
  if (ra && ra.link) { await page.click(`[data-test-id="${ra.link.tid}"]`); await lib.settle(page, 3000); url2 = page.url(); x.ev.push(await lib.shot(page, x.key, 'step 8 location A invoice opened')); }
  const steps = [chk('Step 5 (PRD S7-R3): "Switch location?" with "This work order is in Staging Lethbridge - 4310. Switch your active location to view it?", Cancel left, Switch location right, close ×', /Switch location\?/.test(dlg) && dlg.includes('This work order is in Staging Lethbridge - 4310. Switch your active location to view it?') && /"Cancel".*"Switch location"/.test(dlg), dlg || (r ? 'no prompt; link ' + JSON.stringify(r.link) : 'invoice not listed')),
    chk('Step 6: you stay on the report', t1 === 'A/R Aging Detail', `${t1} ${url1}`), chk('Step 8: the location A invoice opens its finance page directly', /\/workorders\/[0-9a-f-]+\/finance/.test(url2), url2 || 'no link')];
  const v = verdict(steps);
  return { ...v, verdict: v.verdict === 'FAIL' ? 'FAIL' : 'BLOCKED', observed: v.observed + ' | NOT RUN Step 7: the organization has no location C (only Staging Heavy Duty - 9919 and Staging Lethbridge - 4310 hold A/R documents, both enrolled), so the plain-text rule for a non-enrolled location cannot be observed. What needs to be done: give the QA organization a third location the test user is not enrolled in, with one open invoice.' };
};
C['V1R-89'] = async (x) => {
  const a = await unpaidFor(x, 'P62', 'step 3 vendor group open'); const { page, lib } = x; const before = a.docs.map((d) => d.cells.id);
  await page.click('[data-test-id="header_apunp_amount"]').catch(async () => { await page.locator('th', { hasText: 'Amount' }).first().click(); }); await lib.settle(page, 2000);
  const after = docRows(await lib.rows(page)).map((d) => d.cells.id + ' ' + d.cells.amount); x.ev.push(await lib.shot(page, x.key, 'step 5 after sorting by Amount'));
  const s = await lib.setDate(page, YDAY); const n = docRows(await lib.rows(page)).length; x.ev.push(await lib.shot(page, x.key, 'step 7 after date change'));
  return verdict([chk('Step 5 (PRD): vendor Y still open, lines in the new order', after.length === 3, `before ${JSON.stringify(before)}; after ${JSON.stringify(after)}`), chk('Step 7: changing the date closes every group', s.ok && n === 0, `${n} lines`)]);
};
C['V1R-90'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Collection'); await lib.pickParty(page, 'customerIds', CUST('R90')); const id = CID('R90');
  const g = (await lib.rows(page)).find((r) => r.tid === 'aging_collection_report_row_' + id); const count = Number(((g || {}).text || '').match(/\((\d+)\)/)?.[1]);
  await page.click(`[data-test-id="button_aging_collection_report_toggle_${id}"]`); await lib.settle(page, 2000); const first = docRows(await lib.rows(page)).length; x.ev.push(await lib.shot(page, x.key, 'step 5 first load'));
  const seen = new Set(); let tf = null;
  for (let i = 0; i < 25; i++) { const rs = await lib.rows(page); docRows(rs).forEach((r) => seen.add(r.tid)); tf = rs.find((r) => r.text.startsWith('Total for ' + CUST('R90'))) || tf; if (tf && seen.size >= count) break; await page.locator('tr[data-test-id]').last().scrollIntoViewIfNeeded().catch(() => {}); await page.mouse.wheel(0, 4000); await lib.settle(page, 900); }
  x.ev.push(await lib.shot(page, x.key, 'step 8 end of group'));
  return verdict([chk('Step 3: full count in brackets (101 seeded)', count === 101, count), chk('Step 5 (PRD S1-R8): first 100 documents', first === 100, first), chk('Step 7: every line there', seen.size === count, seen.size), chk('Step 8: "Total for" X covers every line ($-101.00)', tf && tf.text.includes('$-101.00'), tf ? tf.text : 'none')]);
};
C['V1R-91'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/P Aging Summary'); const heads = await page.evaluate(() => [...document.querySelectorAll('[data-test-id^="header_apsum_"]')].map((h) => h.innerText.replace(/arrow_drop_(up|down)/, '').trim()));
  const f = await lib.exportFile(page, 'apsum', 'pdf', x.key, 'step 5 A-P Summary PDF'); const lines = f.ok ? pdfText(f.path).split('\n').filter((l) => l.trim()) : [];
  const hl = lines.find((l) => /Vendor/.test(l) && /Current/.test(l)) || ''; x.ev.push(lib.saveText(x.key, 'PDF lines', { heading: hl, last: lines.slice(-4) }));
  const lastRow = lines.filter((l) => !/Software Powered|Page \d+ of/.test(l)).pop() || '';
  return verdict([chk('Step 3: Vendor, Current, 1-30 Days, 31-60 Days, 61-90 Days, 91 And Over, Total (Location new by design)', JSON.stringify(heads.filter((h) => h !== 'Location')) === JSON.stringify(['Vendor', 'Current', '1-30 Days', '31-60 Days', '61-90 Days', '91 And Over', 'Total']), JSON.stringify(heads)),
    chk('Step 5 (PRD): a PDF downloads', f.ok, f.ok ? f.suggested : 'no download'), chk('Step 7: same headings as the screen', heads.every((h) => hl.includes(h)), hl.trim().replace(/\s+/g, ' ')), chk('Step 8: a Totals row', /^\s*Totals/.test(lastRow), lastRow.trim())]);
};
C['V1R-92'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/P Aging Detail'); const heads = (await lib.rows(page)).filter((r) => /_row_(days_[0-9a-z_]+|current)$/.test(r.tid)).map((h) => h.text.replace('keyboard_arrow_right', '').replace(/ \(.*/, '').trim());
  await page.click('[data-test-id="button_ap_aging_detail_report_toggle_days_1_to_30"]'); await lib.settle(page, 2500);
  const names = docRows(await lib.rows(page)).map((d) => d.cells.vendor_name); x.ev.push(await lib.shot(page, x.key, 'step 5 vendor names'));
  const fold = (s) => s.toLowerCase().replace(/æ/g, 'ae').normalize('NFKD').replace(/[̀-ͯ]/g, ''); const az = names.every((n, i) => i === 0 || fold(names[i - 1]) <= fold(n));
  await page.click('[data-test-id="header_apdet_past_due"]'); await lib.settle(page, 2500);
  const pd = docRows(await lib.rows(page)).filter((d) => d.tid.includes('_days_1_to_30_')).map((d) => Number(d.cells.past_due)); x.ev.push(await lib.shot(page, x.key, 'step 7 after clicking Past Due'));
  const desc = pd.every((v, i) => i === 0 || pd[i - 1] >= v);
  return verdict([chk('Step 3: five buckets in fixed order', JSON.stringify(heads) === JSON.stringify(['91 or more days past due', '61-90 days past due', '31-60 days past due', '1-30 days past due', 'Current']), JSON.stringify(heads)),
    chk('Step 5 (PRD): vendors A to Z inside the bucket', az && new Set(names).size > 1, `${names.length} lines, ${new Set(names).size} vendors; first: ${names.slice(0, 5).join(' | ')}`), chk('Step 7 (PRD S2-R4): Past Due largest first', desc && pd.length > 1, pd.slice(0, 10).join(', '))]);
};
C['V1R-93'] = async (x) => {
  const { page, lib } = x; const a = await detailFor(x, 'A/P Aging Detail', 'vendorIds', VEND('P93'), null, 'step 3 every bucket');
  const ret = a.docs.find((d) => (d.cells.amount || '').includes('13.00')), dir = a.docs.find((d) => (d.cells.amount || '').includes('7.00')), bill = find(a.docs, num('doc:P93:bill'));
  let u1 = '', u2 = '';
  if (ret && ret.link) { await page.click(`[data-test-id="${ret.link.tid}"]`); await lib.settle(page, 3000); u1 = page.url(); x.ev.push(await lib.shot(page, x.key, 'step 4 vendor return opened')); await page.goBack(); await lib.settle(page, 2500); }
  await lib.openAll(page); const docs2 = docRows(await lib.rows(page)); const bill2 = find(docs2, num('doc:P93:bill'));
  if (bill2 && bill2.link) { await page.click(`[data-test-id="${bill2.link.tid}"]`); await lib.settle(page, 3000); u2 = page.url(); x.ev.push(await lib.shot(page, x.key, 'step 7 bill opened')); }
  return verdict([chk('Step 4 (PRD S7-R9): the return credit number opens the vendor return', ret && ret.link && /return/i.test(u1), ret ? `${JSON.stringify(ret.link)} -> ${u1}` : 'credit not listed'), chk('Step 6: the credit not from a return is plain text', dir && !dir.link, dir ? JSON.stringify({ link: dir.link, plain: dir.plain }) : 'not listed'), chk('Step 7: the bill opens its delivery page', /deliver/i.test(u2), u2 || 'no link')]);
};
C['V1R-32'] = async () => ({ verdict: 'BLOCKED', observed: 'Needs a second user whose role has Reports page access but no Customers View. The only session available is the QA lead\'s own Admin session, and signing in as anyone else would mean calling the login endpoint on QA, which this run must never do (it ends the shared SSO session). What needs to be done: the QA lead (or a dedicated test login) signs in with such a role and runs steps 1-4.' });
C['V1R-53'] = async () => ({ verdict: 'BLOCKED', observed: 'Needs a second user whose role has only Reports page access (no Vendor Order Management, Customers or Invoicing). Same reason as V1R-32: only the QA lead\'s Admin session is available and signing in as another user is not allowed on QA. What needs to be done: run with such a role.' });
