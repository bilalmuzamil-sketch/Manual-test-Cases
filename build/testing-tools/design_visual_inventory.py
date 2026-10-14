#!/usr/bin/env python3
"""design_visual_inventory.py — the VISUAL inventory of a design package (Rule 126 point 3, skill 21 §4b).

The text inventory (design_text_inventory.py) proves every WORD of a design is covered. It cannot see a look: an icon,
a grip, a 4 px size, a gutter, a panel, a cell style, a tooltip that opens over the header row. This tool renders every
board / screen / state the config names and lists, per state, what a reviewer can SEE:

  * icons — the design's own icon name (matched against the design's icon registry, e.g. Lucide SV_LUCIDE), size, colour,
    the control it sits on and the screen region it is in; inline SVGs that are not in the registry are named by shape
    (a six-circle SVG is reported as a six-dot grip)
  * handles / grips per row type, with the count of rows that show one and rows that do not
  * table column headers, in order (the DEFAULT set shown before any change), with label style (size, weight, colour,
    tracking), whether the header row is sticky, label-to-label gaps, overlaps and clipping
  * cell renderers per column (link / bar / avatar / avatar stack / pill / square badge / icon / dash / plain) with colour,
    font size, pill height, avatar size, bar size
  * group headers, cards and any other configured row types: their icons in order, avatar kind, text styles, height
  * page frame — for each configured target (a table header, a board's column strip): distance to the viewport edges, every
    ancestor that paints a background, radius, padding, shadow or border, and whether the target sits inside a card/panel
  * every pill / badge on the screen with its height (so a size that follows a density setting is visible per state)
  * overlays opened by a probe (tooltip, menu, popover, dialog): where they open relative to the host (above / below /
    left / right), and whether they cover a column header row; a host that only has a native title is reported as such
  * hover effects of a probe target (background, border, shadow, opacity changes on it and its descendants)
  * text overlap between neighbouring labels and clipping (with and without an ellipsis), anywhere on the screen
  * sticky behaviour of configured elements after scrolling their scroller

It is project-agnostic. Everything specific to one design lives in a JSON config (boards, prop variants, the actions that
reach each state, the selectors that name regions / header rows / row types / frame targets / probes). Rendering reuses
drive_design_full.py (local http server, CDN cache, browser, render wait) — imported, not copied.

Usage:
    python3 build/testing-tools/design_visual_inventory.py --design <package dir> --config <config.json> --out <out dir>
        [--only <state-id-substring> ...] [--resume] [--library <file or dir> ...] [--screens]

Writes <out>/visual-inventory.json (every state, raw), <out>/visual-rows.json (one row per distinct observation, with the
states it was seen in), <out>/VISUAL-INVENTORY.md (readable), <out>/library-rules.json (every always/never/must/should
sentence in --library files, with file:line), <out>/shots/<state>.png, and <out>/checkpoint.json (resumable).

Config (JSON) — every key optional except "states":
{
  "widths": [1440, 1536],               # default viewport widths; a state may override with "width"
  "height": 900,
  "themes": {"light": {"color_scheme": "light", "eval": []}, "dark": {"color_scheme": "dark", "eval": ["..."]}},
  "regions": [["menu", "[role=menu]"], ["row", "[data-row]"], ...],   # first match wins; order specific -> general
  "icon_registry_js": "window.SV_LUCIDE",       # an expression returning {name: inner svg markup}
  "column_header_rows": ["thead tr", "..."],
  "row_types": {"row": "[data-row]", "group_header": "[data-group-head]", "card": "[data-card]"},
  "cell_rows": ["tbody tr", "..."],             # rows whose cells are classified against the header columns
  "frame_targets": [{"name": "table", "selector": "..."}],
  "overlay_selectors": ["[role=tooltip]", "[role=menu]", "[role=dialog]"],
  "sticky_probes": [{"name": "...", "selector": "...", "scroller": "...", "dy": 400, "dx": 0}],
  "accent_token": "--sv-accent",
  "states": [ {"id": "...", "board": "file.html", "props": {"propName": value}, "theme": "light", "width": 1440,
               "meta": {"view": "...", "density": "..."},
               "actions": [{"click": "css"}, {"click_text": "Compact"}, {"hover": "css"}, {"dispatch": ["css", "mouseover"]},
                           {"press": "Escape"}, {"eval": "js"}, {"wait": 500}, {"scroll": ["css", dx, dy]}],
               "probe": {"host": "css", "kind": "tooltip|menu|hover"} } ],
  "matrix": [ {"id": "...", "boards": [...], "themes": [...], "widths": [...], "variants": [{"id": "...", "props": {}, "meta": {}, "actions": []}]} ]
}
"""
import argparse, hashlib, html as htmllib, importlib.util, json, pathlib, re, shutil, sys, time, traceback, urllib.parse

HERE = pathlib.Path(__file__).resolve().parent
_spec = importlib.util.spec_from_file_location("ddf", HERE / "drive_design_full.py")
ddf = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(ddf)

# ------------------------------------------------------------------------------------------------ in-page extraction
EXTRACT_JS = r"""
(cfg) => {
  const out = {};
  const cs = (e) => getComputedStyle(e);
  const vis = (el, inViewport = true) => {
    if (!el || !el.getBoundingClientRect) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 0.5 || r.height < 0.5) return false;
    if (el.checkVisibility && !el.checkVisibility({checkOpacity: true, checkVisibilityCSS: true})) return false;
    if (!inViewport) return true;
    return r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth;
  };
  const rr = (r) => [Math.round(r.left * 10) / 10, Math.round(r.top * 10) / 10, Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10];
  const R = (el) => rr(el.getBoundingClientRect());
  const transparent = (c) => !c || c === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(c);
  const pick = (s, keys) => { const o = {}; keys.forEach(k => o[k] = s[k]); return o; };

  // ---- colour tokens: every custom property declared in same-origin stylesheets, resolved through a probe
  const tokNames = new Set();
  for (const sh of Array.from(document.styleSheets)) {
    let rules; try { rules = sh.cssRules; } catch (e) { continue; }
    const walk = (rs) => { for (const r of Array.from(rs || [])) { if (r.style) { for (let i = 0; i < r.style.length; i++) { const n = r.style[i]; if (n.startsWith('--')) tokNames.add(n); } } if (r.cssRules) walk(r.cssRules); } };
    walk(rules);
  }
  const probe = document.createElement('span'); probe.style.display = 'none'; document.body.appendChild(probe);
  const rgb2tok = {};
  const pref = cfg.token_prefer || [];
  for (const n of tokNames) {
    const raw = cs(document.documentElement).getPropertyValue(n).trim();
    if (!raw || !/^(#|rgb|hsl|var\(|color-mix)/i.test(raw)) continue;
    probe.style.color = ''; probe.style.color = 'var(' + n + ')';
    const v = cs(probe).color; if (!v) continue;
    (rgb2tok[v] = rgb2tok[v] || []).push(n);
  }
  const accentVal = (() => { probe.style.color = 'var(' + (cfg.accent_token || '--sv-accent') + ')'; return cs(probe).color; })();
  probe.remove();
  const prefBg = cfg.token_prefer_bg || pref;
  const rank = (n, pl) => { const i = pl.findIndex(p => n.startsWith(p)); return (i < 0 ? 99 : i) * 1000 + n.length; };
  const tok = (c) => { const l = rgb2tok[c]; return l ? l.slice().sort((a, b) => rank(a, pref) - rank(b, pref)).slice(0, 3) : []; };
  const tokBg = (c) => { const l = rgb2tok[c]; return l ? l.slice().sort((a, b) => rank(a, prefBg) - rank(b, prefBg)).slice(0, 3) : []; };
  out.accent = accentVal;

  // ---- icon registry signatures
  const SHAPES = 'path,circle,line,rect,polyline,polygon,ellipse';
  const GEO = ['d', 'cx', 'cy', 'r', 'x', 'y', 'width', 'height', 'x1', 'x2', 'y1', 'y2', 'points', 'rx', 'ry'];
  const sigOf = (svg) => Array.from(svg.querySelectorAll(SHAPES)).map(n => n.tagName.toLowerCase() + ':' + GEO.map(a => (n.getAttribute(a) || '').replace(/\s+/g, ' ').trim()).join(',')).sort().join('|');
  const reg = {};
  let regSrc = {};
  try { regSrc = (cfg.icon_registry_js ? (0, eval)(cfg.icon_registry_js) : (window.SV_LUCIDE || {})) || {}; } catch (e) { regSrc = {}; }
  const tmp = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  regSrc = Object.assign({}, cfg.extra_icons || {}, regSrc);
  for (const [name, markup] of Object.entries(regSrc)) { try { tmp.innerHTML = markup; const k = sigOf(tmp); if (!reg[k]) reg[k] = name; } catch (e) {} }
  out.icon_registry_size = Object.keys(regSrc).length;
  const iconName = (svg) => {
    if (svg.dataset && svg.dataset.lucide) return svg.dataset.lucide;
    const cls = (svg.getAttribute('class') || '').match(/lucide-([a-z0-9-]+)/); if (cls) return cls[1];
    const s = sigOf(svg); if (reg[s]) return reg[s];
    const shapes = Array.from(svg.querySelectorAll(SHAPES));
    if (shapes.length === 6 && shapes.every(n => n.tagName.toLowerCase() === 'circle')) return 'six-dot grip (drawn in the page, not from the icon set)';
    return 'unnamed svg #' + Math.abs(Array.from(s).reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) | 0, 7)).toString(36).slice(0, 6) + ' (' + shapes.length + ' shapes)';
  };

  const regions = cfg.regions || [];
  const regionOf = (el) => { for (const [name, sel] of regions) { try { if (el.closest(sel)) return name; } catch (e) {} } return 'other'; };
  const HOST = 'button,a,[role=button],[role=menuitem],[role=tab],[title],[aria-label],[data-tip-text]';
  const hostOf = (el) => { let h = el.parentElement && el.parentElement.closest(HOST); return h; };
  const labelOf = (h) => !h ? '' : ((h.getAttribute('aria-label') || h.getAttribute('title') || (h.dataset ? h.dataset.tipText : '') || h.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 50));

  // ---- 1. icons
  const icons = [];
  document.querySelectorAll('svg').forEach(svg => {
    if (svg.parentElement && svg.parentElement.closest('svg')) return;
    if (!vis(svg)) return;
    const r = svg.getBoundingClientRect(); const s = cs(svg);
    const h = hostOf(svg);
    icons.push({name: iconName(svg), w: Math.round(r.width), h: Math.round(r.height), color: s.color, color_tok: tok(s.color),
                region: regionOf(svg), host: labelOf(h), host_tag: h ? h.tagName.toLowerCase() : '', rect: rr(r)});
  });
  out.icons = icons;

  // ---- 2. column header rows
  const textRect = (el) => {
    const rg = document.createRange(); let L = 1e9, T = 1e9, Rt = -1e9, B = -1e9, any = false;
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) { if (!n.textContent.trim()) continue; const pe = n.parentElement; if (pe && pe.checkVisibility && !pe.checkVisibility({checkOpacity: true, checkVisibilityCSS: true})) continue;
      rg.selectNodeContents(n); for (const q of Array.from(rg.getClientRects())) { if (q.width < 0.5) continue; any = true; L = Math.min(L, q.left); T = Math.min(T, q.top); Rt = Math.max(Rt, q.right); B = Math.max(B, q.bottom); } }
    return any ? [L, T, Rt, B] : null;
  };
  const deepestText = (el) => { const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { if (n.textContent.trim()) return n.parentElement; } return el; };
  const headers = [];
  for (const sel of (cfg.column_header_rows || ['thead tr'])) {
    let rows; try { rows = document.querySelectorAll(sel); } catch (e) { continue; }
    rows.forEach(hr => {
      if (!vis(hr, false)) return;
      const cells = Array.from(hr.children).filter(c => vis(c, false));
      const hs = cs(hr);
      const cl = cells.map(c => {
        const t = (c.innerText || '').replace(/\s+/g, ' ').trim();
        const svg = c.querySelector('svg');
        const te = deepestText(c); const s = cs(te);
        return {text: t, title: c.getAttribute('title') || c.getAttribute('aria-label') || '', icon: svg && vis(svg, false) ? iconName(svg) : '',
                rect: R(c), text_rect: textRect(c), font_size: s.fontSize, font_weight: s.fontWeight, color: s.color, color_tok: tok(s.color),
                letter_spacing: s.letterSpacing, text_transform: s.textTransform, text_align: s.textAlign,
                clipped: c.scrollWidth > c.clientWidth + 1, ellipsis: s.textOverflow === 'ellipsis'};
      });
      const gaps = [];
      for (let i = 0; i + 1 < cl.length; i++) {
        const a = cl[i].text_rect, b = cl[i + 1].text_rect;
        if (a && b) gaps.push({left: cl[i].text || cl[i].icon || cl[i].title, right: cl[i + 1].text || cl[i + 1].icon || cl[i + 1].title, gap: Math.round((b[0] - a[2]) * 10) / 10});
      }
      headers.push({selector: sel, region: regionOf(hr), rect: R(hr), position: hs.position, top: hs.top, bg: hs.backgroundColor, bg_tok: tokBg(hs.backgroundColor),
                    border_bottom: hs.borderBottomWidth + ' ' + hs.borderBottomStyle + ' ' + hs.borderBottomColor, cells: cl, gaps});
    });
  }
  out.headers = headers;

  // ---- 3. cell renderers (rows classified against the first visible header row with the same column count logic)
  const avatarLike = (e, r, s) => r.width >= 12 && r.width <= 56 && Math.abs(r.width - r.height) <= 1.5 && (e.tagName === 'IMG' || (parseFloat(s.borderTopLeftRadius) >= r.width / 2 - 1 && !transparent(s.backgroundColor)));
  const classify = (cell) => {
    const kinds = []; const det = {};
    const add = (k, d) => { if (!kinds.includes(k)) kinds.push(k); if (d) det[k] = det[k] || d; };
    const els = [cell].concat(Array.from(cell.querySelectorAll('*'))).slice(0, 120);
    let avatars = [];
    for (const e of els) {
      if (!vis(e, false)) continue;
      const r = e.getBoundingClientRect(); const s = cs(e);
      const own = Array.from(e.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim()).map(n => n.textContent.trim()).join(' ');
      if (e.tagName === 'svg' || e.tagName === 'SVG') { if (!(e.parentElement && e.parentElement.closest('svg'))) add('icon:' + iconName(e), {size: Math.round(r.width)}); continue; }
      if (e.closest('svg')) continue;
      if (e.tagName === 'A' || (own && s.color === accentVal)) add('link', {color: s.color, color_tok: tok(s.color), font_size: s.fontSize, weight: s.fontWeight, underline: s.textDecorationLine});
      if (avatarLike(e, r, s)) { avatars.push(e); continue; }
      if (r.height <= 8 && r.height >= 2 && r.width >= 20 && !transparent(s.backgroundColor) && !own) {
        const fill = Array.from(e.children).find(c => !transparent(cs(c).backgroundColor));
        add('bar', {w: Math.round(r.width), h: Math.round(r.height), track: s.backgroundColor, track_tok: tokBg(s.backgroundColor), fill: fill ? cs(fill).backgroundColor : '', fill_tok: fill ? tokBg(cs(fill).backgroundColor) : []});
        continue;
      }
      const hasText = (e.innerText || '').trim().length > 0;
      const rad = parseFloat(s.borderTopLeftRadius) || 0; const bw = parseFloat(s.borderTopWidth) || 0;
      if (hasText && r.height >= 10 && r.height <= 34 && (bw > 0 || !transparent(s.backgroundColor)) && e !== cell) {
        const d = {h: Math.round(r.height * 10) / 10, w: Math.round(r.width), font_size: s.fontSize, weight: s.fontWeight, bg: s.backgroundColor, bg_tok: tokBg(s.backgroundColor), color: s.color, color_tok: tok(s.color), border: s.borderTopColor, radius: s.borderTopLeftRadius, text: (e.innerText || '').trim().slice(0, 30)};
        if (rad >= r.height / 2 - 1) add('pill', d); else if (rad > 0 || bw > 0) add('square badge', d);
      }
    }
    if (avatars.length) {
      const a0 = avatars[0]; const r0 = a0.getBoundingClientRect();
      const overl = avatars.length > 1 && avatars.some((a, i) => i && a.getBoundingClientRect().left < avatars[i - 1].getBoundingClientRect().right - 1);
      add(overl ? 'avatar stack' : 'avatar', {size: Math.round(r0.width), count: avatars.length, photo: avatars.some(a => a.tagName === 'IMG'), initials: avatars.filter(a => a.tagName !== 'IMG').map(a => (a.innerText || '').trim()).filter(Boolean).slice(0, 3)});
    }
    const t = (cell.innerText || '').replace(/\s+/g, ' ').trim();
    if (t === '-' || t === '—') add('dash');
    if (!kinds.length && t) { const te = deepestText(cell); const s = cs(te); add('plain', {font_size: s.fontSize, weight: s.fontWeight, color: s.color, color_tok: tok(s.color), align: s.textAlign}); }
    if (!kinds.length && !t) add('empty');
    return {kinds, det, text: t.slice(0, 40)};
  };
  const cellRows = [];
  for (const sel of (cfg.cell_rows || ['tbody tr'])) { try { document.querySelectorAll(sel).forEach(r => vis(r) && cellRows.push(r)); } catch (e) {} }
  const columns = [];
  const hdr = headers.find(h => h.cells.length > 2);
  if (hdr) {
    const maxRows = cfg.max_rows || 40;
    hdr.cells.forEach((hc, ci) => {
      const col = {header: hc.text || hc.icon || hc.title || ('#' + ci), index: ci, kinds: {}, samples: [], details: {}};
      const [hx, , hw] = hc.rect;
      cellRows.slice(0, maxRows).forEach(row => {
        const kids = Array.from(row.children).filter(c => vis(c, false));
        let best = null, bo = 0;
        kids.forEach(k => { const r = k.getBoundingClientRect(); const o = Math.min(r.right, hx + hw) - Math.max(r.left, hx); if (o > bo) { bo = o; best = k; } });
        if (!best) return;
        const c = classify(best);
        c.kinds.forEach(k => { col.kinds[k] = (col.kinds[k] || 0) + 1; if (!col.details[k] && c.det[k]) col.details[k] = c.det[k]; });
        if (col.samples.length < 3 && c.text) col.samples.push(c.text);
      });
      col.rows = Math.min(cellRows.length, maxRows);
      columns.push(col);
    });
  }
  out.columns = columns;
  out.cell_row_count = cellRows.length;

  // ---- 4. row types (group headers, rows, cards, ...): icons in order, avatar, text styles
  const rowTypes = {};
  for (const [name, sel] of Object.entries(cfg.row_types || {})) {
    let els; try { els = Array.from(document.querySelectorAll(sel)).filter(e => vis(e)); } catch (e) { continue; }
    const items = els.slice(0, cfg.max_row_items || 60).map(e => {
      const s = cs(e); const r = e.getBoundingClientRect();
      const svgs = Array.from(e.querySelectorAll('svg')).filter(v => !(v.parentElement && v.parentElement.closest('svg')) && vis(v, false));
      const nested = (cfg.row_type_exclude_nested || {})[name];
      const own = nested ? svgs.filter(v => !v.parentElement.closest(nested) || v.parentElement.closest(nested) === e.closest(nested) && !e.contains(v.parentElement.closest(nested))) : svgs;
      const ic = own.map(v => ({name: iconName(v), x: Math.round(v.getBoundingClientRect().left - r.left), size: Math.round(v.getBoundingClientRect().width), host: labelOf(hostOf(v))}));
      const texts = []; const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); let n;
      while ((n = w.nextNode()) && texts.length < 14) { const t = n.textContent.replace(/\s+/g, ' ').trim(); const pe = n.parentElement; if (!t || !vis(pe, false)) continue; const ps = cs(pe); texts.push({t: t.slice(0, 40), fs: ps.fontSize, fw: ps.fontWeight, c: ps.color, c_tok: tok(ps.color)}); }
      const av = Array.from(e.querySelectorAll('img,div,span')).filter(x => { const xr = x.getBoundingClientRect(); return vis(x, false) && avatarLike(x, xr, cs(x)); }).slice(0, 6).map(x => ({size: Math.round(x.getBoundingClientRect().width), photo: x.tagName === 'IMG', text: (x.innerText || '').trim().slice(0, 4), icon: x.querySelector('svg') ? iconName(x.querySelector('svg')) : ''}));
      const pills = Array.from(e.querySelectorAll('span,div')).filter(x => { if (!vis(x, false)) return false; const xr = x.getBoundingClientRect(); const xs = cs(x); return (x.innerText || '').trim() && xr.height >= 10 && xr.height <= 30 && parseFloat(xs.borderTopLeftRadius) >= xr.height / 2 - 1 && (parseFloat(xs.borderTopWidth) > 0 || !transparent(xs.backgroundColor)) && !avatarLike(x, xr, xs); }).slice(0, 4).map(x => ({text: x.innerText.trim().slice(0, 24), h: Math.round(x.getBoundingClientRect().height * 10) / 10}));
      return {key: (e.getAttribute(cfg.row_key_attr || 'data-wo') || e.getAttribute('data-gdrag') || e.getAttribute('data-group-id') || ''), rect: rr(r), h: Math.round(r.height * 10) / 10,
              bg: s.backgroundColor, bg_tok: tokBg(s.backgroundColor), radius: s.borderTopLeftRadius, border: s.borderTopWidth + ' ' + s.borderTopColor, shadow: s.boxShadow === 'none' ? '' : s.boxShadow,
              position: s.position, cursor: s.cursor, draggable: e.getAttribute('draggable'), icons: ic, avatars: av, pills, texts};
    });
    rowTypes[name] = {count: els.length, items};
  }
  out.row_types = rowTypes;

  // ---- 5. page frame
  const frame = [];
  for (const ft of (cfg.frame_targets || [])) {
    let el; try { el = Array.from(document.querySelectorAll(ft.selector)).find(e => vis(e, false)); } catch (e) { el = null; }
    if (!el) { frame.push({name: ft.name, found: false}); continue; }
    const r = el.getBoundingClientRect(); const chain = [];
    let a = el, depth = 0, insideCard = null;
    const tbg = cs(el).backgroundColor;
    while (a && a !== document.documentElement && depth < 14) {
      const s = cs(a); const ar = a.getBoundingClientRect();
      const paints = !transparent(s.backgroundColor) || parseFloat(s.borderTopLeftRadius) > 0 || s.boxShadow !== 'none' || parseFloat(s.borderTopWidth) > 0 || s.padding !== '0px';
      if (paints || a === el) chain.push({depth, tag: a.tagName.toLowerCase(), rect: rr(ar), bg: s.backgroundColor, bg_tok: tokBg(s.backgroundColor), radius: s.borderTopLeftRadius, padding: s.padding,
                                          margin: s.margin, shadow: s.boxShadow === 'none' ? '' : s.boxShadow.slice(0, 80), border: s.borderTopWidth + ' ' + s.borderTopStyle, overflow: s.overflow, position: s.position});
      if (a !== el && insideCard === null && parseFloat(s.borderTopLeftRadius) >= 4 && !transparent(s.backgroundColor) && ar.width < innerWidth - 2 && ar.left > 0.5) insideCard = {depth, bg_tok: tokBg(s.backgroundColor), radius: s.borderTopLeftRadius, rect: rr(ar)};
      a = a.parentElement; depth++;
    }
    frame.push({name: ft.name, found: true, rect: rr(r), gap_left: Math.round(r.left * 10) / 10, gap_right: Math.round((innerWidth - r.right) * 10) / 10,
                overflows_right: r.right > innerWidth + 0.5, bg: tbg, bg_tok: tokBg(tbg), inside_card: insideCard, chain});
  }
  out.frame = frame;
  out.body_bg = cs(document.body).backgroundColor; out.body_bg_tok = tokBg(out.body_bg);
  out.theme_attr = document.documentElement.getAttribute('data-theme') || '';
  out.viewport = [innerWidth, innerHeight];
  out.page_scroll_width = document.documentElement.scrollWidth;

  // ---- 6. every pill / badge on screen
  const pills = [];
  document.querySelectorAll('span,div,a,button').forEach(x => {
    if (!vis(x)) return; const t = (x.innerText || '').trim(); if (!t || t.length > 40) return;
    const xr = x.getBoundingClientRect(); const xs = cs(x);
    if (xr.height < 10 || xr.height > 30) return;
    if (!(parseFloat(xs.borderTopLeftRadius) >= xr.height / 2 - 1)) return;
    if (!(parseFloat(xs.borderTopWidth) > 0 || !transparent(xs.backgroundColor))) return;
    if (avatarLike(x, xr, xs)) return;
    if (x.querySelector('span,div') && Array.from(x.querySelectorAll('span,div')).some(c => c.innerText.trim() === t && cs(c).borderTopWidth !== '0px')) return;
    pills.push({text: t.slice(0, 30), h: Math.round(xr.height * 10) / 10, font_size: xs.fontSize, weight: xs.fontWeight, region: regionOf(x), bg_tok: tokBg(xs.backgroundColor), color_tok: tok(xs.color)});
  });
  out.pills = pills;

  // ---- 7. overlays (tooltips, menus, dialogs, popovers) and their position against a probe host and the header rows
  const overlays = [];
  const hostEl = cfg.probe && cfg.probe.host ? (() => { try { return Array.from(document.querySelectorAll(cfg.probe.host)).find(e => vis(e)); } catch (e) { return null; } })() : null;
  const hostRect = hostEl ? hostEl.getBoundingClientRect() : null;
  const hdrRects = headers.map(h => h.rect);
  for (const sel of (cfg.overlay_selectors || ['[role=tooltip]', '[role=menu]', '[role=dialog]', '[role=listbox]'])) {
    let els; try { els = document.querySelectorAll(sel); } catch (e) { continue; }
    els.forEach(o => {
      if (!vis(o)) return; const r = o.getBoundingClientRect();
      let rel = '';
      if (hostRect) { rel = r.bottom <= hostRect.top + 2 ? 'above' : r.top >= hostRect.bottom - 2 ? 'below' : r.right <= hostRect.left + 2 ? 'left' : r.left >= hostRect.right - 2 ? 'right' : 'overlapping host'; }
      const covers = hdrRects.filter(h => !(r.right <= h[0] || r.left >= h[0] + h[2] || r.bottom <= h[1] || r.top >= h[1] + h[3])).length > 0;
      const s = cs(o);
      overlays.push({selector: sel, rect: rr(r), relation_to_host: rel, covers_column_header: covers, text: (o.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 160),
                     bg_tok: tokBg(s.backgroundColor), radius: s.borderTopLeftRadius, shadow: s.boxShadow === 'none' ? '' : 'yes',
                     icons: Array.from(o.querySelectorAll('svg')).filter(v => vis(v, false) && !(v.parentElement && v.parentElement.closest('svg'))).map(v => iconName(v))});
    });
  }
  out.overlays = overlays;
  if (hostEl) out.probe_host = {rect: rr(hostRect), label: labelOf(hostEl) || (hostEl.innerText || '').trim().slice(0, 40), native_title: hostEl.getAttribute('title') || '', aria_label: hostEl.getAttribute('aria-label') || '', cursor: cs(hostEl).cursor};

  // ---- 8. text overlap and clipping
  const clipCache = new Map();
  const clipOf = (el) => {   // the visible box an element's content is clipped to (intersection of overflow-clipping ancestors)
    if (clipCache.has(el)) return clipCache.get(el);
    let box = [-1e9, -1e9, 1e9, 1e9]; let a = el;
    while (a && a !== document.documentElement) { const s = cs(a); if (/(hidden|clip|auto|scroll)/.test(s.overflowX + s.overflowY)) { const r = a.getBoundingClientRect(); box = [Math.max(box[0], r.left), Math.max(box[1], r.top), Math.min(box[2], r.right), Math.min(box[3], r.bottom)]; } a = a.parentElement; }
    clipCache.set(el, box); return box;
  };
  const tn = [];
  const w2 = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const rg2 = document.createRange(); let m;
  while ((m = w2.nextNode())) {
    const t = m.textContent.replace(/\s+/g, ' ').trim(); if (!t) continue;
    const pe = m.parentElement; if (!pe || !vis(pe)) continue;
    if (pe.closest('[aria-hidden="true"]')) continue;
    rg2.selectNodeContents(m);
    const cb = clipOf(pe);
    for (const q0 of Array.from(rg2.getClientRects())) { const q = {left: Math.max(q0.left, cb[0]), top: Math.max(q0.top, cb[1]), right: Math.min(q0.right, cb[2]), bottom: Math.min(q0.bottom, cb[3])};
      if (q.right - q.left < 1 || q.bottom - q.top < 1) continue; if (q.right < 0 || q.left > innerWidth || q.bottom < 0 || q.top > innerHeight) continue; tn.push({t: t.slice(0, 40), el: pe, l: q.left, r: q.right, tp: q.top, b: q.bottom}); }
  }
  tn.sort((a, b) => a.tp - b.tp);
  const overlaps = [];
  for (let i = 0; i < tn.length; i++) {
    for (let j = i + 1; j < tn.length && tn[j].tp < tn[i].b; j++) {
      const a = tn[i], b = tn[j]; if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const ox = Math.min(a.r, b.r) - Math.max(a.l, b.l); const oy = Math.min(a.b, b.b) - Math.max(a.tp, b.tp);
      if (ox > 0.5 && oy > Math.min(a.b - a.tp, b.b - b.tp) * 0.5) {
        // painted on top? an overlay legitimately covers text below it; report which one is on top
        const cx = (Math.max(a.l, b.l) + Math.min(a.r, b.r)) / 2, cy = (Math.max(a.tp, b.tp) + Math.min(a.b, b.b)) / 2;
        const topEl = document.elementFromPoint(cx, cy);
        overlaps.push({a: a.t, b: b.t, region_a: regionOf(a.el), region_b: regionOf(b.el), overlap_px: Math.round(ox * 10) / 10, at: [Math.round(cx), Math.round(cy)],
                       on_top: topEl ? (topEl === a.el || a.el.contains(topEl) ? 'a' : topEl === b.el || b.el.contains(topEl) ? 'b' : 'other') : ''});
        if (overlaps.length > 200) break;
      }
    }
    if (overlaps.length > 200) break;
  }
  out.overlaps = overlaps;
  const clips = [];
  document.querySelectorAll('body *').forEach(e => {
    if (clips.length > 300) return; if (!vis(e)) return; const s = cs(e);
    if (!/(hidden|clip)/.test(s.overflowX) && !/(hidden|clip)/.test(s.overflow)) return;
    if (!(e.scrollWidth > e.clientWidth + 1)) return;
    const t = (e.innerText || '').replace(/\s+/g, ' ').trim(); if (!t || t.length > 120) return;
    if (e.querySelector('*') && Array.from(e.children).some(c => c.scrollWidth > c.clientWidth + 1)) return;
    clips.push({text: t.slice(0, 60), region: regionOf(e), ellipsis: s.textOverflow === 'ellipsis', shown_w: e.clientWidth, needed_w: e.scrollWidth});
  });
  out.clips = clips;

  // ---- 9. sticky / fixed elements in the configured regions
  out.sticky = [];
  document.querySelectorAll('body *').forEach(e => { const p = cs(e).position; if ((p === 'sticky' || p === 'fixed') && vis(e)) { const t = (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 50); if (out.sticky.length < 60) out.sticky.push({position: p, region: regionOf(e), rect: R(e), text: t}); } });
  return out;
}
"""

HOVER_DIFF_JS = r"""
(sel) => {
  const el = Array.from(document.querySelectorAll(sel)).find(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
  if (!el) return null;
  const snap = () => [el].concat(Array.from(el.querySelectorAll('*')).slice(0, 80)).map(e => { const s = getComputedStyle(e); return [s.backgroundColor, s.borderTopColor, s.boxShadow, s.opacity, s.textDecorationLine, s.cursor, s.color].join('|'); });
  window.__dvi_before = snap();
  window.__dvi_snap = snap;
  window.__dvi_el = el;
  return true;
}
"""
HOVER_AFTER_JS = r"""
() => {
  if (!window.__dvi_el) return null;
  const el = window.__dvi_el; const nodes = [el].concat(Array.from(el.querySelectorAll('*')).slice(0, 80));
  const after = window.__dvi_snap(); const before = window.__dvi_before; const ch = [];
  const K = ['background', 'border', 'shadow', 'opacity', 'underline', 'cursor', 'color'];
  after.forEach((a, i) => { if (a !== before[i]) { const x = before[i].split('|'), y = a.split('|'); const d = {}; K.forEach((k, j) => { if (x[j] !== y[j]) d[k] = [x[j], y[j]]; });
    const n = nodes[i]; ch.push({node: i === 0 ? 'the hovered element' : (n.tagName.toLowerCase() + (n.getAttribute('aria-label') ? '[' + n.getAttribute('aria-label') + ']' : n.getAttribute('title') ? '[' + n.getAttribute('title') + ']' : '')), change: d}); } });
  return ch.slice(0, 20);
}
"""

STICKY_JS = r"""
async ([sel, scr, dx, dy]) => {
  const el = Array.from(document.querySelectorAll(sel)).find(e => e.getBoundingClientRect().height > 0);
  if (!el) return {found: false};
  let sc = scr ? document.querySelector(scr) : null;
  if (!sc) { sc = el.parentElement; while (sc && !(sc.scrollHeight > sc.clientHeight + 4 && /(auto|scroll)/.test(getComputedStyle(sc).overflowY)) && !(sc.scrollWidth > sc.clientWidth + 4 && /(auto|scroll)/.test(getComputedStyle(sc).overflowX))) sc = sc.parentElement; }
  if (!sc) return {found: true, scroller: false};
  const b = el.getBoundingClientRect(); const s0 = [sc.scrollLeft, sc.scrollTop];
  sc.scrollBy(dx, dy); await new Promise(r => setTimeout(r, 350));
  const a = el.getBoundingClientRect(); const moved = [sc.scrollLeft - s0[0], sc.scrollTop - s0[1]];
  const res = {found: true, scroller: true, scrolled_by: moved, before: [b.left, b.top], after: [a.left, a.top],
               stayed_put: Math.abs(a.top - b.top) < 1 && Math.abs(a.left - b.left) < 1, still_visible: a.bottom > 0 && a.top < innerHeight && a.right > 0 && a.left < innerWidth};
  sc.scrollTo(s0[0], s0[1]); await new Promise(r => setTimeout(r, 200));
  return res;
}
"""


# ------------------------------------------------------------------------------------------------ helpers
def set_dc_props(text, overrides):
    """Change the DEFAULT of a Claude Design (.dc.html) prop, e.g. {"emptyState": "no-technicians"}. Returns new text."""
    if not overrides:
        return text
    m = re.search(r'data-props="([^"]*)"', text)
    if not m:
        raise SystemExit("board has no data-props attribute; cannot set props " + json.dumps(overrides))
    props = json.loads(htmllib.unescape(m.group(1)))
    for k, v in overrides.items():
        if k not in props:
            raise SystemExit(f"prop {k!r} not defined by the board (has: {', '.join(props)})")
        props[k]["default"] = v
    new = htmllib.escape(json.dumps(props, separators=(",", ":")), quote=True)
    return text[:m.start(1)] + new + text[m.end(1):]


def variant_file(work, board, props):
    if not props:
        return board
    key = hashlib.md5(json.dumps(props, sort_keys=True).encode()).hexdigest()[:8]
    src = work / board
    dst_name = board.replace(".dc.html", f".dvi-{key}.dc.html") if board.endswith(".dc.html") else board.replace(".html", f".dvi-{key}.html")
    dst = work / dst_name
    if not dst.exists():
        dst.write_text(set_dc_props(src.read_text(encoding="utf-8"), props), encoding="utf-8")
    return dst_name


def run_actions(pg, actions):
    log = []
    for a in actions or []:
        k = next(iter(a)); v = a[k]
        try:
            if k == "click":
                pg.locator(v).first.click(timeout=5000)
            elif k == "click_text":
                pg.get_by_text(v, exact=True).last.click(timeout=5000)
            elif k == "click_force":
                pg.locator(v).first.click(timeout=5000, force=True)
            elif k == "hover":
                pg.locator(v).first.hover(timeout=5000)
            elif k == "dispatch":
                pg.locator(v[0]).first.dispatch_event(v[1])
            elif k == "press":
                pg.keyboard.press(v)
            elif k == "type":
                pg.keyboard.type(v)
            elif k == "fill":
                pg.locator(v[0]).first.fill(v[1])
            elif k == "eval":
                pg.evaluate(v)
            elif k == "wait":
                pg.wait_for_timeout(int(v))
            elif k == "scroll":
                pg.evaluate("([s, dx, dy]) => { const e = document.querySelector(s); if (e) e.scrollBy(dx, dy); }", v)
            elif k == "mouse":
                pg.mouse.move(v[0], v[1])
            elif k == "reload":
                pg.reload(wait_until="load"); ddf.wait_render(pg)
            else:
                log.append(f"unknown action {k}")
                continue
            pg.wait_for_timeout(int(a.get("_wait", 450)) if isinstance(a, dict) else 450)
            log.append(f"ok {k}")
        except Exception as e:
            log.append(f"FAILED {k} {str(v)[:80]}: {str(e).splitlines()[0][:160]}")
    return log


def expand_states(cfg):
    states = list(cfg.get("states", []))
    for mx in cfg.get("matrix", []):
        for board in mx["boards"]:
            for theme in mx.get("themes", ["light"]):
                for width in mx.get("widths", cfg.get("widths", [1440])):
                    for var in mx["variants"]:
                        bslug = re.sub(r"[^a-z0-9]+", "-", board.lower().replace(".dc.html", "").replace(".html", "")).strip("-")
                        st = {"id": f"{mx['id']}__{bslug}__{var['id']}__{theme}__{width}", "board": board, "theme": theme, "width": width,
                              "props": var.get("props", {}), "actions": var.get("actions", []), "meta": dict(var.get("meta", {}), board=board, theme=theme, width=width),
                              "probe": var.get("probe"), "hover_diff": var.get("hover_diff"), "sticky": var.get("sticky", mx.get("sticky", False)),
                              "shot": var.get("shot", mx.get("shot", True))}
                        states.append(st)
    return states


# ------------------------------------------------------------------------------------------------ distinct rows
def rows_from_state(sid, meta, ex):
    """Flatten one state's extraction into observation rows: (category, element, attribute, value)."""
    out = []
    view = meta.get("view", "")

    def add(cat, element, attr, value, region=""):
        out.append({"category": cat, "view": view, "region": region, "element": element, "attribute": attr,
                    "value": value if isinstance(value, str) else json.dumps(value, ensure_ascii=False)})
    # icons: aggregate by (region, name, host, size)
    agg = {}
    for i in ex.get("icons", []):
        host = re.sub(r"S\d-\d+", "<WO>", i["host"] or "")
        host = re.sub(r"\b\d+\b", "<n>", host)
        k = (i["region"], i["name"], host, f'{i["w"]}px', (i.get("color_tok") or [i.get("color", "")])[0])
        agg[k] = agg.get(k, 0) + 1
    for (region, name, host, size, col), n in sorted(agg.items()):
        add("icon", name, "on control · size · colour", f"{host or '(no control)'} · {size} · {col}", region)
    for h in ex.get("headers", []):
        cols = [c["text"] or (("[icon " + c["icon"] + "]") if c["icon"] else "") or ("[" + c["title"] + "]") for c in h["cells"]]
        add("columns", "column header row", "columns in order", " | ".join(cols), h["region"])
        styles = sorted({f'{c["font_size"]}/{c["font_weight"]}/{",".join(c["color_tok"][:1]) or c["color"]}/ls {c["letter_spacing"]}' for c in h["cells"] if c["text"]})
        add("header-style", "column header labels", "size/weight/colour/letter-spacing", "; ".join(styles), h["region"])
        add("header-style", "column header row", "position / background / bottom border", f'{h["position"]} top={h["top"]} · {",".join(h["bg_tok"][:1]) or h["bg"]} · {h["border_bottom"]}', h["region"])
        tight = [g for g in h["gaps"] if g["gap"] < 4]
        add("overlap", "column header labels", "label pairs closer than 4px (gap px)", "; ".join(f'{g["left"]}→{g["right"]} {g["gap"]}' for g in tight) or "none", h["region"])
        clipped = [c["text"] for c in h["cells"] if c["clipped"] and c["text"]]
        add("overlap", "column header labels", "labels clipped", ", ".join(clipped) or "none", h["region"])
    for c in ex.get("columns", []):
        kinds = ", ".join(f"{k}×{n}" for k, n in sorted(c["kinds"].items(), key=lambda x: -x[1]))
        add("cell", f'column "{c["header"]}"', "renderer (count of rows)", kinds or "none")
        for k, d in c.get("details", {}).items():
            if k.startswith("icon:"):
                continue
            add("cell-style", f'column "{c["header"]}"', k, d)
    for name, rt in ex.get("row_types", {}).items():
        sigs = {}
        for it in rt["items"]:
            icons = " > ".join(i["name"].split(" (")[0] for i in it["icons"]) or "(none)"
            av = ",".join(sorted({("photo" if a["photo"] else ("icon " + a["icon"] if a["icon"] else "initials")) + f'@{a["size"]}' for a in it["avatars"]})) or "-"
            k = (icons, av)
            sigs[k] = sigs.get(k, 0) + 1
        for (icons, av), n in sorted(sigs.items(), key=lambda x: -x[1]):
            add("row-type", name, "icons left→right · avatars (count of items)", f"{icons} · {av} ({n} of {rt['count']})")
        hs = sorted({it["h"] for it in rt["items"]})
        add("size", name, "height px", ", ".join(str(h) for h in hs[:6]) or "none")
        frames = sorted({f'{",".join(it["bg_tok"][:1]) or it["bg"]} r={it["radius"]} border={it["border"]} shadow={"yes" if it["shadow"] else "no"} cursor={it["cursor"]}' for it in rt["items"]})
        for f in frames[:4]:
            add("row-style", name, "background / radius / border / shadow / cursor", f)
        ph = sorted({p["h"] for it in rt["items"] for p in it["pills"]})
        if ph:
            add("size", name, "pill heights px", ", ".join(map(str, ph)))
    for f in ex.get("frame", []):
        if not f.get("found"):
            add("frame", f["name"], "found", "not on this screen"); continue
        card = f["inside_card"]
        add("frame", f["name"], "gap to viewport left / right (px)", f'{f["gap_left"]} / {f["gap_right"]}{" (runs past the right edge)" if f["overflows_right"] else ""}')
        add("frame", f["name"], "inside a card or panel", ("yes: " + json.dumps(card)) if card else "no")
        painted = [f'd{c["depth"]} {c["tag"]} bg={",".join(c["bg_tok"][:1]) or c["bg"]} r={c["radius"]} pad={c["padding"]}' for c in f["chain"][:6]]
        add("frame", f["name"], "painted ancestors (inner→outer)", " ; ".join(painted))
    agg = {}
    for p in ex.get("pills", []):
        k = (p["region"], p["h"], p["font_size"], p["weight"])
        agg.setdefault(k, set()).add(p["text"])
    for (region, h, fs, fw), texts in sorted(agg.items(), key=lambda x: (x[0][0], x[0][1])):
        add("size", "pill/badge", "height px (font size/weight)", f"{h} ({fs}/{fw}) e.g. {', '.join(sorted(texts)[:4])}", region)
    for o in ex.get("overlays", []):
        add("overlay", o["selector"], "opens relative to host · covers a column header", f'{o["relation_to_host"] or "-"} · {"YES" if o["covers_column_header"] else "no"} · "{o["text"][:60]}"')
        if o["icons"]:
            add("icon", o["selector"], "icons in overlay", " > ".join(o["icons"]))
    if ex.get("probe_host"):
        ph = ex["probe_host"]
        if ph.get("native_title") and not ex.get("overlays"):
            add("overlay", "probe host", "tooltip", f'native browser title only: "{ph["native_title"]}" (no styled tooltip in the design; position is drawn by the browser)')
    for hv in ex.get("hover_diff") or []:
        add("hover", hv["node"], "changes on hover", hv["change"])
    real = [o for o in ex.get("overlaps", []) if o["on_top"] != "other"]
    add("overlap", "text", "overlapping text pairs", "; ".join(f'"{o["a"]}"×"{o["b"]}" {o["overlap_px"]}px ({o["region_a"]}/{o["region_b"]})' for o in real[:12]) or "none")
    cl = [c for c in ex.get("clips", []) if not c["ellipsis"]]
    add("overlap", "text", "clipped without ellipsis", "; ".join(f'"{c["text"]}" ({c["region"]})' for c in cl[:12]) or "none")
    el = [c for c in ex.get("clips", []) if c["ellipsis"]]
    add("overlap", "text", "truncated with ellipsis (by design)", "; ".join(f'"{c["text"]}" ({c["region"]})' for c in el[:12]) or "none")
    for s in ex.get("sticky_probes") or []:
        add("sticky", s["name"], "stays put when its scroller scrolls", s["result"])
    add("frame", "page", "body background / theme attribute / page wider than viewport", f'{",".join(ex.get("body_bg_tok", [])[:1]) or ex.get("body_bg")} / {ex.get("theme_attr")} / {ex.get("page_scroll_width", 0) > ex.get("viewport", [0])[0]}')
    return out


# ------------------------------------------------------------------------------------------------ library rules
RULE_RX = re.compile(r"\b(always|never|must(?:n't| not)?|should(?:n't| not)?|do not|don't|not interchangeable|only)\b", re.I)


def library_rules(paths):
    rows = []
    files = []
    for p in paths:
        p = pathlib.Path(p)
        files += sorted(x for x in p.rglob("*") if x.is_file()) if p.is_dir() else [p]
    for f in files:
        if f.suffix.lower() not in (".md", ".jsx", ".js", ".css", ".json", ".txt", ".html"):
            continue
        try:
            lines = f.read_text(encoding="utf-8", errors="replace").splitlines()
        except Exception:
            continue
        code = f.suffix.lower() in (".js", ".jsx", ".css")
        in_block = False
        for i, ln in enumerate(lines, 1):
            s = ln.strip()
            prose = True
            if code:   # keep only comment text: // line comments and everything inside /* ... */ blocks
                was = in_block
                if "/*" in s and "*/" not in s.split("/*", 1)[1]:
                    in_block = True
                if "*/" in s and was:
                    in_block = False
                prose = was or "/*" in s or "//" in s or s.startswith("*")
            if not s or len(s) > 400 or not prose or not RULE_RX.search(s):
                continue
            rows.append({"file": str(f), "line": i, "text": s[:400], "keyword": RULE_RX.search(s).group(1).lower()})
    return {"files": [str(f) for f in files], "sentences": rows}


# ------------------------------------------------------------------------------------------------ main
def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--design", required=True, help="design package folder (boards are named relative to it)")
    ap.add_argument("--config", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--only", nargs="*", default=[], help="run only states whose id contains one of these")
    ap.add_argument("--resume", action="store_true", help="skip states already in the checkpoint")
    ap.add_argument("--library", nargs="*", default=[], help="design-system files/folders to mine for always/never/must/should sentences")
    ap.add_argument("--cdn-cache", default=str(pathlib.Path("/tmp") / "drive_design_cdn_cache"))
    ap.add_argument("--no-shots", action="store_true")
    args = ap.parse_args()

    cfg = json.loads(pathlib.Path(args.config).read_text())
    out = pathlib.Path(args.out).resolve(); (out / "shots").mkdir(parents=True, exist_ok=True)
    pkg = pathlib.Path(args.design).resolve()
    work = out / "_work_package"     # a copy: variants are written here, never into the source package
    if not work.exists():
        shutil.copytree(pkg, work)
    if args.library:
        (out / "library-rules.json").write_text(json.dumps(library_rules(args.library), indent=1, ensure_ascii=False))

    extra_icons = {}
    for spec in cfg.get("icon_registry_files", []):   # e.g. {"file": "lucide-icons.js", "var": "SV_LUCIDE"}: icon maps a later script overwrote
        txt = (pkg / spec["file"]).read_text(encoding="utf-8")
        mm = re.search(r"window\.%s\s*=\s*(\{.*?\});\s*$" % re.escape(spec["var"]), txt, re.M)
        if mm:
            extra_icons.update(json.loads(mm.group(1)))
    states = expand_states(cfg)
    if args.only:
        states = [s for s in states if any(o in s["id"] for o in args.only)]
    ck_path = out / "checkpoint.json"
    done = json.loads(ck_path.read_text()) if (args.resume and ck_path.exists()) else {}
    srv, base = ddf.start_server(work)
    themes = cfg.get("themes", {"light": {"color_scheme": "light"}, "dark": {"color_scheme": "dark"}})
    from playwright.sync_api import sync_playwright
    t0 = time.time()
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=ddf.CHROME, args=ddf.ARGS)
        for n, st in enumerate(states, 1):
            if st["id"] in done:
                continue
            rec = {"id": st["id"], "meta": st.get("meta", {}), "board": st["board"], "theme": st.get("theme", "light"), "width": st.get("width", 1440)}
            try:
                th = themes.get(rec["theme"], {})
                ctx = browser.new_context(viewport={"width": int(rec["width"]), "height": int(cfg.get("height", 900))}, color_scheme=th.get("color_scheme", "light"))
                ctx.route(re.compile(r"^https://"), ddf.cdn_router(args.cdn_cache))
                pg = ctx.new_page()
                errs = []
                pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
                board = variant_file(work, st["board"], st.get("props"))
                url = base + urllib.parse.quote(board)
                pg.goto(url, wait_until="load", timeout=180000); ddf.wait_render(pg, min_ms=1500, max_ms=30000)
                if th.get("eval"):
                    for js in th["eval"]:
                        pg.evaluate(js)
                    pg.reload(wait_until="load"); ddf.wait_render(pg, min_ms=1200, max_ms=30000)
                rec["action_log"] = run_actions(pg, st.get("actions"))
                hv = st.get("hover_diff")
                if hv:
                    pg.mouse.move(2, 2); pg.wait_for_timeout(200)
                    ok = pg.evaluate(HOVER_DIFF_JS, hv)
                    if ok:
                        pg.locator(hv).first.hover(timeout=5000); pg.wait_for_timeout(450)
                        rec["hover_diff"] = pg.evaluate(HOVER_AFTER_JS)
                ecfg = {"extra_icons": extra_icons}
                ecfg.update({k: cfg.get(k) for k in ("regions", "icon_registry_js", "column_header_rows", "row_types", "cell_rows", "frame_targets",
                                               "overlay_selectors", "accent_token", "token_prefer", "max_rows", "max_row_items", "row_key_attr", "row_type_exclude_nested", "token_prefer_bg") if cfg.get(k) is not None})
                if st.get("probe"):
                    ecfg["probe"] = st["probe"]
                ex = pg.evaluate(EXTRACT_JS, ecfg)
                if rec.get("hover_diff") is not None:
                    ex["hover_diff"] = rec["hover_diff"]
                if st.get("sticky"):
                    res = []
                    for sp in cfg.get("sticky_probes", []):
                        r = pg.evaluate(STICKY_JS, [sp["selector"], sp.get("scroller"), sp.get("dx", 0), sp.get("dy", 400)])
                        verdict = ("not on this screen" if not r.get("found") else "no scroller (content fits)" if not r.get("scroller") else
                                   ("nothing to scroll" if r["scrolled_by"] == [0, 0] else ("yes" if r["stayed_put"] else ("no — moved, still visible" if r["still_visible"] else "no — scrolled out of view"))))
                        res.append({"name": sp["name"], "result": verdict, "raw": r})
                    ex["sticky_probes"] = res
                if st.get("shot", True) and not args.no_shots:
                    shot = out / "shots" / (re.sub(r"[^A-Za-z0-9_.-]+", "_", st["id"])[:150] + ".png")
                    pg.screenshot(path=str(shot)); rec["shot"] = str(shot.relative_to(out))
                rec["errors"] = errs[:5]
                rec["extract"] = ex
                rec["rows"] = rows_from_state(st["id"], dict(rec["meta"], theme=rec["theme"], width=rec["width"]), ex)
                ctx.close()
            except Exception:
                rec["fatal"] = traceback.format_exc()[-1500:]
                try:
                    ctx.close()
                except Exception:
                    pass
            done[st["id"]] = rec
            ck_path.write_text(json.dumps(done, ensure_ascii=False))
            print(f"[{n}/{len(states)}] {st['id']} {'FATAL' if rec.get('fatal') else 'ok'} {round(time.time() - t0)}s", flush=True)
        browser.close()
    srv.shutdown()
    finish(out, done, states)


def finish(out, done, states):
    order = [s["id"] for s in states if s["id"] in done] + [k for k in done if k not in {s["id"] for s in states}]
    (out / "visual-inventory.json").write_text(json.dumps({k: {kk: vv for kk, vv in done[k].items() if kk != "rows"} for k in order}, ensure_ascii=False))
    distinct = {}
    for k in order:
        rec = done[k]
        for r in rec.get("rows", []):
            key = (r["category"], r["view"], r["region"], r["element"], r["attribute"], r["value"])
            d = distinct.setdefault(key, dict(r, states=[], themes=set(), widths=set(), boards=set(), densities=set()))
            d["states"].append(k); d["themes"].add(rec["theme"]); d["widths"].add(str(rec["width"])); d["boards"].add(rec["board"])
            d["densities"].add(str(rec["meta"].get("density", "")))
    rows = []
    for i, (key, d) in enumerate(sorted(distinct.items(), key=lambda x: (x[0][1], x[0][0], x[0][3], x[0][4], x[0][2]))):
        d = dict(d); d["id"] = f"V{i + 1:04d}"
        for s in ("themes", "widths", "boards", "densities"):
            d[s] = sorted(d[s])
        d["state_count"] = len(d["states"])
        rows.append(d)
    (out / "visual-rows.json").write_text(json.dumps(rows, indent=1, ensure_ascii=False))
    md = ["# Visual inventory", "", f"States rendered: {len(order)} · fatal: {sum(1 for k in order if done[k].get('fatal'))} · distinct observation rows: {len(rows)}", "",
          "Each row is one thing a person can see, with every state it was seen in. Raw per-state data: `visual-inventory.json`.", "",
          "| Id | View | Category | Region | Element | Attribute | Value | Seen in (states · themes · widths · densities) |", "|---|---|---|---|---|---|---|---|"]
    for r in rows:
        v = r["value"].replace("|", "/").replace("\n", " ")
        md.append(f'| {r["id"]} | {r["view"]} | {r["category"]} | {r["region"]} | {r["element"]} | {r["attribute"]} | {v[:300]} | {r["state_count"]} · {",".join(r["themes"])} · {",".join(r["widths"])} · {",".join(x for x in r["densities"] if x)} |')
    fat = [k for k in order if done[k].get("fatal")]
    if fat:
        md += ["", "## States that failed to render", ""] + [f"- {k}: {done[k]['fatal'].splitlines()[-1][:200]}" for k in fat]
    (out / "VISUAL-INVENTORY.md").write_text("\n".join(md) + "\n")
    print(f"wrote {out/'visual-rows.json'} ({len(rows)} distinct rows from {len(order)} states)")


if __name__ == "__main__":
    main()
