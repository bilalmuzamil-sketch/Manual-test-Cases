/**
 * D3 pictures (2026-10-09, run with WOB_SCALE=2 WOB_EV=defect-drafts/raw): the technician's OWN screen ("Assigned to me")
 * shows exactly her three work orders, so the List, Tech View and Board View can be photographed side by side.
 * Carol Neal leads only the three ZZAUTOTEST customers made for C96929 (Zeta Hauling, then Alpha Freight, then Mid Trucking).
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, candidates } from './data.mts';
import { EV, t, shot, display, tab, toColumn, groups } from './wob.mts';
import { staffRows } from './staff.mts';
import { viewAs } from './viewas.mts';
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; const a = api(p);
const me = (await candidates(a)).find((x) => x.name === 'Admin ShopView')!;
const carol = (await staffRows(a, 'Carol')).concat(await staffRows(a, 'Neal')).find((r: any) => `${r.first_name} ${r.last_name}` === 'Carol Neal');
const o: any = { carol: !!carol };
const v = await viewAs(browser, p, a, carol.id, me.id, RUN.toRunner); const pg = v.page;
try {
  await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000); await tab(pg, 'All'); await display(pg, 'List');
  const am = pg.locator('button:has-text("Assigned to me")').first(); if ((await am.getAttribute('aria-pressed')) !== 'true') { await am.click(); await pg.waitForTimeout(3500); }
  const heads = await pg.evaluate(`[...document.querySelectorAll('thead th')].map(e => e.innerText.replace('arrow_drop_up','').trim())`) as string[];
  o.list = await pg.evaluate(`[...document.querySelectorAll('tbody tr')].filter(r => r.getBoundingClientRect().height > 0).map(r => r.cells[${heads.indexOf('Customer')}]?.innerText.trim())`); await shot(pg, 'D3-list');
  await display(pg, 'Tech View'); await pg.waitForTimeout(3000); const g = (await groups(pg)).find((x: any) => x.id === carol.staff_id); o.tech = g?.rows ?? null;
  o.techCustomers = await pg.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_row_"]')].map(r => r.innerText.split('\\n').find(x => /ZZAUTOTEST/.test(x)) || r.innerText.slice(0, 60))`); await shot(pg, 'D3-tech');
  await display(pg, 'Board View'); await pg.waitForTimeout(3000); await toColumn(pg, carol.staff_id).catch(() => {});
  o.board = await pg.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_column_${carol.staff_id}"]'); return c ? [...c.querySelectorAll('[data-test-id^="board_card_"]')].filter(e => /^board_card_[0-9a-f-]{36}$/.test(e.getAttribute('data-test-id'))).map(e => (e.innerText.split('\\n').find(x => /ZZAUTOTEST/.test(x)) || '').trim()) : null; })()`); await shot(pg, 'D3-board');
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot(pg, 'D3-error'); }
finally { await v.close(); }
console.log(t(), 'D3', JSON.stringify(o)); fs.writeFileSync(path.join(EV, 'd3-pics.json'), JSON.stringify(o, null, 1));
await RUN.end(); await done(browser);
