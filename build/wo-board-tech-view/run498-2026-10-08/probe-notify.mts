/**
 * C96958 positive control (2026-10-09): batch H read every technician's Notifications page as empty after each lead
 * change. Before "no notification" is believed, show the same reader DOES see one: write a work order note that
 * @mentions Esther Howard (note/create {type, reference_id, content, mentions:[{referenceId,label}]} — product code
 * @ 7a95011 CreateNoteDialog) and read her Notifications page the same way batch H did.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, workOrders } from './data.mts';
import { EV, t, shot } from './wob.mts';
import { staffRows } from './staff.mts';
import { viewAs } from './viewas.mts';
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; const a = api(p);
const R: any = {};
const ES = (await staffRows(a, 'zz.wob.esther.howard@staging.shopview.local'))[0];
const wo = (await workOrders(a, 'ZZAUTOTEST F1 Lead Notifications'))[0];
R.wo = wo?.number;
const read = async () => { const v = await viewAs(browser, p, a, ES.id, RUN.me?.id ?? '', RUN.toRunner);
  try { await v.page.goto(`${APP}/notifications`, { waitUntil: 'domcontentloaded' }); await v.page.waitForTimeout(6000);
    const items = await v.page.evaluate(`[...document.querySelectorAll('.note-item')].map(e => e.innerText.replace(/\\s+/g, ' ').trim().slice(0, 200))`) as string[];
    await shot(v.page, 'C96958-control-esther'); return { count: items.length, items: items.slice(0, 3), empty: await v.page.getByText('There are no notifications').count() };
  } finally { await v.close(); } };
R.before = await read();
for (const [k, ref] of [['user id', ES.id], ['staff id', ES.staff_id]] as [string, string][]) {
  const r = await a.post('/api/note/create', { type: 'work_order', reference_id: wo.id, content: `@Esther Howard ZZAUTOTEST positive control (${k}) for C96958`, reminder_date: null, mentions: [{ referenceId: ref, label: 'Esther Howard' }] });
  R[`create ${k}`] = `${r.status} ${JSON.stringify(r.body).slice(0, 200)}`;
  await p.waitForTimeout(8000); R[`after ${k}`] = await read();
  if (R[`after ${k}`].count > R.before.count) break;
}
console.log(t(), JSON.stringify(R, null, 1).slice(0, 4000));
fs.writeFileSync(path.join(EV, 'C96958-control.json'), JSON.stringify(R, null, 1));
await RUN.end(); await done(browser);
