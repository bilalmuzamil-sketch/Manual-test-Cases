/**
 * tech-filter-missing-1020.mts — 20 Oct 2026, staging. tech-filter-check-1020 walked every Tech View group (329) and every Technician
 * filter option (317): 11 groups have no option (Aimee Francis, Allison Hughes, Brett Guerra, Darrell Martinez, Debra Taylor, James Price,
 * Jared Miller, Mary Parker, Rebecca Mitchell, ZZAUTOTEST F3 Dan Delta, Deleted technician). This reads, for each name, the staff record
 * (active / clockable / role / enrolled here) and, for Aimee Francis, shows it on screen: her Tech View group header (walked to, then
 * pictured) and the Technician filter's own "Search technician" box typed with "Aimee" (pictured: what the list offers).
 * Positive control: "Esther Howard" typed into the same box must offer her. Raw readings only.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api } from './data.mts';
import { EV, shot, display, tab } from './wob.mts';
import { staffRows } from './staff.mts';

const OUT = path.join(EV, 'tech-filter-missing-1020.json');
const NAMES = ['Aimee Francis', 'Allison Hughes', 'Brett Guerra', 'Darrell Martinez', 'Debra Taylor', 'James Price', 'Jared Miller', 'Mary Parker', 'Rebecca Mitchell', 'ZZAUTOTEST F3 Dan Delta'];
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; p.setDefaultTimeout(15_000);
const a = api(p); const W = (ms: number) => p.waitForTimeout(ms);
const PREF = '/api/users/me/preferences/work-orders-list';
const ORIGINAL = (await a.get(PREF)).body?.data?.value ?? {};
const R: Record<string, any> = { started: new Date().toISOString(), staff: {} };
const save = () => fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
for (const n of NAMES) {
  const rows = (await staffRows(a, n)).filter((x: any) => `${x.first_name ?? ''} ${x.last_name ?? ''}`.trim() === n || String(x.name ?? x.full_name ?? '').trim() === n);
  R.staff[n] = rows.map((x: any) => Object.fromEntries(Object.entries(x).filter(([k, v]) => /status|active|clock|role|locat|enrol|deleted|deactiv|time_clock|is_/i.test(k) && (typeof v !== 'object' || v === null || Array.isArray(v))).map(([k, v]) => [k, Array.isArray(v) ? JSON.stringify(v).slice(0, 200) : v])));
}
save();
try {
  const v: any = {}; for (const [k, x] of Object.entries(ORIGINAL)) if (!/^(technicianOrder)$|collaps/i.test(k)) v[k] = x;
  Object.assign(v, { filters: {}, density: 'regular', pinnedTechnicianIds: [] }); await a.put(PREF, { value: v });
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(4500); await tab(p, 'All').catch(() => {}); await display(p, 'Tech View');
  const un = p.locator('[data-test-id^="tech_view_group_"][data-collapsed="false"]').filter({ hasText: /^\s*Unassigned/ }).first();
  if (await un.count()) { const id = ((await un.getAttribute('data-test-id')) || '').replace('tech_view_group_', ''); await p.locator(`[data-test-id="button_tech_view_group_toggle_${id}"]`).click().catch(() => {}); await W(1500); }
  const head = p.locator('[data-test-id^="tech_view_group_name_"]').filter({ hasText: /^\s*Aimee Francis\s*$/ }).first();
  await p.evaluate(`document.querySelector('.q-table__middle').scrollTop = 0`); await W(600);
  for (let i = 0; i < 3000 && !(await head.count()); i++) { const end = await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); s.scrollTop += Math.floor(s.clientHeight * 0.8); return s.scrollTop + s.clientHeight >= s.scrollHeight - 2; })()`); await W(250); if (end && !(await head.count())) break; }
  R.aimeeGroup = await head.count() ? 'on screen' : 'not found';
  if (await head.count()) { await head.scrollIntoViewIfNeeded(); await W(800); R.aimeeHeaderText = (await head.locator('xpath=ancestor::tr[1]').innerText().catch(() => '')).replace(/\s+/g, ' ').trim(); await shot(p, 'C581915-1020-aimee-group'); }
  const chip = p.locator('[data-test-id^="filter_chip_"]').filter({ hasText: /Technician/ }).first();
  for (const [typed, key] of [['Esther Howard', 'control'], ['Aimee', 'aimee']] as const) {
    await chip.click(); await W(1200); const box = p.locator('.q-menu').last().locator('input').first(); await box.fill(typed); await W(1500);
    R[key] = { typed, offered: (await p.locator('.q-menu').last().locator('.q-item').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 10) };
    await shot(p, `C581915-1020-search-${key}`); await box.fill(''); await p.keyboard.press('Escape'); await W(800);
  }
} catch (e: any) { R.err = String(e?.message || e).slice(0, 400); }
R.restorePref = (await a.put(PREF, { value: ORIGINAL })).status; R.ended = new Date().toISOString(); save(); console.log(JSON.stringify(R).slice(0, 4000));
await RUN.end().catch(() => {});
await done(browser);
