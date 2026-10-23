/** chunks-import-1023.mts — 23 Oct 2026, PRODUCTION, read-only: in the build's scripts, how is a staff member added to a location
 *  (iam/create, workPlaceId, invite/add-existing routes) and how is a staff record renamed? Feeds the C707077 unblock. No clicks. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { EV } from './wob.mts';
const { browser, page: p } = await open('/settings/staff'); await p.waitForTimeout(6000);
const res = await p.evaluate(`(async () => { const host = location.host; const main = [...document.scripts].map(s => s.src).filter(Boolean);
  const seen = new Set(); const q = [...main, ...performance.getEntriesByType('resource').map(e => e.name).filter(u => /\\.js(\\?|$)/.test(u))]; const out = {};
  while (q.length) { const u = q.shift(); if (seen.has(u) || !u.includes(host)) continue; seen.add(u); let t = ''; try { t = await (await fetch(u)).text(); } catch (e) { continue; }
    for (const m of t.matchAll(/["'](\\.{0,2}\\/?[A-Za-z0-9_\\-\\/]*\\.[A-Za-z0-9_\\-]+\\.js)["']/g)) { try { q.push(new URL(m[1], u).href); } catch (e) {} }
    const hits = []; for (const k of ['staff/import', 'import-staff', 'importStaff', 'ImportStaff', 'staff-import', 'staffImport', 'employees/import', 'iam/import', 'users/import', 'iam/', 'staff/']) { let i = t.indexOf(k); let n = 0; while (i >= 0 && n < 40) { hits.push(t.slice(Math.max(0, i - 160), i + 220)); i = t.indexOf(k, i + 1); n++; } }
    if (hits.length) out[u.split('/').pop()] = [...new Set(hits)].slice(0, 80); }
  return { scanned: seen.size, out }; })()`);
fs.writeFileSync(path.join(EV, 'chunks-import-1023.json'), JSON.stringify(res, null, 1));
const all = Object.values((res as any).out).flat() as string[]; const eps = new Set<string>(); for (const h of all) for (const m of h.matchAll(/["'`][a-z/\-]*(?:iam|staff)\/[A-Za-z0-9_\-\/${}.]*/g)) eps.add(m[0]);
console.log('scanned', (res as any).scanned, 'ENDPOINTS', JSON.stringify([...eps])); console.log('WPID', JSON.stringify(all.filter(h => /workPlaceId/.test(h)).slice(0, 8)));
await done(browser);
