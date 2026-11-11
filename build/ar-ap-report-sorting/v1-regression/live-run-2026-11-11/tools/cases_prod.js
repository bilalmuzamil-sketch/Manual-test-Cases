// The V1 side on PRODUCTION (app.shopview.com, v26.45.3-fc08f23), used only to confirm a QA failure.
// Same rule: through the screen. V1 has no Customer/Vendor chips on most reports, so records are found by name.
const Q = require('./cases_qa.js'); const { verdict, chk, US } = Q; const C = {};
const { execSync } = require('child_process');
const pdfText = (p) => execSync(`pdftotext -layout "${p}" -`).toString();
async function go(x, report) { await x.lib.reportsHome(x.page, x.app); await x.lib.nav(x.page, report); }
async function table(page) {
  return page.evaluate(() => { const t = document.querySelector('[data-test-id$="_report_table"] table') || document.querySelector('table'); if (!t) return { heads: [], rows: [] };
    const heads = [...t.querySelectorAll('thead th')].map((h) => h.innerText.replace(/arrow_drop_(up|down)/, '').trim());
    const rows = [...t.querySelectorAll('tbody tr')].map((tr) => [...tr.querySelectorAll('td')].map((td) => td.innerText.replace(/\s+/g, ' ').trim())).filter((r) => r.some(Boolean));
    return { heads, rows }; });
}
const byName = (tb) => Object.fromEntries(tb.rows.map((r) => [r[0], Object.fromEntries(tb.heads.map((h, i) => [h, r[i]]))]));
C['V1R-07'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Summary'); const t0 = byName(await table(page)); x.ev.push(await lib.shot(page, x.key, 'V1 today'));
  const s = await lib.setDate(page, '2026-12-31'); const c = await lib.chip(page, 'asOfDate'); const t1 = byName(await table(page)); x.ev.push(await lib.shot(page, x.key, 'V1 as of 2026-12-31'));
  const money = (v) => Number(String(v || '0').replace(/[$,]/g, '')) || 0;
  const moved = Object.keys(t0).filter((n) => t1[n] && money(t0[n].Current) > 0 && money(t1[n].Current) < money(t0[n].Current)).slice(0, 3).map((n) => `${n}: Current ${t0[n].Current} today -> ${t1[n].Current || '(blank)'} on 12/31, 1-30 Days ${t0[n]['1-30 Days'] || '(blank)'} -> ${t1[n]['1-30 Days'] || '(blank)'}`);
  x.ev.push(lib.saveText(x.key, 'V1 rows today and 2026-12-31', { today: t0, future: t1 }));
  return verdict([chk('V1 Step 4: the last day of next month can be picked', s.ok, s.ok ? 'picked' : s.why), chk('V1 Step 5: chip shows that future date', (c || '').includes('2026-12-31'), c), chk('V1 Step 6: an invoice not due today has moved out of Current', moved.length > 0, moved.join(' | ') || 'no customer\'s Current dropped')]);
};
C['V1R-08'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/P Aging Summary'); const t0 = await table(page);
  const u = new URL(page.url()); u.searchParams.set('asOfDate', '2026-12-31'); await page.goto(u.toString(), { waitUntil: 'domcontentloaded' }); await lib.settle(page, 3000); await page.waitForSelector('tbody tr', { timeout: 30000 }).catch(() => {});
  const c = await lib.chip(page, 'asOfDate'); const t1 = await table(page); x.ev.push(await lib.shot(page, x.key, 'V1 step 5 after opening the link'));
  const changed = JSON.stringify(t0.rows.slice(0, 10)) !== JSON.stringify(t1.rows.slice(0, 10));
  x.ev.push(lib.saveText(x.key, 'V1 first rows today and from the link', { today: t0.rows.slice(0, 8), link: t1.rows.slice(0, 8), url: u.toString() }));
  return verdict([chk('V1 Step 5: chip shows 2026-12-31 and the report is worked out for that date', (c || '').includes('2026-12-31') && changed, `${c}; figures differ from today's: ${changed}`)]);
};
C['V1R-35'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Detail'); let pick = null, heads = [];
  for (const d of ['2026-11-11', '2026-01-01', '2025-07-01', '2025-01-01', '2024-07-01', '2024-01-01']) {
    if (d !== '2026-11-11') { const s = await lib.setDate(page, d); if (!s.ok) continue; }
    heads = await page.evaluate(() => [...document.querySelectorAll('tbody tr')].map((r) => r.innerText.replace(/\s+/g, ' ').trim()).filter((t) => /days past due \(\d+\)|Current \(\d+\)/.test(t)));
    const empty = heads.find((h) => /\(0\)/.test(h)); if (empty) { pick = { date: d, empty }; break; }
  }
  x.ev.push(await lib.shot(page, x.key, 'V1 step 3 bucket with (0)'));
  if (!pick) return { verdict: 'BLOCKED', observed: 'No date tried on production had an empty bucket: ' + heads.join(' / ') };
  const bucket = pick.empty.match(/(91 or more days past due|\d+-\d+ days past due|Current)/)[1];
  // V1's Print fetches the PDF (/api/reporting/account-receivable/pdf) and opens it in a new tab; the PDF is taken from that response.
  const [resp] = await Promise.all([page.waitForResponse((r) => /account-receivable\/pdf/.test(r.url()), { timeout: 120000 }).catch(() => null), page.click('[data-test-id="ar_report_print"]')]);
  let txt = ''; const dl = resp && resp.status() === 200;
  if (dl) { const f = `${x.key} - V1 step 5 print PDF.pdf`; require('fs').writeFileSync(require('path').join(lib.EVID, f), await resp.body()); x.ev.push(f); txt = pdfText(require('path').join(lib.EVID, f)); }
  x.ev.push(lib.saveText(x.key, 'V1 PDF text', { date: pick.date, bucket, lines: txt.split('\n').filter((l) => l.trim()) }));
  const flat = txt.replace(/\s+/g, ' ');
  return { ...verdict([chk(`V1 Step 3: ${bucket} shows (0) on ${pick.date}`, true, pick.empty), chk(`V1 Step 7: the PDF prints "${bucket}" and "Total for ${bucket}" with $0.00`, flat.includes(bucket) && new RegExp(`Total for ${bucket.replace(/[-]/g, '\\-')} \\$?0\\.00`).test(flat), dl ? (flat.match(new RegExp(`Total for ${bucket}[^$]*\\$[-\\d,.]+`)) || ['no Total for line'])[0] : 'no download')]), facts: pick };
};
module.exports = C;
const H = () => require('./cases_qa.js')._helpers();
C['V1R-68'] = async (x) => {
  const r = await H().infoIcon(x, 'Parts Velocity', '[data-test-id*="info"][data-test-id*="units_sold"], th:has-text("Units Sold") i:has-text("info"), [aria-label*="Units Sold"]', 'V1 step 3');
  if (r.blocked || r.missing) return { verdict: 'BLOCKED', observed: 'V1: ' + (r.blocked ? 'section did not load' : 'icon not located') };
  const { page, lib } = x; let r7 = '', r8 = '';
  let tabs = 0, found = false; await page.evaluate(() => document.activeElement && document.activeElement.blur()); for (let i = 0; i < 200; i++) { tabs++; await page.keyboard.press('Tab'); const f = await page.evaluate(() => { const a = document.activeElement; return a ? (a.getAttribute('aria-label') || '') + ' ' + (a.getAttribute('data-test-id') || '') : ''; }); if (/^Units Sold:|units_sold_info/.test(f.trim())) { found = true; await lib.sleep(900); r7 = await page.evaluate(() => [...document.querySelectorAll('.q-tooltip, [role="tooltip"]')].map((e) => e.innerText.trim()).join(' | ')); break; } }
  await page.keyboard.press('Escape'); await lib.sleep(800); r8 = await page.evaluate(() => [...document.querySelectorAll('.q-tooltip, [role="tooltip"]')].map((e) => e.innerText.trim()).join(' | '));
  return verdict([chk('V1 Step 3: appears', !!r.hover, r.hover), chk('V1 Step 4: disappears', !r.away, r.away || '(nothing)'), chk('V1 Step 5: click shows it', !!r.click1, r.click1 || '(nothing)'), chk('V1 Step 6: click again hides it', !r.click2, r.click2 || '(nothing)'), chk('V1 Step 7: Tab focus shows it', !!r7, (r7 || '(nothing)') + ` [icon reached by Tab: ${found}, after ${tabs} presses]`), chk('V1 Step 8: Escape hides it', !r8, r8 || '(nothing)')]);
};
C['V1R-70'] = async (x) => {
  const r = await H().infoIcon(x, 'Work In Progress', 'main i:has-text("info_outline"):not([data-test-id^="icon_"]), main [data-test-id*="summary"] i:has-text("info")', 'V1 step 3');
  if (r.blocked || r.missing) return { verdict: 'BLOCKED', observed: 'V1: ' + (r.blocked ? 'section did not load' : 'icon not located') };
  return verdict([chk('V1 Step 3: appears', !!r.hover, r.hover), chk('V1 Step 4: disappears', !r.away, r.away || '(nothing)'), chk('V1 Step 5: click shows it', !!r.click1, r.click1 || '(nothing)'), chk('V1 Step 6: click again hides it', !r.click2, r.click2 || '(nothing)')]);
};
C['V1R-36'] = async (x) => {
  const { page, lib } = x; await go(x, 'A/R Aging Collection'); await page.waitForSelector('tbody tr', { timeout: 30000 }).catch(() => {});
  // V1's Customer chip lists customers only after typing: take the first customer group on screen, type its name, pick it
  const name = await page.evaluate(() => { const r = [...document.querySelectorAll('tbody tr')].map((t) => t.innerText.replace(/\s+/g, ' ').trim()).find((t) => /\(\d+\)/.test(t)); return r ? r.replace(/^(arrow_drop_down|keyboard_arrow_right|arrow_right)\s*/, '').replace(/\s*\(\d+\).*/, '') : null; });
  await page.click('[data-test-id="filter_chip_customerId"]'); await lib.sleep(800); await page.fill('input[data-test-id="filter_search_customerId"], [data-test-id="filter_search_customerId"] input', name);
  const opt = page.locator('.q-menu [data-test-id^="filter_option_customerId"], .q-menu .q-item', { hasText: name }).first();
  for (let i = 0; i < 20 && !(await opt.count()); i++) await lib.sleep(500);
  await opt.click(); await lib.sleep(800); await page.keyboard.press('Escape'); await lib.settle(page, 2500);
  x.ev.push(await lib.shot(page, x.key, 'V1 step 3 customer picked'));
  const [resp] = await Promise.all([page.waitForResponse((r) => /\/pdf/.test(r.url()) && /account-receivable|collection/.test(r.url()), { timeout: 120000 }).catch(() => null), page.click('[data-test-id="ar_report_print"]')]);
  let txt = ''; if (resp && resp.status() === 200) { const f = `${x.key} - V1 step 5 print PDF.pdf`; require('fs').writeFileSync(require('path').join(lib.EVID, f), await resp.body()); x.ev.push(f); txt = pdfText(require('path').join(lib.EVID, f)); }
  const lines = txt.split('\n').filter((l) => l.trim()); x.ev.push(lib.saveText(x.key, 'V1 PDF text', { customer: name, lines }));
  const flat = txt.replace(/\s+/g, ' ');
  return { ...verdict([chk(`V1 Step 7: only the picked customer (${name}), with its lines, a "Total for" line for it and a Totals row`, flat.includes(name) && flat.includes('Total for ' + name) && /Totals/.test(flat), resp ? lines.filter((l) => /Total/.test(l)).map((l) => l.trim().replace(/\s+/g, ' ')).join(' / ') : 'no PDF response')]), facts: { picked: name } };
};
