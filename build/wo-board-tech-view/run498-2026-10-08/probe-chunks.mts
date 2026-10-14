/** 14 Oct 2026 — read-only: in the staging build's Board/Tech View scripts, which fields name a technician (FirstName/firstName/
 *  first_name …)? Finds whether headers use the account or the staff-record name. No clicks. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts';
import { EV } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); await p.waitForTimeout(5000);
const res = await p.evaluate(`(async () => { const main = [...document.scripts].map(s => s.src).filter(Boolean);
  const seen = new Set(); const q = [...main, ...performance.getEntriesByType('resource').map(e => e.name).filter(u => /\\.js(\\?|$)/.test(u))]; const out = {};
  while (q.length) { const u = q.shift(); if (seen.has(u) || !u.includes('app.staging.shopview.com')) continue; seen.add(u); let t = ''; try { t = await (await fetch(u)).text(); } catch (e) { continue; }
    for (const m of t.matchAll(/["'](\\.{0,2}\\/?[A-Za-z0-9_\\-\\/]*\\.[A-Za-z0-9_\\-]+\\.js)["']/g)) { try { q.push(new URL(m[1], u).href); } catch (e) {} }
    if (/WorkOrders(Board|TechView)|board_column_name|tech_view_group_name|lead-technician-candidates/.test(t)) { const name = u.split('/').pop(); const hits = [];
      for (const re of [/board_column_name[^;]{0,300}/g, /tech_view_group_name[^;]{0,300}/g, /[A-Za-z_]*(?:[Ff]irst_?[Nn]ame|[Ff]ull_?[Nn]ame|staffName|displayName|accountName)[A-Za-z_]*/g]) for (const m of t.matchAll(re)) hits.push(m[0].slice(0, 300));
      out[name] = [...new Set(hits)].slice(0, 60); } }
  return { scanned: seen.size, out }; })()`);
fs.writeFileSync(path.join(EV, 'probe-chunks.json'), JSON.stringify(res, null, 1)); console.log(JSON.stringify(res, null, 1).slice(0, 12000));
await done(browser);
