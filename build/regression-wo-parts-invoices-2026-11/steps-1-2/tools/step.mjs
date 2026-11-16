// Generic on-screen step runner for exploration: opens a WO tab, runs a list of actions given as JSON, dumps ids + screenshot + non-GET network. SECRET-FREE.
import fs from 'fs';
import { start, APP, LOC, OUT, netlog, sleep, call, zones } from './common.mjs';
import { tid, inp, ids } from './wo.mjs';
const [route, shot, actionsJson] = process.argv.slice(2);
const actions = JSON.parse(actionsJson || '[]');
const { browser, page } = await start({ workplaceId: LOC.id, timezone: LOC.tz });
const net = []; netlog(page, net);
await page.goto(APP + route, { waitUntil: 'domcontentloaded', timeout: 60000 }); await sleep(6000);
console.log('URL0', page.url());
for (const a of actions) {
  try {
    if (a.click) { const l = a.click.startsWith('text=') ? page.getByText(a.click.slice(5), { exact: true }).last() : a.click.startsWith('css=') ? page.locator(a.click.slice(4)).first() : tid(page, a.click); await l.scrollIntoViewIfNeeded().catch(() => {}); await l.click({ force: true, timeout: 8000 }); }
    if (a.fill) await inp(page, a.fill).fill(String(a.value));
    if (a.filllabel) { const f = page.locator('.q-dialog .q-field').filter({ has: page.locator('.q-field__label', { hasText: a.filllabel }) }).first(); const i = f.locator('input,textarea').first(); await i.click({ force: true }); await i.fill(''); await i.type(String(a.value), { delay: 25 }); }
    if (a.type) await page.keyboard.type(a.type, { delay: 40 });
    if (a.key) await page.keyboard.press(a.key);
    if (a.menu) await page.locator('.q-menu .q-item').filter({ hasText: a.menu }).first().click({ force: true, timeout: 8000 });
    if (a.menuFirst) await page.locator('.q-menu .q-item').first().click({ force: true });
    if (a.shot) await page.screenshot({ path: '/tmp/cln/rgwo/' + a.shot + '.png', fullPage: !!a.full });
    if (a.dump) console.log('DUMP', a.dump, (await ids(page, a.dump === 'dialog' ? '.q-dialog' : a.dump === 'menu' ? '.q-menu' : a.dump === 'page' ? '' : a.dump)).join(' | ').slice(0, 3500));
    if (a.text) console.log('TEXT', (await page.locator(a.text).first().innerText().catch(e => 'ERR ' + e.message.slice(0, 80))).replace(/\n+/g, ' | ').slice(0, 3000));
    if (a.snap) {
      // Evidence snapshot: status badge, Financial Info card, lines/parts table text, nav-menu items, API read-back, zones.
      const dir = OUT + '/evidence/' + a.snap.split('/')[0]; fs.mkdirSync(dir, { recursive: true });
      const name = a.snap.split('/')[1];
      const woId = (page.url().match(/workorders\/([0-9a-f-]{36})/) || [])[1];
      const ui = await page.evaluate(() => {
        const t = s => document.querySelector(s)?.innerText?.trim() || null;
        const fin = {}; document.querySelectorAll('[data-test-id^="item_label_"]').forEach(l => { const k = l.getAttribute('data-test-id').slice(11); fin[k] = document.querySelector(`[data-test-id="item_value_${k}"]`)?.innerText?.trim(); });
        return { wo_number: t('[data-test-id="text_wo_number"]'), wo_status: t('[data-test-id="badge_wo_status"]'), financial_card: fin,
          invoice_doc: Object.fromEntries([...document.querySelectorAll('[data-test-id^="invoice-"]')].map(e => [e.getAttribute('data-test-id'), e.innerText.replace(/\s+/g, ' ').trim()])),
          line_statuses: [...document.querySelectorAll('[data-test-id^="badge_line_status_"]')].map(e => e.innerText.trim()),
          buttons: [...document.querySelectorAll('main button')].filter(b => b.getBoundingClientRect().width > 0).map(b => b.innerText.replace(/\s+/g, ' ').trim()).filter(x => x && x.length < 40),
          main_text: (document.querySelector('main')?.innerText || '').replace(/\n+/g, ' | ').slice(0, 6000) };
      });
      let menu = null;
      if (a.menuItems !== false) { const mb = page.locator('[data-test-id="button_work_order_nav_bar_menu"]').first(); if (await mb.count()) { await mb.click({ force: true }).catch(() => {}); await sleep(1200); menu = await page.locator('.q-menu .q-item').allInnerTexts().catch(() => []); await page.keyboard.press('Escape'); await sleep(600); } }
      const api = woId ? { view: (await call(page, 'GET', '/api/work-orders/view/' + woId)).j, lines: (await call(page, 'GET', '/api/work-orders/lines/' + woId)).j } : null;
      const z = await zones(page, LOC.tz);
      await page.screenshot({ path: `${dir}/${name}.png`, fullPage: true });
      fs.writeFileSync(`/tmp/cln/rgwo/${a.snap.replace('/', '__')}-api.json`, JSON.stringify(api, null, 1));
      fs.writeFileSync(`${dir}/${name}.json`, JSON.stringify({ label: name, url: page.url(), zones: z, ui: { ...ui, nav_menu_items: menu } }, null, 1));
      console.log('SNAP', name, ui.wo_number, ui.wo_status, JSON.stringify(ui.financial_card), 'lines:', ui.line_statuses.join(','), 'menu:', JSON.stringify(menu));
    }
    if (a.api) { const r = await call(page, 'GET', a.api); console.log('API', a.api, r.s, JSON.stringify(r.j).slice(0, a.n || 1500)); }
  } catch (e) { console.log('FAIL', JSON.stringify(a), e.message.slice(0, 150)); }
  await sleep(a.wait || 1500);
}
await page.screenshot({ path: '/tmp/cln/rgwo/' + (shot || 'step') + '.png' });
console.log('URL', page.url());
console.log(net.filter(n => !/recent-entities/.test(n.u)).map(n => n.m + ' ' + n.u + ' ' + n.s + ' REQ ' + n.body.slice(0, 300) + ' RESP ' + n.resp.slice(0, 200)).join('\n'));
await browser.close();
