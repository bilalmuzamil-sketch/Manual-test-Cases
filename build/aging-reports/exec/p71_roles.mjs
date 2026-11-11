// p71_roles.mjs — 11 Nov 2026: build the seven roles the permission tests need, on screen (Settings > Roles & Permissions > Create Custom Role >
// "Choose a template" Skip > Role Name > switches/ticks > Create > "Create Anyway" if "Similar role already exists"). Each card ("Work orders",
// "Invoicing & payments", "Customers", ...) has View / Create & Edit / Delete tick boxes in its header row (p70 picture); Part sales and Vendor
// and order management sit under the "Parts Department" switch. Records every create request body and a picture per role. Skips a role that
// already exists by name. Output p71/out.json (names -> ids, the permissions sent).
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import fs from 'fs';
const OUT = new URL('./p71/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/administration/roles-permissions'); const p = s.page; const a = mk(p); const o = { roles: {}, reqs: [] };
p.on('request', (r) => { if (r.method() !== 'GET' && /roles|permission/i.test(r.url())) o.reqs.push({ u: r.url().replace(/^https:\/\/[^/]+/, ''), b: (r.postData() || '').slice(0, 4000) }); });
const save = () => fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1));
const ROLES = {
  'ZZAUTOTEST P71 Reports only': [],
  'ZZAUTOTEST P71 Inv+WO view': [['Invoicing & payments', 0], ['Work orders', 0]],
  'ZZAUTOTEST P71 WO+PartSales view': [['Work orders', 0], ['PARTS'], ['Part sales', 0]],
  'ZZAUTOTEST P71 Inv+PartSales view': [['Invoicing & payments', 0], ['PARTS'], ['Part sales', 0]],
  'ZZAUTOTEST P71 VOM view': [['PARTS'], ['Vendor and order management', 0]],
  'ZZAUTOTEST P71 VOM create-edit': [['PARTS'], ['Vendor and order management', 1]],
  'ZZAUTOTEST P71 Customers view': [['Customers', 0]],
};
const card = (title) => p.locator('div').filter({ has: p.getByText(title, { exact: true }) }).filter({ has: p.locator('.q-checkbox, [role=checkbox]') }).last();
async function tick(title, col, r) { const c = card(title); await c.scrollIntoViewIfNeeded().catch(() => {}); const boxes = c.locator('.q-checkbox, [role=checkbox]'); r.log.push([title, col, await boxes.count()]); const b = boxes.nth(col); const before = await b.getAttribute('aria-checked'); await b.click(); await p.waitForTimeout(700); /* 11 Nov 15:55: Invoicing & payments / Part sales View ask "Enable See Financial Data?" first (p71 picture 04) - press Enable */ const en = p.locator('.q-dialog').getByRole('button', { name: /^Enable$/ }); if (await en.count()) { r.log.push([title, 'financial-dialog']); await en.first().click(); await p.waitForTimeout(800); } r.log.push([title, col, before, await b.getAttribute('aria-checked')]); }
async function partsOn(r) { const lab = p.getByText('Parts Department', { exact: true }).first(); await lab.scrollIntoViewIfNeeded().catch(() => {}); const sw = lab.locator('xpath=ancestor::*[.//*[@role="switch" or contains(@class,"q-toggle")]][1]').locator('[role=switch], .q-toggle').first(); const before = await sw.getAttribute('aria-checked'); if (before !== 'true') await sw.click(); await p.waitForTimeout(800); r.log.push(['Parts Department', before, await sw.getAttribute('aria-checked')]); }
try { await p.waitForTimeout(3000);
  for (const [name, steps] of Object.entries(ROLES)) { const r = (o.roles[name] = { log: [] });
    try { await s.go('/administration/roles-permissions'); await p.waitForTimeout(3000); if (await p.locator('tr', { hasText: name }).count()) { r.existed = true; continue; }
      await p.getByRole('button', { name: /Create Custom Role/i }).click(); await p.waitForTimeout(1500); await p.locator('.q-dialog').last().getByRole('button', { name: /^Skip$/i }).click(); await p.waitForTimeout(2500);
      const nm = p.getByLabel(/Role Name/i).first(); await nm.click(); await nm.type(name); await p.keyboard.press('Tab');
      const desc = p.getByText('Performance statistics, labor/parts/total reports, and analytics', { exact: true }).first(); await desc.scrollIntoViewIfNeeded();
      const tg = desc.locator('xpath=ancestor::*[.//*[@role="switch" or contains(@class,"q-toggle")]][1]').locator('[role=switch], .q-toggle').first(); await tg.click(); await p.waitForTimeout(500); r.reports = await tg.getAttribute('aria-checked');
      for (const st of steps) { if (st[0] === 'PARTS') await partsOn(r); else await tick(st[0], st[1], r); }
      r.financial = await p.getByText(/See Financial Data/i).first().locator('xpath=ancestor::*[.//*[@role="switch" or contains(@class,"q-toggle")]][1]').locator('[role=switch], .q-toggle').first().getAttribute('aria-checked').catch(() => null);
      r.shot = await s.shot(name.replace(/\W+/g, '-') + '-filled'); const n0 = o.reqs.length;
      await p.getByRole('button', { name: /^Create$/ }).last().click(); await p.waitForTimeout(2500);
      const any = p.locator('.q-dialog').last().getByRole('button', { name: /Create Anyway/i }); if (await any.count()) { r.similar = (await p.locator('.q-dialog').last().innerText()).replace(/\s+/g, ' ').slice(0, 200); await any.click(); await p.waitForTimeout(3000); }
      r.reqs = o.reqs.slice(n0).map((x) => x.u + ' ' + x.b.slice(0, 1500)); r.after = await s.shot(name.replace(/\W+/g, '-') + '-created');
    } catch (e) { r.err = String(e).slice(0, 300); try { await s.shot(name.replace(/\W+/g, '-') + '-error'); await p.keyboard.press('Escape'); } catch {} } save(); }
  const roles = await a.get('/api/organizations/d55bc308-e61a-438d-b5f1-c7a73c89d49f/roles?pagination[rowsPerPage]=100'); o.list = (roles.j?.data?.collection || roles.j?.data || []).filter((r) => /P71/.test(r.name)).map((r) => ({ id: r.id, name: r.name }));
} catch (e) { o.err = String(e).slice(0, 300); }
save(); console.log('p71', JSON.stringify({ list: o.list, errs: Object.entries(o.roles).filter(([, r]) => r.err).map(([n, r]) => n + ': ' + r.err.slice(0, 100)) }).slice(0, 1500)); await s.close(); process.exit(0);
