/** probe-staff-window.mts — 17 Oct 2026, live probe (read only): the Edit Staff Member window's real buttons and fields, so
 *  C614714-r4.mts can press Save & Close and reach Job Title. Opens Settings > Staff, searches the control record
 *  "ZZAUTOTEST N1 Control", clicks the row's edit control, and dumps every visible button (tag, words with character codes around "&",
 *  aria-label, test id, classes, Playwright visibility) and every field label; closes the window without saving. Output EV/probe-staff-window.json. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api } from './data.mts';
import { EV, t } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(20_000); const a = api(p);
const o: any = { exitSwitch: (await a.post('/api/exit-switch-user', {})).status };
try {
  await p.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  if (!(await p.locator('[data-test-id="page_search_input"]:visible, input[placeholder*="earch" i]:visible').count())) { await p.getByText('Search', { exact: true }).first().click().catch(() => {}); await p.waitForTimeout(700); }
  await p.locator('[data-test-id="page_search_input"]:visible, input[placeholder*="earch" i]:visible').first().fill('Control 43447').catch(() => {}); await p.waitForTimeout(3500);
  const row = p.locator('tbody tr').filter({ hasText: 'Control 43447' }).first(); o.rows = await p.locator('tbody tr').filter({ hasText: 'Control 43447' }).count();
  await row.locator('td').last().locator('button, [role=button], i, a').first().click().catch((e: any) => { o.openErr = String(e).slice(0, 100); }); await p.waitForTimeout(3000);
  o.dialogs = await p.evaluate(`[...document.querySelectorAll('.q-dialog')].map(d => { const r = d.getBoundingClientRect(); const s = getComputedStyle(d); return { w: Math.round(r.width), h: Math.round(r.height), vis: s.visibility, disp: s.display, op: s.opacity, title: d.innerText.replace(/\\s+/g, ' ').slice(0, 40) }; })`);
  o.buttons = await p.evaluate(`[...document.querySelectorAll('.q-dialog button, .q-dialog .q-btn, .q-dialog [role=button]')].filter(b => b.getBoundingClientRect().width > 0).map(b => ({ tag: b.tagName, text: b.innerText, codes: [...(b.innerText || '')].map(c => c.charCodeAt(0)).join(','), textContent: b.textContent, aria: b.getAttribute('aria-label'), tid: b.getAttribute('data-test-id'), cls: String(b.className).slice(0, 80), type: b.getAttribute('type'), disabled: b.disabled || b.getAttribute('aria-disabled') }))`);
  o.pwSaveCounts = { visibleButtonExact: await p.locator('button:visible').filter({ hasText: /^\s*Save & Close\s*$/ }).count(), anyButtonHasText: await p.locator('button').filter({ hasText: 'Save & Close' }).count(), getByRole: await p.getByRole('button', { name: /Save & Close/i }).count(), textEngine: await p.locator('text=Save & Close').count() };
  o.fields = await p.evaluate(`[...document.querySelectorAll('.q-dialog .q-field')].filter(f => f.getBoundingClientRect().width > 0).map(f => ({ label: ((f.querySelector('.q-field__label') || {}).textContent || '').trim(), aria: (f.querySelector('input') || {}).getAttribute ? f.querySelector('input').getAttribute('aria-label') : null, tid: f.getAttribute('data-test-id') || ((f.querySelector('[data-test-id]') || {}).getAttribute ? f.querySelector('[data-test-id]').getAttribute('data-test-id') : null), text: f.innerText.replace(/\\s+/g, ' ').trim().slice(0, 50) }))`);
  o.labelsNearJobTitle = await p.evaluate(`[...document.querySelectorAll('.q-dialog *')].filter(e => e.children.length === 0 && /Job Title/i.test(e.textContent || '')).map(e => ({ tag: e.tagName, cls: String(e.className).slice(0, 60), parent: e.parentElement ? String(e.parentElement.className).slice(0, 60) : null, inputAfter: !!(e.closest('label, .q-field, div') || e).querySelector('input') }))`);
  o.toggles = await p.evaluate(`[...document.querySelectorAll('.q-dialog .q-toggle')].map(e => ({ text: e.innerText.replace(/\\s+/g, ' ').trim(), aria: e.getAttribute('aria-checked'), tid: e.getAttribute('data-test-id') }))`);
  await p.screenshot({ path: path.join(EV, 'probe-staff-window.png') }).catch(() => {});
  await p.keyboard.press('Escape'); await p.waitForTimeout(1000);
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
fs.writeFileSync(path.join(EV, 'probe-staff-window.json'), JSON.stringify(o, null, 1)); console.log(t(), 'probe', JSON.stringify(o).slice(0, 4000)); await done(browser);
