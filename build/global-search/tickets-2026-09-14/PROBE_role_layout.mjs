// Every permission group's checkboxes are called View / Create & Edit / Delete, so a label alone
// says nothing -- "View" appears six times on the Technician editor. My heading detector returned
// "Permissions" for all 28 controls, i.e. it found the page title and nothing finer.
//
// So: dump the editor's actual text layout by vertical position, with the checkboxes interleaved,
// and let the structure show itself. No guessing at class names.
//
// Read only.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';

const DIR = '/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EDITOR = process.env.EDITOR_URL
  || '/administration/roles-permissions/af8d02b5-ecd1-4205-a82f-32a4d5bb1015/edit';  // Technician
const R = { at: new Date().toISOString(), editor: EDITOR };
const save = () => fs.writeFileSync(`${DIR}/ROLE-EDITOR-LAYOUT.json`, JSON.stringify(R, null, 2));
const L = (...a) => console.log(...a);

const { browser, page } = await boot('sv9160', '/administration/staff', 'admin');
await page.setViewportSize({ width: 1600, height: 1800 }).catch(() => {});
await page.waitForTimeout(6000);
await page.goto('https://sv9160.qa.shopview.com' + EDITOR, { waitUntil: 'domcontentloaded' }).catch(() => {});
await page.waitForTimeout(8000);
await page.mouse.move(5, 5);

R.layout = await page.evaluate(() => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  const items = [];

  // the controls
  document.querySelectorAll('.q-checkbox,.q-toggle,[role=checkbox],[role=switch]').forEach(e => {
    if (!vis(e)) return;
    const r = e.getBoundingClientRect();
    const cls = (e.className || '').toString();
    items.push({ y: Math.round(r.top), x: Math.round(r.left), what: 'CONTROL',
      kind: cls.includes('q-toggle') ? 'toggle' : 'checkbox',
      text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40),
      on: e.getAttribute('aria-checked') === 'true'
          || /q-checkbox--truthy|q-toggle--truthy/.test(cls) });
  });

  // every element whose OWN text (not its children's) is a short line -- the group titles are
  // somewhere in here whatever they are called
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  let n;
  while ((n = walker.nextNode())) {
    const t = (n.nodeValue || '').replace(/\s+/g, ' ').trim();
    if (!t || t.length > 48) continue;
    const el = n.parentElement;
    if (!el || !vis(el)) continue;
    if (el.closest('.q-checkbox,.q-toggle')) continue;      // labels of the controls themselves
    const r = el.getBoundingClientRect();
    const key = Math.round(r.top) + '|' + t;
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({ y: Math.round(r.top), x: Math.round(r.left), what: 'TEXT', text: t,
      tag: el.tagName.toLowerCase(),
      cls: (el.className || '').toString().slice(0, 44) });
  }
  return items.sort((a, b) => a.y - b.y || a.x - b.x);
});

await page.screenshot({ path: `${DIR}/roles-evidence/role-editor-layout.png`, fullPage: true }).catch(() => {});
save();
L('items:', R.layout.length, '\n');
R.layout.forEach(i => {
  if (i.what === 'CONTROL') {
    L(`  ${String(i.y).padStart(5)}  [${i.on ? 'x' : ' '}] ${i.kind.padEnd(8)} ${i.text.slice(0, 36)}`);
  } else {
    L(`  ${String(i.y).padStart(5)}       ${i.tag.padEnd(6)} ${i.text.slice(0, 46)}   .${i.cls.slice(0, 34)}`);
  }
});
await browser.close();
