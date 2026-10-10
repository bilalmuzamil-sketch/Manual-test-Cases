/** Production comparison (10 Oct 2026) for C368179/C368178: drag a work order card onto a technician's row under the
 *  "1 PM" heading, keep the window's defaults, Create, then find the NEW block (rects before vs after, matched by the
 *  card's customer name) and open it to read its TIME. Is the six-hour jump seen on sv10043 already on production?
 *  Positive control: the heading's own position is measured right before the drop and recorded with the block's position.
 *  Second production test account only. The created shift is deleted again from its details (delete icon). */
import fs from 'fs'; import path from 'path';
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'prod-2026-10-10'); fs.mkdirSync(EV, { recursive: true });
const t = () => new Date().toISOString().slice(11, 19); const R = {};
const { browser, page: p, APP, version } = await bootProdLogin('/schedule', { deviceScaleFactor: 1, viewport: { width: 1600, height: 1000 } });
R.version = version; p.setDefaultTimeout(20000); const shot = (n) => p.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
R.browserTZ = await p.evaluate('Intl.DateTimeFormat().resolvedOptions().timeZone'); R.shopTZ = await p.evaluate(`(localStorage.getItem('user') || '').match(/"time_?zone"\\s*:\\s*"([^"]+)"/i)?.[1] ?? null`);
const blocks = (name) => p.evaluate(`(() => { const n = ${JSON.stringify('')} ; return null; })()`);
try {
  await p.waitForTimeout(8000); await p.getByRole('button', { name: /^\s*Today\s*$/ }).first().click().catch(() => {}); await p.waitForTimeout(2500);
  // next weekday
  for (let i = 0; i < 4; i++) { await p.locator('[data-test-id="button_schedule_next"]').click(); await p.waitForTimeout(3000); const r = await p.locator('[data-test-id="text_schedule_range"]').innerText().catch(() => ''); if (!/Sat|Sun/.test(r)) { R.day = r; break; } }
  await p.locator('[data-test-id="input_sidebar_search"]').fill('S1-3'); await p.waitForTimeout(3500); const card = p.locator('[data-test-id="sidebar_work_order_card"]').filter({ hasText: 'First Customer Prod' }).first();   // S1-3: 0h / 2h — hours left to plan, so the window opens as on sv10043 await card.waitFor({ timeout: 20000 }); R.card = (await card.innerText()).replace(/\s+/g, ' ').slice(0, 120);
  const cust = (await card.innerText()).split('\n').map((x) => x.trim()).filter(Boolean)[2] ?? ''; R.cust = cust;
  const lanes = p.locator('[data-staff-id]'); let lane = null;
  for (let i = 0; i < Math.min(await lanes.count(), 15); i++) { const l = lanes.nth(i); const tx = await l.innerText().catch(() => ''); if (!/Not working/i.test(tx) && (await l.boundingBox())) { lane = l; R.lane = tx.replace(/\s+/g, ' ').slice(0, 60); break; } }
  const rects = () => p.evaluate(`(() => { const n = ${JSON.stringify(cust.slice(0, 16))}; return [...document.querySelectorAll('div, span, p')].filter(e => e.children.length <= 3 && (e.textContent || '').trim().startsWith(n)).map(e => e.getBoundingClientRect()).filter(b => b.x > 520 && b.width > 30 && b.width < 400 && b.height > 8).map(b => Math.round(b.x) + ',' + Math.round(b.y)); })()`);
  const before = await rects();
  const hdr = p.getByText(/^\s*1\s*PM\s*$/).first(); await hdr.scrollIntoViewIfNeeded().catch(() => {}); await p.waitForTimeout(1200); await lane.scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
  const hb = await hdr.boundingBox(); const lb = await lane.boundingBox(); const cb = await card.boundingBox(); R.header1pm = { x: Math.round(hb.x), w: Math.round(hb.width) };
  const hours = await p.evaluate(`[...document.querySelectorAll('*')].filter(e => e.children.length === 0 && /^\\s*\\d{1,2}\\s*(AM|PM)\\s*$/.test(e.textContent)).map(e => e.textContent.trim() + '@' + Math.round(e.getBoundingClientRect().x)).slice(0, 16)`); R.headings = hours;
  await p.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2); await p.mouse.down(); await p.mouse.move(cb.x + 40, cb.y + 20, { steps: 5 }); await p.mouse.move(hb.x + 6, lb.y + lb.height / 2, { steps: 20 }); await p.mouse.up(); await p.waitForTimeout(3000);
  const d = p.locator('.q-dialog').last(); R.dialog = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 260); await shot('prod-sched2-dialog');
  if (await d.count()) await d.locator('button').filter({ hasText: /Create/ }).last().click({ timeout: 8000 }).catch(() => { R.noCreate = true; }); else R.noDialog = true; await p.waitForTimeout(4000); await shot('prod-sched2-created');
  const after = await rects(); const fresh = after.filter((x) => !before.includes(x)); R.newBlocks = fresh;
  if (fresh.length) { const [x, y] = fresh[0].split(',').map(Number); R.newBlockX = x; await p.mouse.click(x + 20, y + 10); await p.waitForTimeout(1800);
    R.details = (await p.locator('.q-dialog, .q-menu, [role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
    R.timeInputs = await p.locator('.q-dialog input, .q-menu input, [role=dialog] input').evaluateAll((es) => es.map((e) => e.value).filter(Boolean)).catch(() => []); await shot('prod-sched2-details');
    const del = p.locator('.q-dialog, .q-menu, [role=dialog]').last().locator('button:has(i:text-is("delete_outline")), button:has(i:text-is("delete"))').first(); if (await del.count()) { await del.click(); await p.waitForTimeout(2500); R.deleted = true; } }
} catch (e) { R.error = String(e?.message || e).slice(0, 300); await shot('prod-sched2-error'); }
console.log(t(), 'PROD-SCHED', JSON.stringify(R)); fs.writeFileSync(path.join(EV, 'prod-sched2.json'), JSON.stringify(R, null, 1));
await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 8000))]); process.exit(0);
