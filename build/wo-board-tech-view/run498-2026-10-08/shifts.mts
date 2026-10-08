/** Shifts for the WO Board cases (2026-10-08): make one with POST /api/schedule/shifts (times are the location's local
 *  time, America/Edmonton at Heavy Duty) and read them back from the Schedule's own GET /api/schedule/board. */
import type { Api } from './data.mts';
const TZ = 'America/Edmonton';
export const localDate = (offsetDays = 0) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(Date.now() + offsetDays * 86400000));
export const localTime = (d: Date) => new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
export async function mkShift(a: Api, woId: string, staffId: string, day: number, start: string, minutes: number, lineIds: string[] = []) {
  const r = await a.post('/api/schedule/shifts', { workOrderId: woId, lineIds, staffId, startDate: localDate(day), startTime: start, spreadMode: 'single', totalMinutes: minutes, perDayMinutes: minutes, isAllDay: false });
  if (r.status >= 300) throw new Error(`shift ${r.status} ${JSON.stringify(r.body).slice(0, 200)}`);
  return r.body?.data?.shifts?.[0]?.id as string;
}
/** every shift on this work order between yesterday and three days ahead, as "who day hh:mm–hh:mm (whole|lines)" */
export async function shiftsOn(a: Api, woId: string, names: Record<string, string> = {}) {
  const from = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10) + 'T00:00:00.000Z';
  const to = new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10) + 'T00:00:00.000Z';
  const body = (await a.get(`/api/schedule/board?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)).body;
  const out: any[] = []; const seen = new Set<string>();
  const walk = (x: any) => { if (!x || typeof x !== 'object') return; if (Array.isArray(x)) return x.forEach(walk);
    if (x.startsAt && x.endsAt && x.workOrder?.id === woId && !seen.has(x.id)) { seen.add(x.id); out.push(x); }
    for (const v of Object.values(x)) walk(v); };
  walk(body);
  return out.map((s) => `${names[s.staffId] ?? s.staffId.slice(0, 6)} ${localDate(0) === new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date(s.startsAt)) ? 'today' : new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date(s.startsAt))} ${localTime(new Date(s.startsAt))}-${localTime(new Date(s.endsAt))} ${(s.lines?.length || s.lineIds?.length) ? 'lines' : 'whole'}`).sort();
}
