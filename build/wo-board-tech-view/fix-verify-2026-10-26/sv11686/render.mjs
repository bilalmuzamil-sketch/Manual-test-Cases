// 26 Oct 2026 — draw each pointer SVG at its real size (32 px) in Chromium at 1x and 2x on a transparent and on a white page; PNGs here.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js'; const { chromium } = pkg; import fs from 'fs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
for (const dpr of [1, 2]) { const ctx = await b.newContext({ deviceScaleFactor: dpr, viewport: { width: 200, height: 100 } }); const p = await ctx.newPage();
  for (const n of ['old-cursor-hand-sv11588', 'new-open-hand-tech-grip-1', 'new-closed-hand-tech-drag']) {
    const src = 'data:image/svg+xml,' + encodeURIComponent(fs.readFileSync(`${n}.svg`, 'utf8'));
    await p.setContent(`<html><body style="margin:0;background:#9ca3af"><img id=i src="${src}" width=32 height=32 style="display:block"></body></html>`); await p.waitForTimeout(300);
    await (await p.$('#i')).screenshot({ path: `${n}-${dpr}x.png` }); } await ctx.close(); }
await b.close(); console.log('ok');
