/** 12 Oct 2026 — second re-test of SV-11128 (C96960) and SV-11126 (C368136), EXACTLY as Ahtasham did it: the shift is made by
 *  dragging the work order onto the Schedule (Entire work order, today, two hours after the current time, so not ended), then
 *  the lead is changed in Board View > More actions > Reassign lead technician. Normal sign-in (L0312), Mountain-time shop, 2x. */
import fs from 'node:fs'; import path from 'node:path';
import { boot } from '../../testing-tools/qa-branch-boot.mjs';
import { display, tab, search, toColumn, openReassign, toasts, shiftPrompt } from './wob.mts';
import { HEAVY } from './profile.mts';
const EVD = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'ah-retest-2026-10-12');
const S = JSON.parse(fs.readFileSync(path.join(EVD, 'seed2.json'), 'utf8'));
const { browser, page: p, APP } = await boot('sv10043', '/workorders', 'admin'); p.setDefaultTimeout(30000);
const shot = (n: string) => p.screenshot({ path: path.join(EVD, `${n}.png`) }).catch(() => {});
const API = 'https://sv10043api.qa.shopview.com'; const R: any = {};
await p.goto(`${APP}/workorders?tab=all`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
await p.locator('[data-test-id="profile_menu_button"]').click(); await p.waitForTimeout(1200);
{ const cur = p.locator('.q-menu').getByText(/ - \d{3,5}$/).first(); R.locBefore = (await cur.innerText().catch(() => '')).trim(); if (!/Heavy Duty/.test(R.locBefore)) { await cur.click(); await p.waitForTimeout(1500);
  await p.locator('.q-menu').last().locator('.q-item').filter({ hasText: /Staging Heavy Duty - 9919/ }).first().click(); await p.waitForTimeout(8000); } else await p.keyboard.press('Escape'); }
await p.goto(`${APP}/schedule`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(9000);
R.shop = (await p.locator('[data-test-id="profile_menu_button"]').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 40);
R.nowMarker = await p.evaluate(`[...document.querySelectorAll('div,span')].filter(e => e.children.length === 0 && /^\\s*\\d{1,2}:\\d\\d\\s*(AM|PM)\\s*$/.test(e.textContent)).map(e => e.textContent.trim()).slice(0, 3)`);
// the shop's own zone, read off Administration > Locations on 12 Oct 2026: Staging Heavy Duty is now Asia/Dubai
R.shopClock = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Dubai', hour: 'numeric', minute: '2-digit' });
const h24 = Number(new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai', hour: 'numeric', hour12: false })) + 2; const DROP = `${((h24 + 11) % 12) + 1} ${h24 >= 12 ? 'PM' : 'AM'}`; R.dropUnder = DROP;
await p.screenshot({ path: path.join(EVD, 'v3-0-schedule-now.png') });
if (!R.nowMarker.some((m: string) => m.split(':')[0] === R.shopClock.split(':')[0] && m.slice(-2) === R.shopClock.slice(-2))) { console.log('AHUI4', JSON.stringify({ ...R, stop: 'the Schedule clock does not match the shop time zone — not judging' })); await browser.close(); process.exit(0); }
const laneOf = async (staff: string) => { for (let i = 0; i < 60; i++) { if (await p.locator(`[data-staff-id="${staff}"]`).count()) return true; const moved = await p.evaluate(`(() => { const c = document.querySelector('[data-test-id="schedule_calendar"]'); let e = c && c.querySelector('[data-staff-id]'); while (e && !(e.scrollHeight > e.clientHeight + 10 && /auto|scroll/.test(getComputedStyle(e).overflowY))) e = e.parentElement; const s = e || c || document.scrollingElement; const b = s.scrollTop; s.scrollTop = b + 500; return s.scrollTop !== b; })()`); await p.waitForTimeout(300); if (!moved) break; } return (await p.locator(`[data-staff-id="${staff}"]`).count()) > 0; };
async function schedule(w: any, staff: string, tag: string) { const o: any = {};
  await p.goto(`${APP}/schedule`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(9000); await p.getByRole('button', { name: /^\s*Today\s*$/ }).first().click().catch(() => {}); await p.waitForTimeout(3000);
  o.day = await p.locator('[data-test-id="text_schedule_range"]').innerText().catch(() => null);
  await p.locator('[data-test-id="input_sidebar_search"]').fill(w.number); await p.waitForTimeout(3500);
  const card = p.locator('[data-test-id="sidebar_work_order_card"]').filter({ hasText: w.number }).first(); o.card = await card.count();
  o.lane = await laneOf(staff); const lane = p.locator(`[data-staff-id="${staff}"]`).first();
  const hdr = p.getByText(new RegExp('^\\s*' + DROP.replace(' ', '\\s*') + '\\s*$')).first(); await hdr.scrollIntoViewIfNeeded().catch(() => {}); await p.waitForTimeout(1200); await lane.scrollIntoViewIfNeeded().catch(() => {}); await p.waitForTimeout(800);
  const hb = await hdr.boundingBox(); const lb = await lane.boundingBox(); const cb = await card.boundingBox();
  await p.mouse.move(cb!.x + cb!.width / 2, cb!.y + cb!.height / 2); await p.mouse.down(); await p.mouse.move(cb!.x + 40, cb!.y + 20, { steps: 5 }); await p.mouse.move(hb!.x + 6, lb!.y + lb!.height / 2, { steps: 20 }); await p.mouse.up(); await p.waitForTimeout(3000);
  const d = p.locator('.q-dialog').last(); o.dialog = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 260); await shot(`${tag}-a-schedule-drop`);
  await d.locator('button').filter({ hasText: /Create/ }).last().click().catch(() => { o.noCreate = true; }); await p.waitForTimeout(3500); o.toasts = await toasts(p); await shot(`${tag}-b-schedule-created`);
  return o; }
const board = async (q: string) => { await p.goto(`${APP}/workorders?tab=all`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); await tab(p, 'All'); await display(p, 'Board View'); await search(p, q); await p.waitForTimeout(3000); };
const labor = async (woId: string) => { await p.goto(`${APP}/workorders/${woId}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000); return p.evaluate(`[...document.querySelectorAll('[data-test-id^="line_labor_name_"]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim())`); };
const B = process.env.B === 'dana' ? S.DO : S.RE;
const reassign = async (w: any) => { await board(w.customer); await toColumn(p, S.ES); const { item } = await openReassign(p, w.id, 'board'); await item.click(); await p.waitForTimeout(1500);
  await p.locator(`[data-test-id="option_lead_technician_${B}"]`).click(); await p.waitForTimeout(500); await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click(); await p.waitForTimeout(1500); };
try {
  { const o: any = (R.follow = {}); o.laborBefore = await labor(S.follow.id);
    o.sched = await schedule(S.follow, B, 'follow4');        // Entire work order onto RALPH's row, today 7 AM
    await reassign(S.follow); await shot('follow4-c-after-reassign'); o.prompt = await shiftPrompt(p, 'Keep shifts'); o.toasts = await toasts(p);
    o.laborAfter = await labor(S.follow.id); await shot('follow4-d-lines-after'); }
  if (!process.env.FOLLOW_ONLY) { const o: any = (R.prompt = {});
    o.sched = await schedule(S.prompt, S.ES, 'prompt3');        // Entire work order onto ESTHER's row (the lead), today 7 AM
    await reassign(S.prompt); await p.waitForTimeout(800); await shot('prompt3-c-after-reassign-click');
    o.prompt = await shiftPrompt(p, 'Cancel'); o.toasts = await toasts(p); }
} catch (e: any) { R.error = String(e?.message || e).slice(0, 300); await shot('error3'); }
fs.writeFileSync(path.join(EVD, 'ui4.json'), JSON.stringify(R, null, 1)); console.log('AHUI4', JSON.stringify(R));
await browser.close(); process.exit(0);
