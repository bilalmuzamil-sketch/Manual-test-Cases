/** 14 Oct 2026 — read-only: list every /api path in the staging app's loaded scripts that mentions technicians/staff/board, to find
 *  where the Board/Tech View headers get a technician's name. No clicks, no preference changes. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts';
import { EV } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); await p.waitForTimeout(6000);
const res = await p.evaluate(`(async () => { const urls = [...new Set(performance.getEntriesByType('resource').map(e => e.name).filter(u => /\\.js(\\?|$)/.test(u)))];
  const hits = {}; for (const u of urls) { try { const t = await (await fetch(u)).text(); for (const m of t.matchAll(/["'\`](\\/?api\\/[A-Za-z0-9_\\-\\/\\$\\{\\}\\.]+)["'\`]/g)) { if (/tech|staff|board|lead|user|iam|member/i.test(m[1])) hits[m[1]] = (hits[m[1]] || 0) + 1; }
    for (const m of t.matchAll(/["'\`]((?:\\/)?(?:work-orders|staff|users|iam|technicians)[A-Za-z0-9_\\-\\/\\$\\{\\}\\.]*)["'\`]/g)) hits['~' + m[1]] = (hits['~' + m[1]] || 0) + 1; } catch (e) {} }
  return { n: urls.length, hits }; })()`);
fs.writeFileSync(path.join(EV, 'probe-endpoints.json'), JSON.stringify(res, null, 1)); console.log(JSON.stringify(res).slice(0, 5000));
await done(browser);
