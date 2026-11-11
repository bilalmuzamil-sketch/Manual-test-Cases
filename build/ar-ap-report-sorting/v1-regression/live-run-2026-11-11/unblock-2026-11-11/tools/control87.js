// Attribution control for V1R-87 step 7: the QA lead (enrolled at Location C) narrows A/R Aging Detail to the C customer; read-only.
const fs = require('fs'); const path = require('path'); const lib = require('./lib.js');
(async () => { const x = await lib.open('qa'); const { page, app, browser } = x; const R = {};
  try { await lib.reportsHome(page, app); await lib.nav(page, 'A/R Aging Detail'); R.pick = await lib.pickParty(page, 'customerIds', 'ZZAUTOTEST AR V1R-87 Location C'); await lib.openAll(page);
    const rs = (await lib.rows(page)).filter((r) => r.text.includes('S-17887')); R.rows = rs.map((r) => ({ text: r.text.slice(0, 160), link: r.link, plain: r.plain }));
    R.marker = await page.evaluate(() => (document.querySelector('meta[name="app-version"]') || {}).content); R.user = await page.evaluate(() => { try { return JSON.parse(localStorage.getItem('user')).data.details.email; } catch (e) { return null; } });
    if (rs[0] && rs[0].link) { const el = page.locator(`[data-test-id="${rs[0].link.tid}"]`); await el.scrollIntoViewIfNeeded(); await el.hover(); await lib.sleep(600); const b = await el.boundingBox(); R.box = b && [b.x * 2, b.y * 2, b.width * 2, b.height * 2].map(Math.round); }
    await page.screenshot({ path: path.join(__dirname, '../shots/V1R-87 qa - control Admin enrolled at Location C sees a link.png') });
  } catch (e) { R.error = String(e).slice(0, 400); }
  fs.writeFileSync(path.join(__dirname, '../shots/V1R-87 qa - control.json'), JSON.stringify(R, null, 1)); console.log(JSON.stringify(R).slice(0, 1200)); await browser.close(); })();
