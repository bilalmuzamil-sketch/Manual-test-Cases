// Judge the session the recorded way: fe_permissions.length + template_slug, never role.name.
// My first attempt read role.templateSlug and got null - the field is somewhere else in the object,
// so find it rather than reporting a null as a fact.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const { browser, page } = await boot('sv9315', '/', 'admin');
const info = await page.evaluate(() => {
  const u = JSON.parse(localStorage.getItem('user') || 'null');
  const hits = [];
  (function walk(o, path) {
    if (!o || typeof o !== 'object' || path.split('.').length > 6) return;
    for (const [k, v] of Object.entries(o)) {
      if (/template.?slug/i.test(k)) hits.push([path + '.' + k, v]);
      if (/^fe.?permissions$/i.test(k) && Array.isArray(v)) hits.push([path + '.' + k + '.length', v.length]);
      if (v && typeof v === 'object') walk(v, path + '.' + k);
    }
  })(u, 'user');
  return { topKeys: Object.keys(u?.data || {}), hits, storageKeys: Object.keys(localStorage) };
});
console.log('localStorage keys the app minted:', JSON.stringify(info.storageKeys));
console.log('user.data keys              :', JSON.stringify(info.topKeys));
console.log('template_slug / fe_permissions found at:');
info.hits.forEach(([p, v]) => console.log(`   ${p} = ${JSON.stringify(v)}`));
await browser.close();
