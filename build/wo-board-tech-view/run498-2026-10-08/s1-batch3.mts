/**
 * S1 batch 3 (2026-10-08): C96911 switching keeps tab/search/filter, C96914 same results + Schedule round
 * trip, C96920 change made offline is not saved, C96919 control check, C96915 List sort vs dragged order.
 * Each case makes its own customer and work orders first (names as the case gives them).
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api, candidates, customer, workOrder, workOrders, vehicle } from './data.mts';
import { EV, t, shot, display, active, tab, activeTab, search, searchValue, read, groupCounts, columnHeads } from './wob.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = {};
const prefCalls: string[] = [];
p.on('request', (q) => { if (/preference/i.test(q.url())) prefCalls.push(`${q.method()} ${q.url().replace(/^https:\/\/[^/]+/, '')} ${(q.postData() || '').slice(0, 200)}`); });
const techs = await candidates(a);
const tA = techs.find((x) => x.name === 'Ayesha Khan')!;
const tB = techs.find((x) => x.name !== 'Ayesha Khan' && x.name !== 'Admin ShopView')!;
console.log(t(), 'Tech-A', tA?.name, '| Tech-B', tB?.name);
const go = async () => { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); };
async function ensure(name: string, unit: string, plan: { lead: string | null; here?: boolean }[]) {
  const have = await workOrders(a, name);
  if (have.length) return { c: null, wos: have, reused: true };
  const c = await customer(a, name, unit);
  for (const w of plan) await workOrder(a, c, 'approved', w.lead, !!w.here);
  return { c, wos: await workOrders(a, name), reused: false };
}
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 2500));
}
const statusChip = () => p.locator('[data-test-id="filter_chip_status"]').innerText().catch(() => null);
const hereChip = () => p.locator('[data-test-id="filter_chip_vehicleHere"]').innerText().catch(() => null);

// ── C96911 ──────────────────────────────────────────────────────────────
await run('C96911', async () => {
  // the customer already existed on the branch with two work orders (not all Approved, no leads):
  // shape it to what the case needs — exactly three Approved, led by Tech-A, Tech-B and nobody
  let fw = await workOrders(a, 'ZZAUTOTEST Fibridge');
  const fc = fw.length ? null : await customer(a, 'ZZAUTOTEST Fibridge', 'ZZFB-1');
  if (fc) for (let i = 0; i < 3; i++) await workOrder(a, fc, 'approved', null);
  fw = await workOrders(a, 'ZZAUTOTEST Fibridge');
  if (fw.length < 3) { const c = await customer(a, 'ZZAUTOTEST Fibridge', 'ZZFB-1'); for (let i = fw.length; i < 3; i++) await workOrder(a, c, 'approved', null); fw = await workOrders(a, 'ZZAUTOTEST Fibridge'); }
  const leads = [tA.id, tB.id, null];
  for (const [i, w] of fw.slice(0, 3).entries()) {
    if (w.status !== 'approved') await a.post('/api/work-orders/change-status', { id: w.id, status: 'approved' });
    await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: leads[i] });
  }
  const f = { wos: await workOrders(a, 'ZZAUTOTEST Fibridge') };
  const s = await ensure('ZZAUTOTEST Fisquare', 'ZZFS-1', [{ lead: tA.id }]);
  R.C96911 = { fibridge: f.wos.map((w: any) => `${w.number} ${w.status} ${w.techAssignedFirstName ?? 'none'}`), fisquare: s.wos.map((w: any) => w.number) };
  await go(); await display(p, 'List'); await tab(p, 'All'); await search(p, 'ZZAUTOTEST Fibridge');
  await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(800);
  await p.locator('[data-test-id="filter_option_status_approved"]').click(); await p.waitForTimeout(800);
  await p.keyboard.press('Escape'); await p.waitForTimeout(3000);
  await p.evaluate('window.__zzNoReload = 1');
  for (const d of ['List', 'Tech View', 'Board View', 'List']) {
    const t0 = Date.now(); await display(p, d);
    R.C96911[d + (R.C96911[d] ? ' (back)' : '')] = { active: await active(p), noReload: await p.evaluate('window.__zzNoReload === 1'), tab: await activeTab(p), search: await searchValue(p), statusChip: await statusChip(), wos: await read(p, d),
      counts: d === 'Tech View' ? await groupCounts(p) : d === 'Board View' ? await columnHeads(p) : undefined, ms: Date.now() - t0 };
    await shot(p, `C96911-${d.replace(' ', '')}`);
  }
  await p.locator('[data-test-id="clear_filters"]').click().catch(() => {}); await p.waitForTimeout(1500);
});

// ── C96914 ──────────────────────────────────────────────────────────────
await run('C96914', async () => {
  const name = 'ZZAUTOTEST F1 Same Results';
  let have = await workOrders(a, name);
  if (!have.length) {
    const c = await customer(a, name, 'ZZSR1A');
    const v2 = await vehicle(a, c, 'ZZSR2B'), v3 = await vehicle(a, c, 'ZZSR3C');
    await workOrder(a, c, 'approved', tA.id, true);
    await workOrder(a, { ...c, vehicle_id: v2 }, 'approved', tB.id);
    await workOrder(a, { ...c, vehicle_id: v3 }, 'approved', null);
    have = await workOrders(a, name);
  }
  R.C96914 = { wos: have.map((w: any) => `${w.number} unit=${w.unit} here=${w.vehicleHere} lead=${w.techAssignedFirstName ?? 'none'}`), bySearch: {}, byFilter: {}, roundTrip: {} };
  await go(); await tab(p, 'All');
  for (const d of ['List', 'Tech View', 'Board View']) { await display(p, d); await search(p, 'ZZSR2B'); R.C96914.bySearch[d] = await read(p, d); await shot(p, `C96914-search-${d.replace(' ', '')}`); }
  // filter: Asset on Site = Yes, kept narrow with the customer name in Search (a whole-branch filter is too big to read row by row)
  await display(p, 'List'); await search(p, name);
  await p.locator('[data-test-id="filter_chip_vehicleHere"]').click(); await p.waitForTimeout(800);
  await p.locator('[data-test-id="filter_option_vehicleHere_1"]').click(); await p.waitForTimeout(800);
  await p.keyboard.press('Escape'); await p.waitForTimeout(3000);
  for (const d of ['List', 'Tech View', 'Board View']) { await display(p, d); R.C96914.byFilter[d] = { chip: await hereChip(), wos: await read(p, d) }; await shot(p, `C96914-filter-${d.replace(' ', '')}`); }
  for (const d of ['Board View', 'Tech View', 'List']) {
    await display(p, d);
    await p.locator('a, .q-btn, button').filter({ hasText: /^\s*Schedule\s*$/ }).first().click(); await p.waitForTimeout(4000);
    const url = p.url();
    await p.locator('a, .q-btn, button').filter({ hasText: /^\s*Work Orders\s*$/ }).first().click(); await p.waitForTimeout(4500);
    R.C96914.roundTrip[d] = { scheduleUrl: url.replace(APP, ''), back: p.url().replace(APP, ''), display: await active(p), chip: await hereChip(), search: await searchValue(p), wos: Object.keys(await read(p, d)).length };
    await shot(p, `C96914-roundtrip-${d.replace(' ', '')}`);
  }
  await p.locator('[data-test-id="clear_filters"]').click().catch(() => {}); await p.waitForTimeout(1500);
});

// ── C96919 control check ────────────────────────────────────────────────
await run('C96919', async () => {
  await ensure('ZZAUTOTEST F1 Unreadable Display', 'ZZUD-1', [{ lead: tA.id }]);
  await go(); await display(p, 'Board View'); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  R.C96919 = { afterRefresh: await active(p) }; await shot(p, 'C96919-after-refresh');
});

// ── C96920 offline ──────────────────────────────────────────────────────
await run('C96920', async () => {
  await ensure('ZZAUTOTEST F1 Unsaved Display', 'ZZUS-1', [{ lead: tA.id }]);
  await go(); for (const d of ['Tech View', 'List', 'Board View']) await display(p, d);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  R.C96920 = { start: await active(p), failed: [], errors: [] };
  p.on('requestfailed', (q) => { if (R.C96920.offline) R.C96920.failed.push(`${q.method()} ${q.url().replace(/^https:\/\/[^/]+/, '').slice(0, 120)}`); });
  p.on('pageerror', (e) => { if (R.C96920.offline) R.C96920.errors.push(String(e).slice(0, 200)); });
  p.on('console', (m) => { if (R.C96920.offline && m.type() === 'error') R.C96920.errors.push(m.text().slice(0, 200)); });
  R.C96920.offline = true; await p.context().setOffline(true);
  try {
  await p.locator('[aria-label="Tech View"]').first().click(); await p.waitForTimeout(4000); R.C96920.offlineTech = await active(p); await shot(p, 'C96920-offline-tech');
  R.C96920.bodyText = (await p.evaluate('document.body.innerText')).slice(0, 300);
  await p.locator('[aria-label="List"]').first().click({ timeout: 8000 }).catch((e) => { R.C96920.listClick = String(e.message).slice(0, 80); }); await p.waitForTimeout(3000); R.C96920.offlineList = await active(p);
  R.C96920.offlineMessages = await p.evaluate(`[...document.querySelectorAll('.q-notification,[role=alert]')].map(e => e.innerText.trim()).filter(Boolean)`);
  } finally { await p.context().setOffline(false); R.C96920.offline = false; await p.waitForTimeout(1500); }
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  R.C96920.afterReconnect = await active(p); await shot(p, 'C96920-after-reconnect');
  await display(p, 'Tech View'); await p.waitForTimeout(1500); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  R.C96920.afterOnlineSwitch = await active(p); await shot(p, 'C96920-after-online-switch');
});

await run('C96920b', async () => {
  const js = (await p.evaluate(`performance.getEntriesByType('resource').map(e => e.name).find(n => /WorkOrdersTechViewDisplay.*\\.js/.test(n)) || ''`)) as string;
  const head = js ? await p.evaluate(`fetch(${'`'}${'$'}{${JSON.stringify(js)}}${'`'}, { cache: 'no-store' }).then(r => r.headers.get('cache-control') + ' | etag=' + r.headers.get('etag') + ' | expires=' + r.headers.get('expires'))`).catch((e) => String(e)) : 'no file';
  R.C96920b = { techViewFile: js.replace(APP, ''), cacheControl: head, failedPuts: 0 };
  p.on('response', (r) => { if (r.request().method() === 'PUT' && /work-orders-list/.test(r.url())) R.C96920b.failedPuts += r.status() >= 500 ? 1 : 0; });
  // the case's point is "a display change that cannot be SAVED": block only the save, keep everything else online
  await go(); await display(p, 'Board View'); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  R.C96920b.start = await active(p);
  // abort() makes the QA branch's own 'QA env is sleeping' guard redirect the page, so the save is answered with a server error instead
  const block = (r: any) => (r.request().method() === 'PUT' ? r.fulfill({ status: 500, contentType: 'application/json', body: '{"errors":[{"error":"zz test: save refused"}]}' }) : r.continue());
  await p.route('**/api/users/me/preferences/work-orders-list', block);
  await display(p, 'Tech View'); R.C96920b.savingBlockedTech = await active(p); await shot(p, 'C96920b-save-blocked-tech');
  R.C96920b.messages = await p.evaluate(`[...document.querySelectorAll('.q-notification,[role=alert]')].map(e => e.innerText.trim()).filter(Boolean)`);
  await display(p, 'List'); R.C96920b.savingBlockedList = await active(p);
  await p.unroute('**/api/users/me/preferences/work-orders-list', block);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  R.C96920b.afterReload = await active(p); await shot(p, 'C96920b-after-reload');
  await display(p, 'Tech View'); await p.waitForTimeout(1500); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  R.C96920b.afterOnlineSwitch = await active(p); await shot(p, 'C96920b-after-online-switch');
  await display(p, 'List');
});

// ── C96915 List sort vs dragged order ───────────────────────────────────
await run('C96915', async () => {
  const name = 'ZZAUTOTEST F1 List Sort';
  let have = await workOrders(a, name);
  if (!have.length) { const c = await customer(a, name, 'ZZLS-1'); for (let i = 0; i < 3; i++) { await workOrder(a, c, 'approved', tA.id); await p.waitForTimeout(2000); } have = await workOrders(a, name); }
  R.C96915 = { wos: have.map((w: any) => `${w.number} ${w.startDate}`) };
  await go(); await display(p, 'List'); await tab(p, 'All'); await search(p, name);
  const hdr = p.locator('th').filter({ hasText: /^\s*Created on/i }).first();
  const sortState = () => hdr.evaluate((e: Element) => `${e.className} | aria-sort=${e.getAttribute('aria-sort')} | ${(e as HTMLElement).innerText.replace(/\s+/g, ' ')}`);
  R.C96915.headerBefore = await sortState();
  await hdr.click(); await p.waitForTimeout(2500);
  let order = Object.keys(await read(p, 'List'));
  const nums = have.map((w: any) => w.number);
  const newestFirst = [...have].sort((x: any, y: any) => (x.startDate < y.startDate ? 1 : -1)).map((w: any) => w.number);
  if (order.join() !== newestFirst.join()) { await hdr.click(); await p.waitForTimeout(2500); order = Object.keys(await read(p, 'List')); }
  R.C96915.listOrder = order; R.C96915.newestFirst = newestFirst; R.C96915.headerChosen = await sortState();
  await shot(p, 'C96915-list-sorted');
  await display(p, 'Tech View');
  R.C96915.techBefore = Object.keys(await read(p, 'Tech View')).filter((n) => nums.includes(n));
  const last = R.C96915.techBefore[R.C96915.techBefore.length - 1], first = R.C96915.techBefore[0];
  const row = (n: string) => p.locator('.q-virtual-scroll__content > tr').filter({ hasText: n }).first();
  R.C96915.rowAttrs = await row(last).evaluate((e: Element) => `draggable=${e.getAttribute('draggable')} class=${e.className} grip=${!!e.querySelector('[class*=grip],[class*=drag],[class*=handle]')}`);
  const src = await row(last).boundingBox(), dst = await row(first).boundingBox();
  if (src && dst) {
    const grip = row(last).locator('[class*=grip],[class*=drag-handle],[class*=handle]').first();
    const gb = (await grip.count()) ? await grip.boundingBox() : null;
    const sx = gb ? gb.x + gb.width / 2 : src.x + 40, sy = gb ? gb.y + gb.height / 2 : src.y + src.height / 2;
    await p.mouse.move(sx, sy); await p.mouse.down(); await p.mouse.move(sx, sy + 5, { steps: 3 });
    await p.mouse.move(sx, dst.y + 4, { steps: 20 }); await p.waitForTimeout(400); await p.mouse.up(); await p.waitForTimeout(3000);
  }
  R.C96915.techAfter = Object.keys(await read(p, 'Tech View')).filter((n) => nums.includes(n));
  R.C96915.toasts = await p.evaluate(`[...document.querySelectorAll('.q-notification,[role=alert],.q-dialog')].map(e => e.innerText.trim().slice(0, 200)).filter(Boolean)`);
  await shot(p, 'C96915-tech-after-drag');
  await display(p, 'Board View'); R.C96915.board = Object.keys(await read(p, 'Board View')).filter((n) => nums.includes(n)); await shot(p, 'C96915-board');
  await display(p, 'List'); R.C96915.listBack = Object.keys(await read(p, 'List')).filter((n) => nums.includes(n)); R.C96915.headerBack = await sortState();
  await shot(p, 'C96915-list-back');
});

R.prefCalls = [...new Set(prefCalls)].slice(0, 40);
fs.writeFileSync(path.join(EV, 's1-batch3.json'), JSON.stringify(R, null, 1));
console.log(t(), 'PREF', JSON.stringify(R.prefCalls).slice(0, 2500));
await done(browser);
