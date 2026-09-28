// The permission checks the matrix could not answer on its own:
//   C45143  a part-sales-only role sees Part Sales but not Parts or Vendors
//   C45147  a Time Clock role gets nothing at all
//   C55718  typing the exact number of a work order you cannot see does not surface it
//   C55719  a contact match is hidden when you cannot see customers
//   C55721  a typo search does not leak a part you cannot see
//   C45149 / C55717  a record opened under full access disappears from the recent list once access goes
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const TECH = 'd2cb20a6-90a8-4884-ac50-022ff2fb9313';
const WP = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const R = JSON.parse(fs.readFileSync('/tmp/staging/role-ids.json', 'utf8'));
const X = JSON.parse(fs.readFileSync('/tmp/staging/extra-roles.json', 'utf8'));
const FULL = JSON.parse(fs.readFileSync('/tmp/staging/full-role.json', 'utf8')).id;
const admin = await P.openStaging('/customers', 'admin');
const assign = async (roleId) => (await admin.page.evaluate(async ([s, r, w]) => (await fetch('https://api.staging.shopview.com/api/staff/' + s + '/change', {
  method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify({ first_name: 'Tech', last_name: 'ShopView', email: 'tech@shopview.com', workplace_id: w, role_id: r }) })).status, [TECH, roleId, WP]));
// The sign-in occasionally leaves the app on /login and the boot throws. That must not abort the
// run half way with the Tech account stranded on a test role, so every sign-in is retried here and
// the whole thing restores the Technician role in a finally block whatever happens.
const signIn = async (tries = 4) => {
  for (let i = 1; i <= tries; i++) {
    try { return await P.openStaging('/customers', 'tech'); }
    catch (e) { console.log(`   sign-in attempt ${i} failed: ${String(e).slice(0, 90)}`); await new Promise(r => setTimeout(r, 6000)); }
  }
  return null;
};
const look = async (page, q) => {
  await P.openPalette(page, 'click'); await P.type(page, q, 3600);
  const s = await P.read(page);
  await page.keyboard.press('Escape'); await page.waitForTimeout(700);
  return { groups: (s.groupRows || []).map(g => g.head.replace(/\s+/g, ' ')), rows: (s.rows || []).map(r => r.text.replace(/\s+/g, ' ').slice(0, 70)), tabs: (s.tabs || []).map(t => t.label) };
};
const out = {};
try {
// --- C45143 + C45147 --------------------------------------------------------
for (const [label, id, qs] of [
  ['Part Sales Only', X.partSalesOnly, ['ZZAUTOTEST', 'ZZT-88-4412', 'ZZAUTOTEST Kestrel Parts Supply']],
  ['Time Clock User', X.timeClock, ['ZZAUTOTEST', 'Bridgeport']],
]) {
  console.log(`\n=== ${label} -> assign ${await assign(id)}`);
  const t = await signIn();
  if (!t) { console.log('   COULD NOT SIGN IN - nothing measured for this role'); out[label] = { signInFailed: true }; continue; }
  out[label] = { perms: t.nFePerms, slug: t.templateSlug, q: {} };
  for (const q of qs) { out[label].q[q] = await look(t.page, q); console.log(`   "${q}": ${out[label].q[q].groups.join(' | ') || '(nothing)'}`); }
  console.log(`   signed in as ${t.templateSlug} with ${t.nFePerms} permissions`);
  await t.browser.close();
}
// --- C55718 / C55719 / C55721 ----------------------------------------------
for (const [label, id, cases] of [
  ['No Work Orders View', R['ZZAUTOTEST No Work Orders View'].id, [['C55718 exact work order number', 'S2-34367']]],
  ['No Customers View', R['ZZAUTOTEST No Customers View'].id, [['C55719 contact phone', '419-555-0177'], ['C55719 contact name', 'Okonkwo']]],
  ['No Parts View', R['ZZAUTOTEST No Parts View'].id, [['C55721 typo on a part', 'Altenator'], ['C55721 control, a part-free typo', 'Petersn']]],
]) {
  console.log(`\n=== ${label} -> assign ${await assign(id)}`);
  const t = await signIn();
  if (!t) { console.log('   COULD NOT SIGN IN - nothing measured for this role'); continue; }
  out[label] = out[label] || { perms: t.nFePerms, q: {} };
  for (const [what, q] of cases) {
    const r = await look(t.page, q);
    out[label].q[what] = r;
    console.log(`   ${what} "${q}": ${r.groups.join(' | ') || '(nothing)'}`);
    if (r.rows.length) r.rows.slice(0, 3).forEach(x => console.log('        -', x));
  }
  await t.browser.close();
}
// --- C45149 / C55717 the recent list ---------------------------------------
console.log(`\n=== recents: full access -> assign ${await assign(FULL)}`);
let t = await signIn();
await P.openPalette(t.page, 'click'); await P.type(t.page, 'ZZT-88-4412', 3600);
await t.page.evaluate(() => { const r = document.querySelector('.search-modal .search-row'); if (r) r.click(); });
await t.page.waitForTimeout(8000);
await P.openPalette(t.page, 'click');
await t.page.evaluate(() => { const i = document.querySelector('.search-modal input'); if (i && i.value) { i.value = ''; i.dispatchEvent(new Event('input', { bubbles: true })); } });
await t.page.waitForTimeout(3500);
out.recentsWithAccess = await t.page.evaluate(() => [...document.querySelectorAll('.search-row')].map(r => (r.innerText || '').replace(/\s+/g, ' ').slice(0, 50)));
console.log('   with access, the recent list holds:', out.recentsWithAccess.slice(0, 4).join(' ;; '));
await t.browser.close();
console.log(`   now remove parts access -> assign ${await assign(R['ZZAUTOTEST No Parts View'].id)}`);
t = await signIn();
await P.openPalette(t.page, 'click');
await t.page.evaluate(() => { const i = document.querySelector('.search-modal input'); if (i && i.value) { i.value = ''; i.dispatchEvent(new Event('input', { bubbles: true })); } });
await t.page.waitForTimeout(3500);
out.recentsWithout = await t.page.evaluate(() => [...document.querySelectorAll('.search-row')].map(r => (r.innerText || '').replace(/\s+/g, ' ').slice(0, 50)));
out.partStillInRecents = out.recentsWithout.some(r => /Brake Chamber Kestrel|ZZT-88-4412/.test(r));
console.log('   without access, the recent list holds:', out.recentsWithout.slice(0, 4).join(' ;; '));
console.log('   the part is still listed:', out.partStillInRecents);
await t.browser.close();
} finally {
  console.log(`\n=== restore Technician -> assign ${await assign('af8d02b5-ecd1-4205-a82f-32a4d5bb1015')}`);
  fs.writeFileSync('perm-matrix2.json', JSON.stringify(out, null, 1));
  await admin.browser.close();
}
