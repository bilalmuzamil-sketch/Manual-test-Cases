// r1_reg.mjs — 11 Nov 2026: regression tests C1078974–C1078983 (menu entries and titles, every location listed, location switch keeps the
// report and date, opens on today, date cannot be emptied, future date in the menu (EXPECT FAIL per case), future date in a saved link (EXPECT
// FAIL per case), date survives reload and Back, reopened from the menu starts on today). Left-menu clicks only, as the steps say.
// Output exec/r1/<id>.json + pictures. ONLY=<ids>.
import { start, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./r1/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const F = mkFilt(p);
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
const nav = async (label) => { await p.locator('aside, .q-drawer, nav').getByText(label, { exact: true }).first().click(); await p.waitForTimeout(3500); };
const title = async () => (await p.locator('main').locator('h1, h2, h3, .text-h5, .text-h6, [class*=title]').first().innerText().catch(() => '')).trim();
const chipDate = async () => ((await F.chips()).find((c) => /As of:/.test(c)) || '').replace(/^.*As of:\s*/, '').replace(/\s*keyboard.*$/, '');
const shot = async (o, n) => { const f = await s.shot(o.id + '-' + n); (o.shots ||= []).push(f); return f; };
const navText = async () => (await p.locator('aside, .q-drawer').first().innerText().catch(() => '')).replace(/\n+/g, ' | ');
const T = {};
T.C1078974 = async (o) => { await s.go('/reports'); await p.waitForTimeout(3000); o.nav = await navText(); await shot(o, '2-menu');
  for (const [lab, path] of [['A/R Aging Summary', 'ar-aging-summary'], ['A/R Aging Detail', 'ar-aging-detail'], ['A/R Aging Collection', 'ar-aging-collection']]) { await nav(lab); (o.pages ||= []).push({ lab, title: await title(), url: p.url(), endsOk: p.url().split('?')[0].endsWith('/reports/' + path) }); await shot(o, lab.replace(/\W+/g, '')); } };
T.C1078975 = async (o) => { await s.go('/reports'); await p.waitForTimeout(3000); o.nav = await navText(); await shot(o, '2-menu');
  for (const [lab, path] of [['A/P Aging Summary', 'ap-aging-summary'], ['A/P Aging Detail', 'ap-aging-detail'], ['A/P Unpaid Invoices', 'ap-unpaid-invoices']]) { await nav(lab); (o.pages ||= []).push({ lab, title: await title(), url: p.url(), endsOk: p.url().split('?')[0].endsWith('/reports/' + path) }); await shot(o, lab.replace(/\W+/g, '')); } };
T.C1078976 = async (o) => { await s.go('/reports'); await p.waitForTimeout(2500); await nav('A/R Aging Detail'); o.top = (await p.locator('header, .q-header').innerText()).replace(/\s+/g, ' ').slice(-50);
  const hb = p.locator('main thead th').first().locator('button').first(); await hb.click(); await p.waitForTimeout(3500);
  const row = p.locator('main tbody tr').filter({ hasText: 'Staging Lethbridge - 4310' }).first(); o.found = await row.count(); if (o.found) { o.row = (await row.innerText()).replace(/\s+/g, ' '); await row.scrollIntoViewIfNeeded(); } await shot(o, '4-lethbridge-line'); };
T.C1078977 = async (o) => { await s.go('/reports'); await p.waitForTimeout(2500); await nav('A/R Aging Summary'); await F.asOfPrev(1); o.before = { title: await title(), date: await chipDate() }; await shot(o, '3-first-of-last-month');
  await p.locator('header, .q-header').getByText(/Staging Heavy Duty - 9919/).first().click(); await p.waitForTimeout(1500);
  await p.locator('.q-menu').last().locator('button, .q-btn, .q-field').filter({ hasText: /Staging Heavy Duty - 9919/ }).first().click(); await p.waitForTimeout(1500);
  await p.locator('.q-menu:visible, .q-dialog').last().getByText('Staging Lethbridge - 4310', { exact: true }).first().click(); await p.waitForTimeout(6000);
  o.after = { top: (await p.locator('header, .q-header').innerText()).replace(/\s+/g, ' ').slice(-50), url: p.url(), title: await title(), date: await chipDate() }; await shot(o, '5-after-switch');
  await p.locator('header, .q-header').getByText(/Staging Lethbridge - 4310/).first().click().catch(() => {}); await p.waitForTimeout(1200); await p.locator('.q-menu').last().locator('button, .q-btn, .q-field').filter({ hasText: /Staging Lethbridge - 4310/ }).first().click().catch(() => {}); await p.waitForTimeout(1200); await p.locator('.q-menu:visible, .q-dialog').last().getByText('Staging Heavy Duty - 9919', { exact: true }).first().click().catch(() => {}); await p.waitForTimeout(5000); o.restored = (await p.locator('header, .q-header').innerText()).replace(/\s+/g, ' ').slice(-50); };
T.C1078978 = async (o) => { await s.go('/reports'); await p.waitForTimeout(2500); o.dates = [];
  for (const lab of ['A/R Aging Summary', 'A/R Aging Detail', 'A/R Aging Collection', 'A/P Aging Summary', 'A/P Aging Detail', 'A/P Unpaid Invoices']) { await nav(lab); o.dates.push({ lab, date: await chipDate() }); await shot(o, lab.replace(/\W+/g, '')); } };
T.C1078979 = async (o) => { await s.go('/reports'); await p.waitForTimeout(2500); await nav('A/P Aging Summary'); const chip = p.locator('main button', { hasText: /As of:/ }).first(); o.chipHasCancel = /cancel|close/.test(await chip.innerText());
  await chip.click(); await p.waitForTimeout(1200); const m = p.locator('.q-menu').last(); o.menu = (await m.innerText()).replace(/\s+/g, ' ').slice(0, 400); o.clearButtons = await m.locator('button').filter({ hasText: /clear|reset|remove|cancel|close/i }).allInnerTexts(); await shot(o, '4-date-menu');
  await p.keyboard.press('Escape'); await p.waitForTimeout(1500); o.dateAfter = await chipDate(); o.rows = await p.locator('main tbody tr').count(); await shot(o, '5-closed'); };
T.C1078980 = async (o) => { await s.go('/reports'); await p.waitForTimeout(2500); await nav('A/R Aging Summary'); await p.locator('main button', { hasText: /As of:/ }).first().click(); await p.waitForTimeout(1200); const m = p.locator('.q-menu').last();
  o.thisMonth = await m.locator('.q-date__calendar-item').evaluateAll((es) => es.map((e) => ({ t: e.innerText.trim(), dis: e.classList.contains('q-date__calendar-item--out') || !!e.querySelector('button[disabled]') || e.querySelector('button') === null })).filter((x) => /^\d+$/.test(x.t)).filter((x) => +x.t >= 10 && +x.t <= 14));
  await m.locator('button').filter({ hasText: /chevron_right/ }).first().click(); await p.waitForTimeout(800); o.nextMonthHeader = (await m.innerText()).replace(/\s+/g, ' ').slice(0, 120);
  const last = await m.locator('.q-date__calendar-item').evaluateAll((es) => es.map((e) => ({ t: e.innerText.trim(), dis: e.classList.contains('q-date__calendar-item--out') || !!e.querySelector('button[disabled]') || e.querySelector('button') === null })).filter((x) => /^\d+$/.test(x.t))); o.nextMonthLast = last[last.length - 1]; await shot(o, '4-next-month');
  const btn = m.locator('.q-date__calendar-item').filter({ hasText: new RegExp('^' + o.nextMonthLast?.t + '$') }).locator('button').first(); if (await btn.count() && !(await btn.isDisabled())) { await btn.click(); await p.waitForTimeout(3000); } else await p.keyboard.press('Escape');
  await p.waitForTimeout(1000); o.dateAfter = await chipDate(); await shot(o, '5-chip'); };
T.C1078981 = async (o) => { await s.go('/reports'); await p.waitForTimeout(2500); await nav('A/P Aging Summary'); const u = p.url().split('?')[0] + '?asOfDate=2026-12-31'; o.typed = u; await p.goto(u); await p.waitForTimeout(5000); o.url = p.url(); o.date = await chipDate(); await shot(o, '5-chip'); };
T.C1078982 = async (o) => { await s.go('/reports'); await p.waitForTimeout(2500); await nav('A/R Aging Detail'); await F.asOfPrev(15); o.set = await chipDate(); o.urlSet = p.url(); await shot(o, '3-15th-last-month');
  await p.reload(); await p.waitForTimeout(5000); o.afterReload = await chipDate(); await shot(o, '5-reloaded'); await nav('A/R Aging Summary'); o.summaryDate = await chipDate(); await p.goBack(); await p.waitForTimeout(4500); o.afterBack = { url: p.url(), title: await title(), date: await chipDate() }; await shot(o, '8-back'); };
T.C1078983 = async (o) => { await s.go('/reports'); await p.waitForTimeout(2500); await nav('A/P Unpaid Invoices'); await F.asOfPrev(1); o.set = await chipDate(); await shot(o, '3-first-of-last-month');
  await nav('Inventory Value'); o.inv = await title(); await nav('A/P Unpaid Invoices'); o.date = await chipDate(); o.url = p.url(); await shot(o, '6-reopened'); };
for (const [id, fn] of Object.entries(T)) { if (ONLY && !ONLY.includes(id)) continue; const o = { id };
  try { await fn(o); } catch (e) { o.err = String(e).slice(0, 300); try { await shot(o, 'error'); } catch {} }
  fs.writeFileSync(OUT + id + '.json', JSON.stringify(o, null, 1)); console.log(id, o.err || 'ok'); }
await s.close(); process.exit(0);
