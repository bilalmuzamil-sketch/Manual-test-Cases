/** Production re-check for D8 (9 Oct 2026, ~18:00). The first production check (prod-check.mjs) was FLAWED: every technician
 *  offered on its line was already on it (each option began with the tick "check"), so its "add" may have changed nothing.
 *  Here: (A) a line that ALREADY has a technician gets one MORE, picked from the options NOT ticked; (B) control — a line
 *  with NO technician gets its first. For each: the line's technicians and its history are read before and after.
 *  Second production test account only (PROD_ENVF=/tmp/shopview/prod-login-second.env). Values never printed. */
import fs from 'fs'; import path from 'path';
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'prod-2026-10-09'); fs.mkdirSync(EV, { recursive: true });
const t = () => new Date().toISOString().slice(11, 19); const R = {};
const save = () => fs.writeFileSync(path.join(EV, 'prod-d8b.json'), JSON.stringify(R, null, 1));
const { browser, page: p, ctx, APP, version } = await bootProdLogin('/workorders', { deviceScaleFactor: 2, viewport: { width: 1600, height: 1000 } });
R.version = version; const shot = (n) => p.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
const api = async (m, u, body) => { const r = await ctx.request.fetch(`https://api.shopview.com${u}`, { method: m, data: body, headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, ignoreHTTPSErrors: true }); let b = null; try { b = await r.json(); } catch { /* */ } return { status: r.status(), body: b }; };
const rows = (b) => { const d = b?.data; return Array.isArray(d) ? d : d?.collection ?? d?.work_orders ?? d?.workOrders ?? []; };
const techs = (l) => (l?.tasks ?? []).map((x) => `${x.first_name} ${x.last_name}`);
const lineOf = async (wo, lid) => rows((await api('GET', `/api/work-orders/lines/${wo.id}`)).body).find((x) => (x.line_id ?? x.id) === lid);
const hist = async (lid) => { const r = await api('GET', `/api/work-orders/lines/${lid}/history`); const h = r.body?.data?.history ?? r.body?.data?.collection ?? r.body?.data ?? []; return Array.isArray(h) ? h.map((e) => JSON.stringify(e).replace(/"[a-z_]*id":"[^"]*",?/g, '').slice(0, 160)) : []; };
const ws = rows((await api('GET', '/api/work-orders?pagination[rowsPerPage]=100')).body).filter((w) => /approved|in.?progress/i.test(JSON.stringify(w.status ?? w.workOrderStatus ?? '')));
async function attempt(key, want) {   // want: 'has' = line already has >=1 technician, 'none' = line has none
  for (const w of ws) {
    const ls = rows((await api('GET', `/api/work-orders/lines/${w.id}`)).body);
    const line = ls.find((l) => (want === 'has' ? techs(l).length >= 1 : techs(l).length === 0) && !/complete/i.test(JSON.stringify(l.status ?? l.line_status ?? '')));
    if (!line) continue;
    const lid = line.line_id ?? line.id; const name = String(line.line_name ?? line.name ?? '').trim(); if (!name) continue;
    await p.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
    await p.getByText(name, { exact: false }).first().click().catch(() => {}); await p.waitForTimeout(2500);
    const dlg = p.locator('.q-dialog').last(); if (!(await dlg.isVisible().catch(() => false))) continue;
    const fld = dlg.locator('.q-field').filter({ hasText: /Add Technician/i }).first(); if (!(await fld.count())) { await p.keyboard.press('Escape'); continue; }
    await fld.click(); await p.waitForTimeout(1000);
    const opts = p.locator('.q-menu .q-item'); const texts = (await opts.allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').trim());
    const idx = texts.findIndex((x) => !/^check\b/.test(x)); if (idx < 0) { await p.keyboard.press('Escape'); await p.keyboard.press('Escape'); continue; }
    const o = { wo: w.number, line: name, before: techs(line), historyBefore: await hist(lid), options: texts.map((x) => x.slice(0, 40)), picked: texts[idx].slice(0, 40) };
    await opts.nth(idx).click(); await p.waitForTimeout(800); await dlg.locator('.text-h6, .q-card__section').first().click().catch(() => {}); await shot(`${key}-picked`);
    await dlg.locator('button').filter({ hasText: /Save & Close/i }).last().click(); await p.waitForTimeout(4500);
    o.after = techs(await lineOf(w, lid)); o.historyAfter = await hist(lid); o.added = o.after.length > o.before.length;
    o.newHistory = o.historyAfter.filter((e) => !o.historyBefore.includes(e));
    await shot(`${key}-after`); R[key] = o; save(); console.log(t(), key, JSON.stringify(o).slice(0, 1200)); return;
  }
  R[key] = { notFound: true }; save(); console.log(t(), key, 'no suitable line found');
}
try { await attempt('D8b-second', 'has'); await attempt('D8b-first', 'none'); } finally { save(); await browser.close(); }
