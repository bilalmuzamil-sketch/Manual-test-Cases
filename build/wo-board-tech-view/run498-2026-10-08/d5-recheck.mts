/** D5 / C368131 re-check (9 Oct 2026), done the RIGHT way this time: the earlier check changed Ayesha Khan's
 *  staff-form Location (her MAIN location among those she is enrolled at), which does not take her off a location.
 *  Here her ENROLMENT at Staging Heavy Duty - 9919 is removed (the app's own route, StaffDialog > EnrollmentsDialog:
 *  POST /api/staff/enrollment/remove {staffId, workplaceId, departmentId}), read back, judged on screen, and put back.
 *  Positive control: the same column and lead list read BEFORE the removal. Source: PRD S3-R20a. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api, candidates, seedCase } from './data.mts';
import { staffRows, HEAVY } from './staff.mts';
import { t, tab, display, search, boardCols, toColumn, openReassign, EV } from './wob.mts';
import { setStaffLocation } from './staffloc.mts';
const { browser, page: p } = await open('/workorders');
const a = api(p); const R: any = {};
const say = (r: any) => `${r.status} ${JSON.stringify(r.body ?? '').slice(0, 160)}`;
const shot = (n: string) => p.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
const row = (await staffRows(a, 'ayesha.khan'))[0]; const AY = row.staff_id;
const enrolled = async () => ((await a.get(`/api/staff/${AY}/view`)).body?.data?.collection?.departments ?? []).map((d: any) => `${d.workplace}/${d.name}`);
const hd = ((await a.get(`/api/staff/${AY}/view`)).body?.data?.collection?.departments ?? []).find((d: any) => d.workplace_id === HEAVY);
R.before = { enrolled: await enrolled(), heavyDept: hd?.name };
const n = 'ZZAUTOTEST F2 Enrol Gone';
const [w] = await seedCase(a, n, 'ZZD5EG', [{ lead: null }]);
const prefsGet = async () => (await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {};
const pinsBefore: string[] = (await prefsGet()).pinnedTechnicianIds ?? [];
const bv = async () => { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await tab(p, 'All'); await display(p, 'Board View'); await search(p, n); await p.waitForTimeout(1500); };
const look = async (label: string) => {
  await bv(); const drawn = await toColumn(p, AY);
  const col = (await boardCols(p)).find((c) => c.id === AY) ?? null;
  const o: any = { drawn, column: col ? { name: col.name, pinned: col.pinned, count: col.count, text: col.empty } : 'no column on screen', candidateApi: (await candidates(a)).some((x) => x.name === 'Ayesha Khan') };
  await shot(`D5-${label}-board`);
  const { item } = await openReassign(p, w.id); await item.click(); await p.waitForTimeout(1500);
  o.offeredInReassign = (await p.locator(`[data-test-id="option_lead_technician_${AY}"]`).count()) > 0;
  o.reassignNames = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="option_lead_technician_"]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim()).filter(x => /Ayesha|Esther|Ralph/.test(x))`);
  await shot(`D5-${label}-reassign`);
  await p.locator('[data-test-id="button_cancel_reassign_lead_technician"]').click().catch(() => p.keyboard.press('Escape')); await p.waitForTimeout(800);
  return o;
};
try {
  // pin her so her (empty) column is drawn whatever the search
  await bv(); if (await toColumn(p, AY)) { const b = p.locator(`[data-test-id="button_board_pin_${AY}"]`); if ((await b.getAttribute('aria-pressed')) !== 'true') { await b.click(); await p.waitForTimeout(1500); } }
  R.control = await look('1-before');                                    // positive control: enrolled here
  // the app refuses to remove the enrolment at a person's MAIN location ("Staff must be enrolled in at least one
  // department from default location"), so the main location moves to Lethbridge first, as a user would have to
  R.mainMoved = await setStaffLocation(p, 'ayesha.khan', 'Staging Lethbridge');
  R.remove = say(await a.post('/api/staff/enrollment/remove', { staffId: AY, workplaceId: HEAVY, departmentId: hd.id }));
  R.afterRemove = { enrolled: await enrolled() };                       // read the precondition back
  R.removedHere = !R.afterRemove.enrolled.some((x: string) => x.startsWith('Staging Heavy Duty'));
  R.judged = await look('2-removed');
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3000);
  R.judgedAgain = await look('3-removed-again');                        // second attempt on a settled page
} finally {
  R.restore = say(await a.post('/api/staff/enrollment/create', { staffId: AY, workplaceId: HEAVY, departmentId: hd.id }));
  try { R.mainBack = await setStaffLocation(p, 'ayesha.khan', 'Staging Heavy Duty'); } catch (e: any) { R.mainBackError = String(e.message).slice(0, 160); }
  R.mainRead = (await staffRows(a, 'ayesha.khan'))[0]?.defaultWorkplaceName;
  R.restoredRead = { enrolled: await enrolled(), candidate: (await candidates(a)).some((x) => x.name === 'Ayesha Khan') };
  await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefsGet()), pinnedTechnicianIds: pinsBefore } });
  R.pinsRestored = JSON.stringify((await prefsGet()).pinnedTechnicianIds ?? []) === JSON.stringify(pinsBefore);
  fs.writeFileSync(path.join(EV, 'd5-recheck.json'), JSON.stringify(R, null, 1));
  console.log(t(), JSON.stringify(R, null, 1));
  await done(browser);
}
