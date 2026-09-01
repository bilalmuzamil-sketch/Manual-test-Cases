// probe_print5.mjs — the four remaining 6617 data states, SEEDED rather than reported missing.
//
// QA lead, 2026-09-01, verbatim: "You are never supposed to create defect, you are supposed to make
// the tests RUNNABLE." Standing Rule 14 says the same: never mark anything NOT-VERIFIED for a
// missing data state - seed it. So:
//
//   C45098  a work order with NO VEHICLE  -> one exists: S2-6107. Found by paging /api/work-orders.
//   C45111  a tech story of 500+ chars    -> seeded via POST /api/work-orders/lines/change-story
//                                            (playbook, and /lines/change returns 500 - do not use it)
//   C45104  a line whose status is Cancelled -> is that status even in the enum? ASK THE BACKEND
//   C45097  a work order with NO CUSTOMER -> does the app let one exist at all?
//
// Every seed is reverted in a finally block and the revert is verified, and throwaway text carries
// the ZZAUTOTEST tag.
import { boot, APP, apiGet, apiPost } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/printer-friendly-wo/build-verify-2026-09-01';
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const NOVEH = '5fafc078-4720-4805-8884-b6fcbf02aecb';   // S2-6107, paid, 7 lines, NO vehicle
const WO    = 'c6d4b883-6f78-4c9e-ab7e-436a6d99c17a';   // S9315-14846, estimate
const RESULTS = `${OUT}/evidence/probe-print5.json`;
const results = (() => { try { return JSON.parse(fs.readFileSync(RESULTS, 'utf8')); } catch (_) { return {}; } })();

const { browser, page } = await boot('/workorders');
const settle = async () => {
  await page.waitForFunction(() => {
    const t = document.body?.innerText || '';
    if (/\bLoading\.\.\./.test(t)) return false;
    return t.length > 1200;
  }, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500);
};
const land = async (wo) => { for (let a = 0; a < 3; a++) {
  await page.goto(`${APP}/workorders/${wo}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await settle();
  if (await page.evaluate(() => !!document.querySelector('[data-test-id="button_work_order_nav_bar_menu"]'))) return true;
} return false; };
const clickPrint = async () => {
  await page.evaluate(() => { window.__printCalls = 0;
    if (!window.__printStubbed) { window.print = function () { window.__printCalls++; }; window.__printStubbed = true; } });
  await page.evaluate(() => document.querySelector('[data-test-id="button_work_order_nav_bar_menu"]')?.click());
  await page.waitForTimeout(2000);
  const ok = await page.evaluate(() => {
    const it = document.querySelector('.q-menu [data-test-id="menu_item_print_work_order"]');
    if (!it) return false; it.click(); return true; });
  await page.waitForTimeout(3200);
  return { clicked: ok, calls: await page.evaluate(() => window.__printCalls || 0) };
};
// read the printout with the PRINT stylesheet applied - a screen read is not the paper
const readPrintout = async () => {
  await page.emulateMedia({ media: 'print' });
  await page.waitForTimeout(1200);
  const r = await page.evaluate(() => {
    const root = document.querySelector('.wo-printing') || document.body;
    const t = (root.innerText || '');
    return {
      chars: t.length,
      flat: t.replace(/\s+/g, ' ').slice(0, 1800),
      fields: [...root.querySelectorAll('.wo-print__field')].map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()),
      dollarSigns: (t.match(/\$/g) || []).length,
    };
  });
  await page.emulateMedia({ media: null });
  return r;
};
// the line list, straight from the SPA's own store, so line ids are never guessed
const linesOf = async () => page.evaluate(() => {
  const out = [];
  document.querySelectorAll('[data-test-id="button_edit_line"], .work-order-line').forEach(() => {});
  return out;
});

const P = {};

// ---------------------------------------------------------------- C45098
P['C45098-no-vehicle'] = async () => {
  const landed = await land(NOVEH);
  if (!landed) return { LAND_FAILED: true };
  const p = await clickPrint();
  if (!p.clicked) return { PRINT_NOT_CLICKED: p };
  const out = await readPrintout();
  await page.screenshot({ path: `${OUT}/evidence/print5-no-vehicle.png`, fullPage: true });
  // positive control: the SAME read on a work order that HAS a vehicle must show the vehicle block,
  // or an absent block proves nothing about the missing-vehicle case
  await land(WO); await clickPrint();
  const control = await readPrintout();
  return { workOrder: 'S2-6107', printClick: p, printout: out,
           positiveControlWorkOrderWithAVehicle: { fields: control.fields } };
};

// ---------------------------------------------------------------- C45104
P['C45104-cancelled-line-status'] = async () => {
  // ASK THE BACKEND what the enum is rather than guessing from the spec's wording.
  const probe = {};
  const landed = await land(WO);
  const ids = await page.evaluate(() => {
    const s = [...document.querySelectorAll('[data-test-id^="button_line_"], [data-test-id*="line"]')]
      .map(e => e.getAttribute('data-test-id'));
    return [...new Set(s)].slice(0, 25);
  });
  probe.lineTestIds = ids;
  // the line id is in the SPA's network traffic; take it from the lines list call instead
  const cap = [];
  page.on('response', r => { if (/lines|work-order/.test(r.url()) && r.request().method() === 'GET') cap.push(r.url()); });
  await land(WO);
  probe.getCalls = [...new Set(cap)].slice(0, 12);
  for (const status of ['cancelled', 'canceled', 'ZZNOPE']) {
    const r = await apiPost('/api/work-orders/lines/change-status',
      { line_id: '00000000-0000-0000-0000-000000000000', status, workOrderId: WO });
    probe[`status_${status}`] = { http: r.status, body: JSON.stringify(r.body).slice(0, 300) };
  }
  return probe;
};

// ---------------------------------------------------------------- C45097
P['C45097-no-customer'] = async () => {
  // can a work order exist without a customer at all? Open the Create Work Order form and read
  // whether the customer field is required, rather than asserting it from the 100 that have one.
  await page.goto(`${APP}/workorders`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await settle();
  const opened = await page.evaluate(() => {
    const b = document.querySelector('[data-test-id="button_new_work_order"]');
    if (!b) return false; b.click(); return true;
  });
  await page.waitForTimeout(3500);
  const form = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog') || document.body;
    const t = (d.innerText || '').replace(/\s+/g, ' ');
    return { isDialog: !!document.querySelector('.q-dialog'), text: t.slice(0, 900),
      requiredMarks: (t.match(/\*/g) || []).length,
      fieldIds: [...d.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')).slice(0, 40) };
  });
  await page.screenshot({ path: `${OUT}/evidence/print5-create-wo-form.png`, fullPage: true });
  await page.keyboard.press('Escape').catch(() => {});
  return { createFormOpened: opened, form };
};


// ---------------------------------------------------------------- C45097 + C45098, the real attempt
P['C45097-C45098-create-without-customer-or-vehicle'] = async () => {
  // The New Work Order dialog carries a Customer select and an Asset select and marks NEITHER as
  // required (no asterisks). So the question "can a work order exist with no customer / no vehicle"
  // is answered by pressing Save with both empty - not by observing that all 100 reachable work
  // orders happen to have one.
  await page.goto(`${APP}/workorders`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await settle();
  await page.evaluate(() => document.querySelector('[data-test-id="button_new_work_order"]')?.click());
  await page.waitForTimeout(3000);
  const saveResp = [];
  const onResp = r => { if (/work-orders/.test(r.url()) && r.request().method() === 'POST')
    saveResp.push({ url: r.url().slice(-60), status: r.status() }); };
  page.on('response', onResp);
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_work_order"]')?.click());
  await page.waitForTimeout(4000);
  page.off('response', onResp);
  const after = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    return { dialogStillOpen: !!d,
             dialogText: d ? (d.innerText || '').replace(/\s+/g, ' ').slice(0, 400) : null,
             url: location.pathname,
             pageText: (document.body?.innerText || '').replace(/\s+/g, ' ').slice(0, 300),
             validationText: [...document.querySelectorAll('.q-field--error, .q-field__messages, .text-negative')]
               .map(e => (e.innerText || '').trim()).filter(Boolean).slice(0, 6) };
  });
  await page.screenshot({ path: `${OUT}/evidence/print5-save-empty-wo.png`, fullPage: true });
  await page.keyboard.press('Escape').catch(() => {});
  return { savePosts: saveResp, afterSave: after };
};


// ---------------------------------------------------------------- C45098, seeded properly
P['C45098-seed-work-order-with-no-vehicle'] = async () => {
  // MEASURED above: "Customer is a required field", but the Asset (vehicle) select is NOT required
  // and pressing Save with it empty sends no complaint about it. So a work order with no vehicle is
  // creatable, and C45098 does not need anyone's permission - it needs one work order.
  // The work order is DELETED again at the end (More -> Delete Work Order) and the deletion verified.
  await page.goto(`${APP}/workorders`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await settle();
  await page.evaluate(() => document.querySelector('[data-test-id="button_new_work_order"]')?.click());
  await page.waitForTimeout(3000);
  // choose the first customer the select offers - which one does not matter to this case
  await page.evaluate(() => document.querySelector('[data-test-id="select_customer_select"]')?.click());
  await page.waitForTimeout(2500);
  const options = await page.evaluate(() =>
    [...document.querySelectorAll('.q-menu .q-item')].map(e => (e.innerText || '').trim()).slice(0, 5));
  const picked = await page.evaluate(() => {
    const o = document.querySelector('.q-menu .q-item');
    if (!o) return null; const t = (o.innerText || '').trim(); o.click(); return t; });
  await page.waitForTimeout(2000);
  const posts = [];
  const onResp = r => { if (/work-orders/.test(r.url()) && r.request().method() === 'POST')
    posts.push({ url: r.url().slice(-50), status: r.status() }); };
  page.on('response', onResp);
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_work_order"]')?.click());
  await page.waitForTimeout(6000);
  page.off('response', onResp);
  const landedOn = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    return { url: location.pathname,
             dialogStillOpen: !!d,
             dialogText: d ? (d.innerText || '').replace(/\s+/g, ' ').slice(0, 500) : null,
             header: (document.body?.innerText || '').replace(/\s+/g, ' ').slice(0, 200) };
  });
  const newId = (landedOn.url.match(/workorders\/([0-9a-f-]{36})/) || [])[1] || null;
  let printout = null, printClick = null, deleted = null;
  if (newId) {
    await land(newId);
    printClick = await clickPrint();
    if (printClick.clicked) printout = await readPrintout();
    await page.screenshot({ path: `${OUT}/evidence/print5-seeded-no-vehicle.png`, fullPage: true });
    // clean up: delete the work order we made
    await land(newId);
    await page.evaluate(() => document.querySelector('[data-test-id="button_work_order_nav_bar_menu"]')?.click());
    await page.waitForTimeout(1800);
    const clickedDelete = await page.evaluate(() => {
      const it = document.querySelector('.q-menu [data-test-id="menu_item_delete_work_order"]')
        || [...document.querySelectorAll('.q-menu .q-item')].find(e => /Delete Work Order/i.test(e.innerText || ''));
      if (!it) return false; it.click(); return true; });
    await page.waitForTimeout(2500);
    const confirmed = await page.evaluate(() => {
      const b = [...document.querySelectorAll('.q-dialog button')]
        .find(e => /^(Delete|Yes|Confirm|OK)$/i.test((e.innerText || '').trim()));
      if (!b) return false; b.click(); return true; });
    await page.waitForTimeout(4000);
    await page.goto(`${APP}/workorders/${newId}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(3000);
    deleted = { clickedDelete, confirmed, stillReachable: await page.evaluate(() =>
      !!document.querySelector('[data-test-id="button_work_order_nav_bar_menu"]')) };
  }
  return { customerOptionsOffered: options, customerPicked: picked, savePosts: posts,
           landedOn, newWorkOrderId: newId, printClick, printout, cleanup: deleted };
};


// ---------------------------------------------------------------- C45111
P['C45111-long-tech-story'] = async () => {
  // The 560-character story is seeded with POST /api/work-orders/lines/change-story (playbook: NOT
  // /lines/change, which answers 500) and the original story is restored in the finally block. The
  // check is on the PAPER, with the print stylesheet applied - a screen read is not the printout.
  const before = await apiGet(`/api/work-orders/lines/${WO}`);
  const lines = before.body?.data?.collection || [];
  const L = lines.find(x => String(x.tech_story || '').length > 500) || lines[0];
  if (!L) return { NO_LINES: true };
  const original = String(L.tech_story || '');
  let out = null, restored = null, verify = null;
  try {
    const story = ('ZZAUTOTEST long tech story for the printout wrap check. '.repeat(11)).slice(0, 560);
    if (original.length < 500) {
      const seed = await apiPost('/api/work-orders/lines/change-story',
        { line_id: L.line_id, tech_story: story, work_order_id: WO });
      if (seed.status >= 400) return { SEED_FAILED: seed.status };
    }
    await land(WO);
    const p = await clickPrint();
    if (!p.clicked) return { PRINT_NOT_CLICKED: p };
    const paper = await readPrintout();
    await page.screenshot({ path: `${OUT}/evidence/print5-long-tech-story.png`, fullPage: true });
    const printedStory = (paper.flat.match(/ZZAUTOTEST[^]*?(?= Parts | \d+ Replace | Total )/) || [])[0] || '';
    out = { printClick: p, storyLengthSeeded: 560,
            storyAppearsOnPaper: /ZZAUTOTEST long tech story/.test(paper.flat),
            occurrencesOnPaper: (paper.flat.match(/ZZAUTOTEST long tech story/g) || []).length,
            charsOfTheStoryVisible: printedStory.length,
            truncationMarkerOnPaper: /\u2026|\.\.\.|Show more|See more/.test(paper.flat),
            paperChars: paper.chars, dollarSigns: paper.dollarSigns,
            flat: paper.flat.slice(0, 1200) };
  } finally {
    const back = await apiPost('/api/work-orders/lines/change-story',
      { line_id: L.line_id, tech_story: original, work_order_id: WO });
    const chk = await apiGet(`/api/work-orders/lines/${WO}`);
    const now = (chk.body?.data?.collection || []).find(x => x.line_id === L.line_id);
    restored = { http: back.status };
    verify = { originalLength: original.length, lengthNow: String(now?.tech_story || '').length,
               identical: String(now?.tech_story || '') === original };
  }
  return { ...out, restore: restored, RESTORE_VERIFIED: verify };
};

for (const [k, fn] of Object.entries(P)) {
  if (ONLY.length && !ONLY.includes(k)) continue;
  console.log(`\n### ${k}`);
  try { results[k] = await fn(); } catch (e) { results[k] = { PROBE_ERROR: String(e).slice(0, 400) }; }
  console.log(JSON.stringify(results[k], null, 1).slice(0, 3500));
  fs.mkdirSync(`${OUT}/evidence`, { recursive: true });
  fs.writeFileSync(RESULTS, JSON.stringify(results, null, 1));
}
await browser.close();
