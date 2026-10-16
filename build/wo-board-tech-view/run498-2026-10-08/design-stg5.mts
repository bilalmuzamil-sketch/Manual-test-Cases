/**
 * design-stg5.mts — 15 Oct 2026, FIFTH pass on STAGING: run 498 section "Design — how it looks" (section 73780), C590110–C590131.
 *
 * WHAT IT DOES: follows each case's CURRENT steps (TestRail, read 15 Oct 2026) as the test admin "ZZ WOB Runner" (Admin role, runner.mts)
 * at Staging Heavy Duty - 9919 and RECORDS the measurable facts each Expected names — computed styles (font size / weight, colours,
 * background, padding, margins, borders, radius, shadow, opacity), element boxes (positions, widths, heights, gaps), the left-to-right
 * order of the pieces of a header, overlaps between neighbouring labels (text boxes measured from the text itself and cut to what is
 * really on screen), tooltip boxes against their trigger and the column header row, colours before and after a REAL mouse hover, and
 * the same at each window width and density the case names. A picture is taken at every step the Expected judges (QA_DPR=2: sharp).
 * It records raw values only and decides NOTHING; no TestRail, no Jira.
 *
 * DATA: each case makes the people and records its preconditions name — technicians "ZZAUTOTEST DCxx <First Last>" (first name
 * "ZZAUTOTEST DCxx", so initials read "Z" + the last name's letter, as the cases' "ZJ" example), a NEW customer per run
 * ("<case's customer> <run number>", so a drag in an earlier run never changes this run's set-up) and the work orders. Photos go on
 * through the technician's own Edit Profile (ps-photo-batch recipe). The case's technicians are pinned (≤3) so their group / column sits
 * right after Unassigned (~119 technicians at Heavy Duty, L0335/L0337); C590119 needs none pinned and scrolls to the columns instead.
 * Each case starts from the defaults its preconditions name: no filters, Assigned to me off, empty Search, density Regular, default
 * Tech View columns / Board View fields / technician order (those saved choices are taken off the runner's preference first).
 * Where a step acts on a record that sits among hundreds in Unassigned, the script scrolls to it; only if it cannot be reached that way
 * does it type the customer's name in Search, and the reading says so ("usedSearch").
 * Not like the case, and why: C590116 step 7 ("Logout, then sign in as User-B") opens User-B's own window instead (the shared admin
 * session is never signed out, L0342); C590113's "never opened Tech View" user is created new on every run.
 * C590125 (Dark theme, on hold): only records whether a Dark/theme option is offered (profile menu, Edit Profile, Settings) and, if it
 * is, pictures of Tech View and Board View in it; nothing else.
 * Every saved choice is put back at the end (runner preference as it was, any clock started here stopped).
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP, registerShotPage } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, workOrders, type Api } from './data.mts';
import { EV, t, shot, display, tab, search, findRow, toColumn, groups, shiftPrompt } from './wob.mts';
import { person, roleIds, ensureEligible, HEAVY } from './staff.mts';
import { viewAs } from './viewas.mts';

if (!process.env.WOB_SCALE && process.env.QA_DPR) process.env.WOB_SCALE = process.env.QA_DPR; // the runner's window at 2x too
const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const OUT = path.join(EV, 'design-stg5.json');
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; p.setDefaultTimeout(15_000);
const a = api(p);
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
await run('C590110', async (o) => { // switcher and toolbar icons
  const A = await tech('DC01', 'Ana Icons'); const c = await cust('ZZAUTOTEST DC01 Toolbar Icons'); o.wo1 = brief(await mkWO(c, { lead: A.staff }));
  o.prep = await prep([A.staff], 'List');
  o.s1_list = await D(p, '__D.switcher()'); o.s1_pic = await clip(p, 'C590110-s1-list-switcher', await D(p, '__D.box(__D.track())')); await pic(p, 'C590110-s1-list');
  o.s4_list_filterIcons = await filterIcons(); o.s4_pic = await clip(p, 'C590110-s4-list-filter-icons', await D(p, '__D.box(__D.toolbar())'), 4); // 16 Oct: new step 4
  await display(p, 'Tech View'); await away();
  o.s2_tech = { switcher: await D(p, '__D.switcher()'), density: await D(p, `__D.desc(__D.q('[data-test-id="button_density"]'), true)`), columnSelection: await D(p, `__D.desc(__D.q('[data-test-id="button_tech_view_column_selection"]'), true)`) };
  o.s2_pic = await clip(p, 'C590110-s2-tech-toolbar', await D(p, '__D.box(__D.toolbar())'), 4);
  o.s7_tech_filterIcons = await filterIcons(); // 16 Oct: new step 7
  await p.locator('[data-test-id="button_density"]').first().click(); await W(900);
  o.s3_menu = await D(p, '__D.menu()'); o.s3_pic = await pic(p, 'C590110-s3-density-menu');
  await p.keyboard.press('Escape'); await W(700); o.s4_menuAfterEscape = await D(p, '__D.menu()');
  await display(p, 'Board View'); await away();
  o.s5_board = { switcher: await D(p, '__D.switcher()'), density: await D(p, `__D.desc(__D.q('[data-test-id="button_density"]'), true)`), fields: await D(p, `__D.desc(__D.q('[data-test-id="button_board_fields_selection"]'), true)`) };
  o.s5_pic = await clip(p, 'C590110-s5-board-toolbar', await D(p, '__D.box(__D.toolbar())'), 4);
  o.s13_board_filterIcons = await filterIcons(); // 16 Oct: new step 13
  await display(p, 'List'); await away();
  o.s6_list = { buttons: await D(p, '__D.tbButtons()'), icons: await D(p, '__D.icons(__D.toolbar())') }; o.s6_pic = await clip(p, 'C590110-s6-list-toolbar', await D(p, '__D.box(__D.toolbar())'), 4);
});

await run('C590111', async (o) => { // switcher tooltips against the column headers
  const A = await tech('DC02', 'Ben Tooltip'); const c = await cust('ZZAUTOTEST DC02 Switcher Tooltip'); o.wo1 = brief(await mkWO(c, { lead: A.staff }));
  o.prep = await prep([A.staff], 'Tech View');
  const each = async (tag: string, against: string) => { const out: any = {}; for (const l of ['List', 'Tech View', 'Board View']) out[l] = await tipFor(p, `[aria-label="${l}"]`, `C590111-${tag}-${l.replace(' ', '')}`, against); return out; };
  o.s1_s2_tech1440 = await each('tech1440', '__D.box(__D.headRow())');
  await display(p, 'Board View'); await away();
  o.boardHeaderRow = `union of the visible board column headers`;
  o.s3_s4_board1440 = await each('board1440', `(function () { var hs = __D.qa('[data-test-id^="board_column_header_"]'); if (!hs.length) return null; var x = 1e9, y = 1e9, r = -1e9, b = -1e9; hs.forEach(function (h) { var q = h.getBoundingClientRect(); x = Math.min(x, q.left); y = Math.min(y, q.top); r = Math.max(r, q.right); b = Math.max(b, q.bottom); }); return { x: x, y: y, w: r - x, h: b - y, r: r, b: b }; })()`);
  await p.setViewportSize({ width: 1536, height: 900 }); await W(1200); await display(p, 'Tech View'); await away();
  o.s5_s6_tech1536 = await each('tech1536', '__D.box(__D.headRow())');
});

await run('C590112', async (o) => { // Tech View edge to edge, double border on group headers, sticky header, sideways scroll
  const A = await tech('DC03', 'Cara Edge'); const c = await cust('ZZAUTOTEST DC03 Edge To Edge');
  o.wo1 = brief(await mkWO(c, { lead: A.staff })); o.wo2 = brief(await mkWO(c, { status: 'estimate' }));
  o.prep = await prep([A.staff], 'Tech View');
  const read = async (tag: string) => ({ frame: await D(p, '__D.frame()'), groupBorders: await D(p, '__D.groupBorders()'), picture: await pic(p, `C590112-${tag}`) });
  o.s2_1440 = await read('s2-tech-1440');
  o.s3_groupHeader = await clip(p, 'C590112-s3-group-header', await D(p, `__D.box(__D.grp(${J(A.staff)}))`), 24);
  const before = { thead: await D(p, '__D.box(__D.headRow())'), sc: await D(p, '__D.tScroller()') };
  await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) s.scrollTop += 700; })()`); await W(1200);
  o.s4_sticky = { before, after: { thead: await D(p, '__D.box(__D.headRow())'), theadPosition: await D(p, `(function () { var t = __D.q('thead'); var th = __D.q('thead th'); return { thead: t ? getComputedStyle(t).position : null, th: th ? getComputedStyle(th).position : null, top: th ? getComputedStyle(th).top : null }; })()`), sc: await D(p, '__D.tScroller()') }, picture: await pic(p, 'C590112-s4-scrolled-down') };
  await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) { s.scrollTop = 0; s.scrollLeft = s.scrollWidth; } })()`); await W(1200);
  o.s5_sideways = { sc: await D(p, '__D.tScroller()'), align: await D(p, '__D.align()'), picture: await pic(p, 'C590112-s5-scrolled-sideways') };
  await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) s.scrollLeft = 0; })()`);
  await p.setViewportSize({ width: 1536, height: 900 }); await W(1500);
  o.s6_1536 = { ...(await read('s6-tech-1536')), align: await D(p, '__D.align()') };
  await p.setViewportSize({ width: 1440, height: 900 }); await display(p, 'List'); await away();
  o.s7_list = await read('s7-list-1440');
});

await run('C590113', async (o) => { // default columns and header labels, as a user who has never opened Tech View
  const A = await tech('DC04', 'Dan Columns'); const c = await cust('ZZAUTOTEST DC04 Default Columns'); o.wo1 = brief(await mkWO(c, { lead: A.staff }));
  const nu = (await person(a, 'ZZAUTOTEST DC04', `New ${RUNNO}`, { role: ADMIN_ROLE, email: `zz.wob.dc04.new${RUNNO}${MAIL}`, clockable: false })).row;
  if (!nu) throw new Error('could not make the brand-new Admin user');
  o.userB = { name: `ZZAUTOTEST DC04 New ${RUNNO}` };
  const v = await viewAs(browser, p, a, nu.id, RUN.me?.id ?? '', RUN.toRunner); const pg = v.page; registerShotPage(pg); pg.setDefaultTimeout(15_000);
  try {
    const B = api(pg); o.userB.prefBefore = (await B.get(PREF)).body?.data?.value ?? null;
    await pg.setViewportSize({ width: 1440, height: 900 }); await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000, pg); await tab(pg, 'All').catch(() => {}); await display(pg, 'Tech View'); await away(pg);
    const firstRowText = `(function () { var tr = __D.qa('[data-test-id^="tech_view_row_"]')[0]; if (!tr) return null; return __D.parts(tr, 12).filter(function (x) { return x.kind === 'text'; }).map(function (x) { return x.text + ' ' + x.fontSize + '/' + x.fontWeight + ' ' + x.color; }); })()`;
    o.s2_heads = await D(pg, '__D.heads()'); o.s2_rowText = await D(pg, firstRowText); o.s2_overlaps = await D(pg, '__D.overOf(__D.headRow())');
    o.s2_pic = await pic(pg, 'C590113-s2-default-headers'); o.s2_clip = await clip(pg, 'C590113-s2-header-row', await D(pg, '__D.box(__D.headRow())'), 8);
    await pg.locator('[data-test-id="button_tech_view_column_selection"]').first().click(); await W(1000, pg);
    o.s4_menuBefore = await D(pg, '__D.menu()'); o.s4_pic = await pic(pg, 'C590113-s4-column-selection');
    const toggles = await D(pg, `__D.qa('[data-test-id^="toggle_column_"]').map(function (e) { var ck = e.getAttribute('aria-checked') || (e.querySelector('[aria-checked]') ? e.querySelector('[aria-checked]').getAttribute('aria-checked') : null); return { tid: e.getAttribute('data-test-id'), on: ck, text: e.innerText.replace(/\\s+/g, ' ').trim() }; })`);
    o.s4_toggles = toggles; o.s4_turnedOn = [];
    for (const tg of (Array.isArray(toggles) ? toggles : [])) if (tg.on !== 'true') { await pg.locator(`[data-test-id="${tg.tid}"]`).first().click().catch(() => {}); await W(700, pg); o.s4_turnedOn.push(tg.text || tg.tid); }
    await pg.keyboard.press('Escape').catch(() => {}); await away(pg);
    o.s5_heads = await D(pg, '__D.heads()'); o.s5_overlaps = [];
    for (let i = 0; i < 12; i++) {
      o.s5_overlaps.push({ scrollLeft: (await D(pg, '__D.tScroller()'))?.scrollLeft, ...(await D(pg, '__D.overOf(__D.headRow())')) });
      await pic(pg, `C590113-s5-all-columns-${i}`);
      const moved = await pg.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (!s) return false; const b = s.scrollLeft; s.scrollLeft += 700; return s.scrollLeft !== b; })()`); await W(700, pg); if (!moved) break;
    }
    await pg.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) s.scrollLeft = 0; })()`);
    for (const d of ['compact', 'comfortable'] as const) { const m = await density(pg, d); o[`s6_${d}`] = { menu: m, heads: (await D(pg, '__D.heads()'))?.cells?.map((x: any) => `${x.label} ${x.fontSize}/${x.fontWeight} ${x.color} h=${x.box?.h}`), row: await D(pg, firstRowText), overlaps: await D(pg, '__D.overOf(__D.headRow())'), picture: await pic(pg, `C590113-s6-${d}`) }; }
    await density(pg, 'regular'); await pg.setViewportSize({ width: 1536, height: 900 }); await W(1500, pg);
    o.s7_1536 = [];
    for (let i = 0; i < 12; i++) { o.s7_1536.push({ scrollLeft: (await D(pg, '__D.tScroller()'))?.scrollLeft, ...(await D(pg, '__D.overOf(__D.headRow())')) }); await pic(pg, `C590113-s7-1536-${i}`);
      const moved = await pg.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (!s) return false; const b = s.scrollLeft; s.scrollLeft += 800; return s.scrollLeft !== b; })()`); await W(700, pg); if (!moved) break; }
    await pg.screenshot({ path: path.join(EV, 'C590113-end.png') }).catch(() => {});
  } finally { registerShotPage(p); await v.close(); }
});

await run('C590114', async (o) => { // Tech View cells
  const A = await tech('DC05', 'Eva Cells', true), B = await tech('DC05', 'Finn Cells'); o.photoLog = A.log.filter((x) => /photo/.test(x));
  const c = await cust('ZZAUTOTEST DC05 Cell Styles');
  const w1 = await mkWO(c, { lead: A.staff, line: true, lineTech: B.staff }), w2 = await mkWO(c, { status: 'invoiced', lead: A.staff }); o.wo1 = brief(w1); o.wo2 = brief(w2);
  // Technician-B clocked in to Line-1 (as B), stopped again at the end of this case
  const tk = ((await linesRaw(w1.id)).find((l: any) => l.line_id === w1.line)?.tasks ?? []).find((x: any) => x.tech_assigned_id === B.staff)?.id;
  o.clockIn = tk ? await asTech(B.id, async () => (await a.post('/api/technician-tasks/check-in', { task_id: tk, line_id: w1.line, work_order_id: w1.id, refresh_lines: true })).status) : 'no task for Technician-B on Line-1';
  // 15 Oct 2026 (redo): the line held no task for Technician-B after the line technician was set behind the screen ("no task"), so B was
  // never clocked in. Fall back to the screen: in B's own window, the work order's Lines tab, press the line's Start (clock toggle) and
  // read B's running clock back. Stopped again in the finally below.
  if (!tk) { const v = await viewAs(browser, p, a, B.id, RUN.me?.id ?? '', RUN.toRunner); try { const pg = v.page; await pg.goto(`${APP}/workorders/${w1.id}/lines`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(7000, pg);
      const st = pg.locator('[data-test-id^="button_clock_toggle_task_"]').first(); o.startButtons = await pg.locator('[data-test-id^="button_clock_toggle_task_"]').count();
      if (o.startButtons) { await st.click().catch(() => {}); await W(2500, pg); const dlgS = pg.locator('.q-dialog').last(); if (await dlgS.isVisible().catch(() => false)) { o.startDialog = (await dlgS.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200); await dlgS.locator('textarea, input[type=text]').first().fill('ZZAUTOTEST').catch(() => {}); await dlgS.locator('button').filter({ hasText: /Start|Clock In|Confirm|Save/i }).last().click().catch(() => {}); await W(2500, pg); } }
      o.clockInScreen = ((await api(pg).get('/api/technician-tasks/my-current-task')).body?.data?.technician_task?.label) ?? 'no clock running'; await pg.screenshot({ path: path.join(EV, 'C590114-techB-started.png') }).catch(() => {});
    } finally { await v.close(); } if (o.clockInScreen && o.clockInScreen !== 'no clock running') clocks.push({ userId: B.id, who: B.name }); }
  if (tk) clocks.push({ userId: B.id, who: B.name });
  try {
    o.prep = await prep([A.staff, B.staff], 'Tech View'); o.find1 = await rowOn(p, w1.id, c.name, A.staff);
    o.s2_row = await D(p, `__D.row(${J(w1.id)})`);
    const cl = (lab: string) => `__D.cell(${J(w1.id)}, ${J(lab)})`;
    o.s2_number = { parts: await D(p, `__D.parts(${cl('Number')}, 8)`), link: await D(p, `__D.desc(__D.q('a', ${cl('Number')}))`) };
    o.s2_progress = { bars: await D(p, `__D.bars(${cl('Progress')})`), parts: await D(p, `__D.parts(${cl('Progress')}, 6)`), picture: await clip(p, 'C590114-s2-progress-cell', await D(p, `__D.box(${cl('Progress')})`), 24) };
    o.s2_advisor = await D(p, `__D.avs(${cl('Service Advisor')})`); o.s2_assigned = await D(p, `__D.avs(${cl('Assigned Techs')})`);
    o.s2_waiting = await D(p, `__D.parts(${cl('Waiting On Parts')}, 4)`); o.s2_total = { cell: await D(p, `__D.desc(${cl('Total price')}, true)`), parts: await D(p, `__D.parts(${cl('Total price')}, 4)`), header: await D(p, `(function () { var h = __D.heads(); var c = h && h.cells.filter(function (x) { return x.label === 'Total price'; })[0]; return c || null; })()`) };
    o.s2_clockedIn = { parts: await D(p, `__D.parts(${cl('Clocked In')}, 8)`), avatars: await D(p, `__D.avs(${cl('Clocked In')})`) };
    o.s2_pic = await clip(p, 'C590114-s2-wo1-row', await D(p, `__D.box(__D.rowEl(${J(w1.id)}))`), 6); await pic(p, 'C590114-s2-tech');
    o.s3_avatarHover = [];
    for (const [i, av] of ((Array.isArray(o.s2_assigned) ? o.s2_assigned : []) as any[]).entries()) { await away(); await hoverBox(p, av.box); const tp = await D(p, '__D.tips()'); o.s3_avatarHover.push({ avatar: i + 1, tooltips: tp, place: rel(tp?.[0]?.box ?? null, av.box) }); await pic(p, `C590114-s3-avatar-${i + 1}-hover`); }
    await away(); const url0 = p.url(); await p.locator(`[data-test-id="tech_view_row_${w1.id}"]`).locator('a').first().click().catch(async () => { await p.locator(`[data-test-id="tech_view_row_${w1.id}"]`).click(); }); await W(3500);
    o.s4_click = { before: url0.replace(APP, ''), after: p.url().replace(APP, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>') }; await pic(p, 'C590114-s4-opened');
    if (p.url() !== url0) { await p.goBack().catch(() => {}); await W(4000); if (!/\/workorders/.test(p.url())) { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(4000); } await display(p, 'Tech View').catch(() => {}); }
    o.find2 = await rowOn(p, w2.id, c.name, A.staff);
    const n2 = `__D.cell(${J(w2.id)}, 'Number')`; o.s5_wo2Number = { parts: await D(p, `__D.parts(${n2}, 8)`), icons: await D(p, `__D.icons(${n2})`) };
    const lock = (o.s5_wo2Number.icons ?? []).find((x: any) => /lock/i.test(`${x.cls} ${x.ligature ?? ''} ${x.svg?.cls ?? ''}`)) ?? (o.s5_wo2Number.icons ?? [])[0];
    if (lock?.box) { await away(); await hoverBox(p, lock.box); const tp = await D(p, '__D.tips()'); o.s5_lockHover = { lock: lock.box, tooltips: tp, place: rel(tp?.[0]?.box ?? null, lock.box) }; o.s5_pic = await pic(p, 'C590114-s5-lock-hover'); } else o.s5_lockHover = 'no icon in WO-2 Number cell';
    await away(); await display(p, 'List'); await search(p, c.name);
    o.s6_list = { heads: (await D(p, '__D.heads()'))?.cells?.map((x: any) => x.label), clockedIn: { parts: await D(p, `__D.parts(__D.cell(${J(w1.number)}, 'Clocked In'), 8)`), avatars: await D(p, `__D.avs(__D.cell(${J(w1.number)}, 'Clocked In'))`) }, usedSearch: true };
    o.s6_pic = await clip(p, 'C590114-s6-list-row', await D(p, `__D.box(__D.rowEl(${J(w1.number)}))`), 6); await pic(p, 'C590114-s6-list');
    await search(p, '');
  } finally {
    if (tk || (o.clockInScreen && o.clockInScreen !== 'no clock running')) { o.clockOut = await asTech(B.id, async () => { const cur = (await a.get('/api/technician-tasks/my-current-task')).body?.data; return cur?.technician_task?.id ? (await a.post('/api/technician-tasks/check-out', { task_id: cur.technician_task.id })).status : 'no running clock'; }); clocks.splice(clocks.findIndex((x) => x.userId === B.id), 1); }
  }
});

await run('C590115', async (o) => { // status pill in List and Tech View, at each density
  const A = await tech('DC06', 'Gia Pills'); const c = await cust('ZZAUTOTEST DC06 Status Pill');
  const w1 = await mkWO(c, { lead: A.staff, line: true, keepParts: true }); o.wo1 = brief(w1);
  { const vendors = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/parts-catalogue/vendors')).body?.data); const vendor = vendors.find((v: any) => v.id);
    const cats = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/inventory/categories')).body?.data); const cat = cats[0]?.value ?? cats[0]?.id;
    o.partRequest = say(await a.post('/api/work-orders/part/make-request', { line: w1.line, work_order: w1.id, description: 'ZZAUTOTEST-PN-DC06', quantity: 1, part_source_type: 'vendor', part_category_id: cat, part_number: `ZZAUTOTEST-PN-DC06-${RUNNO}`, cost: 10, sell_price: 20, vendor: vendor?.id, is_core: false }));
    o.partRequests = (await linesRaw(w1.id)).flatMap((l: any) => (l.part_requests ?? []).map((r: any) => `${r.part_number}:${r.status}`)); }
  const pillAt = async (key: string, tag: string) => { const pl = await D(p, `__D.pill(__D.cell(${J(key)}, 'Status'))`); const hov: any[] = [];
    for (const [i, n] of ((pl?.numbers ?? []) as any[]).entries()) { await away(); await hoverBox(p, n.bgBox ?? n.box); const tp = await D(p, '__D.tips()'); hov.push({ number: n.text, bg: n.bg, tooltips: tp?.map((x: any) => x.text), place: rel(tp?.[0]?.box ?? null, n.bgBox ?? n.box) }); await pic(p, `C590115-${tag}-number${i + 1}-hover`); }
    await away(); return { pill: pl, hovers: hov, picture: await clip(p, `C590115-${tag}-pill`, pl?.pill?.box ?? null, 30) }; };
  o.prep = await prep([A.staff], 'List'); await search(p, c.name); o.listUsedSearch = true;
  o.s2_s3_list = await pillAt(w1.number, 's2-list');
  await search(p, ''); await display(p, 'Tech View'); o.find = await rowOn(p, w1.id, c.name, A.staff);
  o.s5_s6_tech = await pillAt(w1.id, 's5-tech');
  for (const d of ['compact', 'regular', 'comfortable'] as const) { o[`density_${d}`] = { menu: await density(p, d), wo1Pill: (await D(p, `__D.pill(__D.cell(${J(w1.id)}, 'Status'))`))?.pill?.box, visiblePillHeights: await D(p, '__D.pills()'), picture: await pic(p, `C590115-${d}-tech`) }; }
  await density(p, 'regular'); await display(p, 'List'); await search(p, c.name);
  { const pl = await D(p, `__D.pill(__D.cell(${J(w1.number)}, 'Status'))`); o.s13_list = { pill: pl, picture: await clip(p, 'C590115-s13-list-pill', pl?.pill?.box ?? null, 30) }; }
  await search(p, '');
});

await run('C590116', async (o) => { // six-dot grip on rows and group headers; not for a view-only user
  const A = await tech('DC07', 'Hana Grip'); const c = await cust('ZZAUTOTEST DC07 Grip');
  const w1 = await mkWO(c, { lead: A.staff }), w2 = await mkWO(c, { lead: A.staff }), w3 = await mkWO(c, { status: 'estimate' }); o.wos = [w1, w2, w3].map(brief);
  o.prep = await prep([A.staff], 'Tech View');
  o.s2_groupHeaders = await D(p, `__D.qa('[data-test-id^="tech_view_group_"]').filter(function (e) { return /^tech_view_group_([0-9a-f-]{36}|unassigned)$/.test(e.getAttribute('data-test-id')); }).slice(0, 6).map(function (tr) { var g = tr.querySelector('[data-test-id^="tech_view_group_drag_handle_"]'); var n = tr.querySelector('[data-test-id^="tech_view_group_name_"]'); return { group: n ? n.textContent.trim() : tr.getAttribute('data-test-id'), grip: g ? __D.desc(g, true) : null, gripLeftOfRow: g ? Math.round(g.getBoundingClientRect().left - tr.getBoundingClientRect().left) : null, firstParts: __D.parts(tr, 3) }; })`);
  o.s2_pic = await clip(p, 'C590116-s2-group-headers', await D(p, `__D.box(__D.grp('unassigned'))`), 8); await pic(p, 'C590116-s2-tech');
  o.s3_rows = { wo1: await D(p, `__D.rowGrip(${J(w1.id)})`), wo2: await D(p, `__D.rowGrip(${J(w2.id)})`), sample: await D(p, `__D.qa('[data-test-id^="tech_view_row_"]').slice(0, 6).map(function (tr) { return __D.rowGrip(tr.getAttribute('data-test-id').replace('tech_view_row_', '')); })`) };
  o.find3 = await rowOn(p, w3.id, c.name, 'unassigned'); o.s3_wo3 = await D(p, `__D.rowGrip(${J(w3.id)})`); o.s3_pic = await pic(p, 'C590116-s3-unassigned-row');
  if (o.find3.usedSearch) await search(p, '');
  await findRow(p, w1.id, A.staff).catch(() => {}); await away();
  const before = await D(p, `__D.rowGrip(${J(w1.id)})`); await hoverSel(p, `[data-test-id="tech_view_row_${w1.id}"]`);
  o.s4_hover = { before, after: await D(p, `__D.rowGrip(${J(w1.id)})`), picture: await clip(p, 'C590116-s4-row-hover', await D(p, `__D.box(__D.rowEl(${J(w1.id)}))`), 40) };
  await away();
  const cb = await D(p, `__D.box(__D.cell(${J(w1.id)}, 'Customer'))`), r2 = await D(p, `__D.box(__D.rowEl(${J(w2.id)}))`);
  const order = async () => (await groups(p)).find((g) => g.id === A.staff)?.rows.map((n) => n === w1.number ? 'WO-1' : n === w2.number ? 'WO-2' : n);
  o.s5_orderBefore = await order();
  if (cb && r2) { o.s5_during = await dragHold(p, { x: cb.x + cb.w / 2, y: cb.y + cb.h / 2 }, { x: cb.x + cb.w / 2, y: r2.b + 6 }, 'C590116-s5-dragging'); o.s5_toasts = await D(p, '__D.notes()'); }
  else o.s5_during = `customer cell ${!!cb}, WO-2 row ${!!r2}`;
  o.s5_orderAfter = await order(); await pic(p, 'C590116-s5-after-drop');
  await findRow(p, w1.id, A.staff).catch(() => {}); const url0 = p.url(); const cb2 = await D(p, `__D.box(__D.cell(${J(w1.id)}, 'Customer'))`);
  if (cb2) { await p.mouse.click(cb2.x + cb2.w / 2, cb2.y + cb2.h / 2); await W(3500); }
  o.s6_click = { before: url0.replace(APP, ''), after: p.url().replace(APP, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>'), orderAfter: p.url() === url0 ? await order() : 'page changed', picture: await pic(p, 'C590116-s6-after-click') };
  // steps 7–9 as User-B in User-B's own window (the shared session is never signed out, L0342)
  if (!VIEW_ROLE) { o.userB = 'no "ZZAUTOTEST WO View Only" role in this organisation'; return; }
  const vb = (await person(a, 'ZZAUTOTEST DC07', 'Viewer', { role: VIEW_ROLE, email: `zz.wob.dc07.viewer${MAIL}`, clockable: false })).row;
  if (!vb) { o.userB = 'User-B not made'; return; }
  o.userB = { role: vb.role_label };
  const v = await viewAs(browser, p, a, vb.id, RUN.me?.id ?? '', RUN.toRunner); const pg = v.page; registerShotPage(pg); pg.setDefaultTimeout(15_000);
  try {
    o.userB.perms = v.perms; o.userB.prep = await prep([A.staff], 'Tech View', 1440, pg, api(pg)); await findRow(pg, w1.id, A.staff).catch(() => {});
    o.s9_rows = { wo1: await D(pg, `__D.rowGrip(${J(w1.id)})`), wo2: await D(pg, `__D.rowGrip(${J(w2.id)})`), sample: await D(pg, `__D.qa('[data-test-id^="tech_view_row_"]').slice(0, 5).map(function (tr) { return __D.rowGrip(tr.getAttribute('data-test-id').replace('tech_view_row_', '')); })`) };
    o.s9_groupHeadersAlsoRecorded = await D(pg, `__D.qa('[data-test-id^="tech_view_group_drag_handle_"]').length`);
    o.s9_pic = await pic(pg, 'C590116-s9-user-b-tech'); await pg.screenshot({ path: path.join(EV, 'C590116-end.png') }).catch(() => {});
  } finally { registerShotPage(p); await v.close(); }
});

await run('C590117', async (o) => { // Tech View group header pieces
  const A = await tech('DC08', 'Ines Header', true), B = await tech('DC08', 'Jon Header'); o.photoLog = A.log.filter((x) => /photo/.test(x));
  const c = await cust('ZZAUTOTEST DC08 Group Header');
  o.wos = [await mkWO(c, { lead: A.staff }), await mkWO(c, { lead: B.staff }), await mkWO(c, { status: 'estimate' })].map(brief);
  o.prep = await prep([A.staff, B.staff], 'Tech View');
  o.s2_unassigned = await D(p, `__D.groupHdr('unassigned')`); o.s2_pic = await clip(p, 'C590117-s2-unassigned-header', o.s2_unassigned?.box ?? null, 8);
  // 16 Oct 2026: on 15 Oct the technician headers were never drawn (they sit after ~3,450 Unassigned rows), so steps 3-10 read nothing.
  // Close Unassigned (step 2 is already read) and bring the pinned technicians' headers into the window.
  o.unassigned = await collapseUn(p); await centre(p, `[data-test-id="tech_view_group_${B.staff}"]`);
  o.headersDrawn = { A: await p.locator(`[data-test-id="tech_view_group_${A.staff}"]`).count(), B: await p.locator(`[data-test-id="tech_view_group_${B.staff}"]`).count() };
  o.s3_bothHeadersPic = await pic(p, 'C590117-s3-tech-headers');
  o.s3_techB = await D(p, `__D.groupHdr(${J(B.staff)})`); o.s3_pic = await clip(p, 'C590117-s3-techB-header', o.s3_techB?.box ?? null, 8);
  o.s4_techA = await D(p, `__D.groupHdr(${J(A.staff)})`); o.s4_pic = await clip(p, 'C590117-s4-techA-header', o.s4_techA?.box ?? null, 8);
  o.s5_countHover = await tipFor(p, `[data-test-id="tech_view_group_count_${A.staff}"]`, 'C590117-s5-count-hover', '__D.box(__D.headRow())');
  const bav = (o.s3_techB?.avatars ?? [])[0]; await away();
  if (bav) { await hoverBox(p, bav.box); const tp = await D(p, '__D.tips()'); o.s6_avatarHover = { tooltips: tp, place: rel(tp?.[0]?.box ?? null, bav.box), picture: await pic(p, 'C590117-s6-avatar-hover') }; } else o.s6_avatarHover = 'no avatar found in the header';
  await away();
  await p.locator(`[data-test-id="button_tech_view_group_toggle_${A.staff}"]`).click(); await W(1500); await away();
  o.s7_collapsed = { hdr: await D(p, `__D.groupHdr(${J(A.staff)})`), picture: await clip(p, 'C590117-s7-collapsed', await D(p, `__D.box(__D.grp(${J(A.staff)}))`), 30) };
  await p.locator(`[data-test-id="button_tech_view_group_toggle_${A.staff}"]`).click(); await W(1500); await away();
  o.s8_open = { collapsed: (await D(p, `__D.groupHdr(${J(A.staff)})`))?.collapsed, toggle: (await D(p, `__D.groupHdr(${J(A.staff)})`))?.toggle, picture: await clip(p, 'C590117-s8-open', await D(p, `__D.box(__D.grp(${J(A.staff)}))`), 30) };
  const sizes = async () => { const h: any = await D(p, `__D.groupHdr(${J(A.staff)})`); const hb: any = await D(p, `__D.groupHdr(${J(B.staff)})`); return { techA: { h: h?.box?.h, avatar: h?.avatars?.[0]?.box, name: h?.name?.st }, techB: { h: hb?.box?.h, avatar: hb?.avatars?.[0]?.box, name: hb?.name?.st, avatarText: hb?.avatars?.[0] } }; };
  o.regular = await sizes();
  for (const d of ['compact', 'comfortable'] as const) { o[`s${d === 'compact' ? 9 : 10}_${d}`] = { menu: await density(p, d), ...(await sizes()), picture: await clip(p, `C590117-${d}-headers`, await D(p, `__D.box(__D.grp(${J(A.staff)}))`), 60) }; }
  await density(p, 'regular');
});

await run('C590118', async (o) => { // Board View full width, columns as cards
  const A = await tech('DC09', 'Kai Board'); const c = await cust('ZZAUTOTEST DC09 Board Frame'); o.wo1 = brief(await mkWO(c, { lead: A.staff }));
  o.prep = await prep([A.staff], 'Board View');
  o.s2_s3_1440 = { board: await D(p, '__D.board()'), techA: await D(p, `(function () { var c = __D.colEl(${J(A.staff)}); return c ? { box: __D.box(c), st: __D.st(c, true) } : null; })()`), picture: await pic(p, 'C590118-s2-board-1440') };
  const ub0 = await D(p, `__D.box(__D.colEl('unassigned'))`), tb0 = await D(p, `__D.box(__D.colEl(${J(A.staff)}))`);
  await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); if (h) h.scrollLeft = h.scrollWidth; })()`); await W(1500);
  o.s4_farRight = { unassignedBefore: ub0, unassignedAfter: await D(p, `__D.box(__D.colEl('unassigned'))`), unassignedPosition: await D(p, `(function () { var c = __D.colEl('unassigned'); return c ? { position: getComputedStyle(c).position, left: getComputedStyle(c).left, z: getComputedStyle(c).zIndex } : null; })()`), techABefore: tb0, techAAfter: await D(p, `__D.box(__D.colEl(${J(A.staff)}))`), scroller: (await D(p, '__D.board()'))?.scroller, picture: await pic(p, 'C590118-s4-far-right') };
  await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); if (h) h.scrollLeft = 0; })()`);
  await p.setViewportSize({ width: 1536, height: 900 }); await W(1500);
  o.s5_1536 = { board: await D(p, '__D.board()'), picture: await pic(p, 'C590118-s5-board-1536') };
});

await run('C590119', async (o) => { // Board View column header pieces and pins
  const A = await tech('DC10', 'Lea Pin', true), B = await tech('DC10', 'Max Pin'), C = await tech('DC10', 'Nia Pin'), Dd = await tech('DC10', 'Oli Pin'); o.photoLog = A.log.filter((x) => /photo/.test(x));
  const c = await cust('ZZAUTOTEST DC10 Column Header');
  o.wos = [await mkWO(c, { lead: A.staff }), await mkWO(c, { lead: B.staff }), await mkWO(c, { status: 'estimate' })].map(brief);
  o.prep = await prep([], 'Board View');
  o.s2_unassigned = await D(p, `__D.colHdr('unassigned')`); o.s2_pic = await clip(p, 'C590119-s2-unassigned-header', o.s2_unassigned?.box ?? null, 8);
  o.s3_reached = await toColumn(p, B.staff); o.s3_techB = await D(p, `__D.colHdr(${J(B.staff)})`); o.s3_pic = await clip(p, 'C590119-s3-techB-header', o.s3_techB?.box ?? null, 8);
  await toColumn(p, A.staff); o.s4_techA = await D(p, `__D.colHdr(${J(A.staff)})`); o.s4_pic = await clip(p, 'C590119-s4-techA-header', o.s4_techA?.box ?? null, 8);
  const pinSel = (id: string) => `[data-test-id="button_board_pin_${id}"], [data-test-id="button_board_column_pin_${id}"]`;
  const pinClick = async (id: string) => { await toColumn(p, id); await p.locator(pinSel(id)).first().click(); await W(1800); await away(); };
  await pinClick(B.staff); o.s6_techBPinned = { pin: (await D(p, `__D.colHdr(${J(B.staff)})`))?.pin, picture: await clip(p, 'C590119-s6-techB-pinned', await D(p, `__D.box(__D.q('[data-test-id="board_column_header_${B.staff}"]'))`), 8) };
  await pinClick(A.staff); await pinClick(C.staff);
  await toColumn(p, Dd.staff); o.s9_pinHover = await tipFor(p, pinSel(Dd.staff), 'C590119-s9-pin-hover');
  o.s9_unpinnedPins = await D(p, `__D.qa('[data-test-id^="button_board_pin_"], [data-test-id^="button_board_column_pin_"]').filter(function (b) { return b.getAttribute('aria-pressed') !== 'true'; }).slice(0, 4).map(function (b) { return { tid: b.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>'), disabled: b.disabled || b.getAttribute('aria-disabled') === 'true', opacity: getComputedStyle(b).opacity, icon: __D.icons(b)[0] || null, color: getComputedStyle(b).color }; })`);
  await away(); for (const x of [B, A, C]) await pinClick(x.staff);
  o.s10_after = {}; for (const [k, x] of Object.entries({ A, B, C, D: Dd })) { await toColumn(p, x.staff); o.s10_after[k] = (await D(p, `__D.colHdr(${J(x.staff)})`))?.pin; }
  o.s10_pic = await pic(p, 'C590119-s10-unpinned');
});

await run('C590120', async (o) => { // Board View card layout and text sizes at each density
  // 15 Oct 2026 (wave-design3, eighth pass): the card sat below the window (Pia's column still held three older cards, S2-35993,
  // S2-35994, S2-36129), so no card was photographed. Run-numbered technicians now hold ONLY this test's two work orders, and every card
  // picture first scrolls the card to the middle of the window and records whether it is fully on screen.
  const A = await tech(`DC11-${RUNNO}`, 'Pia Card'), B = await tech(`DC11-${RUNNO}`, 'Quinn Card'); const c = await cust('ZZAUTOTEST DC11 Board Card', 'TRK-118');
  const w1 = await mkWO(c, { lead: A.staff, line: true, lineTech: B.staff }), w2 = await mkWO(c, { status: 'invoiced', lead: A.staff }); o.wo1 = brief(w1); o.wo2 = brief(w2);
  // 15 Oct 2026 (redo): the asset had a unit only (no year / make / model), so the "unit · asset" line could not be judged. The work orders
  // are made first, THEN the asset is reshaped (playbook §C: create ignores make/model; a work order cannot be made on a reshaped asset):
  // POST /api/vehicles/change with year 2022 and the make/model ids borrowed from an existing Freightliner M2 (else any vehicle that has
  // both); the asset is read back. If the card still does not show them, the reading says so.
  { const nm = (x: any) => typeof x === 'string' ? x : x?.name ?? ''; let mm: any = null;
    for (const q of ['M2', 'Freightliner', '']) { for (let pgN = 1; pgN <= (q ? 2 : 4) && !mm; pgN++) { const r = await a.get(`/api/vehicles?pagination[rowsPerPage]=200&pagination[page]=${pgN}${q ? '&search=' + encodeURIComponent(q) : ''}`); const rows: any[] = r.body?.data?.collection ?? r.body?.data?.vehicles ?? r.body?.data ?? []; if (!Array.isArray(rows) || !rows.length) break;
        const hit = rows.find((v) => /freightliner/i.test(nm(v.vehicle_make)) && /^m2/i.test(nm(v.vehicle_model)) && v.vehicle_maker_id && v.vehicle_model_id) ?? (q === '' ? rows.find((v) => v.vehicle_maker_id && v.vehicle_model_id) : null);
        if (hit) mm = { maker: hit.vehicle_maker_id, model: hit.vehicle_model_id, from: `${nm(hit.vehicle_make)} ${nm(hit.vehicle_model)}` }; } if (mm) break; }
    // 15 Oct 2026 (wave 24, sixth pass): the change was refused "Cannot remove VIN form vehicle, update to valid one" (playbook: the
    // change must always carry a VIN). Send a VIN with the year and make/model, and read the asset back BY THAT VIN (unique), not by
    // the unit "TRK-118" that every earlier run's asset shares.
    const vin = `ZZDC11${RUNNO}${Date.now() % 1000000}`.replace(/[^A-Z0-9]/gi, '').slice(0, 17).toUpperCase(); o.assetVin = vin;
    o.assetShape = { borrowed: mm?.from ?? 'no vehicle with a make and model found', save: say(await a.post('/api/vehicles/change', { vehicle_id: c.vehicle_id, company_id: c.company_id, customer_id: c.contact_id, unit: 'TRK-118', year: 2022, vehicle_maker_id: mm?.maker ?? null, vehicle_model_id: mm?.model ?? null, vin })) };
    const vfind = async (q: string, n: number) => ((await a.get(`/api/vehicles?pagination[rowsPerPage]=${n}&search=${encodeURIComponent(q)}`)).body?.data?.collection ?? []).find((v: any) => v.id === c.vehicle_id || v.vehicle_id === c.vehicle_id);
    const vv = (await vfind(vin, 50)) ?? (await vfind('TRK-118', 200));
    o.assetReadBack = vv ? `${vv.unit ?? ''} · ${vv.year ?? ''} ${nm(vv.vehicle_make)} ${nm(vv.vehicle_model)}`.trim() : 'not found in the vehicle list by unit'; }
  o.prep = await prep([A.staff], 'Board View'); o.fields = await lineTechsOn();
  await toColumn(p, A.staff);
  const cardPic = async (id: string, name: string) => { await p.evaluate(`document.querySelector('[data-test-id="board_card_${id}"]')?.scrollIntoView({ block: 'center', inline: 'center' })`).catch(() => {}); await W(700);
    const b = await D(p, `__D.box(__D.q('[data-test-id="board_card_${id}"]'))`); const vp = p.viewportSize(); (o.cardOnScreen ??= {})[name] = !!(b && vp && b.y >= 0 && b.x >= 0 && b.y + b.h <= vp.height && b.x + b.w <= vp.width);
    return clip(p, name, b, 12); };
  /** the case's four texts, measured one by one: number, customer name, the unit · asset line, total price (size / weight / colour / box) */
  const sizes = async () => D(p, `(function () { var c = __D.q('[data-test-id="board_card_${w1.id}"]'); if (!c) return null; var pick = function (sel) { var e = c.querySelector(sel); if (!e) return null; var s = getComputedStyle(e); return { text: e.innerText.replace(/\\s+/g, ' ').trim().slice(0, 60), fontSize: s.fontSize, fontWeight: s.fontWeight, color: s.color, box: __D.box(e) }; };
      var leaf = function (re) { var all = __D.parts(c, 60).filter(function (x) { return x.kind === 'text' && re.test(x.text); }); return all[0] || null; };
      return { number: pick('[data-test-id="board_card_number"]'), customerName: leaf(/^ZZAUTOTEST DC11 Board Card/), unitAssetLine: pick('[data-test-id="board_card_unit"]') || leaf(/TRK-118/), totalPrice: leaf(/^\\$[0-9]/), cardPadding: getComputedStyle(c).padding, cardHeight: __D.box(c).h, fieldsShown: __D.qa('[data-test-id^="board_card_field_"]', c).map(function (e) { return e.getAttribute('data-test-id').replace('board_card_field_', ''); }) }; })()`);
  o.s2_s3_regular = { card: await D(p, `__D.card(${J(w1.id)})`), sizes: await sizes(), picture: await cardPic(w1.id, 'C590120-s2-card-regular') }; await pic(p, 'C590120-s2-board');
  o.s4_wo2 = { number: await D(p, `(function () { var c = __D.q('[data-test-id="board_card_${w2.id}"]'); var n = c && c.querySelector('[data-test-id="board_card_number"]'); return n ? { number: __D.desc(n), rowParts: __D.parts(n.parentElement, 8) } : null; })()`), picture: await cardPic(w2.id, 'C590120-s4-wo2-card') };
  for (const d of ['compact', 'comfortable'] as const) { o[`s${d === 'compact' ? 5 : 6}_${d}`] = { menu: await density(p, d), card: await D(p, `__D.card(${J(w1.id)})`), sizes: await sizes(), picture: await cardPic(w1.id, `C590120-${d}-card`) }; }
  await density(p, 'regular'); o.backAtRegular = await sizes();
});

await run('C590121', async (o) => { // More actions button and menu
  const A = await tech('DC12', 'Rae Menu'); const c = await cust('ZZAUTOTEST DC12 More Actions');
  const w1 = await mkWO(c, { lead: A.staff }), w2 = await mkWO(c, { status: 'invoiced', lead: A.staff }); o.wo1 = brief(w1); o.wo2 = brief(w2);
  o.prep = await prep([A.staff], 'Board View'); await toColumn(p, A.staff); await away();
  const card = `[data-test-id="board_card_${w1.id}"]`;
  o.s2_noHover = { ...(await D(p, `__D.more(__D.q(${J(card)}))`)), picture: await clip(p, 'C590121-s2-card', await D(p, `__D.box(__D.q(${J(card)}))`), 12) };
  await hoverSel(p, card); o.s3_hover = { ...(await D(p, `__D.more(__D.q(${J(card)}))`)), picture: await clip(p, 'C590121-s3-card-hover', await D(p, `__D.box(__D.q(${J(card)}))`), 12) };
  const btn = p.locator(card).locator('[data-test-id="button_work_order_more_actions"]').first();
  if (await btn.count()) { const bb = await D(p, `__D.box(__D.q('[data-test-id="button_work_order_more_actions"]', __D.q(${J(card)})))`); await btn.click(); await W(900); const m = await D(p, '__D.menu()'); o.s4_menu = { button: bb, menu: m, rightEdgeDx: m?.box && bb ? Math.round((m.box.r - bb.r) * 10) / 10 : null, belowButton: m?.box && bb ? m.box.y >= bb.b - 1 : null, picture: await pic(p, 'C590121-s4-card-menu') }; }
  else o.s4_menu = 'no More actions button on the hovered card';
  await p.keyboard.press('Escape'); await W(600); await away();
  await display(p, 'Tech View'); await rowOn(p, w1.id, c.name, A.staff); await away();
  const rsel = `[data-test-id="tech_view_row_${w1.id}"]`; const before = await D(p, `__D.more(__D.q(${J(rsel)}))`);
  await hoverSel(p, rsel); o.s7_rowHover = { before: { bg: before?.host?.st?.backgroundColor, button: before?.button }, after: await D(p, `__D.more(__D.q(${J(rsel)}))`), picture: await clip(p, 'C590121-s7-row-hover', await D(p, `__D.box(__D.q(${J(rsel)}))`), 12) };
  const rb = p.locator(rsel).locator('[data-test-id="button_work_order_more_actions"]').first();
  if (await rb.count()) { const bb = await D(p, `__D.box(__D.q('[data-test-id="button_work_order_more_actions"]', __D.q(${J(rsel)})))`); await rb.click(); await W(900); const m = await D(p, '__D.menu()'); o.s8_menu = { button: bb, menu: m, rightEdgeDx: m?.box && bb ? Math.round((m.box.r - bb.r) * 10) / 10 : null, belowButton: m?.box && bb ? m.box.y >= bb.b - 1 : null, picture: await pic(p, 'C590121-s8-row-menu') }; }
  await p.keyboard.press('Escape'); await W(600); await away();
  await rowOn(p, w2.id, c.name, A.staff); const r2 = `[data-test-id="tech_view_row_${w2.id}"]`; await hoverSel(p, r2);
  const rb2 = p.locator(r2).locator('[data-test-id="button_work_order_more_actions"]').first();
  if (await rb2.count()) { await rb2.click(); await W(900); o.s10_menu = { menu: await D(p, '__D.menu()'), picture: await pic(p, 'C590121-s10-locked-menu') };
    const item = p.locator('.q-menu .q-item').filter({ hasText: /Reassign lead technician/i }).first();
    if (await item.count()) { const ib = await item.boundingBox(); if (ib) { await p.mouse.move(ib.x + ib.width / 2, ib.y + ib.height / 2, { steps: 6 }); await W(1400); } o.s11_itemHover = { item: await D(p, `__D.desc(__D.qa('.q-menu .q-item').filter(function (e) { return /Reassign lead technician/i.test(e.innerText); })[0], true)`), tooltips: await D(p, '__D.tips()'), picture: await pic(p, 'C590121-s11-locked-item-hover') }; }
    else o.s11_itemHover = 'no "Reassign lead technician" item in the menu'; }
  else o.s10_menu = 'no More actions button on WO-2 row';
  await p.keyboard.press('Escape'); await away();
});

await run('C590122', async (o) => { // empty group, empty column, no-results pages
  const A = await tech('DC13', 'Sam Idle'); o.techLeads = (await workOrders(a, 'ZZAUTOTEST DC13 Sam')).length;
  o.prep = await prep([A.staff], 'Tech View');
  // 15 Oct 2026 (redo): Sam's empty group was not drawn — it sits after the ~3,450 rows of the open Unassigned group. Close Unassigned, then
  // bring Sam's group header (pinned, so right after Unassigned) to the middle of the window; whether he is offered as a technician is read
  o.unassigned = await collapseUn(p); o.samOffered = ((await a.get('/api/work-orders/lead-technician-candidates')).body?.data?.technicians ?? []).some((x: any) => x.staffId === A.staff);
  await centre(p, `[data-test-id="tech_view_group_${A.staff}"]`); o.samGroupDrawn = await p.locator(`[data-test-id="tech_view_group_${A.staff}"]`).count();
  o.s2_group = { hdr: await D(p, `__D.groupHdr(${J(A.staff)})`), empty: await D(p, `(function () { var e = __D.q('[data-test-id="tech_view_group_empty_${A.staff}"]'); if (!e) return null; var t = e.closest('table') || document.body; var tb = t.getBoundingClientRect(), eb = e.getBoundingClientRect(); var tx = __D.parts(e, 6).filter(function (x) { return x.kind === 'text'; })[0]; return { d: __D.desc(e, true), parts: __D.parts(e, 6), tableMid: Math.round(tb.left + tb.width / 2), emptyMid: Math.round(eb.left + eb.width / 2), visibleMid: Math.round((Math.max(tb.left, 0) + Math.min(tb.right, innerWidth)) / 2), textMid: tx ? Math.round(tx.box.x + tx.box.w / 2) : null }; })()`) };
  o.s2_pic = await clip(p, 'C590122-s2-empty-group', await D(p, `__D.box(__D.grp(${J(A.staff)}))`), 60);
  await display(p, 'Board View'); await toColumn(p, A.staff); await away();
  o.s4_column = { hdr: (await D(p, `__D.colHdr(${J(A.staff)})`))?.parts, empty: await D(p, `(function () { var e = __D.q('[data-test-id="board_column_empty_${A.staff}"]'); return e ? { d: __D.desc(e, true), parts: __D.parts(e, 8), bgEls: __D.bgEls(e) } : null; })()`), picture: await clip(p, 'C590122-s4-empty-column', await D(p, `__D.box(__D.colEl(${J(A.staff)}))`), 8) };
  await p.locator('[data-test-id="filter_chip_status"]').first().click(); await W(1000);
  const paid = p.locator('[data-test-id="filter_option_status_paid"]').first();
  if (await paid.count()) await paid.click(); else await p.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: /^\s*Paid\s*$/ }).first().click();
  await W(1500); await p.keyboard.press('Escape').catch(() => {}); await away();
  await search(p, 'zzzz'); await away();
  const es = async (tag: string) => ({ display: await D(p, `(function () { var b = ['List', 'Tech View', 'Board View'].filter(function (l) { var e = __D.q('[aria-label="' + l + '"]'); var bt = e && (e.closest('button, .q-btn') || e); return bt && bt.getAttribute('aria-pressed') === 'true'; }); return b[0] || null; })()`), search: await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null), chips: (await D(p, '__D.chips()'))?.map((x: any) => x.text), state: await D(p, `__D.empty('No work orders match')`), picture: await pic(p, `C590122-${tag}`) });
  o.s7_board = await es('s7-board-filter-and-search');
  await display(p, 'List'); await away(); o.s8_list = await es('s8-list-filter-and-search');
  await display(p, 'Tech View'); await away(); o.s9_tech = await es('s9-tech-filter-and-search');
  const clr = p.locator('button, .q-btn').filter({ hasText: /Clear all filters/i }).first();
  o.s10_clear = (await clr.count()) ? 'Clear all filters button' : '[data-test-id="clear_filters"]';
  if (await clr.count()) await clr.click(); else await p.locator('[data-test-id="clear_filters"]').first().click().catch(() => {});
  await W(2000); o.s10_after = { search: await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null), chips: (await D(p, '__D.chips()'))?.map((x: any) => x.text) };
  await search(p, 'zzzz'); await away(); o.s12_tech = await es('s12-tech-search-only');
  await display(p, 'List'); await away(); o.s13_list = await es('s13-list-search-only');
  await search(p, '');
});

await run('C590123', async (o) => { // drop line, refused drop message, reorder line
  // 15 Oct 2026 (wave 24, sixth pass): step 7's drop 4 px below Work-order-2 landed on Uma's group header (Work-order-2 ends Tia's
  // group) and moved S2-36131 to Uma. Put S2-36131 back to the earlier Tia first and read it back; then use FRESH technicians for this
  // run (the earlier Tia still leads S2-35997/98/99 from the fifth pass), and drop on the LOWER HALF of Work-order-2's row (below).
  { const oldTia = await tech('DC14', 'Tia Drag'); const prev = (await workOrders(a, 'S2-36131'))[0];
    if (prev?.id) { o.restoreS2_36131 = { before: `${prev.techAssignedFirstName ?? ''} ${prev.techAssignedLastName ?? ''}`.trim() || 'none', save: say(await a.post('/api/work-orders/change-lead-technician', { work_order_id: prev.id, tech_assigned_id: oldTia.staff })) };
      const back = (await workOrders(a, 'S2-36131'))[0]; o.restoreS2_36131.after = `${back?.techAssignedFirstName ?? ''} ${back?.techAssignedLastName ?? ''}`.trim(); o.restoreS2_36131.ok = back?.techAssignedId === oldTia.staff || o.restoreS2_36131.after === `${oldTia.first} ${oldTia.last}`; }
    else o.restoreS2_36131 = 'S2-36131 not found by search'; }
  const A = await tech(`DC14-${RUNNO}`, 'Tia Drag'), B = await tech(`DC14-${RUNNO}`, 'Uma Drag'); const c = await cust('ZZAUTOTEST DC14 Drag Looks');
  const w1 = await mkWO(c, { lead: A.staff }), w2 = await mkWO(c, { lead: A.staff }), w3 = await mkWO(c, { status: 'estimate' }), w4 = await mkWO(c, { status: 'invoiced', lead: B.staff }); o.wos = [w1, w2, w3, w4].map(brief);
  o.prep = await prep([A.staff, B.staff], 'Board View');
  o.find3 = await findCard(p, w3.id, 'unassigned', c.name);
  const cardBox = async (id: string) => D(p, `__D.box(__D.q('[data-test-id="board_card_${id}"]'))`);
  const colPoint = async (id: string) => { const b = await D(p, `__D.box(__D.colEl(${J(id)}))`); return b ? { x: b.x + b.w / 2, y: Math.min(b.y + 140, b.b - 20) } : null; };
  { const f = await cardBox(w3.id), tgt = await colPoint(A.staff);
    if (f && tgt) { o.s2_during = await dragHold(p, { x: f.x + f.w * 0.45, y: f.y + f.h / 2 }, tgt, 'C590123-s2-drag-allowed'); o.s2_draggedCardOpacity = o.s2_during?.dragClasses; o.s3_shiftPrompt = await shiftPrompt(p, 'Keep shifts'); o.s3_where = await D(p, `__D.whereCard(${J(w3.id)})`); o.s3_toasts = await D(p, '__D.notes()'); await pic(p, 'C590123-s3-after-drop'); }
    else o.s2_during = `card ${!!f}, column ${!!tgt}`; }
  if (o.find3.usedSearch) await search(p, '');
  await toColumn(p, B.staff); await p.evaluate(`document.querySelector('[data-test-id="board_card_${w4.id}"]')?.scrollIntoView({ block: 'center', inline: 'nearest' })`).catch(() => {}); await W(600);
  { const f = await cardBox(w4.id); await toColumn(p, A.staff).catch(() => {}); const f2 = await cardBox(w4.id) ?? f; const tgt = await colPoint(A.staff);
    if (f2 && tgt) { o.s4_during = await dragHold(p, { x: f2.x + f2.w * 0.45, y: f2.y + f2.h / 2 }, tgt, 'C590123-s4-drag-refused'); o.s5_shiftPrompt = await shiftPrompt(p, 'Cancel'); o.s5_where = await D(p, `__D.whereCard(${J(w4.id)})`); o.s5_toasts = await D(p, '__D.notes()'); await pic(p, 'C590123-s5-after-refused'); }
    else o.s4_during = `WO-4 card ${!!f2} (both columns not on screen together?), column ${!!tgt}`; }
  await display(p, 'Tech View'); await away();
  const order = async () => (await groups(p)).filter((g) => [A.staff, B.staff].includes(g.id)).map((g) => `${g.name}: ${g.rows.map((n) => ({ [w1.number]: 'WO-1', [w2.number]: 'WO-2', [w3.number]: 'WO-3', [w4.number]: 'WO-4' } as any)[n] ?? n).join(',')}`);
  o.s6_find = await rowOn(p, w1.id, c.name, A.staff); o.s6_order = await order();   // 15 Oct 2026 (redo): Unassigned closed first, row centred
  { const r1 = await D(p, `__D.box(__D.rowEl(${J(w1.id)}))`), r2 = await D(p, `__D.box(__D.rowEl(${J(w2.id)}))`);
    if (r1 && r2) { o.s7_during = await dragHold(p, { x: r1.x + r1.w * 0.45, y: r1.y + r1.h / 2 }, { x: r1.x + r1.w * 0.45, y: r2.y + r2.h * 0.75 }, 'C590123-s7-row-reorder'); await shiftPrompt(p, 'Keep shifts'); o.s8_order = await order(); await pic(p, 'C590123-s8-after'); } else o.s7_during = `rows ${!!r1}/${!!r2}`; }
  { const g = await D(p, `__D.box(__D.q('[data-test-id="tech_view_group_drag_handle_${A.staff}"]'))`);
    const below = await D(p, `(function () { var trs = __D.qa('.q-virtual-scroll__content > tr'); var inB = false, last = null; for (var i = 0; i < trs.length; i++) { var t = trs[i].getAttribute('data-test-id') || ''; if (/^tech_view_group_/.test(t) && /^tech_view_group_([0-9a-f-]{36}|unassigned)$/.test(t)) { if (inB) break; inB = t === 'tech_view_group_${B.staff}'; } if (inB) last = trs[i]; } return last ? __D.box(last) : null; })()`);
    if (g && below) { o.s9_during = await dragHold(p, { x: g.x + g.w / 2, y: g.y + g.h / 2 }, { x: g.x + 40, y: below.b + 6 }, 'C590123-s9-group-reorder'); o.s10_groupOrder = (await groups(p)).slice(0, 5).map((x) => x.name); await pic(p, 'C590123-s10-after'); }
    else o.s9_during = `group grip ${!!g}, end of B's group ${!!below}`; }
});

await run('C590124', async (o) => { // hover looks: row, card, avatar name bubbles
  const A = await tech('DC15', 'Vic Hover'), B = await tech('DC15', 'Wes Hover'); const c = await cust('ZZAUTOTEST DC15 Hover Looks');
  const w1 = await mkWO(c, { lead: A.staff, line: true, lineTech: B.staff }); o.wo1 = brief(w1);
  o.prep = await prep([A.staff, B.staff], 'Board View'); o.fields = await lineTechsOn(); await display(p, 'Tech View'); await away();
  await rowOn(p, w1.id, c.name, A.staff); await away();
  const rsel = `[data-test-id="tech_view_row_${w1.id}"]`; const rb = await D(p, `__D.desc(__D.q(${J(rsel)}), true)`);
  await hoverSel(p, rsel); o.s2_row = { before: rb, after: await D(p, `__D.desc(__D.q(${J(rsel)}), true)`), firstCellBgAfter: await D(p, `getComputedStyle(__D.q(${J(rsel)}).querySelector('td')).backgroundColor`), picture: await clip(p, 'C590124-s2-row-hover', rb?.box ?? null, 30) };
  const av = (await D(p, `__D.avs(__D.cell(${J(w1.id)}, 'Assigned Techs'))`)) ?? []; o.s3_avatars = av;
  if (av[0]) { await away(); await hoverBox(p, av[0].box); const tp = await D(p, '__D.tips()'); o.s3_hover = { tooltips: tp, place: rel(tp?.[0]?.box ?? null, av[0].box), picture: await clip(p, 'C590124-s3-avatar-hover', av[0].box, 70) }; }
  await away(); await display(p, 'Board View'); await toColumn(p, A.staff); await away();
  const csel = `[data-test-id="board_card_${w1.id}"]`; const cbf = await D(p, `__D.desc(__D.q(${J(csel)}), true)`);
  await hoverSel(p, csel); o.s5_card = { before: cbf, after: await D(p, `__D.desc(__D.q(${J(csel)}), true)`), picture: await clip(p, 'C590124-s5-card-hover', cbf?.box ?? null, 20) };
  const cav = (await D(p, `__D.avs(__D.q('[data-test-id="board_card_field_line_technicians"]', __D.q(${J(csel)})) || __D.q(${J(csel)}))`)) ?? []; o.s6_avatars = cav;
  if (cav[0]) { await away(); await hoverBox(p, cav[0].box); const tp = await D(p, '__D.tips()'); o.s6_hover = { tooltips: tp, place: rel(tp?.[0]?.box ?? null, cav[0].box), picture: await clip(p, 'C590124-s6-card-avatar-hover', cav[0].box, 70) }; }
  await away();
});

await run('C590125', async (o) => { // Dark theme
  // 16 Oct 2026 (build v26.40.18-7d85b7d): the case now has an expected result (answer 29: Dark is in scope). Choose Dark from the profile
  // menu, WAIT for the menu to close, then measure: background colours of the page, table, heading row, group headers and rows (TV) and of
  // the board, columns, headers and cards (BV); every visible area with a white background; every visible text's colour against the colour
  // behind it (contrast ratio; below 3 is listed as "low"); the hovered row's colour. Then Light, and the same counts again.
  const A = await tech('DC16', 'Xia Dark'); const c = await cust('ZZAUTOTEST DC16 Dark Theme'); const w1 = await mkWO(c, { lead: A.staff }); o.wo1 = brief(w1);
  o.prep = await prep([A.staff], 'Tech View');
  const SCAN = `(function () { var vis = function (e) { var r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return false; var s = getComputedStyle(e); return s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0'; };
    var rgb = function (c) { var m = String(c).match(/rgba?\\(([^)]+)\\)/); if (!m) return null; var v = m[1].split(',').map(function (x) { return parseFloat(x); }); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
    var bgOf = function (e) { for (var a = e; a && a.nodeType === 1; a = a.parentElement) { var c = rgb(getComputedStyle(a).backgroundColor); if (c && c.a > 0.5) return c; } return { r: 255, g: 255, b: 255, a: 1 }; };
    var lum = function (c) { var f = function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
    var ratio = function (a, b) { var x = lum(a), y = lum(b); return Math.round((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) * 10) / 10; };
    var tid = function (e) { var h = e.closest('[data-test-id]'); return h ? h.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>') : String(e.className || e.tagName).slice(0, 50); };
    var main = document.querySelector('main, .q-page-container') || document.body;
    var whites = [], all = main.querySelectorAll('*');
    for (var i = 0; i < all.length; i++) { var e = all[i]; if (!vis(e)) continue; var c = rgb(getComputedStyle(e).backgroundColor); if (c && c.a > 0.5 && c.r >= 245 && c.g >= 245 && c.b >= 245) { var r = e.getBoundingClientRect(); whites.push({ where: tid(e), tag: e.tagName.toLowerCase(), bg: getComputedStyle(e).backgroundColor, w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left), y: Math.round(r.top) }); } }
    whites.sort(function (a, b) { return b.w * b.h - a.w * a.h; });
    var low = [], texts = 0;
    for (var k = 0; k < all.length; k++) { var t = all[k]; var own = ''; for (var n = 0; n < t.childNodes.length; n++) if (t.childNodes[n].nodeType === 3) own += t.childNodes[n].textContent; own = own.replace(/\\s+/g, ' ').trim(); if (!own || !vis(t)) continue; texts++;
      var fg = rgb(getComputedStyle(t).color); var bg = bgOf(t); if (!fg) continue; var cr = ratio(fg, bg); if (cr < 3) low.push({ text: own.slice(0, 30), where: tid(t), color: getComputedStyle(t).color, behind: 'rgb(' + bg.r + ', ' + bg.g + ', ' + bg.b + ')', ratio: cr }); }
    var bgs = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)).filter(vis).slice(0, 3).map(function (e) { return { where: tid(e), bg: getComputedStyle(e).backgroundColor, bgBehind: (function (c) { return 'rgb(' + c.r + ', ' + c.g + ', ' + c.b + ')'; })(bgOf(e)), color: getComputedStyle(e).color }; }); };
    return { body: getComputedStyle(document.body).backgroundColor, page: bgs('.q-page, main'), table: bgs('.q-table__container, .q-table'), headRow: bgs('thead tr, thead th'), groupHeaders: bgs('[data-test-id^="tech_view_group_"]'), rows: bgs('[data-test-id^="tech_view_row_"]'),
      board: bgs('[data-test-id="board_view_scroller"], .board-view__scroller'), columns: bgs('[data-test-id^="board_column_"]'), columnHeaders: bgs('[data-test-id^="board_column_header_"]'), cards: bgs('[data-test-id^="board_card_"]'), pills: bgs('.q-badge, .q-chip'),
      whiteAreas: whites.length, biggestWhite: whites.slice(0, 8), textsChecked: texts, lowContrast: low.length, lowContrastSample: low.slice(0, 15) }; })()`;
  const menuClosed = async () => { for (let i = 0; i < 10; i++) { const open = await p.evaluate(`[...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0 && getComputedStyle(e).opacity !== '0').length`).catch(() => 0); if (!open) return i; await p.keyboard.press('Escape').catch(() => {}); await W(500); } return 'still open'; };
  const choose = async (word: RegExp) => { await p.locator('[data-test-id="profile_menu_button"]').click(); await W(1000); const items = (await D(p, '__D.menu()'))?.items?.map((x: any) => x.text);
    const it = p.locator('.q-menu .q-item, .q-menu [role="menuitem"], .q-menu .q-btn, .q-menu .q-radio, .q-menu .q-toggle').filter({ hasText: word }).last();
    const found = await it.count(); if (found) await it.click().catch(() => {}); await W(1500); const closedAfter = await menuClosed(); await W(1500); return { items, found, closedAfter }; };
  o.s1_lightBefore = { body: (await D(p, SCAN))?.body };
  o.s2_choose = await choose(/^\s*Dark\s*$/i); o.s2_pic = await pic(p, 'C590125-s2-after-dark');
  o.s3_tech = await D(p, SCAN); o.s3_pic = await pic(p, 'C590125-s3-tech-dark');
  o.find = await rowOn(p, w1.id, c.name, A.staff); await away();
  const rsel = `[data-test-id="tech_view_row_${w1.id}"]`;
  const rowBg = () => D(p, `(function () { var r = document.querySelector(${J(rsel)}); if (!r) return null; var td = r.querySelector('td'); return { tr: getComputedStyle(r).backgroundColor, td: td ? getComputedStyle(td).backgroundColor : null, text: td ? getComputedStyle(td).color : null }; })()`);
  const rb0 = await rowBg(); await hoverSel(p, rsel); o.s4_hover = { before: rb0, after: await rowBg(), picture: await clip(p, 'C590125-s4-row-hover-dark', await D(p, `__D.box(__D.q(${J(rsel)}))`), 60) };
  await away(); if (o.find.usedSearch) await search(p, '');
  await display(p, 'Board View'); await away(); o.s6_board = await D(p, SCAN); o.s6_pic = await pic(p, 'C590125-s6-board-dark');
  o.s7_choose = await choose(/^\s*Light\s*$/i); o.s7_board = await D(p, SCAN); o.s7_pic = await pic(p, 'C590125-s7-board-light');
  await display(p, 'Tech View'); await away(); o.s7_tech = await D(p, SCAN); o.s7_techPic = await pic(p, 'C590125-s7-tech-light');
  if (!/255, 255, 255|250|248|246|245/.test(String(o.s7_tech?.body ?? ''))) o.lightNotBack = true;
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(3000);
});

await run('C590126', async (o) => { // no overlapping labels from 1024 to 1920 px
  const A = await tech('DC17', 'Maximiliana Abernathy-Kowalczyk'); const c = await cust('ZZAUTOTEST DC17 Widths'); o.wo1 = brief(await mkWO(c, { lead: A.staff }));
  o.prep = await prep([A.staff], 'Tech View');
  o.tech = {};
  for (const w of [1024, 1280, 1366, 1440, 1536, 1920]) { await p.setViewportSize({ width: w, height: 900 }); await W(1500); await away();
    o.tech[w] = { activeView: await D(p, `(function () { var e = __D.q('[aria-label="Tech View"]'); var b = e && (e.closest('button, .q-btn') || e); return b ? b.getAttribute('aria-pressed') : 'no switcher'; })()`), toolbarControls: await D(p, '__D.ctrls(__D.toolbar())'), toolbarTexts: await D(p, '__D.overOf(__D.toolbar())'), headerRow: await D(p, '__D.overOf(__D.headRow())'), table: await D(p, '__D.tScroller()'), picture: await pic(p, `C590126-tech-${w}`) }; }
  await display(p, 'Board View'); o.board = {};
  for (const w of [1920, 1536, 1440, 1280, 1024]) { await p.setViewportSize({ width: w, height: 900 }); await W(1500); await away();
    o.board[w] = { toolbarControls: await D(p, '__D.ctrls(__D.toolbar())'), toolbarTexts: await D(p, '__D.overOf(__D.toolbar())'),
      headers: await D(p, `__D.qa('[data-test-id^="board_column_header_"]').slice(0, 8).map(function (h) { var o = __D.overOf(h); return { tid: h.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>'), minGap: o.minGap, touching: o.touchingOrOverlapping, cut: o.cut }; })`),
      techA: await D(p, `(function () { var h = __D.colHdr(${J(A.staff)}); if (!h) return null; var pin = h.pin && h.pin.d && h.pin.d.box; var cnt = h.count && h.count.box; return { name: h.name, pinX: pin ? pin.x : null, countX: cnt ? cnt.x : null, nameRightToPin: h.name && pin ? Math.round((pin.x - h.name.box.r) * 10) / 10 : null, textOverlaps: h.textOverlaps }; })()`),
      board: (await D(p, '__D.board()'))?.scroller, picture: await pic(p, `C590126-board-${w}`) }; }
  await p.setViewportSize({ width: 1440, height: 900 });
});

await run('C590127', async (o) => { // Technician filter after Assigned to me
  const A = await tech('DC18', 'Yan Filter'); const c = await cust('ZZAUTOTEST DC18 Technician Filter'); o.wo1 = brief(await mkWO(c, { lead: A.staff }));
  o.prep = await prep([A.staff], 'Tech View');
  o.s2_chips = await D(p, '__D.chips()'); o.s2_department = await D(p, `__D.findText('^Department')`); o.s2_pic = await clip(p, 'C590127-s2-filter-bar', await D(p, '__D.box(__D.toolbar())'), 4);
  const chip = p.locator('[data-test-id^="filter_chip_"]').filter({ hasText: /Technician/ }).first();
  if (!(await chip.count())) { o.s3 = 'no Technician filter chip';
    // 16 Oct 2026: also read Board View's and List's filter bars (positive control: the other chips are read in the same pass)
    await display(p, 'Board View'); await away(); o.boardChips = ((await D(p, '__D.chips()')) ?? []).map((x: any) => x.text); o.boardBarPic = await clip(p, 'C590127-board-filter-bar', await D(p, '__D.box(__D.toolbar())'), 4);
    await display(p, 'List'); await away(); o.listChips = ((await D(p, '__D.chips()')) ?? []).map((x: any) => x.text); return; }
  const cb = await chip.boundingBox(); await chip.click(); await W(1200);
  const m = await D(p, '__D.menu()'); o.s4_list = { chip: cb, menuBox: m?.box, opensBelow: m?.box && cb ? m.box.y >= cb.y + cb.height - 1 : null, count: m?.items?.length, items: m?.items?.slice(0, 15), allNames: m?.items?.map((x: any) => x.text) };
  o.s4_pic = await pic(p, 'C590127-s4-technician-list');
  const it = p.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: A.name }).first();
  if (await it.count()) { await it.scrollIntoViewIfNeeded().catch(() => {}); await it.click(); await W(1500); o.s5_ticked = true; } else { o.s5_ticked = false; o.s5_note = `${A.name} not in the open list`; }
  o.s5_pic = await pic(p, 'C590127-s5-ticked'); await p.keyboard.press('Escape'); await W(800); await away();
  o.s6_chips = (await D(p, '__D.chips()'))?.map((x: any) => x.text);
  await display(p, 'Board View'); await away(); o.s7_board = { chips: await D(p, '__D.chips()'), columns: (await D(p, `__D.cols().map(function (c) { return c.getAttribute('data-test-id').replace('board_column_', ''); })`))?.map((x: string) => x === A.staff ? 'Technician-A' : x), picture: await pic(p, 'C590127-s7-board') };
  await display(p, 'List'); await away(); o.s8_list = { chips: await D(p, '__D.chips()'), picture: await pic(p, 'C590127-s8-list') };
  // put the choice back (filters are also cleared by the next case's set-up)
  await display(p, 'Tech View'); const chip2 = p.locator('[data-test-id^="filter_chip_"]').filter({ hasText: /Technician/ }).first();
  if (await chip2.count()) { await chip2.click(); await W(1000); const it2 = p.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: A.name }).first(); if (await it2.count()) { await it2.click(); await W(1200); } await p.keyboard.press('Escape').catch(() => {}); }
});

await run('C590128', async (o) => { // density sizes in Tech View
  const A = await tech('DC19', 'Zoe Density'), B = await tech('DC19', 'Abe Density'); const c = await cust('ZZAUTOTEST DC19 Density Sizes');
  const w1 = await mkWO(c, { lead: A.staff, line: true, lineTech: B.staff }); o.wo1 = brief(w1);
  o.prep = await prep([A.staff, B.staff], 'Tech View'); o.find = await rowOn(p, w1.id, c.name, A.staff);
  // 15 Oct 2026 (redo): a density change redraws the table, so the row is centred again after each one before it is read
  const read = async (d: string) => ({ menu: await density(p, d as any), centred: await centre(p, `[data-test-id="tech_view_row_${w1.id}"]`), row: await D(p, `__D.row(${J(w1.id)})`), groupHeader: await D(p, `(function () { var h = __D.groupHdr(${J(A.staff)}); return h ? { h: h.box.h, avatars: h.avatars, name: h.name && h.name.st } : null; })()`),
    assigned: await D(p, `__D.avs(__D.cell(${J(w1.id)}, 'Assigned Techs'))`), advisor: await D(p, `__D.avs(__D.cell(${J(w1.id)}, 'Service Advisor'))`), progress: await D(p, `__D.bars(__D.cell(${J(w1.id)}, 'Progress'))`),
    rowText: await D(p, `__D.parts(__D.rowEl(${J(w1.id)}), 30).filter(function (x) { return x.kind === 'text'; }).map(function (x) { return x.text + ' ' + x.fontSize + '/' + x.fontWeight; })`),
    headLabels: await D(p, `__D.qa('thead th').map(function (th) { var t = (th.innerText || '').replace(/\\s+/g, ' ').trim(); var leaf = Array.prototype.filter.call(th.querySelectorAll('*'), function (e) { return e.childElementCount === 0 && (e.textContent || '').trim() && !e.closest('.q-icon,i,svg'); })[0] || th; return t ? t + ' ' + getComputedStyle(leaf).fontSize : null; }).filter(Boolean)`), // 16 Oct: header labels judged too
    picture: await pic(p, `C590128-${d}`) });
  o.s3_compact = await read('compact'); o.s5_regular = await read('regular'); o.s7_comfortable = await read('comfortable');
  await display(p, 'Board View'); await p.locator('[data-test-id="button_density"]').first().click(); await W(900);
  o.s8_boardMenu = { menu: await D(p, '__D.menu()'), picture: await pic(p, 'C590128-s8-board-density-menu') };
  await p.keyboard.press('Escape').catch(() => {}); await density(p, 'regular');
});

await run('C590129', async (o) => { // Reassign lead technician dialog look
  const A = await tech('DC20', 'Bea Dialog', true), B = await tech('DC20', 'Cal Dialog'); o.photoLog = A.log.filter((x) => /photo/.test(x));
  const c = await cust('ZZAUTOTEST DC20 Reassign Dialog'); const w1 = await mkWO(c, { lead: A.staff }); o.wo1 = brief(w1);
  o.prep = await prep([A.staff, B.staff], 'Tech View'); o.find = await rowOn(p, w1.id, c.name, A.staff);   // 15 Oct 2026 (redo): Unassigned closed, row centred
  const rsel = `[data-test-id="tech_view_row_${w1.id}"]`; await hoverSel(p, rsel);
  await p.locator(rsel).locator('[data-test-id="button_work_order_more_actions"]').first().click(); await W(900);
  await p.locator('.q-menu .q-item').filter({ hasText: /Reassign lead technician/i }).first().click(); await W(2000);
  const mine = (dl: any) => dl ? { ...dl, rows: (dl.rows ?? []).map((r: any) => ({ ...r, who: r.tid?.endsWith(A.staff.slice(0, 8)) || r.text?.includes('Bea Dialog') ? 'Technician-A' : r.text?.includes('Cal Dialog') ? 'Technician-B' : /unassigned/i.test(r.tid ?? r.text ?? '') ? 'Unassigned' : undefined })) } : null;
  const dl = await D(p, '__D.dialog()'); o.s5_dialog = mine(dl);
  o.s5_keyRows = (o.s5_dialog?.rows ?? []).filter((r: any) => r.who); o.s5_rowCount = (o.s5_dialog?.rows ?? []).length; o.s5_pic = await pic(p, 'C590129-s5-dialog');
  const box = p.locator('[data-test-id="input_reassign_lead_search"] input, input[data-test-id="input_reassign_lead_search"], .q-dialog input').first();
  for (const typed of ['ZZA', 'Cal']) { await box.fill(''); await box.type(typed, { delay: 60 }); await W(1500); const d2 = await D(p, '__D.dialog()'); o[`s6_typed_${typed}`] = { rows: (d2?.rows ?? []).map((r: any) => r.text), picture: await pic(p, `C590129-s6-typed-${typed}`) }; }
  const cancel = p.locator('[data-test-id="button_cancel_reassign_lead_technician"]').first();
  if (await cancel.count()) await cancel.click(); else await p.locator('.q-dialog button').filter({ hasText: /^\s*Cancel\s*$/i }).first().click();
  await W(1500); o.s7_dialogAfter = (await D(p, '__D.dialog()')) ? 'still open' : 'closed';
  const w = (await workOrders(a, c.name)).find((x: any) => x.id === w1.id); o.s7_lead = w?.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName ?? ''}`.trim() : null; o.s7_pic = await pic(p, 'C590129-s7-after-cancel');
});

await run('C590130', async (o) => { // Lead technician updated message
  const A = await tech('DC21', 'Dee Toast'); const c = await cust('ZZAUTOTEST DC21 Toast'); const w1 = await mkWO(c, { status: 'estimate' }); o.wo1 = brief(w1);
  o.prep = await prep([A.staff], 'Board View'); o.find = await findCard(p, w1.id, 'unassigned', c.name);
  const f = await D(p, `__D.box(__D.q('[data-test-id="board_card_${w1.id}"]'))`), cb = await D(p, `__D.box(__D.colEl(${J(A.staff)}))`);
  if (!f || !cb) { o.s2 = `card ${!!f}, column ${!!cb}`; return; }
  await p.mouse.move(f.x + f.w * 0.45, f.y + f.h / 2); await p.mouse.down(); await p.mouse.move(f.x + f.w * 0.45, f.y + f.h / 2 + 8, { steps: 4 });
  await p.mouse.move(cb.x + cb.w / 2, Math.min(cb.y + 140, cb.b - 20), { steps: 22 }); await W(400); await p.mouse.up(); const t0 = Date.now(); await p.mouse.move(1, 1);
  o.s2_shiftPrompt = await shiftPrompt(p, 'Keep shifts');
  o.s3_message = { atMs: Date.now() - t0, notes: await D(p, '__D.notes()'), picture: await pic(p, 'C590130-s3-message') };
  const n0 = o.s3_message.notes?.[0]; if (n0?.d?.box) o.s3_clip = await clip(p, 'C590130-s3-message-close', n0.d.box, 16);
  o.s4_presence = [];
  for (const at of [3000, 6000, 10000, 12000]) { const wait = at - (Date.now() - t0); if (wait > 0) await W(wait); o.s4_presence.push({ atMs: Date.now() - t0, messages: ((await D(p, '__D.notes()')) ?? []).map((x: any) => x.d?.text) }); }
  o.s4_pic = await pic(p, 'C590130-s4-after-10s'); o.where = await D(p, `__D.whereCard(${J(w1.id)})`);
  if (o.find.usedSearch) await search(p, '');
});

await run('C598326', async (o) => { // 16 Oct 2026 NEW: List's Approved and Ready For Review pills, their widths in Tech View, height per density
  // Copied from the C590115 block. Ready For Review is reached the way the invoiced path does it: line completed, In Progress, Ready For Review.
  const A = await tech('S6', 'Pia Pills'); const c = await cust('ZZAUTOTEST S6 Pill Widths');
  const w1 = await mkWO(c, { lead: A.staff }); o.wo1 = brief(w1);
  const w2 = await mkWO(c, { lead: A.staff, line: true });
  for (const l of await linesRaw(w2.id)) { await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'Done', work_order_id: w2.id }); w2.log.push(`line complete ${say(await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, status: 'complete', workOrderId: w2.id }))}`); }
  for (const st of ['in_progress', 'ready_for_review']) w2.log.push(`${st} ${say(await a.post('/api/work-orders/change-status', { id: w2.id, work_order: w2.id, status: st }))}`);
  const w2n = (await workOrders(a, c.name)).find((x: any) => x.id === w2.id); o.wo2 = `${w2n?.number ?? '?'} ${w2n?.status ?? '?'} lead=${w2n?.techAssignedFirstName ?? '-'} ${w2.log.filter((x) => / [45]\d\d /.test(x)).join('; ')}`;
  const both = async (k1: string, k2: string, tag: string) => { const p1 = await D(p, `__D.pill(__D.cell(${J(k1)}, 'Status'))`), p2 = await D(p, `__D.pill(__D.cell(${J(k2)}, 'Status'))`);
    const b1 = p1?.pill?.box ?? null, b2 = p2?.pill?.box ?? null; const u = b1 && b2 ? { x: Math.min(b1.x, b2.x), y: Math.min(b1.y, b2.y), w: Math.max(b1.r, b2.r) - Math.min(b1.x, b2.x), h: Math.max(b1.b, b2.b) - Math.min(b1.y, b2.y), r: Math.max(b1.r, b2.r), b: Math.max(b1.b, b2.b) } : (b1 ?? b2);
    return { approved: { text: p1?.pill?.text ?? p1?.text, box: b1 }, readyForReview: { text: p2?.pill?.text ?? p2?.text, box: b2 }, picture: await clip(p, `C598326-${tag}`, u, 40) }; };
  o.prep = await prep([A.staff], 'List'); await search(p, c.name); await away();
  o.s3_list = await both(w1.number, w2n?.number ?? '', 's3-list-pills'); await pic(p, 'C598326-s3-list');
  await search(p, ''); await display(p, 'Tech View'); o.find1 = await rowOn(p, w1.id, c.name, A.staff); await away();
  o.s5_tech = await both(w1.id, w2.id, 's5-tech-pills'); await pic(p, 'C598326-s5-tech');
  for (const d of ['compact', 'comfortable'] as const) { o[`s${d === 'compact' ? 6 : 7}_${d}`] = { menu: await density(p, d), centred: await centre(p, `[data-test-id="tech_view_row_${w1.id}"]`), ...(await both(w1.id, w2.id, `s${d === 'compact' ? 6 : 7}-${d}-pills`)) }; }
  o.s8_regular = await density(p, 'regular'); if (o.find1.usedSearch) await search(p, '');
  await display(p, 'List'); await search(p, c.name); await away(); o.s9_list = await both(w1.number, w2n?.number ?? '', 's9-list-pills'); await search(p, '');
});

await run('C590131', async (o) => { // sticky column header and Unassigned group header
  const c = await cust('ZZAUTOTEST DC22 Sticky Headers'); o.wo1 = brief(await mkWO(c, { status: 'estimate' }));
  o.prep = await prep([], 'Tech View');
  o.unassignedOpenedCollapsed = (await D(p, `__D.groupHdr('unassigned')`))?.collapsed;
  if (o.unassignedOpenedCollapsed === 'true') { await p.locator('[data-test-id="button_tech_view_group_toggle_unassigned"]').click(); await W(1800); o.expandedByScript = true; }
  o.s1 = { thead: await D(p, '__D.box(__D.headRow())'), unassigned: await D(p, `__D.box(__D.grp('unassigned'))`), sc: await D(p, '__D.tScroller()'), unassignedCount: (await D(p, `__D.groupHdr('unassigned')`))?.count?.text };
  for (let i = 0; i < 12; i++) { await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) s.scrollTop += 250; })()`); await W(350); }
  await W(1200);
  o.s3_after = { sc: await D(p, '__D.tScroller()'), thead: await D(p, '__D.box(__D.headRow())'), theadOnTop: await D(p, `__D.onTop('thead th')`),
    unassignedHeader: await D(p, `(function () { var h = __D.groupHdr('unassigned'); var tr = __D.grp('unassigned'); return h ? { box: h.box, position: getComputedStyle(tr).position, top: getComputedStyle(tr).top, tdPosition: tr.firstElementChild ? getComputedStyle(tr.firstElementChild).position : null, count: h.count && h.count.text, toggle: h.toggle } : 'not in the page (scrolled away)'; })()`),
    toggleOnTop: await D(p, `__D.onTop('[data-test-id="button_tech_view_group_toggle_unassigned"]')`), firstRowsUnder: await D(p, `__D.qa('[data-test-id^="tech_view_row_"]').slice(0, 2).map(function (r) { return __D.box(r); })`),
    picture: await pic(p, 'C590131-s3-scrolled') };
  o.s3_clip = await clip(p, 'C590131-s3-table-top', (() => { const t: any = o.s3_after.thead; return t ? { ...t, h: t.h + 120, b: t.b + 120 } : null; })(), 4);
  // 16 Oct 2026 (new steps 4-5): keep scrolling to the END of Unassigned (~3,450 rows load in batches) until the next group's header is
  // drawn, then walk it up to the Unassigned header in small steps and record, at each stop, every group header's box and position, the
  // bottom of the column header row, and which header is on top just under the headings.
  const nextHdr = `(function () { var g = __D.qa('[data-test-id^="tech_view_group_"]').filter(function (e) { return /^tech_view_group_[0-9a-f-]{36}$/.test(e.getAttribute('data-test-id')); })[0]; return g ? g.getAttribute('data-test-id').replace('tech_view_group_', '') : null; })()`;
  let nid: string | null = null; const t0 = Date.now(); o.s4_load = [];
  for (let i = 0; i < 600 && !nid && Date.now() - t0 < 15 * 60_000; i++) {
    const sc = await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (!s) return null; s.scrollTop = s.scrollHeight; return { top: Math.round(s.scrollTop), h: s.scrollHeight }; })()`); await W(900);
    nid = await D(p, nextHdr); if (i % 20 === 0) o.s4_load.push({ i, sc, rows: await p.evaluate(`document.querySelectorAll('[data-test-id^="tech_view_row_"]').length`) }); }
  o.s4_nextGroup = nid ? { found: true, seconds: Math.round((Date.now() - t0) / 1000) } : { found: false, seconds: Math.round((Date.now() - t0) / 1000) };
  if (!nid) return;
  const hdrs = `(function () { var th = __D.box(__D.headRow()); return { theadBottom: th ? th.b : null, headers: __D.qa('[data-test-id^="tech_view_group_"]').filter(function (e) { return /^tech_view_group_([0-9a-f-]{36}|unassigned)$/.test(e.getAttribute('data-test-id')); }).map(function (e) { var n = e.querySelector('[data-test-id^="tech_view_group_name_"]'); var s = getComputedStyle(e); return { group: e.getAttribute('data-test-id') === 'tech_view_group_unassigned' ? 'Unassigned' : 'next: ' + (n ? n.textContent.trim() : '?'), box: __D.box(e), position: s.position, top: s.top, z: s.zIndex }; }),
    justUnderHeadings: th ? (function () { var es = document.elementsFromPoint(200, th.b + 6); var g = es.map(function (x) { return x.closest && x.closest('[data-test-id^="tech_view_group_"]'); }).filter(Boolean)[0]; return g ? g.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<technician>') : (es[0] ? String(es[0].className).slice(0, 40) : null); })() : null }; })()`;
  // bring the next header to ~220 px below the headings, then step down 20 px at a time across the hand-over
  await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); const g = document.querySelector('[data-test-id="tech_view_group_${nid}"]'); const th = document.querySelector('thead tr'); if (!s || !g || !th) return; s.scrollTop += g.getBoundingClientRect().top - th.getBoundingClientRect().bottom - 220; })()`); await W(1500);
  o.s4_s5_walk = []; const shotsAt = new Set([0, 9, 11, 13, 16]);
  for (let k = 0; k <= 18; k++) { const r: any = await D(p, hdrs); r.step = k; if (shotsAt.has(k)) r.picture = await pic(p, `C590131-s5-handover-${String(k).padStart(2, '0')}`); o.s4_s5_walk.push(r);
    await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) s.scrollTop += 20; })()`); await W(700); }
  await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) s.scrollTop += 300; })()`); await W(1200);
  o.s5_after = await D(p, hdrs); o.s5_afterPic = await pic(p, 'C590131-s5-after-handover');
  await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) s.scrollTop = 0; })()`); await W(800);
});

// ───────────────────────────── put everything back ─────────────────────────────
for (const ck of clocks) { try { await asTech(ck.userId, async () => { const cur = (await a.get('/api/technician-tasks/my-current-task')).body?.data; if (cur?.technician_task?.id) await a.post('/api/technician-tasks/check-out', { task_id: cur.technician_task.id }); }); } catch { /* */ } }
R.restorePref = (await a.put(PREF, { value: ORIGINAL })).status;
R.ended = new Date().toISOString(); fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
await RUN.end().catch(() => {});
await done(browser);
