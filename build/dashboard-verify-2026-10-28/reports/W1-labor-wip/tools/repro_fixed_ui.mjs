// Fixed Labor price in Work In Progress — reproduction THROUGH THE SCREEN (DVI Test).
// The empty work order (customer "ZZAUTOTEST WIP FX1") was created beforehand; an empty work order opens
// the New Line window by itself. Steps: pick canned line -> Save & close -> open the line -> Labor rate =
// Fixed Labor Total -> Fixed Labor = 500 -> Save & close -> read the line -> open Reports > Work In Progress.
// Screenshots (deviceScaleFactor 2) + log to OUT. SECRET-FREE.
// Usage: node repro_fixed_ui.mjs <workOrderId> <outDir> [phase]   phase: setup | report
import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { login, api } from '/home/user/Manual-test-Cases/build/testing-tools/staging-admin.mjs';
const [WO, OUT, PHASE = 'setup'] = process.argv.slice(2);
const WP = '39522bc6-abca-4f67-bd12-2840043c2d68', TZ = 'America/Toronto', APP = 'https://app.staging.shopview.com';
fs.mkdirSync(OUT, { recursive: true });
const t = await login('admin');
await api(t.sessCookie, 'POST', '/api/iam/change-location', { workplace_id: WP, workplace_timezone: TZ });
const fe = await api(t.sessCookie, 'GET', '/api/auth/me/fe-permissions');
const cookies = t.sessCookie.split('; ').map(p => { const i = p.indexOf('='); return { name: p.slice(0, i), value: p.slice(i + 1), domain: '.staging.shopview.com', path: '/' }; });
const browser = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: process.env.HTTPS_PROXY }, args: ['--no-sandbox', '--ignore-certificate-errors', '--ssl-version-max=tls1.2'] });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, timezoneId: TZ });
await ctx.addCookies(cookies);
const page = await ctx.newPage();
await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.evaluate(({ u, f, w }) => { localStorage.setItem('user', JSON.stringify(u)); localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f)); if (u.data?.token) localStorage.setItem('token', JSON.stringify(u.data.token)); localStorage.setItem('location', JSON.stringify(w)); }, { u: { data: t.data }, f: fe.body?.data, w: WP });
const log = []; let n = 0;
const B = b => b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
const shot = async (name, note, boxes = {}) => { n++; const f = `${OUT}/${String(n).padStart(2, '0')}-${name}.png`; await page.screenshot({ path: f }); const bx = {}; for (const [k, l] of Object.entries(boxes)) bx[k] = B(await l.first().boundingBox({ timeout: 3000 }).catch(() => null)); log.push({ step: n, name, note, url: page.url().replace(/^.*shopview.com/, ''), boxes: bx }); console.log(n, name, note || ''); };
const posts = []; page.on('response', async r => { if (r.request().method() === 'POST' && r.url().includes('/api/')) { let b = ''; try { b = (await r.text()).slice(0, 200); } catch {} posts.push(`${r.status()} ${r.url().replace(/^.*\/api/, '')} ${r.request().postData()?.slice(0, 400) || ''} => ${b}`); } });
try {
  if (PHASE === 'setup') {
    await page.goto(`${APP}/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
    let dlg = page.locator('.q-dialog').last();
    if (!(await dlg.count())) { await page.locator('button').filter({ hasText: /^New Line$/ }).first().click(); await page.waitForTimeout(2500); dlg = page.locator('.q-dialog').last(); }
    await shot('new-line-window', 'opened by itself on the empty work order');
    await dlg.locator('.q-select').first().click(); await page.waitForTimeout(1500);
    log.push({ cannedOptions: (await page.locator('.q-menu .q-item').allInnerTexts()).slice(0, 15) });
    await page.locator('.q-menu .q-item').filter({ hasText: '3x inspection' }).first().click(); await page.waitForTimeout(1500);
    await shot('canned-line-picked', '3x inspection');
    await dlg.getByText(/Save & Close/i).first().click(); await page.waitForTimeout(6000);
    await shot('line-added', 'after Save & Close', { line: page.getByText('Test DVI Line') });
    // open the line to edit it
    await page.getByText('Test DVI Line').first().click(); await page.waitForTimeout(3000);
    dlg = page.locator('.q-dialog').last();
    log.push({ editDialog: (await dlg.innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 600) });
    await shot('line-window', 'line opened');
    const rate = dlg.locator('.q-field').filter({ hasText: 'Labor rate' }).first();
    await rate.click(); await page.waitForTimeout(1500);
    log.push({ rateOptions: (await page.locator('.q-menu .q-item').allInnerTexts()) });
    await page.locator('.q-menu .q-item').filter({ hasText: 'Fixed Labor Total' }).first().click(); await page.waitForTimeout(1500);
    const fx = dlg.locator('[data-test-id="input_fixed_labor"] input, input[name="Fixed Labor"]').first();
    await fx.click(); await fx.fill('500'); await page.waitForTimeout(800);
    await shot('fixed-labor-500', 'Labor rate = Fixed Labor Total, Fixed Labor = 500', { fixed: dlg.locator('[data-test-id="input_fixed_labor"]'), rate });
    await dlg.getByText(/Save & close/i).first().click(); await page.waitForTimeout(6000);
    await shot('line-saved', 'after Save & close', { line: page.getByText('Test DVI Line'), total: page.getByText('$500.00') });
    log.push({ linesText: (await page.locator('main').innerText()).replace(/\n+/g, ' | ').slice(0, 1500) });
  } else if (PHASE === 'approve' || PHASE === 'complete') {
    await page.goto(`${APP}/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
    const label = PHASE === 'approve' ? 'Approve' : 'Complete';
    await page.locator('button').filter({ hasText: new RegExp('^' + label + '$') }).first().click(); await page.waitForTimeout(5000);
    if (await page.locator('.q-dialog').count()) {
      const dlg = page.locator('.q-dialog').last();
      log.push({ dialog: (await dlg.innerText()).replace(/\n+/g, ' | ').slice(0, 500) });
      await shot(PHASE + '-dialog', 'dialog');
      const vin = dlg.locator('input').first();
      if (/VIN/i.test(await dlg.innerText()) && await vin.count()) { await vin.fill('ZZTESTVINFX200001'); await page.waitForTimeout(500); }
      const ok = dlg.locator('button').filter({ hasText: /Finish Work Order|Complete|Confirm|Save|OK|Yes/i }).last();
      if (await ok.count()) { await ok.click(); await page.waitForTimeout(5000); }
    }
    await shot(PHASE + 'd', 'after ' + label, { status: page.getByText(/^(Approved|Complete|Completed)$/), total: page.getByText('$500') });
    log.push({ linesText: (await page.locator('main').innerText()).replace(/\n+/g, ' | ').slice(0, 900) });
  } else if (PHASE === 'report') {
    await page.goto(APP + '/reports/work-in-progress', { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForSelector('[data-test-id="wip_summary_strip"]', { timeout: 90000 }); await page.waitForTimeout(8000);
    meta: {
      const tabs = page.locator('[data-test-id="page_work_in_progress_report"] .q-tab');
      for (let i = 0; i < await tabs.count(); i++) {
        await tabs.nth(i).click(); await page.waitForTimeout(5000);
        const row = page.locator('[data-test-id="table_work_in_progress_report"] tbody tr').filter({ hasText: process.argv[5] || 'ZZAUTOTEST WIP FX1' });
        const cnt = await row.count();
        const texts = []; for (let k = 0; k < cnt; k++) texts.push((await row.nth(k).innerText()).replace(/\s+/g, ' '));
        log.push({ tab: (await tabs.nth(i).innerText()).replace(/\s+/g, ' '), rows: texts });
        if (cnt) await shot(`wip-tab-${i + 1}`, texts.join(' || '), { row: row, strip: page.locator('[data-test-id="wip_summary_strip"]'), tab: tabs.nth(i), header: page.locator('[data-test-id="table_work_in_progress_report"] thead') });
      }
    }
  }
} catch (e) { log.push({ error: e.message.split('\n')[0] }); await shot('error', e.message.split('\n')[0]); }
fs.writeFileSync(`${OUT}/log.json`, JSON.stringify({ observed_at_utc: new Date().toISOString(), appVersion: await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null), log, posts }, null, 1));
await browser.close();
