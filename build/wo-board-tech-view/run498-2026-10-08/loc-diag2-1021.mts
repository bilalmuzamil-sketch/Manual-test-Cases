/** loc-diag2-1021.mts — 21 Oct 2026, staging: the on-screen location switch, step by step, with the API calls the page makes.
 *  Opens the profile menu, lists its rows, opens "select location", lists the options, clicks Staging Heavy Duty, records every
 *  /api request with "location"/"workplace" in it and the header after. Pictures EV/LOC-*.png. */
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api } from './data.mts';
import { shot } from './wob.mts';
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p;
const calls: string[] = []; p.on('request', (r) => { if (/location|workplace/i.test(r.url())) calls.push(`${r.method()} ${r.url().replace(/^https:\/\/[^/]+/, '')} ${(r.postData() || '').slice(0, 160)}`); });
const header = () => p.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => '(no profile_menu_button)');
await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(5000);
console.log('header', await header());
await p.locator('[data-test-id="profile_menu_button"]').click().catch((e) => console.log('click profile', String(e).slice(0, 100))); await p.waitForTimeout(1500);
console.log('profile menu', JSON.stringify((await p.locator('.q-menu').last().locator('.q-item').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').trim())));
await shot(p, 'LOC-1-profile-menu');
await p.locator('[data-test-id="select_location"]').click().catch((e) => console.log('click select_location', String(e).slice(0, 100))); await p.waitForTimeout(1500);
const opts = (await p.locator('.q-menu').last().locator('.q-item').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').trim());
console.log('location options', opts.length, JSON.stringify(opts.slice(0, 15)));
await shot(p, 'LOC-2-location-options');
const it = p.locator('.q-menu .q-item').filter({ hasText: 'Staging Heavy Duty' }).filter({ hasNotText: /Change Location/i }).last();
console.log('heavy option count', await it.count()); await it.click().catch((e) => console.log('click heavy', String(e).slice(0, 100))); await p.waitForTimeout(7000);
console.log('header after', await header(), 'first number', await p.evaluate(`(document.body.innerText.match(/\\bS\\d+-\\d+\\b/) || [])[0]`));
await shot(p, 'LOC-3-after');
console.log('calls', JSON.stringify(calls.slice(-10)));
await RUN.end().catch(() => {});
await done(browser);
