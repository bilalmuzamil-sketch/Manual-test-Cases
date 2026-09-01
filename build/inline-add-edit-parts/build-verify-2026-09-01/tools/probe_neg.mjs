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
import { boot, APP, apiGet, apiPost, apiCall } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const WO = 'c6d4b883-6f78-4c9e-ab7e-436a6d99c17a';                    // S9315-14846, estimate
const PAID_WO = '06747f14-bf1e-4c03-8358-732e78b0167d';               // S2-15522, paid
const TECH = '2d36a5f5-c957-45e0-a376-46d24df2a44c';                  // Christopher Smith
const TECH_ROLE = '2d4b8464-81a9-4c1e-96c6-a2a64f02a389';             // Technician
// MERGE, never replace: a run with ONLY=... must not delete the probes it did not re-run.
// The first version overwrote this file every run, and a targeted re-run silently dropped
// two verified results that only survived because they were already committed.
const RESULTS_FILE = `${OUT}/evidence/probe-neg.json`;
const results = (() => {
  try { return JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8')); } catch (_) { return {}; }
})();
const { browser, page } = await boot('/workorders');
// 🛑 A CHARACTER COUNT IS NOT A LANDING SIGNAL. The page shell alone is already over 1,200
// characters and still shows "Loading..." in the header while the Parts section is unmounted, so a
// count-based settle proceeds too early and every control reads as absent. Wait for the ANCHOR the
// probe actually needs, and treat "Loading..." as not landed.
const settle = async (anchor = '[data-test-id="button_add_part"]') => {
  await page.waitForFunction(sel => {
    const t = document.body?.innerText || '';
    if (/\bLoading\.\.\./.test(t)) return false;
    return !!document.querySelector(sel) || t.length > 4000;
  }, anchor, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500);
};
// 🛑 THE PAGE'S IDENTITY MUST BE RE-SYNCED BEFORE EVERY LANDING, AND THIS COST A WHOLE RUN.
// The SPA reads permissions and view mode out of localStorage. N3 strips a permission and
// impersonates; when it hands the session back, localStorage still holds the STRIPPED technician
// set, so every later probe in the same browser sees addPart: 0 and reports "no row could be
// opened" as if that were the build's behaviour. Re-reading fe-permissions and writing it back on
// every landing makes the page always match whoever the API currently is.
const syncIdentity = async () => {
  const fe = await apiGet('/api/auth/me/fe-permissions');
  if (fe.status !== 200) return null;
  await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await page.evaluate(f => localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f)), fe.body?.data);
  return fe.body?.data;
};
const goLines = async (id) => {
  await syncIdentity();
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
  // The first attempt tried to CREATE a throwaway role; POST /api/roles wants `organization` and
  // `cross_toggles` as well, which are not worth guessing. Editing the Technician role in place and
  // putting it back is the recorded pattern (Rule 26, and the QA lead's standing instruction that
  // role swaps go on the Technician quick-login user and never on the Admin).
  //
  // 🛑 SAFETY: the original role body is written to /tmp/inl6597/ROLE-RESTORE.json BEFORE the edit,
  // and the restore runs in a finally block, so a crash mid-probe still leaves the exact list on
  // disk to put back by hand.
  const before = await apiGet(`/api/roles/${TECH_ROLE}`);
  if (before.status !== 200) return { readRoleFailed: before.status };
  const src = before.body.data;
  const codes = (src.fe_permissions || []).map(p => p.code || p.name);
  fs.mkdirSync('/tmp/inl6597', { recursive: true });
  fs.writeFileSync('/tmp/inl6597/ROLE-RESTORE.json', JSON.stringify(src, null, 1));
  const keep = (src.fe_permissions || []).filter(p => (p.code || p.name) !== 'workOrderLinesCreateAndEdit');
  const payload = { name: src.name, description: src.description, view_mode: src.view_mode,
                    cross_toggles: src.cross_toggles, template_id: src.template_id };

  let stripped = null, observed = null, restored = null, verify = null;
  try {
    stripped = await apiCall('PUT', '/api/roles/' + TECH_ROLE, { ...payload, fe_permissions: keep.map(p => p.id) });
    if (stripped.status < 400) {
      await apiPost('/api/exit-switch-user', {}).catch(() => {});
      const sw = await apiPost('/api/switch-user', { user_id: TECH });
      if (sw.status < 400) {
        // the SPA reads permissions out of localStorage, so re-hydrate or the page still shows the
        // admin's controls and the probe would report a false "still visible"
        const fe = await apiGet('/api/auth/me/fe-permissions');
        await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
        await page.evaluate(f => localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f)), fe.body?.data);
        observed = await goLines(WO);
        observed.permissionsSeenByThePage = fe.body?.data?.fe_permissions;
        await page.screenshot({ path: `${OUT}/evidence/neg-no-permission.png`, fullPage: true });
      } else observed = { impersonateFailed: sw.status };
      await apiPost('/api/exit-switch-user', {}).catch(() => {});
    }
  } finally {
    restored = await apiCall('PUT', '/api/roles/' + TECH_ROLE,
      { ...payload, fe_permissions: (src.fe_permissions || []).map(p => p.id) });
    const after = await apiGet(`/api/roles/${TECH_ROLE}`);
    const nowCodes = (after.body?.data?.fe_permissions || []).map(p => p.code || p.name);
    verify = { status: after.status,
               permissionsBefore: codes.slice().sort(), permissionsAfter: nowCodes.slice().sort(),
               identical: JSON.stringify(codes.slice().sort()) === JSON.stringify(nowCodes.slice().sort()),
               viewModeBefore: src.view_mode, viewModeAfter: after.body?.data?.view_mode };
  }
  return { technicianPermissionsBefore: codes,
           strip: stripped && { status: stripped.status, body: JSON.stringify(stripped.body).slice(0, 200) },
           screenWithoutThePermission: observed,
           restore: restored && { status: restored.status },
           RESTORE_VERIFIED: verify };
};

// ---- E3: the work order stops being editable while the row is open ----
P['E3-becomes-uneditable'] = async () => {
  const ok = await goLines(WO);
  if (!ok.addPart) return { POSITIVE_CONTROL_FAILED: ok,
    why: 'Add Part is not even present before the probe starts, so nothing this probe measured '
       + 'would be about the build. Refusing to report a result.' };
  await page.evaluate(() => document.querySelector('[data-test-id="button_add_part"]')?.click());
  await page.waitForTimeout(4000);
  await set('input_inline_part_description', 'ZZAUTOTEST uneditable ' + Date.now());
  await set('input_inline_part_quantity', '1');
  await set('input_inline_part_cost', '1.00');
  await set('input_inline_part_sell_price', '2.00');
  await page.waitForTimeout(1200);
  // flip the status behind the open row
  // POST /api/work-orders/change-status is the route the SPA itself uses (updateStatus)
  const flip = await apiPost('/api/work-orders/change-status', { id: WO, status: 'paid' });
  const flip2 = flip.status >= 400 ? await apiPost('/api/work-orders/change-status', { work_order_id: WO, status: 'paid' }) : null;
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(5000);
  const s = await surface();
  // put the status back whatever happened
  const back = await apiPost('/api/work-orders/change-status', { id: WO, status: 'estimate' });
  const back2 = back.status >= 400 ? await apiPost('/api/work-orders/change-status', { work_order_id: WO, status: 'estimate' }) : null;
  await page.screenshot({ path: `${OUT}/evidence/neg-uneditable.png`, fullPage: true });
  return { landed: ok, statusFlip: { a: flip.status, aBody: JSON.stringify(flip.body).slice(0, 200), b: flip2 && flip2.status },
           afterSave: s, statusRestored: { a: back.status, b: back2 && back2.status } };
};

// ---- EH1: any other save failure — abort the save request at the network layer ----
P['EH1-save-failure'] = async () => {
  // The first version routed '**/api/**part**' and aborted every matching request, GETs included, so
  // the parts list never loaded and no row could open. Abort ONLY the save POST the SPA uses to
  // create a part request (work-orders/part/make-request), and only once.
  let aborted = null;
  await page.route('**/api/work-orders/part/make-request', route => {
    if (route.request().method() === 'POST' && !aborted) { aborted = route.request().url(); return route.abort('failed'); }
    return route.continue();
  });
  const pc = await goLines(WO);
  if (!pc.addPart) { await page.unroute('**/api/work-orders/part/make-request'); return { POSITIVE_CONTROL_FAILED: pc }; }
  await page.evaluate(() => document.querySelector('[data-test-id="button_add_part"]')?.click());
  await page.waitForTimeout(4000);
  const tag = 'ZZAUTOTEST failed save ' + Date.now();
  await set('input_inline_part_description', tag);
  await set('input_inline_part_quantity', '1');
  await set('input_inline_part_cost', '1.00');
  await set('input_inline_part_sell_price', '2.00');
  await page.waitForTimeout(1200);
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(7000);
  const sfc = await surface();
  await page.unroute('**/api/work-orders/part/make-request');
  await page.screenshot({ path: `${OUT}/evidence/neg-save-failure.png`, fullPage: true });
  return { tag, saveRequestAborted: aborted, ...sfc };
};

// ---- S3-E1: someone else changes the part while the edit row is open ----
P['E1-concurrent-change'] = async () => {
  // S3-E1 belongs to Story 3, which is the TECH VIEW inline edit row. In Full View clicking Edit
  // opens the part details modal (S5-R2), which is why the first attempt found no inline edit row
  // and measured nothing. So: impersonate the technician, open the inline edit row, delete THAT
  // part behind it over the API, then save.
  await apiPost('/api/exit-switch-user', {}).catch(() => {});
  const sw = await apiPost('/api/switch-user', { user_id: TECH });
  if (sw.status >= 400) return { impersonateFailed: sw.status };
  let out = {};
  try {
    const pc = await goLines(WO);
    out.landedAsTechnician = pc;
    if (!pc.editBtns) return { ...out, POSITIVE_CONTROL_FAILED: pc };
    // which part is first on the line, so the right one can be deleted
    // 🛑 THE work_order_id QUERY PARAM IS IGNORED by list-requests: it answers with 100 part
    // requests from across the estate, whose work_order_id fields point at other work orders. Filter
    // client-side or you match nothing and the probe silently tests nothing.
    const list = await apiGet(`/api/work-orders/part/list-requests?work_order_id=${WO}`);
    const raw = (list.body?.data?.collection) || list.body?.data || [];
    const coll = (Array.isArray(raw) ? raw : []).filter(x => x.work_order_id === WO);
    out.partRequestsReturned = Array.isArray(raw) ? raw.length : 0;
    out.partRequestsOnThisWorkOrder = coll.length;
    await page.evaluate(() => document.querySelector('[data-test-id="button_edit_part"]')?.click());
    await page.waitForTimeout(4500);
    const opened = await surface();
    out.editRowOpened = opened.editRowOpen;
    out.editRowValues = opened.values;
    // find the part request whose description matches what the row is showing
    const desc = opened.values.desc;
    const match = Array.isArray(coll) ? coll.find(x => (x.description || x.name || '') === (desc || '').trim()) : null;
    out.matchedPartRequest = match ? { id: match.id, description: match.description } : null;
    if (match?.id) {
      const del = await apiCall('POST', `/api/work-orders/part/remove-request/${match.id}`, {});
      out.deletedBehindTheRow = { status: del.status, body: JSON.stringify(del.body).slice(0, 150) };
    }
    await set('input_inline_part_description', 'ZZAUTOTEST concurrent ' + Date.now());
    await page.waitForTimeout(1000);
    await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
    await page.waitForTimeout(7000);
    out.afterSave = await surface();
    await page.screenshot({ path: `${OUT}/evidence/neg-concurrent.png`, fullPage: true });
  } finally {
    await apiPost('/api/exit-switch-user', {}).catch(() => {});
  }
  return out;
};

// ---- where the two permissions actually live in the UI, so the preconditions can say it ----
P['R0-permission-route'] = async () => {
  const out = {};
  // The route was already written down: build/APP-ACTIONS-PLAYBOOK.md records
  // "Settings sidebar -> Roles & Permissions (/administration/roles-permissions)". The first version
  // of this probe guessed /settings, /settings/roles, /roles ... - five routes that do not exist, so
  // it spent five 60-second SPA waits proving nothing. Rule 97: search the repo before probing.
  for (const r of ['/administration/roles-permissions', '/administration/staff', '/administration/settings']) {
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
      // the labels a tester has to find, verbatim off the screen
      roleRows: [...document.querySelectorAll('tr, .q-item')]
        .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 15),
      pencilPresent: !!document.querySelector('[data-test-id*="edit"], .q-btn i.notranslate'),
    }));
  }
  await page.screenshot({ path: `${OUT}/evidence/neg-permission-route.png`, fullPage: true });
  return out;
};


// ---- EH2: the SAME case, but with a SERVER ERROR rather than a dead socket.
// S2-EH1 is "the part cannot be saved for any other reason", which in practice means the server
// answered badly - not that the network vanished. route.abort('failed') produces a transport error,
// and an SPA can reasonably treat those two differently, so a finding must not rest on the harsher
// one alone. This fulfils the save with a 500 and a JSON error body, the way a real failure looks.
P['EH2-server-error'] = async () => {
  let seen = null;
  await page.route('**/api/work-orders/part/make-request', async route => {
    if (route.request().method() === 'POST' && !seen) {
      seen = route.request().url();
      return route.fulfill({ status: 500, contentType: 'application/json',
        body: JSON.stringify({ errors: [{ error: 'ZZAUTOTEST forced failure' }] }) });
    }
    return route.continue();
  });
  const pc = await goLines(WO);
  if (!pc.addPart) { await page.unroute('**/api/work-orders/part/make-request'); return { POSITIVE_CONTROL_FAILED: pc }; }
  await page.evaluate(() => document.querySelector('[data-test-id="button_add_part"]')?.click());
  await page.waitForTimeout(4000);
  const tag = 'ZZAUTOTEST server500 ' + Date.now();
  await set('input_inline_part_description', tag);
  await set('input_inline_part_quantity', '1');
  await set('input_inline_part_cost', '1.00');
  await set('input_inline_part_sell_price', '2.00');
  await page.waitForTimeout(1200);
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(2000);
  const early = await surface();                 // read BEFORE any toast can fade
  await page.waitForTimeout(5000);
  const late = await surface();
  const pageText = await page.evaluate(() => (document.body?.innerText || '').replace(/\s+/g, ' ').slice(0, 700));
  await page.unroute('**/api/work-orders/part/make-request');
  await page.screenshot({ path: `${OUT}/evidence/neg-server-500.png`, fullPage: true });
  return { tag, interceptedSave: seen, twoSecondsAfter: early, sevenSecondsAfter: late, pageText };
};

const names = Object.keys(P).filter(n => !ONLY.length || ONLY.some(o => n.startsWith(o)));
for (const n of names) {
  process.stdout.write(`\n### ${n}\n`);
  try { results[n] = await P[n](); console.log(JSON.stringify(results[n], null, 1).slice(0, 3000)); }
  catch (e) { results[n] = { PROBE_ERROR: String(e).slice(0, 300) }; console.log('PROBE ERROR', String(e).slice(0, 300)); }
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 1));
}
await apiPost('/api/exit-switch-user', {}).catch(() => {});
await browser.close();
