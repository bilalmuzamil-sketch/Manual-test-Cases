// (a) Work In Progress "Download (PDF)" re-measured alone, Staging Heavy Duty - 9919 ticked, 5-minute wait, export call
// recorded (s3.js saw no download within 90 s while other runs loaded staging). (b) C715477: a work-order link from
// location B, pasted while on Work Orders at the current location; the switch prompt; Cancel. Never switches location.
const { open, APP, stamp, dir } = require('./stg');
const fs = require('fs');
(async () => {
  const { browser, ctx, page } = await open();
  const mk = async () => (await page.request.get(APP + '/').then((r) => r.text())).match(/app-version" content="([^"]+)/)?.[1];
  if (!process.env.SKIP_WIP) {
    const O = dir('3-files-and-links'); const net = [];
    page.on('response', (r) => { if (/work-in-progress\/export|wip.*export/i.test(r.url())) net.push(`${stamp()} ${r.status()} ${r.url().replace(/^https:\/\/[^/]+/, '').slice(0, 170)}`); });
    await page.goto(APP + '/reports/work-in-progress?locationIds=b3c8c820-f815-4cf1-8938-10956c5ee71a', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-test-id="btn_dropdown_wip_export"]', { timeout: 60000 }); await page.waitForTimeout(8000);
    const t0 = stamp();
    await page.click('[data-test-id="btn_dropdown_wip_export"]'); await page.waitForTimeout(800);
    const dl = page.waitForEvent('download', { timeout: 300000 }).catch(() => null);
    await page.click('[data-test-id="action_wip_export_pdf"]');
    const msgs = new Set(); const poll = setInterval(async () => { try { (await page.evaluate(() => [...document.querySelectorAll('.q-notification, [role=alert]')].map((e) => e.innerText.replace(/\s+/g, ' ').trim()))).forEach((m) => m && msgs.add(m)); } catch (e) {} }, 1000);
    const d = await dl; clearInterval(poll);
    let res = 'nothing within 5 minutes';
    if (d) { const f = `${O}/Work In Progress - pdf (re-measured) - ${d.suggestedFilename()}`; await d.saveAs(f); res = `downloaded ${d.suggestedFilename()} (${fs.statSync(f).size} bytes)`; }
    const note = `\nWork In Progress — Download (PDF) re-measured alone (build ${await mk()})\n  Clicked at ${t0}; result at ${stamp()}: ${res}\n  Messages: ${[...msgs].join(' / ') || 'none'}\n  Export calls: ${net.join(' ; ') || 'none seen'}\n`;
    fs.appendFileSync(`${O}/NOTES.txt`, note); console.log(note);
  }
  // (b) C715477
  const O = dir('C715477-work-order-link'); const N = [`Started ${stamp()} · build ${await mk()}`];
  const rows = await (await page.request.get('https://api.staging.shopview.com/api/reporting/reports/ar-aging-detail/buckets/days_31_to_60/rows?asOfDate=2026-11-12&locations=f8a8b802-7780-4b16-bf10-343caeb616b2&pagination[page]=1&pagination[rowsPerPage]=100&pagination[sortBy]=date&pagination[descending]=false')).json();
  const doc = rows.data.collection.find((r) => r.transactionType === 'Invoice' && r.link && JSON.stringify(r.link).includes('work') && r.locationName === 'Staging Lethbridge - 4310');
  N.push(`Work order 1: invoice ${doc?.documentNumber} of ${doc?.customerName} at ${doc?.locationName}, open ${doc ? doc.openBalanceCents / 100 : '?'} · link data ${JSON.stringify(doc?.link)}`);
  // the link exactly as the report's own anchor holds it ("Copy link address")
  await page.goto(APP + '/reports/ar-aging-detail?locationIds=f8a8b802-7780-4b16-bf10-343caeb616b2', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(8000);
  await page.click('[data-test-id="button_aging_detail_report_toggle_days_31_to_60"]').catch(() => {}); await page.waitForTimeout(5000);
  const VS = '.q-table__middle.q-virtual-scroll'; let href = null;
  for (let i = 0; i < 300 && !href; i++) {
    href = await page.evaluate((id) => { const a = [...document.querySelectorAll('a[href]')].find((x) => x.href.includes(id)); return a ? a.href : null; }, doc?.link?.targetId);
    if (href) break;
    const end = await page.evaluate((vs) => { const e = document.querySelector(vs); if (!e) return true; const b = e.scrollTop; e.scrollTop += e.clientHeight - 60; return e.scrollTop === b; }, VS);
    await page.waitForTimeout(300); if (end) break;
  }
  N.push(`Copied link (the anchor's href): ${href}`);
  await page.goto(APP + '/work-orders', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(6000);
  N.push(`On Work Orders at the current location: ${page.url()}`);
  if (href) {
    await page.goto(href, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(8000);
    const dlg = await page.evaluate(() => [...document.querySelectorAll('.q-dialog')].map((e) => e.innerText.replace(/\s+/g, ' ').trim()).join(' / '));
    await page.screenshot({ path: `${O}/2 after pasting the link.png` });
    N.push(`Step 1-2 (${stamp()}): address ${page.url()} · prompt: ${dlg || 'NO PROMPT'}`);
    const cancel = page.locator('.q-dialog button').filter({ hasText: /^\s*Cancel\s*$/i }).first();
    if (await cancel.count()) { await cancel.click(); await page.waitForTimeout(5000); }
    const msg = await page.evaluate(() => [...document.querySelectorAll('.q-notification, [role=alert], .q-banner')].map((e) => e.innerText.replace(/\s+/g, ' ').trim()).join(' / '));
    await page.screenshot({ path: `${O}/3 after Cancel.png` });
    N.push(`Step 3 (${stamp()}): after Cancel: address ${page.url()} · page heading ${(await page.locator('h1, .text-h5, .text-h6').first().innerText().catch(() => '?')).slice(0, 80)} · messages: ${msg || 'none'}`);
  }
  fs.writeFileSync(`${O}/NOTES.txt`, N.join('\n') + '\n'); console.log(N.join('\n'));
  await browser.close();
})();
