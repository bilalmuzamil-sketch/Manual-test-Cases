/**
 * C368191 data hunt, third pass (2026-10-09). The 3,000-work-order pass found the 'technician no longer exists' flag only on
 * the lines' TASKS (4,503 of them) — mostly tasks nobody was given. This pass keeps a task only when it also NAMES a
 * technician (an id or a name), records the first examples' fields, and opens up to three on screen. Earlier note: The first hunt stopped at 3 work orders whose lines carried "tech_exists":false
 * somewhere, but none of them read "Deleted user" — that flag sits on other parts of the line. This pass records WHERE the
 * flag sits (the JSON path), keeps only LABOR entries whose technician no longer exists, scans up to 3,000 work orders
 * (oldest first, so the January 2025 imported data is included), then opens up to three hits on screen. Read-only.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api } from './data.mts';
import { EV, t, shot } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p);
const R: any = { scanned: 0, paths: {} as Record<string, number>, hits: [] as any[] };
const walk = (o: any, at: string, out: string[]) => { if (!o || typeof o !== 'object') return; if (o.tech_exists === false) out.push(at); for (const [k, v] of Object.entries(o)) walk(v, `${at}.${Array.isArray(o) ? '[]' : k}`, out); };
const laborOf = (line: any) => [...(line.labor ?? []), ...(line.labors ?? []), ...(line.timesheets ?? []), ...(line.time_entries ?? [])];
outer: for (let page = 1; page <= 30; page++) {
  const r = await a.get(`/api/work-orders?pagination[page]=${page}&pagination[rowsPerPage]=100&pagination[sortBy]=createdAt&pagination[descending]=false`);
  const wos: any[] = r.body?.data?.work_orders ?? []; if (!wos.length) break;
  for (const w of wos) { R.scanned++; const lr = await a.get(`/api/work-orders/lines/${w.id}`).catch(() => null); const d = lr?.body?.data; const lines = Array.isArray(d) ? d : d?.collection ?? [];
    const paths: string[] = []; walk(lines, '', paths); for (const x of paths) R.paths[x.replace(/\.\[\]/g, '[]')] = (R.paths[x.replace(/\.\[\]/g, '[]')] ?? 0) + 1;
    for (const l of lines) { for (const tk of (l.tasks ?? [])) { if (tk?.tech_exists !== false) continue; if (!R.sample) R.sample = JSON.stringify(tk).slice(0, 400);
      const named = Object.entries(tk).some(([k, v]) => /tech|user|staff/i.test(k) && /id$/i.test(k) && v) || (tk.first_name && tk.first_name !== 'Unassigned') || tk.last_name;
      if (named) { R.hits.push({ id: w.id, number: w.number, status: w.status, line: l.line_number ?? l.id, task: JSON.stringify(tk).slice(0, 300) }); if (R.hits.length >= 3) break outer; } } } }
  console.log(t(), 'page', page, 'scanned', R.scanned, 'hits', R.hits.length);
}
console.log(t(), 'paths', JSON.stringify(R.paths).slice(0, 600));
for (const h of R.hits.slice(0, 3)) { await p.goto(`${APP}/workorders/${h.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  h.screen = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="line_labor_name_"]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim())`); h.deletedUser = (h.screen as string[]).some((x) => /Deleted user/i.test(x)); await shot(p, `C368191-found3-${h.number}`); }
console.log(t(), 'C368191hunt3', JSON.stringify(R).slice(0, 2500)); fs.writeFileSync(path.join(EV, 'deleted-search3.json'), JSON.stringify(R, null, 1)); await done(browser);
