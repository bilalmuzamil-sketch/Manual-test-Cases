// s6b_msg.mjs — 12 Nov 2026, staging, C715469 step 6 picture only: the four vendors (2,001 lines) -> Download (PDF) -> picture 2.5 s later,
// when the message has settled (s6's picture caught it sliding in); counts the messages and watches 40 s for a file.
import { stgStart } from './stglib.mjs'; import { mkFilt } from '../exec/filt.mjs'; import fs from 'fs';
const OUT = new URL('./s6/', import.meta.url).pathname; const s = await stgStart(OUT); const p = s.page; const F = mkFilt(p); const o = {}; let file = null;
await s.go('/reports/ap-aging-detail'); await p.waitForTimeout(4000);
for (const v of ['Fate Roadside Truck Repair', 'New Castle Diesel Performance', 'Grand Haven Diesel Services LLC', 'Tehachapi Truck Center']) { await F.pick('Vendor', v); await p.waitForTimeout(1500); }
o.chips = await F.chips(); p.waitForEvent('download', { timeout: 40000 }).then((d) => { file = d.suggestedFilename(); }).catch(() => {});
await p.locator('main button[aria-label="Export report"]').first().click(); await p.waitForTimeout(900); await p.locator('.q-menu:visible').last().getByText('Download (PDF)', { exact: true }).click();
await p.waitForTimeout(2500); o.notes = (await p.locator('.q-notification').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').trim()); o.box = await p.locator('.q-notification').first().boundingBox().catch(() => null); o.pic = await s.shot('step6-message-settled');
await p.waitForTimeout(37000); o.file = file; o.notesLater = (await p.locator('.q-notification').allInnerTexts()).length;
fs.writeFileSync(OUT + 'out-6b.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o)); await s.close(); process.exit(0);
