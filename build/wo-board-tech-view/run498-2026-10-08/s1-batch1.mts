/**
 * S1 batch 1 (2026-10-08) — C96909 switcher, C96918 no-match message, C154885 narrow window.
 * Read-only on data. Every step is bounded; screenshots and readings go to evidence/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done } from './session.mts';
import { api } from './data.mts';
import { startState, screenDisplay, prefRead } from './fixup-1017.mts';

const here = path.dirname(new URL(import.meta.url).pathname);
// 16 Oct 2026 (build v26.40.18): evidence goes to WOB_EV when set (staging re-run), and ONLY=C96909 skips the other two cases.
// 17 Oct 2026: fix-up — ONLY now picks any of the three (C96909, C96918, C154885); before, ONLY made the script stop after C96909.
const EV = process.env.WOB_EV || path.join(here, 'evidence');
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean); const want = (id: string) => !ONLY.length || ONLY.includes(id);
const t = () => new Date().toISOString().slice(11, 19);
const { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
const shot = (n: string) => p.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
const R: Record<string, any> = {};
// 17 Oct 2026: fix-up — log the saved display / collapsed groups found BEFORE anything is set, then set List (C96909's start) and read it back
R.startState = await startState(p, api(p), 's1-batch1', { display: 'List' });

const switcher = () => p.evaluate(`(() => {
  const want = ['List', 'Tech View', 'Board View'];
  return want.map(l => {
    const e = [...document.querySelectorAll('[aria-label]')].find(x => x.getAttribute('aria-label') === l && x.getBoundingClientRect().width > 0);
    if (!e) return { label: l, present: false };
    const btn = e.closest('button,[role=button],.q-btn') || e;
    const r = btn.getBoundingClientRect();
    return { label: l, present: true, x: Math.round(r.left), pressed: btn.getAttribute('aria-pressed'), cls: String(btn.className),
             bg: getComputedStyle(btn).backgroundColor, color: getComputedStyle(btn).color, title: btn.getAttribute('title') };
  });
})()`) as Promise<any[]>;
const click = async (l: string) => { await p.locator(`[aria-label="${l}"]`).first().click(); await p.waitForTimeout(2500); };

// ── C96909 ─────────────────────────────────────────────────────────────
// 17 Oct 2026: fix-up — each case runs only when ONLY names it (or ONLY is empty); the old exit after C96909 stopped C154885 ever running
if (want('C96909')) {
// 16 Oct 2026: the precondition says the page shows List at the start; the page remembers the last display (Board View on the first
// 16 Oct try), so choose List and open the page afresh before the first look.
await p.locator('[aria-label="List"]').first().click().catch(() => {}); await p.waitForTimeout(2000);
await p.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(5000);
await p.getByText('All', { exact: true }).first().click().catch(() => {});
await p.waitForTimeout(2000);
R.C96909 = { start: await switcher() }; await shot('C96909-1-list');
// 16 Oct 2026: the case now judges "exactly three options" and the tooltip order left to right — count the switcher's buttons
R.C96909.switcherButtons = await p.evaluate(`(() => { const e = [...document.querySelectorAll('[aria-label="List"]')].find(x => x.getBoundingClientRect().width > 0); const b = e && (e.closest('button,.q-btn') || e); const g = b && (b.closest('.q-btn-group,.q-btn-toggle,[role=group]') || b.parentElement);
  return g ? [...g.querySelectorAll('button,.q-btn')].filter(x => x.getBoundingClientRect().width > 0).map(x => ({ label: x.getAttribute('aria-label'), x: Math.round(x.getBoundingClientRect().left) })) : null; })()`);
for (const l of ['Tech View', 'Board View', 'List']) { await click(l); R.C96909[l] = await switcher(); await shot(`C96909-${l.replace(' ', '')}`); }
// hover tooltips
R.C96909.tooltips = {};
for (const l of ['List', 'Tech View', 'Board View']) {
  await p.locator(`[aria-label="${l}"]`).first().hover(); await p.waitForTimeout(900);
  R.C96909.tooltips[l] = await p.evaluate(`[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].map(e => e.innerText.trim()).filter(Boolean)`);
  await shot(`C96909-tip-${l.replace(' ', '')}`);
}
console.log(t(), 'C96909', JSON.stringify(R.C96909).slice(0, 1500));
fs.writeFileSync(path.join(EV, 'C96909-s1-batch1.json'), JSON.stringify(R, null, 1));
}

// 17 Oct 2026: fix-up — area() moved above the case gates (C154885 uses it too)
const area = () => p.evaluate(`(() => {
  const m = document.querySelector('main, .q-page') || document.body;
  return { text: m.innerText.replace(/\\s+/g, ' ').slice(0, 1500),
           buttons: [...m.querySelectorAll('button,.q-btn')].filter(b => b.getBoundingClientRect().width > 0).map(b => b.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean),
           rows: document.querySelectorAll('tbody tr').length };
})()`) as Promise<any>;
// ── C96918 ─────────────────────────────────────────────────────────────
if (want('C96918')) {
R.C96918 = {};
// open the toolbar search and type
const searchBtn = p.locator('button:has-text("Search"), .q-btn:has-text("Search")').last();
await searchBtn.click().catch(() => {});
await p.waitForTimeout(800);
const box = p.locator('input[placeholder*="Search" i]').last();
await box.fill('ZZNOMATCH123'); await p.waitForTimeout(3500);
for (const l of ['List', 'Tech View', 'Board View']) { await click(l); R.C96918[l] = await area(); await shot(`C96918-${l.replace(' ', '')}`); }
const clear = p.locator('button:has-text("Clear")').first();
R.C96918.clearButton = await clear.innerText().catch(() => null);
await clear.click().catch(() => {}); await p.waitForTimeout(3000); await click('List');
R.C96918.afterClear = await area(); await shot('C96918-after-clear');
console.log(t(), 'C96918', JSON.stringify(R.C96918).slice(0, 2500));
}

// ── C154885 ────────────────────────────────────────────────────────────
if (want('C154885')) {
await click('Board View');
// 17 Oct 2026: fix-up — read back that Board View IS chosen before narrowing (the wide reading after is the positive control for the narrow one)
const chosenWide = await screenDisplay(p);
await p.setViewportSize({ width: 900, height: 1000 }); await p.waitForTimeout(3000);
R.C154885 = { chosenBeforeNarrow: chosenWide, narrow: { switcher: await switcher(), text: (await area()).text.slice(0, 400) } }; await shot('C154885-narrow-900');
await p.setViewportSize({ width: 1600, height: 1000 }); await p.waitForTimeout(3000);
R.C154885.wide = await switcher(); await shot('C154885-wide-1600');
R.C154885.wideActive = await screenDisplay(p); R.C154885.savedDisplayAfter = (await prefRead(api(p))).display; // 17 Oct 2026: fix-up — the saved choice, read
console.log(t(), 'C154885', JSON.stringify(R.C154885).slice(0, 1500));
}
await click('List');
fs.writeFileSync(path.join(EV, 's1-batch1.json'), JSON.stringify(R, null, 1));
await done(browser);
