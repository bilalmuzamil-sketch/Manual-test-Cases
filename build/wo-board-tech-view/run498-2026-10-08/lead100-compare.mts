/**
 * lead100-compare.mts — 15 Oct 2026 (wave 19 follow-up), SEVENTH pass. READ ONLY on both sites: nothing is picked, saved or changed.
 * Settles the "100 names" finding (wave 19, L0369) with Rule 121 (is it the same on production?):
 *  STAGING (the shared admin session): the lead-candidates list the Reassign dialog uses (count N), the Reassign dialog itself opened
 *   on a Board View card and its options counted, then Cancel; one work order page's Lead Technician field opened WITHOUT typing and
 *   read to the end (count, first/last), then the name of a technician who sorts late typed into the field's own box and what it
 *   offers recorded — Escape, never a click on an option. So the report can say "the page offers X of N".
 *  PRODUCTION (prod-login-boot.mjs bootProdLogin, app.shopview.com; the second account, one sign-in): the same page reading on an open
 *   work order, the late technician chosen from production's OWN candidates list (past the 100th name, recorded), typed and read the
 *   same way; the work order's lead is read before and after (must be unchanged). Pictures of each list.
 * Bounded: every page read has a time limit and the whole script stops itself after 8 minutes.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, APP } from './session.mts';
import { api, candidates, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, listAllOptions } from './wob.mts';
// @ts-ignore
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs';

const R: any = { staging: {}, production: {} };
const save = () => fs.writeFileSync(path.join(EV, 'lead100-compare.json'), JSON.stringify(R, null, 1));
const cap = <T,>(ms: number, pr: Promise<T>, fallback: any = 'timed out'): Promise<T> => Promise.race([pr, new Promise<T>((r) => setTimeout(() => r(fallback), ms))]);
// 15 Oct 2026 (wave 27): limit raised from 8 to 14 minutes for the Edit Line > Add Technician reading added on both sites; every step stays capped
const wd = setTimeout(() => { R.watchdog = 'stopped by the 14-minute limit'; try { save(); } catch { /* */ } process.exit(5); }, 14 * 60_000); wd.unref();

const leadField = (pg: Page) => pg.locator('[data-test-id="select_lead_technician"]').count().then((n) => n ? pg.locator('[data-test-id="select_lead_technician"]') : pg.locator('.q-field').filter({ has: pg.locator('.q-field__label', { hasText: /Lead Tech/i }) }).first());
/** open the field without typing, read every option to the end, close it (Escape) — nothing picked */
async function readList(pg: Page, pic: string) { const f = await leadField(pg); const o: any = { field: await f.count() }; if (!o.field) return o;
  await f.click(); await pg.waitForTimeout(1500); await shot(pg, `${pic}-open`);
  const all = await cap(120_000, listAllOptions(pg), [] as string[]); o.count = all.length; o.first = all.slice(0, 6); o.last = all.slice(-6); o.all = all;
  await shot(pg, `${pic}-end`); await pg.keyboard.press('Escape').catch(() => {}); await pg.waitForTimeout(800); return o; }
/** type like a person: try the field's box; if it refuses (readonly / not editable), press the keys with the field focused.
 *  Records HOW it typed and what the box then holds, so a "typing changed nothing" reading is never an unproved fill (Rule 104; the
 *  eighth pass swallowed fill errors and its pictures showed no typed text). Capped. */
async function typeLikeUser(pg: Page, inp: any, term: string) { const t: any = {};
  t.readonly = await Promise.race([inp.getAttribute('readonly').catch(() => 'n/a'), new Promise((r) => setTimeout(() => r('timeout'), 4000))]);
  try { await Promise.race([inp.fill(term, { timeout: 5000 }), new Promise((_, j) => setTimeout(() => j(new Error('fill cap')), 7000))]); t.how = 'fill'; }
  catch (e: any) { t.fillErr = String(e?.message || e).split('\n')[0].slice(0, 160); t.how = 'keys'; await Promise.race([pg.keyboard.type(term, { delay: 50 }).catch(() => {}), new Promise((r) => setTimeout(r, 10_000))]); }
  t.valueAfter = await Promise.race([inp.inputValue().catch(() => 'n/a'), new Promise((r) => setTimeout(() => r('timeout'), 4000))]);
  t.textShown = String(t.valueAfter || '').toLowerCase().includes(term.toLowerCase()); return t; }
/** type a name into the field's own box, record what it offers, Escape — nothing picked */
async function typeAndRead(pg: Page, term: string, pic: string) { const f = await leadField(pg); const o: any = { term };
  await f.click(); await pg.waitForTimeout(1200); const inp = f.locator('input').first(); o.hasInput = await inp.count();
  if (o.hasInput) { o.typing = await typeLikeUser(pg, inp, term); } else await pg.keyboard.type(term, { delay: 60 });
  await pg.waitForTimeout(3500); o.offered = (await pg.locator('.q-menu .q-item').allInnerTexts().catch(() => [] as string[])).map((x) => x.replace(/\s+/g, ' ').trim()).slice(0, 15);
  o.found = o.offered.some((x: string) => x.toLowerCase().includes(term.toLowerCase())); o.narrowed = o.offered.length > 0 && o.offered.every((x: string) => x.toLowerCase().includes(term.split(' ')[0].toLowerCase())); await shot(pg, pic);
  await pg.keyboard.press('Escape').catch(() => {}); await pg.waitForTimeout(500); if (o.hasInput) await inp.fill('').catch(() => {}); await pg.keyboard.press('Escape').catch(() => {}); await pg.waitForTimeout(800); return o; }
/** the late technician: sort the candidates the way the page list runs (by full name), take one past the 100th */
/** 15 Oct 2026 (wave 27, coordinator): the SAME reading for Edit Line > Add Technician on a line of the same work order — untyped list
 *  read to the end (count, first/last), a late name typed into the field's own box, a control name from the first 100 typed, pictures with
 *  the list OPEN. READ ONLY: never Save — the window is left with Cancel/Escape, and the line's technicians are read before and after.
 *  lines(): the work order's lines from the API (each site passes its own reader). Every step is capped. */
async function readEditLineAdd(pg: Page, lines: () => Promise<any[]>, late: string, pic: string) { const o: any = { late };
  const techsOf = (ls: any[]) => ls.map((l: any) => `${String(l.line_name ?? l.name ?? '').trim()}: ${(l.tasks ?? []).map((t: any) => `${t.first_name ?? ''} ${t.last_name ?? ''}`.trim()).join(', ')}`);
  const ls0 = await cap(20_000, lines(), [] as any[]); o.linesBefore = techsOf(ls0); const name = String((ls0[0] ?? {}).line_name ?? (ls0[0] ?? {}).name ?? '').trim(); o.line = name || 'no line';
  if (!name) return o;
  await cap(15_000, pg.getByText(name, { exact: false }).first().click({ timeout: 10_000 }).catch(() => {}), undefined); await pg.waitForTimeout(2500);
  const d = pg.locator('.q-dialog').last(); o.windowOpen = await cap(5000, d.isVisible().catch(() => false), false); o.windowTitle = (await cap(5000, d.locator('.text-h6, [data-test-id="dialog_title"]').first().innerText().catch(() => ''), '')).replace(/\s+/g, ' ').trim();
  const add = (await cap(5000, d.locator('[data-test-id="select_line_roster_add_technician"]').count(), 0)) ? d.locator('[data-test-id="select_line_roster_add_technician"]') : d.locator('.q-field').filter({ hasText: /Add Technician/ }).first();
  o.addField = await cap(5000, add.count(), 0); if (!o.windowOpen || !o.addField) { await shot(pg, `${pic}-no-field`); await pg.keyboard.press('Escape').catch(() => {}); return o; }
  // (1) untyped, read to the end
  await cap(12_000, add.click({ timeout: 10_000 }).catch(() => {}), undefined); await pg.waitForTimeout(1500); await shot(pg, `${pic}-open`);
  const all = await cap(75_000, listAllOptions(pg), [] as string[]); o.count = all.length; o.first = all.slice(0, 6); o.last = all.slice(-6); o.lateInList = all.some((x: string) => x.includes(late));
  await shot(pg, `${pic}-end`); await pg.keyboard.press('Escape').catch(() => {}); await pg.waitForTimeout(700);
  // (2) the late name and (3) a control name from the first 100, typed into the field's own box; pictures with the list open
  // Escape can close the whole window as well as the list: reopen it (the line's name) before each typed reading, and say so
  const ensureOpen = async () => { if (await cap(5000, d.isVisible().catch(() => false), false)) return false; await cap(15_000, pg.getByText(name, { exact: false }).first().click({ timeout: 10_000 }).catch(() => {}), undefined); await pg.waitForTimeout(2500); return true; };
  const typed = async (term: string, tag: string) => { const r: any = { term }; r.reopened = await ensureOpen(); await cap(12_000, add.click({ timeout: 10_000 }).catch(() => {}), undefined); await pg.waitForTimeout(900);
    const inp = add.locator('input').first(); r.hasInput = await cap(5000, inp.count(), 0); if (r.hasInput) r.typing = await cap(25_000, typeLikeUser(pg, inp, term), { how: 'cap' }); else await cap(10_000, pg.keyboard.type(term, { delay: 50 }), undefined);
    await pg.waitForTimeout(3000); r.offered = (await cap(8000, pg.locator('.q-menu .q-item').allInnerTexts().catch(() => [] as string[]), [] as string[])).map((x: string) => x.replace(/\s+/g, ' ').trim()).slice(0, 15);
    r.found = r.offered.some((x: string) => x.toLowerCase().includes(term.toLowerCase())); r.narrowed = r.offered.length > 0 && r.offered.every((x: string) => x.toLowerCase().includes(term.split(' ')[0].toLowerCase()));
    await shot(pg, `${pic}-${tag}`); await pg.keyboard.press('Escape').catch(() => {}); await pg.waitForTimeout(500); if (r.hasInput) await cap(5000, inp.fill('').catch(() => {}), undefined); return r; };
  o.typed = await typed(late, 'typed');
  const ctl = all.map((x: string) => x.replace(/^check\s+/, '').trim()).filter((x: string) => x && !/^Unassigned$/i.test(x))[20] ?? null; if (ctl) o.typedControl = await typed(ctl, 'typed-control');
  // leave WITHOUT saving
  const cancel = d.locator('button').filter({ hasText: /^\s*Cancel\s*$/ }).first(); if (await cap(5000, cancel.count(), 0)) await cap(10_000, cancel.click({ timeout: 8000 }).catch(() => {}), undefined); else await pg.keyboard.press('Escape').catch(() => {});
  await pg.waitForTimeout(1500); if (await cap(5000, d.isVisible().catch(() => false), false)) { await pg.keyboard.press('Escape').catch(() => {}); await pg.waitForTimeout(800); } o.windowClosed = !(await cap(5000, d.isVisible().catch(() => false), false));
  o.linesAfter = techsOf(await cap(20_000, lines(), [] as any[])); o.unchanged = JSON.stringify(o.linesAfter) === JSON.stringify(o.linesBefore); return o; }
/** 15 Oct 2026 (wave 29): which list request fills the pick lists, and with what size limit — read from the page's own requests (from
 *  loading the work order page to closing Edit Line), on both sites. If production asks for the same limit, the limit is not new. */
function watchRequests(pg: Page) { const seen: string[] = []; pg.on('request', (r) => { try { const u = new URL(r.url()); if (r.method() === 'GET' && /\/api\//.test(u.pathname) && seen.length < 200) seen.push((u.pathname + u.search).replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>').slice(0, 220)); } catch { /* */ } });
  return () => { const all = [...new Set(seen)]; return { pickListLike: all.filter((x) => /staff|technician|employee|candidate|user|people|member/i.test(x)).slice(0, 25), withLimit: all.filter((x) => /limit=|per_?page=|rowsPerPage|pageSize|take=/i.test(x)).slice(0, 25), count: all.length }; }; }
const lateOne = (names: string[]) => { const s = [...names].filter(Boolean).sort((x, y) => x.localeCompare(y, 'en', { sensitivity: 'base' })); return s.length > 100 ? s[Math.min(s.length - 1, 100 + Math.floor((s.length - 100) / 2))] : s[s.length - 1]; };

// ── STAGING ──
{ const S = R.staging; let browser: any = null;
  try { const o = await open('/workorders?tab=all'); browser = o.browser; const p = o.page; p.setDefaultTimeout(30_000); const a = api(p);
    const c = await candidates(a); S.candidatesN = c.length; S.candidatesSorted = { first: c.map((x) => x.name).sort().slice(0, 3), last: c.map((x) => x.name).sort().slice(-3) };
    // 15 Oct 2026 (wave 27): the seventh-pass run read nothing ("dialogOptions 0", "workOrder none found"): the list call's status
    // filter returned no rows and the first Board View card (of thousands) was never on screen. Now the work order is found by search
    // (this suite's own Approved work order, else any Approved one in the first 100), and the dialog is opened on ITS card, found by search.
    const pickWo = (xs: any[]) => xs.find((x: any) => x.status === 'approved' && x.techAssignedId) ?? xs.find((x: any) => x.status === 'approved') ?? null;
    let w: any = pickWo(await workOrders(a, 'ZZAUTOTEST F3 Reassign Bottom')); if (!w) w = pickWo(((await a.get('/api/work-orders?pagination[rowsPerPage]=100')).body?.data?.work_orders ?? []) as any[]);
    S.workOrder = w ? `${w.number} lead=${w.techAssignedFirstName ?? '-'} ${w.techAssignedLastName ?? ''}` : 'none found';
    if (w) { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All'); await display(p, 'Board View'); await p.waitForTimeout(2500); await search(p, w.number).catch(() => {}); await p.waitForTimeout(3000);
      const card = p.locator(`[data-test-id="board_card_${w.id}"]`).first(); S.cardFound = await card.count(); await card.scrollIntoViewIfNeeded().catch(() => {}); await card.hover().catch(() => {}); await card.locator('[data-test-id="button_work_order_more_actions"]').click().catch(() => {}); await p.waitForTimeout(900);
      await p.locator('.q-menu .q-item').filter({ hasText: 'Reassign lead technician' }).first().click().catch(() => {}); await p.waitForTimeout(1500); S.dialogOpen = await p.locator('.q-dialog').count();
      S.dialogOptions = await cap(60_000, p.evaluate(`(async () => { const seen = new Set(); const sc = [...document.querySelectorAll('.q-dialog *')].find(e => e.scrollHeight > e.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(e).overflowY));
        for (let i = 0; i < 200; i++) { document.querySelectorAll('[data-test-id^="option_lead_technician_"]').forEach(e => seen.add(e.getAttribute('data-test-id'))); if (!sc) break; const b = sc.scrollTop; sc.scrollTop += 400; await new Promise(r => setTimeout(r, 150)); if (sc.scrollTop === b) break; }
        return seen.size; })()`), 'timed out');
      // the late technician typed into the dialog's own search: the dialog offers him (the contrast the ticket needs)
      const late0 = c.some((x) => x.name === 'Ralph Edwards') ? 'Ralph Edwards' : lateOne(c.map((x) => x.name)); const din = p.locator('.q-dialog input').first();
      if (await din.count()) { await din.fill(late0.split(' ').slice(-2).join(' ')).catch(() => {}); await p.waitForTimeout(2000); S.dialogTyped = { term: late0, offered: (await p.locator('.q-dialog [data-test-id^="option_lead_technician_"]').allInnerTexts().catch(() => [] as string[])).map((x) => x.replace(/\s+/g, ' ').trim()).slice(0, 8) }; }
      await shot(p, 'LEAD100-staging-dialog');
      await p.locator('[data-test-id="button_cancel_reassign_lead_technician"]').click().catch(() => p.keyboard.press('Escape')); await p.waitForTimeout(800); }
    if (w) { const reqS = watchRequests(p); await p.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
      const list = await readList(p, 'LEAD100-staging-page-list'); S.pageList = { count: list.count, first: list.first, last: list.last };
      const late = c.some((x) => x.name === 'Ralph Edwards') ? 'Ralph Edwards' : lateOne(c.map((x) => x.name)); S.lateName = late;   // the ticket's named example when present S.lateInPageList = (list.all ?? []).some((x: string) => x.includes(late));
      S.typed = await typeAndRead(p, late, 'LEAD100-staging-typed');
      // 15 Oct 2026 (wave 26): POSITIVE CONTROL (Rule 104) — type a name that IS in the page's first 100; if the list does not narrow
      // for it either, the field simply has no type-to-search (typing cannot reach anyone), which is the reading that matters
      const ctl = (list.all ?? []).map((x: string) => x.replace(/^check\s+/, '').trim()).filter((x: string) => x && !/^Unassigned$/i.test(x))[20] ?? null;
      if (ctl) S.typedControl = await typeAndRead(p, ctl, 'LEAD100-staging-typed-control');
      const after = (await workOrders(a, w.number)).find((x: any) => x.id === w.id); S.leadUnchanged = (after?.techAssignedId ?? null) === (w.techAssignedId ?? null);
      // Edit Line > Add Technician on this work order's first line (wave 27): same reading, read only
      const linesS = async () => { const d0 = (await a.get(`/api/work-orders/lines/${w.id}`)).body?.data; return (Array.isArray(d0) ? d0 : d0?.collection ?? []) as any[]; };
      await p.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(6000);
      S.editLineAdd = await cap(240_000, readEditLineAdd(p, linesS, late, 'LEAD100-staging-editline'), 'timed out'); S.requests = reqS(); save(); }
  } catch (e: any) { S.error = String(e?.message || e).slice(0, 300); }
  finally { save(); if (browser) await cap(20_000, browser.close().catch(() => {}), undefined); } }   // not done(): it ends the process before production

// ── PRODUCTION (read only) ──
{ const P = R.production; let prod: any = null;
  try { prod = await bootProdLogin('/workorders', { deviceScaleFactor: 2, viewport: { width: 1600, height: 1000 } }); /* 2x pictures (Rule 116) */ const p: Page = prod.page; p.setDefaultTimeout(30_000); P.build = prod.version ?? null;
    const API = 'https://api.shopview.com';
    const get = (u: string) => cap(20_000, p.evaluate(async ([A, u2]) => { const r = await fetch(A + u2, { credentials: 'include', headers: { Accept: 'application/json' } }); let b = null; try { b = await r.json(); } catch { /* */ } return { status: r.status, body: b }; }, [API, u] as const), { status: 0, body: null } as any);
    // 15 Oct 2026 (wave 27): production has no lead-candidates endpoint (404: the board feature is not there), so the names come from
    // production's staff list (active people), and the late name is chosen AFTER reading the page list: the first active person who
    // sorts after the list's last name and is not in it. The work order is any Approved / In Progress one in the first 100.
    const cr = await get('/api/work-orders/lead-technician-candidates'); let names = ((cr.body?.data?.technicians ?? []) as any[]).map((x) => `${x.firstName ?? ''} ${x.lastName ?? ''}`.trim());
    P.candidatesStatus = cr.status; P.namesSource = 'lead candidates';
    if (!names.length) { const sr = await get('/api/staff?limit=500'); P.staffStatus = sr.status; names = ((sr.body?.data?.collection ?? []) as any[]).filter((x) => x.active !== false && x.is_active !== false && x.deleted_at == null).map((x) => `${x.first_name ?? x.firstName ?? ''} ${x.last_name ?? x.lastName ?? ''}`.trim()).filter(Boolean); P.namesSource = 'staff list (active)'; }
    P.candidatesN = names.length;
    const wl = await get('/api/work-orders?pagination[rowsPerPage]=100'); const ws = (wl.body?.data?.work_orders ?? wl.body?.data?.collection ?? []) as any[]; P.listStatus = wl.status;
    const w = ws.find((x: any) => /approved|in_progress/.test(x.status) && x.techAssignedId) ?? ws.find((x: any) => /approved|in_progress/.test(x.status)) ?? null; P.workOrder = w ? `${w.number} lead=${w.techAssignedFirstName ?? '-'} ${w.techAssignedLastName ?? ''}` : 'none found';
    if (w) { const reqP = watchRequests(p); await p.goto(`https://app.shopview.com/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
      const list = await readList(p, 'LEAD100-production-page-list'); P.pageList = { count: list.count, first: list.first, last: list.last };
      const listed = (list.all ?? []).map((x: string) => x.replace(/^check\s+/, '').trim()); const lastListed = listed.length > 2 ? listed[listed.length - 2] : '';
      P.lateName = [...names].sort((x, y) => x.localeCompare(y, 'en', { sensitivity: 'base' })).find((x) => x.localeCompare(lastListed, 'en', { sensitivity: 'base' }) > 0 && !listed.includes(x)) ?? lateOne(names);
      P.lateInPageList = listed.some((x: string) => x.includes(P.lateName));
      P.typed = await typeAndRead(p, P.lateName, 'LEAD100-production-typed');
      const ctl = (list.all ?? []).map((x: string) => x.replace(/^check\s+/, '').trim()).filter((x: string) => x && !/^Unassigned$/i.test(x))[20] ?? null;
      if (ctl) P.typedControl = await typeAndRead(p, ctl, 'LEAD100-production-typed-control');   // positive control, as on staging
      const w2 = ((await get('/api/work-orders?pagination[rowsPerPage]=100')).body?.data?.work_orders ?? []).find((x: any) => x.id === w.id);
      P.leadUnchanged = (w2?.techAssignedId ?? null) === (w.techAssignedId ?? null);
      // Edit Line > Add Technician on this work order's first line (wave 27): production has Edit Line even without the board; read only
      const linesP = async () => { const r0 = await get(`/api/work-orders/lines/${w.id}`); const d0 = r0.body?.data; return (Array.isArray(d0) ? d0 : d0?.collection ?? []) as any[]; };
      await cap(40_000, p.goto(`https://app.shopview.com/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }).catch(() => {}), undefined); await p.waitForTimeout(7000);
      P.editLineAdd = await cap(240_000, readEditLineAdd(p, linesP, P.lateName, 'LEAD100-production-editline'), 'timed out'); P.requests = reqP(); save(); }
  } catch (e: any) { P.error = String(e?.message || e).slice(0, 300); }
  finally { save(); if (prod?.browser) await cap(20_000, prod.browser.close().catch(() => {}), undefined); } }

console.log(t(), 'LEAD100', JSON.stringify(R, (k, v) => (k === 'all' ? undefined : v)).slice(0, 6000));
clearTimeout(wd); save(); process.exit(0);
