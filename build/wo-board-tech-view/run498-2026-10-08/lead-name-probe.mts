/** READ-ONLY PROBE (2026-10-09): in the D3 pictures Tech View groups three work orders under "Carol Neal" while their
 * Lead Technician column reads "David Sparks" (and S2-4132 sits under "Dylan Rush" with the column reading "Daniel
 * Montoya"). Reads what the work orders and the staff records hold, and the work order page's own Lead Technician. */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, workOrders } from './data.mts';
import { EV } from './wob.mts';
import { staffRows } from './staff.mts';
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; const a = api(p); const R: any = {};
const pick = (o: any) => Object.fromEntries(Object.entries(o ?? {}).filter(([k]) => /tech|lead|assign|advisor|name/i.test(k)).map(([k, v]) => [k, typeof v === 'object' ? JSON.stringify(v)?.slice(0, 160) : v]));
for (const q of ['ZZAUTOTEST Zeta Hauling', 'S2-4132']) { const rows = await workOrders(a, q).catch(() => []); R[q] = (rows as any[]).slice(0, 3).map((w) => ({ number: w.number, workplace: w.workplace_id ?? w.workplaceId, ...pick(w) }));
  const w: any = (rows as any[])[0]; if (w) { const v = (await a.get(`/api/work-orders/view/${w.id}`)).body?.data; R[q + ' view'] = pick(v?.work_order ?? v);
    await p.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
    R[q + ' page'] = (await p.locator('body').innerText()).replace(/\s+/g, ' ').match(/Lead Technician.{0,60}/)?.[0] ?? null; await p.screenshot({ path: path.join(EV, `lead-name-${q.replace(/\W+/g, '')}.png`) }); } }
for (const n of ['Carol', 'David Sparks', 'Dylan', 'Daniel Montoya']) R['staff ' + n] = (await staffRows(a, n)).slice(0, 4).map((s: any) => ({ name: `${s.first_name} ${s.last_name}`, staff_id: s.staff_id, user_id: s.id, email: s.email, updated: s.updated_at, workplaces: JSON.stringify(s.workplaces ?? s.locations ?? '').slice(0, 120) }));
// record links for the held reports' Environment sections (full links, house layout)
R.records = {}; for (const n of ['S10043-18032', 'S10043-17893', 'S10043-17986', 'S10043-17729', 'S10043-17730', 'S10043-17731']) { const w: any = ((await workOrders(a, n).catch(() => [])) as any[]).find((x) => x.number === n || String(x.number).endsWith(n.split('-').pop()!)); R.records[n] = w ? `${APP}/workorders/${w.id}/lines` : null; }
{ const ay: any = (await staffRows(a, 'Ayesha')).find((s: any) => `${s.first_name} ${s.last_name}` === 'Ayesha Khan'); R.records['Ayesha Khan'] = ay ? { user_id: ay.id, staff_id: ay.staff_id } : null; }
fs.writeFileSync(path.join(EV, 'lead-name-probe.json'), JSON.stringify(R, null, 1)); console.log(JSON.stringify(R, null, 1).slice(0, 6000));
await RUN.end(); await done(browser);
