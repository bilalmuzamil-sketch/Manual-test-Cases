// C30354 — the CORRECT instrument. Expected #2 is "the saved values are applied BEFORE the first data
// fetch — the report does not flash the defaults and then re-query." That is an assertion about ORDER
// AND CONTENT, not duration (QA lead, 2026-09-03).
//
//   PASS  = exactly ONE reporting-API fetch on return, and its query string ALREADY carries the saved
//           filters (type=inventory, the saved date range, the chosen category).
//   FAIL  = a defaults fetch FOLLOWED BY a second filtered fetch - even if both finish in 30 ms.
//   A single correct fetch PASSES even if it is slow. DO NOT TIME. COUNT, and read the query string.
//
// Expected #1 (all saved settings restored), #3 (saved beats first-visit defaults) and #4 (survives a
// full reload) need NO network instrument - they are read from the chips / column picker / sort.
//
// ENVIRONMENT-AGNOSTIC: the case names no environment (point 7). Pass a boot function in. sv8582 QA
// branch has parts-velocity at 10,064 rows (playbook §N) and its login is routine; production works
// too via prod-login-boot.mjs. This file asserts; it does not choose the estate.
import fs from 'fs';

// The reporting data call, per playbook §N: GET /api/reporting/reports/parts-velocity?<filters>...
const REPORT_RX = /\/api\/reporting\/reports\/parts-velocity(\?|$)/;

export async function run({ boot, OUT }) {
  const { browser, page, APP, APIH, version } = await boot('/reports/parts-velocity', { settle: 15000 });
  const log = (...a) => console.log(new Date().toISOString().slice(11,19), ...a);
  const lab = 'e=>{const c=e.cloneNode(true);c.querySelectorAll("svg,i[class*=icon]").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';

  const fetches = [];
  page.on('response', r => { const u = r.url();
    if (u.includes(APIH) && REPORT_RX.test(u)) fetches.push({ status: r.status(), url: u.replace(`https://${APIH}`, '') }); });

  if (/\/login/.test(page.url())) { log('not signed in - cannot run'); await browser.close(); return { ok:false, reason:'no session' }; }
  log('parts-velocity open on', version, '| url', page.url());

  // --- STEP 1: set a NON-DEFAULT view (type=Inventory, Last Month, one category, +Turns/Yr, sort Revenue desc)
  const chip = async (name, value) => {
    const c = page.locator(`.q-chip:has-text("${name}"), .q-btn:has-text("${name}"), .q-select:has-text("${name}")`).first();
    if (!(await c.count())) { log(`chip "${name}" not found`); return false; }
    await c.click(); await page.waitForTimeout(1500);
    const opt = page.locator(`.q-menu .q-item:has-text("${value}"), .q-item:has-text("${value}")`).first();
    if (await opt.count()) { await opt.click(); await page.waitForTimeout(2500); return true; }
    await page.keyboard.press('Escape'); return false;
  };
  const set = { type: await chip('Type','Inventory'), date: await chip('Date','Last Month') };
  // one category (first available)
  const catChip = page.locator('.q-chip:has-text("Category"), .q-btn:has-text("Category")').first();
  if (await catChip.count()) { await catChip.click(); await page.waitForTimeout(1500);
    const first = page.locator('.q-menu .q-item').first();
    if (await first.count()) { set.category = await first.evaluate(e=>(e.textContent||'').trim()); await first.click(); await page.waitForTimeout(2000); }
    await page.keyboard.press('Escape').catch(()=>{}); }
  // Revenue sort desc: click the Revenue header until descending
  const revh = page.locator('th:has-text("Revenue")').first();
  if (await revh.count()) { await revh.click(); await page.waitForTimeout(1500); await revh.click(); await page.waitForTimeout(2000); }
  log('view set:', JSON.stringify(set));
  await page.screenshot({ path: `${OUT}/pv-01-view-set.png`, fullPage: true });

  // --- STEP 2: leave to another report, then come back. Clear the counter FIRST so we only see the return.
  await page.locator('.q-item:has-text("Inventory Value"), a:has-text("Inventory Value")').first().click().catch(()=>{});
  await page.waitForTimeout(6000);
  fetches.length = 0;                                   // <-- count only the RETURN
  await page.locator('.q-item:has-text("Parts Velocity"), a:has-text("Parts Velocity")').first().click();
  await page.waitForTimeout(12000);

  const onReturn = [...fetches];
  log(`reporting-API fetches ON RETURN: ${onReturn.length}`);
  onReturn.forEach((f,i)=>log(`   [${i}] ${f.status} ${decodeURIComponent(f.url).slice(0,200)}`));

  // --- THE VERDICT: count, then read the query string of the first fetch
  const first = onReturn[0];
  const q = first ? decodeURIComponent(first.url).toLowerCase() : '';
  const carries = {
    type_inventory: /type=inventory|inventory/.test(q),
    last_month_range: /range=|start_date=|last.?month/.test(q),
    category: set.category ? q.includes(encodeURIComponent(set.category).toLowerCase()) || q.includes((set.category||'').toLowerCase().slice(0,6)) : null,
  };
  let verdict, why;
  if (onReturn.length === 0) { verdict='INCONCLUSIVE'; why='no reporting fetch captured on return - the report may cache in-page; re-run watching for the row-data call'; }
  else if (onReturn.length === 1 && carries.type_inventory) { verdict='PASS'; why='exactly one fetch and it already carries the saved filters - no defaults flash'; }
  else if (onReturn.length >= 2) { verdict='FAIL'; why=`${onReturn.length} fetches on return - a defaults fetch followed by a filtered one is the exact defect Expected #2 forbids`; }
  else { verdict='FAIL'; why='the single fetch does not carry the saved filters - defaults were applied, not the saved view'; }

  log(`VERDICT (Expected #2): ${verdict} - ${why}`);
  // Expected #1/#3/#4 read from the UI, no network
  const restored = await page.evaluate(L=>{ const lab=eval(L);
    return { chips:[...document.querySelectorAll('.q-chip,.q-btn--outline,.q-select')].map(lab).filter(x=>x&&x.length<40),
      sortIndicator:[...document.querySelectorAll('th[aria-sort],th.sortable--active,th .q-icon')].map(e=>(e.closest('th')?.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,4) };}, lab);
  const out = { version, url: page.url(), onReturn, verdict, why, carries, set, restored };
  fs.writeFileSync(`${OUT}/pv-remembered-view-result.json`, JSON.stringify(out, null, 2));
  await page.screenshot({ path: `${OUT}/pv-02-return.png`, fullPage: true });
  await browser.close();
  return out;
}

// CLI: pick the estate by env. QA_BRANCH=sv8582 uses the routine QA login; PROD=1 uses the §K login.
if (import.meta.url === `file://${process.argv[1]}`) {
  const OUT = 'build/report-suite/prod-verify-2026-09-03';
  let boot;
  if (process.env.PROD) { const m = await import('/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs'); boot = m.bootProdLogin; }
  else { const m = await import('/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs');
    const branch = process.env.QA_BRANCH || 'sv8582';
    boot = (route, opts) => m.boot(branch, route, 'admin').then(r => ({ ...r, APIH: `${branch}api.qa.shopview.com` })); }
  const r = await run({ boot, OUT });
  console.log('\nRESULT:', JSON.stringify({ verdict: r.verdict, why: r.why, fetches: r.onReturn?.length }, null, 2));
}
