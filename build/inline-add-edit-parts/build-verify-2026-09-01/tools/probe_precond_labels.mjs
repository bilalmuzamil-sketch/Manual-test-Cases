// probe_precond_labels.mjs — ARE THE PRECONDITIONS' OWN LABELS REAL? Confirm them on screen.
//
// WHY THIS IS A SEPARATE CHECK. check_runnable_cases.py proves a precondition is tester-SHAPED - it
// names a screen, gives a navigation instruction, points at something. It CANNOT prove the route it
// names exists, and it says so in its own header. So the labels the preconditions actually claim were
// inventoried (166 cases, /tmp/precond_inventory.py) and the ones nothing has yet confirmed are
// checked here, verbatim, against the build.
//
// THE TWO THAT MATTER MOST, by how many cases lean on them:
//   “Work Order Line - Create and Edit”   117 cases
//   “Work Order View Mode” / “Work Orders → Work Order View Mode”   90 cases
// Both live on the role edit screen. Everything observed so far is the API's permission CODE
// (workOrderLinesCreateAndEdit), not the on-screen label - and Rule 9 says the case must carry the
// build's own wording. If the screen says something else, 117 and 90 preconditions are wrong.
import { boot, APP, apiGet } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const TECH_ROLE = '2d4b8464-81a9-4c1e-96c6-a2a64f02a389';
const WO = 'c6d4b883-6f78-4c9e-ab7e-436a6d99c17a';
const { browser, page } = await boot('/workorders');
const out = {};
const settleText = async (min = 1500) => {
  await page.waitForFunction(n => {
    const t = document.body?.innerText || '';
    return !/\bLoading\.\.\./.test(t) && t.length > n;
  }, min, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500);
};

// ---- 1. the entry point the preconditions name: the account menu, then "Settings"
await page.goto(`${APP}/workorders`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await settleText(2000);
await page.evaluate(() => document.querySelector('[data-test-id="profile_menu_button"]')?.click());
await page.waitForTimeout(2000);
out.accountMenu = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item')]
  .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean));
await page.keyboard.press('Escape').catch(() => {});

// ---- 2. the Settings sidebar: is "Roles & Permissions" there, exactly?
await page.goto(`${APP}/administration/roles-permissions`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await settleText(1500);
out.settingsSidebar = await page.evaluate(() => [...document.querySelectorAll('.q-item, nav a, aside a')]
  .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 40));
out.rolesScreen = await page.evaluate(() => ({
  pencilPresent: !!document.querySelector('.q-table [data-test-id*="edit"], .q-table i'),
  rowsSample: [...document.querySelectorAll('tr')].map(r => (r.innerText || '').replace(/\s+/g, ' ').trim())
    .filter(Boolean).slice(0, 6),
}));

// ---- 3. THE ROLE EDIT SCREEN. Read every permission label it shows, verbatim.
await page.goto(`${APP}/administration/roles-permissions/${TECH_ROLE}/edit`,
  { waitUntil: 'domcontentloaded', timeout: 60000 });
await settleText(2000);
out.roleEdit = await page.evaluate(() => {
  const t = (document.body?.innerText || '');
  const flat = t.replace(/\s+/g, ' ');
  const labels = [...document.querySelectorAll('label, .q-item__label, .q-toggle__label, td, th, legend, h1, h2, h3, h4, .text-weight-medium')]
    .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim())
    .filter(x => x && x.length < 90);
  return {
    url: location.pathname,
    // the exact strings the preconditions claim
    hasWorkOrderLineCreateAndEdit: /Work Order Line\s*-\s*Create and Edit/i.test(flat),
    hasWorkOrderViewMode: /Work Order View Mode/i.test(flat),
    hasViewModeWords: /View mode/i.test(flat),
    hasFullView: /Full View/i.test(flat),
    hasTechView: /Tech view/i.test(flat),
    // what it ACTUALLY says about work-order-line permissions and about view mode
    lineRelatedLabels: [...new Set(labels.filter(x => /line/i.test(x)))].slice(0, 20),
    viewModeRelatedLabels: [...new Set(labels.filter(x => /view/i.test(x)))].slice(0, 20),
    workOrderSectionLabels: [...new Set(labels.filter(x => /work order/i.test(x)))].slice(0, 25),
    firstChars: flat.slice(0, 600),
  };
});
await page.screenshot({ path: `${OUT}/evidence/precond-role-edit.png`, fullPage: true });

// ---- 4. the line editor: does it say "Tech Story"? and is there a "New Line" button?
await page.goto(`${APP}/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await settleText(2000);
out.linesTab = await page.evaluate(() => {
  const flat = (document.body?.innerText || '').replace(/\s+/g, ' ');
  return { hasNewLine: /New Line/.test(flat), hasTechStory: /Tech Story|Story/i.test(flat),
           hasAddPart: /Add Part/.test(flat), hasLinesTab: /Lines \(/.test(flat),
           storyWordExact: /Tech Story/.test(flat) ? 'Tech Story' : (/\bStory\b/.test(flat) ? 'Story' : null),
           buttons: [...document.querySelectorAll('button')].map(b => (b.innerText || '').replace(/\s+/g, ' ').trim())
             .filter(Boolean).slice(0, 25) };
});
// hover a part row: does the edit control only appear on hover, as 115 preconditions claim?
out.hoverRevealsEdit = await (async () => {
  const before = await page.evaluate(() => {
    const b = document.querySelector('[data-test-id="button_edit_part"]');
    if (!b) return { present: false };
    const st = getComputedStyle(b);
    return { present: true, opacity: st.opacity, visibility: st.visibility, display: st.display };
  });
  const row = page.locator('[data-test-id^="button_requested_part_context_menu_"]').first();
  await row.hover({ timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(1200);
  const after = await page.evaluate(() => {
    const b = document.querySelector('[data-test-id="button_edit_part"]');
    if (!b) return { present: false };
    const st = getComputedStyle(b);
    return { present: true, opacity: st.opacity, visibility: st.visibility, display: st.display };
  });
  return { beforeHover: before, afterHover: after };
})();
await page.screenshot({ path: `${OUT}/evidence/precond-lines-tab.png`, fullPage: true });

fs.mkdirSync(`${OUT}/evidence`, { recursive: true });
fs.writeFileSync(`${OUT}/evidence/precond-labels-onscreen.json`, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1).slice(0, 4000));
await browser.close();
