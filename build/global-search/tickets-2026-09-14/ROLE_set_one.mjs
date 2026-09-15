// Set ONE staff member to ONE role, and prove it by reading the role back off their row.
//
// Deliberately does one thing per invocation. The sweep that did four roles in a loop left state
// behind between iterations (a search box that still held the previous term, a popup that had
// closed) and each failure looked like the screen refusing to edit that person. One role per run
// has no state to carry.
//
//   node ROLE_set_one.mjs "Technician"
//
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';

const DIR = '/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const ROLE = process.argv[2] || 'Technician';
const SUBJECT = process.env.SUBJECT || 'clayton.stephens@staging.shopview.local';
const SEARCH_TERM = process.env.SEARCH_TERM || 'Stephens';
const MEASURE = process.env.MEASURE === '1';
const QUERY = 'Bridgeport';
const KNOWN = ['Admin', 'Foreman', 'Office User', 'Parts Manager', 'Parts Technician',
               'Sales Representative', 'Senior Service Advisor', 'Service Advisor',
               'Service Manager', 'Technician', 'Time Clock User'];

const R = { at: new Date().toISOString(), subject: SUBJECT, wanted: ROLE };
const save = () => fs.writeFileSync(`${DIR}/ROLE-SET-${ROLE.replace(/\W+/g, '-')}.json`,
                                    JSON.stringify(R, null, 2));
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

const clickAt = async box => {
  const vp = page.viewportSize() || { width: 1280, height: 900 };
  const x = box.x + box.w / 2, y = box.y + box.h / 2;
  if (x < 0 || y < 0 || x > vp.width || y > vp.height)
    return { ok: false, why: `off-screen at ${Math.round(x)},${Math.round(y)}` };
  await page.mouse.move(x, y); await page.waitForTimeout(150);
  await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up();
  return { ok: true };
};
const clickReal = async (fn, arg) => {
  const box = await page.evaluate(fn, arg);
  if (!box) return { ok: false, why: 'no element matched' };
  return clickAt(box);
};
const roleOnRow = row => {
  const present = KNOWN.filter(k => (row || '').includes(k)).sort((a, b) => b.length - a.length);
  return present[0] || null;
};
const rowFor = async () => page.evaluate(em => {
  const r = [...document.querySelectorAll('tr')].find(x => (x.innerText || '').includes(em));
  return r ? (r.innerText || '').replace(/\s+/g, ' ').trim() : null; }, SUBJECT);

// A TALLER WINDOW IS THE REAL FIX. The Role list has eleven options; in a 900px window the last
// two fall below the bottom edge, and everything downstream -- scrollIntoView, measuring, clicking,
// even arrow-key focus -- was failing on that one fact. Give the page room and the list fits.
await page.setViewportSize({ width: 1600, height: 1400 }).catch(() => {});
await page.waitForTimeout(7000);

// --- find the person: clear the box first, always
{
  const b = await page.evaluate(() => { const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
    const btn = [...document.querySelectorAll('button,.q-btn,[role=button]')].filter(vis)
      .find(e => /^search$/i.test((e.innerText || '').replace(/\s+/g, ' ').trim()));
    if (!btn) return null; const r = btn.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  if (b) { await clickAt(b); await page.waitForTimeout(1500); }
  const i = await page.evaluate(() => { const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
    const el = [...document.querySelectorAll('input[type=text],input:not([type])')].filter(vis)[0];
    if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  if (i) await clickAt(i);
  await page.keyboard.press('Control+a').catch(() => {});
  await page.keyboard.press('Backspace').catch(() => {});
  await page.waitForTimeout(500);
  await page.keyboard.type(SEARCH_TERM, { delay: 60 });
  await page.waitForTimeout(5000);
}
R.rowBefore = await rowFor();
R.roleBefore = roleOnRow(R.rowBefore);
L('before:', R.roleBefore, '|', (R.rowBefore || '(row not found)').slice(0, 90));
if (!R.rowBefore) { R.abort = 'the staff search returned no row for ' + SUBJECT;
  save(); L(R.abort); await browser.close(); process.exit(2); }

if (R.roleBefore === ROLE) {
  L('already on', ROLE, '- nothing to change');
  R.ok = true; R.roleAfter = R.roleBefore; R.alreadyCorrect = true;
} else {
  // --- open the editor
  const opened = await clickReal(em => {
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
  }, SUBJECT);
  R.openedEditor = opened;
  let dialog = false;
  for (let i = 0; i < 10; i++) { await page.waitForTimeout(1000);
    if (await page.evaluate(() => !!document.querySelector('.q-dialog'))) { dialog = true; break; } }
  R.dialogOpen = dialog;
  if (!dialog) { R.abort = 'the edit dialog did not open'; save(); L(R.abort); await browser.close(); process.exit(3); }

  const fieldBox = label => {
    const d = document.querySelector('.q-dialog'); if (!d) return null;
    const f = [...d.querySelectorAll('.q-field')]
      .find(x => new RegExp('^' + label, 'i').test(((x.querySelector('.q-field__label') || {}).innerText || '').trim()));
    if (!f) return null;
    const c = f.querySelector('.q-field__control') || f; const r = c.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  };
  // options live in the LAST .q-menu -- the staff table behind the dialog is .q-item rows too
  const optionIndex = async text => page.evaluate(t => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
    const menus = [...document.querySelectorAll('.q-menu')].filter(vis);
    if (!menus.length) return -2;
    const items = [...menus[menus.length - 1].querySelectorAll('.q-item,[role=option]')].filter(vis);
    const txt = e => (e.innerText || '').replace(/\s+/g, ' ').trim();
    let i = items.findIndex(e => txt(e) === t);
    if (i < 0) i = items.findIndex(e => txt(e).replace(/^check\s+/, '') === t);
    if (i < 0) i = items.findIndex(e => txt(e).includes(t));
    return i;
  }, text);
  // KEYBOARD FIRST. Clicking an option means measuring where it is, and a list of eleven runs past
  // the bottom of the window -- scrollIntoView scrolls the PAGE, not the popup, so the tenth and
  // eleventh options keep measuring off-screen and the click is refused six times in a row. Arrowing
  // to the option and pressing Enter has no geometry in it at all. The highlighted option is read
  // back on every step, so this stops on the right one rather than counting blind.
  const highlightedOption = async () => page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
    const menus = [...document.querySelectorAll('.q-menu')].filter(vis);
    if (!menus.length) return null;
    const m = menus[menus.length - 1];
    const items = [...m.querySelectorAll('.q-item,[role=option]')].filter(vis);
    const act = items.find(e => /q-manual-focusable--focused|q-item--active|active|selected/i
      .test((e.className || '').toString()) || e.getAttribute('aria-selected') === 'true');
    return act ? (act.innerText || '').replace(/\s+/g, ' ').trim() : null; });
  const pickByKeyboard = async text => {
    const seen = [];
    for (let i = 0; i < 24; i++) {
      const cur = await highlightedOption();
      if (cur) seen.push(cur);
      if (cur && (cur === text || cur.replace(/^check\s+/, '') === text)) {
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1200);
        return { ok: true, via: 'keyboard', steps: i, seen: seen.slice(-4) };
      }
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(260);
    }
    return { ok: false, why: `arrowed through the list without landing on "${text}"`,
             seen: [...new Set(seen)] };
  };

  // If no popup is on the page, the field never opened -- RE-CLICK IT rather than spending six
  // retries reading an empty document. "seen: []" with no options anywhere is the signature of a
  // select that was never opened, not of a select with nothing in it.
  const ensureOpen = async label => {
    for (let i = 0; i < 5; i++) {
      const n = await page.evaluate(() => { const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
        return [...document.querySelectorAll('.q-menu')].filter(vis).length; });
      if (n > 0) return true;
      await clickReal(fieldBox, label);
      await page.waitForTimeout(2000);
    }
    return false;
  };

  const pick = async (text, label) => {
    if (label) {
      const opened = await ensureOpen(label);
      if (!opened) return { ok: false, why: `the ${label} list never opened` };
    }
    const kb = await pickByKeyboard(text);
    if (kb.ok) return kb;
    // fall back to clicking, for a popup that does not take arrow keys
    for (let attempt = 0; attempt < 6; attempt++) {
      const idx = await optionIndex(text);
      if (idx === -2) { await page.waitForTimeout(800); continue; }   // popup not up yet
      if (idx < 0) {
        const seen = await page.evaluate(() => { const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
          const menus = [...document.querySelectorAll('.q-menu')].filter(vis);
          if (!menus.length) return [];
          return [...menus[menus.length - 1].querySelectorAll('.q-item,[role=option]')]
            .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()); });
        return { ok: false, why: `"${text}" not offered`, optionsSeen: seen };
      }
      // scrollIntoView scrolls the PAGE. The popup is its own scroll container, so move THAT.
      await page.evaluate(i => { const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
        const menus = [...document.querySelectorAll('.q-menu')].filter(vis);
        if (!menus.length) return;
        const m = menus[menus.length - 1];
        const items = [...m.querySelectorAll('.q-item,[role=option]')].filter(vis);
        const el = items[i]; if (!el) return;
        const scroller = [m, ...m.querySelectorAll('.scroll,.q-scrollarea__container,.q-virtual-scroll')]
          .find(c => c.scrollHeight > c.clientHeight + 4) || m;
        scroller.scrollTop = Math.max(0, el.offsetTop - scroller.clientHeight / 2);
        el.scrollIntoView({ block: 'center' }); }, idx);
      await page.waitForTimeout(700);
      const box = await page.evaluate(i => { const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
        const menus = [...document.querySelectorAll('.q-menu')].filter(vis);
        if (!menus.length) return null;
        const items = [...menus[menus.length - 1].querySelectorAll('.q-item,[role=option]')].filter(vis);
        const el = items[i]; if (!el) return null;
        const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; }, idx);
      if (!box) { await page.waitForTimeout(600); continue; }
      const c = await clickAt(box);
      if (c.ok) return { ok: true, index: idx, via: 'click' };
    }
    return { ok: false, why: 'neither arrowing nor clicking reached the option',
             keyboardTried: kb };
  };

  await clickReal(fieldBox, 'Role'); await page.waitForTimeout(1800);
  R.rolePick = await pick(ROLE, 'Role');
  L('role pick:', JSON.stringify(R.rolePick).slice(0, 200));
  await page.waitForTimeout(1200);
  await clickReal(fieldBox, 'Location'); await page.waitForTimeout(1800);
  R.locationPick = await pick('Staging', 'Location');
  L('location pick:', JSON.stringify(R.locationPick).slice(0, 200));
  await page.waitForTimeout(1000);

  R.saveClick = await clickReal(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
    const d = document.querySelector('.q-dialog'); if (!d) return null;
    const b = [...d.querySelectorAll('button')].filter(vis)
      .find(e => /^save/i.test((e.innerText || '').replace(/\s+/g, ' ').trim()));
    if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  await page.waitForTimeout(7000);
  R.afterSave = await page.evaluate(() => ({
    dialogStillOpen: !!document.querySelector('.q-dialog'),
    errors: [...document.querySelectorAll('.q-field--error,.text-negative,.q-notification')]
      .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 5) }));

  // --- PROVE IT: reload the page and read the role off the row again, not from the closed dialog
  await page.goto('https://sv9160.qa.shopview.com/administration/staff', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(7000);
  {
    const b = await page.evaluate(() => { const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
      const btn = [...document.querySelectorAll('button,.q-btn,[role=button]')].filter(vis)
        .find(e => /^search$/i.test((e.innerText || '').replace(/\s+/g, ' ').trim()));
      if (!btn) return null; const r = btn.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
    if (b) { await clickAt(b); await page.waitForTimeout(1500); }
    const i = await page.evaluate(() => { const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
      const el = [...document.querySelectorAll('input[type=text],input:not([type])')].filter(vis)[0];
      if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
    if (i) await clickAt(i);
    await page.keyboard.type(SEARCH_TERM, { delay: 60 });
    await page.waitForTimeout(5000);
  }
  R.rowAfter = await rowFor();
  R.roleAfter = roleOnRow(R.rowAfter);
  R.ok = R.roleAfter === ROLE;
  L('after :', R.roleAfter, '|', (R.rowAfter || '(row not found)').slice(0, 90));
}
save();

// --- optionally measure what this person's search offers
if (MEASURE && R.ok) {
  const staffId = process.env.STAFF_ID;
  if (staffId) {
    const sw = await api('/api/switch-user', 'POST', { user_id: staffId });
    R.switchStatus = sw.status;
    if (sw.status === 200) {
      await page.waitForTimeout(2500);
      const fe = await api('/api/auth/me/fe-permissions');
      const fd = fe.json && (fe.json.data !== undefined ? fe.json.data : fe.json);
      const list = fd && (fd.fe_permissions || fd.fePermissions || fd.permissions);
      const perms = Array.isArray(list) ? list : (list ? Object.values(list) : []);
      R.who = { status: fe.status, templateSlug: fd && (fd.template_slug || fd.templateSlug),
                nPerms: perms.length, perms: perms.map(p => p.name || p).sort() };
      if (R.who.templateSlug) {
        await page.goto('https://sv9160.qa.shopview.com/workorders', { waitUntil: 'domcontentloaded' }).catch(() => {});
        await page.waitForTimeout(4000);
        await page.evaluate(() => { const b = document.querySelector('[data-test-id="global_search_trigger"]'); b && b.click(); });
        await page.waitForSelector('[data-test-id="search_modal_input"]', { state: 'visible', timeout: 20000 }).catch(() => {});
        await page.type('[data-test-id="search_modal_input"]', QUERY, { delay: 30 });
        await page.evaluate(() => { const t = document.querySelector('[data-test-id="search_modal_tab_all"]'); t && t.click(); });
        let last = null, st = 0, m = null;
        for (let i = 0; i < 40; i++) {
          await page.waitForTimeout(800);
          m = await page.evaluate(() => { const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
            const d = [...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if (!d) return null;
            const tabs = {}; d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e => {
              const t = (e.innerText || '').match(/\((\d+)\)/);
              tabs[e.getAttribute('data-test-id').replace('search_modal_tab_', '')] = t ? +t[1] : null; });
            return { tabs, tabsPresent: Object.keys(tabs),
              rowTypes: [...new Set([...d.querySelectorAll('[data-test-id^="search_result_row_"]')]
                .map(e => e.getAttribute('data-test-id').replace('search_result_row_', '').replace(/_\d+$/, '')))] }; });
          if (!m) continue;
          const sig = JSON.stringify(m);
          const tc = Object.entries(m.tabs).filter(([k]) => !['strip', 'all'].includes(k)).map(([, v]) => v);
          if (sig === last && tc.some(v => v !== null)) { if (++st >= 3) break; } else st = 0;
          last = sig;
        }
        R.modal = m;
        await page.screenshot({ path: `${DIR}/roles-evidence/${ROLE.replace(/\W+/g, '-')}-search.png` }).catch(() => {});
        L('as', R.who.templateSlug, '- can do', R.who.nPerms, 'things; search offers',
          JSON.stringify(m && m.tabs), '; rows', JSON.stringify(m && m.rowTypes));
      } else {
        R.notRecorded = 'the server would not say who this session is, so nothing is attributed';
        L(R.notRecorded);
      }
    }
  }
}
save();
L('RESULT:', R.ok ? `${SUBJECT} is on ${ROLE}` : `NOT SET - still ${R.roleAfter || 'unknown'}`);
await browser.close();
process.exit(R.ok ? 0 : 4);
