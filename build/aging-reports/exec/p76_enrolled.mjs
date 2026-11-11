// p76_enrolled.mjs — 11 Nov 2026 ~16:20: which locations is the QA Admin enrolled at? (C715424 / C715384 / C715385 need a location the user is NOT
// enrolled at.) The avatar menu shows "Change Location: <current>" as a button; clicking that button opens the list of the user's locations.
// Read it (no switch: Escape). Also reads GET /api/auth/me/fe-permissions keys that look like workplaces. Output p76/out.json + picture.
import { start } from './lib.mjs'; import fs from 'fs';
const OUT = new URL('./p76/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/workorders'); const p = s.page; const o = {};
try { await p.locator('header button, header .q-avatar').filter({ hasText: /^[A-Z]{2}$/ }).last().click(); await p.waitForTimeout(1200); o.menu = (await p.locator('.q-menu').last().innerText()).split('\n').map((t) => t.trim()).filter(Boolean);
  const btn = p.locator('.q-menu').last().getByText('Staging Heavy Duty - 9919', { exact: true }).first(); await btn.click(); await p.waitForTimeout(2000);
  const pops = p.locator('.q-menu:visible, .q-dialog:visible'); const n = await pops.count(); o.lists = []; for (let i = 0; i < n; i++) o.lists.push((await pops.nth(i).innerText()).split('\n').map((t) => t.trim()).filter(Boolean)); await s.shot('list');
  await p.keyboard.press('Escape'); await p.keyboard.press('Escape');
  o.me = await p.evaluate(async () => { const r = await fetch('https://sv11315api.qa.shopview.com/api/auth/me/fe-permissions', { credentials: 'include', headers: { Accept: 'application/json' } }); const j = await r.json(); const d = j.data || j; const out = {}; for (const [k, v] of Object.entries(d)) if (/work|loc|place/i.test(k)) out[k] = JSON.stringify(v).slice(0, 400); return out; });
} catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('p76', JSON.stringify({ lists: o.lists, me: o.me, err: o.err }).slice(0, 900)); await s.close(); process.exit(0);
