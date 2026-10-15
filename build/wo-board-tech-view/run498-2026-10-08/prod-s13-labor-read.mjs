/** 15 Oct 2026, READ ONLY, Rule 121 for the "Deleted user" entry (C368177). On 12 Oct prod-timesheet-check.mjs (run 3) moved the test
 *  account's time entry on production S1-3 from Line 1 to Line 2 (evidence/prod-2026-10-12/prod-timesheet-Edmonton-3.json rowsAfter).
 *  That run never photographed Line 2's Labor block. This opens S1-3's Lines tab and reads every Labor block by its on-screen text.
 *  Positive control: the Lines tab must show both lines and at least one Labor label, or the read is void. Nothing is changed. */
import fs from 'fs'; import path from 'path';
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'prod-2026-10-15'); fs.mkdirSync(EV, { recursive: true });
const R = {}; const { browser, page: p, ctx, APP } = await bootProdLogin('/workorders', { viewport: { width: 1600, height: 1000 } });
try {
  // the list only holds the active location's work orders: make the default workplace active, as prod-timesheet-check.mjs did (its zone,
  // Africa/Bangui, is the value it already holds, so nothing changes)
  // Truck Hill 1's id and zone are read from the reply the Locations page itself receives (read only)
  let loc = null; p.on('response', async (r) => { if (loc || !/api\.shopview\.com/.test(r.url())) return; try { const t = await r.text(); if (!t.includes('Truck Hill 1')) return;
    const m = t.match(/"id":"([0-9a-f-]{36})","name":"Truck Hill 1"[^{}]*?"timezone":"([^"]+)"/); if (m) loc = { id: m[1], timezone: m[2].replace(/\\\//g, "/") }; } catch {} });
  await p.goto(`${APP}/administration/locations`, { waitUntil: 'domcontentloaded' }); for (let k = 0; k < 15 && !loc; k++) await p.waitForTimeout(1000);
  const wp = loc?.id ?? loc?.workplace_id ?? null; R.truckHill = loc ? { id: wp, tz: loc.timezone ?? loc.workplace_timezone ?? null } : null;
  if (!wp) throw new Error('Truck Hill 1 not found on the Locations page');
  R.reloc = await p.evaluate(async ([wp, tz]) => (await fetch('https://api.shopview.com/api/iam/change-location', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ workplace_id: wp, workplace_timezone: tz }) })).status, [wp, R.truckHill.tz || 'Africa/Bangui']);
  const lst = await (await ctx.request.get('https://api.shopview.com/api/work-orders?pagination[rowsPerPage]=200', { headers: { Accept: 'application/json' } })).json();
  R.listKeys = Object.keys(lst?.data ?? lst ?? {}).slice(0, 12); R.listNums = (lst?.data?.work_orders ?? []).slice(0, 8).map((w) => w.work_order_display_number ?? w.display_number ?? w.number); R.listCount = (lst?.data?.work_orders ?? []).length;
  const wo = (lst?.data?.work_orders ?? []).find((w) => Object.values(w).some((v) => v === 'S1-3')); R.woFound = !!wo; if (!wo) throw new Error('S1-3 not in the list');
  await p.goto(`${APP}/workorders/${wo.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(9000);
  R.build = await p.evaluate(`document.body.innerText.match(/v\\d+\\.\\d+\\.\\d+-[0-9a-f]+/)?.[0] ?? null`);
  R.text = (await p.locator('main, .q-page').first().innerText().catch(() => '')).replace(/[ \t]+/g, ' ').slice(0, 3000);
  R.deletedUser = /Deleted user/i.test(R.text); R.laborLabels = (R.text.match(/Labor/g) || []).length;
  await p.screenshot({ path: path.join(EV, 'C368177-prod-S1-3-lines.png'), fullPage: true });
} catch (x) { R.error = String(x?.message || x).slice(0, 300); }
finally { fs.writeFileSync(path.join(EV, 'C368177-prod-S1-3-lines.json'), JSON.stringify(R, null, 1)); console.log('READ', JSON.stringify({ ...R, text: undefined })); await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 8000))]); process.exit(0); }
