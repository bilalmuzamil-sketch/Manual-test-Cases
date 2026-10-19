/** prod-deleted-lead.mts — 19 Oct 2026, Rule 121/PRD "as today" check for C614711 step 8 on PRODUCTION (dummy environment, authorised; password
 *  sign-in via prod-login-boot.mjs, credentials in /tmp). PRD v64 S3-R20e: "List shows the Lead Technician as blank for these work orders, as
 *  today." Question: what does production's List show TODAY in Lead Technician when a work order's lead has been deleted?
 *  Set-up through the app's own calls: a throwaway technician (public yopmail address, Technician role, enrolled at the current location,
 *  Time Clock on) made lead of an existing Approved work order; the technician is then deleted (DELETE /api/staff/{id}, the Staff screen's
 *  Delete). Then the SCREEN: Work Orders > All > List, search the work order number, read the Lead Technician cell + picture. Finally the work
 *  order's lead is put back to what it was. Output EV/prod-deleted-lead.json, pictures EV/C614711-prod-*.png. */
import fs from 'node:fs'; import path from 'node:path';
const EV = process.env.WOB_EV || path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence');
const { bootProdLogin } = await import('../../testing-tools/prod-login-boot.mjs') as any;
const P = await bootProdLogin('/workorders', { viewport: { width: 1600, height: 1000 }, deviceScaleFactor: Number(process.env.QA_DPR || 1) });
const pg = P.page; const APP = P.APP; pg.setDefaultTimeout(20_000); const W = (ms: number) => pg.waitForTimeout(ms);
const api = (m: string, u: string, b?: any) => pg.evaluate(async ([m0, u0, b0]: any) => { const r = await fetch(`https://api.shopview.com${u0}`, { method: m0, credentials: 'include', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: b0 ? JSON.stringify(b0) : undefined }); let j: any = null; try { j = await r.json(); } catch {} return { status: r.status, body: j }; }, [m, u, b]);
const coll = (d: any) => Array.isArray(d) ? d : d?.collection ?? [];
const o: any = { version: P.version ?? null, at: new Date().toISOString() };
try {
  const staff = coll((await api('GET', '/api/staff?limit=200')).body?.data);
  const roles: Record<string, string> = {}; for (const s of staff) if (s.role_label && s.role_id) roles[s.role_label] = s.role_id;
  const depts = coll((await api('GET', '/api/departments')).body?.data); const svc = depts.find((d: any) => /service/i.test(d.name ?? d.label ?? '')) ?? depts[0];
  const me = (await api('GET', '/api/auth/me')).body?.data; const wp = me?.workplace_id ?? me?.user?.workplace_id ?? staff.find((s: any) => /bilal/i.test(s.email))?.workplace_id;
  o.setup = { role: roles['Technician'] ? 'Technician' : Object.keys(roles)[0], dept: svc?.name ?? svc?.label, workplace: !!wp };
  const tag = String(Date.now()).slice(-6); const email = `zzwob-prod-deleted-${tag}@yopmail.com`;
  o.createRes = (await api('POST', '/api/iam/create', { email, first_name: 'ZZAUTOTEST', last_name: `Deleted Lead ${tag}`, role_id: roles['Technician'] ?? Object.values(roles)[0], departments: [svc?.id].filter(Boolean), workPlaceId: wp, workplace_id: wp })); o.create = o.createRes.status; o.createBody = JSON.stringify(o.createRes.body).slice(0, 300); delete o.createRes;
  const row = coll((await api('GET', `/api/staff?limit=50&search=${encodeURIComponent(email.split('@')[0])}`)).body?.data).find((x: any) => String(x.email).toLowerCase() === email);
  if (!row) throw new Error('staff not created: ' + o.create);
  o.clock = (await api('POST', `/api/staff/${row.staff_id}/change`, { first_name: row.first_name, last_name: row.last_name, email: row.email, role_id: row.role_id, workplace_id: row.workplace_id ?? wp, job_title: null, salary_type: null, salary: null, billable: 0, clockable: true, is_sales_rep: false })).status;
  if (wp && svc) o.enrol = (await api('POST', '/api/staff/enrollment/create', { staffId: row.staff_id, workplaceId: row.workplace_id ?? wp, departmentId: svc.id })).status;
  const wos = (await api('GET', '/api/work-orders?pagination[rowsPerPage]=200&search=')).body?.data?.work_orders ?? [];
  const w = wos.find((x: any) => /^approved$/i.test(String(x.status))); if (!w) throw new Error('no Approved work order');
  o.wo = { number: w.number, id: w.id, leadBefore: w.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName}` : null, leadBeforeId: w.techAssignedId ?? w.tech_assigned_id ?? null };
  o.lead = (await api('POST', '/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: row.staff_id })).status;
  o.leadRead = ((await api('GET', `/api/work-orders?pagination[rowsPerPage]=5&search=${encodeURIComponent(w.number)}`)).body?.data?.work_orders ?? []).map((x: any) => `${x.number} ${x.techAssignedFirstName ?? ''} ${x.techAssignedLastName ?? ''}`.trim());
  o.del = (await api('DELETE', `/api/staff/${row.id}`)).status; if (o.del >= 300) o.del2 = (await api('DELETE', `/api/staff/${row.staff_id}`)).status;
  o.goneFromStaff = !coll((await api('GET', `/api/staff?limit=50&search=${encodeURIComponent(email.split('@')[0])}`)).body?.data).some((x: any) => String(x.email).toLowerCase() === email);
  await pg.goto(`${APP}/workorders`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(7000);
  await pg.locator('.q-tab, [role=tab]').filter({ hasText: /^\s*All\s*$/ }).first().click().catch(() => {}); await W(2500);
  const lst = pg.locator('[aria-label="List"]').first(); if (await lst.count()) { await lst.click().catch(() => {}); await W(2500); }
  await pg.getByText('Search', { exact: true }).first().click().catch(() => {}); await W(500);
  await pg.locator('[data-test-id="page_search_input"], input[placeholder*="earch" i]').first().fill(w.number).catch(() => {}); await W(4000);
  o.screen = await pg.evaluate(`(() => { const hs = [...document.querySelectorAll('thead th')].map(e => e.innerText.replace(/arrow_drop_(up|down)|arrow_(up|down)ward/g,'').replace(/\\s+/g,' ').trim());
    const i = hs.findIndex(h => /^Lead Technician$/i.test(h)); const row = [...document.querySelectorAll('tbody tr')].find(tr => tr.innerText.includes(${JSON.stringify(w.number)}));
    return { headings: hs, leadIndex: i, cell: row && i >= 0 ? row.children[i].innerText.replace(/\\s+/g,' ').trim() : null, rowFound: !!row }; })()`);
  await pg.screenshot({ path: path.join(EV, 'C614711-prod-list-deleted-lead.png') }).catch(() => {});
  o.restore = (await api('POST', '/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: o.wo.leadBeforeId })).status;
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
fs.writeFileSync(path.join(EV, 'prod-deleted-lead.json'), JSON.stringify(o, null, 1)); console.log('PRODDEL', JSON.stringify(o));
await P.browser?.close?.().catch(() => {}); process.exit(0);
