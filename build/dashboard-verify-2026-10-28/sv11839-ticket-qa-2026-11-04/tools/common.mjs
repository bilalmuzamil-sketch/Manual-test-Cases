// common.mjs — shared boot + Rule 99 evidence for the sv11839 ticket QA pass (4 Nov 2026).
// SECRET-FREE: cookies are read by qaBoot from /tmp/cln/qa11839/cookies.json (chmod 600) and never printed.
// Never calls /api/quick-login or /api/switch-user (playbook trap 5).
// Rule 99: refuses to run unless process TZ == location zone; records process TZ, browser timezoneId,
// localStorage['timezone'], localStorage['location'], the change-location status and the header location
// at start (and the caller records it at the end via headerCheck).
import fs from 'fs';
import path from 'path';
import { qaBoot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';

export const OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-04';
export const APP = 'https://sv11839.qa.shopview.com';
export const API = 'https://sv11839api.qa.shopview.com/api';
export const LOC = {
  HD: { id: 'b3c8c820-f815-4cf1-8938-10956c5ee71a', name: 'Staging Heavy Duty - 9919', tz: 'America/Edmonton' },
  LB: { id: 'f8a8b802-7780-4b16-bf10-343caeb616b2', name: 'Staging Lethbridge - 4310', tz: 'America/Edmonton' },
  TL: { id: 'f9da140e-f4eb-4e3b-adc8-028214ebaf4c', name: 'Test Location', tz: 'Asia/Karachi' },
};

export async function headerCheck(page, loc) {
  const text = await page.evaluate(() => (document.querySelector('header, .q-header')?.innerText || '').replace(/\s+/g, ' ').slice(0, 600));
  // narrow screens collapse the header behind a menu button; the location selector's own text element is still in the page
  const selector = await page.evaluate(() => [...document.querySelectorAll('header .short-text-content, .q-header .short-text-content, .q-drawer .short-text-content')].map(e => e.textContent.trim()));
  return { header_text: text, location_selector_text: selector, shows_location: text.includes(loc.name) || selector.includes(loc.name), at_utc: new Date().toISOString() };
}

export async function boot(loc, { viewport = { width: 1600, height: 1000 }, deviceScaleFactor = 2, dest = '/dashboard' } = {}) {
  if (process.env.TZ !== loc.tz) throw new Error(`RULE99: process TZ=${process.env.TZ} but location zone is ${loc.tz}`);
  const { browser, ctx, page } = await qaBoot({ branch: 'sv11839', cookieFile: '/tmp/cln/qa11839/cookies.json', workplaceId: loc.id, timezone: loc.tz, viewport, deviceScaleFactor, dest });
  const cl = await page.evaluate(async ([API, w, z]) => {
    const r = await fetch(API + '/iam/change-location', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ workplace_id: w, workplace_timezone: z }) });
    return r.status;
  }, [API, loc.id, loc.tz]);
  const st = await page.evaluate(() => ({ browser_tz: Intl.DateTimeFormat().resolvedOptions().timeZone, ls_timezone: localStorage.getItem('timezone'), ls_location: localStorage.getItem('location'), app_version: document.querySelector('meta[name="app-version"]')?.content || null, local_time: new Date().toString() }));
  const hdr = await headerCheck(page, loc);
  const rule99 = {
    location: loc.name, workplace_id: loc.id, location_tz: loc.tz,
    session_change_location: { workplace_timezone: loc.tz, http_status: cl },
    browser_timezoneId: st.browser_tz, process_TZ: process.env.TZ, process_resolved_tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    localStorage_timezone: st.ls_timezone, localStorage_location: st.ls_location,
    header_start: hdr, browser_local_time_start: st.local_time,
    all_match: st.browser_tz === loc.tz && process.env.TZ === loc.tz && JSON.parse(st.ls_timezone || 'null') === loc.tz && JSON.parse(st.ls_location || 'null') === loc.id && cl === 200 && hdr.shows_location,
  };
  return { browser, ctx, page, rule99, app_version: st.app_version };
}

export async function finish(page, loc, rule99) {
  rule99.header_end = await headerCheck(page, loc);
  rule99.localStorage_timezone_end = await page.evaluate(() => localStorage.getItem('timezone'));
  rule99.all_match = rule99.all_match && rule99.header_end.shows_location && JSON.parse(rule99.localStorage_timezone_end || 'null') === loc.tz;
  return rule99;
}

export function dir(ticket) { const d = path.join(OUT, ticket); fs.mkdirSync(d, { recursive: true }); return d; }
export async function shot(page, ticket, name, opts = {}) { const p = path.join(dir(ticket), name + '.png'); await page.screenshot({ path: p, ...opts }); return path.relative(OUT, p); }
export function save(ticket, obj) { fs.writeFileSync(path.join(dir(ticket), 'evidence.json'), JSON.stringify(obj, null, 1)); }
export const sleep = ms => new Promise(r => setTimeout(r, ms));
