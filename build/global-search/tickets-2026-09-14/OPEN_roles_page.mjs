// Reach Roles & Permissions by CLICKING IT, not by guessing its URL.
//
// I just guessed five URLs, got a blank page from each, and printed "NOT FOUND at any of the paths
// tried" -- while the admin navigation on screen carried a "Roles & Permissions" item the whole
// time. That is the false-blocker pattern the repo already warns about: find a route by walking the
// UI, never by guessing. Caught it this time only because the probe dumped the navigation.
//
// Discovery only. Nothing is created or changed.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';

const DIR = '/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const R = { at: new Date().toISOString() };
const save = () => fs.writeFileSync(`${DIR}/ROLES-PAGE.json`, JSON.stringify(R, null, 2));
const L = (...a) => console.log(...a);

const { browser, page } = await boot('sv9160', '/administration/staff', 'admin');
await page.setViewportSize({ width: 1600, height: 1400 }).catch(() => {});
await page.waitForTimeout(7000);
const park = async () => { await page.mouse.move(5, 5); await page.waitForTimeout(300); };

// click the navigation entry by its own words
const clicked = await page.evaluate(() => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  const el = [...document.querySelectorAll('a,.q-item,[role=tab]')].filter(vis)
    .find(e => /roles\s*&\s*permissions/i.test((e.innerText || '').replace(/\s+/g, ' ')));
  if (!el) return null;
  el.scrollIntoView({ block: 'center' });
  const r = el.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height, text: (el.innerText || '').trim() };
});
R.navItem = clicked;
if (!clicked) { R.abort = 'no "Roles & Permissions" item in the navigation';
  save(); L(R.abort); await browser.close(); process.exit(2); }
await page.mouse.move(clicked.x + clicked.w / 2, clicked.y + clicked.h / 2);
await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up();
await page.waitForTimeout(7000);
await park();

R.url = new URL(page.url()).pathname;
R.page = await page.evaluate(() => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  return {
    headings: [...document.querySelectorAll('h1,h2,h3,.text-h4,.text-h5,.text-h6')].filter(vis)
      .map(e => (e.innerText || '').trim()).filter(Boolean).slice(0, 6),
    buttons: [...document.querySelectorAll('button,.q-btn,[role=button]')].filter(vis)
      .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 25),
    rows: [...document.querySelectorAll('tr')].filter(vis)
      .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 20),
    testIds: [...new Set([...document.querySelectorAll('[data-test-id]')].filter(vis)
      .map(e => e.getAttribute('data-test-id').replace(/_\d+$/, '')))].slice(0, 30),
  };
});
await page.screenshot({ path: `${DIR}/roles-evidence/roles-and-permissions-page.png` }).catch(() => {});
L('URL:', R.url);
L('headings:', JSON.stringify(R.page.headings));
L('buttons :', JSON.stringify(R.page.buttons).slice(0, 400));
L('rows    :', R.page.rows.length);
R.page.rows.slice(0, 14).forEach(r => L('   ', r.slice(0, 95)));
L('test ids:', JSON.stringify(R.page.testIds).slice(0, 400));
save();
await browser.close();
