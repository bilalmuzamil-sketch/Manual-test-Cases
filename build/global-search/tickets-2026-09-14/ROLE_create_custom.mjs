// Create a custom role with Work Orders access DELIBERATELY WITHHELD, so that C45142
// ("Work Orders results appear only for users with Work Orders access") has a subject at all.
//
// Why a NEW role rather than editing Technician: every stock role on this branch carries
// `workOrdersView` -- even Time Clock User, which has only three permissions -- and unchecking
// "Work orders / View" on the Technician role did NOT remove it (it swapped the technician view
// mode for the full one). So the state the case needs cannot be reached by subtraction from a
// stock role; it has to be built.
//
// This script does ONE thing: open the roles screen, press "Create Custom Role", and report what
// the form actually asks for -- filling in what it can and saving only when SAVE=1 is set. A form
// I have not seen is a form I must not click blind through (L0116).
//
//   node ROLE_create_custom.mjs            -> open the form and DUMP it, change nothing
//   SAVE=1 node ROLE_create_custom.mjs     -> fill it in and save
//
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';

const DIR = '/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const NAME = process.env.ROLE_NAME || 'ZZAUTOTEST No Work Orders';
const SAVE = process.env.SAVE === '1';
const R = { at: new Date().toISOString(), name: NAME, willSave: SAVE };
const out = () => fs.writeFileSync(`${DIR}/${process.env.OUT || 'ROLE-CREATE.json'}`,
                                   JSON.stringify(R, null, 2));
const L = (...a) => console.log(...a);

const { browser, page } = await boot('sv9160', '/administration/roles-permissions', 'admin');
await page.setViewportSize({ width: 1600, height: 1800 }).catch(() => {});
await page.waitForTimeout(8000);

const park = async () => { await page.mouse.move(5, 5); await page.waitForTimeout(250); };
const clickBox = async b => {
  await page.mouse.move(b.x + b.w / 2, b.y + b.h / 2); await page.waitForTimeout(140);
  await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up();
};
const findButton = rx => page.evaluate(r => {
  const vis = e => { const b = e.getBoundingClientRect(); return b.width > 2 && b.height > 2; };
  const b = [...document.querySelectorAll('button,.q-btn,[role=button]')].filter(vis)
    .find(e => new RegExp(r, 'i').test((e.innerText || '').replace(/\s+/g, ' ').trim()));
  if (!b) return null; b.scrollIntoView({ block: 'center' });
  const q = b.getBoundingClientRect();
  return { x: q.x, y: q.y, w: q.width, h: q.height, text: (b.innerText || '').trim() };
}, rx);

const create = await findButton('^create custom role');
R.createButton = create;
if (!create) { R.abort = 'no "Create Custom Role" button on the roles screen'; out(); L(R.abort);
  await browser.close(); process.exit(2); }
await clickBox(create);
await page.waitForTimeout(4000);
await park();

// WHAT DOES THE FORM ASK FOR? Dump it before touching anything.
const dumpForm = () => page.evaluate(() => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  const d = [...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
  const scope = d || document;
  return {
    inDialog: !!d,
    url: location.pathname,
    fields: [...scope.querySelectorAll('.q-field')].filter(vis).map(f => ({
      label: ((f.querySelector('.q-field__label') || {}).innerText || '').trim(),
      value: ((f.querySelector('input,textarea') || {}).value || ''),
      tag: (f.querySelector('input,textarea') || {}).tagName || null })),
    buttons: [...scope.querySelectorAll('button,.q-btn')].filter(vis)
      .map(b => (b.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 20),
    cards: [...scope.querySelectorAll('.permission-card__title')].filter(vis)
      .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()),
    text: (scope.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 600),
  };
});
R.form = await dumpForm();
L('form:', JSON.stringify(R.form, null, 1).slice(0, 1600));
out();

// STEP 2: "Skip" starts from scratch -- which is the whole point. Every stock role on this branch
// carries work-orders access, so the only role that can lack it is one that never had it.
const skip = await findButton('^skip$');
R.skipButton = skip;
if (!skip) { R.abort = 'the template step offered no "Skip"'; out(); L(R.abort);
  await browser.close(); process.exit(3); }
await clickBox(skip);
await page.waitForTimeout(5000);
await park();
R.afterSkip = await dumpForm();
L('after Skip:', JSON.stringify({ fields: R.afterSkip.fields, buttons: R.afterSkip.buttons,
  cards: R.afterSkip.cards }, null, 1).slice(0, 1200));
out();

if (!SAVE) { L('\nDUMP ONLY -- nothing was created. Re-run with SAVE=1 once the form is understood.');
  await browser.close(); process.exit(0); }

// STEP 3: name it, give it ONE permission as a positive control, and save.
// Customers View is the control: if the search shows nothing at all for this role the reading is
// worthless, because "no work orders" and "no results whatsoever" look identical (Rule 104).
const nameField = await page.evaluate(() => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  const f = [...document.querySelectorAll('.q-field')].filter(vis).find(x =>
    /name/i.test(((x.querySelector('.q-field__label') || {}).innerText || '')));
  const el = (f || {}).querySelector ? f.querySelector('input,textarea') : null;
  const t = el || [...document.querySelectorAll('input[type=text],input:not([type])')].filter(vis)[0];
  if (!t) return null; t.scrollIntoView({ block: 'center' });
  const r = t.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height };
});
R.nameField = !!nameField;
if (nameField) { await clickBox(nameField);
  await page.keyboard.press('Control+a').catch(() => {});
  await page.keyboard.type(NAME, { delay: 40 }); }
await page.waitForTimeout(800);
await park();

const setBox = async (card, column) => {
  const b = await page.evaluate(([c, col]) => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
    const titles = [...document.querySelectorAll('.permission-card__title')].filter(vis)
      .map(e => ({ y: e.getBoundingClientRect().top, name: (e.innerText || '').trim() }))
      .sort((a, b) => a.y - b.y);
    const cardFor = y => { const a = titles.filter(t => t.y <= y + 6); return a.length ? a[a.length - 1].name : null; };
    const cols = [...document.querySelectorAll('.permission-card__column-label')].filter(vis)
      .map(e => { const r = e.getBoundingClientRect();
                  return { y: r.top, mid: r.left + r.width / 2, name: (e.innerText || '').trim() }; });
    const target = [...document.querySelectorAll('.q-checkbox')].filter(vis).find(e => {
      const r = e.getBoundingClientRect();
      if (cardFor(r.top) !== c) return false;
      const same = cols.filter(x => cardFor(x.y) === c);
      let best = null, bd = 1e9;
      for (const x of same) { const d = Math.abs(x.mid - (r.left + r.width / 2)); if (d < bd) { bd = d; best = x; } }
      return best && bd < 90 && best.name === col;
    });
    if (!target) return null;
    target.scrollIntoView({ block: 'center' });
    const r = target.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height,
      already: target.getAttribute('aria-checked') === 'true'
               || /q-checkbox--truthy/.test((target.className || '').toString()) };
  }, [card, column]);
  if (!b) return { ok: false, why: `no "${column}" checkbox on the "${card}" card` };
  if (b.already) return { ok: true, already: true };
  await clickBox(b); await page.waitForTimeout(600);
  return { ok: true };
};
R.customersView = await setBox('Customers', 'View');
L('Customers:View ->', JSON.stringify(R.customersView));
await park();

const saveBtn = await findButton('^(save|create)\\b');
R.saveButton = saveBtn;
if (saveBtn) { await clickBox(saveBtn); await page.waitForTimeout(4000); }
R.afterSave = await dumpForm();
// a confirmation step, if the app asks for one -- named, not guessed by position
const confirm = await findButton('^(confirm|save|yes|create)\\b');
if (R.afterSave.inDialog && confirm) { await clickBox(confirm); R.confirmedWith = confirm.text;
  await page.waitForTimeout(5000); }
await page.waitForTimeout(4000);
R.urlAfterSave = page.url();

// PROVE IT: go back to the list and read the role off the page, not off the closed form
await page.goto('https://sv9160.qa.shopview.com/administration/roles-permissions',
                { waitUntil: 'domcontentloaded' }).catch(() => {});
await page.waitForTimeout(7000);
R.listAfter = await page.evaluate(n => {
  const rows = [...document.querySelectorAll('tr')].map(r => (r.innerText || '').replace(/\s+/g, ' ').trim());
  return { created: rows.some(t => t.includes(n)), row: rows.find(t => t.includes(n)) || null,
           count: rows.length };
}, NAME);
L('role created and visible in the list:', JSON.stringify(R.listAfter));
out();
await browser.close();
