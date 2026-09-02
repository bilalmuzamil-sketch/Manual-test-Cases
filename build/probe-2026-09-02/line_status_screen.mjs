// C45104 asserts "Cancelled lines still print if visible on screen". I concluded there is no
// Cancelled line status - first from an internal enum (weak), then from the endpoint that hands the
// UI its labels (better). This reads the CONTROL ON SCREEN, which is what the case is about.
//
// Reuses the committed harness (Rule 27) and probe_lib's reading discipline: the smallest element
// that owns each label, icons stripped, never a container's flattened text.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import { assertLabelSane } from '/home/user/Manual-test-Cases/build/testing-tools/probe_lib.mjs';
import fs from 'fs';

const { browser, page, APP } = await boot('sv9315', '/workorders', 'admin');
const out = { at: new Date().toISOString(), build: await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content) };

out.template_slug = await page.evaluate(() => {
  const u = JSON.parse(localStorage.getItem('user') || 'null');
  const r = u?.data?.role || {};
  return { template_slug: r.templateSlug || r.template_slug || null,
           nPerms: (r.fePermissions || r.fe_permissions || []).length, roleName: r.name };
});
console.log('session judged the right way:', JSON.stringify(out.template_slug));

// open the work order from the QA lead's own screenshot
await page.goto(`${APP}/workorders/98d0e444-4ad2-4ee6-bc8a-32aa033790f0/lines`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(9000);
out.url = page.url();
out.bodyChars = (await page.evaluate(()=>document.body?.innerText||'')).length;
console.log('work order open:', out.url.replace(APP,''), '| body chars', out.bodyChars);

// the line status badge, read per element
out.statusBadges = await page.evaluate(() => [...document.querySelectorAll('[class*="badge"], .q-chip, [class*="status"]')]
  .map(el => { const c = el.cloneNode(true);
    c.querySelectorAll('svg,i,[class*="icon"],[aria-hidden="true"]').forEach(n=>n.remove());
    return (c.textContent||'').replace(/\s+/g,' ').trim(); })
  .filter(t => t && t.length < 40));
console.log('status-ish chips on screen:', JSON.stringify([...new Set(out.statusBadges)].slice(0,20)));

// click a line status badge to open its options, then read the options per element
const badge = page.locator('.q-chip, [class*="badge"]').filter({ hasText: /Approved|Authoriz|Declin|Complete|Needs/ }).first();
out.badgeFound = await badge.count() > 0;
if (out.badgeFound) {
  await badge.click().catch(()=>{});
  await page.waitForTimeout(2500);
  out.options = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item, [role="option"], .q-list .q-item')]
    .map(el => { const c = el.cloneNode(true);
      c.querySelectorAll('svg,i,[class*="icon"],[aria-hidden="true"]').forEach(n=>n.remove());
      return (c.textContent||'').replace(/\s+/g,' ').trim(); }).filter(Boolean));
  console.log('options offered by the status control:', JSON.stringify(out.options));
  out.options.forEach(o => { try { assertLabelSane(o, '(status option)'); } catch(e) { console.log('   ! ' + e.message); } });
  out.cancelledPresent = out.options.some(o => /cancel/i.test(o));
  console.log('does the control offer a Cancelled status?', out.cancelledPresent ? 'YES' : 'NO');
}
await page.screenshot({ path: 'build/probe-2026-09-02/line-status-screen.png' });
fs.writeFileSync('build/probe-2026-09-02/line-status-screen.json', JSON.stringify(out, null, 1));
await browser.close();
