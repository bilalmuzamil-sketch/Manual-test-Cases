/** 15 Oct 2026 — read-only, PRODUCTION: are there technicians whose name in the Work Orders feeds differs between the List's
 *  source (work order list techAssignedFirstName / staff list) and the Board/Tech View header source (work-orders/board
 *  technician.firstName, lead-technician-candidates)? For Chris's S5-R11b bug: staging keeps one name (L0349), the QA branch
 *  cannot be signed into tonight. No writes. */
import fs from 'node:fs'; import path from 'node:path';
// @ts-ignore
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs';
import { EV } from './wob.mts';
const { browser, page: p } = await bootProdLogin('/workorders', {});
const API = 'https://api.shopview.com';
const get = (u: string) => p.evaluate(async ([A, u]) => { const r = await fetch(A + u, { credentials: 'include', headers: { Accept: 'application/json' } }); let b = null; try { b = await r.json(); } catch {} return { status: r.status, body: b }; }, [API, u] as const);
const out: any = { build: await p.evaluate(`document.querySelector('meta[name="app-version"]')?.content || null`) };
const board = await get('/api/work-orders/board?tab=all'); out.boardStatus = board.status;
const cand = await get('/api/work-orders/lead-technician-candidates'); out.candStatus = cand.status;
const staff: any[] = []; for (let pg = 1; pg <= 20; pg++) { const r = await get(`/api/staff?limit=200&page=${pg}&pagination[page]=${pg}&pagination[rowsPerPage]=200`); const c = r.body?.data?.collection ?? []; const n0 = staff.length; for (const x of c) if (!staff.some((s) => s.staff_id === x.staff_id)) staff.push(x); if (staff.length === n0) break; }
out.staff = staff.length;
const heads: any[] = []; const walk = (x: any) => { if (!x || typeof x !== 'object') return; if (Array.isArray(x)) return x.forEach(walk); if (x.staffId && x.firstName !== undefined) heads.push({ id: x.staffId, name: `${x.firstName} ${x.lastName}` }); for (const v of Object.values(x)) walk(v); };
walk(board.body); out.heads = heads.length;
const cands = (cand.body?.data?.technicians ?? []).map((c: any) => ({ id: c.staffId, name: `${c.firstName} ${c.lastName}` })); out.cands = cands.length;
const sName = (id: string) => { const s = staff.find((x) => x.staff_id === id); return s ? `${s.first_name} ${s.last_name}` : null; };
out.headVsStaff = heads.map((h) => ({ header: h.name, staff: sName(h.id) })).filter((d) => d.staff && d.staff !== d.header);
out.candVsStaff = cands.map((c: any) => ({ cand: c.name, staff: sName(c.id) })).filter((d: any) => d.staff && d.staff !== d.cand);
const wos = await get('/api/work-orders?pagination[rowsPerPage]=200&tab=all'); const ws = wos.body?.data?.work_orders ?? [];
out.listVsStaff = ws.filter((w: any) => w.techAssignedId).map((w: any) => ({ wo: w.number, list: `${w.techAssignedFirstName} ${w.techAssignedLastName}`, staff: sName(w.techAssignedId), header: heads.find((h) => h.id === w.techAssignedId)?.name ?? null })).filter((d: any) => (d.staff && d.staff !== d.list) || (d.header && d.header !== d.list)).slice(0, 20);
fs.mkdirSync(path.join(EV, '..', 'prod-names-2026-10-15'), { recursive: true });
fs.writeFileSync(path.join(EV, '..', 'prod-names-2026-10-15', 'probe-prodnames.json'), JSON.stringify(out, null, 1)); console.log(JSON.stringify(out, null, 1).slice(0, 5000));
await browser.close(); process.exit(0);
