// probe_cross.mjs — the two cases that can only be settled by looking at the SAME part through BOTH
// view modes: what a Tech View add/edit does to values Tech View never shows.
//   S2-R11 (C45007) a part added in Tech View is categorised "Uncategorized", and the category is
//                   not shown to the technician - so a Full View user has to confirm the category.
//   S3-R7  (C45028) cost, sell price and category are PRESERVED when a technician saves an inline
//                   edit - so the part is given those values as the admin first, edited as the
//                   technician, and read back as the admin.
import { boot, APP, apiGet, apiPost } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const WO = process.env.WO || 'c6d4b883-6f78-4c9e-ab7e-436a6d99c17a';
const TECH = process.env.TECH || '2d36a5f5-c957-45e0-a376-46d24df2a44c';
const RESULTS_FILE = `${OUT}/evidence/probe-cross.json`;
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
    const n = await page.evaluate(() => document.querySelectorAll('[data-test-id="button_add_part"]').length);
    if (n) return n;
  } return 0; };
const set = async (id, v) => page.evaluate(([i, val]) => {
  const e = document.querySelector(`[data-test-id="${i}"]`);
  const inp = e && (e.matches('input,textarea') ? e : e.querySelector('input,textarea'));
  if (!inp) return false;
  inp.focus(); inp.value = val;
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  inp.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}, [id, v]);
const openAddRow = async () => { await land();
  await page.evaluate(() => document.querySelector('[data-test-id="button_add_part"]')?.click());
  await page.waitForTimeout(4000);
  return page.evaluate(() => !!document.querySelector('[data-test-id="inline_part_row"]')); };
// read a part's full record from the API, which is where category / cost / sell live
// 🛑 list-requests IGNORES work_order_id and answers with 100 rows from across the estate, so the
// filter has to happen here. Without it every lookup matches nothing.
const partByDescription = async (desc) => {
  const r = await apiGet(`/api/work-orders/part/list-requests?work_order_id=${WO}&rowsPerPage=250`);
  const raw = (r.body?.data?.collection) || r.body?.data || [];
  const list = (Array.isArray(raw) ? raw : []).filter(x => x.work_order_id === WO);
  return list.find(x => (x.description || '').trim() === desc.trim()) || null;
};

const P = {};

// C45007 — a part added by a TECHNICIAN must come out categorised Uncategorized
P['X1-tech-added-category'] = async () => {
  await apiPost('/api/exit-switch-user', {}).catch(() => {});
  const sw = await apiPost('/api/switch-user', { user_id: TECH });
  if (sw.status >= 400) return { impersonateFailed: sw.status };
  const tag = 'ZZAUTOTEST tvcat ' + Date.now();
  let asTech = {}, asAdmin = {};
  try {
    const mode = await sync();
    const opened = await openAddRow();
    asTech.viewMode = mode; asTech.rowOpened = opened;
    asTech.categoryFieldOnRow = await page.evaluate(() =>
      !!document.querySelector('[data-test-id="select_inline_part_category"]'));
    await set('input_inline_part_description', tag);
    await set('input_inline_part_quantity', '1');
    await page.waitForTimeout(1000);
    await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
    await page.waitForTimeout(6000);
    asTech.saved = await page.evaluate(t => [...document.querySelectorAll('[data-test-id="button_edit_part"]')]
      .some(b => ((b.closest('tr') || b.parentElement?.closest('div'))?.innerText || '').includes(t)), tag);
  } finally {
    await apiPost('/api/exit-switch-user', {}).catch(() => {});
  }
  // back as the admin: read the category off the record and off the Full View edit modal
  const rec = await partByDescription(tag);
  asAdmin.record = rec ? { description: rec.description, part_category_id: rec.part_category_id,
                           cost: rec.cost, sell_price: rec.sell_price,
                           status: rec.status, status_label: rec.status_label } : null;
  await land();
  asAdmin.modal = await page.evaluate(t => {
    const b = [...document.querySelectorAll('[data-test-id="button_edit_part"]')]
      .find(x => ((x.closest('tr') || x.parentElement?.closest('div'))?.innerText || '').includes(t));
    if (!b) return null; b.click(); return 'clicked'; }, tag);
  await page.waitForTimeout(4500);
  asAdmin.modalCategory = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    const t = (d?.innerText || '').replace(/\s+/g, ' ');
    const m = t.match(/Category\s+([A-Za-z0-9 ,()&/-]+?)\s+arrow_drop_down/);
    return { text: t.slice(0, 260), category: m ? m[1].trim() : null };
  });
  await page.screenshot({ path: `${OUT}/evidence/cross-tech-category.png`, fullPage: true });
  return { tag, asTech, asAdmin };
};

// C45028 — cost, sell price and category survive a technician's inline edit
P['X2-hidden-values-preserved'] = async () => {
  const tag = 'ZZAUTOTEST preserve ' + Date.now();
  // 1. as the admin, create the part WITH a cost, a sell price and a real category
  await land();
  const opened = await openAddRow();
  await set('input_inline_part_description', tag);
  await set('input_inline_part_quantity', '2');
  await set('input_inline_part_cost', '7.77');
  await set('input_inline_part_sell_price', '19.19');
  const category = await page.evaluate(() => {
    const e = document.querySelector('[data-test-id="select_inline_part_category"]');
    (e?.querySelector('input') || e)?.click(); return true; });
  await page.waitForTimeout(2500);
  const chosenCategory = await page.evaluate(() => {
    const items = [...document.querySelectorAll('.q-menu .q-item')];
    const it = items.find(e => /^AUTO-Batteries$/i.test((e.innerText || '').trim())) || items[2] || items[1];
    const label = (it?.innerText || '').replace(/\s+/g, ' ').trim(); it?.click(); return label; });
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
  await page.waitForTimeout(6000);
  const created = await partByDescription(tag);
  const before = created ? { cost: created.cost, sell: created.sell_price,
                             category: created.part_category_id } : null;

  // 2. as the TECHNICIAN, edit only the description
  const newTag = tag + ' edited';
  let techLeg = {};
  await apiPost('/api/exit-switch-user', {}).catch(() => {});
  const sw = await apiPost('/api/switch-user', { user_id: TECH });
  try {
    if (sw.status >= 400) { techLeg.impersonateFailed = sw.status; }
    else {
      techLeg.viewMode = await sync();
      await land();
      techLeg.editOpened = await page.evaluate(t => {
        const b = [...document.querySelectorAll('[data-test-id="button_edit_part"]')]
          .find(x => ((x.closest('tr') || x.parentElement?.closest('div'))?.innerText || '').includes(t));
        if (!b) return false; b.click(); return true; }, tag);
      await page.waitForTimeout(4500);
      techLeg.rowFields = await page.evaluate(() => {
        const r = document.querySelector('[data-test-id="inline_part_edit_row"]');
        return r ? [...new Set([...r.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')))] : null; });
      await set('input_inline_part_description', newTag);
      await page.waitForTimeout(1000);
      await page.evaluate(() => document.querySelector('[data-test-id="button_save_inline_part"]')?.click());
      await page.waitForTimeout(6000);
    }
  } finally { await apiPost('/api/exit-switch-user', {}).catch(() => {}); }

  // 3. as the admin again, read the hidden values back
  const after = await partByDescription(newTag);
  const afterVals = after ? { cost: after.cost, sell: after.sell_price,
                              category: after.part_category_id } : null;
  await page.screenshot({ path: `${OUT}/evidence/cross-preserved.png`, fullPage: true });
  return { tag, newTag, rowOpened: opened, chosenCategory, before, techLeg, after: afterVals,
           preserved: !!(before && afterVals && String(before.cost) === String(afterVals.cost)
             && String(before.sell) === String(afterVals.sell) && String(before.category) === String(afterVals.category)) };
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
