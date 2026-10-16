/**
 * fixup-1017.mts — 17 Oct 2026: fix-up helpers for the run-498 fix-up pass (fixup-1017.txt / run-fixup-1017.sh).
 *
 * WHY: in the full staging run of 16 Oct the page twice came back in Board View after Tech View had been chosen, and later every
 * Tech View group was collapsed. That could be another session using the same staging user, or saved choices left by an earlier
 * script. So every fixed script now, at its start:
 *   1. READS and LOGS what it finds BEFORE it sets anything ("START STATE found …": the saved display, collapsed groups, pins,
 *      filters and density from the work-orders-list preference, and the display the screen shows) — this line tells us later
 *      whether something else changed them;
 *   2. SETS the display (and, where Tech View rows are needed, clears the saved collapsed groups) it needs;
 *   3. READS IT BACK, on screen AND in the saved preference ("START STATE set …").
 * setDisplay() is also used mid-script after a refresh / round trip, so a fall-back to another display is SEEN (logged with what
 * the saved preference said at that moment) instead of silently breaking the next step.
 * Positive controls (Rule 104): a "no collapsed groups" reading is only trusted when the same reading also counted the groups
 * (groups > 0); a display reading is only trusted when the switcher itself was found on screen.
 * New file only — wob.mts, data.mts and session.mts are unchanged (scripts still to run in the main queue use them).
 */
import type { Page } from 'playwright';
import type { Api } from './data.mts';

const t = () => new Date().toISOString().slice(11, 19);
export const PREF = '/api/users/me/preferences/work-orders-list';
export const DISP: Record<string, string> = { 'List': 'list', 'Tech View': 'tech_view', 'Board View': 'board_view' };

/** the display the screen shows (aria-pressed on the switcher) plus whether the switcher is on screen at all (the positive control) */
export const screenDisplay = (p: Page) => p.evaluate(`(() => { const out = { switcher: 0, active: null };
  for (const l of ['List', 'Tech View', 'Board View']) { const e = [...document.querySelectorAll('[aria-label="' + l + '"]')].find(x => x.getBoundingClientRect().width > 0); if (!e) continue; out.switcher++;
    const b = e.closest('button,.q-btn') || e; if (b.getAttribute('aria-pressed') === 'true') out.active = l; }
  return out; })()`).catch(() => ({ switcher: -1, active: null })) as Promise<{ switcher: number; active: string | null }>;

/** the saved Work Orders choices that matter to these checks */
export async function prefRead(a: Api) {
  const r = await a.get(PREF); const v = r?.body?.data?.value ?? {};
  return { status: r?.status ?? 0, display: v.display ?? null, collapsedGroups: v.collapsedGroups ?? null, pinned: (v.pinnedTechnicianIds ?? []).map((x: string) => String(x).slice(0, 8)), filters: v.filters ?? null, density: v.density ?? null, tab: v.tab ?? null };
}

/** poll the saved display until it reads `want` (the save is sent a moment after the click); returns what it last read */
export async function waitSavedDisplay(a: Api, want: string, ms = 10_000) {
  let last: string | null = null;
  for (let i = 0; i < Math.ceil(ms / 1000); i++) { last = (await prefRead(a)).display; if (last === want) return last; await new Promise((r) => setTimeout(r, 1000)); }
  return last;
}

/** Tech View groups on screen: how many, and which are collapsed (first 8 characters of their id) */
export const collapsedOnScreen = (p: Page) => p.evaluate(`(() => { const g = [...document.querySelectorAll('[data-test-id^="tech_view_group_"]')].filter(e => /^tech_view_group_([0-9a-f-]{36}|unassigned)$/.test(e.getAttribute('data-test-id')));
  return { groups: g.length, collapsed: g.filter(e => e.getAttribute('data-collapsed') === 'true').map(e => e.getAttribute('data-test-id').replace('tech_view_group_', '').slice(0, 8)) }; })()`).catch(() => ({ groups: -1, collapsed: [] })) as Promise<{ groups: number; collapsed: string[] }>;

/** expand every collapsed Tech View group on screen (bounded); returns the reading after */
export async function expandAll(p: Page) {
  for (let i = 0; i < 60; i++) {
    const id = await p.evaluate(`(() => { const g = [...document.querySelectorAll('[data-test-id^="tech_view_group_"][data-collapsed="true"]')].find(r => /^tech_view_group_([0-9a-f-]{36}|unassigned)$/.test(r.getAttribute('data-test-id')) && !r.dataset.zzFx); if (!g) return null; g.dataset.zzFx = '1'; return g.getAttribute('data-test-id').replace('tech_view_group_', ''); })()`).catch(() => null);
    if (!id) break;
    await p.locator(`[data-test-id="button_tech_view_group_toggle_${id}"]`).click({ timeout: 8000 }).catch(() => {}); await p.waitForTimeout(1000);
  }
  return collapsedOnScreen(p);
}

/** choose display `d` on screen and read it back on screen AND in the saved preference; up to 3 tries, the page reloaded between */
export async function setDisplay(p: Page, a: Api, d: string, tag: string) {
  const o: any = { want: d, tries: [] as any[] };
  for (let i = 0; i < 3; i++) {
    const before = await screenDisplay(p);
    if (before.active !== d) { await p.locator(`[aria-label="${d}"]`).first().click({ timeout: 10_000 }).catch((e) => { o.clickError = String(e?.message || e).slice(0, 80); }); await p.waitForTimeout(3000); }
    const after = await screenDisplay(p); const saved = await waitSavedDisplay(a, DISP[d]);
    o.tries.push({ before: before.active, switcherFound: after.switcher, screen: after.active, saved });
    if (after.active === d && saved === DISP[d]) { o.ok = true; break; }
    await p.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(5000);
  }
  o.ok = !!o.ok; console.log(t(), 'DISPLAY', tag, JSON.stringify(o)); return o;
}

/** read (and log) the display the page shows right now and the saved one, WITHOUT changing anything — for after a refresh / round trip */
export async function noteDisplay(p: Page, a: Api, tag: string) {
  const o = { screen: (await screenDisplay(p)).active, saved: (await prefRead(a)).display };
  console.log(t(), 'DISPLAY SEEN', tag, JSON.stringify(o)); return o;
}

/** At a script's start: log what is found, then set the display / clear the saved collapsed groups as asked, and read both back. */
export async function startState(p: Page, a: Api, tag: string, opts: { display?: string; clearCollapsed?: boolean } = {}) {
  const o: any = { found: { saved: await prefRead(a), screen: await screenDisplay(p) } };
  console.log(t(), 'START STATE found', tag, JSON.stringify(o.found));
  if (opts.clearCollapsed) {
    const v = (await a.get(PREF))?.body?.data?.value ?? {};
    o.clearCollapsedPut = (await a.put(PREF, { value: { ...v, collapsedGroups: [] } }))?.status;
    await p.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(5000);
    o.collapsedSavedAfter = (await prefRead(a)).collapsedGroups;
  }
  if (opts.display) o.display = await setDisplay(p, a, opts.display, tag);
  if (opts.display === 'Tech View') { o.groupsOnScreen = await collapsedOnScreen(p); if (opts.clearCollapsed && o.groupsOnScreen.collapsed.length) o.groupsAfterExpand = await expandAll(p); }
  o.savedAfter = await prefRead(a);
  console.log(t(), 'START STATE set', tag, JSON.stringify({ ...o, found: undefined }));
  return o;
}

/** bound any wait: resolves to `fallback` (and logs) if `pr` has not settled within `ms` */
export async function capped<T>(pr: Promise<T>, ms: number, label: string, fallback: T): Promise<T> {
  let timer: any; const to = new Promise<T>((res) => { timer = setTimeout(() => { console.log(t(), `TIMED OUT after ${Math.round(ms / 1000)} s: ${label}`); res(fallback); }, ms); });
  try { return await Promise.race([pr.catch((e) => { console.log(t(), `FAILED: ${label}: ${String(e?.message || e).slice(0, 160)}`); return fallback; }), to]); } finally { clearTimeout(timer); }
}
