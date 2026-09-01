// capture_edit.mjs — the Edit control, in BOTH view modes.
//   C45023 (Tech View): Edit opens an inline row below the part with the same three fields.
//   C45063 (Full View): Edit opens the part details modal, pre-populated.
// The earlier attempt clicked Edit and saw neither, without asserting anything first - so it proved
// nothing. This waits for the click to take effect and dumps whatever appears.
import { boot, APP, apiGet, apiPost } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const log = []; const L = (...a) => { const s = a.map(String).join(' '); console.log(s); log.push(s); };
const save = (n, o) => fs.writeFileSync(`${OUT}/evidence/${n}`, JSON.stringify(o, null, 1));
const WO = process.env.WO, TECH = process.env.TECH;
const { browser, page } = await boot('/workorders');
const settle = async (m = 1200) => {
  await page.waitForFunction(x => (document.body?.innerText||'').length > x, m, { timeout: 60000 }).catch(()=>{});
  await page.waitForTimeout(4000);
};
const landing = () => page.evaluate(() => ({
  chars: (document.body?.innerText||'').length,
  linesTab: [...document.querySelectorAll('.q-tab,[role="tab"]')].some(e=>/lines/i.test(e.innerText||'')),
  partRows: document.querySelectorAll('[data-test-id^="part_number_"]').length,
  editBtns: document.querySelectorAll('[data-test-id="button_edit_part"]').length,
}));
const afterEdit = () => page.evaluate(() => {
  const row = document.querySelector('[data-test-id="inline_part_row"]');
  const dlg = document.querySelector('.q-dialog');
  return {
    inlineRow: !!row,
    inlineLabels: row ? [...row.querySelectorAll('.q-field__label')].map(e=>e.textContent.trim()) : [],
    inlineValues: row ? [...row.querySelectorAll('input')].map(e=>e.value).filter(v=>v!=='') : [],
    modal: !!dlg,
    modalTitle: dlg ? (dlg.innerText||'').replace(/\s+/g,' ').slice(0,140) : null,
    modalLabels: dlg ? [...dlg.querySelectorAll('.q-field__label')].map(e=>e.textContent.trim()) : [],
    modalPrefilled: dlg ? [...dlg.querySelectorAll('input')].map(e=>e.value).filter(v=>v!=='').slice(0,10) : [],
  };
});

for (const mode of ['full', 'tech']) {
  if (mode === 'tech') {
    // 🛑 quick-login DOES NOT END IMPERSONATION. A second switch-user answers 400 "You are already
    // impersonating a user. Exit impersonation first." The real route, read off the SPA bundle, is
    // POST /api/exit-switch-user - guessing eight other shapes found only 404s.
    await apiPost('/api/exit-switch-user', {});
    const sw = await apiPost('/api/switch-user', { user_id: TECH });
    if (sw.status !== 200) L('  switch-user failed:', sw.status, JSON.stringify(sw.body).slice(0, 200));
    const fe = await apiGet('/api/auth/me/fe-permissions');
    const d = fe.body?.data || {}, dd = sw.body?.data || {};
    L(`\nswitched to the technician: HTTP ${sw.status} | view_mode ${JSON.stringify(d.view_mode)}`);
    await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(()=>{});
    await page.evaluate(({u,f,t}) => { localStorage.setItem('user', JSON.stringify(u));
      if (f) localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f));
      if (t) localStorage.setItem('token', JSON.stringify(t)); },
      { u: { data: { token: dd.token, role: dd.role, details: dd.details } }, f: d, t: dd.token });
  }
  await page.goto(`${APP}/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(()=>{});
  await settle(900);
  const land = await landing();
  L(`\n=== EDIT in ${mode.toUpperCase()} VIEW ===`);
  L('  landing: chars', land.chars, '| Lines tab', land.linesTab, '| part rows', land.partRows, '| edit buttons', land.editBtns);
  if (!land.linesTab || land.editBtns === 0) { L('  ⚠️  page/controls not present - NOT OBSERVED, not an absence'); continue; }
  await page.evaluate(() => document.querySelector('[data-test-id="button_edit_part"]')?.click());
  await page.waitForTimeout(5000);
  const r = await afterEdit();
  L('  inline row appeared :', r.inlineRow, r.inlineRow ? JSON.stringify(r.inlineLabels) : '');
  L('  values pre-filled   :', JSON.stringify(r.inlineValues.slice(0,8)));
  L('  modal appeared      :', r.modal, r.modal ? JSON.stringify(r.modalTitle) : '');
  L('  modal labels        :', JSON.stringify(r.modalLabels.slice(0,12)));
  L('  modal pre-filled    :', JSON.stringify(r.modalPrefilled));
  save(`edit-${mode}.json`, { landing: land, ...r });
  await page.screenshot({ path: `${OUT}/evidence/edit-${mode}.png`, fullPage: true });
}
// leave the branch as found: end impersonation, then re-mint the admin session
const ex = await apiPost('/api/exit-switch-user', {});
const back = await apiPost('/api/quick-login', { key: 'admin' });
L('\nexit-switch-user:', ex.status, '| restored to admin:', back.status);
fs.appendFileSync(`${OUT}/evidence/capture.log`, '\n' + log.join('\n') + '\n');
await browser.close();
