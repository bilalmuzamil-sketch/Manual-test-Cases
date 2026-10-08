/** Shifts: make a whole-work-order shift, find how the Schedule reads shifts back, and see the clear-shifts prompt. */
import { open, done, APP } from './session.mts';
import { api, seedCase } from './data.mts';
import { staffRows } from './staff.mts';
import { t, shot, display, tab, search, toColumn } from './wob.mts';
const { browser, page: p } = await open('/workorders');
const a = api(p);
const ES = (await staffRows(a, 'zz.wob.esther.howard@staging.shopview.local'))[0];
const [w] = await seedCase(a, 'ZZAUTOTEST F1 Shift Probe', 'ZZF4SP', [{ lead: ES.staff_id }]);
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
const r = await a.post('/api/schedule/shifts', { workOrderId: w.id, lineIds: [], staffId: ES.staff_id, startDate: tomorrow, startTime: '08:00', spreadMode: 'single', totalMinutes: 240, perDayMinutes: 240, isAllDay: false });
console.log(t(), 'create', r.status, JSON.stringify(r.body).slice(0, 400));
const gets: string[] = []; p.on('request', (q) => { if (q.method() === 'GET' && /\/api\/(schedule|shift)/.test(q.url())) gets.push(q.url().replace(/^https:\/\/[^/]+/, '').slice(0, 200)); });
await p.goto(APP + '/schedule', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
console.log(t(), 'schedule GETs', JSON.stringify([...new Set(gets)].slice(0, 10)));
for (const g of [...new Set(gets)].slice(0, 3)) { const x = await a.get(g.replace(/^\/api/, '/api')); console.log(t(), g.slice(0, 80), x.status, JSON.stringify(x.body).slice(0, 500)); }
await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await tab(p, 'All'); await display(p, 'Board View'); await search(p, 'ZZAUTOTEST F1 Shift Probe'); await toColumn(p, ES.staff_id);
const card = p.locator(`[data-test-id="board_card_${w.id}"]`); await card.hover(); await card.locator('[data-test-id="button_work_order_more_actions"]').click(); await p.waitForTimeout(800);
await p.locator('.q-menu .q-item').filter({ hasText: 'Reassign lead technician' }).first().click(); await p.waitForTimeout(1200);
await p.locator('[data-test-id="option_lead_technician_unassigned"]').click(); await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click(); await p.waitForTimeout(1500);
const d = p.locator('.q-dialog').filter({ hasText: /scheduled shifts/i }).last();
console.log(t(), 'prompt', await d.count(), (await d.innerText().catch(() => '')).replace(/\s+/g, ' '));
console.log(t(), 'prompt ids', JSON.stringify(await d.evaluate((e) => [...e.querySelectorAll('[data-test-id]')].map((x) => x.getAttribute('data-test-id'))).catch(() => null)));
await shot(p, 'probe-shift-prompt');
await d.locator('button').filter({ hasText: 'Cancel' }).first().click().catch(() => {}); await p.waitForTimeout(1000);
await done(browser);
