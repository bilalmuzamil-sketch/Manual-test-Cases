// Open the Technician role editor and DUMP EVERY CONTROL WITH ITS STATE.
//
// This is the baseline. 55 people are on Technician, and the QA lead's permission to edit it comes
// with "reset the role after testing" -- so the restore has to be exact, which means the before
// state must be RECORDED, not remembered. Nothing is changed here.
//
// Discipline carried from today: real mouse events (a synthetic click does not open Quasar
// controls), pointer parked and verified before every reading, and EVERY control dumped rather
// than the handful I expect to matter.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';

const DIR = '/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const ROLE = process.env.ROLE || 'Technician';
const R = { at: new Date().toISOString(), role: ROLE };
const save = () => fs.writeFileSync(`${DIR}/ROLE-BASELINE-${ROLE.replace(/\W+/g, '-')}.json`,
                                    JSON.stringify(R, null, 2));
const L = (...a) => console.log(...a);

const { browser, page } = await boot('sv9160', '/administration/staff', 'admin');
await page.setViewportSize({ width: 1600, height: 1600 }).catch(() => {});
await page.waitForTimeout(7000);

const park = async () => { await page.mouse.move(5, 5); await page.waitForTimeout(300); };
const clickAt = async b => {
  const vp = page.viewportSize() || { width: 1600, height: 1600 };
  const x = b.x + b.w / 2, y = b.y + b.h / 2;
  if (x < 0 || y < 0 || x > vp.width || y > vp.height)
    return { ok: false, why: `off-screen at ${Math.round(x)},${Math.round(y)}` };
  await page.mouse.move(x, y); await page.waitForTimeout(140);
  await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up();
  return { ok: true };
};

// walk to Roles & Permissions by clicking it, never by guessing a URL
{
  const nav = await page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
    const el = [...document.querySelectorAll('a,.q-item,[role=tab]')].filter(vis)
      .find(e => /roles\s*&\s*permissions/i.test((e.innerText || '').replace(/\s+/g, ' ')));
    if (!el) return null; el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  if (!nav) { R.abort = 'no Roles & Permissions item in the navigation'; save(); L(R.abort);
    await browser.close(); process.exit(2); }
  await clickAt(nav);
  await page.waitForTimeout(7000);
  await park();
}
R.rolesPageUrl = new URL(page.url()).pathname;

// open the role's editor from its own row
{
  const box = await page.evaluate(name => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
    // EXACT first cell, and NO FALLBACK. Asking for "Technician" and settling for whatever row
    // happened to contain the word is how the last run opened PARTS Technician's editor and called
    // the result a Technician baseline -- which would then have been "restored" onto the wrong
    // role. A name that cannot be matched exactly is an abort, not a near-enough.
    // The first <td> holds only a padlock icon on the locked rows, so td[0] is not the name. Match
    // on the ROW TEXT starting with the role name: "Parts Technician ..." does not start with
    // "Technician", and "Senior Service Advisor ..." does not start with "Service Advisor", so a
    // startsWith on the whole row is both exact enough and robust to the icon column.
    const rows = [...document.querySelectorAll('tr')].filter(vis);
    const norm = t => (t || '').replace(/\s+/g, ' ').replace(/^lock\s+/, '').trim();
    const row = rows.find(r => {
      const txt = norm(r.innerText);
      return txt === name || txt.startsWith(name + ' ');
    });
    if (!row) {
      return { notFound: true,
               rowsSeen: rows.map(r => norm(r.innerText).slice(0, 40)).filter(Boolean).slice(0, 15) };
    }
    row.scrollIntoView({ block: 'center' });
    const edit = [...row.querySelectorAll('*')].filter(vis)
      .filter(e => (e.textContent || '').trim() === 'edit')
      .sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height
                    - b.getBoundingClientRect().width * b.getBoundingClientRect().height)[0];
    const t = edit || row.querySelector('td');
    const r = t.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height,
             rowText: (row.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 110) };
  }, ROLE);
  if (!box || box.notFound) {
    R.abort = `no row whose first cell is exactly "${ROLE}"`;
    R.rowsSeen = box && box.rowsSeen;
    save(); L(R.abort, '| rows on the page:', JSON.stringify(R.rowsSeen));
    await browser.close(); process.exit(3);
  }
  R.row = box.rowText;
  L('row:', box.rowText);
  // and prove the row really is the one asked for before anything is clicked
  if (!new RegExp('^' + ROLE + '\\b').test(box.rowText.replace(/^lock /, ''))) {
    R.abort = `the row found starts with something else: "${box.rowText.slice(0, 60)}"`;
    save(); L(R.abort); await browser.close(); process.exit(4);
  }
  await clickAt(box);
  await page.waitForTimeout(7000);
  await park();
}
R.editorUrl = new URL(page.url()).pathname;
L('editor url:', R.editorUrl);

// DUMP EVERYTHING. Checkbox, toggle, radio, select -- with the label nearest each one.
R.controls = await page.evaluate(() => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  const labelFor = e => {
    const own = (e.innerText || '').replace(/\s+/g, ' ').trim();
    if (own && own.length < 60) return own;
    let n = e.parentElement, hops = 0;
    while (n && hops++ < 4) {
      const t = (n.innerText || '').replace(/\s+/g, ' ').trim();
      if (t && t.length < 80) return t;
      n = n.parentElement;
    }
    return '';
  };
  // Every group's checkboxes are called View / Create & Edit / Delete, so a label on its own is
  // meaningless -- "View" appears nine times. Each control is tagged with the nearest SECTION
  // heading above it, which is what tells Work Orders from Part Sales.
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,.text-h6,.text-subtitle1,.text-subtitle2,.text-weight-bold')]
    .filter(vis).map(e => ({ y: e.getBoundingClientRect().top,
                             text: (e.innerText || '').replace(/\s+/g, ' ').trim() }))
    .filter(h => h.text && h.text.length < 60);
  const sectionAbove = y => {
    const above = headings.filter(h => h.y <= y + 4).sort((a, b) => b.y - a.y);
    return above.length ? above[0].text : '';
  };
  const out = [];
  document.querySelectorAll('.q-checkbox,.q-toggle,.q-radio,input[type=checkbox],[role=checkbox],[role=switch]')
    .forEach(e => {
      if (!vis(e)) return;
      const aria = e.getAttribute('aria-checked');
      const cls = (e.className || '').toString();
      out.push({
        kind: cls.includes('q-toggle') ? 'toggle' : cls.includes('q-radio') ? 'radio' : 'checkbox',
        section: sectionAbove(e.getBoundingClientRect().top),
        label: labelFor(e),
        checked: aria !== null ? aria === 'true'
                 : /q-checkbox--truthy|q-toggle--truthy|q-radio--truthy/.test(cls),
        disabled: /disabled/.test(cls) || e.getAttribute('aria-disabled') === 'true',
        testId: e.getAttribute('data-test-id'),
        y: Math.round(e.getBoundingClientRect().top),
      });
    });
  return out;
});
R.headings = await page.evaluate(() => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  return [...document.querySelectorAll('h1,h2,h3,h4,.text-h4,.text-h5,.text-h6,.text-subtitle1')]
    .filter(vis).map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 25);
});
R.buttons = await page.evaluate(() => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  return [...document.querySelectorAll('button,.q-btn')].filter(vis)
    .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 20);
});
await page.screenshot({ path: `${DIR}/roles-evidence/role-editor-${ROLE.replace(/\W+/g, '-')}.png`,
                        fullPage: true }).catch(() => {});
L('headings:', JSON.stringify(R.headings).slice(0, 400));
L('buttons :', JSON.stringify(R.buttons).slice(0, 220));
L('controls:', R.controls.length);
R.controls.forEach(c => L(`   [${c.checked ? 'x' : ' '}]${c.disabled ? ' (disabled)' : ''} ${c.kind.padEnd(8)} ${(c.section || '?').slice(0, 30).padEnd(30)} | ${c.label.slice(0, 40)}`));
save();
L('\nbaseline written - this is what must be restored afterwards');
await browser.close();
