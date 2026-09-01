// capture_techview.mjs — the Tech View half of the suite (38 cases: Tech View inline add + edit).
//
// NO ROLE SWAP IS MADE. The Technician role on this organisation already carries view_mode 'tech'
// and lacks woFullViewMode, read live from GET /api/roles/{id} - so impersonating an active
// Technician IS Tech View. Skill 03 §8.2a's five-step swap exists for when no suitable role holder
// exists; one exists here, so nothing is changed and nothing needs restoring.
//
// The run ends by returning the session to the admin.
import { boot, APP, apiGet, apiPost } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const log = []; const L = (...a) => { const s = a.map(String).join(' '); console.log(s); log.push(s); };
const save = (n, o) => fs.writeFileSync(`${OUT}/evidence/${n}`, JSON.stringify(o, null, 1));
const WO = process.env.WO, TECH = process.env.TECH, TECHNAME = process.env.TECHNAME;

const { browser, page } = await boot('/workorders');
const settle = async (m = 1200) => {
  await page.waitForFunction(x => (document.body?.innerText||'').length > x, m, { timeout: 60000 }).catch(()=>{});
  await page.waitForTimeout(3500);
};
const readRow = () => page.evaluate(() => {
  const row = document.querySelector('[data-test-id="inline_part_row"]');
  if (!row) return { rowOpen: false, addPartPresent: !!document.querySelector('[data-test-id="button_add_part"]') };
  const ids = [...new Set([...row.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')))];
  const labels = [...row.querySelectorAll('.q-field__label')].map(e => e.textContent.trim());
  const t = (row.innerText || '').replace(/\s+/g, ' ');
  return { rowOpen: true, ids, labels, text: t.slice(0, 400),
           priceWords: /cost|sell price|margin|\$/i.test(t) };
});

// ---- POSITIVE CONTROL: as the admin (Full View) the row must show six fields incl. pricing ----
await page.goto(`${APP}/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(()=>{});
await settle();
await page.evaluate(() => document.querySelector('[data-test-id="button_add_part"]')?.click());
await page.waitForTimeout(4000);
const asAdmin = await readRow();
L('POSITIVE CONTROL - admin, Full View (view_mode=full):');
L('  labels :', JSON.stringify(asAdmin.labels));
L('  pricing on the row:', asAdmin.priceWords);
save('techview-control-admin.json', asAdmin);

// ---- impersonate a Technician -> Tech View ----
const sw = await apiPost('/api/switch-user', { user_id: TECH });
L(`\nswitch-user -> ${TECHNAME}: HTTP ${sw.status}`);
if (sw.status === 200 || sw.status === 201) {
  const fe = await apiGet('/api/auth/me/fe-permissions');
  const d = fe.body?.data || {};
  const perms = d.fe_permissions || [];
  L('  view_mode reported   :', JSON.stringify(d.view_mode));
  L('  woFullViewMode held  :', perms.includes('woFullViewMode'));
  L('  workOrder* perms     :', JSON.stringify(perms.filter(p => /^workOrder/i.test(p))));
  const dd = sw.body?.data || {};
  await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(()=>{});
  await page.evaluate(({ u, f, t }) => {
    localStorage.setItem('user', JSON.stringify(u));
    if (f) localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f));
    if (t) localStorage.setItem('token', JSON.stringify(t));
  }, { u: { data: { token: dd.token, role: dd.role, details: dd.details } }, f: d, t: dd.token });
  await page.goto(`${APP}/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(()=>{});
  await settle(900);
  // 🛑 ASSERT THE LANDING BEFORE CONCLUDING ANYTHING IS ABSENT (skill 03 §8.0-b).
  // The first attempt used a technician whose workplace was Lethbridge while the work order is at
  // Heavy Duty 9919, did not check the page had rendered, and reported "Add Part not visible" -
  // which would have been a false finding about Tech View.
  const landed = await page.evaluate((num) => {
    const t = document.body?.innerText || '';
    return { url: location.pathname, chars: t.length,
             onLogin: /\/login/.test(location.pathname),
             woNumberOnPage: num ? t.includes(num) : null,
             linesTabPresent: [...document.querySelectorAll('.q-tab,[role="tab"]')]
               .some(e => /lines/i.test(e.innerText || '')),
             partRowsVisible: document.querySelectorAll('[data-test-id^="part_number_"]').length,
             head: t.replace(/\s+/g,' ').slice(0, 200) };
  }, process.env.WONUM || null);
  L('  LANDING CHECK: url', landed.url, '| chars', landed.chars, '| on /login:', landed.onLogin);
  L('    work-order number on page:', landed.woNumberOnPage, '| Lines tab:', landed.linesTabPresent,
    '| existing part rows visible:', landed.partRowsVisible);
  if (landed.onLogin || landed.chars < 1000 || !landed.linesTabPresent) {
    L('  ⚠️  THE PAGE DID NOT RENDER FOR THIS USER - any "absent" reading below would be about the');
    L('      harness, not Tech View. Recorded as NOT OBSERVED.');
    L('      page head:', JSON.stringify(landed.head));
  }
  const addBtn = await page.evaluate(() => !!document.querySelector('[data-test-id="button_add_part"]'));
  L('  Add Part button visible as the technician:', addBtn);
  save('techview-landing.json', landed);
  await page.evaluate(() => document.querySelector('[data-test-id="button_add_part"]')?.click());
  await page.waitForTimeout(4500);
  const asTech = await readRow();
  L('\nAS THE TECHNICIAN (Tech View):');
  L('  inline row opened  :', asTech.rowOpen);
  L('  labels             :', JSON.stringify(asTech.labels));
  L('  field test-ids     :', JSON.stringify(asTech.ids));
  L('  any pricing shown  :', asTech.priceWords);
  L('  row text           :', JSON.stringify(asTech.text));
  save('techview-as-technician.json', asTech);
  await page.screenshot({ path: `${OUT}/evidence/techview-row.png`, fullPage: true });
  // Tech View edit (C45023: edit opens an inline row below the part with the same three fields)
  await page.goto(`${APP}/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(()=>{});
  await settle(900);
  const edited = await page.evaluate(() => {
    const b = document.querySelector('[data-test-id="button_edit_part"]');
    if (!b) return false; b.click(); return true;
  });
  await page.waitForTimeout(4500);
  const editRow = await page.evaluate(() => {
    const row = document.querySelector('[data-test-id="inline_part_row"]');
    const dlg = document.querySelector('.q-dialog');
    return { inlineRow: !!row, modal: !!dlg,
      labels: row ? [...row.querySelectorAll('.q-field__label')].map(e=>e.textContent.trim()) : [],
      dialogTitle: dlg ? (dlg.innerText||'').replace(/\s+/g,' ').slice(0,120) : null };
  });
  L('\n  Tech View EDIT clicked:', edited);
  L('    inline row shown:', editRow.inlineRow, '| modal shown:', editRow.modal);
  L('    labels          :', JSON.stringify(editRow.labels));
  L('    modal title     :', JSON.stringify(editRow.dialogTitle));
  save('techview-edit.json', editRow);
  await page.screenshot({ path: `${OUT}/evidence/techview-edit.png`, fullPage: true });
} else {
  L('  switch-user body:', JSON.stringify(sw.body).slice(0, 300));
}
const back = await apiPost('/api/quick-login', { key: 'admin' });
L('\nrestored to admin: HTTP', back.status);
fs.appendFileSync(`${OUT}/evidence/capture.log`, '\n' + log.join('\n') + '\n');
await browser.close();
