/** C96938 retest on v26.40.14-e84b3d1 (12 Oct 2026, SV-11075): in Tech View, does pointing at a technician's avatar in the
 *  group header show the name? Reads each header avatar's hover text (title / aria-label / tooltip) in a normal browser,
 *  hovers the long-named technician's avatar and name, and takes 2x pictures. Read-only. Positive control: the header NAME's
 *  hover text (which already worked on 12 Oct). */
import fs from 'fs'; import path from 'path';
import { boot } from '../../testing-tools/qa-branch-boot.mjs';
const EVD = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'retest-e84b3d1-2026-10-12');
const { browser, page: p } = await boot('sv10043', '/workorders?tab=all', 'admin');
const R = {}; await p.waitForTimeout(6000);
R.version = await p.evaluate(() => document.body.innerText.match(/v\d+\.\d+\.\d+-[0-9a-f]{7}/)?.[0] ?? null);
await p.locator('[aria-label="Tech View"]').first().click(); await p.waitForTimeout(3000);
const box = p.locator('[data-test-id="page_search_input"]');
if (!(await box.isVisible().catch(() => false))) await p.locator('[data-test-id="page_search_toggle"]').click({ force: true });
await box.fill('ZZAUTOTEST F2 Name Tooltip'); await p.waitForTimeout(4000);
R.headers = await p.evaluate(() => [...document.querySelectorAll('.tech-view-group-header')].map((h) => {
  const av = h.querySelector('.q-avatar'); const b = av?.getBoundingClientRect();
  return { text: h.innerText.replace(/\s+/g, ' ').trim().slice(0, 60), avatarTitle: av?.getAttribute('title') ?? av?.closest('[title]')?.getAttribute('title') ?? null,
    avatarAria: av?.getAttribute('aria-label') ?? null, box: b ? [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)] : null }; }));
const tip = () => p.evaluate(() => [...document.querySelectorAll('.q-tooltip')].map((e) => e.innerText.trim()).join(' | '));
const long = p.locator('.tech-view-group-header').filter({ hasText: /Maximiliana/ }).first();
if (await long.count()) {
  await long.locator('.q-avatar').first().hover(); await p.waitForTimeout(1500); R.longAvatarTooltip = await tip();
  await p.screenshot({ path: path.join(EVD, 'C96938-long-avatar-hover.png') });
  const nm = long.getByText(/Maximiliana/).first(); R.longNameTitle = await nm.getAttribute('title').catch(() => null);
  await nm.hover(); await p.waitForTimeout(1500); R.longNameTooltip = await tip();
}
await box.fill(''); await p.waitForTimeout(500);
fs.writeFileSync(path.join(EVD, 'C96938-avatar-check.json'), JSON.stringify(R, null, 1)); console.log(JSON.stringify(R, null, 1));
await browser.close(); process.exit(0);
