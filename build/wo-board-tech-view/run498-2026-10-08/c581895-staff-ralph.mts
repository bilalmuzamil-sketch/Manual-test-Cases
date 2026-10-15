/** 15 Oct 2026, READ ONLY — C581895 step 1 for Technician B: Settings > Staff, Search "Ralph", read the row(s) (first + last name
 *  columns). c581895-v2.mts read Esther's row but not Ralph's: the page's Search folds into an icon after the first search, so the
 *  second fill never happened. Here Search is clicked open first. Positive control: at least one row must be read. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { EV } from './wob.mts';
const { browser, page: p } = await open('/administration/staff'); const o: any = {};
await p.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
await p.getByText('Search', { exact: true }).first().click().catch(() => {}); await p.waitForTimeout(800);
const box = p.locator('input[placeholder*="Search" i], input[type="search"], .q-field input').first(); await box.fill('Ralph').catch((e) => { o.fillError = String(e).slice(0, 120); });
await p.waitForTimeout(3500); o.typed = await box.inputValue().catch(() => null);
o.rows = await p.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => [...r.cells].slice(0, 3).map(c => c.innerText.trim()).join(' | '))`);
await p.screenshot({ path: path.join(EV, 'C581895-v2-step1-staff-Ralph.png') });
fs.writeFileSync(path.join(EV, 'c581895-staff-ralph.json'), JSON.stringify(o, null, 1)); console.log('RALPH', JSON.stringify(o)); await done(browser);
