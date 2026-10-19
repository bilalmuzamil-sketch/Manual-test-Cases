/** probe-staffloc3.mts — 19 Oct 2026, read-only, for C368131. Is a staff member's "Location" on the Edit Staff Member window their only
 *  location, or one of several? Reads Theresa Pinned's staff record from every staff endpoint that answers (keys holding location/workplace),
 *  whether she is a lead-technician candidate at the current location, and lists every field label in her Edit Staff Member window and the
 *  options of its Location list. Output EV/probe-staffloc3.json + picture. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api, candidates } from './data.mts';
import { EV } from './wob.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = {};
const rows = (await a.get('/api/staff?limit=200&search=Theresa')).body?.data?.collection ?? [];
const th = rows.find((x: any) => /Theresa Pinned/.test(`${x.first_name} ${x.last_name}`)) ?? rows[0];
o.theresa = th ? { name: `${th.first_name} ${th.last_name}`, staff_id: th.staff_id, id: th.id, email: th.email, active: th.is_active } : null;
if (th) {
  o.endpoints = {};
  for (const u of [`/api/staff/${th.staff_id}`, `/api/staff/view/${th.staff_id}`, `/api/staff/${th.id}`, `/api/staff/view/${th.id}`, `/api/staff/${th.staff_id}/workplaces`, `/api/staff/${th.staff_id}/locations`]) {
    const r = await a.get(u); const d = r.body?.data ?? r.body; const flat = JSON.stringify(d ?? null);
    o.endpoints[u] = { status: r.status, locKeys: flat.match(/"[a-z_]*(workplace|location)[a-z_]*":[^,}\]]{0,120}/gi)?.slice(0, 12) ?? [] }; }
  o.candidateHere = (await candidates(a)).some((x) => x.id === th.staff_id || /Theresa Pinned/.test(x.name));
  await p.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
  await p.getByText('Search', { exact: true }).first().click().catch(() => {}); await p.waitForTimeout(600);
  await p.locator('input[placeholder*="earch" i]:visible, input[data-test-id="page_search_input"]:visible').first().fill(th.email.split('@')[0]); await p.waitForTimeout(3000);
  await p.locator('[data-test-id^="button_edit"], button:has(i:text-is("edit"))').first().click().catch(() => {}); await p.waitForTimeout(3000);
  o.window = await p.evaluate(`(() => { const d = [...document.querySelectorAll('.q-dialog')].pop(); if (!d) return null;
    return { labels: [...d.querySelectorAll('.q-field__label, label, .text-subtitle2, .text-subtitle1, h6')].map(e => e.innerText.trim()).filter(Boolean),
             testIds: [...d.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')), text: d.innerText.replace(/\\s+/g, ' ').slice(0, 1200) }; })()`);
  await p.screenshot({ path: path.join(EV, 'probe-staffloc3-window.png') }).catch(() => {});
  const loc = p.locator('.q-dialog [data-test-id="select_location"]').first();
  if (await loc.count()) { await loc.click().catch(() => {}); await p.waitForTimeout(1500); o.locationOptions = await p.locator('.q-menu .q-item').allInnerTexts(); o.multiple = await loc.evaluate((e: any) => !!e.closest('.q-select--multiple') || !!e.querySelector('.q-chip')).catch(() => null); await p.keyboard.press('Escape'); }
  await p.keyboard.press('Escape').catch(() => {});
}
fs.writeFileSync(path.join(EV, 'probe-staffloc3.json'), JSON.stringify(o, null, 1)); console.log('STAFFLOC3', JSON.stringify(o).slice(0, 3500));
await done(browser);
