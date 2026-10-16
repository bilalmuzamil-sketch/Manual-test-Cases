/** C590131 on STAGING in the QA lead's cleaner second company (Analyst 1, analyst.mts), 16 Oct 2026 (batch 40).
 *  Why: in company A Unassigned holds ~3,534 work orders and loads them in batches; reaching its end starts the next batch, which pushes
 *  the next group away, so steps 4–5 (the hand-over) were never reached (L0402). The case needs only: Unassigned holds more work orders
 *  than fit on the screen, and at least one technician group with work orders comes after it; filters empty, Search empty, density
 *  Regular, window 1440 px. Company B is seeded to exactly that: Unassigned topped up to 30 Estimates (customer "ZZAUTOTEST DC22 Sticky
^ *  Headers OrgB"), and 23 work orders led by a technician (first try with 3: the table then ended before the next header could reach Unassigned's) of that company, so all Unassigned rows are loaded at once and the end of the
 *  group can be scrolled to like a person does. Analyst 1's saved Work Orders choices are cleared for the test and put back after.
 *  Steps: All tab > Tech View; scroll slowly through Unassigned (step 2-3: column headings and Unassigned header read + picture); keep
 *  scrolling in 20 px steps until the next group's header reaches the Unassigned header and past it (steps 4-5: every group header
 *  drawn, its box and position, and which header sits just under the headings, at each step; pictures). json EV/C590131-orgb.json. */
import fs from 'node:fs'; import path from 'node:path';
import { analystBrowser } from './analyst.mts'; import { customer, workOrder } from './data.mts'; import { EV, t, tab, display } from './wob.mts';
const A = await analystBrowser('/workorders?tab=all', 1440, 900); const p = A.page, a = A.api; const o: any = { info: A.info };
const shot = (n: string) => p.screenshot({ path: path.join(EV, `C590131-orgb-${n}.png`) }).catch(() => {});
const PREF = '/api/users/me/preferences/work-orders-list'; const ORIGINAL = (await a.get(PREF)).body?.data?.value ?? {};
const groupsNow = () => p.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_group_count_"]')].map(c => { const id = c.getAttribute('data-test-id').replace('tech_view_group_count_', ''); const n = document.querySelector('[data-test-id="tech_view_group_name_' + id + '"]'); return { id, name: n ? n.textContent.trim() : id, count: +c.textContent.trim() }; })`) as Promise<any[]>;
const W = (ms: number) => p.waitForTimeout(ms);
/** every group header drawn, the bottom of the heading cells, and the header just under them */
const hdrs = () => p.evaluate(`(() => { const th = document.querySelector('thead th'); const hb = th ? Math.round(th.getBoundingClientRect().bottom) : null;
  const H = [...document.querySelectorAll('.tech-view-group-header')].map(d => { const r = d.getBoundingClientRect(); return { text: (d.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 30), top: Math.round(r.top), bottom: Math.round(r.bottom), position: getComputedStyle(d).position, stickyTop: getComputedStyle(d).top }; }).filter(h => h.bottom > 120 && h.top < 900);
  const under = hb ? document.elementsFromPoint(400, hb + 8).map(e => e.closest && e.closest('.tech-view-group-header')).filter(Boolean)[0] : null;
  const s = document.querySelector('.q-table__middle'); return { headingBottom: hb, headers: H, justUnderHeadings: under ? under.innerText.replace(/\\s+/g, ' ').trim().slice(0, 30) : 'a work order row', scrollTop: s ? Math.round(s.scrollTop) : null, scrollH: s ? s.scrollHeight : null }; })()`) as Promise<any>;
try {
  // clean slate for the case (Analyst 1's own choices, restored at the end)
  const v: any = {}; for (const [k, x] of Object.entries(ORIGINAL)) if (!/^(techViewColumns|boardFields|technicianOrder)$|collaps/i.test(k)) v[k] = x;
  o.prefClear = (await a.put(PREF, { value: { ...v, filters: {}, density: 'regular', pinnedTechnicianIds: [], collapsedGroups: [], search: '' } })).status;
  await p.goto(A.APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Tech View'); await W(3000);
  o.groupsBefore = await groupsNow();
  // seed: Unassigned to 30, and 3 work orders led by a technician of this company (named in the result)
  const cands = ((await a.get('/api/work-orders/lead-technician-candidates')).body?.data?.technicians ?? []) as any[]; const T = cands.find((x) => /Test B2/.test(`${x.firstName} ${x.lastName}`)) ?? cands[0]; o.tech = T ? `${T.firstName} ${T.lastName}` : null;
  const un = (o.groupsBefore.find((g: any) => /unassigned/i.test(g.id) || /Unassigned/.test(g.name))?.count) ?? 0; const need = Math.max(0, 30 - un); const c = await customer(a, 'ZZAUTOTEST DC22 Sticky Headers OrgB', 'ZZDC22');
  o.made = { unassigned: 0, led: 0, errors: [] as string[] };
  for (let i = 0; i < need; i++) { try { await workOrder(a, c, 'estimate', null); o.made.unassigned++; } catch (e: any) { o.made.errors.push(String(e).slice(0, 100)); break; } }
  const tg = o.groupsBefore.find((g: any) => g.name === o.tech); for (let i = (tg?.count ?? 0); i < 23 && T; i++) { try { await workOrder(a, c, 'approved', T.staffId); o.made.led++; } catch (e: any) { o.made.errors.push(String(e).slice(0, 100)); break; } }
  await p.goto(A.APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Tech View'); await W(4000);
  o.groups = await groupsNow(); o.searchEmpty = await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => 'no box shown'); o.chips = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="filter_chip_"]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim())`);
  o.unassignedExpanded = await p.locator('[data-test-id="tech_view_group_unassigned"][data-collapsed="false"]').count(); if (!o.unassignedExpanded && await p.locator('[data-test-id="button_tech_view_group_toggle_unassigned"]').count()) { await p.locator('[data-test-id="button_tech_view_group_toggle_unassigned"]').click(); await W(1500); o.expandedByScript = true; }
  o.s1 = await hdrs(); await shot('s1-techview');
  // step 2-3: scroll slowly down through Unassigned, well past its first screen
  for (let i = 0; i < 6; i++) { await p.mouse.move(700, 500); await p.mouse.wheel(0, 150); await W(400); }
  await W(1200); o.s3 = await hdrs(); await shot('s3-scrolled');
  // steps 4-5: keep scrolling in small steps until the next group's header reaches and passes the Unassigned header
  // 16 Oct 2026 (third go): the Unassigned header's text starts with its icon names ("expand_more person Unassigned"), so match by
  // "includes"; walk in 10 px steps once the next header is within 120 px of the Unassigned header, photographing every step there.
  o.walk = []; let reached = -1; let n = 0;
  for (let k = 0; k < 200; k++) { const r: any = await hdrs(); r.k = k; const heads = r.headers as any[]; const unH = heads.find((h) => h.text.includes('Unassigned') && h.top <= r.headingBottom + 2);
    const nxt = heads.filter((h) => !h.text.includes('Unassigned') && h.position === 'sticky').sort((x, y) => x.top - y.top)[0];
    r.gap = nxt ? nxt.top - (r.headingBottom + 44) : null; o.walk.push(r);
    const near = r.gap !== null && r.gap <= 120; if (near && reached < 0) reached = k;
    if (reached >= 0) { n++; await shot(`s45-step${String(n).padStart(2, '0')}`); r.picture = `C590131-orgb-s45-step${String(n).padStart(2, '0')}.png`; }
    if (reached >= 0 && n >= 26) break;
    await p.mouse.wheel(0, reached >= 0 ? 10 : 30); await W(500); }
  await p.mouse.wheel(0, 120); await W(1200); o.s5 = await hdrs(); await shot('s5-after-handover');
  o.walkSummary = o.walk.filter((r: any) => r.picture).map((r: any) => `${r.picture}: under=${r.justUnderHeadings} heads=${r.headers.map((h: any) => `${h.text.replace(/drag_indicator|expand_more|person/g, '').trim()}@${h.top}-${h.bottom}/${h.position}`).join(',')}`);
  await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) s.scrollTop = 0; })()`);
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot('error'); }
finally { o.prefRestore = (await a.put(PREF, { value: ORIGINAL })).status; fs.writeFileSync(path.join(EV, 'C590131-orgb.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C590131-ORGB', JSON.stringify({ ...o, walk: undefined }).slice(0, 6000)); await A.browser.close(); process.exit(0); }
