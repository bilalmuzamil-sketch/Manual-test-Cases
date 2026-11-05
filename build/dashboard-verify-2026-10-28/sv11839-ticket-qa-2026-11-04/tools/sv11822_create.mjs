// sv11822_create.mjs — create location "DVI Test" on sv11839 ON SCREEN (Settings → Locations → Add), copying staging's DVI Test
// (SV-11822/staging-dvi-test-record.json). Run at Heavy Duty (TZ=America/Edmonton). SECRET-FREE. Usage: node sv11822_create.mjs [probe|save]
import fs from 'fs';
import { boot, finish, shot, sleep, LOC, APP, API, OUT } from './common.mjs';
const loc = LOC.HD; const T = 'SV-11822'; const mode = process.argv[2] || 'probe';
const SRC = JSON.parse(fs.readFileSync(`${OUT}/${T}/staging-dvi-test-record.json`, 'utf8'))['GET /api/workplaces record'];
const { browser, page, rule99, app_version } = await boot(loc, { dest: '/administration/locations' });
const net = []; page.on('request', r => { if (r.url().includes('/api/workplaces/create')) net.push({ sent: r.postData() }); });
page.on('response', async r => { if (r.url().includes('/api/workplaces/create')) { let b = ''; try { b = (await r.text()).slice(0, 300); } catch {} net.push({ status: r.status(), body: b }); } });
await page.goto(APP + '/administration/locations', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(8000);
const P = { app_version, rule99_start: rule99, source: SRC };
await page.locator('[data-test-id="button_add_workplace"]').first().click(); await sleep(3000);
const dlg = page.locator('.q-dialog').last();
P.dialog_ids = await dlg.evaluate(d => [...d.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')));
const inp = id => dlg.locator(`[data-test-id="${id}"]`).first().locator('xpath=self::input | .//input').first();
const pick = async (sel, typed, want) => { await sel.click(); await sleep(700); await page.keyboard.type(typed, { delay: 40 }); await sleep(1500);
  P.menus = P.menus || {}; P.menus[typed] = (await page.locator('.q-menu').last().innerText().catch(() => '')).split('\n').slice(0, 8);
  const o = page.locator('.q-menu .q-item').filter({ hasText: want }).first(); const n = await o.count(); if (n) { await o.click(); await sleep(800); } else await page.keyboard.press('Escape'); return n > 0; };
P.fill = {};
await inp('input_name').fill('DVI Test');
await inp('input_shop_id').fill(SRC.shop_id).catch(e => P.fill.shop_id = e.message.slice(0, 80));
await inp('input_address_1').fill(SRC.address_1); await inp('input_city').fill(SRC.city);
P.fill.country = await pick(dlg.locator('[data-test-id="select_country_code"]').first(), 'United', /United States/);
P.fill.state = await pick(dlg.locator('[data-test-id="select_state_or_province"]').first(), 'Haw', /Hawaii/);
P.fill.tax = await pick(dlg.locator('[data-test-id="select_tax"]').first(), 'Zero', /Zero Rated/);
await inp('input_postal_code').fill(SRC.postal_code);
P.fill.timezone = await pick(dlg.locator('[data-test-id="select_timezone"]').first(), 'Fiji', /Fiji/);
await inp('input_telephone').fill(SRC.telephone.replace(/\D/g, '')).catch(e => P.fill.telephone = e.message.slice(0, 80));
await inp('input_default_color').fill(SRC.color).catch(e => P.fill.color = e.message.slice(0, 80));
await sleep(800);
P.values = await dlg.evaluate(d => [...d.querySelectorAll('label')].map(l => [l.innerText.replace(/\s+/g, ' ').trim().slice(0, 40), (l.querySelector('input')?.value) ?? '']).filter(x => x[0]));
P.pic_filled = await shot(page, T, 'dvi-0-create-location-filled', { fullPage: true });
if (mode === 'save') {
  await dlg.locator('[data-test-id="button_save_workplace"]').first().click(); await sleep(6000);
  P.toasts = await page.locator('.q-notification').allInnerTexts().catch(() => []);
  P.after = await page.evaluate(async api => { const g = async p => (await (await fetch(api + p, { credentials: 'include', headers: { Accept: 'application/json' } })).json()).data.collection;
    return { workplaces: (await g('/workplaces')).find(w => w.name === 'DVI Test') || null, my_workplaces: (await g('/staff/my-workplaces')).map(w => w.name) }; }, API);
  P.pic_saved = await shot(page, T, 'dvi-1-locations-list-after-create');
}
P.net = net; P.rule99_end = await finish(page, loc, rule99);
fs.writeFileSync(`${OUT}/${T}/evidence-create-dvi-test-${mode}.json`, JSON.stringify({ ticket: T, ...P }, null, 1));
console.log(JSON.stringify({ ids: P.dialog_ids, fill: P.fill, values: P.values, toasts: P.toasts, net: net.map(n => n.status ? `${n.status} ${n.body.slice(0, 150)}` : 'sent ' + (n.sent || '').slice(0, 600)), after: P.after, r99: P.rule99_end.all_match }).slice(0, 4000));
await browser.close();
