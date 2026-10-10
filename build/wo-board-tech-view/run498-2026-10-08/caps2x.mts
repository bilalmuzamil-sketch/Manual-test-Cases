/** 2x pictures for the six "not a defect?" failures (10 Oct 2026), with the screen box of each thing to mark, so the
 *  annotation is placed from measured boxes (CSS px; the picture is 2x). Run with WOB_SCALE=2. Read-only except C368221's
 *  date choice (a saved filter). */
import fs from 'node:fs'; import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { api, workOrders } from './data.mts';
import { EV, t, tab } from './wob.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const R: any = {};
const box = async (l: any) => { const b = await l.boundingBox().catch(() => null); return b ? [b.x, b.y, b.width, b.height].map(Math.round) : null; };
const shot = (n: string) => p.screenshot({ path: path.join(EV, `${n}.png`) });
const step = async (id: string, f: () => Promise<any>) => { try { R[id] = await f(); } catch (e: any) { R[id] = { error: String(e?.message || e).slice(0, 200) }; await shot(`cap-${id}-error`).catch(() => {}); } console.log(t(), id, JSON.stringify(R[id]).slice(0, 300)); };
await step('C368165', async () => { const w = (await workOrders(a, 'S10043-18248'))[0] ?? (await workOrders(a, 'S-18248'))[0];
  await p.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  const lab = p.getByText(/^\s*Lead Technician\s*$/i).first(); const blk = lab.locator('xpath=..'); await shot('cap-C368165'); return { status: w.status, box: await box(blk) }; });
await step('C368181', async () => { await p.goto(`${APP}/customers`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  const s = p.locator('input[placeholder*="earch" i]:visible').first(); if (!(await s.count())) await p.getByText('Search', { exact: true }).first().click().catch(() => {}); await p.locator('input[placeholder*="earch" i]:visible').first().fill('ZZAUTOTEST Asset Tab Count'); await p.waitForTimeout(3500);
  await p.locator('tbody tr').filter({ hasText: 'ZZAUTOTEST Asset Tab Count' }).first().click(); await p.waitForTimeout(5000);
  await p.locator('.q-tab').filter({ hasText: /^\s*Assets/ }).first().click(); await p.waitForTimeout(3000);
  await p.locator('tbody tr').filter({ hasText: 'TRK-201' }).first().click(); await p.waitForTimeout(5000);
  await p.locator('.q-tab').filter({ hasText: /Work Orders/ }).first().click(); await p.waitForTimeout(4000);
  await shot('cap-C368181'); return { url: p.url().replace(APP, ''), tab: await box(p.locator('.q-tab--active').first()), tabText: await p.locator('.q-tab--active').first().innerText().catch(() => null), rows: await p.locator('tbody tr').count(), table: await box(p.locator('table').last()) }; });
await step('C368216', async () => { await p.goto(`${APP}/parts/part-sales`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  await p.locator('tbody tr').first().click(); await p.waitForTimeout(6000); const card = p.locator('.q-card').first(); await shot('cap-C368216'); return { url: p.url().replace(APP, ''), card: await box(card), text: (await card.innerText()).replace(/\s+/g, ' ').slice(0, 200) }; });
await step('C368242', async () => { await p.goto(`${APP}/administration/staff`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  await shot('cap-C368242'); return { head: await box(p.locator('thead').first()), heads: (await p.locator('thead th').allInnerTexts()).map((x) => x.trim()).filter(Boolean), firstRow: await box(p.locator('tbody tr').first()) }; });
await step('C368247', async () => { await p.goto(`${APP}/imported-work-orders/c20c0213-3e14-40c9-8e84-a49bbbfe3202`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  const card = p.locator('.q-card').first(); await shot('cap-C368247'); return { card: await box(card), text: (await card.innerText()).replace(/\s+/g, ' ').slice(0, 200), hasLead: /Lead Tech/i.test(await p.locator('body').innerText()) }; });
await step('C368221', async () => { await p.goto(`${APP}/parts/returns`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  await p.locator('.q-tab').filter({ hasText: /Credits/ }).first().click(); await p.waitForTimeout(3000); const before = await p.locator('.q-tab--active').first().innerText().catch(() => null);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); await shot('cap-C368221');
  return { before: before?.replace(/\s+/g, ' '), after: (await p.locator('.q-tab--active').first().innerText().catch(() => null))?.replace(/\s+/g, ' '), tab: await box(p.locator('.q-tab--active').first()), url: p.url().replace(APP, '') }; });
fs.writeFileSync(path.join(EV, 'caps2x.json'), JSON.stringify(R, null, 1)); await done(browser);
