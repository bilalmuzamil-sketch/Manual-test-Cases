/**
 * c581915-1021.mts — 21 Oct 2026, staging: C581915 by its CURRENT 11 steps (rewritten 20 Oct; read live 21 Oct 12:45 UTC).
 * Technician-A/B/C = "ZZAUTOTEST NT1 Ana Carter" / "… Ana Brooks" / "… Ben Adams" (made by tech-filter-stg6, A created first, B after A,
 * C after B; A leads S2-37685); Technician-D = Aimee Francis (deactivated, keeps a column with 8 work orders — L0490).
 * Location set and read back before the screen (ensureLocation). Every step: what the list / views show, a picture. Records only.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { HEAVY } from './staff.mts';
import { api } from './data.mts';
import { EV, shot, display, tab, groups, allBoardCols, listAllOptions, ensureLocation } from './wob.mts';
const OUT = path.join(EV, 'c581915-1021.json');
const A = 'ZZAUTOTEST NT1 Ana Carter', B = 'ZZAUTOTEST NT1 Ana Brooks', C = 'ZZAUTOTEST NT1 Ben Adams', D = 'Aimee Francis';
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; p.setDefaultTimeout(15_000);
const a = api(p); const W = (ms: number) => p.waitForTimeout(ms);
const PREF = '/api/users/me/preferences/work-orders-list'; const ORIGINAL = (await a.get(PREF)).body?.data?.value ?? {};
const R: any = { started: new Date().toISOString() }; const save = () => fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
const chips = () => p.evaluate(`[...document.querySelectorAll('[data-test-id^="filter_chip_"]')].filter((e, i, all) => e.getBoundingClientRect().width > 0 && !all.some(o => o !== e && o.contains(e))).sort((x, y) => x.getBoundingClientRect().left - y.getBoundingClientRect().left).map(e => e.innerText.replace(/\\s+/g, ' ').trim().slice(0, 50))`) as Promise<string[]>;
const chip = () => p.locator('[data-test-id^="filter_chip_"]').filter({ hasText: /Technician/ }).first();
const menu = () => p.locator('.q-menu').last();
const visibleOpts = () => menu().locator('.q-checkbox').allInnerTexts().then((x) => x.map((s) => s.replace(/\s+/g, ' ').trim()).filter(Boolean)).catch(() => [] as string[]);
const ticked = () => p.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); if (!m) return null; return [...m.querySelectorAll('.q-checkbox')].filter(e => e.getAttribute('aria-checked') === 'true' || e.querySelector('.q-checkbox__inner--truthy')).map(e => e.innerText.replace(/\\s+/g, ' ').trim()); })()`) as Promise<string[] | null>;
const order = (opts: string[]) => { const act = opts.filter((o) => o !== 'Unassigned' && !/Inactive$/.test(o)); const ina = opts.filter((o) => /Inactive$/.test(o));
  const lastAct = opts.findIndex((o, i) => i === opts.length - 1 || false); const firstIna = opts.findIndex((o) => /Inactive$/.test(o)); const lastActIdx = opts.map((o, i) => (!/Inactive$/.test(o) && o !== 'Unassigned') ? i : -1).filter((i) => i >= 0).pop() ?? -1;
  return { count: opts.length, first: opts[0], active: act.length, inactive: ina.length, inactiveAfterEveryActive: firstIna === -1 || firstIna > lastActIdx, posB: opts.indexOf(B), posA: opts.indexOf(A), posC: opts.indexOf(C), posD: opts.findIndex((o) => o.startsWith(D)), D: opts.find((o) => o.startsWith(D)) ?? null, lastFive: opts.slice(-5) }; };
const groupNames = async () => (await groups(p)).map((g: any) => g.name);
try {
  const v: any = {}; for (const [k, x] of Object.entries(ORIGINAL)) if (!/^(technicianOrder)$|collaps/i.test(k)) v[k] = x;
  Object.assign(v, { filters: {}, density: 'regular', pinnedTechnicianIds: [] }); await a.put(PREF, { value: v });
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(4500);
  R.location = await ensureLocation(p, a, HEAVY); await tab(p, 'All').catch(() => {}); await display(p, 'Tech View');
  R.build = await p.evaluate(`document.querySelector('meta[name="app-version"]')?.content || null`).catch(() => null);
  R.s1 = await chips(); await shot(p, 'C581915-1021-s1-filter-bar');
  await chip().click(); await W(1500); const opts = await listAllOptions(p); R.s2 = order(opts);
  await menu().evaluate((m: any) => { const s = [m, ...m.querySelectorAll('*')].find((e: any) => e.scrollHeight > e.clientHeight + 4) || m; s.scrollTop = 0; }).catch(() => {}); await W(400); await shot(p, 'C581915-1021-s2-list-top');
  await menu().evaluate((m: any) => { const s = [m, ...m.querySelectorAll('*')].find((e: any) => e.scrollHeight > e.clientHeight + 4) || m; s.scrollTop = s.scrollHeight; }).catch(() => {}); await W(600); R.s2_bottomVisible = await visibleOpts(); await shot(p, 'C581915-1021-s2-list-bottom');
  const box = p.getByPlaceholder('Search technician').last(); await box.fill(D); await W(1500); R.s3 = await visibleOpts(); await shot(p, 'C581915-1021-s3-search-d');
  await box.fill(''); await W(1500); R.s4 = { visible: (await visibleOpts()).length, first: (await visibleOpts())[0] };
  for (const n of [A, B]) { const it = menu().locator('.q-checkbox').filter({ hasText: new RegExp(`^\\s*${n}\\s*$`) }).first(); for (let i = 0; i < 80 && !(await it.count()); i++) { await menu().evaluate((m: any) => { const s = [m, ...m.querySelectorAll('*')].find((e: any) => e.scrollHeight > e.clientHeight + 4) || m; s.scrollTop += 250; }).catch(() => {}); await W(200); } await it.scrollIntoViewIfNeeded().catch(() => {}); await it.click().catch(() => {}); await W(1200); }
  R.s5 = { ticked: await ticked() }; await shot(p, 'C581915-1021-s5-two-ticked');
  R.s5.groups = await groupNames(); await shot(p, 'C581915-1021-s5-groups');
  await menu().getByText('Clear selection').click().catch(() => {}); await W(1200); R.s6 = { ticked: await ticked() };
  await p.keyboard.press('Escape'); await W(1200); R.s7 = { listOpen: await p.locator('.q-menu').count(), chip: (await chip().innerText().catch(() => '')).replace(/\s+/g, ' ').trim(), groupsDrawn: (await groupNames()).length }; await shot(p, 'C581915-1021-s7-closed');
  const tvGroups = await (async () => { const seen = new Set<string>(); await p.evaluate(`document.querySelector('.q-table__middle').scrollTop = 0`); await W(500); let end = 0;
    for (let i = 0; i < 4000 && end < 3; i++) { for (const n of await groupNames()) if (n) seen.add(n); const e = await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); s.scrollTop += Math.floor(s.clientHeight * 0.8); return s.scrollTop + s.clientHeight >= s.scrollHeight - 2; })()`); await W(300); end = e ? end + 1 : 0; } return [...seen]; })();
  R.s7.allGroups = tvGroups.length;
  await display(p, 'Board View'); const cols = (await allBoardCols(p)).map((c: any) => c.name); const colSet = new Set(cols);
  R.s8 = { columns: colSet.size, groupsNotColumns: tvGroups.filter((g) => !colSet.has(g)), columnsNotGroups: [...colSet].filter((c) => !tvGroups.includes(c as string)) }; await shot(p, 'C581915-1021-s8-board');
  R.s9 = { chips: await chips() }; await chip().click(); await W(1500); const bopts = await listAllOptions(p); R.s9.same = JSON.stringify(bopts) === JSON.stringify(opts); R.s9.order = order(bopts);
  await box.fill(D).catch(() => {}); await W(1200); R.s9.D = await visibleOpts(); await shot(p, 'C581915-1021-s9-board-d'); await box.fill('').catch(() => {}); await W(800);
  await p.keyboard.press('Escape'); await W(1000); R.s10 = { listOpen: await p.locator('.q-menu').count() };
  await display(p, 'List'); R.s11 = await chips(); await shot(p, 'C581915-1021-s11-list');
} catch (e: any) { R.err = String(e?.message || e).slice(0, 400); await shot(p, 'C581915-1021-error').catch(() => {}); }
R.restorePref = (await a.put(PREF, { value: ORIGINAL })).status; R.ended = new Date().toISOString(); save(); console.log(JSON.stringify(R).slice(0, 3500));
await RUN.end().catch(() => {});
await done(browser);
