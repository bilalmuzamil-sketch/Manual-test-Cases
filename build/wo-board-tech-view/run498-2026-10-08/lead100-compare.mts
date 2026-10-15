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
const wd = setTimeout(() => { R.watchdog = 'stopped by the 8-minute limit'; try { save(); } catch { /* */ } process.exit(5); }, 8 * 60_000); wd.unref();

const leadField = (pg: Page) => pg.locator('[data-test-id="select_lead_technician"]').count().then((n) => n ? pg.locator('[data-test-id="select_lead_technician"]') : pg.locator('.q-field').filter({ has: pg.locator('.q-field__label', { hasText: /Lead Tech/i }) }).first());
/** open the field without typing, read every option to the end, close it (Escape) — nothing picked */
async function readList(pg: Page, pic: string) { const f = await leadField(pg); const o: any = { field: await f.count() }; if (!o.field) return o;
  await f.click(); await pg.waitForTimeout(1500); await shot(pg, `${pic}-open`);
  const all = await cap(120_000, listAllOptions(pg), [] as string[]); o.count = all.length; o.first = all.slice(0, 6); o.last = all.slice(-6); o.all = all;
  await shot(pg, `${pic}-end`); await pg.keyboard.press('Escape').catch(() => {}); await pg.waitForTimeout(800); return o; }
/** type a name into the field's own box, record what it offers, Escape — nothing picked */
async function typeAndRead(pg: Page, term: string, pic: string) { const f = await leadField(pg); const o: any = { term };
  await f.click(); await pg.waitForTimeout(1200); const inp = f.locator('input').first(); o.hasInput = await inp.count();
  if (o.hasInput) { await inp.fill(term).catch(() => {}); } else await pg.keyboard.type(term, { delay: 60 });
  await pg.waitForTimeout(3500); o.offered = (await pg.locator('.q-menu .q-item').allInnerTexts().catch(() => [] as string[])).map((x) => x.replace(/\s+/g, ' ').trim()).slice(0, 15);
  o.found = o.offered.some((x: string) => x.toLowerCase().includes(term.toLowerCase())); o.narrowed = o.offered.length > 0 && o.offered.every((x: string) => x.toLowerCase().includes(term.split(' ')[0].toLowerCase())); await shot(pg, pic);
  await pg.keyboard.press('Escape').catch(() => {}); await pg.waitForTimeout(500); if (o.hasInput) await inp.fill('').catch(() => {}); await pg.keyboard.press('Escape').catch(() => {}); await pg.waitForTimeout(800); return o; }
/** the late technician: sort the candidates the way the page list runs (by full name), take one past the 100th */
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
    if (w) { await p.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
      const list = await readList(p, 'LEAD100-staging-page-list'); S.pageList = { count: list.count, first: list.first, last: list.last };
      const late = c.some((x) => x.name === 'Ralph Edwards') ? 'Ralph Edwards' : lateOne(c.map((x) => x.name)); S.lateName = late;   // the ticket's named example when present S.lateInPageList = (list.all ?? []).some((x: string) => x.includes(late));
      S.typed = await typeAndRead(p, late, 'LEAD100-staging-typed');
      // 15 Oct 2026 (wave 26): POSITIVE CONTROL (Rule 104) — type a name that IS in the page's first 100; if the list does not narrow
      // for it either, the field simply has no type-to-search (typing cannot reach anyone), which is the reading that matters
      const ctl = (list.all ?? []).map((x: string) => x.replace(/^check\s+/, '').trim()).filter((x: string) => x && !/^Unassigned$/i.test(x))[20] ?? null;
      if (ctl) S.typedControl = await typeAndRead(p, ctl, 'LEAD100-staging-typed-control');
      const after = (await workOrders(a, w.number)).find((x: any) => x.id === w.id); S.leadUnchanged = (after?.techAssignedId ?? null) === (w.techAssignedId ?? null); }
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
    if (w) { await p.goto(`https://app.shopview.com/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
      const list = await readList(p, 'LEAD100-production-page-list'); P.pageList = { count: list.count, first: list.first, last: list.last };
      const listed = (list.all ?? []).map((x: string) => x.replace(/^check\s+/, '').trim()); const lastListed = listed.length > 2 ? listed[listed.length - 2] : '';
      P.lateName = [...names].sort((x, y) => x.localeCompare(y, 'en', { sensitivity: 'base' })).find((x) => x.localeCompare(lastListed, 'en', { sensitivity: 'base' }) > 0 && !listed.includes(x)) ?? lateOne(names);
      P.lateInPageList = listed.some((x: string) => x.includes(P.lateName));
      P.typed = await typeAndRead(p, P.lateName, 'LEAD100-production-typed');
      const ctl = (list.all ?? []).map((x: string) => x.replace(/^check\s+/, '').trim()).filter((x: string) => x && !/^Unassigned$/i.test(x))[20] ?? null;
      if (ctl) P.typedControl = await typeAndRead(p, ctl, 'LEAD100-production-typed-control');   // positive control, as on staging
      const w2 = ((await get('/api/work-orders?pagination[rowsPerPage]=100')).body?.data?.work_orders ?? []).find((x: any) => x.id === w.id);
      P.leadUnchanged = (w2?.techAssignedId ?? null) === (w.techAssignedId ?? null); }
  } catch (e: any) { P.error = String(e?.message || e).slice(0, 300); }
  finally { save(); if (prod?.browser) await cap(20_000, prod.browser.close().catch(() => {}), undefined); } }

console.log(t(), 'LEAD100', JSON.stringify(R, (k, v) => (k === 'all' ? undefined : v)).slice(0, 6000));
clearTimeout(wd); save(); process.exit(0);
