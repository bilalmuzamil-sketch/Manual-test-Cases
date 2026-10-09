/** Analytics look (2026-10-09): with Google Analytics NOT blocked, record every analytics request the Work Orders page
 *  sends (event name + parameters, read from the request itself, whether or not it reaches Google), while switching
 *  displays, changing a field and the density. Tells whether the not-runnable analytics cases can be checked here. */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api } from './data.mts';
import { EV, t, display, tab } from './wob.mts';
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p;
await p.context().unrouteAll({ behavior: 'ignoreErrors' }).catch(() => {});
await p.context().route((u) => /maps\.googleapis|intercom|sentry\.io|mercure\.qa|hotjar|fullstory/i.test(u.toString()), (r) => r.abort()).catch(() => {});
const ev: any[] = [];
const grab = (url: string, body: string | null, status: string) => { if (!/google-analytics|googletagmanager|\/g\/collect|analytics/.test(url)) return;
  const all = [url.split('?')[1] ?? '', ...(body ?? '').split('\n')].join('&');
  for (const line of (body ? body.split('\n') : ['']).map((l) => (url.split('?')[1] ?? '') + '&' + l)) { const q = new URLSearchParams(line); const en = q.get('en'); if (en) ev.push({ en, ep: Object.fromEntries([...q.entries()].filter(([k]) => /^(ep|epn|up|upn)\./.test(k))), uid: q.get('uid'), status }); }
  if (!/[?&]en=/.test(all)) ev.push({ other: url.replace(/\?.*/, '').slice(0, 80), status }); };
p.on('request', (r) => grab(r.url(), r.postData(), 'sent'));
p.on('requestfailed', (r) => ev.push({ failed: r.url().replace(/\?.*/, '').slice(0, 80), why: r.failure()?.errorText }));
await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); await tab(p, 'All');
const mark = (m: string) => ev.push({ step: m });
mark('List'); await display(p, 'List'); await p.waitForTimeout(3000);
mark('Tech View'); await display(p, 'Tech View'); await p.waitForTimeout(3000);
mark('Board View'); await display(p, 'Board View'); await p.waitForTimeout(3000);
mark('field VIN toggle'); await p.locator('[data-test-id="button_board_fields_selection"]').click(); await p.waitForTimeout(800); await p.locator('[data-test-id="toggle_board_field_vin"]').click(); await p.waitForTimeout(2500); await p.keyboard.press('Escape');
mark('density compact'); await p.locator('[data-test-id="button_density"]').click(); await p.waitForTimeout(800); await p.locator('[data-test-id="option_density_compact"]').click(); await p.waitForTimeout(2500); await p.keyboard.press('Escape');
mark('tab Estimates'); await tab(p, 'Estimates'); await p.waitForTimeout(3000);
const gtag = await p.evaluate(`({ gtag: typeof window.gtag, dataLayer: Array.isArray(window.dataLayer) ? window.dataLayer.length : null, last: Array.isArray(window.dataLayer) ? JSON.stringify(window.dataLayer.slice(-12)).slice(0, 2500) : null })`);
console.log(t(), JSON.stringify({ events: ev.slice(0, 80), gtag }, null, 1).slice(0, 7000));
fs.writeFileSync(path.join(EV, 'probe-ga.json'), JSON.stringify({ events: ev, gtag }, null, 1));
await RUN.end(); await done(browser);
