// C55736: without See Financial Data, does the vendor-invoice row keep its number, vendor and
// status and lose only the total?
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const R = JSON.parse(fs.readFileSync('/tmp/staging/role-ids.json', 'utf8'));
const FULL = JSON.parse(fs.readFileSync('/tmp/staging/full-role.json', 'utf8')).id;
const admin = await P.openStaging('/customers', 'admin');
const assign = async (r) => admin.page.evaluate(async ([s, role, w]) => (await fetch('https://api.staging.shopview.com/api/staff/' + s + '/change', {
  method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify({ first_name: 'Tech', last_name: 'ShopView', email: 'tech@shopview.com', workplace_id: w, role_id: role }) })).status,
  ['d2cb20a6-90a8-4884-ac50-022ff2fb9313', r, 'b3c8c820-f815-4cf1-8938-10956c5ee71a']);
const out = {};
try {
  for (const [label, id] of [['with money', FULL], ['without money', R['ZZAUTOTEST No Financial Data'].id]]) {
    console.log(`${label} -> assign ${await assign(id)}`);
    let t = null;
    for (let i = 0; i < 4 && !t; i++) { try { t = await P.openStaging('/customers', 'tech'); } catch (e) { await new Promise(r => setTimeout(r, 6000)); } }
    if (!t) { console.log('   could not sign in'); continue; }
    await P.openPalette(t.page, 'click');
    await P.type(t.page, 'ZZTINV-GSV2', 3600);
    const s = await P.read(t.page);
    out[label] = (s.rows || []).map(r => r.text.replace(/\s+/g, ' ').slice(0, 90));
    console.log('   rows:'); out[label].forEach(r => console.log('      ', r));
    await t.browser.close();
  }
} finally {
  console.log('restore ->', await assign('af8d02b5-ecd1-4205-a82f-32a4d5bb1015'));
  fs.writeFileSync('probe-nofin.json', JSON.stringify(out, null, 1));
  await admin.browser.close();
}
