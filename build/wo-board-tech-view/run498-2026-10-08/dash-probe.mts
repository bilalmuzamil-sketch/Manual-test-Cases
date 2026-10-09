/** READ-ONLY (2026-10-09), for C368246: four dashboard table cards say "No data for selected date range" and the Revenue card
 * reads "0 Invoices" this month, although two work orders with clocked labor were invoiced minutes earlier. Records what
 * the dashboard's own server calls return, then the Reports > Technician Utilization page for this month, to tell an
 * empty data feed on this branch from a dashboard that ignores data the reports can see. */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { EV, t, shot } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const R: any = { calls: [] as any[] };
p.on('response', async (r) => { const u = r.url(); if (!/\/api\//.test(u) || !/dash|report|metric|kpi|efficien|utiliz|revenue|risk/i.test(u)) return; let n: any = null; try { const j = await r.json(); n = JSON.stringify(j).length; R.calls.push({ url: u.replace(/^https:\/\/[^/]+/, '').slice(0, 140), status: r.status(), bytes: n, sample: JSON.stringify(j).slice(0, 220) }); } catch { R.calls.push({ url: u.replace(/^https:\/\/[^/]+/, '').slice(0, 140), status: r.status() }); } });
await p.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(15000); await shot(p, 'dash-probe-dashboard');
R.dashboardText = (await p.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 700);
await p.goto(APP + '/reports/technician-utilization', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(12000); await shot(p, 'dash-probe-tech-util');
R.reportText = (await p.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 900);
console.log(t(), 'DASHPROBE', JSON.stringify(R).slice(0, 4000)); fs.writeFileSync(path.join(EV, 'dash-probe.json'), JSON.stringify(R, null, 1)); await done(browser);
