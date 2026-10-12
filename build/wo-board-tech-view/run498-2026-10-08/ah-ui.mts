/** 12 Oct 2026 — re-test of Ahtasham's three failures ON SCREEN, in a normally signed-in browser (sign-in page quick-login,
 *  nothing injected; L0312), in the Mountain-time shop. Data from ah-seed.mts. Pictures at 2x into evidence/ah-retest-2026-10-12.
 *  ONLY=follow,prompt,offline picks which. Nothing is judged from the API except a read-back of the lead after a reload. */
import fs from 'node:fs'; import path from 'node:path';
import { boot } from '../../testing-tools/qa-branch-boot.mjs';
import { display, tab, search, drag, toColumn, openReassign, toasts, pickLead, shiftPrompt } from './wob.mts';
import { HEAVY } from './profile.mts';
const EVD = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'ah-retest-2026-10-12');
const S = JSON.parse(fs.readFileSync(path.join(EVD, 'seed.json'), 'utf8'));
const only = (process.env.ONLY || 'follow,prompt,offline').split(',');
const { browser, ctx, page: p, APP } = await boot('sv10043', '/workorders', 'admin'); p.setDefaultTimeout(30000);
const shot = (n: string) => p.screenshot({ path: path.join(EVD, `${n}.png`) }).catch(() => {});
const R: any = {};
const API = 'https://sv10043api.qa.shopview.com';
const get = (u: string) => p.evaluate(async (u) => (await fetch(u, { credentials: 'include', headers: { Accept: 'application/json' } })).json(), API + u);
// the Mountain-time shop, as Change Location does it
R.reloc = await p.evaluate(async ([u, wp]) => (await fetch(u, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ workplace_id: wp, workplace_timezone: 'America/Edmonton' }) })).status, [API + '/api/iam/change-location', HEAVY]);
const board = async (q: string) => { await p.goto(`${APP}/workorders?tab=all`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); await tab(p, 'All'); await display(p, 'Board View'); await search(p, q); await p.waitForTimeout(3000); };
R.shop = (await p.locator('header').innerText().catch(() => '')).replace(/\s+/g, ' ').match(/Staging[^·]{0,30}/)?.[0];
const labor = async (woId: string) => { await p.goto(`${APP}/workorders/${woId}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000); return p.evaluate(`[...document.querySelectorAll('[data-test-id^="line_labor_name_"]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim())`); };
const leadOf = async (q: string) => { const r = await get(`/api/work-orders?search=${encodeURIComponent(q)}&pagination[rowsPerPage]=5`); const w = (r?.data?.work_orders ?? [])[0]; return w ? (w.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName}` : 'none') : 'not found'; };
try {
  if (only.includes('follow')) { const o: any = (R.follow = {});   // SV-11128 / C96960
    o.laborBefore = await labor(S.follow.id); await shot('follow-0-lines-before');
    await board(S.follow.customer); await toColumn(p, S.ES); await shot('follow-1-board-before');
    const { item } = await openReassign(p, S.follow.id, 'board'); await item.click(); await p.waitForTimeout(1500); await shot('follow-2-reassign-dialog');
    o.prompt = await pickLead(p, S.RE); o.toasts = await toasts(p); await p.waitForTimeout(1500); await shot('follow-3-after-reassign');
    o.laborAfter = await labor(S.follow.id); await shot('follow-4-lines-after'); o.lead = await leadOf(S.follow.customer); }
  if (only.includes('prompt')) { const o: any = (R.prompt = {});   // SV-11126 / C368136
    await board(S.prompt.customer); await toColumn(p, S.ES); await shot('prompt-1-board-before');
    const { item } = await openReassign(p, S.prompt.id, 'board'); await item.click(); await p.waitForTimeout(1500);
    await p.locator(`[data-test-id="option_lead_technician_${S.RE}"]`).click(); await p.waitForTimeout(500); await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click();
    await p.waitForTimeout(1500); await shot('prompt-2-after-reassign-click');
    o.prompt = await shiftPrompt(p, 'Cancel'); o.toasts = await toasts(p); await p.waitForTimeout(1500); o.lead = await leadOf(S.prompt.customer); await shot('prompt-3-after-cancel'); }
  if (only.includes('offline')) { const o: any = (R.offline = {});   // SV-11074 / C96968
    await board(S.offline.customer); await toColumn(p, S.ES); await p.evaluate(`document.querySelector('[data-test-id="board_column_unassigned"]')?.scrollIntoView({ inline: 'nearest', block: 'nearest' })`); await p.waitForTimeout(800);
    o.before = await leadOf(S.offline.customer); await shot('offline-1-before');
    await ctx.setOffline(true); await p.waitForTimeout(1000);
    await drag(p, `[data-test-id="board_card_${S.offline.id}"]`, `[data-test-id="board_column_${S.ES}"]`).catch((e) => { o.dragError = String(e).slice(0, 120); });
    await p.waitForTimeout(10000); await shot('offline-2-after-10s-offline');
    o.cardIn = await p.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_card_${S.offline.id}"]'); const col = c?.closest('[data-test-id^="board_column_"]'); return col ? col.getAttribute('data-test-id') : null; })()`);
    o.toastsOffline = await toasts(p); o.alerts = await p.evaluate(`[...document.querySelectorAll('[role=alert], .q-banner, .q-dialog')].map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 140))`);
    o.url = p.url().replace(/[0-9a-f-]{36}/g, '<id>');
    await ctx.setOffline(false); await p.waitForTimeout(8000); await shot('offline-3-back-online');
    await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000); o.leadAfterReconnect = await leadOf(S.offline.customer); await shot('offline-4-after-reload'); }
} catch (e: any) { R.error = String(e?.message || e).slice(0, 300); await shot('error'); }
fs.writeFileSync(path.join(EVD, 'ui.json'), JSON.stringify(R, null, 1)); console.log('AHUI', JSON.stringify(R));
await browser.close(); process.exit(0);
