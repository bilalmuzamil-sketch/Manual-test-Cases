/** 14 Oct 2026 — read-only: print the staging app's code around a few strings (iam/change-name, header name of Board/Tech View
 *  columns) so the account-name vs staff-name source is read, not guessed. No clicks. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts';
import { EV } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); await p.waitForTimeout(5000);
const res = await p.evaluate(`(async () => { const base = location.origin + '/js/'; const files = ['index.DB_qleRn.js', 'WorkOrders.CbpM3Gn3.js', 'WorkOrdersBoardViewDisplay.C0p29Pyy.js', 'WorkOrdersTechViewDisplay.B5xTgl4e.js'];
  const pats = ['iam/change-name', 'lead-technician-candidates', 'header.name', 'techAssignedFirstName', 'technician_first_name', 'staffName'];
  const out = {}; for (const f of files) { let t = ''; try { t = await (await fetch(base + f)).text(); } catch (e) { out[f] = 'fetch failed'; continue; }
    out[f] = {}; for (const s of pats) { const hits = []; let i = -1; while ((i = t.indexOf(s, i + 1)) >= 0 && hits.length < 4) hits.push(t.slice(Math.max(0, i - 260), i + 260)); if (hits.length) out[f][s] = hits; } }
  return out; })()`);
fs.writeFileSync(path.join(EV, 'probe-chunk-ctx.json'), JSON.stringify(res, null, 1));
await done(browser);
