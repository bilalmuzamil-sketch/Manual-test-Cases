/** 12 Oct 2026 (QA lead: "Change its time to Pakistan time … the location timezone MUST MATCH YOUR BROWSER TIME"):
 *  sv10043 Administration > Locations > "Staging Heavy Duty - 9919" > edit > Timezone = TZ_TARGET (default Asia/Karachi) >
 *  Save & Close, read back after a reload. Normal sign-in (qa-branch-boot). */
import fs from 'fs'; import path from 'path';
import { boot } from '../../testing-tools/qa-branch-boot.mjs';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'karachi-2026-10-12');
const TZ = process.env.TZ_TARGET || 'Asia/Karachi'; const LOC = process.env.LOC || 'Staging Heavy Duty - 9919'; const R = { tz: TZ, loc: LOC };
const { browser, page: p, APP } = await boot('sv10043', '/administration/locations', 'admin'); p.setDefaultTimeout(20000);
try {
  await p.goto(`${APP}/administration/locations`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
  const row = () => p.locator('tbody tr').filter({ hasText: LOC }).first();
  R.before = (await row().innerText()).replace(/\s+/g, ' ').slice(0, 160);
  await row().locator('text=edit_note').first().click(); await p.waitForTimeout(2500);
  const d = p.locator('.q-dialog').last(); const f = d.locator('.q-field').filter({ hasText: /Timezone/ }).first();
  await f.click(); await p.waitForTimeout(800); await p.keyboard.type(TZ.split('/')[1], { delay: 60 }); await p.waitForTimeout(2000);
  await p.locator('.q-menu .q-item').filter({ hasText: TZ }).first().click(); await p.waitForTimeout(800);
  await p.screenshot({ path: path.join(EV, 'loc-edit.png') });
  R.clicked = await p.evaluate(`(() => { const b = [...document.querySelectorAll('.q-dialog button')].filter(x => x.innerText.replace(/\\s+/g,' ').trim() === 'Save & Close').pop(); if (!b) return false; b.scrollIntoView(); b.click(); return true; })()`);
  await p.waitForTimeout(4000); R.toasts = await p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 120))`);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
  R.after = (await row().innerText()).replace(/\s+/g, ' ').slice(0, 160); await p.screenshot({ path: path.join(EV, 'loc-after.png') });
} catch (e) { R.error = String(e?.message || e).slice(0, 200); }
fs.writeFileSync(path.join(EV, 'set-tz.json'), JSON.stringify(R, null, 1)); console.log('SETTZ', JSON.stringify(R)); await browser.close(); process.exit(0);
