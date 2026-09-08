import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const { browser, page, APIH } = await boot('sv9315', '/work-orders', 'admin');
await page.waitForTimeout(6000);
const out = await page.evaluate(async (h) => {
  const get=async u=>{const r=await fetch(`https://${h}${u}`,{credentials:'include'}); return r.ok?await r.json():{__s:r.status};};
  // try the work-orders list endpoint shapes
  for (const q of ['/api/work-orders?pagination[rowsPerPage]=15&pagination[page]=1',
                   '/api/work-orders/list?pagination[rowsPerPage]=15']) {
    const j = await get(q);
    const coll = j?.data?.collection || j?.data || j?.collection;
    if (Array.isArray(coll) && coll.length) {
      return { q, n: coll.length, keys:Object.keys(coll[0]),
        rows: coll.slice(0,10).map(w=>({id:w.id, num:w.number||w.wo_number, status:w.status?.name||w.status, lines:w.lines_count??w.line_count})) };
    }
  }
  return { err:'no list shape matched' };
}, APIH);
console.log(JSON.stringify(out,null,1).slice(0,2000));
fs.writeFileSync('build/inline-add-edit-parts/build-verify-2026-09-08/wo-api.json', JSON.stringify(out,null,1));
await browser.close();
