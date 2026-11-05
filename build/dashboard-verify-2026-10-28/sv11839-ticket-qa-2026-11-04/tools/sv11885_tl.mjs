// sv11885_tl.mjs — SV-11885 follow-up at Test Location (TZ=Asia/Karachi, all four zone settings recorded). SECRET-FREE.
// 1) exports that do not depend on the location name; 2) record the original Test Location record; 3) rename it ON SCREEN
// (Settings → Locations → edit) to "=ZZAUTOTEST Test Location"; 4) export Journal Entry, Customer Invoice, Vendor Credit Memo;
// 5) restore the original name on screen at once (fallback: the same request the screen sent, original name) and read it back.
// Downloads go to /tmp/cln/qa11839/exports/tl/ (business data stays out of git).
import fs from 'fs';
import { boot, finish, shot, sleep, LOC, APP, API, OUT } from './common.mjs';
const loc = LOC.TL; const T = 'SV-11885'; const DIR = '/tmp/cln/qa11839/exports/tl'; fs.mkdirSync(DIR, { recursive: true });
const NEW = '=ZZAUTOTEST Test Location';
const { browser, page, rule99, app_version } = await boot(loc, { dest: '/reports/sales' });
const E = { app_version, rule99_start: rule99, downloads: [], rename: {} };
const wpReq = []; page.on('request', r => { if (r.url().includes('/api/workplaces/change')) wpReq.push(r.postData()); });
const wpResp = []; page.on('response', async r => { if (r.url().includes('/api/workplaces/change')) { let b = ''; try { b = (await r.text()).slice(0, 300); } catch {} wpResp.push({ at_utc: new Date().toISOString(), status: r.status(), body: b }); } });
async function exp(name, range, tag) {
  try {
    await page.goto(APP + '/reports/sales', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(6000);
    await page.getByText('Export Reports', { exact: true }).first().click(); await sleep(2500);
    const dlg = page.locator('.q-dialog').last();
    await dlg.locator('[data-test-id="select_report_name"]').first().click(); await sleep(900); await page.getByRole('option', { name, exact: true }).first().click(); await sleep(900);
    const rs = dlg.locator('[data-test-id="select_date_range"]');
    if (await rs.count() && await rs.first().isVisible()) { await rs.first().click(); await sleep(900); await page.getByRole('option', { name: range, exact: true }).first().click(); await sleep(900); }
    const dl = page.waitForEvent('download', { timeout: 30000 }).catch(() => null);
    await dlg.locator('button').filter({ hasText: /^\s*Export\s*$/ }).first().click(); const d = await dl; await sleep(1500);
    let f = null; if (d) { f = `${DIR}/${tag}__${name.replace(/\s+/g, '_')}__${range.replace(/\s+/g, '_')}.csv`; await d.saveAs(f); }
    const rec = { tag, report: name, range, at_utc: new Date().toISOString(), file: f, bytes: f ? fs.statSync(f).size : null, toasts: await page.locator('.q-notification').allInnerTexts().catch(() => []) };
    E.downloads.push(rec); console.log('export', tag, name, range, f ? rec.bytes + ' bytes' : 'NO FILE');
  } catch (e) { E.downloads.push({ tag, report: name, range, error: e.message.slice(0, 160) }); console.log('export ERROR', name, range, e.message.slice(0, 100)); }
  if (await page.locator('.q-dialog').count()) { await page.keyboard.press('Escape').catch(() => {}); await sleep(500); }
}
const readWp = async () => page.evaluate(async api => { const r = await fetch(api + '/workplaces', { credentials: 'include', headers: { Accept: 'application/json' } }); const j = await r.json(); return (j.data.collection || []).find(w => w.id === 'f9da140e-f4eb-4e3b-adc8-028214ebaf4c'); }, API);
async function renameOnScreen(to, label) {
  await page.goto(APP + '/administration/locations', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(8000);
  const row = page.locator('tr').filter({ hasText: label === 'restore' ? NEW : 'Test Location' }).filter({ hasNotText: label === 'restore' ? '§§' : '=ZZAUTOTEST' }).first();
  await row.locator('[data-test-id="button_edit_workplace"], button').filter({ has: page.locator('i', { hasText: 'edit_note' }) }).first().click(); await sleep(3000);
  const dlg = page.locator('.q-dialog').last(); const inp = dlg.locator('[data-test-id="input_name"]').first().locator('xpath=self::input | .//input').first();
  const before = await inp.inputValue(); await inp.fill(to); await sleep(500);
  const n0 = wpResp.length; await dlg.locator('[data-test-id="button_save_workplace"]').first().click(); await sleep(5000);
  return { before, typed: to, response: wpResp.slice(n0), toasts: await page.locator('.q-notification').allInnerTexts().catch(() => []), dialog_open: await page.locator('.q-dialog').count() };
}
// 1) name-independent exports
for (const [n, r] of [['Customer Contact', 'This Month'], ['Sales Representative Assignments', 'This Month'], ['Vendor Credit Memo', 'Today'], ['Vendor Credit Memo', 'This Month'], ['Vendor Credit Memo', 'Yesterday'], ['Journal Entry', 'Today'], ['Customer Invoice', 'Today']]) await exp(n, r, 'pre');
// 2) original record
E.rename.original_record = await readWp(); fs.writeFileSync(`${OUT}/${T}/test-location-original-record.json`, JSON.stringify(E.rename.original_record, null, 1));
const ORIGINAL = E.rename.original_record?.name; console.log('original name', JSON.stringify(ORIGINAL));
if (ORIGINAL !== 'Test Location') { console.log('STOP: unexpected original name'); process.exit(2); }
// 3) rename on screen
E.rename.start_utc = new Date().toISOString();
try { E.rename.rename = await renameOnScreen(NEW, 'rename'); } catch (e) { E.rename.rename_error = e.message.slice(0, 200); }
E.rename.after_rename_readback = (await readWp())?.name; console.log('after rename', JSON.stringify(E.rename.after_rename_readback), JSON.stringify(E.rename.rename?.response));
try {
  if (E.rename.after_rename_readback === NEW) {
    E.rename.pic_renamed = await shot(page, T, 'loc-1-settings-locations-renamed');
    for (const [n, r] of [['Journal Entry', 'Today'], ['Customer Invoice', 'Today'], ['Vendor Credit Memo', 'Today']]) await exp(n, r, 'renamed');
  } else console.log('rename did not take effect — exports under the new name skipped');
} finally {
  // 5) restore at once
  try { E.rename.restore = await renameOnScreen(ORIGINAL, 'restore'); } catch (e) { E.rename.restore_error = e.message.slice(0, 200); }
  let back = (await readWp())?.name;
  if (back !== ORIGINAL && wpReq.length) {      // fallback: the exact request the screen sent, with the original name
    const body = JSON.parse(wpReq[0]); body.name = ORIGINAL;
    E.rename.restore_fallback = await page.evaluate(async ([api, b]) => { const r = await fetch(api + '/workplaces/change', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(b) }); return r.status; }, [API, body]);
    back = (await readWp())?.name;
  }
  E.rename.end_utc = new Date().toISOString(); E.rename.restored_readback = back; E.rename.restored_record = await readWp();
  E.rename.screen_request_keys = wpReq[0] ? Object.keys(JSON.parse(wpReq[0])) : null;
  E.rename.record_identical_after_restore = JSON.stringify(E.rename.restored_record) === JSON.stringify(E.rename.original_record);
  console.log('RESTORED', JSON.stringify(back), 'window', E.rename.start_utc, '→', E.rename.end_utc, 'identical', E.rename.record_identical_after_restore);
}
E.rule99_end = await finish(page, loc, rule99);
fs.writeFileSync(`${OUT}/${T}/evidence-test-location-rename.json`, JSON.stringify({ ticket: T, ...E }, null, 1));
console.log('RULE99', E.rule99_end.all_match); await browser.close();
