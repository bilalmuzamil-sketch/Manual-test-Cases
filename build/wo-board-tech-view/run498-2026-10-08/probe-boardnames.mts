/** 14 Oct 2026 — read-only: compare the name the Board/Tech View header feed (GET work-orders/board) gives each technician with
 *  the staff record name (GET staff) and the lead-candidates name. Any difference = a live example for S5-R11b (C581895). */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts';
import { api } from './data.mts';
import { EV } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p);
const out: any = {};
const tries = ['/api/work-orders/board?tab=all', '/api/work-orders/board', '/api/work-orders/board?tab=all&groupBy=technician'];
for (const u of tries) { const r: any = await a.get(u).catch((e: any) => ({ status: 0, body: String(e) })); out[u] = { status: r.status, sample: JSON.stringify(r.body).slice(0, 1500) }; if (r.status === 200) { out.board = r.body; break; } }
const staff: any[] = []; for (let pg = 1; pg <= 20; pg++) { const r = await a.get(`/api/staff?limit=200&page=${pg}&pagination[page]=${pg}&pagination[rowsPerPage]=200`); const c = r.body?.data?.collection ?? []; const before = staff.length; for (const x of c) if (!staff.some((s) => s.staff_id === x.staff_id)) staff.push(x); if (staff.length === before) break; }
out.staffCount = staff.length;
const cand = ((await a.get('/api/work-orders/lead-technician-candidates')).body?.data?.technicians ?? []); out.candCount = cand.length; out.candKeys = Object.keys(cand[0] ?? {});
// walk the board body for objects with a staff id + a name
const heads: any[] = []; const walk = (x: any) => { if (!x || typeof x !== 'object') return; if (Array.isArray(x)) return x.forEach(walk); const id = x.staffId ?? x.key ?? x.staff_id; const nm = x.name ?? (x.firstName ? `${x.firstName} ${x.lastName}` : undefined); if (id && nm && typeof nm === 'string') heads.push({ id, name: nm, keys: Object.keys(x).slice(0, 12) }); for (const v of Object.values(x)) walk(v); };
walk(out.board); out.headCount = heads.length; out.headSample = heads.slice(0, 5);
const sName = (id: string) => { const s = staff.find((x) => x.staff_id === id || x.id === id); return s ? `${s.first_name} ${s.last_name}` : null; };
const cName = (id: string) => { const c = cand.find((x: any) => x.staffId === id || x.userId === id || x.id === id); return c ? `${c.firstName} ${c.lastName}` : null; };
out.diffs = heads.map((h) => ({ id: h.id, header: h.name, staff: sName(h.id), candidate: cName(h.id) })).filter((d) => (d.staff && d.staff !== d.header) || (d.candidate && d.candidate !== d.header));
out.candVsStaff = cand.map((c: any) => ({ id: c.staffId, cand: `${c.firstName} ${c.lastName}`, staff: sName(c.staffId) })).filter((d: any) => d.staff && d.staff !== d.cand);
delete out.board; fs.writeFileSync(path.join(EV, 'probe-boardnames.json'), JSON.stringify(out, null, 1)); console.log(JSON.stringify(out, null, 1).slice(0, 7000));
await done(browser);
