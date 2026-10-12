/** Rule 121 check for the Schedule six-hour jump (QA lead chose it, 12 Oct 2026). Production location "Truck Hill 1" is set to
 *  America/Edmonton (the QA branch shop's zone), a work order is dropped under the 1 PM heading, its saved TIME is read, the
 *  shift is deleted, and the location is set back to Africa/Bangui — the revert runs in finally and is read back.
 *  Positive control: the 1 PM heading's own position is measured just before the drop. Second production test account only. */
import fs from 'fs'; import path from 'path';
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'prod-2026-10-12'); fs.mkdirSync(EV, { recursive: true });
const R = {}; const save = () => fs.writeFileSync(path.join(EV, `prod-tz-check-${(process.env.TZ_TARGET || 'America/Edmonton').split('/')[1]}-${process.env.TZ_RUN || 1}.json`), JSON.stringify(R, null, 1));
const { browser, page: p, APP } = await bootProdLogin('/administration/locations', { viewport: { width: 1600, height: 1000 } });
p.setDefaultTimeout(20000); const shot = (n) => p.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
const wpOfUser = () => p.evaluate(`(() => { try { const u = JSON.parse(localStorage.getItem('user') || '{}')?.data || {}; return { wp: u.details?.default_workplace ?? u.default_workplace, tz: u.details?.workplace_timezone ?? u.timezone ?? null }; } catch { return null; } })()`);
async function setTz(tz) {
  await p.goto(`${APP}/administration/locations`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  const row = p.locator('tbody tr').filter({ hasText: 'Truck Hill 1' }).first(); await row.locator('text=edit_note').first().click(); await p.waitForTimeout(2500);
  const d = p.locator('.q-dialog').last(); const f = d.locator('.q-field').filter({ hasText: /Timezone/ }).first(); const before = (await f.innerText()).replace(/\s+/g, ' ');
  await f.click(); await p.waitForTimeout(800); await p.keyboard.type(tz.split('/')[1], { delay: 60 }); await p.waitForTimeout(2000);
  const opt = p.locator('.q-menu .q-item').filter({ hasText: tz }).first(); if (!(await opt.count())) { await p.keyboard.press('Escape'); await d.locator('button').filter({ hasText: 'close' }).first().click().catch(() => {}); return { before, error: `no option ${tz}` }; }
  await opt.click(); await p.waitForTimeout(800); const clicked = await p.evaluate(`(() => { const b = [...document.querySelectorAll('.q-dialog button')].filter(x => x.innerText.replace(/\\s+/g,' ').trim() === 'Save & Close').pop(); if (!b) return false; b.scrollIntoView(); b.click(); return true; })()`); if (!clicked) return { before, error: 'no Save & Close' }; await p.waitForTimeout(4000);
  const toasts = await p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 100))`);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  const after = (await p.locator('tbody tr').filter({ hasText: 'Truck Hill 1' }).first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 100);
  return { before, after, toasts };
}
try {
  const TARGET = process.env.TZ_TARGET || 'America/Edmonton'; R.target = TARGET; R.toEdmonton = TARGET === 'Africa/Bangui' ? { skipped: 'own zone kept' } : await setTz(TARGET); await shot('tz-edmonton');
  R.userAfter = await wpOfUser();
  // the app keeps the location's zone in the session; switch to the same location again so it re-reads it (Change Location)
  R.relocate = await p.evaluate(async ([wp]) => { const r = await fetch('https://api.shopview.com/api/iam/change-location', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ workplace_id: wp, workplace_timezone: TARGET }) }); return r.status; }, [R.userAfter?.wp]).catch((e) => String(e).slice(0, 80));
  await p.goto(`${APP}/schedule`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(9000);
  await p.getByRole('button', { name: /^\s*Today\s*$/ }).first().click().catch(() => {}); await p.waitForTimeout(2500);
  for (let i = 0; i < 4; i++) { await p.locator('[data-test-id="button_schedule_next"]').click(); await p.waitForTimeout(3000); const r = await p.locator('[data-test-id="text_schedule_range"]').innerText().catch(() => ''); if (!/Sat|Sun/.test(r)) { R.day = r; break; } }
  await p.locator('[data-test-id="input_sidebar_search"]').fill('S1-3'); await p.waitForTimeout(3500);
  const card = p.locator('[data-test-id="sidebar_work_order_card"]').filter({ hasText: 'First Customer Prod' }).first();
  const cust = 'First Customer Prod'; const lanes = p.locator('[data-staff-id]'); let lane = null;
  for (let i = 0; i < Math.min(await lanes.count(), 15); i++) { const l = lanes.nth(i); const tx = await l.innerText().catch(() => ''); if (!/Not working/i.test(tx) && (await l.boundingBox())) { lane = l; R.lane = tx.replace(/\s+/g, ' ').slice(0, 50); break; } }
  const rects = () => p.evaluate(`(() => [...document.querySelectorAll('div, span, p')].filter(e => e.children.length <= 3 && (e.textContent || '').trim().startsWith('First Customer')).map(e => e.getBoundingClientRect()).filter(b => b.x > 520 && b.width > 30 && b.width < 400 && b.height > 8).map(b => Math.round(b.x) + ',' + Math.round(b.y)))()`);
  const before = await rects(); const hdr = p.getByText(/^\s*1\s*PM\s*$/).first(); await hdr.scrollIntoViewIfNeeded().catch(() => {}); await p.waitForTimeout(1200); await lane.scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
  const hb = await hdr.boundingBox(); const lb = await lane.boundingBox(); const cb = await card.boundingBox(); R.header1pm = Math.round(hb.x);
  await p.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2); await p.mouse.down(); await p.mouse.move(cb.x + 40, cb.y + 20, { steps: 5 }); await p.mouse.move(hb.x + 6, lb.y + lb.height / 2, { steps: 20 }); await p.mouse.up(); await p.waitForTimeout(3000);
  const d = p.locator('.q-dialog').last(); R.dialog = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200); await shot('tz-drop-dialog');
  if (await d.count()) await d.locator('button').filter({ hasText: /Create/ }).last().click({ timeout: 8000 }).catch(() => { R.noCreate = true; }); await p.waitForTimeout(4000);
  R.toasts = await p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 80))`);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(9000);
  const after = await rects(); const fresh = after.filter((x) => !before.includes(x)); R.newBlocks = fresh.slice(0, 4);
  for (const b of fresh.slice(0, 6)) { const [x, y] = b.split(',').map(Number); await p.mouse.click(x + 20, y + 10); await p.waitForTimeout(1800);
    const det = (await p.locator('.q-dialog, .q-menu, [role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
    if (/S1-3\b/.test(det)) { R.details = det.slice(0, 300); R.time = await p.locator('.q-dialog input, .q-menu input, [role=dialog] input').evaluateAll((es) => es.map((e) => e.value).filter(Boolean)).catch(() => []); await shot('tz-shift-details');
      const del = p.locator('.q-dialog, .q-menu, [role=dialog]').last().locator('button:has(i:text-is("delete_outline")), button:has(i:text-is("delete"))').first(); if (await del.count()) { await del.click(); await p.waitForTimeout(2500); R.deleted = true; } break; }
    await p.keyboard.press('Escape'); await p.waitForTimeout(500); }
} catch (e) { R.error = String(e?.message || e).slice(0, 300); await shot('tz-error'); }
finally {
  R.revert = R.target === 'Africa/Bangui' ? { skipped: true } : await setTz('Africa/Bangui').catch((e) => ({ error: String(e).slice(0, 120) }));
  R.relocateBack = await p.evaluate(async ([wp]) => { const r = await fetch('https://api.shopview.com/api/iam/change-location', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ workplace_id: wp, workplace_timezone: 'Africa/Bangui' }) }); return r.status; }, [R.userAfter?.wp]).catch((e) => String(e).slice(0, 80));
  save(); console.log('TZCHECK', JSON.stringify(R).slice(0, 3500));
  await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 8000))]); process.exit(0);
}
