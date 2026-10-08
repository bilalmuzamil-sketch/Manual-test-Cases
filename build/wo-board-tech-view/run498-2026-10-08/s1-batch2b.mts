/**
 * S1 batch 2, second measurement (2026-10-08). The first reader missed rows because Tech View draws only
 * the rows on screen and starts the Unassigned group COLLAPSED (data-collapsed="true", 1098 work orders),
 * and because a tab click clears the page search. So: search is typed AFTER every tab click, and every
 * collapsed Tech View group with a small count is expanded before reading. Each number is read with the
 * group (Tech View) or column (Board View) it sits in.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { api } from './data.mts';

const here = path.dirname(new URL(import.meta.url).pathname);
const EV = path.join(here, 'evidence');
const t = () => new Date().toISOString().slice(11, 19);
const { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = {};
const shot = (n: string) => p.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
const display = async (l: string) => { await p.locator(`[aria-label="${l}"]`).first().click(); await p.waitForTimeout(3000); };
const tab = async (name: string) => { await p.locator('.q-tab, [role=tab]').filter({ hasText: new RegExp('^\\s*' + name + '\\s*$') }).first().click(); await p.waitForTimeout(2500); };
async function search(q: string) {
  const box = p.locator('[data-test-id="page_search_input"]');
  if (!(await box.isVisible().catch(() => false))) { await p.locator('[data-test-id="page_search_toggle"]').click(); await p.waitForTimeout(600); }
  await box.fill(q); await p.waitForTimeout(4000);
}
const assignedToMe = () => p.locator('button:has-text("Assigned to me"), .q-btn:has-text("Assigned to me")').first();
async function expandSmallGroups() {
  for (let i = 0; i < 60; i++) {
    const id = await p.evaluate(`(() => { const g = [...document.querySelectorAll('[data-test-id^="tech_view_group_"][data-collapsed="true"]')].find(r => { const id = r.getAttribute('data-test-id').replace('tech_view_group_', ''); const c = document.querySelector('[data-test-id="tech_view_group_count_' + id + '"]'); const n = c ? +c.textContent.trim() : 0; return n > 0 && n <= 50 && !r.dataset.zzTried; }); if (!g) return null; g.dataset.zzTried = '1'; return g.getAttribute('data-test-id').replace('tech_view_group_', ''); })()`);
    if (!id) return;
    await p.locator(`[data-test-id="button_tech_view_group_toggle_${id}"]`).click().catch(() => {}); await p.waitForTimeout(1200);
  }
}
/** {number: where it sits} for every work order number on the page */
async function read(d: string): Promise<Record<string, string>> {
  if (d === 'Tech View') await expandSmallGroups();
  return p.evaluate(`(() => {
    const out = {}; const re = /\\bS\\d+-\\d+\\b/g;
    if (${JSON.stringify(d)} === 'Tech View') {
      let g = '?';
      for (const tr of document.querySelectorAll('.q-virtual-scroll__content > tr')) {
        const tid = tr.getAttribute('data-test-id') || '';
        if (tid.startsWith('tech_view_group_')) { const n = tr.querySelector('[data-test-id^="tech_view_group_name_"]'); g = n ? n.textContent.trim() : tid; continue; }
        for (const m of (tr.innerText.match(re) || [])) out[m] = g;
      }
      return out;
    }
    const m = document.querySelector('main, .q-page') || document.body;
    const walker = document.createTreeWalker(m, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      for (const n of (walker.currentNode.textContent.match(re) || [])) {
        let e = walker.currentNode.parentElement, where = '';
        while (e && !where) { const id = e.getAttribute && e.getAttribute('data-test-id'); if (id && /column|lane|group/i.test(id)) where = id; e = e.parentElement; }
        out[n] = where || 'list';
      }
    }
    return out;
  })()`) as any;
}
const raw = (await a.get('/api/work-orders/lead-technician-candidates')).body?.data?.technicians ?? [];
const other = raw.find((x: any) => `${x.firstName} ${x.lastName}` === 'Ayesha Khan');

// ── C96913 again: tab by tab, search typed after each tab click ─────────
try {
  R.C96913 = {};
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3500);
  for (const d of ['List', 'Tech View', 'Board View']) {
    await display(d); R.C96913[d] = {};
    for (const tb of ['All', 'Work Orders', 'Estimates', 'Completed']) { await tab(tb); await search('ZZAUTOTEST F1 Tabs'); R.C96913[d][tb] = await read(d); await shot(`C96913-${d.replace(' ', '')}-${tb.replace(' ', '')}`); }
  }
} catch (e: any) { R.C96913.error = String(e?.message || e).slice(0, 300); await shot('C96913-error'); }
console.log(t(), 'C96913', JSON.stringify(R.C96913));

// ── C154884 again: (i) as the setup leaves it, (ii) with [WO-3]/[WO-4] given another service advisor ─
async function mine(label: string) {
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3500);
  await display('List'); await tab('All'); await search('ZZAUTOTEST F1 Assigned To Me');
  const before = await read('List');
  if ((await assignedToMe().getAttribute('aria-pressed')) !== 'true') { await assignedToMe().click(); await p.waitForTimeout(3000); }
  const o: any = { allBefore: Object.keys(before).sort(), pressed: await assignedToMe().getAttribute('aria-pressed') };
  for (const d of ['List', 'Tech View', 'Board View']) { await display(d); o[d] = await read(d); await shot(`C154884-${label}-${d.replace(' ', '')}`); }
  await display('List'); await assignedToMe().click(); await p.waitForTimeout(1500);
  return o;
}
try {
  R.C154884 = { asSetUp: await mine('asSetUp') };
  const list = (await a.get(`/api/work-orders?pagination[rowsPerPage]=50&search=${encodeURIComponent('ZZAUTOTEST F1 Assigned To Me')}`)).body?.data?.work_orders ?? [];
  R.C154884.changes = [];
  for (const w of list.filter((w: any) => w.number === 'S10043-17602' || w.number === 'S10043-17603')) {
    for (const body of [{ work_order_id: w.id, service_advisor_id: other?.userId }, { work_order_id: w.id, service_advisor_id: other?.staffId }, { id: w.id, service_advisor_id: other?.userId }]) {
      const r = await a.post('/api/work-orders/change-service-advisor', body);
      R.C154884.changes.push({ n: w.number, keys: Object.keys(body).join(','), status: r.status, body: JSON.stringify(r.body).slice(0, 160) });
      if (r.status < 300) break;
    }
  }
  const back = (await a.get(`/api/work-orders?pagination[rowsPerPage]=50&search=${encodeURIComponent('ZZAUTOTEST F1 Assigned To Me')}`)).body?.data?.work_orders ?? [];
  R.C154884.readBack = back.map((w: any) => `${w.number} lead=${w.techAssignedFirstName ?? '-'} ${w.techAssignedLastName ?? ''} advisor=${w.serviceAdvisorFirstName} ${w.serviceAdvisorLastName}`);
  R.C154884.otherAdvisor = mineAdvisor(back);
  R.C154884.advisorOther = await mine('advisorOther');
} catch (e: any) { R.C154884.error = String(e?.message || e).slice(0, 300); await shot('C154884-error'); }
function mineAdvisor(b: any[]) { return b.filter((w) => w.serviceAdvisorFirstName !== 'Admin').map((w) => w.number); }
console.log(t(), 'C154884', JSON.stringify(R.C154884));
fs.writeFileSync(path.join(EV, 's1-batch2b.json'), JSON.stringify(R, null, 1));
await done(browser);
