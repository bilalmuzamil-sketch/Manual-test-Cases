// explib.mjs — 11 Nov 2026: export helpers for the aging reports (from s1_caps): exportAs(kind) opens the ⋯ "Export report" menu, picks
// "Download (PDF)"/"Download (CSV)", waits for a download (null if none within the wait), saves it, and returns the notification texts
// shown; readCsv(file) → rows (arrays); readPdf(file) → text (pdftotext -layout). menuInfo() reads the ⋯ button label/tooltip and items.
import fs from 'fs'; import { execFileSync } from 'child_process';
export function mkExp(p, OUT) {
  const notes = async () => (await p.locator('.q-notification').allInnerTexts().catch(() => [])).map((t) => t.replace(/\s+/g, ' ').trim());
  async function exportAs(kind, tag, waitMs = 60000) { await p.locator('main button[aria-label="Export report"]').first().click(); await p.waitForTimeout(900);
    const dl = p.waitForEvent('download', { timeout: waitMs }).catch(() => null); await p.locator('.q-menu:visible').getByText(`Download (${kind})`, { exact: true }).click();
    const seen = new Set(); const t0 = Date.now(); let d = null; const race = dl.then((x) => { d = x; });
    while (Date.now() - t0 < Math.min(waitMs, 15000) && !d) { for (const n of await notes()) seen.add(n); await p.waitForTimeout(400); } await Promise.race([race, new Promise((r) => setTimeout(r, Math.max(0, waitMs - (Date.now() - t0))))]);
    await p.waitForTimeout(1500); for (const n of await notes()) seen.add(n);
    if (!d) return { kind, file: null, notes: [...seen] }; const f = OUT + (tag ? tag + '-' : '') + d.suggestedFilename(); await d.saveAs(f); return { kind, file: f, name: d.suggestedFilename(), bytes: fs.statSync(f).size, notes: [...seen] }; }
  function readCsv(f) { const t = fs.readFileSync(f, 'utf8').replace(/^﻿/, ''); const rows = []; let row = [], cell = '', q = false;
    for (let i = 0; i < t.length; i++) { const ch = t[i]; if (q) { if (ch === '"' && t[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') q = false; else cell += ch; } else if (ch === '"') q = true; else if (ch === ',') { row.push(cell); cell = ''; } else if (ch === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; } else cell += ch; }
    if (cell || row.length) { row.push(cell); rows.push(row); } return rows; }
  const readPdf = (f) => execFileSync('pdftotext', ['-layout', f, '-'], { encoding: 'utf8' });
  async function menuInfo() { const b = p.locator('main button[aria-label="Export report"]').first(); const o = { exists: await b.count(), label: await b.getAttribute('aria-label').catch(() => null) };
    await b.hover(); await p.waitForTimeout(1200); o.tooltip = (await p.locator('.q-tooltip').allInnerTexts().catch(() => [])).join(' | '); o.box = await b.boundingBox();
    await b.click(); await p.waitForTimeout(900); o.items = (await p.locator('.q-menu:visible').innerText().catch(() => '')).replace(/\s+/g, ' ').trim(); o.menuBox = await p.locator('.q-menu:visible').boundingBox().catch(() => null); return o; }
  return { exportAs, readCsv, readPdf, menuInfo, notes };
}
