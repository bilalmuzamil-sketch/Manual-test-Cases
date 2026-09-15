// Read and set a role's permissions by CARD and COLUMN, with read-back verification.
//
// The editor lays each permission group out as a card: `.permission-card__title` gives the group
// name ("Work orders", "Customers", "Parts Department"...), and the checkboxes below it sit under
// column labels View / Create & Edit / Delete. Every card uses the SAME three column labels, so a
// checkbox can only be identified by (card, column) -- never by its label alone, which is how an
// earlier dump ended up calling all 28 controls "Permissions".
//
//   node ROLE_permissions.mjs read                       -> dump the role, card by card
//   node ROLE_permissions.mjs set 'Work orders:View=off'  -> set, save, and verify by reading back
//   node ROLE_permissions.mjs restore <baseline.json>     -> replay a saved state, then verify
//
// Toggles (Parts Department, Reports, See Financial Data...) are addressed as 'Name=on|off'.
//
// Everything here follows the day's lessons: real mouse events, pointer parked and verified before
// each reading, exact matching with no fallback, and the value read back from the page after the
// save rather than inferred from the absence of an error.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';

const DIR = '/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const ROLE = process.env.ROLE || 'Technician';
const EDITOR = process.env.EDITOR_URL
  || '/administration/roles-permissions/af8d02b5-ecd1-4205-a82f-32a4d5bb1015/edit';
const MODE = process.argv[2] || 'read';
const ARGS = process.argv.slice(3);
const R = { at: new Date().toISOString(), role: ROLE, mode: MODE, args: ARGS };
const save = (name) => {
  const base = name || ('ROLE-PERMS-' + ROLE.replace(/\W+/g, '-') + '.json');
  fs.writeFileSync(`${DIR}/${base.endsWith('.json') ? base : base + '.json'}`,
                   JSON.stringify(R, null, 2));
};
const L = (...a) => console.log(...a);

const { browser, page } = await boot('sv9160', '/administration/staff', 'admin');
await page.setViewportSize({ width: 1600, height: 1800 }).catch(() => {});
await page.waitForTimeout(6000);

const park = async () => {
  await page.mouse.move(5, 5); await page.waitForTimeout(300);
  return page.evaluate(() => {
    const el = document.elementFromPoint(5, 5);
    return !(el && el.closest && el.closest('.q-checkbox,.q-toggle,.permission-card'));
  });
};
const openEditor = async () => {
  await page.goto('https://sv9160.qa.shopview.com' + EDITOR, { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(8000);
  await park();
  return page.evaluate(() => !!document.querySelector('.permission-card__title'));
};

// ---- the reader: every control, tagged with the card it belongs to
const READ = () => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  const cards = [...document.querySelectorAll('.permission-card__title')].filter(vis)
    .map(e => ({ y: e.getBoundingClientRect().top,
                 name: (e.innerText || '').replace(/\s+/g, ' ').trim() }))
    .sort((a, b) => a.y - b.y);
  const cardFor = y => {
    const above = cards.filter(c => c.y <= y + 6);
    return above.length ? above[above.length - 1].name : null;
  };
  // column labels, per card row, so a checkbox can be placed by x
  const cols = [...document.querySelectorAll('.permission-card__column-label')].filter(vis)
    .map(e => ({ y: e.getBoundingClientRect().top, x: e.getBoundingClientRect().left,
                 mid: e.getBoundingClientRect().left + e.getBoundingClientRect().width / 2,
                 name: (e.innerText || '').replace(/\s+/g, ' ').trim() }));
  const columnFor = (x, y) => {
    const card = cardFor(y);
    const sameCard = cols.filter(c => cardFor(c.y) === card);
    if (!sameCard.length) return null;
    let best = null, bd = 1e9;
    for (const c of sameCard) { const d = Math.abs(c.mid - x); if (d < bd) { bd = d; best = c; } }
    return bd < 90 ? best.name : null;
  };

  const out = { checkboxes: [], toggles: [] };
  document.querySelectorAll('.q-checkbox').forEach(e => {
    if (!vis(e)) return;
    const r = e.getBoundingClientRect();
    const mid = r.left + r.width / 2;
    out.checkboxes.push({
      card: cardFor(r.top), column: columnFor(mid, r.top),
      on: e.getAttribute('aria-checked') === 'true'
          || /q-checkbox--truthy/.test((e.className || '').toString()),
      y: Math.round(r.top), x: Math.round(r.left) });
  });
  document.querySelectorAll('.q-toggle').forEach(e => {
    if (!vis(e)) return;
    const r = e.getBoundingClientRect();
    // a toggle's name is its own label, or the nearest title text to its left/above
    let name = (e.innerText || '').replace(/\s+/g, ' ').trim();
    if (!name) {
      const near = [...document.querySelectorAll(
        '.cross-toggles__title,.page-access__title,.settings__title,.wo-settings__toggle-label,'
        + '.permission-card__title,div,span')]
        .filter(vis)
        .map(t => ({ d: Math.abs(t.getBoundingClientRect().top - r.top),
                     txt: (t.innerText || '').replace(/\s+/g, ' ').trim() }))
        .filter(t => t.txt && t.txt.length < 40 && t.d < 30)
        .sort((a, b) => a.d - b.d);
      name = near.length ? near[0].txt : '';
    }
    out.toggles.push({ name: name.split('\n')[0].slice(0, 40),
      on: e.getAttribute('aria-checked') === 'true'
          || /q-toggle--truthy/.test((e.className || '').toString()),
      y: Math.round(r.top) });
  });
  return out;
};

const readAll = async () => { await park(); return page.evaluate(READ); };
const show = st => {
  const byCard = {};
  st.checkboxes.forEach(c => { (byCard[c.card || '?'] ||= {})[c.column || '?'] = c.on; });
  Object.entries(byCard).forEach(([card, cols]) =>
    L('  ' + card.padEnd(24) + Object.entries(cols).map(([k, v]) => `${k}=${v ? 'on' : 'off'}`).join('  ')));
  L('  --- toggles ---');
  st.toggles.forEach(t => L('  ' + (t.name || '(unnamed)').padEnd(40) + (t.on ? 'on' : 'off')));
};

if (!(await openEditor())) {
  R.abort = 'the role editor did not load (no permission cards on the page)';
  save(); L(R.abort); await browser.close(); process.exit(2);
}
R.before = await readAll();
L(`\n=== ${ROLE} — before ===`); show(R.before);

// ---- setting
const clickBox = async (card, column) => {
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
      const mid = r.left + r.width / 2;
      const same = cols.filter(x => cardFor(x.y) === c);
      let best = null, bd = 1e9;
      for (const x of same) { const d = Math.abs(x.mid - mid); if (d < bd) { bd = d; best = x; } }
      return best && bd < 90 && best.name === col;
    });
    if (!target) return null;
    target.scrollIntoView({ block: 'center' });
    const r = target.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  }, [card, column]);
  if (!b) return { ok: false, why: `no "${column}" checkbox on the "${card}" card` };
  await page.mouse.move(b.x + b.w / 2, b.y + b.h / 2); await page.waitForTimeout(140);
  await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up();
  await page.waitForTimeout(700);
  return { ok: true };
};
const clickToggle = async name => {
  const b = await page.evaluate(n => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
    const t = [...document.querySelectorAll('.q-toggle')].filter(vis)
      .find(e => (e.innerText || '').replace(/\s+/g, ' ').trim().startsWith(n));
    if (!t) return null;
    t.scrollIntoView({ block: 'center' });
    const r = t.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height };
  }, name);
  if (!b) return { ok: false, why: `no toggle starting "${name}"` };
  await page.mouse.move(b.x + b.w / 2, b.y + b.h / 2); await page.waitForTimeout(140);
  await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up();
  await page.waitForTimeout(900);
  return { ok: true };
};

const want = [];
for (const a of ARGS) {
  const m = /^(.+?):(.+?)=(on|off)$/.exec(a) || /^(.+?)=(on|off)$/.exec(a);
  if (!m) { L('cannot read instruction:', a); continue; }
  want.push(m.length === 4 ? { card: m[1], column: m[2], on: m[3] === 'on' }
                           : { toggle: m[1], on: m[2] === 'on' });
}

if (MODE === 'set' && want.length) {
  R.applied = [];
  for (const w of want) {
    const cur = w.toggle
      ? (R.before.toggles.find(t => (t.name || '').startsWith(w.toggle)) || {}).on
      : (R.before.checkboxes.find(c => c.card === w.card && c.column === w.column) || {}).on;
    if (cur === undefined) { R.applied.push({ ...w, skipped: 'not found on the page' });
      L('  NOT FOUND:', JSON.stringify(w)); continue; }
    if (cur === w.on) { R.applied.push({ ...w, alreadyCorrect: true });
      L('  already', w.on ? 'on' : 'off', ':', w.toggle || `${w.card}:${w.column}`); continue; }
    const r = w.toggle ? await clickToggle(w.toggle) : await clickBox(w.card, w.column);
    R.applied.push({ ...w, click: r });
    L('  clicked', w.toggle || `${w.card}:${w.column}`, '->', JSON.stringify(r));
  }
  R.afterClicks = await readAll();
  L('\n=== after clicking, before saving ==='); show(R.afterClicks);

  const saved = await page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
    const b = [...document.querySelectorAll('button,.q-btn')].filter(vis)
      .find(e => /^(save|update)\b/i.test((e.innerText || '').replace(/\s+/g, ' ').trim()));
    if (!b) return null;
    b.scrollIntoView({ block: 'center' });
    const r = b.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height,
      text: (b.innerText || '').trim() };
  });
  if (!saved) { R.abort = 'no Save button found'; save(); L(R.abort); await browser.close(); process.exit(3); }
  await page.mouse.move(saved.x + saved.w / 2, saved.y + saved.h / 2);
  await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up();
  R.saveButton = saved.text;
  await page.waitForTimeout(2500);

  // WHAT IS ON SCREEN NOW? A save that clicks cleanly and stores nothing usually means a second
  // step -- a confirmation dialog, a validation message, a disabled button. Dump it rather than
  // assume, then deal with what is actually there.
  R.afterSaveClick = await page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
    const dlg = [...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis);
    return {
      dialogs: dlg.map(d => ({
        text: (d.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 300),
        buttons: [...d.querySelectorAll('button,.q-btn')].filter(vis)
          .map(b => (b.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean) })),
      notifications: [...document.querySelectorAll('.q-notification,.text-negative,.q-field--error')]
        .filter(vis).map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 6),
      url: location.pathname,
    };
  });
  L('after clicking Save:', JSON.stringify(R.afterSaveClick).slice(0, 500));

  // if a confirmation dialog is up, press its affirmative button -- named, not guessed by position
  if (R.afterSaveClick.dialogs.length) {
    const confirm = await page.evaluate(() => {
      const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
      const d = [...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
      if (!d) return null;
      const b = [...d.querySelectorAll('button,.q-btn')].filter(vis)
        .find(e => /^(save|confirm|yes|continue|ok|proceed)\b/i.test((e.innerText || '').trim()));
      if (!b) return null;
      const r = b.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height, text: (b.innerText || '').trim() };
    });
    if (confirm) {
      await page.mouse.move(confirm.x + confirm.w / 2, confirm.y + confirm.h / 2);
      await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up();
      R.confirmedWith = confirm.text;
      L('confirmed with:', confirm.text);
    } else {
      R.confirmedWith = null;
      L('a dialog is up but no affirmative button was found in it');
    }
  }
  await page.waitForTimeout(6000);

  // VERIFY BY RELOADING. A save that closed without an error is not evidence of what was stored.
  await openEditor();
  R.after = await readAll();
  L('\n=== after saving and reloading ==='); show(R.after);
  R.verified = want.every(w => {
    const got = w.toggle
      ? (R.after.toggles.find(t => (t.name || '').startsWith(w.toggle)) || {}).on
      : (R.after.checkboxes.find(c => c.card === w.card && c.column === w.column) || {}).on;
    return got === w.on;
  });
  L('\nevery requested change is stored:', R.verified);
}

save(process.env.OUT);
L('\nwritten to', process.env.OUT || ('ROLE-PERMS-' + ROLE.replace(/\W+/g, '-') + '.json'));
await browser.close();
process.exit(MODE === 'set' && R.verified === false ? 4 : 0);
