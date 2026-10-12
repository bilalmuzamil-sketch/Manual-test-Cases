/** 12 Oct 2026 — the QA lead's own recording (signed in normally) kept a 1 PM Schedule drop at 1 PM, while every harness run
 *  saved it at 7 PM. This opens the branch the way a person does — the sign-in page's quick-login button (qa-branch-boot.mjs),
 *  nothing injected, browser zone from TZ — and READS the same records the harness made: the time entry on S10043-19185
 *  (harness lists 09:22 AM – 09:24 AM) and the S10043-19188 shift on Mon Oct 19 (harness shows 07:00 PM – 09:00 PM). Read-only. */
import fs from 'fs'; import path from 'path';
import { boot } from '../../testing-tools/qa-branch-boot.mjs';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'clean-tz-2026-10-12'); fs.mkdirSync(EV, { recursive: true });
const TAG = process.env.TAG || 'clean'; const R = { tag: TAG };
const { browser, page: p, APP, api } = await boot('sv10043', '/workorders', 'admin');
if (process.env.HEAVY) { await p.goto(`${APP}/`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  // change location the way a person does: initials > Change Location is a menu; the app itself calls this endpoint
  R.reloc = await p.evaluate(async (wp) => (await fetch('https://sv10043api.qa.shopview.com/api/iam/change-location', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ workplace_id: wp, workplace_timezone: 'America/Edmonton' }) })).status, process.env.HEAVY);
  await p.evaluate(() => { try { const u = JSON.parse(localStorage.getItem('user') || '{}'); const d = u.data ?? u; d.details = { ...(d.details || {}), workplace_timezone: 'America/Edmonton', default_workplace: undefined }; } catch {} });
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); R.shopShown = (await p.locator('header').innerText().catch(() => '')).replace(/\s+/g, ' ').match(/Staging[^\n]{0,40}/)?.[0] ?? null; }
R.browserTZ = await p.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
R.userTZ = await p.evaluate(() => { try { const u = JSON.parse(localStorage.getItem('user') || '{}'); return (u.data ?? u)?.details?.workplace_timezone ?? null; } catch { return null; } });
const find = async (num) => { const r = await p.evaluate(async (q) => (await fetch(`https://sv10043api.qa.shopview.com/api/work-orders?search=${q}&pagination[rowsPerPage]=5`, { credentials: 'include', headers: { Accept: 'application/json' } })).json(), num); return (r?.data?.work_orders ?? []).find((w) => Object.values(w).includes(num)); };
try {
  const w1 = await find('S10043-19185'); R.w1 = !!w1;
  await p.goto(`${APP}/workorders/${w1.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
  await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click(); await p.waitForTimeout(800); await p.locator('.q-menu .q-item').filter({ hasText: /Timesheets/ }).first().click(); await p.waitForTimeout(4000);
  R.timesheet = (await p.locator('tr').filter({ hasText: /Esther/ }).allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').slice(0, 120)); await p.screenshot({ path: path.join(EV, `${TAG}-timesheet.png`) });
  if (process.env.MOVE) { const row = p.locator('tr').filter({ hasText: /Esther/ }).first(); await row.hover(); await p.waitForTimeout(800); await row.locator('[data-test-id="button_edit_timesheet"]').first().click();
    const e = p.locator('.q-dialog').last(); for (let k = 0; k < 12 && !(await e.isVisible().catch(() => false)); k++) await p.waitForTimeout(1000); await p.waitForTimeout(1500);
    await e.locator('.q-field').filter({ has: p.locator('.q-field__label', { hasText: /^Line/ }) }).first().click(); await p.waitForTimeout(800); await p.locator('.q-menu .q-item').filter({ hasText: /(^|\s)2\s+\S/ }).first().click(); await p.waitForTimeout(800);
    await e.locator('button').filter({ hasText: /^\s*Save\s*$/ }).last().click(); await p.waitForTimeout(1500); await p.screenshot({ path: path.join(EV, `${TAG}-after-save.png`) });
    R.saveMsgs = await p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 120))`);
    const cf = p.locator('.q-dialog').filter({ hasText: /Confirm Overwrite/ }).last(); if (await cf.count()) { await cf.locator('button').filter({ hasText: /^\s*Confirm\s*$/ }).last().click(); await p.waitForTimeout(3000); R.confirmed = true; }
    await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000); await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click(); await p.waitForTimeout(800); await p.locator('.q-menu .q-item').filter({ hasText: /Timesheets/ }).first().click(); await p.waitForTimeout(4000);
    R.timesheetAfterMove = (await p.locator('tr').filter({ hasText: /Esther/ }).allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').slice(0, 120)); await p.screenshot({ path: path.join(EV, `${TAG}-timesheet-after-move.png`) }); }
  await p.goto(`${APP}/schedule`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(9000);
  // the mini calendar: October 2026 is showing; click 19
  await p.locator('.q-date__calendar-item, button, div').filter({ hasText: /^\s*19\s*$/ }).first().click().catch(() => {}); await p.waitForTimeout(4000);
  R.range = await p.locator('[data-test-id="text_schedule_range"]').innerText().catch(() => null);
  await p.locator('[data-test-id="input_sidebar_search"]').fill('S10043-19188').catch(() => {}); await p.waitForTimeout(3000);
  R.headers = await p.evaluate(`[...document.querySelectorAll('div,span')].filter(e => e.children.length === 0 && /^\\s*\\d{1,2}\\s*(AM|PM)\\s*$/.test(e.textContent)).map(e => e.textContent.trim() + '@' + Math.round(e.getBoundingClientRect().x)).slice(0, 24)`);
  const blocks = await p.evaluate(`[...document.querySelectorAll('div,span,p')].filter(e => e.children.length <= 3 && /Sched Lines 26942/.test(e.textContent || '')).map(e => e.getBoundingClientRect()).filter(b => b.width > 30 && b.width < 400 && b.x > 520).map(b => Math.round(b.x) + ',' + Math.round(b.y))`);
  R.blocks = [...new Set(blocks)].slice(0, 4);
  if (R.blocks[0]) { const [x, y] = R.blocks[0].split(',').map(Number); await p.mouse.click(x + 20, y + 10); await p.waitForTimeout(2000);
    R.details = (await p.locator('.q-dialog, .q-menu, [role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 260);
    R.time = await p.locator('.q-dialog input, .q-menu input, [role=dialog] input').evaluateAll((es) => es.map((e) => e.value).filter(Boolean)).catch(() => []); }
  await p.screenshot({ path: path.join(EV, `${TAG}-schedule.png`) });
} catch (e) { R.error = String(e?.message || e).slice(0, 300); await p.screenshot({ path: path.join(EV, `${TAG}-error.png`) }).catch(() => {}); }
fs.writeFileSync(path.join(EV, `${TAG}.json`), JSON.stringify(R, null, 1)); console.log('CLEAN', JSON.stringify(R));
await browser.close(); process.exit(0);
