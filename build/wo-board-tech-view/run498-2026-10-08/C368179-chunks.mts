/** 16 Oct 2026 — C368179 helper, read only (Rule 104 instrument check): save the staging app's Schedule scripts to the session scratchpad
 *  so the code that turns a drop position into a shift start time can be read (snap size, rounding, which x is used), instead of
 *  guessing from pictures. No clicks, nothing changed. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts';
const OUT = '/tmp/claude-0/-home-user-Manual-test-Cases/126e0959-4bca-54ed-8b95-71a191ca38d1/scratchpad/chunks'; fs.mkdirSync(OUT, { recursive: true });
const { browser, page: p } = await open('/schedule'); await p.waitForTimeout(9000);
const res: any = await p.evaluate(`(async () => { const q = [...[...document.scripts].map(s => s.src).filter(Boolean), ...performance.getEntriesByType('resource').map(e => e.name).filter(u => /\\.js(\\?|$)/.test(u))];
  const seen = new Set(); const out = {};
  while (q.length) { const u = q.shift(); if (seen.has(u) || !u.includes(location.host)) continue; seen.add(u); let t = ''; try { t = await (await fetch(u)).text(); } catch (e) { continue; }
    for (const m of t.matchAll(/["'](\\.{0,2}\\/?[A-Za-z0-9_\\-\\/]*\\.[A-Za-z0-9_\\-]+\\.js)["']/g)) { try { q.push(new URL(m[1], u).href); } catch (e) {} }
    if (/schedule\\/shifts|DropSchedule|drop_single_day|schedule_calendar|startsAt/.test(t)) out[u.split('/').pop()] = t; }
  return { scanned: seen.size, files: out }; })()`);
for (const [f, txt] of Object.entries(res.files)) fs.writeFileSync(path.join(OUT, f), String(txt));
console.log('SCANNED', res.scanned, 'SAVED', Object.keys(res.files).map((f) => `${f}(${String(res.files[f]).length})`).join(' ')); await done(browser);
