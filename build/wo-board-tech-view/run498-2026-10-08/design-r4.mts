/**
 * design-r4.mts — 17 Oct 2026, ROUND 4 of the run 498 fix-ups on STAGING: two focused re-runs, each queued alone (ONLY=<id>).
 *   C590115 — Tech View status pill is List's pill. The two earlier tries seeded only the BLUE number (a part request), so the RED number
 *     was never compared. What makes the red number: List's code draws it from the list answer's `serviceActionsCount` with the tooltip
 *     "<n> Line(s) in Auth Req'd" (read from staging's own WorkOrders chunk, 17 Oct 2026) — i.e. a line of the work order in the line status
 *     "Needs Approval" (authorization_required). So Work-order-1 gets a SECOND line in that status through the app's own add-line call
 *     (create-from-canned-line, status authorization_required; change-status as fallback), read back in the list answer AND on List's screen
 *     (positive control: a red number drawn) before anything is compared. Then number, colour and tooltip of BOTH numbers in List and in
 *     Tech View, and the pill's width / height at each density, as before. Note for the report: the case's preconditions name only Line-1
 *     (approved, with a part requested) — that alone gives the blue number only; the red one needs a line in Needs Approval.
 *   C590116 — Six-dot grips. Step 5's drop is now made INSIDE the same group: the point is inside Work-order-2's row (lower part, then its
 *     centre), and document.elementFromPoint there must be a row of Technician-A's group (data-group-key) before the mouse is pressed; it is
 *     read again while held. If the drop still moves the work order to another lead, the lead is put back through the app's call and the
 *     reading says so. Step 9 also reads the Unassigned header for User-B (missing on 17 Oct).
 * Everything else (set-up, helpers, readings) is design-stg5.mts's proven code, copied unchanged below the line "COPIED FROM design-stg5".
 * Output EV/design-r4-<ONLY>.json; pictures EV/C590115-r4-*.png, EV/C590116-r4-*.png. Records raw values only; decides nothing; no TestRail, no Jira.
 * ───────────────────────────── COPIED FROM design-stg5.mts (lines 29-353, 17 Oct 2026), only the output name and start tag changed ─────
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP, registerShotPage } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, workOrders, setRequireReview, type Api } from './data.mts';
import { EV, t, shot, display, tab, search, findRow, toColumn, groups, shiftPrompt, boardCols } from './wob.mts';
import { startState } from './fixup-1017.mts';
import { person, roleIds, ensureEligible, HEAVY } from './staff.mts';
import { viewAs } from './viewas.mts';

if (!process.env.WOB_SCALE && process.env.QA_DPR) process.env.WOB_SCALE = process.env.QA_DPR; // the runner's window at 2x too
const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const OUT = path.join(EV, `design-r4${only.length ? '-' + only.join('-') : ''}.json`);   // one file per focused re-run
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; p.setDefaultTimeout(15_000);
const a = api(p);
await startState(p, a, 'design-r4');   // L0415, fix-up 2
const R: Record<string, any> = { runner: RUN.id.slice(0, 8), started: new Date().toISOString() };
const PREF = '/api/users/me/preferences/work-orders-list';
const ORIGINAL = (await a.get(PREF)).body?.data?.value ?? {};
const RUNNO = String(Date.now() % 100000);
const MAIL = '@staging.shopview.local';
const ORG = (await import('./profile.mts')).ORG;
const rolesL: any[] = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data);
const RI = await roleIds(a);
const roleId = (re: RegExp) => rolesL.find((r) => re.test(r.label ?? r.name ?? ''))?.id ?? Object.entries(RI).find(([l]) => re.test(l))?.[1];
const TECH_ROLE = roleId(/^Technician$/), ADMIN_ROLE = roleId(/^admin(istrator)?$/i), VIEW_ROLE = roleId(/^ZZAUTOTEST WO View Only$/);
R.roles = { tech: !!TECH_ROLE, admin: !!ADMIN_ROLE, viewOnly: !!VIEW_ROLE };
const say = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body?.message ?? r.body?.errors ?? r.body).slice(0, 140) : ''}`;
const W = (ms: number, pg: Page = p) => pg.waitForTimeout(ms);

// ───────────────────────────── in-page measuring kit (plain JS, injected on demand; no pass/fail in it) ─────────────────────────────
const LIB = String.raw`(window.__D = window.__D || (function () {
  var R1 = function (n) { return Math.round(n * 10) / 10; };
  var TR = 'rgba(0, 0, 0, 0)';
  var vis = function (e) { if (!e || !e.getBoundingClientRect) return false; var r = e.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) return false; var s = getComputedStyle(e); return s.visibility !== 'hidden' && s.display !== 'none'; };
  var qa = function (sel, root) { return Array.prototype.filter.call((root || document).querySelectorAll(sel), vis); };
  var q = function (sel, root) { return qa(sel, root)[0] || null; };
  var box = function (e) { if (!e) return null; var r = e.getBoundingClientRect(); return { x: R1(r.left), y: R1(r.top), w: R1(r.width), h: R1(r.height), r: R1(r.right), b: R1(r.bottom) }; };
  var KEEP = ['fontSize', 'fontWeight', 'lineHeight', 'color', 'backgroundColor', 'backgroundImage', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft', 'borderRadius', 'boxShadow', 'padding', 'margin', 'opacity', 'position', 'top', 'left', 'zIndex', 'textAlign', 'textOverflow', 'overflow', 'whiteSpace', 'transform', 'cursor', 'visibility', 'textTransform', 'letterSpacing', 'gap', 'outline', 'width', 'height'];
  var DEF = { backgroundColor: TR, backgroundImage: 'none', boxShadow: 'none', opacity: '1', position: 'static', transform: 'none', visibility: 'visible', textTransform: 'none', textOverflow: 'clip', overflow: 'visible', whiteSpace: 'normal', zIndex: 'auto', top: 'auto', left: 'auto', gap: 'normal', cursor: 'auto', textAlign: 'start', letterSpacing: 'normal' };
  var st = function (e, all) { if (!e) return null; var s = getComputedStyle(e), o = {}; KEEP.forEach(function (k) { var v = s[k]; if (v === undefined || v === '') return; if (!all) { if (DEF[k] === v) return; if (/^border[TRBL]/.test(k) && /^0px/.test(v)) return; if ((k === 'padding' || k === 'margin') && v === '0px') return; if (k === 'borderRadius' && v === '0px') return; if (k === 'outline' && /none|^0px/.test(v)) return; if (k === 'width' || k === 'height' || k === 'lineHeight') return; } o[k] = v; }); return o; };
  var own = function (e) { var t = ''; for (var i = 0; i < e.childNodes.length; i++) if (e.childNodes[i].nodeType === 3) t += e.childNodes[i].textContent; return t.replace(/\s+/g, ' ').trim(); };
  var ICON = '.q-icon, i, svg, [class*="material-icons"]';
  var tid = function (e) { var h = e && e.closest && e.closest('[data-test-id]'); return h ? h.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>') : null; };
  var icon = function (e) { var c = String(e.getAttribute('class') || ''); var s = getComputedStyle(e); var o = { tag: e.tagName.toLowerCase(), cls: c.slice(0, 90), box: box(e), color: s.color, opacity: s.opacity, transform: s.transform !== 'none' ? s.transform : undefined };
    var sv = e.tagName.toLowerCase() === 'svg' ? e : e.querySelector('svg');
    if (sv) { var pth = sv.querySelector('path,circle,rect,line,polyline,polygon'); var ps = pth ? getComputedStyle(pth) : getComputedStyle(sv); o.svg = { cls: String(sv.getAttribute('class') || '').slice(0, 90), box: box(sv), viewBox: sv.getAttribute('viewBox'), fill: ps.fill, stroke: ps.stroke, strokeWidth: ps.strokeWidth, shapes: sv.querySelectorAll('path,circle,rect,line,polyline,polygon').length, dataIcon: sv.getAttribute('data-icon') || sv.getAttribute('data-lucide') || null }; }
    else { o.ligature = (e.textContent || '').trim().slice(0, 30); o.fontSize = s.fontSize; }
    return o; };
  var icons = function (root) { if (!root) return []; var l = [root].concat(Array.prototype.slice.call(root.querySelectorAll(ICON))).filter(function (e) { if (!vis(e) || !e.matches(ICON)) return false; var up = e.parentElement && e.parentElement.closest(ICON); return !(up && (root === up || root.contains(up))); }); return l.slice(0, 12).map(icon); };
  var desc = function (e, all) { if (!e) return null; return { tid: tid(e), tag: e.tagName.toLowerCase(), cls: String(e.getAttribute('class') || '').slice(0, 80), text: (e.innerText || e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100), box: box(e), st: st(e, all), icons: icons(e).slice(0, 4) }; };
  var chain = function (e, n) { var o = []; for (var i = 0; e && i < n; i++, e = e.parentElement) o.push({ tag: e.tagName.toLowerCase(), cls: String(e.getAttribute('class') || '').slice(0, 60), tid: e.getAttribute('data-test-id'), box: box(e), st: st(e) }); return o; };
  var parts = function (root, max) { if (!root) return []; var out = [];
    Array.prototype.forEach.call(root.querySelectorAll('*'), function (e) { if (!vis(e)) return; var b = box(e);
      if (e.matches(ICON)) { var up = e.parentElement && e.parentElement.closest(ICON); if (up && root.contains(up)) return; out.push({ kind: 'icon', icon: icon(e), cy: b.y + b.h / 2, x: b.x }); return; }
      if (e.closest(ICON)) return; var t = own(e); var s = getComputedStyle(e);
      if (t) out.push({ kind: 'text', text: t.slice(0, 80), box: b, fontSize: s.fontSize, fontWeight: s.fontWeight, color: s.color, bg: s.backgroundColor !== TR ? s.backgroundColor : undefined, cy: b.y + b.h / 2, x: b.x });
      else if (e.tagName === 'IMG') out.push({ kind: 'img', box: b, natural: e.naturalWidth, radius: s.borderRadius, cy: b.y + b.h / 2, x: b.x });
      else if ((s.backgroundColor !== TR || /solid|dashed/.test(s.borderLeftStyle + s.borderTopStyle)) && b.w <= 64 && b.h <= 64) out.push({ kind: 'shape', box: b, bg: s.backgroundColor, border: s.borderLeft, radius: s.borderRadius, cy: b.y + b.h / 2, x: b.x }); });
    out.sort(function (a, c) { return Math.abs(a.cy - c.cy) > 10 ? a.cy - c.cy : a.x - c.x; }); return out.slice(0, max || 40).map(function (x) { delete x.cy; delete x.x; return x; }); };
  var avs = function (root) { if (!root) return []; return qa('.q-avatar, img, [class*="avatar"]', root).filter(function (e, i, all) { return !all.some(function (o) { return o !== e && o.contains(e); }); }).map(function (e) {
      var s = getComputedStyle(e); var inner = e.querySelector('.q-avatar__content') || e; var si = getComputedStyle(inner); var img = e.tagName === 'IMG' ? e : e.querySelector('img');
      return { box: box(e), bg: s.backgroundColor !== TR ? s.backgroundColor : si.backgroundColor, color: si.color, text: (e.innerText || '').trim().slice(0, 6), fontSize: si.fontSize, fontWeight: si.fontWeight, radius: s.borderRadius, border: s.borderLeft, img: img ? { natural: img.naturalWidth, complete: img.complete } : null, icons: icons(e).slice(0, 1), tid: tid(e) }; }).sort(function (a, b) { return a.box.x - b.box.x; }); };
  var bars = function (root) { if (!root) return []; return qa('*', root).filter(function (e) { var b = e.getBoundingClientRect(); return b.height >= 2 && b.height <= 12 && b.width >= 16; }).map(function (e) { var s = getComputedStyle(e); return { box: box(e), bg: s.backgroundColor, radius: s.borderRadius, transform: s.transform !== 'none' ? s.transform : undefined, cls: String(e.getAttribute('class') || '').slice(0, 60) }; }).slice(0, 6); };
  var bgEls = function (root) { if (!root) return []; return [root].concat(qa('*', root)).filter(function (e) { var s = getComputedStyle(e); return s.backgroundColor !== TR || /dashed|dotted/.test(s.borderTopStyle); }).map(function (e) { var s = getComputedStyle(e); return { tag: e.tagName.toLowerCase(), tid: e.getAttribute('data-test-id'), box: box(e), bg: s.backgroundColor, border: s.borderTop, radius: s.borderRadius }; }).slice(0, 12); };
  var clipCache = new Map();
  var clipOf = function (e) { if (clipCache.has(e)) return clipCache.get(e); var c = { x: -1e9, y: -1e9, r: 1e9, b: 1e9 }; for (var a = e; a && a !== document.documentElement; a = a.parentElement) { var s = getComputedStyle(a); if (s.overflowX !== 'visible' || s.overflowY !== 'visible') { var bb = a.getBoundingClientRect(); if (s.overflowX !== 'visible') { c.x = Math.max(c.x, bb.left); c.r = Math.min(c.r, bb.right); } if (s.overflowY !== 'visible') { c.y = Math.max(c.y, bb.top); c.b = Math.min(c.b, bb.bottom); } } } c.x = Math.max(c.x, 0); c.r = Math.min(c.r, innerWidth); clipCache.set(e, c); return c; };
  var trects = function (root) { clipCache = new Map(); var out = []; if (!root) return out; var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) { var n = w.currentNode; var t = n.textContent.replace(/\s+/g, ' ').trim(); if (!t) continue; var pe = n.parentElement; if (!pe || !vis(pe) || pe.closest(ICON)) continue;
      var rg = document.createRange(); rg.selectNodeContents(n); var rs = rg.getClientRects(); var x = 1e9, y = 1e9, r = -1e9, b = -1e9;
      for (var i = 0; i < rs.length; i++) { if (rs[i].width === 0) continue; x = Math.min(x, rs[i].left); y = Math.min(y, rs[i].top); r = Math.max(r, rs[i].right); b = Math.max(b, rs[i].bottom); }
      if (r < x) continue; var c = clipOf(pe); var cut = x < c.x || r > c.r || y < c.y || b > c.b; x = Math.max(x, c.x); r = Math.min(r, c.r); y = Math.max(y, c.y); b = Math.min(b, c.b); if (r - x < 1 || b - y < 1) continue;
      out.push({ t: t.slice(0, 50), x: R1(x), y: R1(y), r: R1(r), b: R1(b), cut: cut || undefined }); }
    return out; };
  var over = function (list, tol) { tol = tol === undefined ? 2 : tol; var pairs = [], minGap = null; for (var i = 0; i < list.length; i++) for (var j = i + 1; j < list.length; j++) { var A = list[i], B = list[j]; var vo = Math.min(A.b, B.b) - Math.max(A.y, B.y); if (vo <= 0.3 * Math.min(A.b - A.y, B.b - B.y)) continue; var gap = R1(Math.max(A.x, B.x) - Math.min(A.r, B.r)); if (minGap === null || gap < minGap) minGap = gap; if (gap < tol) pairs.push({ a: A.t, b: B.t, gap: gap }); } return { texts: list.length, minGap: minGap, touchingOrOverlapping: pairs.slice(0, 30), cut: list.filter(function (x) { return x.cut; }).map(function (x) { return x.t; }).slice(0, 20) }; };
  var overOf = function (root) { return over(trects(root)); };
  var ctrls = function (root) { if (!root) return null; var l = qa('button, .q-btn, .q-chip, .q-field, input, [role="button"], .q-tab', root).filter(function (e, i, all) { return !all.some(function (o) { return o !== e && o.contains(e); }); });
    var nm = function (e) { return (e.getAttribute('aria-label') || e.innerText || e.getAttribute('data-test-id') || '').replace(/\s+/g, ' ').trim().slice(0, 30); };
    var pairs = []; for (var i = 0; i < l.length; i++) for (var j = i + 1; j < l.length; j++) { var A = l[i].getBoundingClientRect(), B = l[j].getBoundingClientRect(); var ix = Math.min(A.right, B.right) - Math.max(A.left, B.left), iy = Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top); if (ix > 0.5 && iy > 0.5) pairs.push({ a: nm(l[i]), b: nm(l[j]), ix: R1(ix), iy: R1(iy) }); }
    var rows = []; l.forEach(function (e) { var b = e.getBoundingClientRect(); var cy = Math.round(b.top + b.height / 2); if (!rows.some(function (r) { return Math.abs(r - cy) < 10; })) rows.push(cy); });
    return { controls: l.length, overlaps: pairs.slice(0, 20), rowsAtY: rows.sort(function (a, b) { return a - b; }), outsideWindow: l.filter(function (e) { var b = e.getBoundingClientRect(); return b.right > innerWidth + 0.5 || b.left < -0.5; }).map(nm), list: l.map(function (e) { return { n: nm(e), box: box(e) }; }).slice(0, 40) }; };
  var tips = function () { return qa('.q-tooltip, [role="tooltip"]').map(function (e) { return { text: e.innerText.replace(/\s+/g, ' ').trim().slice(0, 160), box: box(e), st: st(e) }; }); };
  var menu = function () { var m = qa('.q-menu').pop(); if (!m) return null; return { box: box(m), st: st(m), items: qa('.q-item, [role="menuitem"], [role="option"]', m).map(function (it) { var s = getComputedStyle(it); var ck = it.querySelector('[aria-checked]');
      return { text: it.innerText.replace(/\s+/g, ' ').trim().slice(0, 80), tid: it.getAttribute('data-test-id'), disabled: it.getAttribute('aria-disabled') === 'true' || /disabled/.test(String(it.className)), selected: it.getAttribute('aria-selected') || it.getAttribute('aria-checked') || (ck && ck.getAttribute('aria-checked')) || (/active|selected/.test(String(it.className)) ? 'class' : null), opacity: s.opacity, color: s.color, bg: s.backgroundColor !== TR ? s.backgroundColor : undefined, icons: icons(it).slice(0, 3), box: box(it) }; }).slice(0, 60) }; };
  var track = function () { var f = q('[aria-label="List"]') || q('[aria-label="Tech View"]'); if (!f) return null; var t = f.closest('button, .q-btn') || f; for (var i = 0; t && i < 5 && !(t.querySelector('[aria-label="Board View"]') && t.querySelector('[aria-label="List"]')); i++) t = t.parentElement; return t; };
  var switcher = function () { return { buttons: ['List', 'Tech View', 'Board View'].map(function (l) { var e = q('[aria-label="' + l + '"]'); var b = e && (e.closest('button, .q-btn') || e); return b ? { label: l, pressed: b.getAttribute('aria-pressed'), btn: desc(b, true), icons: icons(b) } : { label: l, present: false }; }), track: desc(track(), true) }; };
  var toolbar = function () { var sw = q('[aria-label="Tech View"]') || q('[aria-label="List"]') || q('[data-test-id^="filter_chip_"]'); if (!sw) return null; var e = sw; while (e.parentElement && e.parentElement !== document.body) { var pr = e.parentElement; if (pr.querySelector('thead, [data-test-id="board_view_scroller"], .board-view__scroller, .q-virtual-scroll__content, tbody')) break; e = pr; } return e; };
  var tbButtons = function () { return qa('button, .q-btn', toolbar()).map(function (b) { return { label: (b.getAttribute('aria-label') || b.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40), tid: b.getAttribute('data-test-id'), box: box(b), icons: icons(b) }; }).slice(0, 40); };
  var headRow = function () { return q('thead tr'); };
  var heads = function (root) { var tr = root ? root.querySelector('thead tr') : headRow(); if (!tr) return null; var ths = Array.prototype.filter.call(tr.children, function (c) { return c.tagName === 'TH'; });
    return { row: box(tr), rowSt: st(tr), cells: ths.map(function (th) { var best = null, bl = 0; var w = document.createTreeWalker(th, NodeFilter.SHOW_TEXT); while (w.nextNode()) { var n = w.currentNode; var tt = n.textContent.trim(); if (!tt || n.parentElement.closest(ICON)) continue; if (tt.length > bl) { bl = tt.length; best = n.parentElement; } }
      var s = best ? getComputedStyle(best) : null; return { label: best ? (own(best) || best.textContent.trim()) : '', box: box(th), labelBox: best ? box(best) : null, fontSize: s && s.fontSize, fontWeight: s && s.fontWeight, color: s && s.color, textTransform: s && s.textTransform, letterSpacing: s && s.letterSpacing, thSt: st(th) }; }) }; };
  var rowEl = function (key) { if (/^[0-9a-f-]{36}$/.test(key)) return q('[data-test-id="tech_view_row_' + key + '"]'); return qa('tbody tr').filter(function (tr) { return tr.innerText.indexOf(key) >= 0; })[0] || null; };
  var cellOf = function (tr, label) { if (!tr) return null; var tb = tr.closest('table'); var h = heads(tb && tb.querySelector('thead') ? tb : null); if (!h) return null; var idx = -1; h.cells.forEach(function (c, i) { if (idx < 0 && c.label.toLowerCase() === String(label).toLowerCase()) idx = i; }); if (idx < 0) return null; var tds = Array.prototype.filter.call(tr.children, function (c) { return c.tagName === 'TD'; }); return tds[idx] || null; };
  var cell = function (key, label) { return cellOf(rowEl(key), label); };
  var row = function (key) { var tr = rowEl(key); if (!tr) return null; var tb = tr.closest('table'); var h = heads(tb && tb.querySelector('thead') ? tb : null); var tds = Array.prototype.filter.call(tr.children, function (c) { return c.tagName === 'TD'; }); var cells = {};
    tds.forEach(function (td, i) { var lab = h && h.cells[i] ? (h.cells[i].label || ('#' + i)) : '#' + i; var s = getComputedStyle(td); var pp = parts(td, 6).filter(function (x) { return x.kind === 'text'; })[0]; cells[lab] = { text: td.innerText.replace(/\s+/g, ' ').trim().slice(0, 80), box: box(td), textAlign: s.textAlign, padding: s.padding, firstText: pp ? { fontSize: pp.fontSize, fontWeight: pp.fontWeight, color: pp.color, box: pp.box } : null }; });
    return { box: box(tr), st: st(tr), ths: h ? h.cells.length : null, tds: tds.length, cells: cells }; };
  var pill = function (root) { if (!root) return null; var c = [root].concat(qa('*', root)).filter(function (e) { var s = getComputedStyle(e); return s.backgroundColor !== TR && s.borderRadius !== '0px' && /[A-Za-z]/.test(e.textContent || ''); });
    c.sort(function (x, y) { var A = x.getBoundingClientRect(), B = y.getBoundingClientRect(); return B.width * B.height - A.width * A.height; });
    var nums = qa('*', root).filter(function (e) { return /^\d+$/.test(own(e)); }).map(function (e) { var bgE = e; while (bgE && bgE !== root && getComputedStyle(bgE).backgroundColor === TR) bgE = bgE.parentElement; return { text: own(e), box: box(e), color: getComputedStyle(e).color, fontSize: getComputedStyle(e).fontSize, bg: bgE ? getComputedStyle(bgE).backgroundColor : null, bgBox: bgE ? box(bgE) : null, tid: tid(e) }; });
    return { pill: desc(c[0] || null, true), numbers: nums }; };
  var pills = function () { return qa('[data-test-id^="tech_view_row_"], tbody tr').slice(0, 15).map(function (tr) { var td = cellOf(tr, 'Status'); var pl = td && pill(td); return pl && pl.pill ? pl.pill.box.h : null; }); };
  var grp = function (id) { return q('[data-test-id="tech_view_group_' + id + '"]'); };
  var groupHdr = function (id) { var tr = grp(id); if (!tr) return null; var g = q('[data-test-id^="tech_view_group_drag_handle_"]', tr) || tr.querySelector('[data-test-id^="tech_view_group_drag_handle_"]'); var tg = tr.querySelector('[data-test-id^="button_tech_view_group_toggle_"]'); var nm = tr.querySelector('[data-test-id^="tech_view_group_name_"]'); var ct = tr.querySelector('[data-test-id^="tech_view_group_count_"]');
    return { box: box(tr), st: st(tr), tdSt: tr.firstElementChild ? st(tr.firstElementChild) : null, collapsed: tr.getAttribute('data-collapsed'), parts: parts(tr, 20), avatars: avs(tr), grip: g ? desc(g, true) : null, toggle: tg ? { box: box(tg), icons: icons(tg), st: st(tg) } : null, name: nm ? desc(nm) : null, count: ct ? desc(ct) : null }; };
  var rowGrip = function (key) { var tr = rowEl(key); if (!tr) return null; var g = tr.querySelector('[data-test-id*="drag_handle"], [data-test-id*="grip"], [class*="drag-handle"], [class*="grip"]'); var td = tr.querySelector('td'); return { rowBox: box(tr), rowBg: getComputedStyle(tr).backgroundColor, firstTdBg: td ? getComputedStyle(td).backgroundColor : null, grip: g ? desc(g, true) : null, gripLeftOfRow: g ? R1(g.getBoundingClientRect().left - tr.getBoundingClientRect().left) : null, firstCell: td ? { box: box(td), parts: parts(td, 4) } : null }; };
  var colEl = function (id) { return q('[data-test-id="board_column_' + id + '"]'); };
  var colHdr = function (id) { var h = q('[data-test-id="board_column_header_' + id + '"]'); if (!h) return null; var pin = q('[data-test-id="button_board_pin_' + id + '"], [data-test-id="button_board_column_pin_' + id + '"]'); var nm = q('[data-test-id="board_column_name_' + id + '"]'); var ct = q('[data-test-id="board_column_count_' + id + '"]');
    return { box: box(h), st: st(h), parts: parts(h, 20), avatars: avs(h), grip: desc(h.querySelector('[data-test-id*="drag"], [class*="grip"], [class*="drag"]')), pin: pin ? { pressed: pin.getAttribute('aria-pressed'), disabled: pin.disabled || pin.getAttribute('aria-disabled') === 'true', label: pin.getAttribute('aria-label'), d: desc(pin, true) } : null,
      name: nm ? { text: nm.textContent.trim(), box: box(nm), scrollW: nm.scrollWidth, clientW: nm.clientWidth, textOverflow: getComputedStyle(nm).textOverflow, overflow: getComputedStyle(nm).overflow, whiteSpace: getComputedStyle(nm).whiteSpace, fontSize: getComputedStyle(nm).fontSize, fontWeight: getComputedStyle(nm).fontWeight, color: getComputedStyle(nm).color } : null, count: ct ? desc(ct) : null, textOverlaps: overOf(h) }; };
  var cols = function () { return qa('[data-test-id^="board_column_"]').filter(function (e) { return /^board_column_([0-9a-f-]{36}|unassigned)$/.test(e.getAttribute('data-test-id')); }); };
  var board = function () { var s = q('[data-test-id="board_view_scroller"], .board-view__scroller'); var cs = cols(); var gaps = []; for (var i = 1; i < cs.length; i++) gaps.push(R1(cs[i].getBoundingClientRect().left - cs[i - 1].getBoundingClientRect().right));
    return { vw: innerWidth, scroller: s ? { chain: chain(s, 4), scrollLeft: s.scrollLeft, scrollWidth: s.scrollWidth, clientWidth: s.clientWidth } : null, columns: cs.slice(0, 6).map(function (c) { return { tid: tid(c), box: box(c), st: st(c, true) }; }), gaps: gaps.slice(0, 8) }; };
  var card = function (id) { var c = q('[data-test-id="board_card_' + id + '"]'); if (!c) return null; return { d: desc(c, true), parts: parts(c, 40), avatars: avs(c), bars: bars(c), fields: qa('[data-test-id^="board_card_"]', c).map(function (e) { var s = getComputedStyle(e); return { tid: tid(e), text: e.innerText.replace(/\s+/g, ' ').trim().slice(0, 60), box: box(e), fontSize: s.fontSize, fontWeight: s.fontWeight, color: s.color }; }).slice(0, 20), col: tid(c.closest('[data-test-id^="board_column_"]')) }; };
  var whereCard = function (id) { var c = document.querySelector('[data-test-id="board_card_' + id + '"]'); if (!c) return null; var col = c.parentElement && c.parentElement.closest('[data-test-id^="board_column_"]'); return col ? col.getAttribute('data-test-id') : 'no column'; };
  var more = function (host) { if (!host) return null; var b = host.querySelector('[data-test-id="button_work_order_more_actions"]'); var stt = host.querySelector('[data-test-id="board_card_status"]'); return { host: desc(host, true), button: b ? desc(b, true) : 'not in the page', status: stt ? box(stt) : null }; };
  var thinList = function () { var out = []; Array.prototype.forEach.call(document.querySelectorAll('body *'), function (e) { var r = e.getBoundingClientRect(); if (!((r.height > 0 && r.height <= 5 && r.width >= 24) || (r.width > 0 && r.width <= 5 && r.height >= 24))) return; var s = getComputedStyle(e); if (s.visibility === 'hidden' || s.display === 'none') return; if (s.backgroundColor === TR && !/solid|dashed/.test(s.borderTopStyle + s.borderLeftStyle)) return; out.push(e); }); return out; };
  var snap = function () { window.__thin0 = new Set(thinList()); var tx = []; var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); while (w.nextNode()) if (w.currentNode.textContent.trim()) tx.push(w.currentNode); window.__txt0 = new Set(tx); return window.__thin0.size; };
  var fresh = function () { var b0 = window.__thin0 || new Set(), t0 = window.__txt0 || new Set();
    var thin = thinList().filter(function (e) { return !b0.has(e); }).map(function (e) { var s = getComputedStyle(e); return { box: box(e), bg: s.backgroundColor, border: s.borderTop, radius: s.borderRadius, z: s.zIndex, cls: String(e.getAttribute('class') || '').slice(0, 60), tid: tid(e) }; }).slice(0, 10);
    var tx = []; var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); while (w.nextNode()) { var n = w.currentNode; if (!n.textContent.trim() || t0.has(n) || !vis(n.parentElement)) continue; var host = n.parentElement; for (var i = 0; i < 4 && host.parentElement && getComputedStyle(host).backgroundColor === TR; i++) host = host.parentElement; tx.push({ text: n.textContent.trim().slice(0, 100), box: box(n.parentElement), host: desc(host, true) }); }
    var gh = qa('[class*="ghost"], [class*="chosen"], [class*="sortable-drag"], [class*="dragging"], [class*="is-drag"], [class*="drop"]').map(function (e) { return { cls: String(e.getAttribute('class') || '').slice(0, 80), tid: tid(e), box: box(e), opacity: getComputedStyle(e).opacity }; }).slice(0, 10);
    return { thinNew: thin, textNew: tx.slice(0, 10), dragClasses: gh }; };
  var empty = function (re) { var rx = new RegExp(re); var hit = null; var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); while (w.nextNode()) { var n = w.currentNode; if (rx.test(n.textContent) && vis(n.parentElement)) { hit = n.parentElement; break; } } if (!hit) return null;
    var c = hit; for (var i = 0; i < 6 && c.parentElement; i++) { if (c.getBoundingClientRect().height >= 120 || c.querySelector('button, .q-btn')) break; c = c.parentElement; }
    var main = q('main, .q-page') || document.body; var mb = box(main), cb = box(c), hb = box(hit);
    return { title: desc(hit), container: desc(c, true), parts: parts(c, 20), bgEls: bgEls(c), buttons: qa('button, .q-btn', c).map(function (b) { return (b.innerText || '').replace(/\s+/g, ' ').trim(); }), centre: { pageMid: R1(mb.x + mb.w / 2), titleMid: R1(hb.x + hb.w / 2), containerMid: R1(cb.x + cb.w / 2), pageTop: mb.y, containerTop: cb.y, vw: innerWidth, vh: innerHeight } }; };
  var notes = function () { return qa('.q-notification').map(function (e) { var b = e.getBoundingClientRect(); return { d: desc(e, true), parts: parts(e, 12), fromRight: R1(innerWidth - b.right), fromBottom: R1(innerHeight - b.bottom) }; }); };
  var dialog = function () { var d = qa('.q-dialog .q-card, [role="dialog"] .q-card').pop() || qa('.q-dialog__inner > div').pop(); if (!d) return null; var bd = q('.q-dialog__backdrop'); var inp = q('input', d);
    return { card: desc(d, true), backdrop: bd ? st(bd, true) : null, vw: innerWidth, vh: innerHeight, parts: parts(d, 30), input: inp ? { placeholder: inp.getAttribute('placeholder'), value: inp.value, box: box(inp), field: desc(inp.closest('.q-field')) } : null,
      rows: qa('[data-test-id^="option_lead_technician_"]', d).map(function (r) { var s = getComputedStyle(r); return { tid: tid(r), text: r.innerText.replace(/\s+/g, ' ').trim().slice(0, 80), bg: s.backgroundColor, box: box(r), avatars: avs(r), icons: icons(r).slice(0, 3), parts: parts(r, 8) }; }).slice(0, 30),
      buttons: qa('button, .q-btn', d).map(function (b) { return { text: (b.innerText || b.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 30), tid: b.getAttribute('data-test-id'), box: box(b) }; }) }; };
  var chips = function () { return qa('[data-test-id^="filter_chip_"]').filter(function (e, i, all) { return !all.some(function (o) { return o !== e && o.contains(e); }); }).map(function (e) { var s = getComputedStyle(e); return { tid: e.getAttribute('data-test-id'), text: e.innerText.replace(/\s+/g, ' ').trim().slice(0, 40), box: box(e), fontSize: s.fontSize, fontWeight: s.fontWeight, color: s.color, bg: s.backgroundColor, border: s.borderTop, radius: s.borderRadius, icons: icons(e).slice(0, 2) }; }).sort(function (a, b) { return Math.abs(a.box.y - b.box.y) > 10 ? a.box.y - b.box.y : a.box.x - b.box.x; }); };
  var findText = function (re) { var rx = new RegExp(re, 'i'); return qa('body *').filter(function (e) { return rx.test(own(e)) || rx.test(e.getAttribute('aria-label') || ''); }).map(function (e) { return { text: (own(e) || e.getAttribute('aria-label')).slice(0, 60), tid: tid(e), box: box(e) }; }).slice(0, 12); };
  var tScroller = function () { var s = q('.q-table__middle'); if (!s) return null; return { box: box(s), scrollTop: s.scrollTop, scrollLeft: s.scrollLeft, scrollH: s.scrollHeight, clientH: s.clientHeight, scrollW: s.scrollWidth, clientW: s.clientWidth }; };
  var frame = function () { var t = q('.q-table__container') || (headRow() && headRow().closest('.q-table__container, .q-table, table')); return { vw: innerWidth, table: t ? chain(t, 4) : null, scroller: tScroller() }; };
  var align = function () { var h = heads(); var tr = qa('[data-test-id^="tech_view_row_"], tbody tr')[0]; if (!h || !tr) return null; var tds = Array.prototype.filter.call(tr.children, function (c) { return c.tagName === 'TD'; }); return h.cells.map(function (c, i) { var b = tds[i] && box(tds[i]); return { label: c.label, thX: c.box.x, tdX: b ? b.x : null, dx: b ? R1(b.x - c.box.x) : null, dw: b ? R1(b.w - c.box.w) : null }; }); };
  var groupBorders = function () { return qa('[data-test-id^="tech_view_group_"]').filter(function (e) { return /^tech_view_group_([0-9a-f-]{36}|unassigned)$/.test(e.getAttribute('data-test-id')); }).slice(0, 5).map(function (tr) { var td = tr.querySelector('td'); return { tid: tid(tr), trBorderTop: getComputedStyle(tr).borderTop, tdBorderTop: td ? getComputedStyle(td).borderTop : null, tdBorderBottom: td ? getComputedStyle(td).borderBottom : null, box: box(tr) }; }); };
  var onTop = function (sel) { var e = q(sel); if (!e) return null; var b = e.getBoundingClientRect(); var x = b.left + Math.min(b.width / 2, 20), y = b.top + b.height / 2; var top = document.elementFromPoint(x, y); return { box: box(e), atPoint: top ? (top === e || e.contains(top)) : null, topTid: top ? tid(top) : null }; };
  return { q: q, qa: qa, box: box, st: st, desc: desc, chain: chain, parts: parts, avs: avs, bars: bars, bgEls: bgEls, trects: trects, over: over, overOf: overOf, ctrls: ctrls, tips: tips, menu: menu, track: track, switcher: switcher, toolbar: toolbar, tbButtons: tbButtons, headRow: headRow, heads: heads, rowEl: rowEl, cell: cell, row: row, pill: pill, pills: pills, grp: grp, groupHdr: groupHdr, rowGrip: rowGrip, colEl: colEl, colHdr: colHdr, cols: cols, board: board, card: card, whereCard: whereCard, more: more, snap: snap, fresh: fresh, empty: empty, notes: notes, dialog: dialog, chips: chips, findText: findText, tScroller: tScroller, frame: frame, align: align, groupBorders: groupBorders, onTop: onTop, icons: icons };
})(), 1)`;
const J = JSON.stringify;
/** run an expression against the in-page kit (injected first if this page does not have it yet) */
const D = async (pg: Page, expr: string): Promise<any> => { await pg.evaluate(LIB).catch(() => {}); return pg.evaluate(expr).catch((e: any) => ({ evalError: String(e?.message || e).slice(0, 200) })); };
type Box = { x: number; y: number; w: number; h: number; r: number; b: number } | null;
const hits = (A: Box, B: Box) => !!(A && B && Math.min(A.r, B.r) - Math.max(A.x, B.x) > 0 && Math.min(A.b, B.b) - Math.max(A.y, B.y) > 0);
const rel = (tip: Box, trg: Box) => tip && trg ? { tipAboveTrigger: tip.b <= trg.y + 0.5, tipBelowTrigger: tip.y >= trg.b - 0.5, gap: tip.b <= trg.y + 0.5 ? Math.round((trg.y - tip.b) * 10) / 10 : Math.round((tip.y - trg.b) * 10) / 10, centreDx: Math.round(((tip.x + tip.w / 2) - (trg.x + trg.w / 2)) * 10) / 10 } : null;
/** picture of one area (element box from the kit), padded */
async function clip(pg: Page, name: string, b: Box, pad = 16) {
  if (!b || b.w <= 0 || b.h <= 0) return 'no box';
  const vs = pg.viewportSize() ?? { width: 1440, height: 900 };
  const x = Math.max(0, b.x - pad), y = Math.max(0, b.y - pad), w = Math.min(vs.width - x, b.w + 2 * pad), h = Math.min(vs.height - y, b.h + 2 * pad);
  if (w <= 0 || h <= 0) return 'off screen';
  await pg.screenshot({ path: path.join(EV, `${name}.png`), clip: { x, y, width: w, height: h } }).catch(() => {}); return `${name}.png`;
}
const pic = async (pg: Page, name: string) => { await shot(pg, name); return `${name}.png`; };
const away = async (pg: Page = p) => { await pg.mouse.move(1, 1); await W(700, pg); };
/** move the real mouse to the middle of a box (or of the element a selector names) and wait for hover effects / tooltips */
async function hoverBox(pg: Page, b: Box, wait = 1300) { if (!b) return false; await pg.mouse.move(b.x + b.w / 2, b.y + b.h / 2, { steps: 6 }); await W(wait, pg); return true; }
async function hoverSel(pg: Page, sel: string, wait = 1300) { const l = pg.locator(sel).first(); if (!(await l.count())) return null; await l.scrollIntoViewIfNeeded().catch(() => {}); const b = await l.boundingBox(); if (!b) return null; await pg.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 6 }); await W(wait, pg); return b; }
/** hover and read the tooltip against its trigger (and, when given, against a second box such as the column header row) */
async function tipFor(pg: Page, sel: string, name: string, against?: string) {
  await away(pg); const b = await hoverSel(pg, sel); if (!b) return { trigger: 'not found: ' + sel };
  const trg = await D(pg, `__D.box(__D.q(${J(sel)}))`); const tp = await D(pg, '__D.tips()'); const ag = against ? await D(pg, against) : null;
  const tip = (tp?.[0]?.box ?? null) as Box; const o: any = { trigger: trg, tooltips: tp, place: rel(tip, trg) };
  if (against) { o.against = ag; o.coversAgainst = hits(tip, ag); }
  o.picture = await pic(pg, name); return o;
}

// ───────────────────────────── preferences, page, density ─────────────────────────────
/** the runner's (or another user's) Work Orders choices back to the case's defaults: no filters, density Regular, default columns /
 *  fields / technician order / collapsed groups, the case's technicians pinned */
async function prefs(over: Record<string, any>, A: Api = a) {
  const pv = (await A.get(PREF)).body?.data?.value ?? {}; const v: any = {};
  for (const [k, x] of Object.entries(pv)) if (!/^(techViewColumns|boardFields|technicianOrder)$|collaps/i.test(k)) v[k] = x;
  Object.assign(v, { filters: {}, density: 'regular' }, over); return (await A.put(PREF, { value: v })).status;
}
async function prep(pins: string[], disp: string, width = 1440, pg: Page = p, A: Api = a) {
  await pg.setViewportSize({ width, height: 900 });
  const o: any = { pref: await prefs({ pinnedTechnicianIds: pins.slice(0, 3) }, A) };
  await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(4500, pg);
  await tab(pg, 'All').catch(() => {});
  const am = pg.locator('[data-test-id="filter_chip_assigned_to_me"]').first();
  if (await am.count()) { o.assignedToMeOn = await am.evaluate((e) => e.getAttribute('aria-pressed') === 'true' || /selected|active|bg-primary/.test(String(e.className))).catch(() => null); if (o.assignedToMeOn) { await am.click().catch(() => {}); await W(1500, pg); } }
  await display(pg, disp); await away(pg); return o;
}
async function density(pg: Page, d: 'compact' | 'regular' | 'comfortable') {
  await pg.locator('[data-test-id="button_density"]').first().click(); await W(800, pg);
  const m = await D(pg, '__D.menu()'); await pg.locator(`[data-test-id="option_density_${d}"]`).first().click(); await W(1800, pg);
  await pg.keyboard.press('Escape').catch(() => {}); await away(pg); return m?.items?.map((x: any) => `${x.text}${x.selected ? ' [' + x.selected + ']' : ''}`);
}
/** Board View "Fields to display": Line technicians on (the toggle is found by test id, else by its words) */
async function lineTechsOn(pg: Page = p) {
  await pg.locator('[data-test-id="button_board_fields_selection"]').first().click(); await W(900, pg);
  const before = await D(pg, `__D.qa('[data-test-id^="toggle_board_field_"]').map(function (e) { var c = e.getAttribute('aria-checked') || ((e.querySelector('[aria-checked]') || {}).getAttribute ? e.querySelector('[aria-checked]').getAttribute('aria-checked') : null); return (e.getAttribute('data-test-id') || '').replace('toggle_board_field_', '') + '=' + c + ' "' + e.innerText.replace(/\\s+/g, ' ').trim() + '"'; })`);
  let tg = pg.locator('[data-test-id="toggle_board_field_line_technicians"]').first();
  if (!(await tg.count())) tg = pg.locator('[data-test-id^="toggle_board_field_"]').filter({ hasText: /Line tech/i }).first();
  let clicked = false;
  if (await tg.count()) { const on = await tg.evaluate((e) => (e.getAttribute('aria-checked') ?? e.querySelector('[aria-checked]')?.getAttribute('aria-checked')) === 'true').catch(() => false); if (!on) { await tg.click(); clicked = true; await W(1200, pg); } }
  await pg.keyboard.press('Escape').catch(() => {}); await away(pg); return { before, clicked };
}
/** a board card on screen without Search: scroll to its column, then down the column; Search by the customer only as a last resort */
async function findCard(pg: Page, wo: string, col: string, q: string) {
  await toColumn(pg, col).catch(() => {});
  for (let i = 0; i < 80 && !(await pg.locator(`[data-test-id="board_card_${wo}"]`).count()); i++) {
    const moved = await pg.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_column_${col}"]'); if (!c) return false; const s = [c, ...c.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(e).overflowY)); if (!s) return false; const b = s.scrollTop; s.scrollTop += 600; return s.scrollTop !== b; })()`);
    await W(350, pg); if (!moved) break; }
  let usedSearch = false;
  if (!(await pg.locator(`[data-test-id="board_card_${wo}"]`).count())) { await search(pg, q); usedSearch = true; await toColumn(pg, col).catch(() => {}); }
  await pg.evaluate(`document.querySelector('[data-test-id="board_card_${wo}"]')?.scrollIntoView({ block: 'center', inline: 'nearest' })`).catch(() => {}); await W(700, pg);
  return { found: (await pg.locator(`[data-test-id="board_card_${wo}"]`).count()) > 0, usedSearch };
}
/** a Tech View row on screen (findRow scrolls the table); Search by the customer only if it cannot be reached */
/** 15 Oct 2026 (sixth pass, wave-design redo): Unassigned OPENS EXPANDED (PRD S2-R18) and on staging holds ~3,450 work orders, so the
 *  pinned technicians' groups sit below thousands of rows: rows were "found" but read far below the window (C590114 y=1731), or not drawn
 *  at all (C590122/C590123/C590128/C590129). collapseUn() closes Unassigned (only when the row/group needed is NOT in Unassigned; the
 *  reading says so); centre() scrolls every scrollable box around an element until it is in the middle of the window. */
async function collapseUn(pg: Page) { if (await pg.locator('[data-test-id="tech_view_group_unassigned"][data-collapsed="false"]').count()) { await pg.locator('[data-test-id="button_tech_view_group_toggle_unassigned"]').click().catch(() => {}); await W(1800, pg); return 'Unassigned collapsed by the script'; } return 'Unassigned already collapsed'; }
async function centre(pg: Page, sel: string) { await pg.evaluate(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return; e.scrollIntoView({ block: 'center' });
    for (let a = e.parentElement; a && a !== document.documentElement; a = a.parentElement) { const s = getComputedStyle(a); if (a.scrollHeight > a.clientHeight + 4 && /auto|scroll/.test(s.overflowY)) { const ar = a.getBoundingClientRect(), er = e.getBoundingClientRect(); a.scrollTop += (er.top - ar.top) - ar.height / 2 + er.height / 2; } }
    const er2 = e.getBoundingClientRect(); if (er2.top < 0 || er2.bottom > innerHeight) window.scrollBy(0, er2.top - innerHeight / 2); })()`).catch(() => {}); await W(900, pg); }
async function rowOn(pg: Page, wo: string, q: string, group?: string) {
  const un = group === 'unassigned' ? 'row is in Unassigned: left open' : await collapseUn(pg);
  let g = await findRow(pg, wo, group).catch(() => null); let usedSearch = false;
  if (!(await pg.locator(`[data-test-id="tech_view_row_${wo}"]`).count())) { await search(pg, q); usedSearch = true; if (group !== 'unassigned') await collapseUn(pg); g = await findRow(pg, wo, group).catch(() => null); }
  await centre(pg, `[data-test-id="tech_view_row_${wo}"]`);
  const b = await pg.locator(`[data-test-id="tech_view_row_${wo}"]`).first().boundingBox().catch(() => null); const vh = pg.viewportSize()?.height ?? 900;
  return { group: g, found: (await pg.locator(`[data-test-id="tech_view_row_${wo}"]`).count()) > 0, onScreen: !!b && b.y >= 0 && b.y + b.height <= vh, rowTop: b ? Math.round(b.y) : null, usedSearch, unassigned: un };
}
/** press, move in steps, HOLD (read + picture while the mouse is down), release */
async function dragHold(pg: Page, from: { x: number; y: number }, to: { x: number; y: number }, name: string) {
  await D(pg, '__D.snap()');
  await pg.mouse.move(from.x, from.y); await pg.mouse.down(); await pg.mouse.move(from.x, from.y + 8, { steps: 4 });
  await pg.mouse.move(to.x, to.y, { steps: 22 }); await W(800, pg);
  const during = await D(pg, '__D.fresh()'); during.picture = await pic(pg, name);
  await pg.mouse.up(); await W(2500, pg); return during;
}

// ───────────────────────────── data ─────────────────────────────
const canned: any[] = []; { const c = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(c) ? c : c?.collection ?? [])); }
const GREASE = canned.find((x: any) => /Full grease service/i.test(String(x.canned_line_name ?? x.name ?? x.title ?? ''))) ?? canned.find((x: any) => /grease/i.test(String(x.canned_line_name ?? x.name ?? x.title ?? ''))) ?? canned[1] ?? canned[0];
R.line = GREASE ? String(GREASE.canned_line_name ?? GREASE.name ?? GREASE.title ?? 'first ready-made line') : 'no ready-made lines';
const linesRaw = async (wo: string) => { const d = (await a.get(`/api/work-orders/lines/${wo}`)).body?.data; return (Array.isArray(d) ? d : d?.collection ?? d?.lines ?? []) as any[]; };
const RED = path.join(EV, 'zz-photo-red.png');
const clocks: { userId: string; who: string }[] = [];
async function asTech<T>(userId: string, f: () => Promise<T>): Promise<T> {
  let s = await a.post('/api/switch-user', { user_id: userId }); if (s.status >= 300) { await a.post('/api/exit-switch-user', {}); s = await a.post('/api/switch-user', { user_id: userId }); }
  if (s.status >= 300) throw new Error(`switch ${s.status}`);
  await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: process.env.WOB_LOC_TZ || 'Asia/Karachi' });
  try { return await f(); } finally { await RUN.toRunner(); }
}
async function openEditProfile(pg: Page) {
  if (!pg.url().startsWith(APP)) { await pg.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await W(5000, pg); }
  await pg.locator('[data-test-id="profile_menu_button"]').click(); await W(800, pg);
  const item = pg.locator('.q-menu .q-item, .q-menu a').filter({ hasText: /Edit Profile/i }).first();
  if (await item.count()) await item.click(); else { await pg.keyboard.press('Escape'); await pg.goto(APP + '/profile', { waitUntil: 'domcontentloaded' }); }
  await W(3500, pg);
}
async function upload(pg: Page, file: string) {
  const inp = pg.locator('input[type=file]'); const n = await inp.count();
  if (!n) { const tt = pg.getByText(/Click to upload a profile photo/i).first(); if (await tt.count()) { const [fc] = await Promise.all([pg.waitForEvent('filechooser', { timeout: 8000 }).catch(() => null), tt.click()]); if (fc) { await fc.setFiles(file); await W(4000, pg); return 'filechooser'; } } return 'no file input'; }
  await inp.first().setInputFiles(file); await W(1500, pg);
  const save = pg.locator('.q-dialog button, button').filter({ hasText: /^(Save|Upload|Crop|Apply|Confirm)$/i }).first(); if (await save.count() && await save.isVisible()) { await save.click(); await W(1500, pg); }
  await W(3000, pg); return `input x${n}`;
}
type Tech = { id: string; staff: string; name: string; first: string; last: string; log: string[] };
const techs: Record<string, Tech> = {};
/** technician "ZZAUTOTEST <dc> <last>" (made once, reused), eligible at Heavy Duty; photo through their own Edit Profile when asked */
async function tech(dc: string, last: string, photo = false): Promise<Tech> {
  const key = `${dc} ${last}`; if (techs[key]) return techs[key];
  const email = `zz.wob.${dc.toLowerCase()}.${last.split(/[ -]/)[0].toLowerCase()}${MAIL}`;
  const { row, log } = await person(a, `ZZAUTOTEST ${dc}`, last, { role: TECH_ROLE, email, clockable: true });
  if (!row) throw new Error(`technician ${key}: ${log.join('; ')}`);
  const lg = [...log, ...(await ensureEligible(a, row, key))];
  if (photo) {
    const has = Object.entries(row).filter(([k, v]) => /avatar|photo|picture/i.test(k) && v).map(([k]) => k);
    if (has.length) lg.push(`photo already (${has.join(',')})`);
    else { const v = await viewAs(browser, p, a, row.id, RUN.me?.id ?? '', RUN.toRunner); try { await openEditProfile(v.page); lg.push(`photo ${await upload(v.page, RED)}`); } finally { await v.close(); } }
  }
  return (techs[key] = { id: row.id, staff: row.staff_id, name: `ZZAUTOTEST ${dc} ${last}`, first: `ZZAUTOTEST ${dc}`, last, log: lg });
}
async function cust(base: string, unit = 'ZZDC') { const name = `${base} ${RUNNO}`; return { ...(await customer(a, name, unit)), name }; }
type WoOpts = { status?: 'approved' | 'estimate' | 'invoiced'; lead?: string | null; line?: boolean; lineTech?: string | null; keepParts?: boolean };
/** one work order for the case's customer; returns {id, number, log} */
async function mkWO(c: any, o: WoOpts = {}) {
  const status = o.status ?? 'approved'; const log: string[] = [];
  const id = await workOrder(a, c, 'estimate', null); let line: string | null = null;
  if (o.line || status === 'invoiced') {
    line = (await a.post(`/api/work-orders/${id}/lines/create-from-canned-line`, { canned_line_id: GREASE.id, status: 'authorized' })).body?.data?.line_id ?? null;
    if (!o.keepParts) for (const l of await linesRaw(id)) for (const rq of (l.part_requests ?? [])) await a.post(`/api/work-orders/part/remove-request/${rq.id ?? rq.part_request_id}`, {});
    if (o.lineTech && line) log.push(`line tech ${say(await a.put(`/api/work-orders/lines/${line}/technicians`, { staffIds: [o.lineTech] }))}`);
  }
  if (status !== 'estimate') log.push(`approve ${say(await a.post('/api/work-orders/change-status', { id, status: 'approved' }))}`);
  if (o.lead) log.push(`lead ${say(await a.post('/api/work-orders/change-lead-technician', { work_order_id: id, tech_assigned_id: o.lead }))}`);
  if (status === 'invoiced') {
    log.push(`mileage ${say(await a.post('/api/work-orders/change-mileage', { work_order_id: id, mileage: '123456' }))}`);
    for (const l of await linesRaw(id)) { for (const rq of (l.part_requests ?? [])) await a.post(`/api/work-orders/part/remove-request/${rq.id ?? rq.part_request_id}`, {});
      await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'Done', work_order_id: id });
      log.push(`line complete ${say(await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, status: 'complete', workOrderId: id }))}`); }
    for (const s of ['in_progress', 'ready_for_review', 'complete']) log.push(`${s} ${say(await a.post('/api/work-orders/change-status', { id, work_order: id, status: s }))}`);
    log.push(`invoice ${say(await a.post('/api/invoices/create', { work_order_id: id, issue_date: new Date().toISOString().slice(0, 10), due_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) }))}`);
  }
  const w = (await workOrders(a, c.name)).find((x: any) => x.id === id);
  return { id, number: w?.number ?? '?', status: w?.status ?? '?', lead: w?.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName ?? ''}`.trim() : null, line, log };
}
const brief = (w: any) => `${w.number} ${w.status} lead=${w.lead ?? '-'}${w.log.some((x: string) => / [45]\d\d /.test(x)) ? ' LOG ' + w.log.join('; ') : ''}`;

async function run(id: string, f: (o: any) => Promise<void>) {
  if (!want(id)) return;
  const o: any = (R[id] = { started: t() });
  try { await f(o); } catch (e: any) { o.error = String(e?.message || e).slice(0, 400); await shot(p, `${id}-error`); }
  try { await p.mouse.up().catch(() => {}); await p.keyboard.press('Escape').catch(() => {}); registerShotPage(p); await (globalThis as any).__shotEach?.(id); } catch { /* */ }
  o.ended = t(); console.log(t(), id, JSON.stringify(o).slice(0, 3000));
  fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
}

// 16 Oct 2026 (build v26.40.18-7d85b7d, RETEST-PLAN-2026-10-16): the Search box's icon and each filter chip's icons, in the display in use
const filterIcons = async (pg: Page = p) => ({ search: await D(pg, `(function () { var i = __D.q('[data-test-id="page_search_input"]'); var f = i && (i.closest('.q-field') || i.parentElement); return f ? __D.icons(f) : 'no search box'; })()`),
  chips: ((await D(pg, '__D.chips()')) ?? []).map((x: any) => ({ text: x.text, icons: x.icons })) });

// ═════════════════════════════ the 22 cases ═════════════════════════════

// ───────────────────────────── ROUND 4 blocks (17 Oct 2026) ─────────────────────────────
/** the red-number line: a second line on the work order in "Needs Approval" (authorization_required), through the app's own add-line call */
async function redLine(wo: { id: string; line: string | null }) {
  const o: any = {};
  const before = new Set((await linesRaw(wo.id)).map((l: any) => l.line_id));
  const r = await a.post(`/api/work-orders/${wo.id}/lines/create-from-canned-line`, { canned_line_id: GREASE.id, status: 'authorization_required' });
  o.create = say(r); o.lineId = r.body?.data?.line_id ?? (await linesRaw(wo.id)).map((l: any) => l.line_id).find((x: string) => !before.has(x)) ?? null;
  if (!o.lineId) return o;
  // its own part requests come off, so the blue number still counts Part-A only (Line-1's request)
  for (const l of await linesRaw(wo.id)) if (l.line_id === o.lineId) for (const rq of (l.part_requests ?? [])) o.partOff = say(await a.post(`/api/work-orders/part/remove-request/${rq.id ?? rq.part_request_id}`, {}));
  const st = (await linesRaw(wo.id)).find((l: any) => l.line_id === o.lineId)?.status;
  o.statusAfterCreate = st;
  if (st && st !== 'authorization_required') o.statusFix = say(await a.post('/api/work-orders/lines/change-status', { line_id: o.lineId, status: 'authorization_required', workOrderId: wo.id }));
  return o;
}
const linesNow = async (wo: { id: string; line: string | null }, red: string | null) => (await linesRaw(wo.id)).map((l: any) => `${l.line_id === wo.line ? 'Line-1' : l.line_id === red ? 'Line-2 (red)' : 'other line'} ${l.status} parts=${(l.part_requests ?? []).map((x: any) => x.status).join('+') || 'none'}`);
const countsOf = async (c: any, id: string) => { const w = (await workOrders(a, c.name)).find((x: any) => x.id === id); return w ? { status: w.status, serviceActionsCount: w.serviceActionsCount ?? null, partRequestsCount: w.partRequestsCount ?? null, statusRequestedCount: w.statusRequestedCount ?? null, statusAuthToOrderCount: w.statusAuthToOrderCount ?? null, statusInStock: w.statusInStock ?? null } : 'not in the list answer'; };
const RED_BG = /rgb\(239, 83, 80\)|rgb\(2[0-5]\d, \d{1,2}, \d{1,2}\)/;   // Quasar red-5 = rgb(239, 83, 80); any strong red counts as "a red number"
const BLUE_BG = /rgb\(66, 165, 245\)/;   // Quasar blue-5

await run('C590115', async (o) => { // status pill in List and Tech View, red AND blue numbers, at each density
  const A = await tech('DC06', 'Gia Pills'); const c = await cust('ZZAUTOTEST DC06 Status Pill');
  console.log(t(), 'START STATE found C590115', JSON.stringify({ technician: A.name, technicianLog: A.log.slice(-3), customer: c.name }));
  const w1 = await mkWO(c, { lead: A.staff, line: true, keepParts: true }); o.wo1 = brief(w1);
  // blue: Part-A requested and not ordered on Line-1 (the earlier recipe, unchanged)
  { const vendors = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/parts-catalogue/vendors')).body?.data); const vendor = vendors.find((v: any) => v.id);
    const cats = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/inventory/categories')).body?.data); const cat = cats[0]?.value ?? cats[0]?.id;
    o.partRequest = say(await a.post('/api/work-orders/part/make-request', { line: w1.line, work_order: w1.id, description: 'ZZAUTOTEST-PN-DC06', quantity: 1, part_source_type: 'vendor', part_category_id: cat, part_number: `ZZAUTOTEST-PN-DC06-${RUNNO}`, cost: 10, sell_price: 20, vendor: vendor?.id, is_core: false })); }
  // red: Line-2 in Needs Approval
  o.redLine = await redLine(w1);
  o.lines = await linesNow(w1, o.redLine.lineId); o.serverCounts = await countsOf(c, w1.id);
  o.preparedOk = { red: (o.serverCounts?.serviceActionsCount ?? 0) > 0, blue: (o.serverCounts?.partRequestsCount ?? 0) > 0 || (o.serverCounts?.statusAuthToOrderCount ?? 0) > 0, stillApproved: o.serverCounts?.status === 'approved' };
  console.log(t(), 'START STATE set C590115', JSON.stringify({ wo1: o.wo1, redLine: o.redLine, lines: o.lines, serverCounts: o.serverCounts, preparedOk: o.preparedOk }));
  const pillAt = async (key: string, tag: string) => { const pl = await D(p, `__D.pill(__D.cell(${J(key)}, 'Status'))`); const hov: any[] = [];
    for (const [i, n] of ((pl?.numbers ?? []) as any[]).entries()) { await away(); await hoverBox(p, n.bgBox ?? n.box); const tp = await D(p, '__D.tips()');
      hov.push({ number: n.text, bg: n.bg, kind: RED_BG.test(String(n.bg)) ? 'red' : BLUE_BG.test(String(n.bg)) ? 'blue' : 'other', box: n.bgBox ?? n.box, tooltips: tp?.map((x: any) => x.text), place: rel(tp?.[0]?.box ?? null, n.bgBox ?? n.box) }); await pic(p, `C590115-r4-${tag}-number${i + 1}-hover`); }
    await away(); return { pill: pl, hovers: hov, picture: await clip(p, `C590115-r4-${tag}-pill`, pl?.pill?.box ?? null, 30) }; };
  // steps 1-3: List, the customer searched
  o.prep = await prep([A.staff], 'List'); await search(p, c.name); o.listSearchHolds = await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null);
  o.s2_s3_list = await pillAt(w1.number, 's2-list'); await pic(p, 'C590115-r4-s2-list');
  o.listControl = { redDrawn: o.s2_s3_list.hovers.some((h: any) => h.kind === 'red'), blueDrawn: o.s2_s3_list.hovers.some((h: any) => h.kind === 'blue'), numbers: o.s2_s3_list.hovers.map((h: any) => `${h.kind}:${h.number}`) };
  console.log(t(), 'C590115 List control (red and blue drawn?)', JSON.stringify(o.listControl));
  // steps 4-6: Tech View, the same search, the same work order
  await display(p, 'Tech View'); await search(p, c.name); o.techSearchHolds = await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null); o.find = await rowOn(p, w1.id, c.name, A.staff);
  o.s5_s6_tech = await pillAt(w1.id, 's5-tech'); await pic(p, 'C590115-r4-s5-tech');
  const sum = (x: any) => ({ word: x?.pill?.pill?.text ?? null, bg: x?.pill?.pill?.st?.backgroundColor ?? null, color: x?.pill?.pill?.st?.color ?? null, border: x?.pill?.pill?.st?.borderTop ?? null, radius: x?.pill?.pill?.st?.borderRadius ?? null, width: x?.pill?.pill?.box?.w ?? null, height: x?.pill?.pill?.box?.h ?? null,
    numbers: (x?.hovers ?? []).map((h: any) => ({ kind: h.kind, text: h.number, bg: h.bg, size: h.box ? `${h.box.w}x${h.box.h}` : null, tooltip: (h.tooltips ?? []).join(' | ') })) });
  o.compare = { list: sum(o.s2_s3_list), tech: sum(o.s5_s6_tech), sameSearch: o.techSearchHolds === c.name };
  console.log(t(), 'C590115 List vs Tech View', JSON.stringify(o.compare));
  // steps 7-12: density Compact / Regular / Comfortable — Work-order-1's pill and the pills on screen
  for (const d of ['compact', 'regular', 'comfortable'] as const) { o[`density_${d}`] = { menu: await density(p, d), wo1Pill: (await D(p, `__D.pill(__D.cell(${J(w1.id)}, 'Status'))`))?.pill?.box, visiblePillHeights: await D(p, '__D.pills()'), picture: await pic(p, `C590115-r4-${d}-tech`) }; }
  // step 13: List again
  await density(p, 'regular'); await display(p, 'List'); await search(p, c.name);
  { const pl = await D(p, `__D.pill(__D.cell(${J(w1.number)}, 'Status'))`); o.s13_list = { pill: pl, picture: await clip(p, 'C590115-r4-s13-list-pill', pl?.pill?.box ?? null, 30) }; await pic(p, 'C590115-r4-s13-list'); }
  await search(p, '');
});

await run('C590116', async (o) => { // six-dot grip on rows and group headers; not for a view-only user; step 5 dropped inside the group
  const A = await tech('DC07', 'Hana Grip'); const c = await cust('ZZAUTOTEST DC07 Grip');
  const w1 = await mkWO(c, { lead: A.staff }), w2 = await mkWO(c, { lead: A.staff }), w3 = await mkWO(c, { status: 'estimate' }); o.wos = [w1, w2, w3].map(brief);
  o.prep = await prep([A.staff], 'Tech View');
  const hdrRead = (pg: Page) => D(pg, `__D.qa('[data-test-id^="tech_view_group_"]').filter(function (e) { return /^tech_view_group_([0-9a-f-]{36}|unassigned)$/.test(e.getAttribute('data-test-id')); }).slice(0, 6).map(function (tr) { var g = tr.querySelector('[data-test-id^="tech_view_group_drag_handle_"]'); var n = tr.querySelector('[data-test-id^="tech_view_group_name_"]'); return { group: n ? n.textContent.trim() : tr.getAttribute('data-test-id'), grip: g ? __D.desc(g, true) : null, gripLeftOfRow: g ? Math.round(g.getBoundingClientRect().left - tr.getBoundingClientRect().left) : null, firstParts: __D.parts(tr, 3) }; })`);
  // step 2
  o.s2_groupHeaders = await hdrRead(p);
  o.s2_pic = await clip(p, 'C590116-r4-s2-group-headers', await D(p, `__D.box(__D.grp('unassigned'))`), 8); await pic(p, 'C590116-r4-s2-tech');
  o.find1 = await rowOn(p, w1.id, c.name, A.staff); o.find2 = { found: (await p.locator(`[data-test-id="tech_view_row_${w2.id}"]`).count()) > 0 };
  console.log(t(), 'START STATE found C590116', JSON.stringify({ wos: o.wos, wo1: o.find1, wo2: o.find2 }));
  // step 3
  o.s3_rows = { wo1: await D(p, `__D.rowGrip(${J(w1.id)})`), wo2: await D(p, `__D.rowGrip(${J(w2.id)})`), sample: await D(p, `__D.qa('[data-test-id^="tech_view_row_"]').slice(0, 6).map(function (tr) { return __D.rowGrip(tr.getAttribute('data-test-id').replace('tech_view_row_', '')); })`) };
  o.find3 = await rowOn(p, w3.id, c.name, 'unassigned'); o.s3_wo3 = await D(p, `__D.rowGrip(${J(w3.id)})`); o.s3_pic = await pic(p, 'C590116-r4-s3-unassigned-row');
  // step 4
  o.find1b = await rowOn(p, w1.id, c.name, A.staff); o.find2b = { found: (await p.locator(`[data-test-id="tech_view_row_${w2.id}"]`).count()) > 0 }; await away();
  const before = await D(p, `__D.rowGrip(${J(w1.id)})`); await hoverSel(p, `[data-test-id="tech_view_row_${w1.id}"]`);
  o.s4_hover = { before, after: await D(p, `__D.rowGrip(${J(w1.id)})`), picture: await clip(p, 'C590116-r4-s4-row-hover', await D(p, `__D.box(__D.rowEl(${J(w1.id)}))`), 40) };
  await away();
  // step 5: press on WO-1's Customer cell, move down past WO-2's row, release INSIDE Technician-A's group
  const order = async () => (await groups(p)).find((g) => g.id === A.staff)?.rows.map((n) => n === w1.number ? 'WO-1' : n === w2.number ? 'WO-2' : n);
  const leadNow = async (id: string) => { const w = (await workOrders(a, c.name)).find((x: any) => x.id === id); return w?.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName ?? ''}`.trim() : 'none'; };
  /** what is under a point: the row (and its group key) or a group header */
  const under = (pg: Page, x: number, y: number) => pg.evaluate(`(() => { const e = document.elementFromPoint(${x}, ${y}); const tr = e && e.closest('tr'); if (!tr) return { what: e ? e.tagName : 'nothing' };
    const tid = tr.getAttribute('data-test-id') || ''; return { tid: tid.replace(${J(w1.id)}, 'WO-1').replace(${J(w2.id)}, 'WO-2').replace(${J(A.staff)}, 'Technician-A').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>'), groupKey: tr.getAttribute('data-group-key') === ${J(A.staff)} ? 'Technician-A' : tr.getAttribute('data-group-key'), isGroupHeader: /^tech_view_group_/.test(tid) }; })()`) as Promise<any>;
  o.s5_orderBefore = await order(); o.s5_leadBefore = await leadNow(w1.id);
  const cb = await D(p, `__D.box(__D.cell(${J(w1.id)}, 'Customer'))`), r1 = await D(p, `__D.box(__D.rowEl(${J(w1.id)}))`), r2 = await D(p, `__D.box(__D.rowEl(${J(w2.id)}))`);
  o.s5_boxes = { customerCell: cb, wo1Row: r1, wo2Row: r2 };
  if (cb && r1 && r2) {
    const x = cb.x + cb.w / 2; const tries = [{ name: 'inside WO-2, 70% down', y: r2.y + r2.h * 0.7 }, { name: 'WO-2 centre', y: r2.y + r2.h / 2 }, { name: 'between the two row centres', y: (r1.y + r1.h / 2 + r2.y + r2.h / 2) / 2 }];
    o.s5_checked = []; let pick: any = null;
    for (const tr of tries) { const u = await under(p, x, tr.y); o.s5_checked.push({ ...tr, y: Math.round(tr.y), under: u }); if (!pick && u?.groupKey === 'Technician-A' && !u.isGroupHeader) pick = { ...tr, under: u }; }
    o.s5_dropPoint = pick ? { name: pick.name, x: Math.round(x), y: Math.round(pick.y), under: pick.under } : 'no point inside Technician-A\'s group found — drag NOT made';
    if (pick) {
      await D(p, '__D.snap()'); await p.mouse.move(x, cb.y + cb.h / 2); await p.mouse.down(); await p.mouse.move(x, cb.y + cb.h / 2 + 8, { steps: 4 });
      await p.mouse.move(x, pick.y, { steps: 22 }); await W(800);
      o.s5_during = await D(p, '__D.fresh()'); o.s5_during.underWhileHeld = await under(p, x, pick.y); o.s5_during.picture = await pic(p, 'C590116-r4-s5-dragging');
      await p.mouse.up(); await W(2500); o.s5_toasts = await D(p, '__D.notes()');
    }
  } else o.s5_during = `customer cell ${!!cb}, WO-1 row ${!!r1}, WO-2 row ${!!r2}`;
  o.s5_orderAfter = await order(); o.s5_leadAfter = await leadNow(w1.id); await pic(p, 'C590116-r4-s5-after-drop');
  o.s5_movedBelow = Array.isArray(o.s5_orderAfter) && o.s5_orderAfter.indexOf('WO-1') > o.s5_orderAfter.indexOf('WO-2') && o.s5_orderAfter.indexOf('WO-2') >= 0;
  if (o.s5_leadAfter !== o.s5_leadBefore) { o.s5_leadPutBack = say(await a.post('/api/work-orders/change-lead-technician', { work_order_id: w1.id, tech_assigned_id: A.staff })); o.s5_leadAfterPutBack = await leadNow(w1.id); }
  console.log(t(), 'C590116 step 5', JSON.stringify({ before: o.s5_orderBefore, after: o.s5_orderAfter, movedBelow: o.s5_movedBelow, leadBefore: o.s5_leadBefore, leadAfter: o.s5_leadAfter, drop: o.s5_dropPoint, messages: o.s5_toasts }));
  // step 6: a plain click on WO-1's Customer cell
  await rowOn(p, w1.id, c.name, A.staff); const url0 = p.url(); const cb2 = await D(p, `__D.box(__D.cell(${J(w1.id)}, 'Customer'))`);
  if (cb2) { await p.mouse.click(cb2.x + cb2.w / 2, cb2.y + cb2.h / 2); await W(3500); }
  o.s6_click = { before: url0.replace(APP, ''), after: p.url().replace(APP, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>'), orderAfter: p.url() === url0 ? await order() : 'page changed', picture: await pic(p, 'C590116-r4-s6-after-click') };
  // steps 7-9 as User-B in User-B's own window (the shared session is never signed out, L0342)
  if (!VIEW_ROLE) { o.userB = 'no "ZZAUTOTEST WO View Only" role in this organisation'; return; }
  const vb = (await person(a, 'ZZAUTOTEST DC07', 'Viewer', { role: VIEW_ROLE, email: `zz.wob.dc07.viewer${MAIL}`, clockable: false })).row;
  if (!vb) { o.userB = 'User-B not made'; return; }
  o.userB = { role: vb.role_label };
  const v = await viewAs(browser, p, a, vb.id, RUN.me?.id ?? '', RUN.toRunner); const pg = v.page; registerShotPage(pg); pg.setDefaultTimeout(15_000);
  try {
    o.userB.perms = v.perms; o.userB.prep = await prep([A.staff], 'Tech View', 1440, pg, api(pg)); o.userB.find1 = await rowOn(pg, w1.id, c.name, A.staff);
    o.s9_rows = { wo1: await D(pg, `__D.rowGrip(${J(w1.id)})`), wo2: await D(pg, `__D.rowGrip(${J(w2.id)})`), sample: await D(pg, `__D.qa('[data-test-id^="tech_view_row_"]').slice(0, 5).map(function (tr) { return __D.rowGrip(tr.getAttribute('data-test-id').replace('tech_view_row_', '')); })`) };
    o.s9_pic = await pic(pg, 'C590116-r4-s9-user-b-rows');
    // NEW: the group headers for User-B, Unassigned included (table scrolled to the top so Unassigned is drawn)
    await pg.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) s.scrollTop = 0; })()`).catch(() => {}); await W(1200, pg);
    o.s9_groupHeaders = await hdrRead(pg); o.s9_unassignedDrawn = (await pg.locator('[data-test-id="tech_view_group_unassigned"]').count()) > 0;
    o.s9_headersPic = await clip(pg, 'C590116-r4-s9-user-b-group-headers', await D(pg, `__D.box(__D.grp('unassigned'))`), 8);
    o.s9_pic2 = await pic(pg, 'C590116-r4-s9-user-b-tech'); await pg.screenshot({ path: path.join(EV, 'C590116-r4-end.png') }).catch(() => {});
  } finally { registerShotPage(p); await v.close(); }
});

// ───────────────────────────── put everything back ─────────────────────────────
for (const ck of clocks) { try { await asTech(ck.userId, async () => { const cur = (await a.get('/api/technician-tasks/my-current-task')).body?.data; if (cur?.technician_task?.id) await a.post('/api/technician-tasks/check-out', { task_id: cur.technician_task.id }); }); } catch { /* */ } }
R.restorePref = (await a.put(PREF, { value: ORIGINAL })).status;
R.ended = new Date().toISOString(); fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
await RUN.end().catch(() => {});
await done(browser);
