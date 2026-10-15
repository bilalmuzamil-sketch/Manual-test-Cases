/**
 * c368191-read.mts — 15 Oct 2026 (wave 18), SEVENTH pass. C368191 ("A line with labor by a deleted staff member still reads
 * Deleted user") cannot be set up on staging: deleting a staff member who has labor is refused ("Staff is being used elsewhere.",
 * wave 15). The sixth pass's high1-fix5 C368177-deleted-user reading looks at an EXISTING work order, S2-35973 (customer
 * "ZZAUTOTEST Move Labor 28477"), whose Line 2 may carry labor by a person who has since been deleted.
 * READ ONLY: this script first reads that reading (high1-fix5.json, written by the sixth pass). Only if it names a person on Line 2
 * whose staff record is gone (view answers 404 / not found, or a deleted date) does it open S2-35973 > Lines and read every Labor
 * row as the tester sees it, with a picture. Otherwise it records why nothing was checked. Nothing is changed on staging.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api, workOrders } from './data.mts';
import { EV, t, shot } from './wob.mts';

const R: any = {}; const o: any = {}; R.C368191 = o;
const src = path.join(EV, 'high1-fix5.json');
let reading: any = null; try { reading = JSON.parse(fs.readFileSync(src, 'utf8'))['C368177-deleted-user'] ?? null; } catch (e: any) { o.readingError = String(e?.message || e).slice(0, 120); }
o.sixthPassReading = reading ? { wo: reading.wo ?? null, error: reading.error ?? null, staff: reading.staff ?? null } : 'no C368177-deleted-user reading in high1-fix5.json';
const gone = reading?.staff ? Object.entries(reading.staff).filter(([, v]: any) => v && (v.viewStatus === 404 || v.deleted || /not found|deleted/i.test(String(v.message ?? '')))).map(([k, v]: any) => ({ staff: k, ...v })) : [];
o.deletedPeopleOnLine2 = gone;
// 15 Oct 2026 (wave 22): the sixth-pass reading named only Esther Howard (staff record found) on Line 2, yet the page draws a second
// Labor entry "Deleted user" under her. So the page is also read when that text was seen, and Line 2's own labor lists (logged_techs,
// assigned_techs, tech_times, task_records — raw) are written down to say WHICH entry is the deleted person. Still read only.
o.deletedUserOnScreenInSixthPass = /Deleted user/i.test(String(reading?.laborBlockText ?? ''));
if (!gone.length && !o.deletedUserOnScreenInSixthPass) {
  o.checked = false; o.why = 'the sixth-pass reading named no deleted person on S2-35973 Line 2, so there is no record to read; C368191 stays as reported in wave 15';
  console.log(t(), 'C368191', JSON.stringify(o).slice(0, 4000)); fs.writeFileSync(path.join(EV, 'c368191-read.json'), JSON.stringify(R, null, 1)); process.exit(0);
}
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p);
try {
  const ws = await workOrders(a, 'ZZAUTOTEST Move Labor 28477'); const w = ws.find((x: any) => x.number === 'S2-35973') ?? ws[0];
  if (!w) o.error = 'S2-35973 not found';
  else {
    o.wo = `${w.number} ${w.status}`;
    await p.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
    o.laborRows = await p.evaluate(`Object.fromEntries([...document.querySelectorAll('[data-test-id^="line_labor_name_"]')].map(e => [e.getAttribute('data-test-id').replace('line_labor_name_', '').slice(0, 8), e.innerText.replace(/\\s+/g, ' ').trim()]))`);
    o.laborTextOnPage = ((await p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText`)) as string).replace(/\s+/g, ' ').match(/Labor[^$]{0,80}/g)?.slice(0, 6) ?? [];
    o.readsDeletedUser = JSON.stringify(o.laborRows).includes('Deleted user') || o.laborTextOnPage.some((x: string) => /Deleted user/.test(x));
    { const d = (await a.get(`/api/work-orders/lines/${w.id}`)).body?.data; const ls: any[] = Array.isArray(d) ? d : d?.collection ?? d?.lines ?? []; const l2 = ls[1];
      o.line2Raw = l2 ? Object.fromEntries(['logged_techs', 'assigned_techs', 'tech_times', 'task_records', 'tasks', 'line_tech_assigned_id'].map((k) => [k, JSON.stringify(l2[k] ?? null).slice(0, 1500)])) : 'no Line 2'; }
    await shot(p, 'C368191-labor-rows'); o.checked = true;
  }
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot(p, 'C368191-error'); }
console.log(t(), 'C368191', JSON.stringify(o).slice(0, 4000));
fs.writeFileSync(path.join(EV, 'c368191-read.json'), JSON.stringify(R, null, 1));
await done(browser);
