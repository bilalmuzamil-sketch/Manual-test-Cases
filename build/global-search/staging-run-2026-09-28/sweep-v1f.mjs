// C45153 redone for the rows whose GROUP matters (the earlier version matched the first row whose
// text contained the name, which for a customer's name is one of its work orders), plus the
// catalogue-only part that is the point of the case, C45154 done cleanly, and C53587.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const clean = s => (s || '').replace(/≈ close match:\s*/g, '').replace(/\s+/g, ' ');
const b = await P.openStaging('/customers', 'admin');
const out = {};
// click a row INSIDE the named group
async function openInGroup(q, group, contains) {
  await P.openPalette(b.page, 'click');
  await P.type(b.page, q, 3800);
  const before = b.page.url();
  const hit = await b.page.evaluate(([grp, c]) => {
    const g = [...document.querySelectorAll('.search-group')]
      .find(x => ((x.querySelector('.search-group__header') || {}).innerText || '').trim().toLowerCase().startsWith(grp.toLowerCase()));
    if (!g) return { err: 'no such group' };
    const rows = [...g.querySelectorAll('.search-row')];
    const r = c ? rows.find(e => (e.innerText || '').replace(/≈ close match:\s*/g, '').includes(c)) : rows[0];
    if (!r) return { err: 'no matching row in that group' };
    const t = (r.innerText || '').replace(/\s+/g, ' ').slice(0, 70); r.click(); return { row: t };
  }, [group, contains]);
  await b.page.waitForTimeout(8000);
  return { q, group, ...hit, before, after: b.page.url(), navigated: b.page.url() !== before };
}
out.C45153 = {};
for (const [type, q, grp, c] of [
  ['Customer', 'ZZAUTOTEST Bridgeport Hauling', 'Customers', 'Bridgeport Hauling'],
  ['Asset', 'ZZT-4471', 'Assets', 'ZZT-4471'],
  ['Catalogue-only part', 'ZZT-77-3300', 'Parts', null],
]) {
  const r = await openInGroup(q, grp, c);
  out.C45153[type] = r;
  console.log(`C45153 ${type.padEnd(20)} row=${JSON.stringify(r.row || r.err)} -> ${r.after.replace('https://app.staging.shopview.com', '')}`);
  await b.page.waitForTimeout(700);
}
if (out.C45153['Catalogue-only part'].err) {
  const alt = await openInGroup('Vernway', 'Parts', null);
  out.C45153['Catalogue-only part (Vernway)'] = alt;
  console.log('C45153 catalogue-only via "Vernway":', JSON.stringify(alt.row || alt.err), '->', alt.after.replace('https://app.staging.shopview.com', ''));
}
// C45154 - open the customer page, then select that same customer again
const custUrl = out.C45153.Customer.after;
await b.page.goto(custUrl, { waitUntil: 'domcontentloaded' }); await b.page.waitForTimeout(7000);
await P.openPalette(b.page, 'click');
const recentsBefore = await b.page.evaluate(() => [...document.querySelectorAll('.search-row')].map(r => (r.innerText || '').replace(/\s+/g, ' ').slice(0, 50)));
await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(700);
const same = await openInGroup('ZZAUTOTEST Bridgeport Hauling', 'Customers', 'Bridgeport Hauling');
await P.openPalette(b.page, 'click'); await b.page.waitForTimeout(2500);
const recentsAfter = await b.page.evaluate(() => [...document.querySelectorAll('.search-row')].map(r => (r.innerText || '').replace(/\s+/g, ' ').slice(0, 50)));
await b.page.keyboard.press('Escape');
out.C45154 = { onPage: custUrl, ...same, recentsBefore: recentsBefore.slice(0, 5), recentsAfter: recentsAfter.slice(0, 5),
               recentsUnchanged: JSON.stringify(recentsBefore) === JSON.stringify(recentsAfter) };
console.log(`C45154 on ${custUrl.replace('https://app.staging.shopview.com','')} -> selected it again: navigated ${same.navigated}, recents unchanged ${out.C45154.recentsUnchanged}`);

// C53587 - a brand new work order, findable without reloading
out.C53587 = await b.page.evaluate(async () => {
  const cust = await (await fetch('https://api.staging.shopview.com/api/search?q=' + encodeURIComponent('ZZAUTOTEST Bridgeport Hauling'), { credentials: 'include', headers: { Accept: 'application/json' } })).json();
  const c = ((cust.data.groups || []).find(g => g.type === 'customers') || {}).items[0];
  const wps = await (await fetch('https://api.staging.shopview.com/api/staff/my-workplaces', { credentials: 'include', headers: { Accept: 'application/json' } })).json();
  const wp = ((wps.data || wps).find ? (wps.data || wps) : []).find(w => /Heavy Duty/.test(w.name));
  const r = await fetch('https://api.staging.shopview.com/api/work-orders/create', { method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ company_id: c.id, workplace_id: wp && wp.id }) });
  return { status: r.status, body: await r.json().catch(() => null), companyId: c.id, workplaceId: wp && wp.id };
});
console.log('C53587 created work order ->', out.C53587.status, JSON.stringify(out.C53587.body).slice(0, 160));
fs.writeFileSync('sweep-v1f.json', JSON.stringify(out, null, 1));
await b.browser.close();
