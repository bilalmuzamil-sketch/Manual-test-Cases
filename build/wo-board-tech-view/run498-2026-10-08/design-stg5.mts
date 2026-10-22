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
 * 16 Oct 2026: C590112, C590114, C590117, C590119, C590120 and C590128 follow their cases as rewritten on 16 Oct (see each block's
 * "16 Oct 2026: follows the case as rewritten" note); their readings are keyed by the case's own step numbers.
 * Every saved choice is put back at the end (runner preference as it was, any clock started here stopped).
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
const OUT = path.join(EV, 'design-stg5.json');
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; p.setDefaultTimeout(15_000);
const a = api(p);
await startState(p, a, 'design-stg5');   // L0415, fix-up 2
const R: Record<string, any> = { runner: RUN.id.slice(0, 8), started: new Date().toISOString() };
const PREF = '/api/users/me/preferences/work-orders-list';
const ORIGINAL = (await a.get(PREF)).body?.data?.value ?? {};
const RUNNO = String(Date.now() % 100000);
const MAIL = '@staging.shopview.local';
const ORG = (await import('./profile.mts')).ORG;
const rolesL: any[] = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data);
const RI = await roleIds(a);
const roleId = (re: RegExp) => rolesL.find((r) => re.test(r.label ?? r.name ?? ''))?.id ?? Object.entries(RI).find(([l]) => re.test(l))?.[1];
const TECH_ROLE = roleId(/^Technician$/), ADMIN_ROLE = roleId(/^admin(istrator)?$/i); let VIEW_ROLE = roleId(/^ZZAUTOTEST WO View Only$/);   // let: C590116 may create it on production (22 Oct 2026)
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
/** 22 Oct 2026 (production C590112 step 4): one "scrollLeft = scrollWidth" stopped at 326 px of 443 because the table kept widening
 *  (1766 -> 1883 px) while rows re-rendered after the scroll, so "Total price" was cut by the window edge. Scroll to the end, wait,
 *  re-read scrollWidth and the scroll position, and repeat until the width has stopped growing (same width on two reads in a row) and
 *  the scroll sits at its true end. Pure robustness: on a table that is already settled it ends after two quiet reads. */
async function scrollToRightEnd(pg: Page, sel = '.q-table__middle') {
  const rd = `(() => { const s = document.querySelector(${JSON.stringify(sel)}); return s ? { scrollW: s.scrollWidth, clientW: s.clientWidth, scrollLeft: Math.round(s.scrollLeft) } : null; })()`;
  const tries: any[] = []; let quiet = 0, last: any = null;
  for (let i = 0; i < 20 && quiet < 2; i++) {
    await pg.evaluate(`(() => { const s = document.querySelector(${JSON.stringify(sel)}); if (s) s.scrollLeft = s.scrollWidth; })()`).catch(() => {});
    await W(900, pg);
    const now: any = await pg.evaluate(rd).catch(() => null); if (!now) { tries.push('no scroller'); break; }
    const atEnd = now.scrollLeft >= now.scrollW - now.clientW - 1;
    quiet = atEnd && last && last.scrollW === now.scrollW ? quiet + 1 : 0;
    tries.push(`${now.scrollLeft}/${now.scrollW - now.clientW}${atEnd ? ' end' : ''}`); last = now;
  }
  return { settled: quiet >= 2, final: last, tries };
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

await run('C590112', async (o) => { // Tech View edge to edge, double border on group headers, sticky header, sideways scroll, Status column width
  // 16 Oct 2026: follows the case as rewritten (8 steps; NEW steps 6-7: with Customer-A searched the Status column is only as wide as its
  // widest pill - Approved / Estimate - and with Customer-B, whose work order is in "Ready For Review", it is wider, about 132 px). Readings
  // are keyed by the case's step numbers. Customer-B's Ready For Review work order: one line finished, then In Progress > Ready For Review
  // behind the screen; if that status is refused, "Require Review Before Completion" is switched on (setRequireReview) for the move and put
  // back in the finally block; the status is read back either way.
  const A = await tech('DC03', 'Cara Edge'); const c = await cust('ZZAUTOTEST DC03 Edge To Edge'); const cB = await cust('ZZAUTOTEST DC03 Review', 'ZZDCR');
  const w1 = await mkWO(c, { lead: A.staff }), w2 = await mkWO(c, { status: 'estimate' }); o.wo1 = brief(w1); o.wo2 = brief(w2);
  const w3 = await mkWO(cB, { lead: A.staff, line: true }); let rr: any = null;
  try {
    const toReview = async () => { const log: string[] = [`mileage ${say(await a.post('/api/work-orders/change-mileage', { work_order_id: w3.id, mileage: '123456' }))}`];
      for (const l of await linesRaw(w3.id)) { for (const rq of (l.part_requests ?? [])) await a.post(`/api/work-orders/part/remove-request/${rq.id ?? rq.part_request_id}`, {});
        log.push(`story ${say(await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'Done', work_order_id: w3.id }))}`); log.push(`line complete ${say(await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, status: 'complete', workOrderId: w3.id }))}`); }
      for (const s of ['in_progress', 'ready_for_review']) log.push(`${s} ${say(await a.post('/api/work-orders/change-status', { id: w3.id, work_order: w3.id, status: s }))}`);
      return { log, status: (await workOrders(a, cB.name)).find((x: any) => x.id === w3.id)?.status }; };
    o.wo3 = await toReview();
    if (o.wo3.status !== 'ready_for_review') { rr = await setRequireReview(a, true); o.requireReviewOn = rr; o.wo3retry = await toReview(); }
    o.wo3.number = (await workOrders(a, cB.name)).find((x: any) => x.id === w3.id)?.number;
  } finally { if (rr && rr.before === false) o.requireReviewPutBack = await setRequireReview(a, false); }
  o.prep = await prep([A.staff], 'Tech View');
  o.start = { search: await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => '(search box closed: empty)') };
  const read = async (tag: string) => ({ frame: await D(p, '__D.frame()'), groupBorders: await D(p, '__D.groupBorders()'), picture: await pic(p, `C590112-${tag}`) });
  o.s1_edges_1440 = await read('s1-tech-1440');
  o.s2_groupSeparator = { borders: o.s1_edges_1440.groupBorders, picture: await clip(p, 'C590112-s2-group-header', await D(p, `__D.box(__D.grp(${J(A.staff)}))`), 24) };
  const before = { thead: await D(p, '__D.box(__D.headRow())'), sc: await D(p, '__D.tScroller()') };
  await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) s.scrollTop += 2100; })()`); await W(1200);
  o.s3_sticky = { before, after: { thead: await D(p, '__D.box(__D.headRow())'), theadPosition: await D(p, `(function () { var t = __D.q('thead'); var th = __D.q('thead th'); return { thead: t ? getComputedStyle(t).position : null, th: th ? getComputedStyle(th).position : null, top: th ? getComputedStyle(th).top : null }; })()`), sc: await D(p, '__D.tScroller()') }, picture: await pic(p, 'C590112-s3-scrolled-down') };
  await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) { s.scrollTop = 0; s.scrollLeft = s.scrollWidth; } })()`); await W(1200);
  const toEnd = await scrollToRightEnd(p);   // 22 Oct 2026: wait for the table to stop widening, then sit at the TRUE right end (read back)
  console.log(t(), 'C590112 step 4 scroll to the right end', JSON.stringify(toEnd));
  o.s4_sideways = { scrollToEnd: toEnd, sc: await D(p, '__D.tScroller()'), align: await D(p, '__D.align()'), heads: (await D(p, '__D.heads()'))?.cells?.map((x: any) => ({ label: x.label, w: x.box?.w, labelW: x.labelBox?.w })), overlaps: await D(p, '__D.overOf(__D.headRow())'), picture: await pic(p, 'C590112-s4-scrolled-sideways') };
  await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) s.scrollLeft = 0; })()`);
  await p.setViewportSize({ width: 1536, height: 900 }); await W(1500);
  o.s5_1536 = { ...(await read('s5-tech-1536')), align: await D(p, '__D.align()') };
  /** the Status column against the pills in it: the header cell's width, each listed work order's cell and pill width, and the empty space
   *  after the pill (cell width - padding - pill width) */
  const statusCol = async (ids: Record<string, string>) => D(p, `(function () { var h = __D.heads(); var th = h && h.cells.filter(function (x) { return x.label === 'Status'; })[0]; var ids = ${J(ids)}; var out = {};
      Object.keys(ids).forEach(function (k) { var td = __D.cell(ids[k], 'Status'); if (!td) { out[k] = 'row not drawn'; return; } var pl = __D.pill(td); var s = getComputedStyle(td); var pb = pl && pl.pill ? pl.pill.box : null; var tb = __D.box(td);
        out[k] = { pillText: pl && pl.pill ? pl.pill.text : null, pillW: pb ? pb.w : null, cellW: tb.w, padL: s.paddingLeft, padR: s.paddingRight, spaceAfterPill: pb ? Math.round((tb.r - parseFloat(s.paddingRight) - pb.r) * 10) / 10 : null }; });
      return { statusHeaderW: th ? th.box.w : 'no Status column', statusHeaderLabelW: th && th.labelBox ? th.labelBox.w : null, rows: out }; })()`);
  // step 6: Customer-A in Search (the box's value read back after typing, L0387)
  await search(p, c.name); o.s6_customerA = { searchHolds: await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null), statusColumn: await statusCol({ 'Work-order-1 (Approved)': w1.id, 'Work-order-2 (Estimate)': w2.id }) };
  o.s6_customerA.picture = await pic(p, 'C590112-s6-status-column-customer-a');
  // step 7: replace the search text with Customer-B (Ready For Review): expected about 132 px
  await search(p, cB.name); o.s7_customerB = { searchHolds: await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null), statusColumn: await statusCol({ 'Work-order-3 (Ready For Review)': w3.id }), designWidthPx: 132 };
  o.s7_customerB.picture = await pic(p, 'C590112-s7-status-column-customer-b');
  // step 8: List
  await display(p, 'List'); await away(); o.s8_list = await read('s8-list-1536');
  await search(p, ''); await p.setViewportSize({ width: 1440, height: 900 });
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
    // FIX-UP 2 (17 Oct 2026): on 16 Oct no switch was found (only [data-test-id^="toggle_column_"] was looked for; Tech View's are
    // "toggle_tech_view_column_…" and some carry no test id), so steps 5-7 were skipped. Every switch of the OPEN menu is now taken by any
    // "toggle_" test id OR role=switch / .q-toggle / role=checkbox, named by its aria-label or its row's text, marked, and clicked by the
    // mark; each is read back (aria-checked) after the click. Positive control: the menu's own item count (s4_menuBefore) beside it.
    const toggles = await pg.evaluate(`(() => { document.querySelectorAll('[data-zz-tg]').forEach(e => e.removeAttribute('data-zz-tg'));
      const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); if (!m) return null;
      const els = [...new Set([...m.querySelectorAll('[data-test-id^="toggle_"], [role=switch], .q-toggle, [role=checkbox]')].map(e => e.closest('[data-test-id^="toggle_"]') || e.closest('.q-toggle') || e))];
      return els.map((e, i) => { e.setAttribute('data-zz-tg', String(i)); const sw = e.matches('[role=switch],[role=checkbox]') ? e : e.querySelector('[role=switch],[role=checkbox],[aria-checked]'); const row = e.closest('.q-item') || e;
        return { i, tid: e.getAttribute('data-test-id'), on: sw ? sw.getAttribute('aria-checked') : (e.querySelector('.q-toggle__inner--truthy') ? 'true' : 'false'), text: (e.getAttribute('aria-label') || (sw && sw.getAttribute('aria-label')) || row.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 40) }; }); })()`).catch(() => null) as any[] | null;
    o.s4_toggles = toggles; o.s4_turnedOn = []; o.s4_offers = { onSite: !!(toggles ?? []).find((x) => /On Site/i.test(x.text)), vin: !!(toggles ?? []).find((x) => /VIN/i.test(x.text)), lead: !!(toggles ?? []).find((x) => /Lead Tech/i.test(x.text)) };
    for (const tg of (Array.isArray(toggles) ? toggles : [])) if (tg.on !== 'true') { await pg.locator(`[data-zz-tg="${tg.i}"]`).first().click().catch(() => {}); await W(700, pg);
      const now = await pg.evaluate(`(() => { const e = document.querySelector('[data-zz-tg="${tg.i}"]'); if (!e) return null; const sw = e.matches('[role=switch],[role=checkbox]') ? e : e.querySelector('[role=switch],[role=checkbox],[aria-checked]'); return sw ? sw.getAttribute('aria-checked') : (e.querySelector('.q-toggle__inner--truthy') ? 'true' : 'false'); })()`).catch(() => null);
      o.s4_turnedOn.push(`${tg.text || tg.tid} -> ${now}`); }
    o.s5_pic_menu = await pic(pg, 'C590113-s5-all-on-menu');
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
  // 16 Oct 2026: follows the case as rewritten (NEW step 3: Status, Waiting On Parts and Progress sit at the LEFT of their columns - read as
  // the content's left edge against the cell's left edge and padding, and the space left over on the right; step 6 hovers ONLY the first
  // avatar in Assigned Techs and expects a name bubble ABOVE it). The old "click the row opens the work order" reading is gone (not a step
  // of the case any more). Readings: s2_number = step 1, s2_progress = step 2, s3_alignment = step 3, s2_advisor = step 4, s2_assigned =
  // step 5, s3_avatarHover = step 6, s2_waiting / s2_clockedIn / s2_total = step 7, s5_wo2Number = step 8, s5_lockHover = step 9, s6_list = step 10.
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
    o.prep = await prep([A.staff, B.staff], 'Tech View'); await search(p, c.name); o.searchHolds = await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null); // 16 Oct 2026: the case starts with Customer-A searched
    o.find1 = await rowOn(p, w1.id, c.name, A.staff);
    o.s2_row = await D(p, `__D.row(${J(w1.id)})`);
    const cl = (lab: string) => `__D.cell(${J(w1.id)}, ${J(lab)})`;
    o.s2_number = { parts: await D(p, `__D.parts(${cl('Number')}, 8)`), link: await D(p, `__D.desc(__D.q('a', ${cl('Number')}))`) };
    o.s2_progress = { bars: await D(p, `__D.bars(${cl('Progress')})`), parts: await D(p, `__D.parts(${cl('Progress')}, 6)`), picture: await clip(p, 'C590114-s2-progress-cell', await D(p, `__D.box(${cl('Progress')})`), 24) };
    o.s2_advisor = await D(p, `__D.avs(${cl('Service Advisor')})`); o.s2_assigned = await D(p, `__D.avs(${cl('Assigned Techs')})`);
    o.s2_waiting = await D(p, `__D.parts(${cl('Waiting On Parts')}, 4)`); o.s2_total = { cell: await D(p, `__D.desc(${cl('Total price')}, true)`), parts: await D(p, `__D.parts(${cl('Total price')}, 4)`), header: await D(p, `(function () { var h = __D.heads(); var c = h && h.cells.filter(function (x) { return x.label === 'Total price'; })[0]; return c || null; })()`) };
    o.s2_clockedIn = { parts: await D(p, `__D.parts(${cl('Clocked In')}, 8)`), avatars: await D(p, `__D.avs(${cl('Clocked In')})`) };
    o.s2_pic = await clip(p, 'C590114-s2-wo1-row', await D(p, `__D.box(__D.rowEl(${J(w1.id)}))`), 6); await pic(p, 'C590114-s2-tech');
    // step 3 (16 Oct 2026): where the content of Status, Waiting On Parts and Progress sits in its cell
    const alignOf = (lab: string) => D(p, `(function () { var td = ${cl(lab)}; if (!td) return 'no cell'; var tb = __D.box(td); var s = getComputedStyle(td); var x = 1e9, r = -1e9;
        __D.qa('*', td).forEach(function (e) { if (e.childElementCount && !e.matches('.q-icon, i, svg, img, [class*="avatar"]')) { var own = Array.prototype.some.call(e.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); }); var bgd = getComputedStyle(e).backgroundColor !== 'rgba(0, 0, 0, 0)'; if (!own && !bgd) return; } var b = e.getBoundingClientRect(); if (b.width <= 0) return; x = Math.min(x, b.left); r = Math.max(r, b.right); });
        if (r < x) return { cell: tb, text: td.innerText.trim(), content: 'nothing drawn' }; return { cell: tb, textAlign: s.textAlign, justify: getComputedStyle(td.firstElementChild || td).justifyContent, padL: s.paddingLeft, padR: s.paddingRight, contentLeftFromCellLeft: Math.round((x - tb.x) * 10) / 10, spaceRightOfContent: Math.round((tb.r - r) * 10) / 10, text: td.innerText.replace(/\\s+/g, ' ').trim().slice(0, 40) }; })()`);
    o.s3_alignment = { Status: await alignOf('Status'), 'Waiting On Parts': await alignOf('Waiting On Parts'), Progress: await alignOf('Progress') };
    o.s3_alignmentPic = await clip(p, 'C590114-s3-status-waiting-progress', await D(p, `__D.box(__D.rowEl(${J(w1.id)}))`), 6);
    // step 6: hover the FIRST avatar in Assigned Techs only; the bubble must open above it
    o.s3_avatarHover = []; { const av = ((Array.isArray(o.s2_assigned) ? o.s2_assigned : []) as any[])[0];
      if (av) { await away(); await hoverBox(p, av.box); const tp = await D(p, '__D.tips()'); o.s3_avatarHover.push({ avatar: 1, tooltips: tp, place: rel(tp?.[0]?.box ?? null, av.box), titleAttr: await D(p, `(function () { var e = document.elementFromPoint(${av.box.x + av.box.w / 2}, ${av.box.y + av.box.h / 2}); for (var i = 0; e && i < 4; i++, e = e.parentElement) if (e.getAttribute('title')) return e.getAttribute('title'); return null; })()`) }); await pic(p, 'C590114-s6-first-avatar-hover'); }
      else o.s3_avatarHover.push('no avatar in Assigned Techs'); }
    await away();
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

// 22 Oct 2026 (production C590115): the set-up made only the BLUE number (a part request), so the RED number and its tooltip were never
// compared. Copied unchanged from design-r4.mts (round 4, 17 Oct 2026 — the recipe of the staging PASS): the red number is List's
// serviceActionsCount ("<n> Line(s) in Auth Req'd"), i.e. a SECOND line on the work order in "Needs Approval" (authorization_required),
// added through the app's own add-line call; read back in the list answer and on List's screen before anything is compared.
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

await run('C590115', async (o) => { // status pill in List and Tech View, at each density
  const A = await tech('DC06', 'Gia Pills'); const c = await cust('ZZAUTOTEST DC06 Status Pill');
  const w1 = await mkWO(c, { lead: A.staff, line: true, keepParts: true }); o.wo1 = brief(w1);
  { const vendors = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/parts-catalogue/vendors')).body?.data); const vendor = vendors.find((v: any) => v.id);
    const cats = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/inventory/categories')).body?.data); const cat = cats[0]?.value ?? cats[0]?.id;
    o.partRequest = say(await a.post('/api/work-orders/part/make-request', { line: w1.line, work_order: w1.id, description: 'ZZAUTOTEST-PN-DC06', quantity: 1, part_source_type: 'vendor', part_category_id: cat, part_number: `ZZAUTOTEST-PN-DC06-${RUNNO}`, cost: 10, sell_price: 20, vendor: vendor?.id, is_core: false }));
    o.partRequests = (await linesRaw(w1.id)).flatMap((l: any) => (l.part_requests ?? []).map((r: any) => `${r.part_number}:${r.status}`)); }
  // 22 Oct 2026: red = Line-2 in Needs Approval (design-r4 recipe); read back from the server BEFORE any step is measured
  o.redLine = await redLine(w1);
  o.lines = await linesNow(w1, o.redLine.lineId); o.serverCounts = await countsOf(c, w1.id);
  o.preparedOk = { red: (o.serverCounts?.serviceActionsCount ?? 0) > 0, blue: (o.serverCounts?.partRequestsCount ?? 0) > 0 || (o.serverCounts?.statusAuthToOrderCount ?? 0) > 0, stillApproved: o.serverCounts?.status === 'approved' };
  console.log(t(), 'START STATE set C590115 (red and blue counts on the server?)', JSON.stringify({ wo1: o.wo1, redLine: o.redLine, lines: o.lines, serverCounts: o.serverCounts, preparedOk: o.preparedOk }));
  const pillAt = async (key: string, tag: string) => { const pl = await D(p, `__D.pill(__D.cell(${J(key)}, 'Status'))`); const hov: any[] = [];
    for (const [i, n] of ((pl?.numbers ?? []) as any[]).entries()) { await away(); await hoverBox(p, n.bgBox ?? n.box); const tp = await D(p, '__D.tips()'); hov.push({ number: n.text, bg: n.bg, kind: RED_BG.test(String(n.bg)) ? 'red' : BLUE_BG.test(String(n.bg)) ? 'blue' : 'other', tooltips: tp?.map((x: any) => x.text), place: rel(tp?.[0]?.box ?? null, n.bgBox ?? n.box) }); await pic(p, `C590115-${tag}-number${i + 1}-hover`); }
    await away(); return { pill: pl, hovers: hov, picture: await clip(p, `C590115-${tag}-pill`, pl?.pill?.box ?? null, 30) }; };
  o.prep = await prep([A.staff], 'List'); await search(p, c.name); o.listUsedSearch = true;
  o.s2_s3_list = await pillAt(w1.number, 's2-list');
  // positive control on screen: are a red AND a blue number drawn on List's pill before Tech View is compared with it?
  o.listControl = { redDrawn: o.s2_s3_list.hovers.some((h: any) => h.kind === 'red'), blueDrawn: o.s2_s3_list.hovers.some((h: any) => h.kind === 'blue'), numbers: o.s2_s3_list.hovers.map((h: any) => `${h.kind}:${h.number}`) };
  console.log(t(), 'C590115 List control (red and blue drawn?)', JSON.stringify(o.listControl));
  // FIX-UP 2 (17 Oct 2026): List was searched down to Work-order-1 but Tech View was not, so the two pills were measured on different
  // screens. Tech View now gets the SAME search before it is measured (and keeps it for the density readings); both search boxes are read back.
  await display(p, 'Tech View'); await search(p, c.name); o.techSearchHolds = await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null); o.find = await rowOn(p, w1.id, c.name, A.staff);
  o.s5_s6_tech = await pillAt(w1.id, 's5-tech');
  o.pillWidths = { list: o.s2_s3_list?.pill?.pill?.box?.w ?? null, tech: o.s5_s6_tech?.pill?.pill?.box?.w ?? null, sameSearch: o.techSearchHolds === c.name };
  for (const d of ['compact', 'regular', 'comfortable'] as const) { o[`density_${d}`] = { menu: await density(p, d), wo1Pill: (await D(p, `__D.pill(__D.cell(${J(w1.id)}, 'Status'))`))?.pill?.box, visiblePillHeights: await D(p, '__D.pills()'), picture: await pic(p, `C590115-${d}-tech`) }; }
  await density(p, 'regular'); await display(p, 'List'); await search(p, c.name);
  { const pl = await D(p, `__D.pill(__D.cell(${J(w1.number)}, 'Status'))`); o.s13_list = { pill: pl, picture: await clip(p, 'C590115-s13-list-pill', pl?.pill?.box ?? null, 30) }; }
  await search(p, '');
});

/** 22 Oct 2026 (production C590116 step 9): production has no "ZZAUTOTEST WO View Only" role (role-viewonly-stg4 on production read
 *  nothing), so step 9 was never run. ONLY with WOB_PROD_LOGIN and only when the role is missing (staging / QA branches are untouched):
 *  (1) on screen, the stg-setup.mts recipe (14 Oct 2026): Administration > Roles & Permissions > Create Custom Role > Skip > role name +
 *      Work orders View switch (area_workorders_view) > Create; the app's own POST /api/roles answer is caught for the new id;
 *  (2) only if the screen route did not make it: POST /api/roles in the shape seed_roles.py proved (fePermissions = permission ids), with
 *      only workOrdersView's id (taken from the Admin role) and See financial data off;
 *  then READ BACK (GET /api/roles/<id>): used only if Work orders View is on and no Work orders Create & Edit / Delete is held. */
async function ensureViewRoleProd() {
  const NAME = 'ZZAUTOTEST WO View Only'; const o: any = {};
  const list = async () => ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data);
  const find = async () => (await list()).find((r: any) => (r.label ?? r.name) === NAME)?.id ?? null;
  const toasts = () => p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 150))`).catch(() => []);
  const fromPage = () => p.evaluate(`(() => { const all = [...document.querySelectorAll('tr, .q-item, [role="row"], .q-card')].filter(e => (e.innerText || '').includes(${J(NAME)})); all.sort((x, y) => x.innerText.length - y.innerText.length);
      for (const e of all) { const h = [e, ...e.querySelectorAll('[href], [data-test-id]')].map(x => (x.getAttribute('href') || '') + ' ' + (x.getAttribute('data-test-id') || '')).join(' '); const m = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/.exec(h); if (m) return m[1]; } return null; })()`).catch(() => null) as Promise<string | null>;
  o.listed = (await list()).length; let id: string | null = await find(); o.foundInList = !!id;
  if (!id) {
    try {
      await p.goto(APP + '/administration/roles-permissions', { waitUntil: 'domcontentloaded' }); await W(6000);
      o.onPageBefore = (await p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText`).catch(() => '') as string).includes(NAME);
      if (o.onPageBefore) { id = await fromPage(); o.idFromPage = id; }
      else {
        await p.locator('button').filter({ hasText: /Create Custom Role/i }).first().click(); await W(3000);
        const skip = p.locator('.q-dialog button').filter({ hasText: /^\s*Skip\s*$/i }).first(); if (await skip.count()) { await skip.click(); await W(5000); }
        await p.locator('[data-test-id="role_name_input"]').fill(NAME);
        await p.locator('[data-test-id="area_workorders_view"]').click(); await W(800);
        o.filledPic = await pic(p, 'C590116-s9-role-filled');
        const resp = p.waitForResponse((r) => /\/api\/roles\/?(\?|$)/.test(r.url()) && r.request().method() === 'POST', { timeout: 15_000 }).catch(() => null);
        await p.locator('button').filter({ hasText: /^\s*Create\s*$/ }).last().click(); await W(3000);
        const conf = p.locator('.q-dialog button').filter({ hasText: /Create|Continue|Yes|Confirm/i }).last(); if (await conf.count()) { o.confirm = (await p.locator('.q-dialog').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200); await conf.click(); await W(3000); }
        const r = await resp; if (r) { o.uiPost = r.status(); const b: any = await r.json().catch(() => null); id = b?.data?.id ?? b?.id ?? null; }
        o.uiToasts = await toasts();
        if (!id) id = await find();
        if (!id) { await p.goto(APP + '/administration/roles-permissions', { waitUntil: 'domcontentloaded' }); await W(6000); id = await fromPage(); o.idFromPageAfter = id; }
        o.afterPic = await pic(p, 'C590116-s9-roles-after');
      }
    } catch (e: any) { o.ui = 'screen route failed: ' + String(e?.message || e).slice(0, 200); }
  }
  if (!id) {
    const src = ADMIN_ROLE ? (await a.get(`/api/roles/${ADMIN_ROLE}`)).body?.data : null;
    const view = (src?.fe_permissions ?? []).find((x: any) => /^workOrdersView$/i.test(String(x?.code ?? x?.name ?? '')));
    if (view) { const r = await a.post('/api/roles', { name: NAME, fePermissions: [view.id], organization: ORG, viewMode: src?.view_mode ?? null, crossToggles: { ...(src?.cross_toggles ?? {}), seeFinancialData: false }, description: 'ZZAUTOTEST fixture: Work orders > View only (C590116 step 9)', templateId: src?.template_id ?? null });
      o.api = say(r); id = r.body?.data?.id ?? r.body?.data?.role_id ?? (await find()); }
    else o.api = 'not tried: no workOrdersView permission id on the Admin role';
  }
  o.id = id ? id.slice(0, 8) : null;
  if (id) { const codes: string[] = ((await a.get(`/api/roles/${id}`)).body?.data?.fe_permissions ?? []).map((x: any) => String(x?.code ?? x?.name ?? x));
    o.readBack = codes.filter((c) => /^(workOrder|wo[A-Z])/.test(c)); o.viewOnly = codes.includes('workOrdersView') && !codes.some((c) => /^workOrder.*(CreateAndEdit|Delete)/i.test(c)); }
  console.log(t(), 'C590116 step 9 view-only role on production', JSON.stringify(o));
  return { id: id && o.viewOnly ? id : null, log: o };
}

await run('C590116', async (o) => { // six-dot grip on rows and group headers; not for a view-only user
  const A = await tech('DC07', 'Hana Grip'); const c = await cust('ZZAUTOTEST DC07 Grip');
  const w1 = await mkWO(c, { lead: A.staff }), w2 = await mkWO(c, { lead: A.staff }), w3 = await mkWO(c, { status: 'estimate' }); o.wos = [w1, w2, w3].map(brief);
  o.prep = await prep([A.staff], 'Tech View');
  o.s2_groupHeaders = await D(p, `__D.qa('[data-test-id^="tech_view_group_"]').filter(function (e) { return /^tech_view_group_([0-9a-f-]{36}|unassigned)$/.test(e.getAttribute('data-test-id')); }).slice(0, 6).map(function (tr) { var g = tr.querySelector('[data-test-id^="tech_view_group_drag_handle_"]'); var n = tr.querySelector('[data-test-id^="tech_view_group_name_"]'); return { group: n ? n.textContent.trim() : tr.getAttribute('data-test-id'), grip: g ? __D.desc(g, true) : null, gripLeftOfRow: g ? Math.round(g.getBoundingClientRect().left - tr.getBoundingClientRect().left) : null, firstParts: __D.parts(tr, 3) }; })`);
  o.s2_pic = await clip(p, 'C590116-s2-group-headers', await D(p, `__D.box(__D.grp('unassigned'))`), 8); await pic(p, 'C590116-s2-tech');
  // FIX-UP 2 (17 Oct 2026): on 16 Oct WO-1 / WO-2 were not drawn (Tech View draws only rows near the screen, ~100 groups), so steps 3-6 read
  // nothing of the test's own rows. The rows are now brought on screen (rowOn: open the group, scroll; the case's customer typed in Search if
  // that is what it takes, logged as usedSearch) and read back before any measurement; the search is KEPT for steps 4-6 so both rows stay drawn.
  o.find1 = await rowOn(p, w1.id, c.name, A.staff); o.find2 = { found: (await p.locator(`[data-test-id="tech_view_row_${w2.id}"]`).count()) > 0 };
  console.log(t(), 'START STATE found C590116', JSON.stringify({ wos: o.wos, wo1: o.find1, wo2: o.find2 }));
  o.s3_rows = { wo1: await D(p, `__D.rowGrip(${J(w1.id)})`), wo2: await D(p, `__D.rowGrip(${J(w2.id)})`), sample: await D(p, `__D.qa('[data-test-id^="tech_view_row_"]').slice(0, 6).map(function (tr) { return __D.rowGrip(tr.getAttribute('data-test-id').replace('tech_view_row_', '')); })`) };
  o.find3 = await rowOn(p, w3.id, c.name, 'unassigned'); o.s3_wo3 = await D(p, `__D.rowGrip(${J(w3.id)})`); o.s3_pic = await pic(p, 'C590116-s3-unassigned-row');
  o.find1b = await rowOn(p, w1.id, c.name, A.staff); o.find2b = { found: (await p.locator(`[data-test-id="tech_view_row_${w2.id}"]`).count()) > 0 }; await away();   // fix-up 2: both rows drawn for steps 4-6
  const before = await D(p, `__D.rowGrip(${J(w1.id)})`); await hoverSel(p, `[data-test-id="tech_view_row_${w1.id}"]`);
  o.s4_hover = { before, after: await D(p, `__D.rowGrip(${J(w1.id)})`), picture: await clip(p, 'C590116-s4-row-hover', await D(p, `__D.box(__D.rowEl(${J(w1.id)}))`), 40) };
  await away();
  // 22 Oct 2026: step 5's drop point copied from design-r4.mts (round 4, 17 Oct 2026 — the staging PASS). The old target (WO-2's bottom
  // edge + 6 px) let go over a LOWER group on staging and on production (production moved S1-996's lead to "Ahtasham Amjad"). Now the
  // release point is INSIDE WO-2's row (70% down, then its centre, then between the two rows), and document.elementFromPoint there must be a
  // row of Technician-A's group (data-group-key), not a group header, before the mouse is pressed; it is read again while held. If no such
  // point exists the drag is NOT made. If the lead still changes, it is put back through the app's call and the reading says so.
  const order = async () => (await groups(p)).find((g) => g.id === A.staff)?.rows.map((n) => n === w1.number ? 'WO-1' : n === w2.number ? 'WO-2' : n);
  const leadNow = async (id: string) => { const w = (await workOrders(a, c.name)).find((x: any) => x.id === id); return w?.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName ?? ''}`.trim() : 'none'; };
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
      o.s5_during = await D(p, '__D.fresh()'); o.s5_during.underWhileHeld = await under(p, x, pick.y); o.s5_during.picture = await pic(p, 'C590116-s5-dragging');
      await p.mouse.up(); await W(2500); o.s5_toasts = await D(p, '__D.notes()');
    }
  } else o.s5_during = `customer cell ${!!cb}, WO-1 row ${!!r1}, WO-2 row ${!!r2}`;
  o.s5_orderAfter = await order(); o.s5_leadAfter = await leadNow(w1.id); await pic(p, 'C590116-s5-after-drop');
  o.s5_movedBelow = Array.isArray(o.s5_orderAfter) && o.s5_orderAfter.indexOf('WO-1') > o.s5_orderAfter.indexOf('WO-2') && o.s5_orderAfter.indexOf('WO-2') >= 0;
  if (o.s5_leadAfter !== o.s5_leadBefore) { o.s5_leadPutBack = say(await a.post('/api/work-orders/change-lead-technician', { work_order_id: w1.id, tech_assigned_id: A.staff })); o.s5_leadAfterPutBack = await leadNow(w1.id); }
  console.log(t(), 'C590116 step 5', JSON.stringify({ before: o.s5_orderBefore, after: o.s5_orderAfter, movedBelow: o.s5_movedBelow, leadBefore: o.s5_leadBefore, leadAfter: o.s5_leadAfter, drop: o.s5_dropPoint, messages: o.s5_toasts }));
  await rowOn(p, w1.id, c.name, A.staff); /* 22 Oct 2026: as design-r4 */ const url0 = p.url(); const cb2 = await D(p, `__D.box(__D.cell(${J(w1.id)}, 'Customer'))`);
  if (cb2) { await p.mouse.click(cb2.x + cb2.w / 2, cb2.y + cb2.h / 2); await W(3500); }
  o.s6_click = { before: url0.replace(APP, ''), after: p.url().replace(APP, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>'), orderAfter: p.url() === url0 ? await order() : 'page changed', picture: await pic(p, 'C590116-s6-after-click') };
  // steps 7–9 as User-B in User-B's own window (the shared session is never signed out, L0342)
  if (!VIEW_ROLE && process.env.WOB_PROD_LOGIN) { const vr = await ensureViewRoleProd(); o.viewRoleMade = vr.log; if (vr.id) { VIEW_ROLE = vr.id; R.roles.viewOnly = true; } }   // 22 Oct 2026: production only
  if (!VIEW_ROLE) { o.userB = 'no "ZZAUTOTEST WO View Only" role in this organisation'; return; }
  const vb = (await person(a, 'ZZAUTOTEST DC07', 'Viewer', { role: VIEW_ROLE, email: `zz.wob.dc07.viewer${MAIL}`, clockable: false })).row;
  if (!vb) { o.userB = 'User-B not made'; return; }
  o.userB = { role: vb.role_label };
  const v = await viewAs(browser, p, a, vb.id, RUN.me?.id ?? '', RUN.toRunner); const pg = v.page; registerShotPage(pg); pg.setDefaultTimeout(15_000);
  try {
    o.userB.perms = v.perms; o.userB.prep = await prep([A.staff], 'Tech View', 1440, pg, api(pg)); o.userB.find1 = await rowOn(pg, w1.id, c.name, A.staff);   // fix-up 2: rows brought on screen for User-B too
    o.s9_rows = { wo1: await D(pg, `__D.rowGrip(${J(w1.id)})`), wo2: await D(pg, `__D.rowGrip(${J(w2.id)})`), sample: await D(pg, `__D.qa('[data-test-id^="tech_view_row_"]').slice(0, 5).map(function (tr) { return __D.rowGrip(tr.getAttribute('data-test-id').replace('tech_view_row_', '')); })`) };
    o.s9_groupHeadersAlsoRecorded = await D(pg, `__D.qa('[data-test-id^="tech_view_group_drag_handle_"]').length`);
    // 22 Oct 2026 (as design-r4): step 9 also judges the group headers, Unassigned included — table scrolled to the top so Unassigned is drawn; extra reading + pictures only
    o.s9_rowsPic = await pic(pg, 'C590116-s9-user-b-rows');   // the rows as found, before the scroll to the top
    await pg.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) s.scrollTop = 0; })()`).catch(() => {}); await W(1200, pg);
    o.s9_groupHeaders = await D(pg, `__D.qa('[data-test-id^="tech_view_group_"]').filter(function (e) { return /^tech_view_group_([0-9a-f-]{36}|unassigned)$/.test(e.getAttribute('data-test-id')); }).slice(0, 6).map(function (tr) { var g = tr.querySelector('[data-test-id^="tech_view_group_drag_handle_"]'); var n = tr.querySelector('[data-test-id^="tech_view_group_name_"]'); return { group: n ? n.textContent.trim() : tr.getAttribute('data-test-id'), grip: g ? __D.desc(g, true) : null, gripLeftOfRow: g ? Math.round(g.getBoundingClientRect().left - tr.getBoundingClientRect().left) : null, firstParts: __D.parts(tr, 3) }; })`); o.s9_unassignedDrawn = (await pg.locator('[data-test-id="tech_view_group_unassigned"]').count()) > 0;
    o.s9_headersPic = await clip(pg, 'C590116-s9-user-b-group-headers', await D(pg, `__D.box(__D.grp('unassigned'))`), 8);
    o.s9_pic = await pic(pg, 'C590116-s9-user-b-tech'); await pg.screenshot({ path: path.join(EV, 'C590116-end.png') }).catch(() => {});
  } finally { registerShotPage(p); await v.close(); }
});

await run('C590117', async (o) => { // Tech View group header pieces
  // 16 Oct 2026: follows the case as rewritten (11 steps; NEW pin steps: step 6 click the pin in Technician-B's group header - it turns
  // blue - and step 11 click it again - grey again; step 5 now expects the browser's PLAIN name tip on the header avatar, so the avatar's
  // title attribute is read, not only .q-tooltip). The case's start: NO technician pinned (pinning B by the script first would make step 6
  // an unpin) and Customer-A's name in Search; the technicians' headers are scrolled into the window (groupOn). Readings keyed by step.
  const A = await tech('DC08', 'Ines Header', true), B = await tech('DC08', 'Jon Header'); o.photoLog = A.log.filter((x) => /photo/.test(x));
  const c = await cust('ZZAUTOTEST DC08 Group Header');
  o.wos = [await mkWO(c, { lead: A.staff }), await mkWO(c, { lead: B.staff }), await mkWO(c, { status: 'estimate' })].map(brief);
  o.prep = await prep([], 'Tech View'); await search(p, c.name); o.searchHolds = await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null);
  /** bring a group header into the window: scroll the table from the top until it is drawn, then centre it */
  const groupOn = async (id: string) => { await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) s.scrollTop = 0; })()`); await W(500);
    for (let i = 0; i < 200 && !(await p.locator(`[data-test-id="tech_view_group_${id}"]`).count()); i++) { const mv = await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (!s) return false; const b = s.scrollTop; s.scrollTop += 400; return s.scrollTop !== b; })()`); await W(250); if (!mv) break; }
    await centre(p, `[data-test-id="tech_view_group_${id}"]`); return (await p.locator(`[data-test-id="tech_view_group_${id}"]`).count()) > 0; };
  const pinOf = (id: string) => D(p, `(function () { var b = __D.q('[data-test-id="button_tech_view_pin_${id}"]'); return b ? { pressed: b.getAttribute('aria-pressed'), label: b.getAttribute('aria-label'), color: getComputedStyle(b).color, opacity: getComputedStyle(b).opacity, icons: __D.icons(b) } : 'no pin in the header'; })()`);
  // step 1: Unassigned
  o.s1_unassigned = await D(p, `__D.groupHdr('unassigned')`); o.s1_pic = await clip(p, 'C590117-s1-unassigned-header', o.s1_unassigned?.box ?? null, 8);
  // step 2: Technician-B's header, left to right (its pin read without hovering)
  o.s2_reached = await groupOn(B.staff); await away();
  o.s2_techB = await D(p, `__D.groupHdr(${J(B.staff)})`); o.s2_techBPin = await pinOf(B.staff); o.s2_pic = await clip(p, 'C590117-s2-techB-header', o.s2_techB?.box ?? null, 8);
  // step 3: Technician-A's avatar (photo)
  o.s3_reached = await groupOn(A.staff); o.s3_techA = await D(p, `__D.groupHdr(${J(A.staff)})`); o.s3_pic = await clip(p, 'C590117-s3-techA-header', o.s3_techA?.box ?? null, 8);
  // step 4: hover A's count: dark tooltip above it, not over a column header label
  o.s4_countHover = await tipFor(p, `[data-test-id="tech_view_group_count_${A.staff}"]`, 'C590117-s4-count-hover', '__D.box(__D.headRow())');
  // step 5: hover B's header avatar: the browser's plain name tip = the title attribute on the avatar (or the nearest element holding one)
  await groupOn(B.staff); await away(); const bav = ((await D(p, `__D.groupHdr(${J(B.staff)})`))?.avatars ?? [])[0];
  if (bav) { await hoverBox(p, bav.box); const tp = await D(p, '__D.tips()');
    o.s5_avatarHover = { titleAttr: await D(p, `(function () { var e = document.elementFromPoint(${bav.box.x + bav.box.w / 2}, ${bav.box.y + bav.box.h / 2}); var out = []; for (var i = 0; e && i < 5; i++, e = e.parentElement) if (e.getAttribute('title')) out.push({ tag: e.tagName.toLowerCase(), title: e.getAttribute('title') }); return out; })()`), styledTooltips: tp, expectedName: B.name, picture: await pic(p, 'C590117-s5-avatar-hover'),
      note: 'a browser title tip is drawn by the browser, not the page: it does not show in a screenshot; the title attribute is the reading' }; }
  else o.s5_avatarHover = 'no avatar found in the header';
  await away();
  // step 6: click the pin in B's header: blue (pressed); B's group then sits right after Unassigned
  o.s6_before = await pinOf(B.staff); await p.locator(`[data-test-id="button_tech_view_pin_${B.staff}"]`).first().click(); await W(1800); await away();
  await groupOn(B.staff); o.s6_after = { pin: await pinOf(B.staff), savedPins: ((await a.get(PREF)).body?.data?.value?.pinnedTechnicianIds ?? []).includes(B.staff), groupsOrder: (await groups(p)).slice(0, 3).map((g) => g.name), picture: await clip(p, 'C590117-s6-techB-pinned', await D(p, `__D.box(__D.grp(${J(B.staff)}))`), 8) };
  // steps 7-8: A's arrow, twice
  await groupOn(A.staff); await p.locator(`[data-test-id="button_tech_view_group_toggle_${A.staff}"]`).click(); await W(1500); await away();
  o.s7_collapsed = { hdr: await D(p, `__D.groupHdr(${J(A.staff)})`), picture: await clip(p, 'C590117-s7-collapsed', await D(p, `__D.box(__D.grp(${J(A.staff)}))`), 30) };
  await p.locator(`[data-test-id="button_tech_view_group_toggle_${A.staff}"]`).click(); await W(1500); await away();
  o.s8_open = { collapsed: (await D(p, `__D.groupHdr(${J(A.staff)})`))?.collapsed, toggle: (await D(p, `__D.groupHdr(${J(A.staff)})`))?.toggle, picture: await clip(p, 'C590117-s8-open', await D(p, `__D.box(__D.grp(${J(A.staff)}))`), 30) };
  // steps 9-10: Compact, Comfortable (header height, avatar size, name size)
  const sizes = async () => { await groupOn(B.staff); const hb: any = await D(p, `__D.groupHdr(${J(B.staff)})`); await groupOn(A.staff); const h: any = await D(p, `__D.groupHdr(${J(A.staff)})`); return { techA: { h: h?.box?.h, avatar: h?.avatars?.[0]?.box, name: h?.name?.st }, techB: { h: hb?.box?.h, avatar: hb?.avatars?.[0]?.box, name: hb?.name?.st, avatarText: hb?.avatars?.[0] } }; };
  o.regular = await sizes();
  for (const d of ['compact', 'comfortable'] as const) { o[`s${d === 'compact' ? 9 : 10}_${d}`] = { menu: await density(p, d), ...(await sizes()), picture: await clip(p, `C590117-s${d === 'compact' ? 9 : 10}-${d}-headers`, await D(p, `__D.box(__D.grp(${J(A.staff)}))`), 60) }; }
  // step 11: click B's pin again: grey again
  await groupOn(B.staff); await p.locator(`[data-test-id="button_tech_view_pin_${B.staff}"]`).first().click(); await W(1800); await away();
  await groupOn(B.staff); o.s11_unpinned = { pin: await pinOf(B.staff), savedPins: ((await a.get(PREF)).body?.data?.value?.pinnedTechnicianIds ?? []).includes(B.staff), picture: await clip(p, 'C590117-s11-techB-unpinned', await D(p, `__D.box(__D.grp(${J(B.staff)}))`), 8) };
  // extra reading for step 6's "as on a pinned Board View column header": the pin colour on a PINNED Board View column (B pinned by the
  // pin clicked on the board for this read only, then clicked again to take it off; both read back)
  await display(p, 'Board View'); await toColumn(p, B.staff).catch(() => {}); const bp = p.locator(`[data-test-id="button_board_pin_${B.staff}"], [data-test-id="button_board_column_pin_${B.staff}"]`).first();
  if (await bp.count()) { await bp.click(); await W(1800); await toColumn(p, B.staff).catch(() => {}); await away(); o.boardPinnedReference = (await D(p, `__D.colHdr(${J(B.staff)})`))?.pin ?? 'no column header';
    await bp.click().catch(() => {}); await W(1500); o.boardPinTakenOff = !(((await a.get(PREF)).body?.data?.value?.pinnedTechnicianIds ?? []) as string[]).includes(B.staff); } else o.boardPinnedReference = 'no pin button on the Board View column';
  await display(p, 'Tech View'); await density(p, 'regular'); await search(p, '');
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
  // 16 Oct 2026: follows the case as rewritten (NEW step 4: after pinning Technician-B, B's column moves to just after "Unassigned" - the
  // column order is read from the left of the board; steps 6-7 confirm A and C pinned - three pinned, read from the saved choice and the
  // headers). Starting screen as the case: nobody pinned, Customer-A's name in Search. Readings keyed by the case's step numbers.
  const A = await tech('DC10', 'Lea Pin', true), B = await tech('DC10', 'Max Pin'), C = await tech('DC10', 'Nia Pin'), Dd = await tech('DC10', 'Oli Pin'); o.photoLog = A.log.filter((x) => /photo/.test(x));
  const c = await cust('ZZAUTOTEST DC10 Column Header');
  o.wos = [await mkWO(c, { lead: A.staff }), await mkWO(c, { lead: B.staff }), await mkWO(c, { status: 'estimate' })].map(brief);
  o.prep = await prep([], 'Board View'); await search(p, c.name); o.searchHolds = await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null);
  const who: Record<string, string> = { [A.staff]: 'Technician-A', [B.staff]: 'Technician-B', [C.staff]: 'Technician-C', [Dd.staff]: 'Technician-D', unassigned: 'Unassigned' };
  /** the first columns of the board from its left edge, by their place on screen */
  const leftCols = async (n = 5) => { await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); if (h) h.scrollLeft = 0; })()`); await W(900);
    return (await boardCols(p)).sort((x, y) => x.left - y.left).slice(0, n).map((x) => `${who[x.id] ?? x.name}${x.pinned === 'true' ? ' [pinned]' : ''}`); };
  const saved = async () => (((await a.get(PREF)).body?.data?.value?.pinnedTechnicianIds ?? []) as string[]).map((x) => who[x] ?? x);
  o.start = { firstColumns: await leftCols(), savedPins: await saved() };
  o.s1_unassigned = await D(p, `__D.colHdr('unassigned')`); o.s1_pic = await clip(p, 'C590119-s1-unassigned-header', o.s1_unassigned?.box ?? null, 8);
  o.s2_reached = await toColumn(p, B.staff); o.s2_techB = await D(p, `__D.colHdr(${J(B.staff)})`); o.s2_pic = await clip(p, 'C590119-s2-techB-header', o.s2_techB?.box ?? null, 8);
  await toColumn(p, A.staff); o.s3_techA = await D(p, `__D.colHdr(${J(A.staff)})`); o.s3_pic = await clip(p, 'C590119-s3-techA-header', o.s3_techA?.box ?? null, 8);
  const pinSel = (id: string) => `[data-test-id="button_board_pin_${id}"], [data-test-id="button_board_column_pin_${id}"]`;
  const pinClick = async (id: string) => { await toColumn(p, id); await p.locator(pinSel(id)).first().click(); await W(1800); await away(); };
  // step 4: pin B: B's column directly after Unassigned
  await pinClick(B.staff); o.s4 = { firstColumns: await leftCols(), savedPins: await saved() }; o.s4.bRightAfterUnassigned = o.s4.firstColumns[0]?.startsWith('Unassigned') && o.s4.firstColumns[1]?.startsWith('Technician-B');
  o.s4.picture = await pic(p, 'C590119-s4-after-pin-b');
  // step 5: B's pin (slash, blue)
  await toColumn(p, B.staff); await away(); o.s5_techBPin = { pin: (await D(p, `__D.colHdr(${J(B.staff)})`))?.pin, picture: await clip(p, 'C590119-s5-techB-pinned', await D(p, `__D.box(__D.q('[data-test-id="board_column_header_${B.staff}"]'))`), 8) };
  // steps 6-7: pin A, then C: three pinned
  await pinClick(A.staff); o.s6 = { savedPins: await saved(), firstColumns: await leftCols(), pinA: (await D(p, `__D.colHdr(${J(A.staff)})`))?.pin?.pressed };
  await pinClick(C.staff); o.s7 = { savedPins: await saved(), firstColumns: await leftCols(), pinnedCount: (await saved()).length }; o.s7.picture = await pic(p, 'C590119-s7-three-pinned');
  // step 8: hover D's pin: faded, "You can pin up to 3 technicians."
  await toColumn(p, Dd.staff); o.s8_pinHover = await tipFor(p, pinSel(Dd.staff), 'C590119-s8-pin-hover');
  o.s8_unpinnedPins = await D(p, `__D.qa('[data-test-id^="button_board_pin_"], [data-test-id^="button_board_column_pin_"]').filter(function (b) { return b.getAttribute('aria-pressed') !== 'true'; }).slice(0, 4).map(function (b) { return { tid: b.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>'), disabled: b.disabled || b.getAttribute('aria-disabled') === 'true', opacity: getComputedStyle(b).opacity, icon: __D.icons(b)[0] || null, color: getComputedStyle(b).color }; })`);
  // step 9: unpin B, A, C: every header shows the grey outline pin again
  await away(); for (const x of [B, A, C]) await pinClick(x.staff);
  o.s9_after = { savedPins: await saved() }; for (const [k, x] of Object.entries({ A, B, C, D: Dd })) { await toColumn(p, x.staff); o.s9_after[k] = (await D(p, `__D.colHdr(${J(x.staff)})`))?.pin; }
  o.s9_pic = await pic(p, 'C590119-s9-unpinned'); await search(p, '');
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
  // 16 Oct 2026 (batch 40, build v26.40.19): the 16 Oct run left steps 1-3 (List) undone and the progress at 0%, so the blue progress fill
  // could not be seen. Now (a) Line-1 gets a part request (as C590115) so List's pill can carry a blue number to compare; (b) progress
  // above 0 the way the product counts it (progress = clocked labour minutes / the line's Estimated Time, read from a list row on 16 Oct):
  // Line-1's Estimated Time set to 0.1 h in Edit Line, then Technician-B (Line-1's technician) clocks in and out on Line-1 from B's own
  // window (Start, ~100 s, Clock Out); (c) steps 1-3 in List: Search the customer, read Work-order-1's pill (word, colours, shape, height,
  // numbers); (d) step 7 compares the card's pill with List's, both read the same way (the element holding the status word, up to its
  // coloured rounded box); (e) the progress bar's track and fill are measured on the card.
  { const vendors = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/parts-catalogue/vendors')).body?.data); const vendor = vendors.find((v: any) => v.id);
    const cats = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/inventory/categories')).body?.data); const cat = cats[0]?.value ?? cats[0]?.id;
    o.partRequest = say(await a.post('/api/work-orders/part/make-request', { line: w1.line, work_order: w1.id, description: 'ZZAUTOTEST-PN-DC11', quantity: 1, part_source_type: 'vendor', part_category_id: cat, part_number: `ZZAUTOTEST-PN-DC11-${RUNNO}`, cost: 10, sell_price: 20, vendor: vendor?.id, is_core: false })); }
  { await p.goto(`${APP}/workorders/${w1.id}/lines`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(7000); await p.getByText(R.line, { exact: false }).first().click().catch(() => {}); await W(2500);
    const dl = p.locator('.q-dialog:visible').last(); await dl.locator('[data-test-id="input_time_estimate"]').fill('0.1').catch((e) => { o.estimateErr = String(e).slice(0, 80); });
    await dl.locator('.text-h6, .q-card__section').first().click({ position: { x: 5, y: 5 } }).catch(() => {}); await dl.locator('[data-test-id="button_save_close"], button:has-text("Save & Close")').first().click().catch(() => {}); await W(3500);
    o.estimateAfter = (await linesRaw(w1.id)).map((l: any) => `${l.time_estimate}`); }
  { const v = await viewAs(browser, p, a, B.id, RUN.me?.id ?? '', RUN.toRunner); try { const pg = v.page; await pg.goto(`${APP}/workorders/${w1.id}/lines`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(7000, pg);
      const tg = pg.locator('[data-test-id^="button_clock_toggle_task_"]').first(); o.clockButtons = await pg.locator('[data-test-id^="button_clock_toggle_task_"]').count();
      if (o.clockButtons) { await tg.click({ force: true }).catch(() => {}); await W(2500, pg); const ds = pg.locator('.q-dialog:visible').last(); if (await ds.count()) { o.startDialog = (await ds.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 160); await ds.locator('button').filter({ hasText: /Start|Clock In|Confirm/i }).last().click().catch(() => {}); await W(2000, pg); }
        o.clockRunning = ((await api(pg).get('/api/technician-tasks/my-current-task')).body?.data?.technician_task?.label) ?? 'no clock running'; await W(100_000, pg);
        await pg.locator('[data-test-id^="button_clock_toggle_task_"]').first().click({ force: true }).catch(() => {}); await W(2500, pg); const dc = pg.locator('.q-dialog:visible').last();
        await dc.locator('textarea').first().fill('ZZAUTOTEST progress for C590120').catch(() => {}); await dc.locator('button').filter({ hasText: /Clock Out/i }).last().click().catch(() => {}); await W(3000, pg);
        o.clockAfter = ((await api(pg).get('/api/technician-tasks/my-current-task')).body?.data?.technician_task?.label) ?? 'no clock running'; }
    } finally { await v.close(); } }
  o.progressNow = (await workOrders(a, c.name)).filter((x: any) => x.id === w1.id).map((x: any) => `${x.number} progress ${x.progress}`);
  /** a status pill read the same way in List and on the card: the element whose own text is the status word, up to its coloured rounded box */
  const pillOf = (rootSel: string) => D(p, `(function () { var root = document.querySelector(${J(rootSel)}); if (!root) return null; var own = function (e) { var t = ''; for (var i = 0; i < e.childNodes.length; i++) if (e.childNodes[i].nodeType === 3) t += e.childNodes[i].textContent; return t.replace(/\\s+/g, ' ').trim(); };
      var w = Array.prototype.find.call(root.querySelectorAll('*'), function (e) { return /^(Approved|Estimate|Invoiced|In Progress|Ready For Review|Complete|Paid)$/i.test(own(e)) && e.getBoundingClientRect().width > 0; }); if (!w) return 'no status word';
      var b = w; while (b && b !== root && (getComputedStyle(b).backgroundColor === 'rgba(0, 0, 0, 0)' || getComputedStyle(b).borderRadius === '0px')) b = b.parentElement; if (!b || b === root) b = w; var s = getComputedStyle(b), sw = getComputedStyle(w);
      var host = b.parentElement || b; var nums = Array.prototype.filter.call(host.querySelectorAll('*'), function (e) { return /^\\d+$/.test(own(e)) && e.getBoundingClientRect().width > 0; }).map(function (e) { var g = e; while (g && g !== host && getComputedStyle(g).backgroundColor === 'rgba(0, 0, 0, 0)') g = g.parentElement; return { text: own(e), color: getComputedStyle(e).color, bg: g ? getComputedStyle(g).backgroundColor : null }; });
      var r = b.getBoundingClientRect(); return { word: own(w), bg: s.backgroundColor, text: sw.color, border: s.borderTop, radius: s.borderRadius, height: Math.round(r.height * 10) / 10, width: Math.round(r.width * 10) / 10, fontSize: sw.fontSize, fontWeight: sw.fontWeight, numbers: nums, box: { x: r.left, y: r.top, w: r.width, h: r.height, r: r.right, b: r.bottom } }; })()`);
  // 16 Oct 2026: follows the case as rewritten (List baseline for EVERY prepared status - Work-order-1 Approved, Work-order-2 Invoiced - and
  // for BOTH action-count types - red service actions, blue parts actions - then the same work orders' Board pills compared with List; at
  // Compact and Comfortable the card avatars must stay 24 px and the pills 22 px). Readings keyed by the case's step numbers (s1 .. s7).
  // The blue parts-actions count comes from Line-1's part request (above). No recipe for a red SERVICE-actions count is recorded in this
  // repo, so a work order that already shows one (serviceActionsCount > 0 in the list answer) is looked up and read the same way in List
  // and Board View; if none is found the reading says so and that half of step 1/4 needs a hand check. The case is still Blocked by
  // SV-11405 for the reporting session (read the story's status live first, Rule 112) - this script only records.
  const redWo = await (async () => { for (let pg = 1; pg <= 8; pg++) { const r = await a.get(`/api/work-orders?pagination[rowsPerPage]=200&pagination[page]=${pg}`); const l: any[] = r.body?.data?.work_orders ?? [];
      const hit = l.find((w) => (w.serviceActionsCount ?? 0) > 0 && (w.partRequestsCount ?? 0) > 0) ?? l.find((w) => (w.serviceActionsCount ?? 0) > 0); if (hit) return { id: hit.id, number: hit.number, status: hit.status, serviceActionsCount: hit.serviceActionsCount, partRequestsCount: hit.partRequestsCount, lead: hit.techAssignedId ?? hit.tech_assigned_id ?? null, page: pg }; if (!l.length) break; }
    return null; })();
  o.redServiceActionsWorkOrder = redWo ?? 'no work order with serviceActionsCount > 0 on the first 8 pages of the list (1,600 work orders): the red count is not prepared - check it by hand';
  const own = (await workOrders(a, c.name)).filter((x: any) => [w1.id, w2.id].includes(x.id)).map((x: any) => ({ number: x.number, status: x.status, serviceActionsCount: x.serviceActionsCount, partRequestsCount: x.partRequestsCount }));
  o.preparedCounts = own;
  const listPill = async (num: string) => { await D(p, `(function () { Array.prototype.forEach.call(document.querySelectorAll('[data-zz-row]'), function (e) { e.removeAttribute('data-zz-row'); }); var r = Array.prototype.find.call(document.querySelectorAll('tbody tr'), function (x) { return x.innerText.indexOf(${J(num)}) >= 0; }); if (r) r.setAttribute('data-zz-row', '1'); return !!r; })()`);
    return pillOf('tbody tr[data-zz-row="1"]'); };
  const boxOf = (x: any) => x?.box ? { x: x.box.x, y: x.box.y, w: x.box.w, h: x.box.h, r: x.box.r, b: x.box.b } : null;
  // step 1: List, the customer searched: every prepared work order's pill (word, colours, shape, red / blue numbers)
  o.s1 = { prep: await prep([A.staff], 'List') }; await search(p, c.name); await W(2500); o.s1.searchHolds = await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null);
  o.s1.wo1 = await listPill(w1.number); o.s1.wo1Picture = await clip(p, 'C590120-s1-list-wo1-pill', boxOf(o.s1.wo1), 40);
  o.s1.wo2 = await listPill(w2.number); o.s1.wo2Picture = await clip(p, 'C590120-s1-list-wo2-pill', boxOf(o.s1.wo2), 40);
  o.s1.progressCell = await D(p, `(function () { var r = Array.prototype.find.call(document.querySelectorAll('tbody tr'), function (x) { return x.innerText.indexOf(${J(w1.number)}) >= 0; }); return r ? (r.innerText.match(/\\d+%/) || [null])[0] : null; })()`);
  await pic(p, 'C590120-s1-list');
  if (redWo) { await search(p, redWo.number); await W(2000); o.s1.red = await listPill(redWo.number); o.s1.redPicture = await clip(p, 'C590120-s1-list-red-count-pill', boxOf(o.s1.red), 40); await search(p, c.name); await W(2000); }
  // steps 2-3: Board View (Line technicians on, the search kept), WO1's card from top to bottom, and the four texts' sizes
  await display(p, 'Board View'); o.fields = await lineTechsOn(); o.searchAfterSwitch = await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null);
  if (!o.searchAfterSwitch) await search(p, c.name);
  await toColumn(p, A.staff);
  const cardPic = async (id: string, name: string) => { await p.evaluate(`document.querySelector('[data-test-id="board_card_${id}"]')?.scrollIntoView({ block: 'center', inline: 'center' })`).catch(() => {}); await W(700);
    const b = await D(p, `__D.box(__D.q('[data-test-id="board_card_${id}"]'))`); const vp = p.viewportSize(); (o.cardOnScreen ??= {})[name] = !!(b && vp && b.y >= 0 && b.x >= 0 && b.y + b.h <= vp.height && b.x + b.w <= vp.width);
    return clip(p, name, b, 12); };
  /** the case's four texts, measured one by one: number, customer name, the unit · asset line, total price (size / weight / colour / box) */
  const sizes = async () => D(p, `(function () { var c = __D.q('[data-test-id="board_card_${w1.id}"]'); if (!c) return null; var pick = function (sel) { var e = c.querySelector(sel); if (!e) return null; var s = getComputedStyle(e); return { text: e.innerText.replace(/\\s+/g, ' ').trim().slice(0, 60), fontSize: s.fontSize, fontWeight: s.fontWeight, color: s.color, box: __D.box(e) }; };
      var leaf = function (re) { var all = __D.parts(c, 60).filter(function (x) { return x.kind === 'text' && re.test(x.text); }); return all[0] || null; };
      return { number: pick('[data-test-id="board_card_number"]'), customerName: leaf(/^ZZAUTOTEST DC11 Board Card/), unitAssetLine: pick('[data-test-id="board_card_unit"]') || leaf(/TRK-118/), totalPrice: leaf(/^\\$[0-9]/), cardPadding: getComputedStyle(c).padding, cardHeight: __D.box(c).h, fieldsShown: __D.qa('[data-test-id^="board_card_field_"]', c).map(function (e) { return e.getAttribute('data-test-id').replace('board_card_field_', ''); }) }; })()`);
  const avatarSizes = () => D(p, `__D.avs(__D.q('[data-test-id="board_card_${w1.id}"]')).map(function (v) { return { w: v.box.w, h: v.box.h, text: v.text, img: !!v.img }; })`);
  o.s2 = { card: await D(p, `__D.card(${J(w1.id)})`), avatars: await avatarSizes(), progressBar: await D(p, `(function () { var c = document.querySelector('[data-test-id="board_card_${w1.id}"]'); if (!c) return null; return Array.prototype.filter.call(c.querySelectorAll('*'), function (e) { var r = e.getBoundingClientRect(); return r.height >= 1 && r.height <= 8 && r.width >= 4 && getComputedStyle(e).backgroundColor !== 'rgba(0, 0, 0, 0)'; }).map(function (e) { var r = e.getBoundingClientRect(); return { cls: String(e.className).slice(0, 60), tid: e.getAttribute('data-test-id'), x: Math.round(r.left), w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10, bg: getComputedStyle(e).backgroundColor }; }).slice(0, 8); })()`),
    progressText: await D(p, `(function () { var c = document.querySelector('[data-test-id="board_card_${w1.id}"]'); return c ? (c.innerText.match(/\\d+%/) || [null])[0] : null; })()`), picture: await cardPic(w1.id, 'C590120-s2-card-regular') };
  await pic(p, 'C590120-s2-board');
  o.s3 = { sizes: await sizes() };
  // step 4: each prepared work order's Board pill against its List pill, 22 px tall
  const cmp = (L: any, C: any) => { if (!L || !C || typeof L === 'string' || typeof C === 'string') return 'not both read'; return { sameWord: L.word === C.word, sameBg: L.bg === C.bg, sameTextColour: L.text === C.text, sameRadius: L.radius === C.radius, sameNumbers: JSON.stringify(L.numbers.map((n: any) => n.text + n.bg)) === JSON.stringify(C.numbers.map((n: any) => n.text + n.bg)), listNumbers: L.numbers, cardNumbers: C.numbers, listHeight: L.height, cardHeight: C.height }; };
  o.s4 = { wo1: { card: await pillOf(`[data-test-id="board_card_${w1.id}"]`) } }; o.s4.wo1.compare = cmp(o.s1.wo1, o.s4.wo1.card); o.s4.wo1.picture = await clip(p, 'C590120-s4-card-wo1-pill', boxOf(o.s4.wo1.card), 40);
  await cardPic(w2.id, 'C590120-s4-wo2-card'); o.s4.wo2 = { card: await pillOf(`[data-test-id="board_card_${w2.id}"]`) }; o.s4.wo2.compare = cmp(o.s1.wo2, o.s4.wo2.card); o.s4.wo2.picture = await clip(p, 'C590120-s4-card-wo2-pill', boxOf(o.s4.wo2.card), 40);
  // step 5: WO2's number and the padlock right after it
  o.s5_wo2 = { number: await D(p, `(function () { var c = __D.q('[data-test-id="board_card_${w2.id}"]'); var n = c && c.querySelector('[data-test-id="board_card_number"]'); return n ? { number: __D.desc(n), rowParts: __D.parts(n.parentElement, 8), icons: __D.icons(n.parentElement) } : null; })()`), picture: await cardPic(w2.id, 'C590120-s5-wo2-number') };
  // the red-count work order on the board (searched by its number; its column is wherever its lead is)
  if (redWo) { await search(p, redWo.number); await W(2500); await toColumn(p, redWo.lead ?? 'unassigned').catch(() => {}); const where = await D(p, `__D.whereCard(${J(redWo.id)})`);
    await cardPic(redWo.id, 'C590120-s4-red-count-card'); o.s4.red = { card: await pillOf(`[data-test-id="board_card_${redWo.id}"]`), column: where }; o.s4.red.compare = cmp(o.s1.red, o.s4.red.card); o.s4.red.picture = await clip(p, 'C590120-s4-card-red-count-pill', boxOf(o.s4.red.card), 40);
    await search(p, c.name); await W(2000); await toColumn(p, A.staff); }
  // steps 6-7: Compact, Comfortable: same fields and values, text 14 / 12 px, card avatars 24 px, pills 22 px
  for (const [d, k] of [['compact', 's6'], ['comfortable', 's7']] as const) { o[k] = { menu: await density(p, d), card: await D(p, `__D.card(${J(w1.id)})`), sizes: await sizes(), avatars: await avatarSizes(), wo1PillHeight: ((await pillOf(`[data-test-id="board_card_${w1.id}"]`)) as any)?.height ?? null, picture: await cardPic(w1.id, `C590120-${k}-${d}-card`) };
    const p2: any = await pillOf(`[data-test-id="board_card_${w2.id}"]`); o[k].wo2PillHeight = p2?.height ?? null; }
  await density(p, 'regular'); o.backAtRegular = await sizes(); await search(p, '');
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

/** FIX-UP 2 (17 Oct 2026, C590124): on 16 Oct the avatar box was measured BEFORE the mouse was moved away and the page re-laid, so the
 *  hover landed beside the avatars and no name bubble was read. The first avatar of the container is now MARKED, brought on screen,
 *  measured at that moment, hovered at its own centre, and document.elementFromPoint at that centre must be the avatar (or inside it):
 *  `hit.onAvatar` is the positive control for any "no bubble" reading. If the first move misses, Playwright's own hover() is tried. */
async function hoverAvatar(pg: Page, containerExpr: string, tag: string) {
  const initials = await D(pg, `(function () { document.querySelectorAll('[data-zz-av]').forEach(function (e) { e.removeAttribute('data-zz-av'); }); var c = ${containerExpr}; if (!c) return null; var a = c.querySelector('.q-avatar') || c.querySelector('[class*="avatar"]'); if (!a) return null; a.setAttribute('data-zz-av', '1'); return (a.innerText || '').trim() || '(no text)'; })()`);
  if (!initials || initials.evalError) return { found: false, why: initials?.evalError ?? 'no avatar in the container' };
  const l = pg.locator('[data-zz-av="1"]').first(); await l.scrollIntoViewIfNeeded().catch(() => {}); await W(500, pg);
  const bb = await l.boundingBox(); if (!bb) return { found: true, initials, why: 'no box' };
  const box: any = { x: bb.x, y: bb.y, w: bb.width, h: bb.height, r: bb.x + bb.width, b: bb.y + bb.height };
  const hitNow = () => pg.evaluate(`(() => { const a = document.querySelector('[data-zz-av="1"]'); if (!a) return null; const r = a.getBoundingClientRect(); const e = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return { onAvatar: !!e && (e === a || a.contains(e)), at: e ? e.tagName + '.' + String(e.className).slice(0, 40) : null, hovered: a.matches(':hover') }; })()`).catch(() => null) as Promise<any>;
  await pg.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 6 }); await W(1400, pg); let hit = await hitNow();
  if (!hit?.hovered) { await l.hover({ timeout: 5000 }).catch(() => {}); await W(1400, pg); hit = { ...(await hitNow()), retriedWithLocatorHover: true }; }
  const tp = await D(pg, '__D.tips()');
  return { found: true, initials, box, hit, tooltips: tp, place: rel(tp?.[0]?.box ?? null, box), picture: await clip(pg, `C590124-${tag}`, box, 70) };
}
await run('C590124', async (o) => { // hover looks: row, card, avatar name bubbles
  const A = await tech('DC15', 'Vic Hover'), B = await tech('DC15', 'Wes Hover'); const c = await cust('ZZAUTOTEST DC15 Hover Looks');
  const w1 = await mkWO(c, { lead: A.staff, line: true, lineTech: B.staff }); o.wo1 = brief(w1);
  o.prep = await prep([A.staff, B.staff], 'Board View'); o.fields = await lineTechsOn(); await display(p, 'Tech View'); await away();
  await rowOn(p, w1.id, c.name, A.staff); await away();
  const rsel = `[data-test-id="tech_view_row_${w1.id}"]`; const rb = await D(p, `__D.desc(__D.q(${J(rsel)}), true)`);
  await hoverSel(p, rsel); o.s2_row = { before: rb, after: await D(p, `__D.desc(__D.q(${J(rsel)}), true)`), firstCellBgAfter: await D(p, `getComputedStyle(__D.q(${J(rsel)}).querySelector('td')).backgroundColor`), picture: await clip(p, 'C590124-s2-row-hover', rb?.box ?? null, 30) };
  const av = (await D(p, `__D.avs(__D.cell(${J(w1.id)}, 'Assigned Techs'))`)) ?? []; o.s3_avatars = av;
  await away(); o.s3_hover = await hoverAvatar(p, `__D.cell(${J(w1.id)}, 'Assigned Techs')`, 's3-avatar-hover');   // fix-up 2: hovered at the avatar's own centre, hit checked
  await away(); await display(p, 'Board View'); await toColumn(p, A.staff); await away();
  const csel = `[data-test-id="board_card_${w1.id}"]`; const cbf = await D(p, `__D.desc(__D.q(${J(csel)}), true)`);
  await hoverSel(p, csel); o.s5_card = { before: cbf, after: await D(p, `__D.desc(__D.q(${J(csel)}), true)`), picture: await clip(p, 'C590124-s5-card-hover', cbf?.box ?? null, 20) };
  const cav = (await D(p, `__D.avs(__D.q('[data-test-id="board_card_field_line_technicians"]', __D.q(${J(csel)})) || __D.q(${J(csel)}))`)) ?? []; o.s6_avatars = cav;
  await away(); o.s6_hover = await hoverAvatar(p, `(__D.q('[data-test-id="board_card_field_line_technicians"]', __D.q(${J(csel)})) || __D.q(${J(csel)}))`, 's6-card-avatar-hover');   // fix-up 2
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
    // 16 Oct 2026 (second go): Light and Dark are two buttons inside ONE menu row ("light_mode Light dark_mode Dark"), so the row filter
    // never matched; click the button whose own words are exactly Light / Dark
    let it = p.locator('.q-menu button, .q-menu .q-btn, .q-menu [role="radio"], .q-menu [role="button"]').filter({ hasText: word }).last();
    if (!(await it.count())) it = p.locator('.q-menu').getByText(word).last();
    const found = await it.count(); if (found) await it.click().catch(() => {}); await W(1500); const closedAfter = await menuClosed(); await W(1500); return { items, found, closedAfter }; };
  o.s1_lightBefore = { body: (await D(p, SCAN))?.body };
  o.s2_choose = await choose(/^\s*(dark_mode\s*)?Dark\s*$/i); o.s2_pic = await pic(p, 'C590125-s2-after-dark');
  o.s3_tech = await D(p, SCAN); o.s3_pic = await pic(p, 'C590125-s3-tech-dark');
  o.find = await rowOn(p, w1.id, c.name, A.staff); await away();
  const rsel = `[data-test-id="tech_view_row_${w1.id}"]`;
  const rowBg = () => D(p, `(function () { var r = document.querySelector(${J(rsel)}); if (!r) return null; var td = r.querySelector('td'); return { tr: getComputedStyle(r).backgroundColor, td: td ? getComputedStyle(td).backgroundColor : null, text: td ? getComputedStyle(td).color : null }; })()`);
  const rb0 = await rowBg(); await hoverSel(p, rsel); o.s4_hover = { before: rb0, after: await rowBg(), picture: await clip(p, 'C590125-s4-row-hover-dark', await D(p, `__D.box(__D.q(${J(rsel)}))`), 60) };
  await away(); if (o.find.usedSearch) await search(p, '');
  await display(p, 'Board View'); await away(); o.s6_board = await D(p, SCAN); o.s6_pic = await pic(p, 'C590125-s6-board-dark');
  o.s7_choose = await choose(/^\s*(light_mode\s*)?Light\s*$/i); o.s7_board = await D(p, SCAN); o.s7_pic = await pic(p, 'C590125-s7-board-light');
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
  // 22 Oct 2026: production read 0 list items (the kit looks for .q-item / role=option); when that happens, read the open list's tick boxes too (extra reading only)
  if (!o.s4_list.count) o.s4_list.itemsFallback = await p.evaluate(`(() => { const ms = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().height > 0); const m = ms[ms.length - 1]; if (!m) return 'no open list';
      return [...m.querySelectorAll('.q-checkbox, [role="checkbox"], label')].map(e => ({ text: (e.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 60), checked: e.getAttribute('aria-checked') })).filter(x => x.text).slice(0, 40); })()`).catch((e: any) => String(e).slice(0, 120));
  o.s4_pic = await pic(p, 'C590127-s4-technician-list');
  const it = p.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: A.name }).first();
  if (await it.count()) { await it.scrollIntoViewIfNeeded().catch(() => {}); await it.click(); await W(1500); o.s5_ticked = true; } else { o.s5_ticked = false; o.s5_note = `${A.name} not in the open list`; }
  o.s5_pic = await pic(p, 'C590127-s5-ticked');
  // 22 Oct 2026 (production): step 5 is "Press Escape" -> "the list closes". Read and picture RIGHT AFTER Escape, before any other mouse or
  // key action (the old away() click/move came first, so Escape alone was never isolated): visible .q-menu count before and after, the chip.
  const openMenus = () => p.evaluate(`[...document.querySelectorAll('.q-menu')].filter(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden'; }).length`).catch(() => null);
  o.s5_escape = { visibleMenusBefore: await openMenus() }; await p.keyboard.press('Escape'); await W(800);
  o.s5_escape.visibleMenusAfter = await openMenus(); o.s5_escape.chip = (await chip.innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
  o.s5_escape.picture = await pic(p, 'C590127-s5-after-escape');
  console.log(t(), 'C590127 step 5 after Escape', JSON.stringify(o.s5_escape));
  await away();
  o.s6_chips = (await D(p, '__D.chips()'))?.map((x: any) => x.text);
  await display(p, 'Board View'); await away(); o.s7_board = { chips: await D(p, '__D.chips()'), columns: (await D(p, `__D.cols().map(function (c) { return c.getAttribute('data-test-id').replace('board_column_', ''); })`))?.map((x: string) => x === A.staff ? 'Technician-A' : x), picture: await pic(p, 'C590127-s7-board') };
  await display(p, 'List'); await away(); o.s8_list = { chips: await D(p, '__D.chips()'), picture: await pic(p, 'C590127-s8-list') };
  // put the choice back (filters are also cleared by the next case's set-up)
  await display(p, 'Tech View'); const chip2 = p.locator('[data-test-id^="filter_chip_"]').filter({ hasText: /Technician/ }).first();
  if (await chip2.count()) { await chip2.click(); await W(1000); const it2 = p.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: A.name }).first(); if (await it2.count()) { await it2.click(); await W(1200); } await p.keyboard.press('Escape').catch(() => {}); }
});

await run('C590128', async (o) => { // density sizes in Tech View, and Board card avatars at Comfortable and Compact
  // 16 Oct 2026: follows the case as rewritten (exact avatar sizes per density - rows / Service Advisor 20-24-32 px, group header 24-28-36 px -
  // and NEW steps 7-10: Board View, the density menu shows Comfortable in use, Work-order-1's card avatars read at Comfortable, Compact
  // chosen, read again: 24 px both times). Starting screen as the case: Customer-A's name in Search. Readings keyed by step: s1_s2_compact,
  // s3_s4_regular, s5_s6_comfortable (menu = the step that chooses, the rest = the step that looks), s7 .. s10 on the board.
  const A = await tech('DC19', 'Zoe Density'), B = await tech('DC19', 'Abe Density'); const c = await cust('ZZAUTOTEST DC19 Density Sizes');
  const w1 = await mkWO(c, { lead: A.staff, line: true, lineTech: B.staff }); o.wo1 = brief(w1);
  o.prep = await prep([A.staff, B.staff], 'Tech View'); await search(p, c.name); o.searchHolds = await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null);
  o.find = await rowOn(p, w1.id, c.name, A.staff);
  // 15 Oct 2026 (redo): a density change redraws the table, so the row is centred again after each one before it is read
  const read = async (d: string, tag: string) => ({ menu: await density(p, d as any), centred: await centre(p, `[data-test-id="tech_view_row_${w1.id}"]`), row: await D(p, `__D.row(${J(w1.id)})`), groupHeader: await D(p, `(function () { var h = __D.groupHdr(${J(A.staff)}); return h ? { h: h.box.h, avatars: h.avatars, name: h.name && h.name.st } : null; })()`),
    assigned: await D(p, `__D.avs(__D.cell(${J(w1.id)}, 'Assigned Techs'))`), advisor: await D(p, `__D.avs(__D.cell(${J(w1.id)}, 'Service Advisor'))`), progress: await D(p, `__D.bars(__D.cell(${J(w1.id)}, 'Progress'))`),
    rowText: await D(p, `__D.parts(__D.rowEl(${J(w1.id)}), 30).filter(function (x) { return x.kind === 'text'; }).map(function (x) { return x.text + ' ' + x.fontSize + '/' + x.fontWeight; })`),
    headLabels: await D(p, `__D.qa('thead th').map(function (th) { var t = (th.innerText || '').replace(/\\s+/g, ' ').trim(); var leaf = Array.prototype.filter.call(th.querySelectorAll('*'), function (e) { return e.childElementCount === 0 && (e.textContent || '').trim() && !e.closest('.q-icon,i,svg'); })[0] || th; return t ? t + ' ' + getComputedStyle(leaf).fontSize : null; }).filter(Boolean)`), // 16 Oct: header labels judged too
    picture: await pic(p, `C590128-${tag}-${d}`) });
  o.s1_s2_compact = await read('compact', 's1-s2'); o.s3_s4_regular = await read('regular', 's3-s4'); o.s5_s6_comfortable = await read('comfortable', 's5-s6');
  // step 7: Board View (Line technicians on, as the preconditions say), the density button: Comfortable in use here too
  await display(p, 'Board View'); o.fields = await lineTechsOn(); o.s7_searchAfterSwitch = await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null);
  o.s7_cardFound = await findCard(p, w1.id, A.staff, c.name);
  await p.locator('[data-test-id="button_density"]').first().click(); await W(900);
  o.s7_boardMenu = { menu: await D(p, '__D.menu()'), picture: await pic(p, 'C590128-s7-board-density-menu') };
  await p.keyboard.press('Escape').catch(() => {}); await away();
  // step 8: Work-order-1's card avatars at Comfortable
  const cardAvs = async () => { await p.evaluate(`document.querySelector('[data-test-id="board_card_${w1.id}"]')?.scrollIntoView({ block: 'center', inline: 'center' })`).catch(() => {}); await W(700);
    return { avatars: await D(p, `__D.avs(__D.q('[data-test-id="board_card_${w1.id}"]')).map(function (v) { return { w: v.box.w, h: v.box.h, text: v.text, img: !!v.img, tid: v.tid }; })`), cardBox: await D(p, `__D.box(__D.q('[data-test-id="board_card_${w1.id}"]'))`) }; };
  o.s8_comfortable = await cardAvs(); o.s8_comfortable.picture = await clip(p, 'C590128-s8-card-comfortable', o.s8_comfortable.cardBox, 12);
  // step 9: choose Compact in the density menu
  o.s9_menu = await density(p, 'compact');
  // step 10: the same card's avatars at Compact (24 px expected again)
  o.s10_compact = await cardAvs(); o.s10_compact.picture = await clip(p, 'C590128-s10-card-compact', o.s10_compact.cardBox, 12);
  await density(p, 'regular'); await search(p, '');
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
  // FIX-UP 2 (17 Oct 2026): the dialog draws only ~30 rows of a long name-sorted list, so Technician-A ("… DC20 Bea Dialog", a Z name) was
  // never among them and its row was not read. The dialog's own list is now scrolled until each technician's row is drawn; the row is
  // marked, centred, read (__D.desc: avatar photo or initials, sizes, colours) and photographed. The current lead's row is Technician-A's.
  const findInDialog = (rx: string) => p.evaluate(`(async () => { document.querySelectorAll('[data-zz-row]').forEach(e => e.removeAttribute('data-zz-row')); const d = [...document.querySelectorAll('.q-dialog')].pop(); if (!d) return { dialog: false };
    const sc = [d, ...d.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(e).overflowY)); const s = sc.pop() || d; s.scrollTop = 0; await new Promise(r => setTimeout(r, 300));
    for (let i = 0; i < 150; i++) { const it = [...d.querySelectorAll('.q-item, [role=option], [data-test-id]')].find(e => new RegExp(${JSON.stringify(rx)}).test(e.innerText || '') && (e.innerText || '').length < 200);
      if (it) { it.setAttribute('data-zz-row', '1'); it.scrollIntoView({ block: 'center' }); return { found: true, steps: i, tid: it.getAttribute('data-test-id'), text: it.innerText.replace(/\\s+/g, ' ').trim().slice(0, 120), photo: !!it.querySelector('img'), avatarText: ((it.querySelector('.q-avatar') || {}).innerText || '').trim() }; }
      const b = s.scrollTop; s.scrollTop += 200; await new Promise(r => setTimeout(r, 250)); if (s.scrollTop === b) break; } return { found: false }; })()`).catch((e) => ({ error: String(e?.message || e).slice(0, 120) })) as Promise<any>;
  for (const [who, rx] of [['Technician-A', 'DC20 Bea Dialog'], ['Technician-B', 'DC20 Cal Dialog']] as const) {
    const f = await findInDialog(rx); await W(600);
    o[`s5_row_${who}`] = { ...f, desc: f?.found ? await D(p, `__D.desc(document.querySelector('[data-zz-row]'), true)`) : null, picture: f?.found ? await clip(p, `C590129-s5-row-${who}`, await D(p, `__D.box(document.querySelector('[data-zz-row]'))`), 12) : null };
    console.log(t(), 'C590129 dialog row', who, JSON.stringify({ found: f?.found ?? false, text: f?.text ?? null, photo: f?.photo ?? null, avatarText: f?.avatarText ?? null })); }
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
  // 22 Oct 2026 (production): finishing the only line made the work order Complete at once (production's "Require Review Before
  // Completion" is off), and production then refused In Progress / Ready For Review ("Complete work order cannot change its status
  // again.", 400). Same fallback as C590112, which reached Ready For Review on production today: when the status read back is not
  // ready_for_review, "Require Review Before Completion" is switched on (setRequireReview), the same moves are made again, the status is
  // read back, and the setting is put back in finally. Staging reached Ready For Review on the first try, so there nothing changes.
  const toReview = async () => { const log: string[] = [];
    for (const l of await linesRaw(w2.id)) { log.push(`story ${say(await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'Done', work_order_id: w2.id }))}`); log.push(`line complete ${say(await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, status: 'complete', workOrderId: w2.id }))}`); }
    for (const st of ['in_progress', 'ready_for_review']) log.push(`${st} ${say(await a.post('/api/work-orders/change-status', { id: w2.id, work_order: w2.id, status: st }))}`);
    return { log, status: (await workOrders(a, c.name)).find((x: any) => x.id === w2.id)?.status }; };
  let rr: any = null;
  try {
    o.wo2setup = await toReview(); w2.log.push(...o.wo2setup.log.filter((x: string) => /line complete|in_progress|ready_for_review/.test(x)));
    if (o.wo2setup.status !== 'ready_for_review') { rr = await setRequireReview(a, true); o.requireReviewOn = rr; o.wo2retry = await toReview(); w2.log.length = 0; w2.log.push(...o.wo2retry.log); }
  } finally { if (rr && rr.before === false) o.requireReviewPutBack = await setRequireReview(a, false); }
  o.wo2statusReadBack = (await workOrders(a, c.name)).find((x: any) => x.id === w2.id)?.status;
  console.log(t(), 'START STATE set C598326 (Work-order-2 in Ready For Review?)', JSON.stringify({ first: o.wo2setup, requireReviewOn: o.requireReviewOn ?? null, retry: o.wo2retry ?? null, putBack: o.requireReviewPutBack ?? null, statusNow: o.wo2statusReadBack }));
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
  // 16 Oct 2026 (second go): jumping to scrollHeight landed at the end of the WHOLE table (the technician groups after Unassigned), not at
  // the end of Unassigned, and the heading row was measured from <thead> (which scrolls; only its cells are sticky). Now: scroll down in
  // 1,200 px steps (more Unassigned rows load in batches as the loaded ones run out) until the FIRST technician group header (in page
  // order) comes within 300 px under the heading cells; the heading row is read from 'thead th'.
  const firstTech = `(function () { var th = document.querySelector('thead th'); var hb = th ? th.getBoundingClientRect().bottom : 188; var g = Array.prototype.filter.call(document.querySelectorAll('[data-test-id^="tech_view_group_"]'), function (e) { return /^tech_view_group_[0-9a-f-]{36}$/.test(e.getAttribute('data-test-id')); })[0]; if (!g) return null; var r = g.getBoundingClientRect(); var n = g.querySelector('[data-test-id^="tech_view_group_name_"]'); return { id: g.getAttribute('data-test-id').replace('tech_view_group_', ''), name: n ? n.textContent.trim() : '?', gap: Math.round(r.top - hb), rows: document.querySelectorAll('[data-test-id^="tech_view_row_"]').length, scrollTop: document.querySelector('.q-table__middle').scrollTop, scrollH: document.querySelector('.q-table__middle').scrollHeight }; })()`;
  let nid: string | null = null; const t0 = Date.now(); o.s4_load = []; let last: any = null;
  await p.evaluate(`document.querySelector('.q-table__middle').scrollTop = 0`); await W(800);
  for (let i = 0; i < 500 && Date.now() - t0 < 15 * 60_000; i++) {
    last = await D(p, firstTech);
    // 16 Oct 2026 (third go): reaching the next group's header starts the next batch of Unassigned rows, which pushes it away again;
    // so wait 3 s once it is near, and stop only if it is still near and the table did not grow
    if (last && last.gap <= 300 && last.gap > -60) { await W(3000); const again: any = await D(p, firstTech); if (again && again.gap <= 300 && again.gap > -60 && again.scrollH === last.scrollH) { last = again; nid = last.id; break; } last = again; continue; }
    if (last && last.gap <= -60) { await p.evaluate(`document.querySelector('.q-table__middle').scrollTop += ${-last.gap + 250}`); await W(900); continue; }
    if (i % 10 === 0) o.s4_load.push(last ?? { i, none: true });
    await p.evaluate(`document.querySelector('.q-table__middle').scrollTop += 1200`); await W(700); }
  o.s4_nextGroup = { found: !!nid, seconds: Math.round((Date.now() - t0) / 1000), at: last };
  if (!nid) return;
  // the header held under the headings is drawn as its own '.tech-view-group-header' element, not inside the group's row: read every one
  const hdrs = `(function () { var th = document.querySelector('thead th'); var hb = th ? Math.round(th.getBoundingClientRect().bottom) : null; return { headingBottom: hb, headers: __D.qa('.tech-view-group-header').map(function (d) { var n = d.querySelector('[data-test-id^="tech_view_group_name_"]'); var tr = d.closest('[data-test-id^="tech_view_group_"]'); return { group: (n ? n.textContent.trim() : (d.innerText || '').replace(/\\s+/g, ' ').slice(0, 30)), inRow: !!tr, header: __D.box(d), position: getComputedStyle(d).position }; }).filter(function (h) { return h.header && h.header.b > 100 && h.header.y < 900; }),
    justUnderHeadings: hb ? (function () { var es = document.elementsFromPoint(300, hb + 8); var g = es.map(function (x) { return x.closest && x.closest('[data-test-id^="tech_view_group_"]'); }).filter(Boolean)[0]; if (!g) return es[0] ? 'row/other: ' + String(es[0].closest('tr') ? (es[0].closest('tr').innerText || '').slice(0, 30) : es[0].className).slice(0, 40) : null; var n = g.querySelector('[data-test-id^="tech_view_group_name_"]'); return n ? n.textContent.trim() : g.getAttribute('data-test-id'); })() : null }; })()`;
  await p.evaluate(`document.querySelector('.q-table__middle').scrollTop += ${(last?.gap ?? 220) - 220}`); await W(1500);
  o.s4_s5_walk = []; const shotsAt = new Set([0, 8, 10, 12, 14, 16]);
  for (let k = 0; k <= 16; k++) { const r: any = await D(p, hdrs); r.step = k; if (shotsAt.has(k)) r.picture = await pic(p, `C590131-s5-handover-${String(k).padStart(2, '0')}`); o.s4_s5_walk.push(r);
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
