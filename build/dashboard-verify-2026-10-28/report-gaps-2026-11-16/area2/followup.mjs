// Area 2 follow-up: column menus with toggle switches (toggle → reload = memory → restore), sorting by clicking EVERY
// header (aria-sort + the sort request), and download re-tries (second reproduction of the file names; SBC Expanded PDF
// with a 150 s wait). Heavy Duty, Asia/Karachi, 1536x864. Run: TZ=Asia/Karachi node followup.mjs <report> ...
import fs from 'fs'; import { boot, LOC, APP, sleep, rule99, save } from '../tools/sboot.mjs';
const EV = new URL('./evidence/', import.meta.url).pathname; const DL = '/tmp/cln/rg16/a2/fu/'; fs.mkdirSync(DL, { recursive: true });
const loc = LOC.HD; const { browser, ctx, page } = await boot(loc, { viewport: { width: 1536, height: 864 } });
const out = { start: await rule99(page, loc), reports: {} }; const OUTF = EV + 'followup-' + process.argv.slice(2).join('_').replace(/[^a-z_-]/g, '').slice(0, 60) + '.json';
const net = []; page.on('request', r => { const u = r.url(); if (u.includes('api.staging')) net.push(u.replace('https://api.staging.shopview.com', '')); });
const IC = /\b(arrow_drop_up|arrow_drop_down|arrow_upward|arrow_downward|keyboard_double_arrow_down|keyboard_double_arrow_up|info|info_outline|help_outline|unfold_more|expand_more|chevron_right|width_normal|check)\b/g;
const heads = () => page.evaluate(IC => [...document.querySelectorAll('thead th')].filter(t => t.getBoundingClientRect().width > 0).map((t, i) => ({ i, t: t.innerText.replace(new RegExp(IC, 'g'), ' ').replace(/\s+/g, ' ').trim(), aria: t.getAttribute('aria-sort'), cls: t.className.toString().slice(0, 80) })), IC.source);
const menu = () => page.evaluate(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().height > 0).at(-1); if (!m) return [];
  return [...m.querySelectorAll('.q-item')].map((it, i) => { it.setAttribute('data-fu', String(i)); const sw = it.querySelector('[role="switch"], [role="checkbox"], .q-toggle, .q-checkbox');
    const on = sw ? (sw.getAttribute('aria-checked') ?? (sw.querySelector('[aria-checked]')?.getAttribute('aria-checked')) ?? (sw.querySelector('.q-toggle__inner--truthy, .q-checkbox__inner--truthy') ? 'true' : 'false')) : null;
    return { i, t: it.innerText.replace(/\b(check|toggle_on|toggle_off)\b/g, '').replace(/\s+/g, ' ').trim(), on, disabled: it.classList.contains('disabled') || it.getAttribute('aria-disabled') === 'true' }; }); });
async function load(rep) { await page.goto(APP + '/reports/' + rep, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForLoadState('networkidle', { timeout: 40000 }).catch(() => {}); await sleep(7000); }
const colBtn = () => page.locator('[aria-label="Column Selection"]').first(); const expBtn = () => page.locator('[aria-label="Export report"]').first();
for (const rep of process.argv.slice(2)) {
  const R = { report: rep }; out.reports[rep] = R;
  try {
    await load(rep); R.heads0 = await heads();
    // ---- columns
    if (await colBtn().count()) {
      await colBtn().click(); await sleep(1000); R.colmenu = await menu();
      const opt = [...R.colmenu].reverse().find(x => x.on === 'true' && !x.disabled);
      if (opt) {
        await page.locator(`[data-fu="${opt.i}"] .q-toggle__inner, [data-fu="${opt.i}"] [role="switch"], [data-fu="${opt.i}"] [role="checkbox"], [data-fu="${opt.i}"] .q-toggle`).first().click().catch(() => page.locator(`[data-fu="${opt.i}"]`).click()); await sleep(1500); R.colmenu_after_click = (await menu()).find(x => x.i === opt.i); await page.keyboard.press('Escape'); await sleep(900);
        const h1 = (await heads()).map(h => h.t); await load(rep); const h2 = (await heads()).map(h => h.t);
        await colBtn().click(); await sleep(1000); const m2 = await menu(); const back = m2.find(x => x.t === opt.t);
        if (back) { await page.locator(`[data-fu="${back.i}"] .q-toggle__inner, [data-fu="${back.i}"] [role="switch"], [data-fu="${back.i}"] [role="checkbox"], [data-fu="${back.i}"] .q-toggle`).first().click().catch(() => {}); await sleep(1500); } await page.keyboard.press('Escape'); await sleep(900);
        const h3 = (await heads()).map(h => h.t);
        R.columns = { toggled: opt.t, hidden_after_toggle: !h1.includes(opt.t), hidden_after_reload: !h2.includes(opt.t), switch_after_reload: back?.on, shown_after_restore: h3.includes(opt.t), heads_toggle: h1, heads_reload: h2, heads_restore: h3 };
      } else { await page.keyboard.press('Escape'); R.columns = { note: 'no switched-on toggle found' }; }
    }
    if (process.env.COLS_ONLY) { save(OUTF, out); continue; }
    // ---- sorting: click every visible header twice
    await load(rep); R.sorting = [];
    const H = (await heads()).filter(h => h.t).slice(0, 12);
    for (const h of H) {
      const s = { header: h.t, before: h.aria, clicks: [] };
      for (let k = 0; k < 2; k++) { net.length = 0; await page.locator('thead th').nth(h.i).click({ timeout: 5000 }).catch(() => {}); await sleep(3500);
        const now = await heads(); s.clicks.push({ aria: now.find(x => x.i === h.i)?.aria, others_with_aria: now.filter(x => x.i !== h.i && x.aria && x.aria !== 'none').map(x => x.t + ':' + x.aria), sortReq: net.filter(u => /sort|descending/i.test(u)).slice(-1)[0]?.slice(0, 200) || null }); }
      R.sorting.push(s); await page.keyboard.press('Escape');
    }
    // ---- downloads, second reproduction (150 s wait)
    await load(rep); R.downloads = [];
    if (await expBtn().count()) { await expBtn().click(); await sleep(1000); const items = (await menu()).map(x => x.t).filter(t => /download/i.test(t)); await page.keyboard.press('Escape'); await sleep(500);
      for (const it of items) { await expBtn().click(); await sleep(900); const dP = page.waitForEvent('download', { timeout: 150000 }).catch(() => null); const t0 = Date.now();
        await page.locator('.q-menu').last().getByText(it, { exact: true }).first().click().catch(() => {}); const d = await dP;
        const toasts = await page.evaluate(() => [...document.querySelectorAll('.q-notification')].map(n => n.innerText.replace(/\s+/g, ' ').trim()));
        const rec = { item: it, filename: d ? d.suggestedFilename() : null, seconds: Math.round((Date.now() - t0) / 1000), toasts, export_requests: net.filter(u => /export/.test(u)).slice(-1).map(u => u.slice(0, 200)) };
        if (d) { const p = DL + rep + '__' + rec.filename; await d.saveAs(p); rec.bytes = fs.statSync(p).size; }
        R.downloads.push(rec); console.log(rep, it, rec.filename, rec.seconds + 's', toasts.join('|').slice(0, 100)); await page.keyboard.press('Escape'); await sleep(2500); } }
  } catch (e) { R.error = String(e).slice(0, 300); }
  save(OUTF, out); console.log(rep, 'done', JSON.stringify(R.columns || {}).slice(0, 200), R.error || '');
}
out.end = await rule99(page, loc); save(OUTF, out); await browser.close();
