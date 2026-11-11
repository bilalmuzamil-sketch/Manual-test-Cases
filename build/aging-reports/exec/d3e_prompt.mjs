// d3e_prompt.mjs — 11 Nov 2026 ~17:25: C715519/C715546 step 2 needs "the existing location-switch prompt" in a second tab for comparison. p65b showed
// that a Lethbridge work order address pasted at Heavy Duty gives "WorkOrder not found" + 400, no prompt. The developer's own checklist (SV-11597)
// names the form /workorders/<id>?locationId=<other>. Try that form, and the top search (work order number), while at Heavy Duty; picture any
// "Switch location?" dialog, read its text and button labels as displayed, then Cancel. Positive control: the report's own dialog (d3b C715519).
import { start } from './lib.mjs'; import { ensureLoc } from './locsw.mjs'; import fs from 'fs';
const OUT = new URL('./d3e/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/workorders'); const p = s.page; const o = {};
const LB = 'f8a8b802-7780-4b16-bf10-343caeb616b2'; const WO = '55ba8674-f50c-4395-a673-cc26a02c9e65';
const notes = async () => (await p.locator('.q-notification').allInnerTexts().catch(() => [])).map((t) => t.replace(/\s+/g, ' ').trim());
const dlg = async () => { const d = p.locator('.q-dialog').last(); if (!(await d.count())) return null; return { text: (await d.innerText()).split('\n').map((t) => t.trim()).filter(Boolean),
  buttons: await d.locator('button').evaluateAll((bs) => bs.map((b) => { const r = b.getBoundingClientRect(); return [b.innerText.replace(/\s+/g, ' ').trim(), Math.round(r.x), Math.round(r.y), Math.round(r.width)]; })),
  box: await d.locator('.q-card').first().boundingBox().catch(() => null) }; };
const shot = (n) => p.screenshot({ path: OUT + n + '.png' });
try { await p.setViewportSize({ width: 1440, height: 900 }); await p.waitForTimeout(2500); await ensureLoc(p, 'Staging Heavy Duty - 9919');
  for (const [tag, url] of [['a-locationId', `/workorders/${WO}?locationId=${LB}`], ['b-lines-locationId', `/workorders/${WO}/lines?locationId=${LB}`]]) {
    await p.goto(new URL(url, p.url()).href, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
    o[tag] = { url: p.url(), dialog: await dlg(), notes: await notes() }; await shot('1-' + tag);
    const c = p.locator('.q-dialog').last().getByRole('button', { name: /^Cancel$/ }); if (await c.count()) { await c.click(); await p.waitForTimeout(2500); o[tag].afterCancel = { url: p.url(), notes: await notes() }; await shot('2-' + tag + '-cancelled'); } }
  // top search: the work order number
  await p.goto(new URL('/workorders', p.url()).href); await p.waitForTimeout(3500); const box = p.locator('header input').first(); await box.click(); await box.fill('14144'); await p.waitForTimeout(3500); await shot('3-search');
  o.searchItems = (await p.locator('.q-menu:visible, [role=listbox]').innerText().catch(() => '')).split('\n').map((t) => t.trim()).filter(Boolean).slice(0, 20);
  const hit = p.locator('.q-menu:visible .q-item, [role=listbox] [role=option]').filter({ hasText: /14144/ }).first();
  if (await hit.count()) { await hit.click(); await p.waitForTimeout(5000); o.search = { url: p.url(), dialog: await dlg(), notes: await notes() }; await shot('4-search-clicked');
    const c = p.locator('.q-dialog').last().getByRole('button', { name: /^Cancel$/ }); if (await c.count()) { await c.click(); await p.waitForTimeout(2000); } }
} catch (e) { o.err = String(e).slice(0, 300); await shot('error').catch(() => {}); }
try { await ensureLoc(p, 'Staging Heavy Duty - 9919'); } catch {}
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('d3e', o.err || 'ok', JSON.stringify(o).slice(0, 900)); await s.close?.(); process.exit(0);
