// Diagnose rather than accept a zero: a hunt that finds nothing is a fact about the QUERY until the
// shapes are printed. (Two earlier credit hunts returned 0 for exactly this reason.)
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const { browser, page, APIH } = await boot('sv8218', '/customers', 'admin');
await page.waitForTimeout(5000);
const out = await page.evaluate(async (h) => {
  const get = async u => { const r=await fetch(`https://${h}${u}`,{credentials:'include'}); return r.ok? await r.json():{__status:r.status}; };
  const cl = await get('/api/customers?pagination[rowsPerPage]=3&pagination[page]=1&search=');
  const c0 = cl.data.collection[0];
  const v = await get(`/api/customers/view/${c0.id}?`);
  const known = await get('/api/customer-account/list-unpaid-transaction?accountId=94ea52fa-3e38-4cf5-a4b4-2ce914fe548d&pagination[rowsPerPage]=100&openOnly=true');
  return { customerRowKeys:Object.keys(c0), customerRow:c0,
           viewTop:Object.keys(v||{}), viewData: v?.data? Object.keys(v.data):null,
           viewSample: JSON.stringify(v?.data||v).slice(0,700),
           unpaidTop:Object.keys(known||{}), unpaidSample: JSON.stringify(known).slice(0,900) };
}, APIH);
console.log(JSON.stringify(out,null,1).slice(0,4000));
await browser.close();
