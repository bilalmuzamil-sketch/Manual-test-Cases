/** 12 Oct 2026 — data for re-testing Ahtasham's three failures (SV-11128, SV-11126, SV-11074) in a normal browser.
 *  API only (times are the location's own America/Edmonton, see shifts.mts); the checks themselves are done on screen in ah-ui.mts. */
import fs from 'node:fs'; import path from 'node:path';
import { open, APP } from './session.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { staffRows, HEAVY } from './staff.mts';
import { mkShift, shiftsOn, localTime } from './shifts.mts';
const EVD = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'retest-e84b3d1-2026-10-12');
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p);
await a.post('/api/exit-switch-user', {});
// the account's location must be the Mountain-time shop: a normal sign-in elsewhere can leave it on a Dubai-time shop, and shifts then follow that clock
const reloc = await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' });
const who = (await a.get('/api/auth/me')).body?.data; const locNow = who?.details?.workplace_timezone ?? who?.workplace_timezone ?? null;
const D = '@staging.shopview.local'; const sid = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
const ES = await sid('esther.howard'), RE = await sid('ralph.edwards'), DO = await sid('dana.ortiz');
const canned: any[] = []; { const c = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(c) ? c : c?.collection ?? [])); }
const mkLine = async (wo: string, i: number) => (await a.post(`/api/work-orders/${wo}/lines/create-from-canned-line`, { canned_line_id: canned[i % canned.length].id, status: 'authorized' })).body?.data?.line_id as string;
const RUN = String(Date.now() % 100000);
const make = async (name: string, lines: number, lead: string | null) => { const c = await customer(a, `${name} ${RUN}`, 'TRK-301'); const id = await workOrder(a, c, 'estimate', null); for (let i = 0; i < lines; i++) await mkLine(id, i + 1);
  await a.post('/api/work-orders/change-status', { id, status: 'approved' }); if (lead) await a.post('/api/work-orders/change-lead-technician', { work_order_id: id, tech_assigned_id: lead });
  const w = (await workOrders(a, `${name} ${RUN}`))[0]; return { id, number: w?.number, customer: `${name} ${RUN}` }; };
const q = 15 * 60000; const startRun = localTime(new Date(Math.floor((Date.now() - 15 * 60000) / q) * q));   // started a little before now, so it is under way
const startISO = new Date(Math.floor((Date.now() - 15 * 60000) / q) * q).toISOString();
// a shift is created with startDate/startTime (read in a zone this account no longer controls), then MOVED to an exact
// moment — the Schedule's own move (PATCH startsAt, playbook) — so it is under way now whatever that zone is
const shiftNow = async (wo: string, staff: string) => { const id = await mkShift(a, wo, staff, 0, startRun, 180); const m = await a.patch(`/api/schedule/shifts/${id}`, { startsAt: startISO, durationMinutes: 180, scope: 'shift' }); return { id, move: m.status }; };
const R: any = { DO: DO?.staff_id, startISO, reloc: reloc.status, locNow, ES: ES.staff_id, RE: RE.staff_id, startRun, now: localTime(new Date()) };
// SV-11128: line got onto Esther implicitly (lead set while the line was unassigned); whole-work-order shift for Ralph today, not ended
R.follow = await make('ZZAUTOTEST AH Line Follow', 1, ES.staff_id); if (!process.env.NOSHIFT) R.shiftFollow = await shiftNow(R.follow.id, RE.staff_id);
// SV-11126: Esther (the lead) has a whole-work-order shift today, under way
R.prompt = await make('ZZAUTOTEST AH Clear Prompt', 2, ES.staff_id); if (!process.env.NOSHIFT) R.shiftPrompt = await shiftNow(R.prompt.id, ES.staff_id);
// SV-11074: an unassigned work order in the Unassigned column
if (!process.env.NOSHIFT) R.offline = await make('ZZAUTOTEST AH Offline', 1, null);
const names = { [ES.staff_id]: 'Esther', [RE.staff_id]: 'Ralph' };
R.shiftsFollow = await shiftsOn(a, R.follow.id, names); R.shiftsPrompt = await shiftsOn(a, R.prompt.id, names);
fs.writeFileSync(path.join(EVD, process.env.NOSHIFT ? 'seed2.json' : 'seed.json'), JSON.stringify(R, null, 1)); console.log('SEED', JSON.stringify(R));
await browser.close(); process.exit(0);
