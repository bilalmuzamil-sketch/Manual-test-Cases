/** c97020-admin-1026.mts — 26 Oct 2026, QA branch sv11545. C97020 steps 7–16 (the Admin's own browser), which retest-locks2.mts never had:
 *  the Invoiced work order S11545-17589 (lead ZZAUTOTEST C97020 Ana Alpha) seeded by that run. Keyboard only: Search box, Tab to a card,
 *  arrows to the Invoiced card, Tab to More actions, Enter, arrow to Reassign lead technician + Enter, Escape, Space + Shift+arrows,
 *  refresh, click the card, read Lead Technician. Pictures EV/C97020-a-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { api } from './data.mts'; import { EV, t, display, tab, search, boardCols } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p); const o: any = {};
const WO = '5e8f7ac8-2e5e-45cb-89a8-23e54d48b7c5', NUM = 'S11545-17589';
const focusOf = () => p.evaluate(`(() => { const e = document.activeElement; if (!e) return null; const card = e.closest('[data-test-id^="board_card_"]'); const num = card ? (card.querySelector('[data-test-id="board_card_number"]') || {}).textContent : null;
  return { id: e.getAttribute('data-test-id') || e.tagName, label: e.getAttribute('aria-label'), card: num ? num.trim() : null, inMenu: !!e.closest('.q-menu') }; })()`) as Promise<any>;
const items = () => p.evaluate(`[...document.querySelectorAll('.q-menu .q-item')].filter(e => e.getBoundingClientRect().width > 0).map(e => ({ text: e.innerText.replace(/\\s+/g, ' ').trim(), disabled: e.getAttribute('aria-disabled') === 'true' || e.classList.contains('disabled') || e.classList.contains('q-item--disabled') }))`) as Promise<any[]>;
const notes = () => p.evaluate(`[...document.querySelectorAll('.q-tooltip, .q-menu [class*=note], .q-menu .q-item__label--caption')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) as Promise<string[]>;
const colOf = async () => (await boardCols(p)).find((c) => c.cards.includes(NUM))?.name ?? null;
const lead = async () => { const w = (await a.get(`/api/work-orders/view/${WO}`)).body?.data?.work_order; return w ? `${w.tech_assigned_first_name ?? ''} ${w.tech_assigned_last_name ?? ''}`.trim() : null; };
const PREF = '/api/users/me/preferences/work-orders-list'; const PV = (await a.get(PREF)).body?.data?.value ?? {}; o.pinSet = (await a.put(PREF, { value: { ...PV, pinnedTechnicianIds: ['59b0b2e4-0c7c-43bf-b500-521a6864fe33', ...(PV.pinnedTechnicianIds ?? [])] } })).status;
const save = () => fs.writeFileSync(path.join(EV, 'c97020-admin-1026.json'), JSON.stringify(o, null, 1));
await p.setViewportSize({ width: 1440, height: 900 }); await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All'); await display(p, 'Board View'); await search(p, 'Keyboard Viewer'); await p.waitForTimeout(3000);
// (A) what do the arrow keys do from a focused card? (several cards on screen)
await p.locator('[data-test-id="page_search_input"]').first().click(); for (let i = 0; i < 25; i++) { await p.keyboard.press('Tab'); await p.waitForTimeout(200); if ((await focusOf()).card) break; }
o.arrows = { start: await focusOf(), cardsInColumn: (await boardCols(p)).find((c) => c.name === 'ZZAUTOTEST C97020 Ana Alpha')?.cards ?? null, keys: {} as any };
for (const k of ['ArrowDown', 'ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft']) { await p.keyboard.press(k); await p.waitForTimeout(400); (o.arrows.keys[k] ??= []).push((await focusOf())?.card ?? (await focusOf())?.id); }
// (B) only the Invoiced work order on screen
await search(p, NUM); await p.waitForTimeout(3000); o.onScreen = (await boardCols(p)).flatMap((c) => c.cards);
o.before = { col: await colOf(), lead: await lead() };
await p.locator('[data-test-id="page_search_input"]').first().click(); await p.waitForTimeout(400); o.s7 = await focusOf();
const stops: string[] = []; for (let i = 0; i < 25; i++) { await p.keyboard.press('Tab'); await p.waitForTimeout(250); const f = await focusOf(); stops.push(f.id); if (f.card) break; } o.s8 = { stops, focus: await focusOf() };
for (let i = 0; i < 6 && (await focusOf()).card !== NUM; i++) { await p.keyboard.press(i < 3 ? 'ArrowDown' : 'ArrowUp'); await p.waitForTimeout(300); } o.s9 = await focusOf(); await p.screenshot({ path: path.join(EV, 'C97020-a-s9-card-focus.png') });
await p.keyboard.press('Tab'); await p.waitForTimeout(500); o.s10 = await focusOf(); await p.screenshot({ path: path.join(EV, 'C97020-a-s10-button-focus.png') });
await p.keyboard.press('Enter'); await p.waitForTimeout(1200); o.s11 = { menus: await p.locator('.q-menu').count(), items: await items(), notes: await notes(), focus: await focusOf() }; await p.screenshot({ path: path.join(EV, 'C97020-a-s11-menu.png') });
for (let i = 0; i < 3 && !/lead technician/i.test(((await focusOf())?.label ?? '') + (await p.evaluate(`document.activeElement ? document.activeElement.innerText : ''`))); i++) { await p.keyboard.press('ArrowDown'); await p.waitForTimeout(300); }
o.s12_focusBefore = await focusOf(); o.s12_notes = await notes(); await p.screenshot({ path: path.join(EV, 'C97020-a-s12-item-focus.png') });
await p.keyboard.press('Enter'); await p.waitForTimeout(1500); o.s12 = { dialogs: await p.locator('.q-dialog').count(), menus: await p.locator('.q-menu').count() };
await p.keyboard.press('Escape'); await p.waitForTimeout(800); o.s13 = { menus: await p.locator('.q-menu').count(), focus: await focusOf() };
for (let i = 0; i < 2 && (await focusOf()).card !== NUM; i++) { await p.keyboard.press('Shift+Tab'); await p.waitForTimeout(300); }
o.s14 = { from: await focusOf(), keys: {} as any };
for (const k of ['Space', 'Shift+ArrowUp', 'Shift+ArrowDown', 'Shift+ArrowLeft', 'Shift+ArrowRight']) { await p.keyboard.press(k); await p.waitForTimeout(900); o.s14.keys[k] = { col: await colOf(), dialogs: await p.locator('.q-dialog').count() }; }
await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Board View').catch(() => {}); await search(p, NUM); await p.waitForTimeout(3000);
o.s15 = { col: await colOf() }; await p.screenshot({ path: path.join(EV, 'C97020-a-s15-after-refresh.png') });
save(); const cardL = p.locator(`[data-test-id="board_card_${WO}"]`).first(); if (await cardL.count()) { await cardL.click(); o.s16_route = 'clicked the card'; } else { await p.goto(APP + `/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded' }); o.s16_route = 'card not on screen; opened by address'; } await p.waitForTimeout(5000); o.s16 = { url: p.url(), leadText: (await p.locator('text=Lead Technician').first().locator('xpath=..').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 120), leadApi: await lead() };
await p.screenshot({ path: path.join(EV, 'C97020-a-s16-work-order.png') });
await a.put(PREF, { value: PV }); save(); console.log(t(), 'C97020A', JSON.stringify(o).slice(0, 4000)); await done(browser);
