// Find the Roles and Permissions admin page on sv9160 and report what is actually there.
//
// The specification (Confluence 565116952) puts it at Administration > Roles and Permissions, with
// a "Create Custom Role" button. That is the specification; this branch is a different question,
// and the whole point today is to stop treating the two as the same thing.
//
// Discovery only - nothing is created or changed.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';

const DIR = '/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const R = { at: new Date().toISOString(), tried: {} };
const save = () => fs.writeFileSync(`${DIR}/PROBE-ROLES-PAGE.json`, JSON.stringify(R, null, 2));
const L = (...a) => console.log(...a);

const { browser, page } = await boot('sv9160', '/administration/staff', 'admin');
await page.setViewportSize({ width: 1600, height: 1400 }).catch(() => {});
await page.waitForTimeout(7000);

const park = async () => { await page.mouse.move(5, 5); await page.waitForTimeout(300); };

// What does the admin area itself offer? Read the navigation rather than guessing URLs.
R.adminNav = await page.evaluate(() => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  return [...document.querySelectorAll('a,[role=tab],.q-tab,.q-item')].filter(vis)
    .map(e => ({ text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40),
                 href: e.getAttribute('href') }))
    .filter(x => x.text).slice(0, 40);
});
L('admin navigation:', JSON.stringify(R.adminNav.map(x => x.text)).slice(0, 500));
save();

for (const path of ['/administration/roles', '/administration/roles-and-permissions',
                    '/administration/permissions', '/administration/role-templates',
                    '/settings/roles']) {
  await page.goto('https://sv9160.qa.shopview.com' + path, { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(5000);
  await park();
  const info = await page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
    const headings = [...document.querySelectorAll('h1,h2,h3,.text-h4,.text-h5,.text-h6')].filter(vis)
      .map(e => (e.innerText || '').trim()).filter(Boolean).slice(0, 5);
    const buttons = [...document.querySelectorAll('button,.q-btn,[role=button]')].filter(vis)
      .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 18);
    const rows = [...document.querySelectorAll('tr')].filter(vis)
      .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 16);
    return { url: location.pathname, headings, buttons, rowCount: rows.length, rows: rows.slice(0, 14),
             notFound: /page not found|404/i.test(document.body.innerText || '') };
  });
  R.tried[path] = info;
  L(`\n${path} -> ${info.url}`);
  L('   headings:', JSON.stringify(info.headings));
  L('   buttons :', JSON.stringify(info.buttons).slice(0, 260));
  L('   rows    :', info.rowCount, JSON.stringify(info.rows.slice(0, 4)).slice(0, 260));
  save();
  if (info.rowCount > 3 && !info.notFound) {
    await page.screenshot({ path: `${DIR}/roles-evidence/roles-page-${path.replace(/\W+/g, '-')}.png` }).catch(() => {});
    R.looksLikeTheRolesPage = path;
    break;
  }
}
save();
L('\nlikely roles page:', R.looksLikeTheRolesPage || 'NOT FOUND at any of the paths tried');
await browser.close();
