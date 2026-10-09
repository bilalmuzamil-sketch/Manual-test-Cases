/** Production check (2026-10-09) for three held reports whose expectation says "as it does today":
 *  D2 (C96923) does Assigned to me reset on a location change in today's product;
 *  D8 (C96962) does an Edit Line technician change write a line Audit log entry in today's product;
 *  D10 (C96978) what "estimated hours" means for a work order in today's product.
 *  Production test account (prod-login.env), never the QA lead's. Pictures at 2x (Rule 116). Values never printed. */
import fs from 'fs'; import path from 'path';
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'prod-2026-10-09'); fs.mkdirSync(EV, { recursive: true });
const t = () => new Date().toISOString().slice(11, 19); const R = {};
const save = () => fs.writeFileSync(path.join(EV, 'prod-check.json'), JSON.stringify(R, null, 1));
const { browser, page: p, ctx, APP, version } = await bootProdLogin('/workorders', { deviceScaleFactor: 2, viewport: { width: 1600, height: 1000 } });
R.version = version; const shot = (n) => p.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
const api = async (m, u, body) => { const r = await ctx.request.fetch(`https://api.shopview.com${u}`, { method: m, data: body, headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, ignoreHTTPSErrors: true }); let b = null; try { b = await r.json(); } catch {} return { status: r.status(), body: b }; };
const rows = (b) => { const d = b?.data; return Array.isArray(d) ? d : d?.collection ?? d?.work_orders ?? d?.workOrders ?? []; };
const step = async (k, f) => { try { await f(); } catch (e) { R[k] = { ...(R[k] || {}), error: String(e?.message || e).slice(0, 300) }; await shot(`${k}-error`); } console.log(t(), k, JSON.stringify(R[k]).slice(0, 1500)); save(); };

await step('SHAPE', async () => { const l = await api('GET', '/api/work-orders?pagination[rowsPerPage]=5'); const d = l.body?.data; R.SHAPE = { top: d && !Array.isArray(d) ? Object.keys(d) : 'array', row: rows(l.body)[0] ? Object.entries(rows(l.body)[0]).map(([k, v]) => k + '=' + (typeof v === 'object' ? JSON.stringify(v)?.slice(0, 40) : String(v).slice(0, 20))).join(' | ').slice(0, 1500) : null };
  const w = rows(l.body)[0]; if (w) { const x = await api('GET', `/api/work-orders/lines/${w.id}`); const xd = x.body?.data; R.SHAPE.lines = { status: x.status, top: xd && !Array.isArray(xd) ? Object.keys(xd) : 'array', first: JSON.stringify(rows(x.body)[0] ?? xd)?.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>').slice(0, 1500) }; } });
await step('D10', async () => { const o = {};
  const l = await api('GET', '/api/work-orders?pagination[rowsPerPage]=50'); const ws = rows(l.body); o.listStatus = l.status; o.listEstimateKeys = ws[0] ? Object.keys(ws[0]).filter((k) => /estim|hour/i.test(k)) : [];
  o.samples = [];
  for (const w of ws.slice(0, 50)) { const ls = rows((await api('GET', `/api/work-orders/lines/${w.id}`)).body); const est = ls.map((x) => Object.fromEntries(Object.entries(x).filter(([k]) => /estim|hour/i.test(k)))); const has = est.some((e) => Object.values(e).some((v) => Number(v) > 0));
    if (has) { const v = (await api('GET', `/api/work-orders/view/${w.id}`)).body?.data ?? {}; o.samples.push({ number: w.number, listEst: Object.fromEntries(o.listEstimateKeys.map((k) => [k, w[k]])), viewEst: Object.fromEntries(Object.entries(v).filter(([k]) => /estim|hour/i.test(k))), lines: est.slice(0, 4) }); if (o.samples.length >= 3) break; } }
  // the List's own Estimated column, if production offers one
  await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
  o.headers = await p.evaluate(() => [...document.querySelectorAll('thead th')].map((e) => e.innerText.trim()).filter(Boolean));
  const cs = p.locator('[data-test-id="button_column_selection"]'); if (await cs.count()) { await cs.click(); await p.waitForTimeout(1000); o.columnChoices = await p.evaluate(() => [...document.querySelectorAll('.q-menu .q-item, .q-menu .q-checkbox')].map((e) => e.innerText.trim()).filter(Boolean)); await shot('D10-prod-columns'); await p.keyboard.press('Escape'); }
  R.D10 = o; });

await step('D8', async () => { const o = {};
  const ws = rows((await api('GET', '/api/work-orders?pagination[rowsPerPage]=100')).body).filter((w) => /approved|in.?progress/i.test(JSON.stringify(w.status ?? w.workOrderStatus ?? '')));
  let wo = null, line = null; for (const w of ws) { const ls = rows((await api('GET', `/api/work-orders/lines/${w.id}`)).body); if (ls.length) { wo = w; line = ls[0]; break; } }
  if (!wo) { o.err = 'no approved/in progress work order with a line'; R.D8 = o; return; }
  o.wo = wo.number; o.lineName = line.name ?? line.line_name ?? line.title; o.lineKeys = Object.keys(line).join(',').slice(0, 300);
  const lh = async () => { const r = await api('GET', `/api/work-orders/lines/${line.line_id ?? line.id}/history`); const h = r.body?.data?.history ?? r.body?.data?.collection ?? r.body?.data ?? []; return { status: r.status, n: Array.isArray(h) ? h.length : -1, top: (Array.isArray(h) ? h : []).slice(0, 3).map((x) => `${x.eventName ?? x.event ?? '?'} ${x.originalLineTechName ?? ''}->${x.newLineTechName ?? ''}`) }; };
  o.before = await lh();
  await p.goto(`${APP}/workorders/${wo.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(9000);
  await p.getByText(String(o.lineName).trim(), { exact: false }).first().click(); await p.waitForTimeout(3000);
  const dlg = p.locator('.q-dialog').last(); o.dialog = { open: await dlg.isVisible().catch(() => false), labels: await dlg.evaluate((e) => [...e.querySelectorAll('.q-field__label, label')].map((x) => x.innerText.trim()).filter(Boolean).slice(0, 20)).catch(() => []) };
  await shot('D8-prod-editline-open');
  const fld = dlg.locator('.q-field').filter({ hasText: /technician/i }).first();
  if (await fld.count()) { await fld.click(); await p.waitForTimeout(1000); const opts = p.locator('.q-menu .q-item'); o.optionCount = await opts.count(); const pick = opts.first(); o.picked = (await pick.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 40); await pick.click(); await p.waitForTimeout(800);
    await dlg.locator('.q-card__section, .text-h6').first().click().catch(() => {}); await shot('D8-prod-editline-picked');
    await dlg.locator('button').filter({ hasText: /Save & Close|^\s*Save\s*$/i }).last().click(); await p.waitForTimeout(4000); o.toasts = await p.evaluate(() => [...document.querySelectorAll('.q-notification')].map((e) => e.innerText.replace(/\s+/g, ' ')));
  } else o.noTechField = true;
  o.after = await lh(); R.D8 = o; });

await step('D2', async () => { const o = {};
  await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
  const atm = p.locator('[data-test-id*="assigned"], button, .q-toggle, .q-chip').filter({ hasText: /Assigned to me/i }).first(); o.found = await atm.count();
  if (!o.found) { await shot('D2-prod-no-toggle'); R.D2 = o; return; }
  await atm.click(); await p.waitForTimeout(3000); o.urlOn = p.url().replace(APP, ''); o.onLooks = await atm.evaluate((e) => e.className + ' ' + (e.getAttribute('aria-pressed') ?? e.getAttribute('aria-checked') ?? '')); await shot('D2-prod-on');
  await p.locator('[data-test-id="profile_menu_button"]').click(); await p.waitForTimeout(1200); o.menu = await p.evaluate(() => [...document.querySelectorAll('.q-menu .q-item, .q-menu button')].map((e) => e.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 20)); await shot('D2-prod-menu');
  const before = new Set(o.menu); const locBtn = p.locator('.q-menu .q-btn, .q-menu button').filter({ hasText: /Trucks Hill/ }); o.locControls = await locBtn.evaluateAll((es) => es.map((e) => e.tagName + ':' + e.innerText.replace(/\s+/g, ' ').trim()));
  await locBtn.last().click(); await p.waitForTimeout(2000);
  o.choices = await p.evaluate(() => [...document.querySelectorAll('.q-menu .q-item, .q-dialog .q-item, .q-dialog button')].map((e) => e.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 20)); await shot('D2-prod-choices');
  const fresh = o.choices.filter((c) => !before.has(c) && !/Trucks Hill 2|Light|Dark|Logout|Settings|Timesheets|Portal|Billing|New|Edit Profile/.test(c));
  o.fresh = fresh; if (fresh.length) { o.pickedLocation = fresh[0]; await p.locator('.q-menu .q-item, .q-dialog .q-item, .q-dialog button').filter({ hasText: fresh[0] }).first().click(); await p.waitForTimeout(8000); }
  o.whereNow = await p.evaluate(() => document.body.innerText.match(/Change Location:[^\n]*/)?.[0] ?? null);
  o.urlAfter = p.url().replace(APP, ''); o.afterLooks = await p.locator('[data-test-id*="assigned"], button, .q-toggle, .q-chip').filter({ hasText: /Assigned to me/i }).first().evaluate((e) => e.className + ' ' + (e.getAttribute('aria-pressed') ?? e.getAttribute('aria-checked') ?? '')).catch(() => null); await shot('D2-prod-after');
  R.D2 = o; });
save(); await browser.close(); process.exit(0);
