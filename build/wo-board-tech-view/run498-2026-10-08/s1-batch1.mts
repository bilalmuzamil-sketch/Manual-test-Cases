/**
 * S1 batch 1 (2026-10-08) — C96909 switcher, C96918 no-match message, C154885 narrow window.
 * Read-only on data. Every step is bounded; screenshots and readings go to evidence/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done } from './session.mts';

const here = path.dirname(new URL(import.meta.url).pathname);
const EV = path.join(here, 'evidence');
const t = () => new Date().toISOString().slice(11, 19);
const { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
const shot = (n: string) => p.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
const R: Record<string, any> = {};

const switcher = () => p.evaluate(`(() => {
  const want = ['List', 'Tech View', 'Board View'];
  return want.map(l => {
    const e = [...document.querySelectorAll('[aria-label]')].find(x => x.getAttribute('aria-label') === l && x.getBoundingClientRect().width > 0);
    if (!e) return { label: l, present: false };
    const btn = e.closest('button,[role=button],.q-btn') || e;
    return { label: l, present: true, pressed: btn.getAttribute('aria-pressed'), cls: String(btn.className),
             bg: getComputedStyle(btn).backgroundColor, color: getComputedStyle(btn).color, title: btn.getAttribute('title') };
  });
})()`) as Promise<any[]>;
const click = async (l: string) => { await p.locator(`[aria-label="${l}"]`).first().click(); await p.waitForTimeout(2500); };

// ── C96909 ─────────────────────────────────────────────────────────────
await p.getByText('All', { exact: true }).first().click().catch(() => {});
await p.waitForTimeout(2000);
R.C96909 = { start: await switcher() }; await shot('C96909-1-list');
for (const l of ['Tech View', 'Board View', 'List']) { await click(l); R.C96909[l] = await switcher(); await shot(`C96909-${l.replace(' ', '')}`); }
// hover tooltips
R.C96909.tooltips = {};
for (const l of ['List', 'Tech View', 'Board View']) {
  await p.locator(`[aria-label="${l}"]`).first().hover(); await p.waitForTimeout(900);
  R.C96909.tooltips[l] = await p.evaluate(`[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].map(e => e.innerText.trim()).filter(Boolean)`);
}
console.log(t(), 'C96909', JSON.stringify(R.C96909).slice(0, 1500));

// ── C96918 ─────────────────────────────────────────────────────────────
const area = () => p.evaluate(`(() => {
  const m = document.querySelector('main, .q-page') || document.body;
  return { text: m.innerText.replace(/\\s+/g, ' ').slice(0, 1500),
           buttons: [...m.querySelectorAll('button,.q-btn')].filter(b => b.getBoundingClientRect().width > 0).map(b => b.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean),
           rows: document.querySelectorAll('tbody tr').length };
})()`) as Promise<any>;
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

// ── C154885 ────────────────────────────────────────────────────────────
await click('Board View');
await p.setViewportSize({ width: 900, height: 1000 }); await p.waitForTimeout(3000);
R.C154885 = { narrow: { switcher: await switcher(), text: (await area()).text.slice(0, 400) } }; await shot('C154885-narrow-900');
await p.setViewportSize({ width: 1600, height: 1000 }); await p.waitForTimeout(3000);
R.C154885.wide = await switcher(); await shot('C154885-wide-1600');
console.log(t(), 'C154885', JSON.stringify(R.C154885).slice(0, 1500));
await click('List');
fs.writeFileSync(path.join(EV, 's1-batch1.json'), JSON.stringify(R, null, 1));
await done(browser);
