const lib = require('/home/user/Manual-test-Cases/build/ar-ap-report-sorting/v1-regression/live-run-2026-11-11/tools/lib.js'); const { open } = require('/tmp/claude-0/-home-user/ef40c1d4-3e84-5396-9a66-1a25d97a7768/scratchpad/env2.js'); const O = '/tmp/claude-0/-home-user/ef40c1d4-3e84-5396-9a66-1a25d97a7768/scratchpad/fresh/';
(async () => {
  const { browser, page, app } = await open('qa');
  const resp = []; page.on('response', (r) => { if ([401, 409].includes(r.status()) && r.url().includes('/api/')) resp.push(r.status() + ' ' + r.url()); });
  async function exp(prefix, f) { await page.click('[data-test-id="btn_dropdown_' + prefix + '_export"]'); await lib.sleep(700);
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }).catch(() => null), page.click('[data-test-id="action_' + prefix + '_export_pdf"]')]);
    if (!dl) return 'NO DOWNLOAD'; await dl.saveAs(O + f); return dl.suggestedFilename(); }
  await lib.reportsHome(page, app); await lib.nav(page, 'A/R Aging Summary'); await lib.settle(page, 2000);
  await page.screenshot({ path: O + 'V1R-34-screen.png' }); console.log('34', await exp('arsum', 'V1R-34.pdf'));
  const s = await lib.setDate(page, '2026-10-15'); console.log('83 date', JSON.stringify(s)); await lib.settle(page, 2000);
  await page.screenshot({ path: O + 'V1R-83-screen.png' }); console.log('83', await exp('arsum', 'V1R-83.pdf'));
  await lib.reportsHome(page, app); await lib.nav(page, 'A/P Aging Summary'); await lib.settle(page, 2500);
  await page.screenshot({ path: O + 'V1R-91-screen.png' }); console.log('91', await exp('apsum', 'V1R-91.pdf'));
  console.log('auth problems', resp.length, resp.slice(0, 3)); await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
