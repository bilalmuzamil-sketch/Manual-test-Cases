// Read the tech account's role back from the product, not from the staff list (tech@shopview.com
// is not one of the 28 staff rows, so that list can never confirm this).
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
const r = await b.page.evaluate(async () => {
  const x = await fetch('https://api.staging.shopview.com/api/quick-login', { method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ key: 'tech' }) });
  const d = await x.json();
  return { name: d.data.role.name, n: (d.data.role.fePermissions || []).length,
           perms: (d.data.role.fePermissions || []).map(p => p.name).sort() };
});
console.log('tech role is now:', r.name, '|', r.n, 'permissions');
console.log('  ', r.perms.join(', '));
await b.browser.close();
