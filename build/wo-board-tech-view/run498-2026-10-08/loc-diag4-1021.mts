/** loc-diag4-1021.mts — 21 Oct 2026, staging: does setting the SIGNED-IN admin's own location to Heavy Duty (before switching to the
 *  runner) bring the runner's page to Heavy Duty? Reads the main page's header/first number before and after, then the runner's. */
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api } from './data.mts';
import { HEAVY } from './staff.mts';
const { browser, page: p0 } = await open('/workorders?tab=all'); const a0 = api(p0);
const look = async (p: any, tag: string) => console.log(tag, await p.locator('[data-test-id="profile_menu_button"]').innerText().then((x: string) => x.replace(/\s+/g, ' ').trim()).catch(() => '-'), await p.evaluate(`(document.body.innerText.match(/\\bS\\d+-\\d+\\b/) || [])[0]`));
await p0.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await p0.waitForTimeout(5000); await look(p0, 'MAIN before');
const r = await a0.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'Asia/Karachi' }); console.log('MAIN change', r.status);
await p0.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}); await p0.waitForTimeout(5000); await look(p0, 'MAIN after');
const RUN = await asRunner(browser, p0, a0); const p = RUN.p;
await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(5000); await look(p, 'RUNNER');
await RUN.end().catch(() => {});
await done(browser);
