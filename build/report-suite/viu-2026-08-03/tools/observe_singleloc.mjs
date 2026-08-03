// observe_singleloc.mjs — settles the HIGHEST-RISK spec-vs-ruling gap by observation:
// Chris Ward ruled the Location filter should be HIDDEN for a user with one location, while
// SBR S21-N1 / TU S9-N1 / IV S7-N1 / PV S2-E4 all still say the user "still sees the filter".
// Seeds a single-location reports user (Rule 14), then looks at all six reports as them.
// Also reads the WIP data rows properly (the grid is virtualised, so tbody tr is a spacer).
import fs from 'fs';
import { boot } from './boot8582.mjs';
import { APP, login, api } from './qa8582.mjs';

const OUT = new URL('../evidence/', import.meta.url).pathname;
const HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const SALES_REP = 'b176ec30-2def-49af-ab11-782c2f6bd503';
const SLUGS = ['sales-by-customer', 'sales-by-representative', 'parts-velocity',
               'technician-utilization', 'work-in-progress', 'inventory-value'];
const res = { buildMarker: 'v3.4.1-0ed4433', capturedAt: new Date().toISOString() };

// ---------- observe the toolbar for a given hydrated page ----------
const readToolbar = page => page.evaluate(() => {
  const main = document.querySelector('main') || document.body;
  const clean = s => (s || '').replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  const selects = Array.from(main.querySelectorAll('.q-select')).map(e => clean(e.innerText));
  const fieldLabels = Array.from(main.querySelectorAll('.q-field__label')).map(e => clean(e.innerText));
  return {
    selectTexts: selects,
    fieldLabels: [...new Set(fieldLabels)],
    hasLocationControl: selects.some(s => /^Location\b/i.test(s)) || fieldLabels.some(l => /^Location$/i.test(l)),
    columnHeaders: Array.from(document.querySelectorAll('table thead th, table thead td'))
      .map(th => clean(th.innerText).replace(/arrow_drop_(up|down)|info_outline|keyboard_double_arrow_down/g, '').trim())
      .filter(Boolean),
    dateRangeLabel: clean(document.querySelector('.date-range-label')?.textContent || ''),
    // read the WHOLE grid text so virtualised rows are not lost
    gridText: clean((main.querySelector('table')?.innerText || '')).slice(0, 2500),
  };
});

// ================= 1. ADMIN baseline (two locations accessible) =================
{
  const { browser, page } = await boot('admin');
  res.adminBaseline = {};
  for (const slug of SLUGS) {
    await page.goto(APP + '/reports/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(7500);
    res.adminBaseline[slug] = await readToolbar(page);
    console.log(`ADMIN(2 loc) ${slug.padEnd(24)} Location control: ${res.adminBaseline[slug].hasLocationControl ? 'PRESENT' : 'ABSENT '} | cols: ${JSON.stringify(res.adminBaseline[slug].columnHeaders)}`);
  }
  await browser.close();
}

// ================= 2. SEED a single-location reports user and observe =================
let t = await login('admin');
const st = await api(t.sessCookie, 'GET', '/api/staff?limit=300');
const staff = st.body.data.collection || st.body.data;
const subj = staff.find(s => s.email === 'wesley.mcclure@staging.shopview.local');
const origRole = subj.role_id, origWp = subj.workplace_id;
res.subject = { email: subj.email, staff_id: subj.staff_id, origRoleId: origRole, origWorkplace: origWp };
const change = (roleId, workplaceId) => api(t.sessCookie, 'POST', `/api/staff/${subj.staff_id}/change`, {
  first_name: subj.first_name, last_name: subj.last_name, email: subj.email, role_id: roleId,
  workplace_id: workplaceId, job_title: subj.job_title, salary_type: subj.salary_type,
  salary: subj.salary, billable: subj.billable, clockable: subj.clockable });

res.seedAssign = (await change(SALES_REP, HD)).status;
console.log('\nSEED: assigned Sales Representative + single workplace ->', res.seedAssign);

{
  const { browser, page, sessCookie } = await boot('admin');
  await api(sessCookie, 'POST', '/api/switch-user', { user_id: subj.id });
  const me = await api(sessCookie, 'GET', '/api/auth/me/fe-permissions');
  const mw = await api(sessCookie, 'GET', '/api/staff/my-workplaces');
  const wps = (mw.body.data?.collection || mw.body.data || []).map(w => w.name || w.label);
  res.impersonated = { slug: me.body?.data?.template_slug, atomCount: me.body?.data?.fe_permissions?.length,
    accessibleWorkplaces: wps, accessibleCount: wps.length };
  console.log('IMPERSONATED:', JSON.stringify(res.impersonated));

  if (res.impersonated.slug && res.impersonated.slug !== 'administrator' && wps.length === 1) {
    // re-hydrate the browser as this user
    const cookies = sessCookie.split('; ').map(p => { const i = p.indexOf('=');
      return { name: p.slice(0, i), value: p.slice(i + 1), domain: '.qa.shopview.com', path: '/' }; });
    const ctx = page.context();
    await ctx.clearCookies(); await ctx.addCookies(cookies);
    await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.evaluate(f => { localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f));
      const u = JSON.parse(localStorage.getItem('user') || '{}'); localStorage.setItem('user', JSON.stringify(u)); }, me.body.data);
    res.singleLoc = {};
    for (const slug of SLUGS) {
      await page.goto(APP + '/reports/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(7500);
      res.singleLoc[slug] = await readToolbar(page);
      console.log(`1-LOC       ${slug.padEnd(24)} Location control: ${res.singleLoc[slug].hasLocationControl ? 'PRESENT' : 'ABSENT '} | selects: ${JSON.stringify(res.singleLoc[slug].selectTexts)} | cols: ${JSON.stringify(res.singleLoc[slug].columnHeaders)}`);
      await page.screenshot({ path: OUT + 'singleloc-' + slug + '.png' });
    }
  } else { res.singleLocNote = 'single-location impersonated session not established — NOT VERIFIED'; console.log(res.singleLocNote); }
  await browser.close();
}

// ================= 3. RESTORE =================
t = await login('admin');
res.restore = (await change(origRole, origWp)).status;
const v = await api(t.sessCookie, 'GET', '/api/staff?limit=300');
const back = (v.body.data.collection || v.body.data).find(s => s.staff_id === subj.staff_id);
res.restoreVerify = { role_label: back?.role_label, workplace_id: back?.workplace_id,
  matchesOriginal: back?.role_id === origRole && back?.workplace_id === origWp };
console.log('\nRESTORED:', JSON.stringify(res.restoreVerify));

fs.writeFileSync(OUT + 'singleloc-matrix.json', JSON.stringify(res, null, 2));
console.log('wrote', OUT + 'singleloc-matrix.json');
