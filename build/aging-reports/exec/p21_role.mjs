// p21_role.mjs — 11 Nov 2026: C715286 setup + run. Admin: Settings > Roles & Permissions > Create Custom Role > template Admin > Apply
// > Role Name > switch off "Reports" in Page Access > Create; Settings > Staff > "Tech ShopView" edit > Role = new role > Save.
// Tech (DEV MODE quick-login "Tech"): Reports top menu, left menu read; paste the A/R Summary and A/P Detail links.
// Admin again: put Tech ShopView back on the role it had. PHASE env: setup | tech | restore | all (default all). Output exec/p21/.
import { start, A } from './lib.mjs'; import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs'; import fs from 'fs';
const OUT = new URL('./p21/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true });
const PH = process.env.PHASE || 'all'; const ROLE = 'ZZAUTOTEST Aging no Reports'; const st = fs.existsSync(OUT + 'state.json') ? JSON.parse(fs.readFileSync(OUT + 'state.json')) : {};
const keep = () => fs.writeFileSync(OUT + 'state.json', JSON.stringify(st, null, 1));
const txt = (p) => p.evaluate(() => document.body.innerText.replace(/[ \t]+/g, ' ').slice(0, 6000));
async function setStaffRole(s, roleName, tag) {
  await s.go('/administration/staff'); await s.page.waitForTimeout(2500);
  const row = s.page.locator('tr', { hasText: 'Tech ShopView' }).first(); await s.shot(tag + '-staff');
  st[tag + '-row'] = (await row.innerText()).replace(/\s+/g, ' ');
  await row.locator('button, a').filter({ has: s.page.locator('i, svg') }).first().click(); await s.page.waitForTimeout(2000); await s.shot(tag + '-edit-open');
  const dlg = s.page.locator('.q-dialog, [role=dialog]').last(); const roleSel = dlg.getByLabel(/^Role/).first();
  st[tag + '-oldRole'] = await roleSel.inputValue().catch(() => null) || await dlg.locator('.q-field', { hasText: 'Role' }).first().innerText().catch(() => null);
  await dlg.locator('.q-field', { hasText: /^Role/ }).first().click(); await s.page.waitForTimeout(1200);
  await s.page.locator('.q-menu .q-item', { hasText: roleName }).first().click(); await s.page.waitForTimeout(800); await s.shot(tag + '-role-picked');
  await dlg.getByRole('button', { name: /Save/ }).first().click(); await s.page.waitForTimeout(3000); await s.shot(tag + '-saved'); st[tag + '-after'] = (await txt(s.page)).slice(0, 400); keep();
}
if (PH === 'setup' || PH === 'all') {
  const s = await start(OUT, '/administration/roles-permissions'); await s.page.waitForTimeout(2500);
  st.links = { ars: A + '/reports/ar-aging-summary', apd: A + '/reports/ap-aging-detail' };
  const existing = await s.page.locator('tr', { hasText: ROLE }).count(); st.roleExisted = existing;
  if (!existing) {
    await s.page.getByRole('button', { name: /Create Custom Role/i }).click(); await s.page.waitForTimeout(1500); await s.shot('01-template');
    await s.page.locator('.q-dialog, [role=dialog]').last().getByText('Admin', { exact: true }).first().click(); await s.page.waitForTimeout(500);
    await s.page.getByRole('button', { name: /^Apply$/ }).click(); await s.page.waitForTimeout(2500); await s.shot('02-form');
    const nm = s.page.getByLabel(/Role Name/i).first(); await nm.click(); await nm.type(ROLE); await s.page.keyboard.press('Tab');
    const card = s.page.locator('.q-card, section, div', { hasText: /^Page Access/ }).filter({ hasText: 'Reports' }).last();
    const rep = s.page.locator('.q-item, .row, label, div').filter({ hasText: /^Reports$/ }).locator('.q-toggle').first();
    st.reportsToggleCount = await rep.count(); if (st.reportsToggleCount) { st.reportsBefore = await rep.getAttribute('aria-checked'); await rep.click(); await s.page.waitForTimeout(600); st.reportsAfter = await rep.getAttribute('aria-checked'); }
    await rep.scrollIntoViewIfNeeded().catch(() => {}); await s.shot('03-reports-off');
    await s.page.getByRole('button', { name: /^Create$/ }).click(); await s.page.waitForTimeout(3000); await s.shot('04-created'); st.created = (await txt(s.page)).slice(0, 300);
  }
  keep(); await setStaffRole(s, ROLE, 'assign'); await s.close();
}
if (PH === 'tech' || PH === 'all') {
  const r = await boot('sv11315', '/', 'tech'); const p = r.page; await p.setViewportSize({ width: 1440, height: 900 }); await p.waitForTimeout(3000);
  st.techRole = r.role; st.techPerms = r.nFePerms; let k = 10; const shot = async (n) => { const f = `${OUT}/${++k}-tech-${n}.png`; await p.screenshot({ path: f }); return f; };
  await shot('home'); const top = p.getByRole('link', { name: /^Reports$/ }).or(p.locator('header a, nav a', { hasText: /^Reports$/ })).first();
  st.reportsTopMenu = await top.count(); st.homeText = (await txt(p)).slice(0, 1200);
  if (st.reportsTopMenu) { await top.click(); await p.waitForTimeout(3000); }
  await shot('reports-menu'); st.menuText = await txt(p); st.menuUrl = p.url();
  for (const [k2, u] of Object.entries(st.links)) { await p.goto(u, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(800); st[k2 + '-urlEarly'] = p.url(); await shot(k2 + '-early'); await p.waitForTimeout(3500); st[k2 + '-url'] = p.url(); st[k2 + '-text'] = (await txt(p)).slice(0, 1500); await shot(k2); }
  keep(); await Promise.race([r.browser.close(), new Promise((x) => setTimeout(x, 8000))]);
}
if (PH === 'restore' || PH === 'all') { const s = await start(OUT, '/administration/staff'); await setStaffRole(s, process.env.BACK || 'Technician', 'restore'); await s.close(); }
keep(); console.log(JSON.stringify(st).slice(0, 5000)); process.exit(0);
