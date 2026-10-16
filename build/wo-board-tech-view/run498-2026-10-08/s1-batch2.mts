/**
 * S1 batch 2 (2026-10-08) — C96913 tabs in every display, C154884 Assigned to me, C96921 two tabs.
 * Each case makes its own customer and work orders first (named as the case names them).
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { api, candidates, customer, workOrder } from './data.mts';
import { startState, prefRead, waitSavedDisplay } from './fixup-1017.mts';

const here = path.dirname(new URL(import.meta.url).pathname);
// 17 Oct 2026: fix-up — evidence goes to WOB_EV when set (it went to RUN/evidence in the 16 Oct staging run), and ONLY picks the cases
const EV = process.env.WOB_EV || path.join(here, 'evidence');
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean); const want = (id: string) => !ONLY.length || ONLY.includes(id);
const t = () => new Date().toISOString().slice(11, 19);
const { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = {};
// 17 Oct 2026: fix-up — log the saved display found BEFORE anything is set, then start from List and read it back (C96921's last
// choice is Board View, so a start already in Board View would make its reading prove nothing)
R.startState = await startState(p, a, 's1-batch2', { display: 'List' });
const shot = (pg: Page, n: string) => pg.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
const click = async (pg: Page, l: string) => { await pg.locator(`[aria-label="${l}"]`).first().click(); await pg.waitForTimeout(2500); };
const active = (pg: Page) => pg.evaluate(`(['List','Tech View','Board View'].find(l => { const e = [...document.querySelectorAll('[aria-label="' + l + '"]')].find(x => x.getBoundingClientRect().width > 0); const b = e && (e.closest('button,.q-btn') || e); return b && b.getAttribute('aria-pressed') === 'true'; }) || null)`);
const numbers = (pg: Page) => pg.evaluate(`(() => { const m = document.querySelector('main, .q-page') || document.body; return [...new Set((m.innerText.match(/\\bS\\d+-\\d+\\b/g) || []))].sort(); })()`) as Promise<string[]>;
const tab = async (pg: Page, name: string) => { await pg.locator('.q-tab, [role=tab]').filter({ hasText: new RegExp('^\\s*' + name + '\\s*$') }).first().click(); await pg.waitForTimeout(2500); };
const search = async (pg: Page, q: string) => {
  const box = pg.locator('input[placeholder*="Search" i]').last();
  if (!(await box.isVisible().catch(() => false))) { await pg.locator('button:has-text("Search"), .q-btn:has-text("Search")').last().click().catch(() => {}); await pg.waitForTimeout(800); }
  await box.fill(q); await pg.waitForTimeout(3500);
};
const techs = await candidates(a);
const me = techs.find((x) => x.name === 'Admin ShopView');
const tA = techs.find((x) => x.name !== 'Admin ShopView')!;
console.log(t(), 'technicians', techs.length, '| me', !!me, '| Tech-A', tA?.name);

async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return; // 17 Oct 2026: fix-up
  try { await f(); await (globalThis as any).__shotEach?.(id); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 1400));
}

// ── C96913 the four tabs in every display ───────────────────────────────
await run('C96913', async () => {
  const c = await customer(a, 'ZZAUTOTEST F1 Tabs', 'ZZT-1');
  R.C96913 = { made: {} };
  for (const s of ['estimate', 'approved', 'complete']) {
    try { R.C96913.made[s] = await workOrder(a, c, s, tA.id); } catch (e: any) { R.C96913.made[s] = 'ERR ' + String(e.message).slice(0, 200); }
  }
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3000);
  await search(p, 'ZZAUTOTEST F1 Tabs');
  for (const d of ['List', 'Tech View', 'Board View']) {
    await click(p, d); R.C96913[d] = {};
    for (const tb of ['All', 'Work Orders', 'Estimates', 'Completed']) { await tab(p, tb); R.C96913[d][tb] = await numbers(p); }
    await shot(p, `C96913-${d.replace(' ', '')}`);
  }
  await click(p, 'List'); await tab(p, 'All');
});

// ── C154884 Assigned to me ──────────────────────────────────────────────
await run('C154884', async () => {
  const c = await customer(a, 'ZZAUTOTEST F1 Assigned To Me', 'ZZM-1');
  R.C154884 = { me: me?.name ?? null, made: [] };
  for (const lead of [me?.id ?? null, me?.id ?? null, tA.id, null]) R.C154884.made.push(await workOrder(a, c, 'approved', lead));
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3000);
  await search(p, 'ZZAUTOTEST F1 Assigned To Me');
  R.C154884.allBefore = await numbers(p);
  await p.locator('button:has-text("Assigned to me"), .q-btn:has-text("Assigned to me")').first().click(); await p.waitForTimeout(3000);
  for (const d of ['List', 'Tech View', 'Board View']) { await click(p, d); R.C154884[d] = await numbers(p); await shot(p, `C154884-${d.replace(' ', '')}`); }
  await p.locator('button:has-text("Assigned to me"), .q-btn:has-text("Assigned to me")').first().click(); await p.waitForTimeout(1500);
  await click(p, 'List');
});

// ── C96921 two tabs, last change wins ───────────────────────────────────
await run('C96921', async () => {
  const c = await customer(a, 'ZZAUTOTEST F1 Two Tabs', 'ZZW-1');
  await workOrder(a, c, 'approved', tA.id);
  const A = p, B = await p.context().newPage();
  await A.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await B.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' });
  await A.waitForTimeout(4000);
  // 17 Oct 2026: fix-up — each tab's choice is read back (on screen, and the saved choice after it) so the final reading has a control
  R.C96921 = { startA: await active(A), startB: await active(B) };
  await click(A, 'Tech View'); R.C96921.aChose = await active(A); R.C96921.savedAfterA = await waitSavedDisplay(a, 'tech_view');
  await B.waitForTimeout(3000); await click(B, 'Board View'); R.C96921.bChose = await active(B); R.C96921.savedAfterB = await waitSavedDisplay(a, 'board_view'); await B.waitForTimeout(2000);
  await A.reload({ waitUntil: 'domcontentloaded' }); await B.reload({ waitUntil: 'domcontentloaded' }); await A.waitForTimeout(5000);
  const C = await p.context().newPage(); await C.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await C.waitForTimeout(5000);
  R.C96921 = { ...R.C96921, A: await active(A), B: await active(B), C: await active(C), savedAtEnd: (await prefRead(a)).display,
    warnings: await A.evaluate(`[...document.querySelectorAll('.q-notification,[role=alert]')].map(e => e.innerText.trim()).filter(Boolean)`) };
  await shot(A, 'C96921-tabA'); await shot(B, 'C96921-tabB'); await shot(C, 'C96921-tabC');
  await click(A, 'List'); await B.close(); await C.close();
});

fs.writeFileSync(path.join(EV, 's1-batch2.json'), JSON.stringify(R, null, 1));
await done(browser);
