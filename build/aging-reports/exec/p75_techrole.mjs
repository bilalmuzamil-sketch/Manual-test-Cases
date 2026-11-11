// p75_techrole.mjs — 11 Nov 2026 ~16:00: can the quick-login Tech user's role be changed on sv11315? p54 (L0637) tried the ids from the Tech
// session's localStorage and got 404. TESTING-RUNBOOK "Assign a specific permission set to Tech" names the EXACT Tech staff_id
// 6fb22c1b-d6c3-40eb-9cac-5cb9c61e36aa (never match by email). Harmless proof: re-send Tech's CURRENT role (Technician) with that id - a 2xx
// means the route works here (no change of permissions); then read GET /api/staff/{id} if it answers. Also lists the Staff screen rows naming
// "Tech" (the UI route). Output p75/out.json.
import { boot } from '../../testing-tools/qa-branch-boot.mjs'; import fs from 'fs';
const OUT = new URL('./p75/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const o = {};
const API = 'https://sv11315api.qa.shopview.com'; const ORG = 'd55bc308-e61a-438d-b5f1-c7a73c89d49f'; const SID = '6fb22c1b-d6c3-40eb-9cac-5cb9c61e36aa';
const req = (pg, m, u, b) => pg.evaluate(async ([m, u, b]) => { const r = await fetch(u, { method: m, credentials: 'include', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }); return { st: r.status, j: await r.json().catch(() => null) }; }, [m, API + u, b]);
try { const A = await boot('sv11315', '/administration/staff', 'admin'); const p = A.page;
  const roles = await req(p, 'GET', `/api/organizations/${ORG}/roles?pagination[rowsPerPage]=200`); const list = roles.j?.data?.collection || roles.j?.data || []; o.roleNames = list.map((r) => [r.name, r.id, r.template_slug || r.slug]).slice(0, 60);
  const tech = list.find((r) => /^technician$/i.test(r.name)) || list.find((r) => /technician/i.test(r.template_slug || '')); o.techRole = tech && [tech.name, tech.id];
  o.get = await req(p, 'GET', `/api/staff/${SID}`); o.get.j = JSON.stringify(o.get.j).slice(0, 600);
  if (tech) { o.change = await req(p, 'POST', `/api/staff/${SID}/change`, { first_name: 'Tech', last_name: 'ShopView', email: 'tech@shopview.com', workplace_id: 'b3c8c820-f815-4cf1-8938-10956c5ee71a', role_id: tech.id }); o.change.j = JSON.stringify(o.change.j).slice(0, 400); }
  await p.waitForTimeout(3000); o.staffScreen = (await p.locator('main').innerText().catch(() => '')).split('\n').filter((l) => /tech/i.test(l)).slice(0, 10); await p.screenshot({ path: OUT + 'staff.png' });
} catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('p75', JSON.stringify({ techRole: o.techRole, get: o.get?.st, change: o.change && [o.change.st, o.change.j.slice(0, 150)], staff: o.staffScreen, err: o.err })); process.exit(0);
