// probe_last3.mjs — the last three Inline cases that were reported NOT VERIFIED, seeded instead.
//
//   C45060  does the row really open cost/sell EMPTY? -> and can it be saved at 0.00?
//   C44996  a line whose status is Complete - the line status enum HAS 'complete', so this is
//           reachable and was never a data-state gap
//   C45034  a concurrent change by someone else - done from the API while the edit row is open
import { boot, APP, apiGet, apiPost, apiCall } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const WO = 'c6d4b883-6f78-4c9e-ab7e-436a6d99c17a';
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const RESULTS = `${OUT}/evidence/probe-last3.json`;
const results = (() => { try { return JSON.parse(fs.readFileSync(RESULTS, 'utf8')); } catch (_) { return {}; } })();
const { browser, page } = await boot('/workorders');
const settle = async () => {
  await page.waitForFunction(sel => {
    const t = document.body?.innerText || '';
    if (/\bLoading\.\.\./.test(t)) return false;
    return !!document.querySelector(sel) || t.length > 4000;
  }, '[data-test-id="button_add_part"]', { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500);
};
const landed = () => page.evaluate(() => ({
  addPart: document.querySelectorAll('[data-test-id="button_add_part"]').length,
  editBtns: document.querySelectorAll('[data-test-id="button_edit_part"]').length,
  header: (document.body?.innerText || '').replace(/\s+/g, ' ').slice(0, 160),
}));
const go = async () => { for (let a = 0; a < 3; a++) {
  await page.goto(`${APP}/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await settle();
  if ((await landed()).addPart) return true;
} return false; };
const openRow = async () => { await go();
  await page.evaluate(() => document.querySelector('[data-test-id="button_add_part"]')?.click());
  await page.waitForTimeout(4000);
  return page.evaluate(() => !!document.querySelector('[data-test-id="inline_part_row"]')); };
const search = async (q) => {
  await page.evaluate(() => { const s = document.querySelector('[data-test-id="select_inline_part_number"]');
    const i = s && (s.matches('input') ? s : s.querySelector('input')); (i || s)?.click(); });
  await page.waitForTimeout(1000);
  await page.keyboard.type(q, { delay: 55 });
  await page.waitForTimeout(4200);
  return page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item')]
    .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).slice(0, 8));
};
const pick = async (n = 0) => { await page.evaluate(i => document.querySelectorAll('.q-menu .q-item')[i]?.click(), n);
  await page.waitForTimeout(4500); };
const set = async (id, v) => page.evaluate(([i, val]) => {
  const e = document.querySelector(`[data-test-id="${i}"]`);
  const inp = e && (e.matches('input,textarea') ? e : e.querySelector('input,textarea'));
  if (!inp) return false;
  inp.focus(); inp.value = val;
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  inp.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}, [id, v]);
const val = i => page.evaluate(id => { const e = document.querySelector(`[data-test-id="${id}"]`);
  const n = e && (e.matches('input') ? e : e.querySelector('input')); return n ? n.value : null; }, i);
const sentences = () => page.evaluate(() => {
  const t = (document.body?.innerText || '') + ' ' + (document.body?.innerHTML || '');
  return {
    mustEnter: /Enter a description, qty, cost and sell price to save this part\./.test(t),
    changedBySomeoneElse: /This part was changed by someone else\. Refresh to see the latest\./.test(t),
    anyNegative: [...document.querySelectorAll('.text-negative, .q-field__messages, .q-notification')]
      .map(e => (e.innerText || '').trim()).filter(Boolean).slice(0, 6),
  };
});

const P = {};

// ---------------------------------------------------------------- C45060
P['C45060-no-cost-no-sell'] = async () => {
  // PROVEN FIRST: F40010212 "Slack Adjuster" is a CATALOGUE part whose record carries no cost and no
  // sell price field at all, and /api/inventory/parts?search=F40010212 returns an empty collection,
  // so it is not stocked either. That is exactly the state the case asks for.
  const rec = await apiGet('/api/parts-catalogue/catalogue-parts?search=F40010212');
  const part = rec.body?.data?.collection?.[0] || null;
  if (!(await openRow())) return { ROW_NOT_OPENED: true };
  const opts = await search('F40010212');
  if (!opts.length) return { TYPEAHEAD_EMPTY: true };
  await pick(0);
  const onSelect = { cost: await val('input_inline_part_cost'), sell: await val('input_inline_part_sell_price'),
                     desc: await val('input_inline_part_description') };
  // can it be SAVED at those values? That is what "the user must enter them before saving" means.
  await set('input_inline_part_quantity', '1');
  await page.waitForTimeout(800);
  const posts = [];
  const onResp = r => { if (/part\/make-request/.test(r.url())) posts.push(r.status()); };
  page.on('response', onResp);
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(4000);
  page.off('response', onResp);
  const after = { saved: posts, sentences: await sentences(),
                  rowStillOpen: await page.evaluate(() => !!document.querySelector('[data-test-id="inline_part_row"]')) };
  await page.screenshot({ path: `${OUT}/evidence/last3-no-cost.png`, fullPage: true });
  return { catalogueRecordHasNoCostField: part ? !('cost' in part) && !('sell_price' in part) : null,
           catalogueRecordKeys: part ? Object.keys(part) : null,
           onSelect, afterSaveAttempt: after };
};

// ---------------------------------------------------------------- C44996
P['C44996-line-complete'] = async () => {
  // The line status enum HAS 'complete' (GET /api/work-orders/line-statuses), so this case was never
  // blocked on a data state - it was blocked on nobody having tried it.
  const before = await apiGet(`/api/work-orders/lines/${WO}`);
  const lines = before.body?.data?.collection || [];
  // 🛑 A LINE WITH PART REQUESTS CANNOT BE COMPLETED: "Line can`t be completed with unfulfilled
  // part requests." So pick a line that has none - otherwise the probe reports a data-state gap that
  // is really just the wrong line.
  const L = lines.find(x => x.status !== 'complete' && !(x.part_requests || []).length
                            && !(x.parts || []).length)
         || lines.find(x => x.status !== 'complete');
  if (!L) return { NO_NON_COMPLETE_LINE: true };
  const original = L.status;
  let flip = null, observed = null, restore = null, verify = null;
  // 🛑 COUNT BEFORE, COUNT AFTER. Scoping a DOM read to "the badge's closest container" gave a
  // meaningless 0 on the first attempt - the container was the badge itself. The decisive measure is
  // how many Add Part buttons the page carries before the flip versus after: one per line, so if the
  // Complete line hides its own, the count drops by exactly one.
  await go();
  const addPartBefore = await page.evaluate(() =>
    document.querySelectorAll('[data-test-id="button_add_part"]').length);
  try {
    // 🛑 THE TRANSITION IS A WALK, NOT A JUMP: authorization_required -> authorized -> complete.
    // A direct jump answers 400 "Status transition from authorization_required to complete is not
    // allowed", which is the build telling you the path rather than refusing the state.
    const path = original === 'authorization_required' ? ['authorized', 'complete'] : ['complete'];
    flip = [];
    for (const st of path) {
      const r = await apiPost('/api/work-orders/lines/change-status',
        { line_id: L.line_id, status: st, workOrderId: WO });
      flip.push({ to: st, http: r.status, body: JSON.stringify(r.body).slice(0, 200) });
      if (r.status >= 400) return { FLIP_FAILED: flip };
    }
    await go();
    observed = await page.evaluate(lineId => {
      const walk = () => {
        const badge = document.querySelector(`[data-test-id="badge_line_status_${lineId}"]`);
        if (!badge) return null;
        let n = badge;
        // walk up until the ancestor holds this line's number element too - that is the line block
        for (let i = 0; i < 12 && n; i++) {
          if (n.querySelector(`[data-test-id="line_number_${lineId}"]`)) break;
          n = n.parentElement;
        }
        return n;
      };
      const block = walk();
      return { statusBadge: (document.querySelector(`[data-test-id="badge_line_status_${lineId}"]`)?.innerText || '').trim(),
               blockFound: !!block,
               addPartInThatLineBlock: block ? block.querySelectorAll('[data-test-id="button_add_part"]').length : null,
               addPartOnThePage: document.querySelectorAll('[data-test-id="button_add_part"]').length,
               blockText: block ? (block.innerText || '').replace(/\s+/g, ' ').slice(0, 260) : null };
    }, L.line_id);
    // DECISIVE: map every Add Part button on the page to the line it belongs to, by walking up from
    // the button until an ancestor contains a line status badge. A page-level count is ambiguous;
    // this is not.
    observed.buttonToLineMap = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('[data-test-id="button_add_part"]').forEach(b => {
        let n = b, found = null;
        for (let i = 0; i < 15 && n; i++) {
          const badge = n.querySelector('[data-test-id^="badge_line_status_"]');
          if (badge) { found = { lineId: badge.getAttribute('data-test-id').replace('badge_line_status_', ''),
                                 status: (badge.innerText || '').trim() }; break; }
          n = n.parentElement;
        }
        out.push(found || { lineId: null, status: null });
      });
      return out;
    });
    observed.legacyRead = await page.evaluate(lineId => {
      // find the line block for this line and read whether it offers Add Part
      const badge = document.querySelector(`[data-test-id="badge_line_status_${lineId}"]`);
      const block = badge ? badge.closest('[class*="line"], .q-card, section, div[data-test-id]') : null;
      const scope = block || document;
      return { statusBadge: badge ? (badge.innerText || '').trim() : null,
               addPartInThatLine: scope.querySelectorAll('[data-test-id="button_add_part"]').length,
               addPartOnThePage: document.querySelectorAll('[data-test-id="button_add_part"]').length,
               lineText: (scope.innerText || '').replace(/\s+/g, ' ').slice(0, 300) };
    }, L.line_id);
    await page.screenshot({ path: `${OUT}/evidence/last3-line-complete.png`, fullPage: true });
  } finally {
    // walk back the same way
    restore = [];
    for (const st of (original === 'authorization_required' ? ['authorized', 'authorization_required'] : [original])) {
      const r = await apiPost('/api/work-orders/lines/change-status',
        { line_id: L.line_id, status: st, workOrderId: WO });
      restore.push({ to: st, http: r.status, body: JSON.stringify(r.body).slice(0, 200) });
    }
    const chk = await apiGet(`/api/work-orders/lines/${WO}`);
    const now = (chk.body?.data?.collection || []).find(x => x.line_id === L.line_id);
    verify = { originalStatus: original, statusNow: now?.status, identical: now?.status === original,
               restoreSteps: restore };
  }
  return { line: L.line_id, addPartButtonsBeforeTheFlip: addPartBefore,
           flippedTo: 'complete', flipSteps: flip,
           observed, RESTORE_VERIFIED: verify };
};

// ---------------------------------------------------------------- C45034
P['C45034-concurrent-change'] = async () => {
  // "another user" is simulated the only honest way available: the edit row is opened in the browser
  // and the SAME part is then changed through the API, which is a different client, before Save is
  // pressed. If the message does not appear, that is a real observation about the build, not a gap.
  if (!(await go())) return { LAND_FAILED: true };
  const req = await apiGet(`/api/work-orders/lines/${WO}`);
  const lines = req.body?.data?.collection || [];
  const withPart = lines.find(l => (l.part_requests || []).length);
  if (!withPart) return { NO_PART_ON_ANY_LINE: true };
  const pr = withPart.part_requests[0];
  const openedEdit = await page.evaluate(id => {
    const b = document.querySelector(`[data-test-id="button_edit_part"]`)
      || [...document.querySelectorAll('[data-test-id^="button_edit_part"]')][0];
    if (!b) return false; b.click(); return true;
  }, pr.id);
  await page.waitForTimeout(3500);
  const rowOpen = await page.evaluate(() => !!document.querySelector('[data-test-id="inline_part_row"]')
    || !!document.querySelector('[data-test-id="input_inline_part_description"]'));
  // the concurrent change: rename the same part request through the API
  const change = await apiPost(`/api/work-orders/part/change-request/${pr.id}`,
    { description: `ZZAUTOTEST changed elsewhere ${Date.now()}`, quantity: pr.quantity || 1 });
  await page.waitForTimeout(1500);
  await set('input_inline_part_description', `ZZAUTOTEST my edit ${Date.now()}`);
  await page.waitForTimeout(600);
  const posts = [];
  const onResp = r => { if (/part\/(change|make)-request/.test(r.url())) posts.push({ u: r.url().slice(-40), s: r.status() }); };
  page.on('response', onResp);
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(4500);
  page.off('response', onResp);
  const after = { savePosts: posts, sentences: await sentences(),
                  rowStillOpen: await page.evaluate(() => !!document.querySelector('[data-test-id="inline_part_row"]')) };
  await page.screenshot({ path: `${OUT}/evidence/last3-concurrent.png`, fullPage: true });
  return { partRequest: pr.id, openedEdit, rowOpen,
           concurrentChange: { http: change.status, body: JSON.stringify(change.body).slice(0, 200) },
           afterSave: after };
};

for (const [k, fn] of Object.entries(P)) {
  if (ONLY.length && !ONLY.includes(k)) continue;
  console.log(`\n### ${k}`);
  try { results[k] = await fn(); } catch (e) { results[k] = { PROBE_ERROR: String(e).slice(0, 400) }; }
  console.log(JSON.stringify(results[k], null, 1).slice(0, 3000));
  fs.mkdirSync(`${OUT}/evidence`, { recursive: true });
  fs.writeFileSync(RESULTS, JSON.stringify(results, null, 1));
}
await browser.close();
