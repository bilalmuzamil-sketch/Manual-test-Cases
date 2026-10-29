// SF1 (deposit date one day late on the Finance tab). Rule 99: all four zone places + localStorage location key + header check start/end.
// Usage: TZ=<zone> node sf1_screen.mjs <mode>   modes: control (DVI, adds 2 ZZAUTOTEST deposits through the screen) | dvi-read | hd-read
// SECRET-FREE. Out: evidence/f3/SF1/<mode>/
import fs from 'fs';
import { execFileSync } from 'child_process';
import { f3boot, assertLoc } from './f3boot.mjs';
const APP = 'https://app.staging.shopview.com'; const mode = process.argv[2];
const L = mode === 'hd-read' ? 'hd' : 'dvi';
const OUT = `/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f3/SF1/${mode}`; fs.mkdirSync(OUT, { recursive: true });
const SEED = JSON.parse(fs.readFileSync('/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f3/SF1/seed.json'));
const { browser, ctx, page, WP, TZ, LNAME } = await f3boot(L);
const meta = { mode, location: LNAME, location_tz: TZ, process_TZ: process.env.TZ || null, process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, observed_at_utc: new Date().toISOString(), shots: {}, reads: {} };
meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
meta.app_timezone_key = await page.evaluate(() => localStorage.getItem('timezone'));
meta.browser_now = await page.evaluate(() => new Date().toString());
const B = b => b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
const txt = async l => (await l.first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
const save = () => fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1));
const go = async (p, w = 11000) => { await page.goto(APP + p, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(w);
  meta.appVersion = meta.appVersion || await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null); };
const depLines = async () => (await page.locator('main').innerText().catch(() => '')).split('\n').map(s => s.trim()).filter(s => /\(Deposit\)/.test(s));
const shot = async (name, extra = {}) => { await page.screenshot({ path: `${OUT}/${name}.png` }); meta.shots[name] = { at_utc: new Date().toISOString(), ...extra }; save(); };
await go('/dashboard', 6000); meta.loc_start = await assertLoc(page, LNAME, WP);
const finance = async (wo, name) => { await go(`/workorders/${wo}/finance`);
  const lines = await depLines(); const boxes = [];
  for (const t of lines) boxes.push({ t, box: B(await page.getByText(t, { exact: true }).first().boundingBox().catch(() => null)) });
  meta.reads[name] = { lines }; await shot(name, { deposit_lines: boxes }); return lines; };
const custTabs = async (cid, name, want) => {
  await go(`/customers/${cid}`, 9000);
  meta.reads[name + '_tabs'] = await page.locator('main .q-tab, main [role="tab"]').allInnerTexts().catch(() => []);
  for (const tab of ['Deposits', 'Invoices']) {
    await page.locator('main .q-tab, main [role="tab"]').filter({ hasText: new RegExp(`^\\s*${tab}`) }).first().click().catch(() => {}); await page.waitForTimeout(8000);
    const rows = await page.locator('main tbody tr').evaluateAll(trs => trs.map(t => t.innerText.replace(/\s+/g, ' ').trim()));
    const hits = rows.filter(r => want.some(w => r.includes(w)));
    meta.reads[`${name}_${tab}`] = { url: page.url(), heads: await page.locator('main thead th').allInnerTexts().catch(() => []), hits };
    const boxes = []; for (const w of want) boxes.push({ w, box: B(await page.locator('main tbody tr').filter({ hasText: w }).first().boundingBox().catch(() => null)) });
    await shot(`${name}-${tab}`, { rows: boxes });
  }
};
const pdf = async (wo, name) => {
  await go(`/workorders/${wo}/finance`);
  meta.reads[name + '_toolbar_ids'] = await page.locator('main button, main a').evaluateAll(es => es.map(e => (e.getAttribute('data-test-id') || '') + '|' + e.innerText.replace(/\s+/g, ' ').trim()).filter(x => x !== '|').slice(0, 30));
  const btn = page.locator('main button, main a').filter({ hasText: /^download$/ }).first();
  try { const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), btn.click()]); const f = `${OUT}/${name}.pdf`; await dl.saveAs(f);
    const t = execFileSync('python3', ['-I', '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/tools/f3/pdftext.py', f]).toString(); meta.reads[name] = { deposit_lines: t.split('\n').filter(s => /Deposit/i.test(s)).map(s => s.trim()) };
  } catch (e) { meta.reads[name] = { error: String(e).slice(0, 200) }; }
};
if (mode === 'control') {          // two deposits through the screen, now (before 8 PM Toronto): Deposit Date left on today, and Deposit Date 10/27/2026
  for (const [amt, date] of [['10.00', null], ['5.00', '10/27/2026']]) {
    await go(`/workorders/${SEED.wo}/finance`);
    await page.locator('button').filter({ hasText: 'Add Deposit' }).first().click(); await page.waitForTimeout(3000);
    const dlg = page.locator('.q-dialog').last(); const d = dlg.locator('[data-test-id="date_input_create_deposit_date"]');
    const rec = { default_date: await d.inputValue(), toronto_now: new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' }), utc_now: new Date().toISOString() };
    if (date) { await d.click({ clickCount: 3 }); await d.fill(date); await page.keyboard.press('Tab'); await page.waitForTimeout(800); }
    await dlg.locator('[data-test-id="select_create_deposit_payment_method"]').click(); await page.waitForTimeout(1000);
    await page.locator('.q-menu .q-item, [role="option"]').filter({ hasText: /cash/i }).first().click({ timeout: 8000 }); await page.waitForTimeout(800);
    const a = dlg.locator('[data-test-id="input_create_deposit_amount"]'); await a.click(); await a.fill(amt); await page.keyboard.press('Tab'); await page.waitForTimeout(800);
    rec.date_set = await d.inputValue(); rec.amount = amt;
    await shot(`dialog-${amt}`, { dialog: B(await dlg.boundingBox()), date: B(await d.boundingBox()), text: (await dlg.innerText()).replace(/\n+/g, ' / ') });
    await dlg.locator('[data-test-id="button_confirm_dialog"]').click(); await page.waitForTimeout(7000);
    rec.after = (await page.locator('.q-dialog').allInnerTexts()).join(' || ').replace(/\n+/g, ' / ').slice(0, 300);
    (meta.deposits = meta.deposits || []).push(rec); save();
  }
  await finance(SEED.wo, 'finance-control');
}
if (mode === 'dvi-read') {
  await finance('1cf29c7d-295e-4919-be7e-12e90806e534', 'finance-S1-38221');
  await finance(SEED.wo, 'finance-control');
  await custTabs('a63836b3-ae77-4bb9-8f13-3784e0e22212', 'customer-ZZAUTOTEST-P2C-DEP', ['DEP-4818', 'DEP-4817', ...(SEED.deps || [])]);
  await pdf('1cf29c7d-295e-4919-be7e-12e90806e534', 'invoice-pdf-S1-38221');
}
if (mode === 'hd-read') {          // read-only: DEP-4718 on S2-32989 (Bravo Mechanical Services), stored 2026-09-16T19:20:15Z = 17 Sep 00:20 Karachi
  await finance('c9f68154-3f3c-4fd8-95c7-cdb1a7063f8e', 'finance-S2-32989');
  await custTabs('329d4f63-ce36-444a-893f-0a63e56b0038', 'customer-Bravo', ['DEP-4718']);
}
meta.loc_end = await assertLoc(page, LNAME, WP); meta.VALID = meta.loc_start.ok && meta.loc_end.ok; save();
console.log(JSON.stringify({ mode, VALID: meta.VALID, v: meta.appVersion, bz: meta.browser_zone, pz: meta.process_zone, tz: meta.location_tz, key: meta.app_timezone_key, deposits: meta.deposits, reads: meta.reads }).slice(0, 5000));
await browser.close();
