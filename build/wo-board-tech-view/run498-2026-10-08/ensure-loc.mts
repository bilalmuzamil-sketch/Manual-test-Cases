/** ensure-loc.mts — 22 Oct 2026: ensure-heavy.mts for ANY environment. Puts the signed-in test account at the profile's first location
 *  (profiles/<host>.json heavyName: "Staging Heavy Duty - 9919" on staging, "Truck Hill 1" on production) through the menu and reads the
 *  top bar back. Exits 3 when the top bar does not show it, so the queue skips the next test instead of running it in the wrong place. */
import fs from 'node:fs';
import { open, done } from './session.mts'; import { t, switchLocUI } from './wob.mts'; import { PROFILE_FILE } from './profile.mts';
const name: string = (fs.existsSync(PROFILE_FILE) ? JSON.parse(fs.readFileSync(PROFILE_FILE, 'utf8')).heavyName : null) || 'Staging Heavy Duty';
const { browser, page: p } = await open('/workorders?tab=all'); await p.waitForTimeout(5000);
const key = name.slice(0, 20); let top = await switchLocUI(p, name); if (!top.includes(key)) top = await switchLocUI(p, name);
console.log(t(), 'LOCATION', top, '| wanted', name); await done(browser); process.exit(top.includes(key) ? 0 : 3);
