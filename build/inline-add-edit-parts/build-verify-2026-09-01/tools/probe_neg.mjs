// probe_neg.mjs — the NEGATIVE and EDGE cases of suite 6597: the ones that need a data state or a
// forced failure rather than a happy path.
//
//  * S1-N1 / S1-N2  — a work order in a status that forbids editing. Only ONE such status exists in
//                     this branch's data: Paid (3,000 work orders were paged; statuses present are
//                     estimate, approved, paid). Complete / Invoiced / Declined / Imported do not
//                     exist here, so they are a DATA-STATE gap, not a finding.
//  * S1-N3 / S3-N2 / S5-N1 — a user WITHOUT 'Work Order Line - Create and Edit'. A throwaway role is
//                     created (ZZAUTOTEST), the technician is moved onto it, the screen is read, and
//                     the technician is put back on the Technician role in the same run (Rule 26).
//  * S2-E3 / S3-E2 / S4-E3 — the work order stops being editable WHILE the row is open.
//  * S2-EH1 / S4-EH1 — any other save failure: the save request is aborted at the network layer.
//  * S3-E1 — the part is changed by someone else while the edit row is open.
import { boot, APP, apiGet, apiPost } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const WO = 'c6d4b883-6f78-4c9e-ab7e-436a6d99c17a';                    // S9315-14846, estimate
const PAID_WO = '06747f14-bf1e-4c03-8358-732e78b0167d';               // S2-15522, paid
const TECH = '2d36a5f5-c957-45e0-a376-46d24df2a44c';                  // Christopher Smith
const TECH_ROLE = '2d4b8464-81a9-4c1e-96c6-a2a64f02a389';             // Technician
const results = {};
const { browser, page } = await boot('/workorders');
const settle = async (m = 1200) => {
  await page.waitForFunction(x => (document.body?.innerText || '').length > x, m, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3200);
};
const goLines = async (id) => {
  await page.goto(`${APP}/workorders/${id}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await settle();
  return page.evaluate(() => ({
    onLogin: /\/login/.test(location.pathname),
    chars: (document.body?.innerText || '').length,
    addPart: document.querySelectorAll('[data-test-id="button_add_part"]').length,
    editBtns: document.querySelectorAll('[data-test-id="button_edit_part"]').length,
    statusOnScreen: (document.body?.innerText || '').replace(/\s+/g,' ').slice(0, 200),
  }));
};
const set = async (id, v) => page.evaluate(([i, val]) => {
  const e = document.querySelector(`[data-test-id="${i}"]`);
  const inp = e && (e.matches('input,textarea') ? e : e.querySelector('input,textarea'));
  if (!inp) return false;
  inp.focus(); inp.value = val;
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  inp.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}, [id, v]);
const surface = () => page.evaluate(() => {
  const dlg = document.querySelector('.q-dialog');
  const row = document.querySelector('[data-test-id="inline_part_row"]') || document.querySelector('[data-test-id="inline_part_edit_row"]');
  const val = i => { const e = document.querySelector(`[data-test-id="${i}"]`);
    const n = e && (e.matches('input,textarea') ? e : e.querySelector('input,textarea')); return n ? n.value : null; };
  return {
    addRowOpen: !!document.querySelector('[data-test-id="inline_part_row"]'),
    editRowOpen: !!document.querySelector('[data-test-id="inline_part_edit_row"]'),
    values: { desc: val('input_inline_part_description'), qty: val('input_inline_part_quantity') },
    dialog: dlg ? (dlg.innerText || '').replace(/\s+/g,' ').slice(0, 300) : null,
    toast: [...document.querySelectorAll('.q-notification')].map(e => (e.innerText||'').replace(/\s+/g,' ').trim()),
    sentences: (() => { const t = document.body?.innerText || '';
      return { noLongerEditable: t.includes('can no longer be edited'),
               couldntAdd: t.includes("Couldn't add the part"),
               changedBySomeoneElse: t.includes('changed by someone else') }; })(),
    rowText: row ? (row.innerText || '').replace(/\s+/g,' ').slice(0, 300) : null,
  };
});

const P = {};

// ---- N1: the Paid work order — Add Part and Edit must both be absent ----
P['N1-paid-work-order'] = async () => {
  const paid = await goLines(PAID_WO);
  const editable = await goLines(WO);
  await page.goto(`${APP}/workorders/${PAID_WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await settle();
  await page.screenshot({ path: `${OUT}/evidence/neg-paid-wo.png`, fullPage: true });
  return { paidWorkOrder: paid, positiveControlEditableWorkOrder: editable };
};

// ---- N3: a role WITHOUT 'Work Order Line - Create and Edit' ----
P['N3-no-permission'] = async () => {
  const before = await apiGet(`/api/roles/${TECH_ROLE}`);
  const perms = (before.body?.data?.fe_permissions || []).map(p => p.code || p.name);
  // build a throwaway role from the Technician role minus workOrderLinesCreateAndEdit
  const src = before.body?.data || {};
  const keep = (src.fe_permissions || []).filter(p => (p.code || p.name) !== 'workOrderLinesCreateAndEdit');
  const created = await apiPost('/api/roles', {
    name: 'ZZAUTOTEST no create-edit', description: 'throwaway, 6597 build verification',
    view_mode: 'tech', fe_permissions: keep.map(p => p.id), template_id: src.template_id,
  });
  let assigned = null, observed = null, restored = null, newRole = created.body?.data?.id;
  if (created.status === 200 || created.status === 201) {
    assigned = await apiPost(`/api/users/${TECH}/role`, { role_id: newRole });
    if (assigned.status >= 400) assigned = await apiPost(`/api/staff/${TECH}`, { role_id: newRole });
    await apiPost('/api/exit-switch-user', {}).catch(() => {});
    const sw = await apiPost('/api/switch-user', { user_id: TECH });
    if (sw.status < 400) {
      await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
      observed = await goLines(WO);
      await page.screenshot({ path: `${OUT}/evidence/neg-no-permission.png`, fullPage: true });
    }
    await apiPost('/api/exit-switch-user', {}).catch(() => {});
    // put the technician back, then delete the throwaway role
    restored = await apiPost(`/api/users/${TECH}/role`, { role_id: TECH_ROLE });
    if (restored.status >= 400) restored = await apiPost(`/api/staff/${TECH}`, { role_id: TECH_ROLE });
  }
  return { technicianPermissionsBefore: perms, roleCreate: { status: created.status, id: newRole, body: JSON.stringify(created.body).slice(0, 300) },
           roleAssign: assigned && { status: assigned.status, body: JSON.stringify(assigned.body).slice(0, 200) },
           screenWithoutThePermission: observed,
           roleRestored: restored && { status: restored.status } };
};

// ---- E3: the work order stops being editable while the row is open ----
P['E3-becomes-uneditable'] = async () => {
  const ok = await goLines(WO);
  await page.evaluate(() => document.querySelector('[data-test-id="button_add_part"]')?.click());
  await page.waitForTimeout(4000);
  await set('input_inline_part_description', 'ZZAUTOTEST uneditable ' + Date.now());
  await set('input_inline_part_quantity', '1');
  await set('input_inline_part_cost', '1.00');
  await set('input_inline_part_sell_price', '2.00');
  await page.waitForTimeout(1200);
  // flip the status behind the open row
  const flip = await apiPost('/api/work-orders/change-status', { id: WO, status: 'paid' });
  const flip2 = flip.status >= 400 ? await apiPost(`/api/work-orders/${WO}/status`, { status: 'paid' }) : null;
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(5000);
  const s = await surface();
  // put the status back whatever happened
  const back = await apiPost('/api/work-orders/change-status', { id: WO, status: 'estimate' });
  const back2 = back.status >= 400 ? await apiPost(`/api/work-orders/${WO}/status`, { status: 'estimate' }) : null;
  await page.screenshot({ path: `${OUT}/evidence/neg-uneditable.png`, fullPage: true });
  return { landed: ok, statusFlip: { a: flip.status, aBody: JSON.stringify(flip.body).slice(0, 200), b: flip2 && flip2.status },
           afterSave: s, statusRestored: { a: back.status, b: back2 && back2.status } };
};

// ---- EH1: any other save failure — abort the save request at the network layer ----
P['EH1-save-failure'] = async () => {
  await goLines(WO);
  await page.route('**/api/**part**', route => {
    if (route.request().method() === 'POST') return route.abort('failed');
    return route.continue();
  });
  await page.evaluate(() => document.querySelector('[data-test-id="button_add_part"]')?.click());
  await page.waitForTimeout(4000);
  const tag = 'ZZAUTOTEST failed save ' + Date.now();
  await set('input_inline_part_description', tag);
  await set('input_inline_part_quantity', '1');
  await set('input_inline_part_cost', '1.00');
  await set('input_inline_part_sell_price', '2.00');
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(6000);
  const s = await surface();
  await page.unroute('**/api/**part**');
  await page.screenshot({ path: `${OUT}/evidence/neg-save-failure.png`, fullPage: true });
  return { tag, ...s };
};

// ---- S3-E1: someone else changes the part while the edit row is open ----
P['E1-concurrent-change'] = async () => {
  await goLines(WO);
  // find the line's parts through the API so the right one can be deleted behind the row
  const wo = await apiGet(`/api/work-orders/${WO}`);
  await page.evaluate(() => document.querySelector('[data-test-id="button_edit_part"]')?.click());
  await page.waitForTimeout(4500);
  const opened = await surface();
  const parts = await apiGet(`/api/work-orders/${WO}/part-requests`);
  let deleted = null;
  const list = parts.body?.data;
  const first = Array.isArray(list) ? list[0] : (list && Array.isArray(list.part_requests) ? list.part_requests[0] : null);
  if (first?.id) {
    deleted = await apiPost('/api/work-orders/part-requests/delete', { ids: [first.id] });
    if (deleted.status >= 400) deleted = await apiPost(`/api/part-requests/${first.id}/delete`, {});
  }
  await set('input_inline_part_description', 'ZZAUTOTEST concurrent ' + Date.now());
  await page.waitForTimeout(900);
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(6000);
  const s = await surface();
  await page.screenshot({ path: `${OUT}/evidence/neg-concurrent.png`, fullPage: true });
  return { editRowOpened: opened.editRowOpen, partRequestsCall: parts.status,
           deleteAttempt: deleted && { status: deleted.status, body: JSON.stringify(deleted.body).slice(0, 200) },
           afterSave: s };
};

// ---- where the two permissions actually live in the UI, so the preconditions can say it ----
P['R0-permission-route'] = async () => {
  const out = {};
  for (const r of ['/settings', '/settings/roles', '/roles', '/settings/users', '/settings/staff']) {
    await page.goto(APP + r, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    await settle();
    out[r] = await page.evaluate(() => ({
      url: location.pathname,
      title: (document.querySelector('h1,h2,.text-h5,.text-h6')?.innerText || '').replace(/\s+/g,' ').trim().slice(0, 80),
      chars: (document.body?.innerText || '').length,
      hasRoles: /\brole/i.test(document.body?.innerText || ''),
      menuItems: [...document.querySelectorAll('.q-item__label, .q-tab')].map(e => (e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0, 30),
      viewModeWords: /view mode/i.test(document.body?.innerText || ''),
      createAndEdit: /create and edit/i.test(document.body?.innerText || ''),
    }));
  }
  await page.screenshot({ path: `${OUT}/evidence/neg-permission-route.png`, fullPage: true });
  return out;
};

const names = Object.keys(P).filter(n => !ONLY.length || ONLY.some(o => n.startsWith(o)));
for (const n of names) {
  process.stdout.write(`\n### ${n}\n`);
  try { results[n] = await P[n](); console.log(JSON.stringify(results[n], null, 1).slice(0, 3000)); }
  catch (e) { results[n] = { PROBE_ERROR: String(e).slice(0, 300) }; console.log('PROBE ERROR', String(e).slice(0, 300)); }
  fs.writeFileSync(`${OUT}/evidence/probe-neg.json`, JSON.stringify(results, null, 1));
}
await apiPost('/api/exit-switch-user', {}).catch(() => {});
await browser.close();
