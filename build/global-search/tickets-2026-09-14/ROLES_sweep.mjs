// The six role cases, now that a staff member's role CAN be changed through the screen.
//
// For each role in turn: set it on one spare technician through the staff screen, sign in as that
// person (impersonate), read what the server says the account can do, then run one search and read
// what the panel offers. Restore the person to Technician at the end, whatever happens.
//
// Subject: Clayton Stephens, an active technician, chosen because nothing else in this pass depends
// on him. The admin account is NEVER touched - standing instruction.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';

const DIR = '/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const SUBJECT = 'clayton.stephens@staging.shopview.local';
const SUBJECT_NAME = 'Clayton Stephens';
const RESTORE_TO = 'Technician';
const QUERY = 'Bridgeport';
const ROLES = (process.env.ROLES || 'Time Clock User|Parts Technician|Service Advisor|Technician').split('|');

const R = { at: new Date().toISOString(), subject: SUBJECT, query: QUERY, roles: {} };
const save = () => fs.writeFileSync(`${DIR}/ROLES-SWEEP.json`, JSON.stringify(R, null, 2));
const L = (...a) => console.log(...a);

const { browser, page, APIH } = await boot('sv9160', '/administration/staff', 'admin');
const api = async (p, method = 'GET', body = null) => page.evaluate(async ([u, m, b]) => {
  try {
    const r = await fetch(u, { method: m, headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      credentials: 'include', body: b ? JSON.stringify(b) : undefined });
    const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {}
    return { status: r.status, json: j, body: t.slice(0, 300) };
  } catch (e) { return { error: String(e).slice(0, 160) }; }
}, [`https://${APIH}${p}`, method, body]);

// ---------- the working staff-edit route (real mouse, popup-scoped options)
const clickReal = async (fn, arg) => {
  const box = await page.evaluate(fn, arg);
  if (!box) return { ok: false, why: 'no element matched' };
  const vp = page.viewportSize() || { width: 1280, height: 900 };
  const x = box.x + box.w / 2, y = box.y + box.h / 2;
  if (x < 0 || y < 0 || x > vp.width || y > vp.height)
    return { ok: false, why: `off-screen at ${Math.round(x)},${Math.round(y)}` };
  await page.mouse.move(x, y); await page.waitForTimeout(150);
  await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up();
  return { ok: true };
};
const searchStaff = async term => {
  const b = await page.evaluate(() => { const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
    const btn = [...document.querySelectorAll('button,.q-btn,[role=button]')].filter(vis)
      .find(e => /^search$/i.test((e.innerText || '').replace(/\s+/g, ' ').trim()));
    if (!btn) return null; const r = btn.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  if (b) { await page.mouse.click(b.x + b.w / 2, b.y + b.h / 2); await page.waitForTimeout(1200); }
  const i = await page.evaluate(() => { const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
    const el = [...document.querySelectorAll('input[type=text],input:not([type])')].filter(vis)[0];
    if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  if (i) await page.mouse.click(i.x + i.w / 2, i.y + i.h / 2);
  // CLEAR FIRST. Typing into a box that already holds the term makes "StephensStephens", the row
  // vanishes, and every later role reports "the dialog did not open" -- which reads as the screen
  // refusing to edit that person and is nothing of the kind.
  await page.keyboard.press('Control+a').catch(() => {});
  await page.keyboard.press('Backspace').catch(() => {});
  await page.waitForTimeout(600);
  await page.keyboard.type(term, { delay: 60 });
  await page.waitForTimeout(4500);
  const hits = await page.evaluate(t => [...document.querySelectorAll('tr')]
    .map(r => (r.innerText || '').replace(/\s+/g, ' ').trim())
    .filter(x => x.includes(t)).length, term);
  return hits;
};
const openEditor = async email => {
  const r = await clickReal(em => {
    const rows = [...document.querySelectorAll('tr')].filter(x => (x.innerText || '').includes(em));
    if (!rows.length) return null;
    rows[0].scrollIntoView({ block: 'center' });
    const vis = e => { const b = e.getBoundingClientRect(); return b.width > 2 && b.height > 2; };
    const hit = [...rows[0].querySelectorAll('*')].filter(vis)
      .filter(e => (e.textContent || '').trim() === 'edit_note')
      .sort((a, b) => (a.getBoundingClientRect().width * a.getBoundingClientRect().height)
                    - (b.getBoundingClientRect().width * b.getBoundingClientRect().height))[0];
    if (!hit) return null; const b = hit.getBoundingClientRect();
    return { x: b.x, y: b.y, w: b.width, h: b.height };
  }, email);
  for (let i = 0; i < 8; i++) { await page.waitForTimeout(1000);
    if (await page.evaluate(() => !!document.querySelector('.q-dialog'))) return { ...r, dialog: true }; }
  return { ...r, dialog: false };
};
const fieldBox = label => {
  const d = document.querySelector('.q-dialog'); if (!d) return null;
  const f = [...d.querySelectorAll('.q-field')]
    .find(x => new RegExp('^' + label, 'i').test(((x.querySelector('.q-field__label') || {}).innerText || '').trim()));
  if (!f) return null;
  const c = f.querySelector('.q-field__control') || f; const r = c.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height };
};
// options come from the LAST .q-menu only -- the staff table behind the dialog is itself .q-item rows
// EXACT option text first. A substring match for "Service Advisor" selects "Senior Service
// Advisor", which sits above it in the list and contains it -- the same loose-match family as the
// staff table read as a dropdown. Substring is kept only as a fallback for options that carry a
// tick or a count alongside the name.
// Scroll and measure are SEPARATE steps. Doing both inside one evaluate reads the rect before the
// scroll has landed, so the last option in a long list ("Time Clock User", eleventh of eleven)
// measures off-screen and the click is refused -- which then reads as "that role cannot be set".
const FINDER = `(t) => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  const menus = [...document.querySelectorAll('.q-menu')].filter(vis);
  if (!menus.length) return null;
  const m = menus[menus.length - 1];
  const items = [...m.querySelectorAll('.q-item,[role=option]')].filter(vis);
  const txt = e => (e.innerText || '').replace(/\\s+/g, ' ').trim();
  return items.findIndex(e => txt(e) === t)
    !== -1 ? items.findIndex(e => txt(e) === t)
    : (items.findIndex(e => txt(e).replace(/^check\\s+/, '') === t) !== -1
        ? items.findIndex(e => txt(e).replace(/^check\\s+/, '') === t)
        : items.findIndex(e => txt(e).includes(t)));
}`;
const pickFromPopup = async text => {
  const idx = await page.evaluate(FINDER, text);
  if (idx === null || idx < 0) {
    const seen = await page.evaluate(() => { const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
      const menus = [...document.querySelectorAll('.q-menu')].filter(vis);
      if (!menus.length) return [];
      return [...menus[menus.length - 1].querySelectorAll('.q-item,[role=option]')]
        .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()); });
    return { ok: false, why: `"${text}" is not in the popup`, optionsSeen: seen };
  }
  // step 1: scroll it into view, then let the scroll settle
  await page.evaluate(i => { const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
    const menus = [...document.querySelectorAll('.q-menu')].filter(vis);
    if (!menus.length) return;            // the popup can close between finding and scrolling
    const items = [...menus[menus.length - 1].querySelectorAll('.q-item,[role=option]')].filter(vis);
    items[i] && items[i].scrollIntoView({ block: 'center' }); }, idx);
  await page.waitForTimeout(700);
  // step 2: measure and click where it actually IS now
  const r = await clickReal(i => { const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
    const menus = [...document.querySelectorAll('.q-menu')].filter(vis);
    if (!menus.length) return null;
    const items = [...menus[menus.length - 1].querySelectorAll('.q-item,[role=option]')].filter(vis);
    const el = items[i]; if (!el) return null;
    const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; }, idx);
  return r;
};

const setRole = async role => {
  await page.goto('https://sv9160.qa.shopview.com/administration/staff', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(6000);
  const hits = await searchStaff('Stephens');
  if (!hits) return { ok: false, why: 'the staff search returned no row for Stephens, so the editor '
                                      + 'was never reached - this is the search box, not the editor' };
  const ed = await openEditor(SUBJECT);
  if (!ed.dialog) return { ok: false, why: 'the edit dialog did not open', ed, searchHits: hits };
  await clickReal(fieldBox, 'Role'); await page.waitForTimeout(1500);
  const picked = await pickFromPopup(role);
  await page.waitForTimeout(1500);
  // Location is required; re-pick it so a blank one never blocks the save
  await clickReal(fieldBox, 'Location'); await page.waitForTimeout(1500);
  await pickFromPopup('Staging'); await page.waitForTimeout(1200);
  const saved = await clickReal(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
    const d = document.querySelector('.q-dialog'); if (!d) return null;
    const b = [...d.querySelectorAll('button')].filter(vis)
      .find(e => /^save/i.test((e.innerText || '').replace(/\s+/g, ' ').trim()));
    if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  await page.waitForTimeout(6000);
  const after = await page.evaluate(() => ({
    dialogStillOpen: !!document.querySelector('.q-dialog'),
    errors: [...document.querySelectorAll('.q-field--error,.text-negative,.q-notification')]
      .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 5) }));
  const row = await page.evaluate(em => {
    const r = [...document.querySelectorAll('tr')].find(x => (x.innerText || '').includes(em));
    return r ? (r.innerText || '').replace(/\s+/g, ' ').trim() : null; }, SUBJECT);
  // "saved without an error" is not the same as "saved what was asked for" -- the row is the proof.
  // Reading the row needs care twice over: this person's JOB TITLE is "Heavy Duty Field Technician",
  // so the word Technician is in the row whatever the role is, and "Parts Technician" contains
  // "Technician". So: find every KNOWN ROLE NAME present and take the LONGEST -- that is the role.
  const KNOWN = ['Admin', 'Foreman', 'Office User', 'Parts Manager', 'Parts Technician',
                 'Sales Representative', 'Senior Service Advisor', 'Service Advisor',
                 'Service Manager', 'Technician', 'Time Clock User'];
  const present = KNOWN.filter(k => (row || '').includes(k)).sort((a, b) => b.length - a.length);
  const roleOnRow = present[0] === role;
  return { ok: !after.dialogStillOpen && after.errors.length === 0 && roleOnRow,
           savedWithoutError: !after.dialogStillOpen && after.errors.length === 0,
           picked, saved, after, rowNow: row, roleOnRow, roleReadFromRow: present[0] || null };
};

// ---------- read what the SERVER says this account can do, never the browser's cached copy
// The field is fe_permissions (snake), NOT fePermissions -- reading only the camel spelling returns
// "0 things", which reads as "this account can do nothing" and is a fault in the reader. Both are
// tried, and if NEITHER answers, this returns ok:false so the caller records nothing rather than
// attributing a search result to an identity it could not confirm (Rule 12, Rule 104).
const whoAmI = async () => {
  const r = await api('/api/auth/me/fe-permissions');
  const d = r.json && (r.json.data !== undefined ? r.json.data : r.json);
  const list = d && (d.fe_permissions || d.fePermissions || d.permissions);
  const perms = Array.isArray(list) ? list : (list ? Object.values(list) : []);
  const slug = d && (d.template_slug || d.templateSlug
                     || (d.role && (d.role.template_slug || d.role.templateSlug)));
  return { ok: r.status === 200 && !!slug, status: r.status, templateSlug: slug || null,
           roleName: d && ((d.role && d.role.name) || d.role_name) || null,
           nPerms: perms.length, perms: perms.map(p => p.name || p).sort(),
           rawKeys: d && typeof d === 'object' ? Object.keys(d).slice(0, 12) : null };
};

const openModal = async () => { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(600);
  await page.evaluate(() => { const b = document.querySelector('[data-test-id="global_search_trigger"]'); b && b.click(); });
  await page.waitForSelector('[data-test-id="search_modal_input"]', { state: 'visible', timeout: 20000 }); };
const readModal = async () => page.evaluate(() => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  const d = [...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if (!d) return null;
  const tabs = {}; d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e => {
    const t = (e.innerText || '').match(/\((\d+)\)/);
    tabs[e.getAttribute('data-test-id').replace('search_modal_tab_', '')] = t ? +t[1] : null; });
  return { tabs, tabsPresent: Object.keys(tabs),
    rowTypes: [...new Set([...d.querySelectorAll('[data-test-id^="search_result_row_"]')]
      .map(e => e.getAttribute('data-test-id').replace('search_result_row_', '').replace(/_\d+$/, '')))] }; });
const searchAs = async () => {
  await page.goto('https://sv9160.qa.shopview.com/workorders', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(4000);
  await openModal();
  await page.click('[data-test-id="search_modal_input"]');
  await page.fill('[data-test-id="search_modal_input"]', '');
  await page.type('[data-test-id="search_modal_input"]', QUERY, { delay: 30 });
  await page.evaluate(() => { const t = document.querySelector('[data-test-id="search_modal_tab_all"]'); t && t.click(); });
  let last = null, st = 0;
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(800); const m = await readModal(); if (!m) continue;
    const sig = JSON.stringify(m);
    const tc = Object.entries(m.tabs).filter(([k]) => !['strip', 'all'].includes(k)).map(([, v]) => v);
    if (sig === last && tc.some(v => v !== null)) { if (++st >= 3) return m; } else st = 0;
    last = sig;
  }
  return await readModal();
};

// ---------- the sweep
// Resolve the person LIVE. The local STAFF-LIVE.json holds 66 people and the screen lists 94, so
// this subject is simply not in it -- and an absent id silently skipped every measurement on the
// first run while the role changes themselves all succeeded. A local snapshot is never evidence
// about the live system (Rule 100).
{
  let found = null;
  for (const path of ['/api/staff?limit=500', '/api/staff?search=Stephens&limit=100']) {
    const r = await api(path);
    const d = r.json && (r.json.data !== undefined ? r.json.data : r.json);
    const arr = Array.isArray(d) ? d : (d && typeof d === 'object'
      ? (Object.values(d).find(v => Array.isArray(v)) || []) : []);
    found = arr.find(x => (x.email || '') === SUBJECT);
    if (found) { R.subjectFoundVia = path; break; }
  }
  if (!found) {
    const staff = JSON.parse(fs.readFileSync(`${DIR}/STAFF-LIVE.json`, 'utf8'));
    found = staff.find(x => x.email === SUBJECT);
    if (found) R.subjectFoundVia = 'the local snapshot (the live list did not carry them)';
  }
  R.subjectId = found && found.id;
  R.subjectResolved = !!R.subjectId;
}
if (!R.subjectId) {
  R.abort = `could not resolve an id for ${SUBJECT}; nothing would be measured, so nothing was changed`;
  save(); console.log(R.abort); await browser.close(); process.exit(2);
}
console.log('subject id:', R.subjectId, 'via', R.subjectFoundVia);

// POSITIVE CONTROL: the administrator's own view of the same query, so "fewer tabs" means something
{ const who = await whoAmI();
  const m = await searchAs();
  R.adminBaseline = { who, modal: m };
  if (!who.ok) { R.abort = 'the server would not identify even the administrator session, so no '
    + 'permission comparison is possible this run; nothing was changed';
    save(); console.log(R.abort); await browser.close(); process.exit(2); }
  console.log('admin baseline:', JSON.stringify(R.adminBaseline.modal && R.adminBaseline.modal.tabs)); }
save();

try {
for (const role of ROLES) {
  L(`\n=== ${role} ===`);
  const set = await setRole(role);
  L('  set role:', set.ok ? 'saved' : 'FAILED',
    '| role now reads:', set.roleReadFromRow || '(unread)',
    set.ok ? '' : '| why: ' + JSON.stringify(set.picked || set.why || set.ed || ''));
  const entry = { set };
  if (set.ok && R.subjectId) {
    const sw = await api('/api/switch-user', 'POST', { user_id: R.subjectId });
    entry.switch = { status: sw.status };
    if (sw.status === 200) {
      await page.waitForTimeout(2500);
      entry.who = await whoAmI();
      if (!entry.who.ok) {
        entry.modal = null;
        entry.notRecorded = 'the server would not say who this session is, so the search result is '
          + 'not attributed to this role (HTTP ' + entry.who.status + ', keys '
          + JSON.stringify(entry.who.rawKeys) + ')';
        L('  COULD NOT CONFIRM WHO I AM -- nothing recorded for this role:', entry.notRecorded);
      } else {
        entry.modal = await searchAs();
        L('  signed in as:', entry.who.templateSlug, '| can do:', entry.who.nPerms, 'things');
        L('  search offers:', JSON.stringify(entry.modal && entry.modal.tabs));
        L('  rows shown   :', JSON.stringify(entry.modal && entry.modal.rowTypes));
      }
    } else {
      L('  could not sign in as this person: HTTP', sw.status);
    }
  } else if (!set.ok) {
    L('  role was NOT saved, so nothing was measured for this role');
  }
  R.roles[role] = entry;
  save();
  // back to the administrator before the next staff edit
  await page.goto('https://sv9160.qa.shopview.com/workorders', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(2500);
}
} catch (e) {
  // A crash must NEVER skip the restore. The last run threw inside a popup read and left the
  // person on whatever role the sweep had reached.
  R.crashed = String(e).slice(0, 300);
  L('the sweep threw, restoring anyway:', R.crashed);
  save();
}

// ---------- ALWAYS put the person back
L('\n=== restoring ===');
const back = await setRole(RESTORE_TO);
R.restored = back;
R.restoredOk = !!(back.ok && back.roleOnRow);
L('restored to', RESTORE_TO, ':', R.restoredOk ? 'yes' : 'NO -- SAY SO IN THE REPORT',
  '| row:', (back.rowNow || '').slice(0, 90));
save();
console.log('\n' + JSON.stringify({ restoredOk: R.restoredOk,
  perRole: Object.fromEntries(Object.entries(R.roles).map(([k, v]) =>
    [k, { saved: v.set && v.set.ok, perms: v.who && v.who.nPerms, tabs: v.modal && v.modal.tabs }])) }, null, 2));
await browser.close();
