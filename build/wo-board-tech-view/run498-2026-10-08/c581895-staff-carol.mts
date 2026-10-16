/** 16 Oct 2026, READ ONLY — C581895 step 1 for Technician-A = Carol Neal (c581895-v2.mts now prefers her: List showed "David Sparks" on her
 *  work orders while Tech View and Board View showed "Carol Neal"). Settings > Staff, Search "Carol", then "Sparks": read the rows and
 *  take a picture of each, so the staff record name is shown and it is known whether a separate "David Sparks" staff record exists.
 *  Copied from c581895-staff-ralph.mts (Search is clicked open before each fill). Also reads, by API, the work order list's lead fields
 *  for one of Carol's work orders. Positive control: at least one row must be read for "Carol". */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { EV } from './wob.mts'; import { api, workOrders } from './data.mts';
const { browser, page: p } = await open('/administration/staff'); const o: any = {};
for (const q of ['Carol', 'Sparks']) {
  await p.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  await p.getByText('Search', { exact: true }).first().click().catch(() => {}); await p.waitForTimeout(800);
  const box = p.locator('input[placeholder*="Search" i], input[type="search"], .q-field input').first(); await box.fill(q).catch((e) => { o['fillError' + q] = String(e).slice(0, 120); });
  await p.waitForTimeout(3500); o['typed' + q] = await box.inputValue().catch(() => null);
  o['rows' + q] = await p.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => [...r.cells].slice(0, 5).map(c => c.innerText.trim()).join(' | ')).filter(Boolean)`);
  for (const tab of ['Deactivated']) { const t = p.getByText(new RegExp('^' + tab + '\\(\\d+\\)$')).first(); if (await t.count()) { await t.click().catch(() => {}); await p.waitForTimeout(2500); o['rows' + q + tab] = await p.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => [...r.cells].slice(0, 5).map(c => c.innerText.trim()).join(' | ')).filter(Boolean)`); await p.getByText(/^Active\(\d+\)$/).first().click().catch(() => {}); await p.waitForTimeout(2000); } }
  await p.screenshot({ path: path.join(EV, `C581895-v2-step1-staff-${q}.png`) });
}
const a = api(p); const w = (await workOrders(a, 'ZZAUTOTEST Staff Names')).filter((x: any) => /Carol|David/.test(`${x.techAssignedFirstName} ${x.techAssignedLastName}`)).slice(0, 2);
o.listLeadFields = w.map((x: any) => ({ number: x.number, techAssignedFirstName: x.techAssignedFirstName, techAssignedLastName: x.techAssignedLastName }));
fs.writeFileSync(path.join(EV, 'c581895-staff-carol.json'), JSON.stringify(o, null, 1)); console.log('CAROL', JSON.stringify(o)); await done(browser);
