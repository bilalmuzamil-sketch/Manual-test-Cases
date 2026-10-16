/** 16 Oct 2026 — before each staging re-run: make the signed-in test account's location "Staging Heavy Duty - 9919" through the menu
 *  (as a person does) and read the top bar back. The account was found at "DVI Test" and at Lethbridge between runs (L0399), and every
 *  test then ran at the wrong location. Exits 3 if the top bar does not read Heavy Duty, so the queue skips that test instead of
 *  running it in the wrong place. */
import { open, done } from './session.mts'; import { t, switchLocUI } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); await p.waitForTimeout(5000);
let top = await switchLocUI(p, 'Staging Heavy Duty'); if (!top.includes('Heavy Duty')) top = await switchLocUI(p, 'Staging Heavy Duty');
console.log(t(), 'LOCATION', top); await done(browser); process.exit(top.includes('Heavy Duty') ? 0 : 3);
