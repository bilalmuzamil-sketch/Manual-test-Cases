// The permission matrix. For each role in turn: assign it to the Tech account, sign in FRESH as
// Tech (never swap the role mid-session - that bounces the app to /no-location and looks like a
// permission result when it is not), read the permissions back, then search the same words and
// record which sections, counts and tabs come back and whether prices are shown.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const TECH_STAFF = 'd2cb20a6-90a8-4884-ac50-022ff2fb9313';
const WORKPLACE = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const R = JSON.parse(fs.readFileSync('/tmp/staging/role-ids.json', 'utf8'));
const FULL = JSON.parse(fs.readFileSync('/tmp/staging/full-role.json', 'utf8'));
const ROLES = [
  ['Full access', FULL.id],
  ['No Parts View', R['ZZAUTOTEST No Parts View'].id],
  ['No Work Orders View', R['ZZAUTOTEST No Work Orders View'].id],
  ['No Customers View', R['ZZAUTOTEST No Customers View'].id],
  ['No Part Sales View', R['ZZAUTOTEST No Part Sales View'].id],
  ['No Vendor Order View', R['ZZAUTOTEST No Vendor Order View'].id],
  ['No Financial Data', R['ZZAUTOTEST No Financial Data'].id],
  ['No Work Orders Or Vendors', R['ZZAUTOTEST No Work Orders Or Vendors'].id],
  ['Technician (restore)', 'af8d02b5-ecd1-4205-a82f-32a4d5bb1015'],
];
const QUERIES = ['ZZAUTOTEST Fibridge', 'ZZAUTOTEST', 'ZZT-88-4412'];
const admin = await P.openStaging('/customers', 'admin');
const assign = async (roleId) => admin.page.evaluate(async ([staff, role, wp]) => {
  const r = await fetch('https://api.staging.shopview.com/api/staff/' + staff + '/change', {
    method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ first_name: 'Tech', last_name: 'ShopView', email: 'tech@shopview.com', workplace_id: wp, role_id: role }) });
  return { status: r.status, body: (await r.text()).slice(0, 160) };
}, [TECH_STAFF, roleId, WORKPLACE]);

const out = {};
for (const [label, roleId] of ROLES) {
  const a = await assign(roleId);
  console.log(`\n=== ${label} — assigning -> ${a.status}`);
  if (a.status >= 300) { console.log('   ', a.body); out[label] = { assign: a }; continue; }
  const tech = await P.openStaging('/customers', 'tech');
  const rec = { assign: a.status, slug: tech.templateSlug, nPerms: tech.nFePerms, q: {} };
  for (const q of QUERIES) {
    await P.openPalette(tech.page, 'click');
    await P.type(tech.page, q, 3600);
    const s = await P.read(tech.page);
    rec.q[q] = {
      tabs: (s.tabs || []).map(t => t.label),
      groups: (s.groupRows || []).map(g => ({ head: g.head.replace(/\s+/g, ' '), n: g.rows.length })),
      // does any row show money? that is the "prices masked" half
      money: (s.rows || []).filter(r => /\$\s?[\d,]/.test(r.text)).length,
      sampleMoney: (s.rows || []).filter(r => /\$\s?[\d,]/.test(r.text)).slice(0, 2).map(r => r.text.slice(0, 70)),
    };
    await tech.page.keyboard.press('Escape'); await tech.page.waitForTimeout(600);
  }
  out[label] = rec;
  console.log(`    signed in as ${rec.slug} with ${rec.nPerms} permissions`);
  for (const q of QUERIES) {
    const r = rec.q[q];
    console.log(`    "${q}": ${r.groups.map(g => g.head).join(' | ') || '(nothing)'}`);
    console.log(`        tabs: ${r.tabs.join(' | ') || '(none)'}  | rows showing money: ${r.money}`);
  }
  await tech.browser.close();
}
fs.writeFileSync('perm-matrix.json', JSON.stringify(out, null, 1));
await admin.browser.close();
