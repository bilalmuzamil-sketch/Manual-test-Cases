/**
 * S8 (2026-10-09) — C96998: a tech story typed, edited and required through the Lines tab. (Header reused from S7: line technicians on cards and rows: C96993 (lead + line techs + a scheduled tech), C96994 (lead
 * first, each once), C96995 (+N and every name on hover), C96996 (blank only with nobody), C368141 (Assigned Techs right
 * after Lines), C368142 / C368143 (the Lines tab shows scheduled technicians instead of Unassigned).
 * S8 look (C96997-C97000): the Lines tab of a work order with and without a tech story, photographed and its parts
 * listed, on the normal page and as a technician (Esther Howard, viewAs) — judged from the pictures.
 * Line technicians: PUT /api/work-orders/lines/{lineId}/technicians {staffIds}; shifts on lines: shifts.mts mkShift.
 * Runs as our own test admin (runner.mts).
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, searchValue, expandSmallGroups } from './wob.mts';
import { staffRows, HEAVY, LETH } from './staff.mts';
import { viewAs } from './viewas.mts';
import { candidates } from './data.mts';
import { mkShift } from './shifts.mts';
import { RUNNER_EMAIL } from './runner.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p;  // our own test admin (runner.mts)
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = { runner: { id: RUN.id.slice(0, 8), perms: RUN.perms, who: RUN.who, log: RUN.log } };
const D = '@staging.shopview.local';
const sid = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
const ES = await sid('esther.howard'), RE = await sid('ralph.edwards');
const PREF = '/api/users/me/preferences/work-orders-list';
const prefGet = async () => (await a.get(PREF)).body?.data?.value ?? {};
const ORIGINAL = await prefGet(); fs.writeFileSync(path.join(EV, 'S5-admin-pref-before.json'), JSON.stringify(ORIGINAL, null, 1));
await a.put(PREF, { value: { ...ORIGINAL, pinnedTechnicianIds: [ES.staff_id, RE.staff_id] } });
const BTN: Record<string, string> = { List: 'button_column_selection', 'Tech View': 'button_tech_view_column_selection', 'Board View': 'button_board_fields_selection' };
const go = async (d: string, n = '', pg: Page = p) => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(4500); await tab(pg, 'All'); await display(pg, d); if (n) await search(pg, n); if (d === 'Tech View') await expandSmallGroups(pg); };
/** open the display's menu and read every switch {test-id suffix: on/off}, plus its box */
const menu = async (d: string, pg: Page = p) => {
  const b = pg.locator(`[data-test-id="${BTN[d]}"]`); const box = await b.boundingBox(); await b.click(); await pg.waitForTimeout(1200);
  const items = await pg.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); if (!m) return null;
    return [...m.querySelectorAll('[data-test-id^="toggle_"]')].map(e => { const s = e.matches('[role=switch]') ? e : e.querySelector('[role=switch]') || e; return [e.getAttribute('data-test-id').replace(/^toggle_(tech_view_column_|board_field_|column_)/, ''), (e.innerText || '').trim() || (e.closest('.q-item') || e).innerText.trim(), s.getAttribute('aria-checked'), s.getAttribute('aria-disabled')]; }); })()`) as any[];
  return { box: box ? { x: Math.round(box.x), y: Math.round(box.y) } : null, items };
};
const close = async (pg: Page = p) => { await pg.keyboard.press('Escape'); await pg.waitForTimeout(500); };
const setSwitch = async (d: string, key: string, on: boolean, pg: Page = p) => {
  const prefix = d === 'List' ? 'toggle_column_' : d === 'Tech View' ? 'toggle_tech_view_column_' : 'toggle_board_field_';
  const m = await menu(d, pg); const it = (m.items ?? []).find((x: any) => x[0] === key);
  if (!it) { await close(pg); return `no ${key} in menu`; }
  if ((it[2] === 'true') !== on) { await pg.locator(`[data-test-id="${prefix}${key}"]`).click(); await pg.waitForTimeout(1500); }
  await close(pg); return 'ok';
};
const onKeys = (m: any) => (m.items ?? []).filter((x: any) => x[2] === 'true').map((x: any) => x[0]);
const heads = (pg: Page = p) => pg.evaluate(`[...new Set([...document.querySelectorAll('thead th')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace('arrow_drop_up','').trim()).filter(Boolean))]`) as Promise<string[]>;
const card = (pg: Page, wo: string) => pg.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_card_${wo}"]'); if (!c) return null;
  const o = {}; for (const e of c.querySelectorAll('[data-test-id]')) { const k = e.getAttribute('data-test-id'); if (/^board_card_(number|status|unit|field_)/.test(k)) o[k.replace('board_card_', '')] = e.innerText.replace(/\\s+/g, ' ').trim(); } return o; })()`) as Promise<Record<string, string> | null>;
/** a second browser: the sign-in cookies only, no page storage */
const second = async () => { const st = await p.context().storageState(); const ctx = await browser.newContext({ storageState: { cookies: st.cookies, origins: [] }, viewport: { width: 1600, height: 1000 }, ignoreHTTPSErrors: true });
  await ctx.route((u) => /maps\.googleapis|intercom|sentry\.io|mercure\.qa|googletagmanager|google-analytics|hotjar|fullstory/i.test(u.toString()), (r) => r.abort()).catch(() => {}); return { ctx, pg: await ctx.newPage() }; };
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 2600));
  fs.writeFileSync(path.join(EV, 's8-batch.json'), JSON.stringify(R, null, 1));
}
const seed = async (name: string, unit: string, leads: (string | null)[]) => { let w = await workOrders(a, name); if (!w.length) { const c = await customer(a, name, unit); for (const l of leads) await workOrder(a, c, 'approved', l); w = await workOrders(a, name); } return w; };



const say = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body).slice(0, 200) : ''}`;
const DO = await sid('dana.ortiz'), JW = await sid('jenny.wilson'), KW = await sid('kristin.watson'), TW = await sid('theresa.webb');
R.people = Object.fromEntries(Object.entries({ ES, RE, DO, JW, KW, TW }).map(([k, v]: [string, any]) => [k, !!v?.staff_id]));

const canned: any[] = []; { const c = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(c) ? c : c?.collection ?? [])); }
const mkLine = async (wo: string, i: number) => (await a.post(`/api/work-orders/${wo}/lines/create-from-canned-line`, { canned_line_id: canned[i % canned.length].id, status: 'authorized' })).body?.data?.line_id as string;
const linesRaw = async (wo: string) => { const d = (await a.get(`/api/work-orders/lines/${wo}`)).body?.data; return Array.isArray(d) ? d : d?.collection ?? d?.lines ?? []; };
const toastsNow = () => p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) as Promise<string[]>;
/** type a story into a line through the screen: click its Story row (or the edit pencil), fill the box that opens, save */
async function story(line: string, text: string, tag: string) {
  const o: any = {};
  const edit = p.locator(`[data-test-id="button_tech_story_edit_${line}"]`);
  const row = p.locator(`[data-test-id="line_tech_story_${line}"]`);
  if (await edit.count() && await edit.isVisible()) { await edit.click(); o.opened = 'pencil'; } else { await row.click(); o.opened = 'story row'; }
  // wait for the Tech Story window; click again once if it did not open
  for (let i = 0; i < 2 && !(await p.locator('.q-dialog textarea').count()); i++) { await p.waitForTimeout(2000); if (!(await p.locator('.q-dialog textarea').count())) { if (o.opened === 'pencil') await edit.click(); else await row.click(); } }
  await p.waitForTimeout(1500); await shot(p, `C96998-${tag}-open`);
  const box = p.locator('.q-dialog textarea').first();
  o.box = await box.count();
  if (!o.box) return o;
  // as a person edits: click into the box, select everything, type the new text
  o.before = await box.inputValue().catch(() => null);
  await box.click(); await p.keyboard.press('Control+A'); await p.keyboard.type(text, { delay: 20 }); await p.waitForTimeout(500);
  o.typed = await box.inputValue().catch(() => null);
  const save = p.locator('.q-dialog button:visible, button:visible').filter({ hasText: /^\s*(save|save & close|update|done)\s*$/i }).last();
  o.saveButton = await save.count() ? (await save.innerText()).trim() : null;
  if (o.saveButton) await save.click(); else { await box.press('Enter'); }
  await p.waitForTimeout(2500); o.toasts = await toastsNow(); await shot(p, `C96998-${tag}-saved`);
  o.rowNow = (await row.innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
  return o;
}
await run('C96998', async () => {
  const n = `ZZAUTOTEST F3 Story Entry ${Date.now() % 100000}`; const c = await customer(a, n, 'ZZF3SE');
  const w = await workOrder(a, c, 'estimate', null); const l1 = await mkLine(w, 1), l2 = await mkLine(w, 2);
  await a.post('/api/work-orders/change-status', { id: w, status: 'approved' }); await a.post('/api/work-orders/change-lead-technician', { work_order_id: w, tech_assigned_id: ES.staff_id });
  R.C96998 = { mileage: say(await a.post('/api/work-orders/change-mileage', { work_order_id: w, mileage: '123456' })) };
  await p.goto(`${APP}/workorders/${w}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  R.C96998.add = await story(l1, 'First note', 'add');
  R.C96998.edit = await story(l1, 'First note, edited', 'edit');
  R.C96998.storedLine1 = (await linesRaw(w)).find((x: any) => x.line_id === l1)?.tech_story ?? null;
  // complete Line 2 with no story, through its Complete button
  await p.locator(`[data-test-id="button_action_complete_line_${l2}"]`).click(); await p.waitForTimeout(2500);
  R.C96998.completeNoStory = { toasts: await toastsNow(), dialog: await p.locator('.q-dialog:visible').innerText().catch(() => null), status: (await linesRaw(w)).find((x: any) => x.line_id === l2)?.status };
  await shot(p, 'C96998-complete-without-story'); await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(800);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  R.C96998.add2 = await story(l2, 'Second note', 'add2');
  await p.locator(`[data-test-id="button_action_complete_line_${l2}"]`).click(); await p.waitForTimeout(3000);
  const dlg = p.locator('.q-dialog:visible'); R.C96998.completeDialog = await dlg.innerText().catch(() => null);
  if (await dlg.count()) { const ok = dlg.locator('button').filter({ hasText: /complete|confirm|yes|ok/i }).last(); if (await ok.count()) { await ok.click(); await p.waitForTimeout(2500); } }
  R.C96998.completeWithStory = { toasts: await toastsNow(), status: (await linesRaw(w)).find((x: any) => x.line_id === l2)?.status }; await shot(p, 'C96998-complete-with-story');
  R.C96998.wo = (await workOrders(a, n))[0]?.number;
});
fs.writeFileSync(path.join(EV, 's8-batch.json'), JSON.stringify(R, null, 1));
await RUN.end();
await done(browser);
