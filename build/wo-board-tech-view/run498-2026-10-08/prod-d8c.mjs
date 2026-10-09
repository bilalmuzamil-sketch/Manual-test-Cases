/** Production re-check for D8, attempt 2 (9 Oct 2026). prod-d8b found no line to use: every technician the menu offers is
 *  already on the line. So: on a line with 2+ technicians, (R) take one off (its chip's x) and Save & Close, then (A) add
 *  the same person back and Save & Close. (A) is exactly "add a technician to a line that already has one". The line's
 *  technicians and history are read after each step. Second production test account only. Values never printed. */
import fs from 'fs'; import path from 'path';
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'prod-2026-10-09'); fs.mkdirSync(EV, { recursive: true });
const t = () => new Date().toISOString().slice(11, 19); const R = {};
const save = () => fs.writeFileSync(path.join(EV, 'prod-d8c.json'), JSON.stringify(R, null, 1));
const { browser, page: p, ctx, APP, version } = await bootProdLogin('/workorders', { deviceScaleFactor: 2, viewport: { width: 1600, height: 1000 } });
R.version = version; const shot = (n) => p.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
const api = async (m, u, body) => { const r = await ctx.request.fetch(`https://api.shopview.com${u}`, { method: m, data: body, headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, ignoreHTTPSErrors: true }); let b = null; try { b = await r.json(); } catch { /* */ } return { status: r.status(), body: b }; };
const rows = (b) => { const d = b?.data; return Array.isArray(d) ? d : d?.collection ?? d?.work_orders ?? d?.workOrders ?? []; };
const techs = (l) => (l?.tasks ?? []).map((x) => `${x.first_name} ${x.last_name}`.trim());
const hist = async (lid) => { const r = await api('GET', `/api/work-orders/lines/${lid}/history`); const h = r.body?.data?.history ?? r.body?.data?.collection ?? r.body?.data ?? []; return Array.isArray(h) ? h.map((e) => JSON.stringify(e).replace(/"[a-z_]*id":"[^"]*",?/g, '').slice(0, 200)) : []; };
const all = rows((await api('GET', '/api/work-orders?pagination[rowsPerPage]=100')).body);
R.listed = all.length; const ws = all.filter((w) => /approved|in.?progress/i.test(JSON.stringify(w.status ?? w.workOrderStatus ?? ''))); R.openOnes = ws.length;
let target = null;
for (const w of ws) { const ls = rows((await api('GET', `/api/work-orders/lines/${w.id}`)).body); const l = ls.find((x) => techs(x).length >= 2); if (l) { target = { w, l }; break; } }
if (!target) { R.err = 'no open work order line with 2+ technicians'; save(); await browser.close(); process.exit(0); }
const { w, l } = target; const lid = l.line_id ?? l.id; const name = String(l.line_name ?? l.name ?? '').trim();
R.wo = w.number; R.line = name; R.start = { techs: techs(l), history: await hist(lid) };
const short = (h) => h.map((e) => (e.match(/"eventName":"([^"]*)"/) || [])[1] ?? e.slice(0, 60));
const lineNow = async () => rows((await api('GET', `/api/work-orders/lines/${w.id}`)).body).find((x) => (x.line_id ?? x.id) === lid);
const openEdit = async () => { await p.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000); await p.getByText(name, { exact: false }).first().click(); await p.waitForTimeout(2500); return p.locator('.q-dialog').last(); };
try {
  // (R) take one technician off: production's Edit Line ticks technicians in the Add Technician menu; untick one
  let dlg = await openEdit(); let fld = dlg.locator('.q-field').filter({ hasText: /Add Technician/i }).first(); await fld.click(); await p.waitForTimeout(1000);
  R.optionsStart = (await p.locator('.q-menu .q-item').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').trim().slice(0, 50));
  const ticked = R.optionsStart.filter((x) => /^check\b/.test(x)); if (!ticked.length) throw new Error('no ticked technician in the menu');
  const who = ticked[ticked.length - 1].replace(/^check\s*/, ''); R.who = who;
  await p.locator('.q-menu .q-item').filter({ hasText: who }).first().click(); await p.waitForTimeout(800);
  await dlg.locator('.text-h6, .q-card__section').first().click().catch(() => {}); await shot('D8c-prod-removed-in-dialog');
  await dlg.locator('button').filter({ hasText: /Save & Close/i }).last().click(); await p.waitForTimeout(4500);
  R.afterRemove = { techs: techs(await lineNow()), history: await hist(lid) };
  // (A) tick the same person again: the line still has its other technicians
  dlg = await openEdit(); fld = dlg.locator('.q-field').filter({ hasText: /Add Technician/i }).first(); await fld.click(); await p.waitForTimeout(1000);
  R.optionsBeforeAdd = (await p.locator('.q-menu .q-item').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').trim().slice(0, 50));
  const opt = p.locator('.q-menu .q-item').filter({ hasText: who }).first(); R.optionFound = await opt.count();
  if (R.optionFound) { await opt.click(); await p.waitForTimeout(800); await dlg.locator('.text-h6, .q-card__section').first().click().catch(() => {}); await shot('D8c-prod-added-in-dialog');
    await dlg.locator('button').filter({ hasText: /Save & Close/i }).last().click(); await p.waitForTimeout(4500); }
  R.afterAdd = { techs: techs(await lineNow()), history: await hist(lid) };
  await shot('D8c-prod-after-add');
  R.newOnRemove = short(R.afterRemove.history).slice(0, R.afterRemove.history.length - R.start.history.length);
  R.newOnAdd = short(R.afterAdd.history).slice(0, R.afterAdd.history.length - R.afterRemove.history.length);
  for (const k of ['start', 'afterRemove', 'afterAdd']) R[k].historyNames = short(R[k].history), R[k].historyCount = R[k].history.length, delete R[k].history;
} catch (e) { R.error = String(e?.message || e).slice(0, 300); await shot('D8c-prod-error'); }
finally { save(); console.log(t(), JSON.stringify(R).slice(0, 3000)); await browser.close(); }
