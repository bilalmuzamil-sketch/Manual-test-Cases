// observe_wip_asset_and_singleloc.mjs
// (a) reads the WIP Asset cell as RENDERED (settles WIP-COL-05: VIN-first vs unit-number-first)
// (b) toggles VIN + Location + Inv. Hrs on by COORDINATE click (Quasar intercepts .click())
// (c) SEEDS a single-location user (Rule 14 - no data blockers) and observes whether the
//     Location filter is HIDDEN for them, which is the highest-risk spec-vs-ruling gap.
// Restores everything it changes.
import fs from 'fs';
import { boot } from './boot8582.mjs';
import { APP, login, api } from './qa8582.mjs';

const OUT = new URL('../evidence/work-in-progress/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const res = { buildMarker: 'v3.4.1-0ed4433', capturedAt: new Date().toISOString() };

// ---------------- part A + B ----------------
{
  const { browser, page } = await boot('admin');
  await page.goto(APP + '/reports/work-in-progress', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(9000);

  const dl = await page.evaluate(() => { const e = document.querySelector('.date-range-label'); if (!e) return null;
    const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  if (dl) {
    await page.mouse.click(dl.x, dl.y); await page.waitForTimeout(1600);
    const opt = await page.evaluate(() => { const i = Array.from(document.querySelectorAll('.q-menu *'))
      .find(e => e.children.length === 0 && (e.textContent || '').trim() === 'Last 12 Months');
      if (!i) return null; const r = i.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    if (opt) { await page.mouse.click(opt.x, opt.y); await page.waitForTimeout(1500); }
    await page.keyboard.press('Escape'); await page.waitForTimeout(6000);
  }

  const readRows = () => page.evaluate(() => {
    const t = document.querySelector('table'); if (!t) return null;
    const clean = s => (s || '').trim().replace(/arrow_drop_(up|down)|info_outline|keyboard_double_arrow_down/g, '').trim();
    const heads = Array.from(t.querySelectorAll('thead th, thead td')).map(th => clean(th.innerText));
    const trs = Array.from(t.querySelectorAll('tbody tr'));
    const rows = trs.slice(0, 5).map(tr => {
      const tds = Array.from(tr.querySelectorAll('td'));
      return { cells: tds.map(td => (td.innerText || '').replace(/\n/g, ' / ').trim()),
               assetCellHtml: tds[3] ? tds[3].innerHTML.replace(/\s+/g, ' ').slice(0, 400) : null };
    });
    return { heads, rowCount: trs.length, rows,
      totalsRow: (() => { const l = trs[trs.length - 1]; return l ? Array.from(l.querySelectorAll('td')).map(td => (td.innerText || '').trim()) : null; })() };
  });
  res.defaultView = await readRows();

  const openSel = async () => { const b = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('.q-btn')).find(x => /width_normal/.test(x.innerText || ''));
      if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    if (b) { await page.mouse.click(b.x, b.y); await page.waitForTimeout(1500); } return !!b; };
  res.toggleResults = [];
  for (const want of ['VIN', 'Location', 'Inv. Hrs', 'Last Activity']) {
    await openSel();
    const c = await page.evaluate(w => { const it = Array.from(document.querySelectorAll('.q-menu .q-item'))
        .find(i => (i.innerText || '').trim() === w);
      if (!it) return null; const r = it.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, want);
    if (c) { await page.mouse.click(c.x, c.y); await page.waitForTimeout(1200); }
    await page.keyboard.press('Escape'); await page.waitForTimeout(900);
    const h = await page.evaluate(() => Array.from(document.querySelectorAll('table thead th, table thead td'))
      .map(th => (th.innerText || '').replace(/arrow_drop_(up|down)|info_outline/g, '').trim()));
    res.toggleResults.push({ toggled: want, found: !!c, headersNow: h });
    console.log('toggled', want, '->', JSON.stringify(h));
  }
  await page.waitForTimeout(2500);
  res.allColumnsView = await readRows();
  await page.screenshot({ path: OUT + 'all-columns-with-data.png', fullPage: true });
  console.log('\nDEFAULT headers:', JSON.stringify(res.defaultView?.heads));
  console.log('DEFAULT row1 cells:', JSON.stringify(res.defaultView?.rows?.[0]?.cells));
  console.log('DEFAULT row1 ASSET html:', res.defaultView?.rows?.[0]?.assetCellHtml);
  console.log('ALLCOLS headers:', JSON.stringify(res.allColumnsView?.heads));
  console.log('ALLCOLS row1 cells:', JSON.stringify(res.allColumnsView?.rows?.[0]?.cells));
  console.log('ALLCOLS totalsRow:', JSON.stringify(res.allColumnsView?.totalsRow));
  await browser.close();
}

// ---------------- part C ----------------
{
  let t = await login('admin');
  const wp = await api(t.sessCookie, 'GET', '/api/staff/my-workplaces');
  res.workplaces = (wp.body.data?.collection || wp.body.data || []).map(w => ({ id: w.id, name: w.name || w.label }));
  console.log('\nWORKPLACES:', JSON.stringify(res.workplaces));

  const st = await api(t.sessCookie, 'GET', '/api/staff?limit=300');
  const staff = st.body.data.collection || st.body.data;
  const subj = staff.find(s => s.email === 'wesley.mcclure@staging.shopview.local');
  const SALES_REP = 'b176ec30-2def-49af-ab11-782c2f6bd503';
  const origRole = subj.role_id, origWp = subj.workplace_id;
  res.singleLocSubject = { email: subj.email, staff_id: subj.staff_id, origRole, origWp };

  const change = (roleId, workplaceId) => api(t.sessCookie, 'POST', `/api/staff/${subj.staff_id}/change`, {
    first_name: subj.first_name, last_name: subj.last_name, email: subj.email, role_id: roleId,
    workplace_id: workplaceId, job_title: subj.job_title, salary_type: subj.salary_type,
    salary: subj.salary, billable: subj.billable, clockable: subj.clockable });

  res.seedAssign = (await change(SALES_REP, HD)).status;
  console.log('seed assign (Sales Representative + single workplace):', res.seedAssign);

  const { browser, page, sessCookie } = await boot('admin');
  const sw = await api(sessCookie, 'POST', '/api/switch-user', { user_id: subj.id });
  const me = await api(sessCookie, 'GET', '/api/auth/me/fe-permissions');
  const mw = await api(sessCookie, 'GET', '/api/staff/my-workplaces');
  const theirWps = (mw.body.data?.collection || mw.body.data || []).map(w => w.name || w.label);
  res.singleLocObserved = { switchStatus: sw.status, slug: me.body?.data?.template_slug,
    accessibleWorkplaces: theirWps, accessibleCount: theirWps.length };
  console.log('impersonated:', JSON.stringify(res.singleLocObserved));

  if (sw.status === 200) {
    await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.evaluate(({ u, f }) => { localStorage.setItem('user', JSON.stringify(u));
      localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f)); }, { u: { data: me.body.data }, f: me.body.data });
    const seen = {};
    for (const slug of ['sales-by-customer', 'sales-by-representative', 'parts-velocity',
                        'technician-utilization', 'work-in-progress', 'inventory-value']) {
      await page.goto(APP + '/reports/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(7000);
      seen[slug] = await page.evaluate(() => {
        const main = document.querySelector('main') || document.body;
        const labels = Array.from(main.querySelectorAll('.q-field__label, .q-select'))
          .map(e => (e.innerText || '').replace(/\n/g, ' ').trim()).filter(Boolean);
        return { locationFilterPresent: labels.some(l => /Location/i.test(l)),
                 filterLabels: [...new Set(labels)].slice(0, 10),
                 columnHeaders: Array.from(document.querySelectorAll('table thead th, table thead td'))
                   .map(th => (th.innerText || '').replace(/arrow_drop_(up|down)|info_outline|keyboard_double_arrow_down/g, '').trim()).filter(Boolean) };
      });
      console.log('  single-loc user @', slug, '-> Location filter present:', seen[slug].locationFilterPresent,
        '| filters:', JSON.stringify(seen[slug].filterLabels), '| cols:', JSON.stringify(seen[slug].columnHeaders));
      await page.screenshot({ path: OUT + '../singleloc-' + slug + '.png' });
    }
    res.singleLocPerReport = seen;
  } else { res.singleLocNote = 'could not establish an impersonated session — NOT VERIFIED'; }
  await browser.close();

  t = await login('admin');
  res.restore = (await change(origRole, origWp)).status;
  const v = await api(t.sessCookie, 'GET', '/api/staff?limit=300');
  const back = (v.body.data.collection || v.body.data).find(s => s.staff_id === subj.staff_id);
  res.restoreVerify = { role_label: back?.role_label, workplace_id: back?.workplace_id };
  console.log('\nRESTORED:', JSON.stringify(res.restoreVerify));
}

fs.writeFileSync(OUT + 'asset-and-singleloc.json', JSON.stringify(res, null, 2));
console.log('wrote', OUT + 'asset-and-singleloc.json');
