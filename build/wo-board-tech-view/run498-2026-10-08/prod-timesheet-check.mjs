/** Rule 121-style comparison for C368177 (QA lead asked 12 Oct 2026 that every defect be tried on production first).
 *  Production location "Truck Hill 1" is set to America/Edmonton (the QA branch shop's zone); the test account clocks in on
 *  Line 1 of S1-3, waits ~65 s, clocks out; the Timesheets list row is read; the row's pencil is used to move the entry to
 *  Line 2 and Save; the message and the Labor rows after a reload are read. The location is set back to Africa/Bangui in finally.
 *  Positive controls: the clock really ran (header timer), the row's time is read, and the edit window opened. Second test account. */
import fs from 'fs'; import path from 'path';
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'prod-2026-10-12'); fs.mkdirSync(EV, { recursive: true });
const TARGET = process.env.TZ_TARGET || 'America/Edmonton'; const RUN = process.env.TZ_RUN || 1;
const R = { target: TARGET }; const save = () => fs.writeFileSync(path.join(EV, `prod-timesheet-${TARGET.split('/')[1]}-${RUN}.json`), JSON.stringify(R, null, 1));
const { browser, page: p, ctx, APP } = await bootProdLogin('/workorders', { viewport: { width: 1600, height: 1000 } });
p.setDefaultTimeout(20000); const shot = (n) => p.screenshot({ path: path.join(EV, `ts-${TARGET.split('/')[1]}-${RUN}-${n}.png`) }).catch(() => {});
const dlg = () => p.locator('.q-dialog').last();
const toasts = () => p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 140))`);
async function setTz(tz) {
  await p.goto(`${APP}/administration/locations`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  await p.locator('tbody tr').filter({ hasText: 'Truck Hill 1' }).first().locator('text=edit_note').first().click(); await p.waitForTimeout(2500);
  const f = dlg().locator('.q-field').filter({ hasText: /Timezone/ }).first(); const before = (await f.innerText()).replace(/\s+/g, ' ');
  if (before.includes(tz)) { await p.keyboard.press('Escape'); return { before, already: true }; }
  await f.click(); await p.waitForTimeout(800); await p.keyboard.type(tz.split('/')[1], { delay: 60 }); await p.waitForTimeout(2000);
  await p.locator('.q-menu .q-item').filter({ hasText: tz }).first().click(); await p.waitForTimeout(800);
  await p.evaluate(`(() => { const b = [...document.querySelectorAll('.q-dialog button')].filter(x => x.innerText.replace(/\\s+/g,' ').trim() === 'Save & Close').pop(); b.scrollIntoView(); b.click(); })()`); await p.waitForTimeout(4000);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  const after = (await p.locator('tbody tr').filter({ hasText: 'Truck Hill 1' }).first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 100);
  const wp = await p.evaluate(`(() => { try { const u = JSON.parse(localStorage.getItem('user') || '{}')?.data || {}; return u.details?.default_workplace ?? u.default_workplace; } catch { return null; } })()`);
  const reloc = await p.evaluate(async ([wp, tz]) => (await fetch('https://api.shopview.com/api/iam/change-location', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ workplace_id: wp, workplace_timezone: tz }) })).status, [wp, tz]);
  return { before, after, reloc };
}
const header = async () => (await p.locator('header').innerText().catch(() => '')).replace(/\s+/g, ' ').match(/\d+:\d\d:\d\d\s*S\d+-\d+/)?.[0] ?? null;
try {
  R.tz = await setTz(TARGET);
  R.clockBefore = await header();
  // find S1-3's id from the same list the Work Orders page reads (read only)
  const lst = await (await ctx.request.get('https://api.shopview.com/api/work-orders?pagination[rowsPerPage]=200', { headers: { Accept: 'application/json' } })).json();
  const wo = (lst?.data?.work_orders ?? []).find((w) => Object.values(w).some((v) => v === 'S1-3')); R.woFound = !!wo; const id = wo?.id; if (!id) throw new Error('S1-3 not in the list');
  await p.goto(`${APP}/workorders/${id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
  const toggles = p.locator('[data-test-id^="button_clock_toggle_task_"]'); R.toggleCount = await toggles.count();
  const t1 = toggles.first(); const t1id = await t1.getAttribute('data-test-id');
  R.labor0 = await p.evaluate(`Object.fromEntries([...document.querySelectorAll('[data-test-id^="line_labor_name_"]')].map(e => [e.getAttribute('data-test-id').slice(16, 24), e.innerText.replace(/\\s+/g, ' ').trim()]))`);
  await t1.click({ force: true }); await p.waitForTimeout(2500);
  { const sw = dlg(); for (let k = 0; k < 10 && !(await sw.isVisible().catch(() => false)); k++) await p.waitForTimeout(1000);
    if (await sw.isVisible().catch(() => false)) { R.switchDialog = (await sw.innerText()).replace(/\s+/g, ' ').slice(0, 200); await sw.locator('textarea').first().fill('ZZAUTOTEST switching').catch(() => {}); await sw.locator('button').filter({ hasText: /^\s*Start\s*$/ }).last().click().catch(() => {}); await p.waitForTimeout(3000); } }
  R.clockAfterStart = await header(); R.startToasts = await toasts(); await p.waitForTimeout(65000); await shot('started');
  await p.locator(`[data-test-id="${t1id}"]`).first().click({ force: true }); await p.waitForTimeout(2000); const d = dlg();
  R.stopButtons = (await d.locator('button').allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').trim());
  await d.locator('textarea').first().fill('ZZAUTOTEST worked on it').catch(() => {}); await d.locator('button').filter({ hasText: /Clock Out|^\s*(Stop|Save|Submit)\s*$/i }).last().click().catch(() => {}); await p.waitForTimeout(3000);
  R.stopToasts = await toasts(); R.clockAfterStop = await header(); R.shopNow = await p.evaluate(`new Date().toLocaleString('en-US', { timeZone: '${TARGET}' })`);
  await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click(); await p.waitForTimeout(800); await p.locator('.q-menu .q-item').filter({ hasText: /Timesheets/ }).first().click(); await p.waitForTimeout(4000);
  const rows = p.locator('tr').filter({ hasText: /ZZAUTOTEST worked on it|Today/ }); R.rows = (await rows.allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').slice(0, 160)).slice(0, 5);
  const row = rows.first(); await row.hover(); await p.waitForTimeout(800); await shot('timesheets');
  await row.locator('[data-test-id="button_edit_timesheet"]').first().click({ timeout: 10000 }).catch(async (x) => { R.editClick = String(x).slice(0, 80); });
  const e = dlg(); for (let k = 0; k < 12 && !(await e.isVisible().catch(() => false)); k++) await p.waitForTimeout(1000);
  R.editWindow = (await e.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
  const lf = e.locator('.q-field').filter({ has: p.locator('.q-field__label', { hasText: /^Line/ }) }).first();
  if (await lf.count()) { await lf.click(); await p.waitForTimeout(800); R.lineOptions = (await p.locator('.q-menu .q-item').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ')).slice(0, 6);
    await p.locator('.q-menu .q-item').filter({ hasText: /(^|\s)2\s+\S/ }).first().click(); await p.waitForTimeout(800); await shot('edit');
    await e.locator('button').filter({ hasText: /^\s*Save\s*$/ }).last().click(); await p.waitForTimeout(3000); R.saveToasts = await toasts(); await shot('after-save');
    const cf = p.locator('.q-dialog').filter({ hasText: /Confirm Overwrite/ }).last(); if (await cf.count()) { R.overwrite = (await cf.innerText()).replace(/\s+/g, ' ').slice(0, 400); await cf.locator('button').filter({ hasText: /^\s*Confirm\s*$/ }).last().click(); await p.waitForTimeout(3500); R.confirmToasts = await toasts(); }
    await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
    await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click(); await p.waitForTimeout(800); await p.locator('.q-menu .q-item').filter({ hasText: /Timesheets/ }).first().click(); await p.waitForTimeout(4000);
    R.rowsAfter = (await p.locator('tr').filter({ hasText: /ZZAUTOTEST worked on|Today/ }).allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').slice(0, 160)).slice(0, 6); await shot('timesheets-after'); }
  else R.noLineField = true;
  await p.goto(`${APP}/workorders/${id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
  R.labor1 = await p.evaluate(`Object.fromEntries([...document.querySelectorAll('[data-test-id^="line_labor_name_"]')].map(e => [e.getAttribute('data-test-id').slice(16, 24), e.innerText.replace(/\\s+/g, ' ').trim()]))`);
} catch (x) { R.error = String(x?.message || x).slice(0, 300); await shot('error'); }
finally {
  R.revert = TARGET === 'Africa/Bangui' ? { skipped: true } : await setTz('Africa/Bangui').catch((x) => ({ error: String(x).slice(0, 120) }));
  save(); console.log('TSCHECK', JSON.stringify(R).slice(0, 4000)); await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 8000))]); process.exit(0);
}
