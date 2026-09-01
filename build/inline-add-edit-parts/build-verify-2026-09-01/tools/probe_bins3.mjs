// probe_bins3.mjs — the Bin Locations modal's Auto and Apply (S7-R13 / S7-R14), which only a TECH
// VIEW user reaches. The Full View add row's "Split across bins…" opens the New Part Request modal
// instead - verified: it carries a per-bin table and Save Part, and has no Auto and no Apply - so
// C45234 has to be driven as the technician.
import { boot, APP, apiGet, apiPost } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const WO = process.env.WO || 'c6d4b883-6f78-4c9e-ab7e-436a6d99c17a';
const TECH = process.env.TECH || '2d36a5f5-c957-45e0-a376-46d24df2a44c';
const PART = process.env.PART || 'S31S-950';
const RESULTS_FILE = `${OUT}/evidence/probe-bins3.json`;
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
const set = async (id, v) => page.evaluate(([i, val]) => {
  const e = document.querySelector(`[data-test-id="${i}"]`);
  const inp = e && (e.matches('input,textarea') ? e : e.querySelector('input,textarea'));
  if (!inp) return false;
  inp.focus(); inp.value = val;
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  inp.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}, [id, v]);
const openRow = async () => { for (let a = 0; a < 3; a++) {
  await page.goto(`${APP}/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await settle();
  await page.evaluate(() => document.querySelector('[data-test-id="button_add_part"]')?.click());
  await page.waitForTimeout(4000);
  if (await page.evaluate(() => !!document.querySelector('[data-test-id="inline_part_row"]'))) return true;
} return false; };
const state = () => page.evaluate(() => {
  const t = document.body?.innerText || '';
  const chip = document.querySelector('[data-test-id="button_pulled_from_bin"]');
  const val = i => { const e = document.querySelector(`[data-test-id="${i}"]`);
    const n = e && (e.matches('input') ? e : e.querySelector('input')); return n ? n.value : null; };
  return { chipLabel: chip ? (chip.innerText || '').replace(/\s+/g,' ').trim() : null,
    chipWarn: chip ? /--warn|warning|negative/.test(chip.className) : null,
    qty: val('input_inline_part_quantity'),
    takesNegative: /takes this bin negative/.test(t),
    defaultSwitched: /Switched to a bin that covers/.test(t),
    nearChip: chip ? (chip.closest('div')?.parentElement?.innerText || '').replace(/\s+/g,' ').trim().slice(0, 300) : null };
});

const out = {};
await apiPost('/api/exit-switch-user', {}).catch(() => {});
const sw = await apiPost('/api/switch-user', { user_id: TECH });
console.log('switch-user', sw.status);
try {
  const mode = await sync();
  console.log('view_mode:', mode);
  if (mode !== 'tech') { console.log('not Tech View — STOP'); }
  else {
    out.rowOpened = await openRow();
    await page.evaluate(() => { const s = document.querySelector('[data-test-id="select_inline_part_number"]');
      const i = s && (s.matches('input') ? s : s.querySelector('input')); (i || s)?.click(); });
    await page.waitForTimeout(900);
    await page.keyboard.type(PART, { delay: 55 });
    await page.waitForTimeout(3800);
    out.card = await page.evaluate(() => (document.querySelector('.q-menu .q-item')?.innerText || '').replace(/\s+/g,' ').trim());
    await page.evaluate(() => document.querySelector('.q-menu .q-item')?.click());
    await page.waitForTimeout(4500);
    await set('input_inline_part_quantity', '2');
    await page.waitForTimeout(2500);
    out.beforeSplit = await state();
    await page.evaluate(() => document.querySelector('[data-test-id="button_pulled_from_bin"]')?.click());
    await page.waitForTimeout(3200);
    out.splitClicked = await page.evaluate(() => {
      const it = [...document.querySelectorAll('.q-menu .q-item, .q-dialog .q-item')].find(e => /split across/i.test(e.innerText || ''));
      if (!it) return false; it.click(); return true; });
    await page.waitForTimeout(4500);
    out.modal = await page.evaluate(() => {
      const d = document.querySelector('.q-dialog');
      if (!d) return { open: false };
      const t = (d.innerText || '').replace(/\s+/g, ' ');
      return { open: true, title: t.slice(0, 50), exposesPricing: /cost|sell price|margin/i.test(t),
        rows: [...d.querySelectorAll('tr')].map(r => ({
          text: (r.innerText || '').replace(/\s+/g,' ').trim().slice(0, 90),
          errorStyled: /negative|error|text-red|text-negative/.test(r.className + ' ' +
            [...r.querySelectorAll('*')].map(c => c.className).join(' ')) })).filter(r => r.text),
        amountInputs: [...d.querySelectorAll('input')].map(i => i.getAttribute('data-test-id')).filter(x => /bin_amount|bin_quantity/.test(x || '')),
        hasAuto: !!d.querySelector('[data-test-id="button_auto_bin_locations"]'),
        hasApply: !!d.querySelector('[data-test-id="button_apply_bin_locations"]'),
        note: (t.match(/Nothing allocated[^.]*\.|Allocated[^.]*\./) || [])[0] || null };
    });
    // Auto, then read what it distributed
    out.autoClicked = await page.evaluate(() => {
      const b = document.querySelector('[data-test-id="button_auto_bin_locations"]');
      if (!b) return false; b.click(); return true; });
    await page.waitForTimeout(3200);
    out.afterAuto = await page.evaluate(() => {
      const d = document.querySelector('.q-dialog');
      return { amounts: [...(d?.querySelectorAll('input') || [])].map(i => ({ id: i.getAttribute('data-test-id'), v: i.value })),
               note: ((d?.innerText || '').match(/Nothing allocated[^.]*\.|Allocated[^.]*\.|Total[^.]*\./) || [])[0] || null };
    });
    // hand-enter a split across two bins, then Apply
    out.entered = await page.evaluate(() => {
      const d = document.querySelector('.q-dialog');
      const ins = [...(d?.querySelectorAll('input') || [])].filter(i => /bin_amount|bin_quantity/.test(i.getAttribute('data-test-id') || ''));
      const vals = [];
      ins.slice(0, 2).forEach((i, n) => { i.focus(); i.value = String(n === 0 ? 3 : 4);
        i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true }));
        vals.push({ id: i.getAttribute('data-test-id'), v: i.value }); });
      return vals; });
    await page.waitForTimeout(2200);
    out.applyState = await page.evaluate(() => {
      const b = document.querySelector('[data-test-id="button_apply_bin_locations"]');
      return b ? { present: true, disabled: b.disabled } : { present: false }; });
    out.applyClicked = await page.evaluate(() => {
      const b = document.querySelector('[data-test-id="button_apply_bin_locations"]');
      if (!b || b.disabled) return false; b.click(); return true; });
    await page.waitForTimeout(4500);
    out.afterApply = await state();
    await page.screenshot({ path: `${OUT}/evidence/bin3-tech-apply.png`, fullPage: true });
  }
} finally {
  await apiPost('/api/exit-switch-user', {}).catch(() => {});
}
console.log(JSON.stringify(out, null, 1).slice(0, 3000));
results['T1-tech-bin-locations-apply'] = out;
fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 1));
await browser.close();
