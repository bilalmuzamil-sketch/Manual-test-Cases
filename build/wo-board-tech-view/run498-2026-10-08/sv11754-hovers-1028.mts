/** sv11754-hovers-1028.mts — 28 Oct 2026: copy of c590114-hovers-1026.mts for QA branch sv11754 (SV-11754), data of design-stg5 run "Cell Styles 29081". Original header: sv11754-hovers-1028.mts — 26 Oct 2026, QA branch sv11500. C590114 steps 5, 6 and 9, never observed before (15/17 Oct: script faults):
 *  work orders of design-stg5's run ("ZZAUTOTEST DC05 Cell Styles 29081": S11754-17580 Approved led by Eva (photo), S11754-17581 Invoiced).
 *  Puts Technician-B (Finn) on S11754-17580's line next to Eva, then in Tech View reads the Assigned Techs avatars (order, photo vs initials,
 *  overlap), hovers the first avatar's centre (name bubble + where), hovers the padlock after S11754-17581 (styled tooltip / title).
 *  Positive control: hovering the group header count shows its tooltip. Pictures EV/C590114-h-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { api, workOrders } from './data.mts'; import { EV, t, display, tab, search, expandSmallGroups, findRow } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p); const o: any = {};
const Q = 'ZZAUTOTEST DC05 Cell Styles 29081';
const ws = await workOrders(a, Q); const w1 = ws.find((x: any) => x.number === 'S11754-17580'), w2 = ws.find((x: any) => x.number === 'S11754-17581'); o.wos = [w1?.id, w2?.id];
const { staffRows } = await import('./staff.mts'); const T = [...(await staffRows(a, 'DC05'))].map((x: any) => ({ id: x.staff_id, name: `${x.first_name} ${x.last_name}` }));
const eva = T.find((x: any) => /DC05 Eva Cells/.test(x.name)), finn = T.find((x: any) => /DC05 Finn Cells/.test(x.name)); o.techs = [eva?.name, finn?.name];
const ls = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get(`/api/work-orders/lines/${w1.id}`)).body?.data); o.lines = ls.length;
o.lineTechs = (await a.put(`/api/work-orders/lines/${ls[0].line_id}/technicians`, { staffIds: [eva.id, finn.id] })).status;
await p.setViewportSize({ width: 1440, height: 900 }); await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All'); await display(p, 'Tech View'); await search(p, Q); await p.waitForTimeout(3500); await expandSmallGroups(p).catch(() => {}); o.find1 = await findRow(p, w1.id).catch((e: any) => String(e).slice(0, 100)); await p.waitForTimeout(1500);
const ut = p.locator('[data-test-id="button_tech_view_group_toggle_unassigned"]');
const tips = () => p.evaluate(`[...document.querySelectorAll('.q-tooltip, [role=tooltip]')].filter(e => e.getBoundingClientRect().width > 0).map(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { text: e.innerText.trim(), box: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], bottom: Math.round(r.bottom), bg: cs.backgroundColor, color: cs.color }; })`) as Promise<any[]>;
// step 5: the Assigned Techs cell of S11754-17580
const cell = await p.evaluate(`(() => { const row = document.querySelector('[data-test-id="tech_view_row_${w1.id}"]'); if (!row) return null; const ths = [...document.querySelectorAll('thead th')]; const i = ths.findIndex(th => /Assigned Techs/i.test(th.innerText));
  const td = i >= 0 ? row.cells[i] : null; if (!td) return { heads: ths.map(h => h.innerText.trim()) }; td.scrollIntoView({ block: 'center', inline: 'center' });
  const av = [...td.querySelectorAll('img, .q-avatar, [class*=avatar]')].filter(e => e.getBoundingClientRect().width > 8).map(e => { const r = e.getBoundingClientRect(); return { tag: e.tagName, cls: (e.getAttribute('class') || '').slice(0, 50), text: (e.innerText || '').trim(), img: e.tagName === 'IMG' || !!e.querySelector('img'), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), title: e.getAttribute('title') || (e.closest('[title]') || {}).getAttribute?.('title') || null }; });
  return { avatars: av }; })()`) as any; o.s5 = cell;
await p.waitForTimeout(800);
const cell2 = await p.evaluate(`(() => { const row = document.querySelector('[data-test-id="tech_view_row_${w1.id}"]'); if (!row) return []; const ths = [...document.querySelectorAll('thead th')]; const i = ths.findIndex(th => /Assigned Techs/i.test(th.innerText)); const td = row.cells[i]; if (!td) return [];
  const av = [...td.querySelectorAll('.q-avatar')].filter(e => e.getBoundingClientRect().width > 8).map(e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, img: !!e.querySelector('img'), text: (e.innerText || '').trim() }; }); return av; })()`) as any[];
o.s5_qavatars = cell2; await p.screenshot({ path: path.join(EV, 'C590114-h-s5-assigned.png') });
if (cell2?.length) { const f = cell2[0]; await p.mouse.move(5, 5); await p.waitForTimeout(500); await p.mouse.move(f.x + f.w / 2, f.y + f.h / 2, { steps: 5 }); await p.waitForTimeout(1500);
  o.s6 = { tips: await tips(), avatarTop: Math.round(f.y), under: await p.evaluate(`(() => { const e = document.elementFromPoint(${f.x + f.w / 2}, ${f.y + f.h / 2}); return e ? (e.tagName + ' ' + (e.getAttribute('class') || '').slice(0, 40) + ' title=' + (e.getAttribute('title') || (e.closest('[title]') || {}).getAttribute?.('title') || '')) : null; })()`) };
  await p.screenshot({ path: path.join(EV, 'C590114-h-s6-avatar-hover.png') }); }
// step 9: padlock after S11754-17581
o.find2 = await findRow(p, w2.id).catch((e: any) => String(e).slice(0, 100)); await p.waitForTimeout(1200);
const lock = await p.evaluate(`(() => { const row = document.querySelector('[data-test-id="tech_view_row_${w2.id}"]'); if (!row) return null; const l = row.querySelector('[data-test-id*=lock], [class*=lock], svg[data-icon=lock]'); if (!l) return { found: false }; l.scrollIntoView({ block: 'center' }); const r = l.getBoundingClientRect(); return { found: true, x: r.x, y: r.y, w: r.width, h: r.height, title: l.getAttribute('title') || (l.closest('[title]') || {}).getAttribute?.('title') || null, aria: l.getAttribute('aria-label') }; })()`) as any;
o.s9_lock = lock;
if (lock?.found) { await p.waitForTimeout(500); const l2 = await p.evaluate(`(() => { const l = document.querySelector('[data-test-id="tech_view_row_${w2.id}"]').querySelector('[data-test-id*=lock], [class*=lock], svg[data-icon=lock]'); const r = l.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; })()`) as any;
  await p.mouse.move(5, 5); await p.waitForTimeout(500); await p.mouse.move(l2.x + l2.w / 2, l2.y + l2.h / 2, { steps: 5 }); await p.waitForTimeout(1500);
  o.s9 = { tips: await tips(), lockTop: Math.round(l2.y), under: await p.evaluate(`(() => { const e = document.elementFromPoint(${l2.x + l2.w / 2}, ${l2.y + l2.h / 2}); return e ? (e.tagName + ' ' + (e.getAttribute('class') || '').slice(0, 40) + ' title=' + (e.getAttribute('title') || (e.closest('[title]') || {}).getAttribute?.('title') || '')) : null; })()`) };
  await p.screenshot({ path: path.join(EV, 'C590114-h-s9-lock-hover.png') }); }
// positive control: a group header count shows its tooltip with the same hover method
const cnt = await p.evaluate(`(() => { const e = [...document.querySelectorAll('[data-test-id^="tech_view_group_count_"]')].find(x => x.getBoundingClientRect().top > 150 && +x.textContent.trim() > 0); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; })()`) as any;
if (cnt) { await p.mouse.move(5, 5); await p.waitForTimeout(500); await p.mouse.move(cnt.x + cnt.w / 2, cnt.y + cnt.h / 2, { steps: 5 }); await p.waitForTimeout(1500); o.control = await tips(); }
fs.writeFileSync(path.join(EV, 'sv11754-hovers-1028.json'), JSON.stringify(o, null, 1)); console.log(t(), 'HOVERS', JSON.stringify(o).slice(0, 4000)); await done(browser);
