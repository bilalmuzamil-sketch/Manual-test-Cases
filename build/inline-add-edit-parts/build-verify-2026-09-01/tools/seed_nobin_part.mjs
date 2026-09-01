// seed_nobin_part.mjs — create ONE inventory part held in NO bin, which is the only Story 7 data
// state genuinely absent from this branch: of 6,879 inventory parts every single one has at least
// one bin, so "Not stocked" (S7-R2 leg 3) and "a part with no bins gets no allocation" (S7-N1) have
// nothing to show.
//
// The QA lead confirmed the route on 2026-09-01: "you have the inventory write access from
// Parts -> Click any inventory to edit - Also you can add you inventory from Parts -> Inventory".
// Rule 6: named ZZAUTOTEST so it is obviously throwaway, and the id is written to disk so it can be
// removed again.
import { boot, APP } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const log = []; const L = (...a) => { const s = a.map(String).join(' '); console.log(s); log.push(s); };
const { browser, page } = await boot('/workorders');
const wait = ms => page.waitForTimeout(ms);

await page.goto(`${APP}/parts/inventory`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
await page.waitForFunction(() => !/\bLoading\.\.\./.test(document.body?.innerText || '')
  && document.querySelectorAll('tbody tr').length > 0, { timeout: 60000 }).catch(() => {});
await wait(2500);

// 1. what creates a part on this screen?
const controls = await page.evaluate(() => ({
  buttons: [...document.querySelectorAll('button, .q-btn')].map(b => ({
    label: (b.innerText || '').replace(/\s+/g, ' ').trim(),
    id: b.getAttribute('data-test-id') })).filter(x => x.label || x.id).slice(0, 25),
  fabs: [...document.querySelectorAll('[data-test-id*="add"], [data-test-id*="create"], [data-test-id*="new"]')]
    .map(e => e.getAttribute('data-test-id')),
}));
L('create controls:', JSON.stringify(controls).slice(0, 900));

const opened = await page.evaluate(() => {
  const b = [...document.querySelectorAll('button, .q-btn')].find(x =>
    /add|create|new/i.test((x.innerText || '') + ' ' + (x.getAttribute('data-test-id') || '')));
  if (!b) return null;
  const label = (b.innerText || b.getAttribute('data-test-id') || '').replace(/\s+/g, ' ').trim();
  b.click(); return label;
});
L('clicked:', opened);
await wait(5000);
const dialog = await page.evaluate(() => {
  const d = document.querySelector('.q-dialog');
  if (!d) return { open: false, url: location.pathname };
  return { open: true, url: location.pathname,
    title: (d.innerText || '').replace(/\s+/g, ' ').slice(0, 140),
    ids: [...new Set([...d.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')))].slice(0, 40),
    requiredish: (d.innerText || '').split('\n').map(x => x.trim()).filter(Boolean).slice(0, 30),
    buttons: [...d.querySelectorAll('button')].map(b => (b.innerText || '').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0, 14) };
});
L('create dialog:', JSON.stringify(dialog, null, 1).slice(0, 2000));
await page.screenshot({ path: `${OUT}/evidence/seed-create-part.png`, fullPage: true });
fs.writeFileSync(`${OUT}/evidence/seed-nobin-part.log`, log.join('\n') + '\n');
await browser.close();
