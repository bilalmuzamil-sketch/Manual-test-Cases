// Shared helpers for the WO / part-sale regression (steps 1-2). SECRET-FREE: cookies come from /tmp/cln/cookies.json via staging-boot2.
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
export const APP = 'https://app.staging.shopview.com';
export const API = 'https://api.staging.shopview.com';
export const OUT = '/home/user/Manual-test-Cases/build/regression-wo-parts-invoices-2026-11/steps-1-2';
export const SEEDLOG = OUT + '/seed-log.jsonl';
export async function start(opts = {}) {
  const b = await boot2('admin', opts);
  const page = b.page;
  page.on('dialog', d => d.dismiss().catch(() => {}));
  // boot2 stores the login payload, whose details.default_workplace is the user's default (Heavy Duty), so the SPA header
  // and anything it reads from localStorage would point at Heavy Duty. Point it at the switched location too.
  if (opts.workplaceId) await page.evaluate(({ wp, tz }) => { const u = JSON.parse(localStorage.getItem('user')); u.data.details.default_workplace = wp; u.data.details.workplace_timezone = tz; localStorage.setItem('user', JSON.stringify(u)); }, { wp: opts.workplaceId, tz: opts.timezone });
  return b;
}
// API call from inside the signed-in page (boot2 rotates PHPSESSID, so calls must run in the page)
export async function call(page, method, path, body, log) {
  const r = await page.evaluate(async ({ method, url, body }) => {
    const o = { method, credentials: 'include', headers: { Accept: 'application/json' } };
    if (body !== undefined) { o.headers['Content-Type'] = 'application/json'; o.body = JSON.stringify(body); }
    const x = await fetch(url, o); const t = await x.text(); let j = null; try { j = JSON.parse(t); } catch {}
    return { s: x.status, j, t: j ? null : t.slice(0, 500) };
  }, { method, url: path.startsWith('http') ? path : API + path, body });
  if (log || method !== 'GET') fs.appendFileSync(SEEDLOG, JSON.stringify({ at: new Date().toISOString(), method, path, body, status: r.s, resp: r.j ? JSON.stringify(r.j).slice(0, 300) : r.t }) + '\n');
  return r;
}
export async function zones(page, locationZone) {
  return page.evaluate((lz) => ({
    location_zone: lz,
    browser_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    browser_offset_min_now: -new Date().getTimezoneOffset(),
    app_timezone_key: localStorage.getItem('timezone'),
    app_version: document.querySelector('meta[name="app-version"]')?.content || null,
    at_utc: new Date().toISOString(),
  }), locationZone).then(z => ({ ...z, process_TZ: process.env.TZ || null, process_offset_min_now: -new Date().getTimezoneOffset() }));
}
export const LOC = { id: '2644c166-362b-48ec-9cf2-2ac974418039', tz: 'America/Edmonton', name: 'ZZAUTOTEST R365 Location C with a name longer than the chip' };
export async function headerLocation(page) { return page.evaluate(() => (document.querySelector('header .short-text-content')?.innerText || '').trim()); }
export const sleep = ms => new Promise(r => setTimeout(r, ms));
