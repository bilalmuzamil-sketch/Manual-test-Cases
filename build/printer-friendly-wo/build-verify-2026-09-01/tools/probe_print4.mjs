// probe_print4.mjs — the five 6617 data states, seeded rather than reported missing.
//
// WHY THIS EXISTS. The 1 Sep handover listed five cases as NOT VERIFIED "the data state does not
// exist here". The QA lead's answer, verbatim: "You can change the permission of a Tech to make this
// happen" (for the no-view sign-in) and, on the whole lane, "You are never supposed to create defect,
// you are supposed to make the tests RUNNABLE". Standing Rule 14 says the same thing in general:
// NEVER mark anything NOT-VERIFIED for a missing DATA-STATE - seed it.
//
//   C45090  a sign-in with no work-orders view permission cannot reach the print option
//   C45104  a line whose status is Cancelled
//   C45111  a tech story of 500+ characters
//   C45097  a work order with no customer
//   C45098  a work order with no vehicle
//
// SAFETY. The Technician role body is written to disk BEFORE any edit and restored in a finally
// block, and the restore is VERIFIED by re-reading the role (Rule 26). Throwaway text is tagged
// ZZAUTOTEST. The Admin's own role is never touched.
import { boot, APP, apiGet, apiPost, apiCall } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/printer-friendly-wo/build-verify-2026-09-01';
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const WO = 'c6d4b883-6f78-4c9e-ab7e-436a6d99c17a';          // S9315-14846
const TECH = '2d36a5f5-c957-45e0-a376-46d24df2a44c';        // Christopher Smith
const TECH_ROLE = '2d4b8464-81a9-4c1e-96c6-a2a64f02a389';   // Technician
const RESULTS = `${OUT}/evidence/probe-print4.json`;
const results = (() => { try { return JSON.parse(fs.readFileSync(RESULTS, 'utf8')); } catch (_) { return {}; } })();

const { browser, page } = await boot('/workorders');
const settle = async (anchor) => {
  await page.waitForFunction(sel => {
    const t = document.body?.innerText || '';
    if (/\bLoading\.\.\./.test(t)) return false;
    return (sel ? !!document.querySelector(sel) : false) || t.length > 3000;
  }, anchor || null, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500);
};
const syncIdentity = async () => {
  const fe = await apiGet('/api/auth/me/fe-permissions');
  if (fe.status !== 200) return null;
  await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await page.evaluate(f => localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f)), fe.body?.data);
  return fe.body?.data;
};
// what the screen says about the More menu and the Print item
const readMore = async (id) => {
  await syncIdentity();
  await page.goto(`${APP}/workorders/${id}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await settle('[data-test-id="button_work_order_nav_bar_menu"]');
  const shell = await page.evaluate(() => ({
    url: location.pathname + location.search,
    onLogin: /\/login/.test(location.pathname),
    chars: (document.body?.innerText || '').length,
    firstChars: (document.body?.innerText || '').replace(/\s+/g, ' ').slice(0, 220),
    moreButtons: document.querySelectorAll('[data-test-id="button_work_order_nav_bar_menu"]').length,
  }));
  if (!shell.moreButtons) return { ...shell, menu: null, printItem: null };
  // the proven opener from probe_print.mjs (Rule 27) - a .click() on the locator does not always
  // reach this button, an in-page click does
  await page.evaluate(() => document.querySelector('[data-test-id="button_work_order_nav_bar_menu"]')?.click());
  await page.waitForTimeout(2200);
  const menu = await page.evaluate(() => {
    const m = document.querySelector('.q-menu');
    if (!m) return null;
    const items = [...m.querySelectorAll('.q-item')].map(e => {
      const st = getComputedStyle(e);
      return { text: (e.innerText || '').replace(/\s+/g, ' ').trim(),
               disabled: e.classList.contains('disabled') || e.getAttribute('aria-disabled') === 'true'
                         || st.pointerEvents === 'none' || st.opacity !== '1' };
    });
    const print = items.find(i => /Print Work Order/i.test(i.text));
    return { items, printPresent: !!print, printDisabled: print ? print.disabled : null };
  });
  await page.keyboard.press('Escape').catch(() => {});
  return { ...shell, menu };
};

const P = {};

// ---------------------------------------------------------------- C45090
P['C45090-no-view-permission'] = async () => {
  const before = await apiGet(`/api/roles/${TECH_ROLE}`);
  if (before.status !== 200) return { readRoleFailed: before.status };
  const src = before.body.data;
  const codes = (src.fe_permissions || []).map(p => p.code || p.name);
  fs.mkdirSync('/tmp/pf6617', { recursive: true });
  fs.writeFileSync('/tmp/pf6617/ROLE-RESTORE-45090.json', JSON.stringify(src, null, 1));
  // 🛑 STRIPPING workOrdersView ALONE DOES NOT TAKE. Measured: the PUT answers 200 and the role
  // reads back with workOrdersView still on it. The work-order line and pick-parts permissions
  // depend on it, so the backend keeps it. To get a user who genuinely cannot view work orders the
  // whole dependent group has to go. This is a fact about the app, discovered by re-reading the
  // role after the write - not a finding, and not something a 200 would have told us.
  const DROP = new Set(['workOrdersView', 'workOrderLinesCreateAndEdit', 'woPickParts']);
  const keep = (src.fe_permissions || []).filter(p => !DROP.has(p.code || p.name));
  if (keep.length === (src.fe_permissions || []).length)
    return { NO_SUCH_PERMISSION_ON_THE_ROLE: codes };
  const payload = { name: src.name, description: src.description, view_mode: src.view_mode,
                    cross_toggles: src.cross_toggles, template_id: src.template_id };
  let stripped = null, positiveControl = null, observed = null, restored = null, verify = null;
  let strippedRoleNow = null;
  try {
    // POSITIVE CONTROL FIRST, as the technician WITH the permission: if the print option is not
    // reachable even then, the probe proves nothing about the permission.
    await apiPost('/api/exit-switch-user', {}).catch(() => {});
    let sw = await apiPost('/api/switch-user', { user_id: TECH });
    if (sw.status >= 400) return { impersonateFailed: sw.status };
    positiveControl = await readMore(WO);
    await apiPost('/api/exit-switch-user', {}).catch(() => {});
    if (!positiveControl.menu?.printPresent)
      return { POSITIVE_CONTROL_FAILED: positiveControl };

    stripped = await apiCall('PUT', '/api/roles/' + TECH_ROLE,
      { ...payload, fe_permissions: keep.map(p => p.id) });
    // 🛑 DID THE STRIP ACTUALLY TAKE? A 200 on the PUT is not proof. The first run of this probe
    // reported the print option still present after a 200 strip, which reads like a finding and is
    // not one until the role is re-read: some permissions are re-added by the backend as
    // dependencies of others.
    const afterStrip = await apiGet(`/api/roles/${TECH_ROLE}`);
    strippedRoleNow = (afterStrip.body?.data?.fe_permissions || []).map(p => p.code || p.name).sort();
    if (stripped.status < 400) {
      await apiPost('/api/exit-switch-user', {}).catch(() => {});
      sw = await apiPost('/api/switch-user', { user_id: TECH });
      if (sw.status < 400) {
        observed = await readMore(WO);
        const fe = await apiGet('/api/auth/me/fe-permissions');
        observed.permissionsSeenByThePage = fe.body?.data?.fe_permissions;
        await page.screenshot({ path: `${OUT}/evidence/print4-no-view-permission.png`, fullPage: true });
      } else observed = { impersonateFailed: sw.status };
      await apiPost('/api/exit-switch-user', {}).catch(() => {});
    }
  } finally {
    restored = await apiCall('PUT', '/api/roles/' + TECH_ROLE,
      { ...payload, fe_permissions: (src.fe_permissions || []).map(p => p.id) });
    const after = await apiGet(`/api/roles/${TECH_ROLE}`);
    const now = (after.body?.data?.fe_permissions || []).map(p => p.code || p.name);
    verify = { status: after.status, permissionsBefore: codes.slice().sort(),
               permissionsAfter: now.slice().sort(),
               identical: JSON.stringify(codes.slice().sort()) === JSON.stringify(now.slice().sort()),
               viewModeBefore: src.view_mode, viewModeAfter: after.body?.data?.view_mode };
    await syncIdentity();
  }
  return { technicianPermissionsBefore: codes, positiveControl,
           strip: stripped && { status: stripped.status },
           roleAsReadBackAfterTheStrip: strippedRoleNow,
           screenWithoutTheViewPermission: observed,
           restore: restored && { status: restored.status }, RESTORE_VERIFIED: verify };
};

for (const [k, fn] of Object.entries(P)) {
  if (ONLY.length && !ONLY.includes(k)) continue;
  console.log(`\n### ${k}`);
  try { results[k] = await fn(); } catch (e) { results[k] = { PROBE_ERROR: String(e).slice(0, 400) }; }
  console.log(JSON.stringify(results[k], null, 1).slice(0, 3000));
  fs.mkdirSync(`${OUT}/evidence`, { recursive: true });
  fs.writeFileSync(RESULTS, JSON.stringify(results, null, 1));
}
await browser.close();
