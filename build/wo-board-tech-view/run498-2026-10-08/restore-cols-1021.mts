/** restore-cols-1021.mts — 21 Oct 2026: put the signed-in Admin's Work Orders columns back to the state the suite expects (c96975-1021 left
 *  Tech View's Service Advisor and Assigned Techs off and List's Progress off): List Service Advisor + Progress on; Tech View Service Advisor,
 *  Progress and Assigned Techs on. Reads the switches back. */
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { t, display, tab } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000);
const W = (ms: number, pg: Page = p) => pg.waitForTimeout(ms);
const shot = (_pg: Page, _n: string) => Promise.resolve();
const menuBtn: Record<string, string> = { List: 'button_column_selection', 'Tech View': 'button_tech_view_column_selection' };
/** open the display's Column Selection, optionally set switches by label, close it; returns the labels that are ON */
async function columns(pg: Page, d: 'List' | 'Tech View', set?: Record<string, boolean>, pic?: string) {
  await pg.locator(`[data-test-id="${menuBtn[d]}"]`).first().click().catch(() => {}); await W(1200, pg);
  const read = () => pg.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); if (!m) return null;
    return [...m.querySelectorAll('[data-test-id^="toggle_"], .q-toggle')].map(e => { const sw = e.matches('[role=switch]') ? e : e.querySelector('[role=switch],[aria-checked]'); return { label: ((e.closest('.q-item') || e).innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 30), on: sw ? sw.getAttribute('aria-checked') === 'true' : !!e.querySelector('.q-toggle__inner--truthy'), tid: e.getAttribute('data-test-id') }; }); })()`) as Promise<{ label: string; on: boolean; tid: string | null }[] | null>;
  let r = await read();
  if (set) for (const [lab, on] of Object.entries(set)) { const it = (r ?? []).find((x) => x.label.toLowerCase() === lab.toLowerCase());
    if (it && it.on !== on) { const loc = it.tid ? pg.locator(`.q-menu [data-test-id="${it.tid}"]`).first() : pg.locator('.q-menu .q-toggle').filter({ hasText: lab }).first(); await loc.click().catch(() => {}); await W(1000, pg); r = await read(); } }
  if (pic) await shot(pg, pic);
  await pg.keyboard.press('Escape').catch(() => {}); await W(900, pg);
  if (r === null) console.log(t(), 'COLUMN MENU NOT READ', d);
  return (r ?? []).filter((x) => x.on).map((x) => x.label);
}
const heads = (pg: Page) => pg.evaluate(`[...new Set([...document.querySelectorAll('thead th')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/arrow_drop_(up|down)|arrow_(up|down)ward/g, '').replace(/\\s+/g, ' ').trim()).filter(Boolean))]`).catch(() => []) as Promise<string[]>;
await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(5000); await tab(p, 'All').catch(() => {});
await display(p, 'List'); const list = await columns(p, 'List', { 'Service Advisor': true, Progress: true });
await display(p, 'Tech View'); const tech = await columns(p, 'Tech View', { 'Service Advisor': true, Progress: true, 'Assigned Techs': true });
console.log(t(), 'RESTORED', JSON.stringify({ list, tech })); await done(browser);
