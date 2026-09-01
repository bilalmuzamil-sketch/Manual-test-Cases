// probe_last.mjs — the final two questions, both answered by watching the app's own traffic.
//
//  L1 (C45034, S3-E1) "another user changed this part while your edit row was open". The part
//      request id is not obtainable from the API - list-requests ignores every filter parameter and
//      returns the first 100 rows estate-wide - so it is taken from the SAVE REQUEST the edit row
//      itself sends. First save is aborted to capture the payload, the part is then deleted over the
//      API, and the row is saved again for real.
//  L2 (C45022/C45062) WHERE the words "Couldn't add the part" actually are. The forced-500 run found
//      the string in the page's rendered text while the visible toast read "Ooooops! An error
//      occurred", and a string in innerText is not proof of what the tester reads. This pins the
//      element, its classes and whether it is on screen.
import { boot, APP, apiGet, apiPost, apiCall } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const WO = process.env.WO || 'c6d4b883-6f78-4c9e-ab7e-436a6d99c17a';
const TECH = process.env.TECH || '2d36a5f5-c957-45e0-a376-46d24df2a44c';
const RESULTS_FILE = `${OUT}/evidence/probe-last.json`;
const results = (() => { try { return JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8')); } catch (_) { return {}; } })();
const { browser, page } = await boot('/workorders');
const settle = async () => {
  await page.waitForFunction(sel => {
    const t = document.body?.innerText || '';
    if (/\bLoading\.\.\./.test(t)) return false;
    return !!document.querySelector(sel) || t.length > 4000;
  }, '[data-test-id="button_add_part"]', { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500);
};
const sync = async () => {
  const fe = await apiGet('/api/auth/me/fe-permissions');
  await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await page.evaluate(f => localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f)), fe.body?.data);
  return fe.body?.data?.view_mode;
};
const land = async () => { await sync();
  for (let a = 0; a < 3; a++) {
    await page.goto(`${APP}/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    await settle();
    const r = await page.evaluate(() => ({ add: document.querySelectorAll('[data-test-id="button_add_part"]').length,
                                           edit: document.querySelectorAll('[data-test-id="button_edit_part"]').length }));
    if (r.add) return r;
  } return { add: 0, edit: 0 }; };
const set = async (id, v) => page.evaluate(([i, val]) => {
  const e = document.querySelector(`[data-test-id="${i}"]`);
  const inp = e && (e.matches('input,textarea') ? e : e.querySelector('input,textarea'));
  if (!inp) return false;
  inp.focus(); inp.value = val;
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  inp.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}, [id, v]);

const P = {};

P['L1-concurrent-change'] = async () => {
  await apiPost('/api/exit-switch-user', {}).catch(() => {});
  const sw = await apiPost('/api/switch-user', { user_id: TECH });
  if (sw.status >= 400) return { impersonateFailed: sw.status };
  let out = {};
  try {
    out.landed = await land();
    if (!out.landed.edit) return { ...out, POSITIVE_CONTROL_FAILED: out.landed };
    // phase 1: open the edit row, abort its save, and keep the payload
    let payload = null, url = null;
    await page.route('**/api/work-orders/part/change-request', route => {
      if (!payload) { payload = route.request().postData(); url = route.request().url(); return route.abort('failed'); }
      return route.continue();
    });
    await page.evaluate(() => document.querySelector('[data-test-id="button_edit_part"]')?.click());
    await page.waitForTimeout(4500);
    out.editRowOpened = await page.evaluate(() => !!document.querySelector('[data-test-id="inline_part_edit_row"]'));
    await set('input_inline_part_description', 'ZZAUTOTEST capture ' + Date.now());
    await page.waitForTimeout(900);
    await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
    await page.waitForTimeout(5000);
    await page.unroute('**/api/work-orders/part/change-request');
    out.capturedUrl = url;
    out.capturedPayload = payload ? payload.slice(0, 400) : null;
    let id = null;
    try { const j = JSON.parse(payload || '{}'); id = j.id || j.part_request_id || j.request_id || null; } catch (_) {}
    out.partRequestId = id;
    if (!id) return { ...out, note: 'the save payload carried no id field; see capturedPayload' };
    // phase 2: fresh edit row, delete the part behind it, then save for real
    await land();
    await page.evaluate(() => document.querySelector('[data-test-id="button_edit_part"]')?.click());
    await page.waitForTimeout(4500);
    out.secondEditRowOpened = await page.evaluate(() => !!document.querySelector('[data-test-id="inline_part_edit_row"]'));
    const del = await apiCall('POST', `/api/work-orders/part/remove-request/${id}`, {});
    out.deletedBehindTheRow = { status: del.status, body: JSON.stringify(del.body).slice(0, 200) };
    await set('input_inline_part_description', 'ZZAUTOTEST concurrent ' + Date.now());
    await page.waitForTimeout(900);
    await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
    await page.waitForTimeout(2000);
    out.twoSecondsAfter = await page.evaluate(() => ({
      toast: [...document.querySelectorAll('.q-notification')].map(e => (e.innerText||'').replace(/\s+/g,' ').trim()),
      changedBySomeoneElse: /changed by someone else/.test(document.body?.innerText || ''),
      editRowOpen: !!document.querySelector('[data-test-id="inline_part_edit_row"]') }));
    await page.waitForTimeout(5000);
    out.sevenSecondsAfter = await page.evaluate(() => ({
      toast: [...document.querySelectorAll('.q-notification')].map(e => (e.innerText||'').replace(/\s+/g,' ').trim()),
      changedBySomeoneElse: /changed by someone else/.test(document.body?.innerText || ''),
      editRowOpen: !!document.querySelector('[data-test-id="inline_part_edit_row"]') }));
    await page.screenshot({ path: `${OUT}/evidence/last-concurrent.png`, fullPage: true });
  } finally { await apiPost('/api/exit-switch-user', {}).catch(() => {}); }
  return out;
};

P['L2-where-is-the-message'] = async () => {
  let seen = null;
  await page.route('**/api/work-orders/part/make-request', async route => {
    if (route.request().method() === 'POST' && !seen) {
      seen = true;
      return route.fulfill({ status: 500, contentType: 'application/json',
        body: JSON.stringify({ errors: [{ error: 'ZZAUTOTEST forced failure' }] }) });
    }
    return route.continue();
  });
  const l = await land();
  if (!l.add) { await page.unroute('**/api/work-orders/part/make-request'); return { POSITIVE_CONTROL_FAILED: l }; }
  await page.evaluate(() => document.querySelector('[data-test-id="button_add_part"]')?.click());
  await page.waitForTimeout(4000);
  await set('input_inline_part_description', 'ZZAUTOTEST where ' + Date.now());
  await set('input_inline_part_quantity', '1');
  await set('input_inline_part_cost', '1.00');
  await set('input_inline_part_sell_price', '2.00');
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(2500);
  const found = await page.evaluate(() => {
    const NEEDLE = 'add the part';
    const hits = [];
    const walk = (el) => {
      for (const ch of el.children) walk(ch);
      if (el.childElementCount === 0) {
        const txt = (el.textContent || '');
        if (txt.includes(NEEDLE)) {
          const r = el.getBoundingClientRect();
          const st = getComputedStyle(el);
          hits.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 90),
                      text: txt.replace(/\s+/g, ' ').trim().slice(0, 120),
                      visible: st.display !== 'none' && st.visibility !== 'hidden' && +st.opacity > 0 && r.width > 0 && r.height > 0,
                      rect: { w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top) } });
        }
      }
    };
    walk(document.body);
    return { hits: hits.slice(0, 6),
             innerTextHasIt: (document.body?.innerText || '').includes(NEEDLE),
             toasts: [...document.querySelectorAll('.q-notification')].map(e => (e.innerText||'').replace(/\s+/g,' ').trim()) };
  });
  await page.unroute('**/api/work-orders/part/make-request');
  await page.screenshot({ path: `${OUT}/evidence/last-message-location.png`, fullPage: true });
  return { interceptedSave: seen, ...found };
};

const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const names = Object.keys(P).filter(n => !ONLY.length || ONLY.some(o => n.startsWith(o)));
for (const n of names) {
  process.stdout.write(`\n### ${n}\n`);
  try { results[n] = await P[n](); console.log(JSON.stringify(results[n], null, 1).slice(0, 3000)); }
  catch (e) { results[n] = { PROBE_ERROR: String(e).slice(0, 300) }; console.log('PROBE ERROR', String(e).slice(0, 300)); }
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 1));
}
await browser.close();
