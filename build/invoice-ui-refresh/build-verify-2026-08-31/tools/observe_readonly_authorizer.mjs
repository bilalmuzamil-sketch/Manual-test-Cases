// observe_readonly_authorizer.mjs — C45191: a user WITHOUT the work-order edit permission sees the
// Authorizer as a static, read-only field, with no select control.
//
// NO ROLE SWAP IS NEEDED. The Technician role on this organisation already lacks
// `workOrdersCreateAndEdit` (it carries only `workOrdersView` and `workOrderLinesCreateAndEdit`),
// read live from GET /api/roles/{id}. So the restricted user the case asks for already exists and
// skill 03 s8.2a's five-step swap does not apply - nothing is changed, so nothing needs restoring.
//
// Impersonation is the recorded simpler fallback (playbook s G). It rotates the shared session and
// evicts other workers (Rule 83); the QA lead confirmed nobody else is on sv8218. The run ends by
// switching back to admin so the branch is left as found.
import { boot, APP, apiGet, apiPost } from './boot8218.mjs';
import fs from 'fs';
const OUT = 'build/invoice-ui-refresh/build-verify-2026-08-31/remaining-6-2026-09-01';
const WO = process.env.WO, TECH = process.env.TECH, TECHNAME = process.env.TECHNAME;
const log = []; const L = (...a) => { const s = a.join(' '); console.log(s); log.push(s); };

const { browser, ctx, page } = await boot('/workorders');

// 1. baseline as the admin, who DOES have the permission - proves the reader can see a select
await page.goto(`${APP}/workorders/${WO}`, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
await page.waitForFunction(() => (document.body?.innerText || '').length > 1200, { timeout: 60000 }).catch(() => {});
await page.waitForTimeout(3000);
const read = () => page.evaluate(() => {
  const selects = [...document.querySelectorAll('.q-select')]
    .map(e => (e.querySelector('.q-field__label')?.textContent || '').trim());
  const statics = [...document.querySelectorAll('.static-field__label')].map(e => e.textContent.trim());
  return {
    bodyChars: (document.body?.innerText || '').length,
    url: location.pathname,
    authorizerSelect: selects.some(l => /authoriz/i.test(l)),
    authorizerStatic: statics.some(l => /authoriz/i.test(l)),
    authorizerReadonlyEl: !!document.querySelector('[data-test-id="authorizer_readonly"]'),
    selects, statics,
  };
});
const asAdmin = await read();
L('POSITIVE CONTROL (admin, has workOrdersCreateAndEdit):');
L('  select:', asAdmin.authorizerSelect, '| static:', asAdmin.authorizerStatic,
  '| readonly element:', asAdmin.authorizerReadonlyEl, '| chars', asAdmin.bodyChars);
await page.screenshot({ path: `${OUT}/evidence/c45191-admin.png` });

// 2. impersonate the Technician
const sw = await apiPost('/api/switch-user', { user_id: TECH });
L(`switch-user -> ${TECHNAME} (${TECH}) HTTP ${sw.status}`);
if (sw.status !== 200 && sw.status !== 201) {
  L('  body:', JSON.stringify(sw.body).slice(0, 300));
} else {
  const fe = await apiGet('/api/auth/me/fe-permissions');
  const perms = fe.body?.data?.fe_permissions || [];
  const canEdit = perms.includes('workOrdersCreateAndEdit');
  L('  fe-permissions count:', perms.length, '| workOrdersCreateAndEdit present:', canEdit);
  L('  workOrder* permissions:', JSON.stringify(perms.filter(p => /^workOrder/i.test(p))));
  // re-hydrate the browser as the technician
  const d = sw.body?.data || {};
  await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await page.evaluate(({ u, f, t }) => {
    localStorage.setItem('user', JSON.stringify(u));
    if (f) localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f));
    if (t) localStorage.setItem('token', JSON.stringify(t));
  }, { u: { data: { token: d.token, role: d.role, details: d.details } }, f: fe.body?.data, t: d.token });
  await page.goto(`${APP}/workorders/${WO}`, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
  await page.waitForFunction(() => (document.body?.innerText || '').length > 1200, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3500);
  const asTech = await read();
  L('AS THE TECHNICIAN (no workOrdersCreateAndEdit):');
  L('  select:', asTech.authorizerSelect, '| static:', asTech.authorizerStatic,
    '| readonly element:', asTech.authorizerReadonlyEl, '| chars', asTech.bodyChars);
  L('  statics:', JSON.stringify(asTech.statics));
  L('  selects:', JSON.stringify(asTech.selects));
  await page.screenshot({ path: `${OUT}/evidence/c45191-technician.png` });
  fs.writeFileSync(`${OUT}/evidence/c45191.json`, JSON.stringify({ asAdmin, asTech, perms }, null, 1));
}

// 3. always hand the branch back on the admin session
const back = await apiPost('/api/quick-login', { key: 'admin' });
L('restored to admin: HTTP', back.status);
fs.writeFileSync(`${OUT}/evidence/c45191.log`, log.join('\n') + '\n');
await browser.close();
