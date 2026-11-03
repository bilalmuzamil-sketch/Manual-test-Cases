// c682419-s8-uisignin-1103.mjs — 3 Nov 2026, production v26.45.0. C682419 step 8 ("the chat bubble sits above the minimap and does
// not cover it"; PRD v82 S3-E2a "While it shows, the chat launcher at the bottom right moves up so it never covers the minimap, as on
// the work order page."). The harness's behind-the-scenes sign-in (prod-login-boot.mjs) never starts the chat: the app calls
// Intercom("boot") from the SIGN-IN SCREEN (Login chunk: setIntercomDetail after saveUser) and on first load, and with the harness no
// messenger request is ever made (c682419-s8s9, 3 Nov). So this signs in THROUGH THE SIGN-IN SCREEN, as a person does, with the
// production test account (/tmp/shopview/prod-login.env, never printed), opens Work Orders > All > Board View at Truck Hill 1 and
// reads the chat launcher's box against the minimap's (25 s wait). Positive control: the same read on a work order page, where the
// PRD says the launcher already moves up. Output EV/c682419-s8-ui.json + pictures.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs'; import path from 'path';
const EV = process.env.WOB_EV; fs.mkdirSync(EV, { recursive: true });
const d = {}; for (const l of fs.readFileSync('/tmp/shopview/prod-login.env', 'utf8').split('\n')) { const m = /^([A-Z_]+)=(.*)$/.exec(l.trim()); if (m) d[m[1]] = m[2]; }
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const browser = await chromium.launch({ args: ['--no-sandbox'], executablePath: '/opt/pw-browsers/chromium', proxy: { server: `http://127.0.0.1:${port}` } });
const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
const p = await ctx.newPage(); p.setDefaultTimeout(45000);
const o = { at: new Date().toISOString(), req: [] }; const save = () => fs.writeFileSync(path.join(EV, 'c682419-s8-ui.json'), JSON.stringify(o, null, 1));
p.on('response', (r) => { if (/intercom/i.test(r.url())) o.req.push({ u: r.url().slice(0, 90), st: r.status() }); });
const read = () => p.evaluate(`(() => { const L = [...document.querySelectorAll('.intercom-launcher, .intercom-lightweight-app-launcher, iframe[name*=intercom], [class*=intercom-launcher], .intercom-launcher-frame, #intercom-container iframe')]
  .map(e => { const r = e.getBoundingClientRect(); return { tag: e.tagName, cls: String(e.className).slice(0, 60), name: e.getAttribute('name'), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; }).filter(b => b.w > 0);
  const m = document.querySelector('[data-test-id="board_minimap"]'); const mb = m ? m.getBoundingClientRect() : null;
  return { intercom: typeof window.Intercom, launchers: L, minimap: mb && mb.width > 0 ? { x: Math.round(mb.x), y: Math.round(mb.y), w: Math.round(mb.width), h: Math.round(mb.height) } : null }; })()`);
const overlap = (b, s) => b && s && !(b.x + b.w <= s.x || s.x + s.w <= b.x || b.y + b.h <= s.y || s.y + s.h <= b.y);
try {
  await p.goto('https://app.shopview.com/login', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3000);
  await p.getByLabel('Email').fill(d.SV_USER); await p.getByLabel('Password').fill(d.SV_PASS); await p.getByRole('button', { name: 'Login' }).click();
  await p.waitForURL((u) => !/\/login/.test(u.toString()), { timeout: 60000 }); await p.waitForTimeout(5000); o.afterLogin = p.url();
  await p.goto('https://app.shopview.com/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  o.header = await p.locator('[data-test-id="profile_menu_button"]').innerText().catch(() => '');
  await p.locator('[aria-label="Board View"]').first().click(); await p.locator('[data-test-id^="board_column_header_"]').first().waitFor({ timeout: 60000 });
  for (let i = 0; i < 6; i++) { await p.waitForTimeout(5000); o.board = await read(); if (o.board.launchers.length) break; }
  o.board.overlap = o.board.launchers.map((l) => overlap(l, o.board.minimap)); o.board.launcherAboveMinimap = o.board.launchers.map((l) => o.board.minimap ? l.y + l.h <= o.board.minimap.y : null);
  await p.screenshot({ path: path.join(EV, 'C682419-s8-ui-board.png') }); save();
  const id = (await p.locator('[data-test-id^="board_card_"]').first().getAttribute('data-test-id').catch(() => null))?.replace('board_card_', '');
  if (id) { await p.goto(`https://app.shopview.com/workorders/${id}/lines`, { waitUntil: 'domcontentloaded' });
    for (let i = 0; i < 6; i++) { await p.waitForTimeout(5000); o.woPage = await read(); if (o.woPage.launchers.length) break; }
    await p.screenshot({ path: path.join(EV, 'C682419-s8-ui-wo-page.png') }); }
} catch (e) { o.error = String(e?.message || e).slice(0, 300); await p.screenshot({ path: path.join(EV, 'C682419-s8-ui-error.png') }).catch(() => {}); }
save(); console.log(JSON.stringify({ afterLogin: o.afterLogin, header: o.header, board: o.board, woPage: o.woPage, req: o.req.length, error: o.error }).slice(0, 2500));
await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 8000))]); process.exit(0);
