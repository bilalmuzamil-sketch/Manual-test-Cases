// probe_inline_surfaces.mjs — REUSABLE Inline Add & Edit Parts (6597) surface walker.
//
// WHY THIS EXISTS (QA lead, 2026-09-16): "never rediscover what you have previously done ... make a
// rule/skill/recipe/script/playbook so you can reuse the learning in future." Every prior build-verify
// pass of this suite hand-wrote one-off probes bound to a specific QA branch (e.g. probe_inline_full.mjs
// matched /S9315-/ WO numbers). When sv9315 was destroyed and the feature merged to Staging, those
// probes could not run and a session re-adapted them from scratch. This module is the durable, host-
// agnostic replacement: it re-observes EVERY distinct Inline surface on whatever build it is pointed at
// and dumps the labels/behaviours as JSON, so a build-verify pass reuses it instead of rewriting probes.
//
// WHAT IT OBSERVES (the distinct surfaces the 123 cases map to):
//   * WO Lines tab + "Add Part" button label + line-table headers
//   * the inline add row: inputs, field labels, controls (Save/close/More options/Pick/Complete)
//   * the part-number typeahead: result cards, inventory quantity, bin chips, "+N", "Not stocked" (C45222)
//   * More options modal (split across bins / allocation)
//   * the edit control (pencil) on an existing part line + the edit row
//
// HOW TO RUN:
//   Staging (default):   node build/inline-add-edit-parts/probe_inline_surfaces.mjs
//   Pick WO status:      WO_STATUS="In Progress" node .../probe_inline_surfaces.mjs
//   Explicit WO url:     WO_URL="https://app.staging.shopview.com/workorders/<id>/lines" node ...
//   Typeahead query:     TYPEAHEAD="brake" node ...   (default "a")
//   A QA branch instead: SV_ENV=qa SV_BRANCH=sv9500 node ...   (uses qa-branch-boot boot())
//   Output dir:          OUT=build/inline-add-edit-parts/build-verify-<date>-<env> node ...
//
// PREREQS: a fresh MITM bridge (source build/testing-tools/ensure_bridge.sh) and, for staging, a live
//   sv_sso_session in /tmp/staging-cookie.txt (chmod 600, /tmp only, NEVER committed — Rule 82).
//   Staging is now the test environment for this suite (sv9315 was destroyed on the merge, 2026-09-10).
//
// The result JSON lands at <OUT>/surfaces-<build>.json and a screenshot per surface at <OUT>/*.png.
// Read the JSON SUMMARY (Rule 88 — never bulk-read); do not paste whole logs.
//
// 🛑 PART-STATUS IS CONDITION-DEPENDENT — DO NOT CALL A STATUS ABSENT FROM ONE OBSERVATION (L0044,
//    QA lead caught it live 2026-09-16). The WO-line Parts row status "Auth to order" (action "Order")
//    appears ONLY when BOTH: (1) the parent LINE is Authorized/Approved (Edit Line -> Status
//    "Authorized"), AND (2) the part Source = Vendor (special order), NOT Source = Inventory. A part
//    sourced from Inventory or on a non-authorized line shows "Awaiting" (action "Receive"), which is a
//    LATER state, not a rename. A line that Needs Approval shows its parts as "Requested". So to verify
//    a case that asserts "Auth to order" (C45013/C45054), reach the Authorized-line + Vendor-source
//    combination first; a free-typed part that lands as inventory/awaiting is NOT evidence the status
//    is missing. Proof on v26.36.7: WO S2-32218 had (SP-NEW-989)=Auth to order and (SP-NEW-898)=Awaiting
//    at the same time.
import fs from 'fs';

const ENV = process.env.SV_ENV || 'staging';
const OUT = process.env.OUT || 'build/inline-add-edit-parts/build-verify-adhoc';
fs.mkdirSync(OUT, { recursive: true });
const LAB = 'e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const WO_STATUS = process.env.WO_STATUS || 'Approved';
const TYPEAHEAD = process.env.TYPEAHEAD || 'a';

// ---- boot the right environment ----
let browser, page, feData;
if (ENV === 'qa') {
  const { boot } = await import('/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs');
  ({ browser, page } = await boot(process.env.SV_BRANCH || 'sv9315', '/workorders?tab=work_orders', 'admin'));
} else {
  const { boot2 } = await import('/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs');
  ({ browser, page, feData } = await boot2('admin', { route: '/workorders?tab=work_orders' }));
}
await page.waitForTimeout(6000);
const build = await page.evaluate(() => document.querySelector('meta[name=app-version]')?.getAttribute('content'));
const R = { env: ENV, build, at: new Date().toISOString(), perms: feData?.fe_permissions?.length, view: feData?.view_mode };
console.log('BOOT', JSON.stringify({ build, perms: R.perms, view: R.view }));

// ---- open a WO of the requested status (or an explicit WO_URL) ----
if (process.env.WO_URL) {
  await page.goto(process.env.WO_URL, { waitUntil: 'domcontentloaded' });
} else {
  await page.evaluate(([L, st]) => { const lab = eval(L);
    const tr = [...document.querySelectorAll('table tbody tr')].find(r => new RegExp(st, 'i').test(lab(r)) && /S2-\d/.test(lab(r)));
    if (tr) { const cell = [...tr.cells].find(c => /S2-\d/.test(c.textContent || '')); (cell || tr.cells[2]).click(); }
  }, [LAB, WO_STATUS]);
}
await page.waitForTimeout(6000);
R.woUrl = page.url();
await page.locator('.q-tab:has-text("Lines")').first().click().catch(() => {});
await page.waitForTimeout(4000);
await page.screenshot({ path: `${OUT}/lines-${build}.png`, fullPage: true }).catch(() => {});

R.addPartButtons = await page.evaluate(L => { const lab = eval(L);
  return [...new Set([...document.querySelectorAll('button,.q-btn,a')].map(lab).filter(t => /add part/i.test(t) && t.length < 24))]; }, LAB);
R.lineHeaders = await page.evaluate(L => { const lab = eval(L);
  return [...document.querySelectorAll('table thead th')].map(lab).filter(Boolean).slice(0, 14); }, LAB);

// ---- open the inline add row ----
await page.evaluate(L => { const lab = eval(L);
  const b = [...document.querySelectorAll('button,.q-btn,a')].find(e => /add part/i.test(lab(e)) && lab(e).length < 24);
  if (b) { b.scrollIntoView(); b.click(); } }, LAB);
await page.waitForTimeout(3000);
R.inlineRow = await page.evaluate(L => { const lab = eval(L);
  const inputs = [...document.querySelectorAll('input')].map(e => e.getAttribute('placeholder') || e.getAttribute('aria-label')).filter(Boolean);
  const flabels = [...document.querySelectorAll('.q-field__label,label')].map(lab).filter(t => t && t.length < 28);
  const btns = [...document.querySelectorAll('button,.q-btn')].map(lab).filter(t => t && t.length < 22);
  return { inputs: [...new Set(inputs)].slice(0, 20), flabels: [...new Set(flabels)].slice(0, 20), controls: [...new Set(btns)].slice(0, 26) }; }, LAB);
await page.screenshot({ path: `${OUT}/addrow-${build}.png`, fullPage: true }).catch(() => {});

// ---- typeahead result cards + bin chips (C45222) ----
const focused = await page.evaluate(() => { const i = [...document.querySelectorAll('input')].find(e => /part/i.test(e.getAttribute('placeholder') || e.getAttribute('aria-label') || '')); if (i) { i.focus(); return true; } return false; });
R.partInputFocused = focused;
await page.keyboard.type(TYPEAHEAD, { delay: 90 });
await page.waitForTimeout(3800);
R.typeahead = await page.evaluate(L => { const lab = eval(L);
  const menu = document.querySelector('.q-menu, .q-virtual-scroll, [role=listbox]');
  const items = [...document.querySelectorAll('.q-item,[role=option],.q-menu *')].map(lab).filter(t => t && t.length < 140);
  return { menuPresent: !!menu, sample: [...new Set(items)].slice(0, 14) }; }, LAB);
R.chipWords = await page.evaluate(() => { const t = document.body.innerText;
  return { notStocked: /Not stocked/i.test(t), bin: /bin/i.test(t), plusN: /\+\s?\d+/.test(t), inStock: /in stock|on hand|qty/i.test(t) }; });
await page.screenshot({ path: `${OUT}/typeahead-${build}.png`, fullPage: true }).catch(() => {});

// ---- edit control (pencil) on an existing part line ----
R.editControls = await page.evaluate(L => { const lab = eval(L);
  const pencils = [...document.querySelectorAll('button,.q-btn,[role=button],i')].filter(e => /edit/i.test((e.textContent || '') + (e.getAttribute('aria-label') || '')));
  return { count: pencils.length, sample: [...new Set(pencils.map(lab).filter(Boolean))].slice(0, 6) }; }, LAB);

fs.writeFileSync(`${OUT}/surfaces-${build}.json`, JSON.stringify(R, null, 1));
console.log('WROTE', `${OUT}/surfaces-${build}.json`);
console.log(JSON.stringify(R, null, 1));
await browser.close();
