/** S5 set-up probe (2026-10-08): how List's, Tech View's and Board View's column/field menus are built, and where
 *  each choice is saved (the work-orders-list preference). Reads only; restores nothing because it changes nothing. */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api } from './data.mts';
import { EV, t, shot, display, tab } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all');
const a = api(p); const R: any = { exit: (await a.post('/api/exit-switch-user', {})).status };
R.pref = (await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value;
const prefs = await a.get('/api/users/me/preferences'); R.allPrefKeys = JSON.stringify(prefs.body).slice(0, 600);
const menu = async () => p.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); if (!m) return null;
  return { text: m.innerText.replace(/\\s+/g, ' ').slice(0, 900), ids: [...new Set([...m.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')))].slice(0, 60),
    switches: [...m.querySelectorAll('[role=switch],[role=checkbox],.q-toggle,.q-checkbox')].map(e => ({ label: e.getAttribute('aria-label') || e.innerText.trim(), checked: e.getAttribute('aria-checked'), disabled: e.getAttribute('aria-disabled') })).slice(0, 40),
    inputs: [...m.querySelectorAll('input')].map(e => ({ ph: e.placeholder, aria: e.getAttribute('aria-label'), tid: e.getAttribute('data-test-id') })),
    buttons: [...m.querySelectorAll('button')].map(e => ({ text: e.innerText.trim(), tid: e.getAttribute('data-test-id'), disabled: e.disabled || e.getAttribute('aria-disabled') })) }; })()`);
const toolbar = async () => p.evaluate(`[...document.querySelectorAll('button[data-test-id], [data-test-id^="button_"]')].filter(e => e.getBoundingClientRect().y < 260 && e.getBoundingClientRect().width > 0).map(e => e.getAttribute('data-test-id') + '|' + (e.getAttribute('aria-label') || '') + '|' + e.innerText.trim().slice(0, 30))`);
await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All');
for (const d of ['List', 'Tech View', 'Board View']) {
  await display(p, d); await p.waitForTimeout(1500);
  const tb = await toolbar(); const o: any = { toolbar: tb };
  const btn = p.locator('[data-test-id="button_tech_view_column_selection"], [data-test-id="button_board_fields_selection"], [data-test-id="button_column_selection"], [aria-label="Column Selection"], [aria-label="Fields to display"]').filter({ visible: true }).first();
  if (await btn.count()) { o.button = await btn.getAttribute('data-test-id'); await btn.click(); await p.waitForTimeout(1500); o.menu = await menu(); await shot(p, `S5-probe-${d.replace(' ', '')}-menu`); await p.keyboard.press('Escape'); await p.waitForTimeout(600); }
  else o.button = 'not found';
  o.heads = await p.evaluate(`[...document.querySelectorAll('thead th')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.trim()).slice(0, 30)`);
  o.card = await p.evaluate(`(() => { const c = document.querySelector('[data-test-id^="board_card_"]'); return c ? { text: c.innerText.replace(/\\s+/g, ' ').slice(0, 300), fields: [...new Set([...c.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id').replace(/_[0-9a-f-]{36}$/, '')))] } : null; })()`);
  R[d] = o;
}
console.log(t(), JSON.stringify(R, null, 1).slice(0, 9000));
fs.writeFileSync(path.join(EV, 'S5-probe-fields.json'), JSON.stringify(R, null, 1));
await done(browser);
