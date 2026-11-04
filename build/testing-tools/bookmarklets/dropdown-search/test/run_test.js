const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const url = fs.readFileSync(path.join(__dirname, '..', 'bookmarklet.txt'), 'utf8').trim();
  const code = decodeURIComponent(url.slice('javascript:'.length));
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1100, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(__dirname, 'fixture.html')); await p.waitForSelector('.q-select');
  const ok = (n, c) => { console.log((c ? 'PASS ' : 'FAIL ') + n); if (!c) process.exitCode = 1; };
  // 1 native select
  await p.evaluate(code);
  await p.locator('#__dd_search_panel__ input').click();
  await p.keyboard.type('pak');
  ok('native: 1 match listed', (await p.locator('#__dd_search_panel__ [data-dd-idx]').count()) === 1);
  await p.keyboard.press('Enter');
  ok('native: select value set + change fired', (await p.textContent('#natout')) === 'pk');
  await p.keyboard.press('Escape');
  ok('Esc closes panel', (await p.locator('#__dd_search_panel__').count()) === 0);
  // 2 Quasar q-select
  await p.click('.q-select .q-field__control'); await p.waitForSelector('.q-menu .q-item');
  const total = await p.locator('.q-menu .q-item').count();
  await p.evaluate(code);
  await p.locator('#__dd_search_panel__ input').click();   // real mouse click on panel
  await p.keyboard.type('an');
  await p.waitForTimeout(400);
  ok('quasar: menu still open after clicking panel', (await p.locator('.q-menu').count()) === 1);
  const visible = await p.locator('.q-menu .q-item:visible').allTextContents();
  console.log('   menu items', total, '-> visible', JSON.stringify(visible));
  ok('quasar: only matches visible in menu', visible.length === 5 && visible.every(t => /an/i.test(t)));
  await p.screenshot({ path: path.join(__dirname, 'shot-quasar.png') });
  await p.keyboard.press('ArrowDown'); await p.keyboard.press('Enter');
  await p.waitForTimeout(500);
  ok('quasar: model updated to 2nd match', (await p.textContent('#qout')).trim() === 'Evan Black');
  // multi-word, any order (menu reopened while the panel stays open)
  await p.click('.q-select .q-field__control'); await p.waitForSelector('.q-menu');
  await p.locator('#__dd_search_panel__ input').fill('sato hA');
  await p.waitForTimeout(400);
  ok('multi-word any order: 1 match', (await p.locator('#__dd_search_panel__ [data-dd-idx]').count()) === 1 && (await p.locator('.q-menu .q-item:visible').allTextContents()).join() === 'Hana Sato');
  // 3 toggle: running again closes
  await p.evaluate(code);
  ok('re-run toggles panel off', (await p.locator('#__dd_search_panel__').count()) === 0);
  ok('no page errors', errs.length === 0); if (errs.length) console.log(errs);
  await b.close();
})();
