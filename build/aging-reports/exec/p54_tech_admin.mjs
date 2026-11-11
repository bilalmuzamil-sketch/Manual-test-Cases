// p54_tech_admin.mjs — 11 Nov 2026: give the quick-login TECH user the Administrator role so a second, read-only tester lane (design captures)
// can run beside the Admin lane (p53 proved Admin + Tech stay signed in together). Standing rule (03-RUN-CHECK §8.2a): only the Tech user's role
// is ever changed, never the Admin's. Route (playbook 022): POST /api/staff/{staff_id}/change {first_name,last_name,email,workplace_id,role_id};
// the Tech staff_id is read from the Tech session's own fe-permissions answer (Tech is not in GET /api/staff). Then the Tech user signs in again
// and its permission count is read back. Writes p54/out.json; prints OK only if Tech then has the administrator template.
import { boot } from '../../testing-tools/qa-branch-boot.mjs'; import fs from 'fs';
const OUT = new URL('./p54/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const o = {};
const API = 'https://sv11315api.qa.shopview.com'; const ORG = 'd55bc308-e61a-438d-b5f1-c7a73c89d49f';
const req = (pg, m, u, b) => pg.evaluate(async ([m, u, b]) => { const r = await fetch(u, { method: m, credentials: 'include', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }); return { st: r.status, j: await r.json().catch(() => null) }; }, [m, API + u, b]);
try {
  const T = await boot('sv11315', '/workorders', 'tech'); const me = await req(T.page, 'GET', '/api/auth/me/fe-permissions'); const d = me.j?.data || me.j || {};
  o.techBefore = { slug: T.templateSlug, perms: T.nFePerms, keys: Object.keys(d).slice(0, 30) }; const user = d.user || d.staff || d;
  const staffId = d.staff_id || user.staff_id || d.staff?.id; o.staffId = staffId; o.user = { first: user.first_name, last: user.last_name, email: user.email, wp: user.workplace_id || d.workplace_id };
  const A = await boot('sv11315', '/administration/staff', 'admin'); const roles = await req(A.page, 'GET', `/api/organizations/${ORG}/roles?pagination[rowsPerPage]=100`);
  const list = roles.j?.data?.collection || roles.j?.data || []; const admin = list.find((r) => /^admin/i.test(r.name) && (r.default || r.template_slug === 'administrator' || /administrator/i.test(r.template_id || ''))) || list.find((r) => /^admin/i.test(r.name)); o.adminRole = admin && { id: admin.id, name: admin.name };
  if (!staffId || !admin) throw new Error('missing staff id or admin role: ' + JSON.stringify({ staffId, roles: list.map((r) => r.name).slice(0, 15) }));
  const wp = o.user.wp || 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
  o.change = await req(A.page, 'POST', `/api/staff/${staffId}/change`, { first_name: o.user.first, last_name: o.user.last, email: o.user.email, workplace_id: wp, role_id: admin.id });
  const T2 = await boot('sv11315', '/reports/ar-aging-summary', 'tech'); o.techAfter = { slug: T2.templateSlug, perms: T2.nFePerms, url: T2.page.url() }; await T2.page.screenshot({ path: OUT + 'tech-after.png' });
  o.ok = /admin/i.test(o.techAfter.slug || '');
} catch (e) { o.err = String(e).slice(0, 500); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(o.ok ? 'OK tech is administrator' : 'NOT OK', JSON.stringify({ change: o.change?.st, techAfter: o.techAfter, err: o.err })); process.exit(0);
