// discover.mjs — FIRST QUESTION of build verification: is the Inline Add and Edit Parts feature on
// sv9315 at all? The suite has never met a build (all 119 markers read "Not available on Build to
// test Yet"), so nothing may be assumed either way.
//
// What the suite says to look for: open a work order in an open status, go to its Lines tab, and each
// line has a Parts section beneath it carrying an "Add Part" button and inline add/edit rows.
import { boot, APP } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
fs.mkdirSync(`${OUT}/evidence`, { recursive: true });
const log = []; const L = (...a) => { const s = a.map(String).join(' '); console.log(s); log.push(s); };

const { browser, page } = await boot('/workorders');
const targets = JSON.parse(fs.readFileSync('/tmp/inl/targets.json', 'utf8')).slice(0, 3);
const results = [];
for (const t of targets) {
  await page.goto(`${APP}/workorders/${t.id}`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await page.waitForFunction(() => (document.body?.innerText || '').length > 1200, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(4500);
  const r = await page.evaluate(() => {
    const t = document.body?.innerText || '';
    const ids = [...document.querySelectorAll('[data-test-id],[data-testid]')]
      .map(e => e.getAttribute('data-test-id') || e.getAttribute('data-testid')).filter(Boolean);
    const btns = [...document.querySelectorAll('button, .q-btn')].map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
    const tabs = [...document.querySelectorAll('.q-tab, [role="tab"]')].map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
    return {
      url: location.pathname, chars: t.length, tabs: [...new Set(tabs)],
      addPartButton: /\bAdd Part\b/i.test(t),
      partsWord: /\bParts\b/.test(t),
      buttons: [...new Set(btns)].slice(0, 24),
      addPartIds: [...new Set(ids)].filter(x => /add.?part|part.?add|inline/i.test(x)).slice(0, 20),
      allIdsSample: [...new Set(ids)].filter(x => /part/i.test(x)).slice(0, 25),
      body: t.replace(/\s+/g, ' ').slice(0, 700),
    };
  });
  L(`\n=== ${t.number} (${t.status}, ${t.linesCount} lines) ${r.url} chars=${r.chars}`);
  L('  tabs           :', JSON.stringify(r.tabs));
  L('  "Add Part" text:', r.addPartButton);
  L('  buttons        :', JSON.stringify(r.buttons));
  L('  part test-ids  :', JSON.stringify(r.allIdsSample));
  results.push({ ...t, observed: r });
  await page.screenshot({ path: `${OUT}/evidence/discover-${t.number}.png`, fullPage: true });
}
fs.writeFileSync(`${OUT}/evidence/discovery.json`, JSON.stringify(results, null, 1));
fs.writeFileSync(`${OUT}/evidence/discovery.log`, log.join('\n') + '\n');
await browser.close();
