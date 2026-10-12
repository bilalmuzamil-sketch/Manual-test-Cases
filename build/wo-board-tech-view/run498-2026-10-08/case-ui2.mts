/** 12 Oct 2026 — the two remaining readings for the case re-run: C96960 step 6 (is Line 6's clock still running? read on the
 *  work order's Timesheets: a running entry has no End Time) and C368136 steps 8 + 10 (change Lead Technician on the work order
 *  page: no prompt; then tomorrow's shift still there). Normal sign-in, browser = location zone = Asia/Karachi. */
import fs from 'node:fs'; import path from 'node:path';
import { boot } from '../../testing-tools/qa-branch-boot.mjs';
import { shiftPrompt, toasts } from './wob.mts';
const EVD = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'case-retest-2026-10-12');
const S = JSON.parse(fs.readFileSync(path.join(EVD, 'seed.json'), 'utf8'));
const { browser, page: p, APP } = await boot('sv10043', '/workorders', 'admin'); p.setDefaultTimeout(30000);
const shot = (n: string) => p.screenshot({ path: path.join(EVD, `${n}.png`) }).catch(() => {}); const R: any = {};
try {
  if (!process.env.STEP8_ONLY) {
  // C96960: Timesheets of the six-line work order
  await p.goto(`${APP}/workorders/${S.c96960.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
  await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click(); await p.waitForTimeout(800); await p.locator('.q-menu .q-item').filter({ hasText: /Timesheets/ }).first().click(); await p.waitForTimeout(4000);
  R.timesheets = (await p.locator('tbody tr').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').slice(0, 160)); await shot('c96960-4-timesheets');
  R.headers = (await p.locator('thead th').allInnerTexts()).map((x) => x.trim());
  }
  // C368136 step 8: the work order page's Lead Technician
  await p.goto(`${APP}/workorders/${S.c368136.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
  R.leadIds = await p.evaluate(`[...document.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')).filter(t => /lead|tech/i.test(t)).slice(0, 20)`); await shot('c368136-page-loaded');
  const pick = async (name: string) => { await p.locator('[data-test-id="select_lead_technician"]').first().click(); await p.waitForTimeout(1000); await p.keyboard.type(name.split(' ')[0], { delay: 60 }); await p.waitForTimeout(1500);
    const it = p.locator('.q-menu .q-item').filter({ hasText: name }).first(); const n = await it.count(); if (n) { await it.click(); await p.waitForTimeout(2500); } else await p.keyboard.press('Escape'); return n; };
  R.leadBefore = (await p.locator('[data-test-id="select_lead_technician"]').first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
  R.pickedRalph = await pick('Ralph Edwards'); await shot('c368136-page-lead-after'); R.pagePrompt = await shiftPrompt(p, 'Keep shifts'); R.pageToasts = await toasts(p);
  R.leadAfter = (await p.locator('[data-test-id="select_lead_technician"]').first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
  R.backToEsther = await pick('Esther Howard'); R.backPrompt = await shiftPrompt(p, 'Keep shifts');
  const fromISO = new Date(Date.now() - 86400000).toISOString(), toISO = new Date(Date.now() + 3 * 86400000).toISOString();
  const b = await p.evaluate(async (u) => (await fetch(u, { credentials: 'include', headers: { Accept: 'application/json' } })).json(), `https://sv10043api.qa.shopview.com/api/schedule/board?from=${encodeURIComponent(fromISO)}&to=${encodeURIComponent(toISO)}`);
  const found: any[] = []; const walk = (x: any) => { if (!x || typeof x !== 'object') return; if (Array.isArray(x)) return x.forEach(walk); if (x.startsAt && x.workOrder?.id === S.c368136.id) found.push(new Date(x.startsAt).toLocaleString('en-GB', { timeZone: 'Asia/Karachi' }) + ' - ' + new Date(x.endsAt).toLocaleTimeString('en-GB', { timeZone: 'Asia/Karachi' })); Object.values(x).forEach(walk); }; walk(b); R.shiftsAfter = [...new Set(found)];
} catch (e: any) { R.error = String(e?.message || e).slice(0, 300); await shot('error2'); }
fs.writeFileSync(path.join(EVD, 'ui2.json'), JSON.stringify(R, null, 1)); console.log('CASEUI2', JSON.stringify(R)); await browser.close(); process.exit(0);
