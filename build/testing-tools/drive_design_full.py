#!/usr/bin/env python3
"""EXHAUSTIVE design-board driver (Rule 115: the design is driven end to end, every state, every time).

Generic: works on any static/"dc" design board (Claude Design export `*.dc.html`) or any HTML prototype.

    python3 drive_design_full.py <board.html> <out-dir> [--workers 3] [--wait 500] [--fast-wait 250]
                                 [--viewport 1440x900] [--serve] [--cdn-cache DIR] [--pages a,b]
                                 [--skip-discovery] [--reuse-census] [--no-forced]

What it does, per board:
  0. Loads the board from INSIDE its own folder (file:// with --allow-file-access-from-files so the dc runtime can
     fetch sibling component boards; or --serve = a local http.server rooted at the board's folder). External
     https assets (e.g. React/Babel from unpkg used by support.js) are fetched with VERIFIED TLS through the agent
     proxy CA bundle and cached, then fulfilled to the browser (no TLS checks are disabled).
  1. DISCOVERY: finds the board's own page navigation (hash links in the board header whose targets are top-level
     page sections), cross-board links, the CSS hover/focus rules (the mechanism behind tooltips/hover cards),
     JS click handlers (React props + native listeners via CDP), and enumerates EVERY interactive/responsive
     element: button, a, [role=button|tab|checkbox|switch|menuitem|option|radio|combobox|link], input/select/
     textarea, summary/details, [onclick]/data-action attrs, tooltip hosts (.sv-tt-host, [title],
     [aria-describedby], hosts of :hover rules), and every element whose computed cursor is pointer (outermost
     pointer elements = "pointer"; descendants that only inherit the cursor = "pointer-inherited", driven with the
     shorter --fast-wait). No cap.
     Also inventories every HIDDEN text-bearing element (opacity 0 / visibility hidden / display none) so the run
     can PROVE each one was exposed by some interaction (reachability).
  2. PAGES: reaches every page by (a) clicking the board's own page pill and (b) loading URL#page; records both.
     Writes every page's full VISIBLE text (hidden tooltip text excluded) to <board>-pages.txt.
     Follows every cross-board link (All chunks / Chunk 2 ...) and records where it lands and whether the hash
     target exists.
  3. INTERACTIONS: for every element, from a FRESH KNOWN STATE (board reloaded whenever the previous interaction
     changed the DOM, the URL or the document; otherwise mouse parked on empty canvas, focus cleared and the board's
     own page hash re-navigated -- the state fingerprint is checked before every interaction), scroll into view,
     HOVER (real mouse move) and, separately, CLICK (real mouse click at the element centre), wait, and record:
     newly visible text (visible-text diff of the element's artboard scope + any DOM added anywhere), tooltip /
     title text, navigation (hash target or other board), hover style change, occlusion; screenshot when
     something new appeared. Every <select> has its options recorded; every <details> is toggled.
  3b. FORCED PASS: every element a real pointer cannot reach because an overlay (a modal / hover card DRAWN over
     the screen) covers it is driven again: :hover/:focus-within forced through the DevTools protocol on it and all
     its ancestors ("hover-forced"), and its own click/mouse events dispatched ("click-forced"). Disable: --no-forced.
     Resume: a re-run skips every (element, action) already recorded without error by any worker; failed ones retry.
  4. VARIANTS: re-renders the board in dark theme (?theme=dark) and at 768 / 1920 px widths and records whether
     any visible text differs.

Outputs in <out-dir>:  <board>-interactions.jsonl, <board>-pages.txt, <board>-discovery.json,
                        <board>-navigation.jsonl, <board>-summary.json, screenshots/
"""
import argparse, hashlib, http.server, json, multiprocessing as mp, os, pathlib, re, socketserver, ssl, sys, threading
import time, traceback, urllib.parse, urllib.request

CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
ARGS = ["--no-sandbox", "--disable-gpu", "--allow-file-access-from-files"]
CA = "/root/.ccr/ca-bundle.crt"

# --------------------------------------------------------------------------------------------- page-side JS
JS_LIB = r"""
(() => {
if (window.__dd) return;
const dd = window.__dd = {};
const SEL_INTERACTIVE = 'button,a,[role=button],[role=tab],[role=checkbox],[role=switch],[role=menuitem],[role=option],[role=radio],[role=combobox],[role=link],[role=menuitemcheckbox],[role=menuitemradio],[role=slider],[role=treeitem],input,select,textarea,summary,details,[onclick],[tabindex],[contenteditable=true]';
const SEL_TT = '.sv-tt-host,[title],[aria-describedby],[data-tooltip],[data-tip],[aria-haspopup],[aria-expanded],[aria-controls]';
dd.vis = (e) => {
  if (!e || !e.isConnected) return false;
  if (e.checkVisibility && !e.checkVisibility({checkOpacity: true, checkVisibilityCSS: true})) return false;
  const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0;
};
dd.label = (e) => {
  let t = (e.getAttribute('aria-label') || '').trim();
  if (!t) { const c = e.cloneNode(true); c.querySelectorAll('.sv-tt-pop,[role=tooltip]').forEach(x => x.remove());
            t = (c.textContent || '').replace(/\s+/g, ' ').trim(); }
  if (!t) t = (e.getAttribute('title') || e.getAttribute('placeholder') || e.getAttribute('value') || '').trim();
  if (!t) { const s = e.querySelector('svg'); t = s ? '[icon]' : ''; }
  return t.slice(0, 160);
};
dd.path = (e) => {
  const parts = [];
  while (e && e.nodeType === 1 && e !== document.body) {
    if (e.id && !e.id.startsWith('dc-')) { parts.unshift('#' + CSS.escape(e.id)); break; }
    let i = 1, s = e; while ((s = s.previousElementSibling)) if (s.tagName === e.tagName) i++;
    parts.unshift(e.tagName.toLowerCase() + ':nth-of-type(' + i + ')'); e = e.parentElement;
  }
  return parts.join(' > ');
};
dd.scopeOf = (e) => {  // nearest artboard-ish container: closest ancestor with an id (not the dc root)
  let s = e.parentElement;
  while (s && s !== document.body) { if (s.id && !s.id.startsWith('dc-')) return s; s = s.parentElement; }
  return document.body;
};
// ---- hover rules from stylesheets (the mechanism behind CSS tooltips / hover cards)
dd.hoverRules = () => {
  const out = [];
  const walk = (rules, src) => { for (const r of rules) {
    if (r.cssRules && !r.selectorText) { try { walk(r.cssRules, src); } catch (e) {} continue; }
    if (r.selectorText && /:(hover|focus|focus-within|focus-visible|active|target|checked|open)\b/.test(r.selectorText))
      out.push({selector: r.selectorText, style: r.style ? r.style.cssText.slice(0, 200) : '', src});
  } };
  for (const sh of document.styleSheets) { try { walk(sh.cssRules, sh.href || 'inline'); } catch (e) { out.push({error: String(e), src: sh.href}); } }
  return out;
};
dd.hoverHostSelectors = () => {
  const hosts = new Set();
  for (const r of dd.hoverRules()) {
    if (!r.selector) continue;
    for (const part of r.selector.split(',')) {
      const m = part.match(/^(.*?):(hover|focus-within)\b(.*)$/);
      if (!m) continue;
      const rest = m[3].trim(); if (!rest) continue;           // only rules that affect OTHER elements (reveal)
      const host = m[1].trim().split(/\s+/).pop(); if (host) hosts.add(host);
    }
  }
  return [...hosts];
};
// ---- pages. The board's top-level container = descend from the root while there is a single child.
//      If the FIRST top-level block (the board header) holds hash links to its own siblings, those are the board's
//      page navigation (e.g. "1 Settings", "2 The asset"). Otherwise every top-level block is a page (sections with no
//      nav; reached by scrolling) and is tagged data-dd-page="sec-N" (or its own id).
dd.container = () => {
  let c = document.getElementById('dc-root') || document.body;
  const kids = (x) => [...x.children].filter(k => !/^(STYLE|SCRIPT|LINK|META|TEMPLATE)$/.test(k.tagName));
  while (kids(c).length === 1) c = kids(c)[0];
  return c;
};
dd.blocks = () => [...dd.container().children].filter(k => !/^(STYLE|SCRIPT|LINK|META|TEMPLATE)$/.test(k.tagName));
dd.firstLines = (e, n) => (e.innerText || '').split('\n').map(x => x.trim()).filter(Boolean).slice(0, n).join(' / ').slice(0, 120);
dd.pages = (forced) => {
  const blocks = dd.blocks();
  if (forced && forced.length) return forced.map(id => { const a = document.querySelector('a[href="#' + CSS.escape(id) + '"]'); return {id, label: a ? dd.label(a) : id, linkPath: a ? dd.path(a) : null, mode: 'hash'}; });
  const head = blocks[0]; const res = []; const seen = new Set();
  if (head) for (const b of head.querySelectorAll('a[href^="#"]')) {
    const bid = decodeURIComponent(b.getAttribute('href').slice(1)); const bt = bid && document.getElementById(bid);
    if (!bt || seen.has(bid) || !blocks.includes(bt) || bt === head) continue;
    seen.add(bid); res.push({id: bid, label: dd.label(b), linkPath: dd.path(b), mode: 'hash'});
  }
  if (res.length) return res;
  // only real sections count as pages (a component board's toolbar items are not pages)
  const big = blocks.filter(b => b.getBoundingClientRect().height >= 300);
  if (big.length < 2) return [];
  return blocks.map((b, i) => { const id = b.id || ('sec-' + (i + 1)); b.setAttribute('data-dd-page', id);
    return {id, label: dd.firstLines(b, 2), linkPath: null, mode: 'scroll'}; });
};
dd.pageEl = (id) => document.getElementById(id) || document.querySelector('[data-dd-page="' + CSS.escape(id) + '"]');
dd.pageOf = (e, pageIds) => { for (const id of pageIds) { const p = dd.pageEl(id); if (p && p.contains(e)) return id; } return '_header_or_outside'; };
dd._flowCache = new Map();
dd.flowOf = (e, pageId) => {   // the sub-section (flow / group) of the page that holds the element
  const p = pageId && !pageId.startsWith('_') ? dd.pageEl(pageId) : dd.container(); if (!p) return '';
  let x = e; while (x && x.parentElement !== p) x = x.parentElement; if (!x) return '';
  if (!dd._flowCache.has(x)) dd._flowCache.set(x, dd.firstLines(x, 3)); return dd._flowCache.get(x);
};
// ---- enumerate candidates (deterministic DOM order); tags them with data-dd-idx
dd.enumerate = (pageIds) => {
  const hostSel = dd.hoverHostSelectors().filter(s => { try { document.querySelector(s); return true; } catch (e) { return false; } });
  const all = [...document.body.querySelectorAll('*')];
  const out = []; let idx = 0; let hiddenPointer = 0, zeroPointer = 0;
  for (const e of all) {
    if (e.closest('script,style,head,helmet')) continue;
    const kinds = [];
    if (e.matches(SEL_INTERACTIVE)) kinds.push('interactive:' + (e.getAttribute('role') || e.tagName.toLowerCase()));
    if (e.matches(SEL_TT)) kinds.push('tooltip-host');
    for (const s of hostSel) { try { if (e.matches(s)) { kinds.push('hover-rule-host:' + s); break; } } catch (x) {} }
    for (const a of e.attributes) if (/^data-(action|on|click|toggle|target|open)/.test(a.name)) { kinds.push('data-action:' + a.name); break; }
    const cs = getComputedStyle(e);
    if (cs.cursor === 'pointer') {
      const pc = e.parentElement ? getComputedStyle(e.parentElement).cursor : '';
      kinds.push(pc === 'pointer' ? 'pointer-inherited' : 'pointer');
    }
    const rk = Object.keys(e).find(k => k.startsWith('__reactProps'));
    if (rk && Object.keys(e[rk] || {}).some(k => /^on[A-Z]/.test(k))) kinds.push('react-handler');
    if (!kinds.length) continue;
    if (!dd.vis(e)) { if (kinds.some(k => k.startsWith('pointer'))) hiddenPointer++; continue; }  // hidden content is covered by reachability
    const r = e.getBoundingClientRect();
    e.setAttribute('data-dd-idx', String(idx)); const pg_ = dd.pageOf(e, pageIds);
    out.push({idx, tag: e.tagName.toLowerCase(), kinds, label: dd.label(e), path: dd.path(e), page: pg_, flow: dd.flowOf(e, pg_),
              x: Math.round(r.left + scrollX), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height),
              href: e.getAttribute('href') || null, title: e.getAttribute('title') || null,
              fast: kinds.every(k => k === 'pointer-inherited')});
    idx++;
  }
  return {candidates: out, hiddenPointer};
};
// ---- hidden text inventory (opacity 0 / visibility hidden / display none) -> data-dd-hid
dd.hiddenInventory = () => {
  const out = []; let n = 0;
  for (const e of document.body.querySelectorAll('*')) {
    if (e.closest('script,style,head,helmet')) continue;
    const cs = getComputedStyle(e);
    const hiddenSelf = cs.opacity === '0' || cs.visibility === 'hidden' || cs.display === 'none';
    if (!hiddenSelf) continue;
    if (e.parentElement && e.parentElement.closest('[data-dd-hid]')) continue;   // count outermost only
    const t = (e.textContent || '').replace(/\s+/g, ' ').trim(); if (!t) continue;
    e.setAttribute('data-dd-hid', String(n));
    out.push({hid: n, tag: e.tagName.toLowerCase(), cls: String(e.className).slice(0, 80), text: t.slice(0, 600), path: dd.path(e),
              why: cs.opacity === '0' ? 'opacity:0' : cs.visibility === 'hidden' ? 'visibility:hidden' : 'display:none'});
    n++;
  }
  return out;
};
// ---- visible text of a node with opacity-0 subtrees removed (true "what the user sees")
dd.visibleText = (root) => {
  const hidden = [];
  for (const e of root.querySelectorAll('*')) { const cs = getComputedStyle(e);
    if (cs.opacity === '0' || cs.visibility === 'hidden') { hidden.push([e, e.style.display]); } }
  hidden.forEach(([e]) => e.style.setProperty('display', 'none', 'important'));
  const t = root.innerText;
  hidden.forEach(([e, d]) => { e.style.removeProperty('display'); if (d) e.style.display = d; });
  return t;
};
// ---- state + diff machinery
dd.mut = 0; dd.added = [];
dd.observe = () => {
  if (dd.mo) dd.mo.disconnect();
  dd.mut = 0; dd.added = [];
  dd.mo = new MutationObserver(ms => { for (const m of ms) {
    if (m.type === 'attributes' && /^data-dd-/.test(m.attributeName)) continue;
    dd.mut++; if (m.type === 'childList') m.addedNodes.forEach(n => dd.added.push(n)); } });
  dd.mo.observe(document.body, {subtree: true, childList: true, attributes: true, characterData: true});
};
dd.textNodes = (scope) => {
  const w = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT); const a = []; let n;
  while ((n = w.nextNode())) if (n.nodeValue.trim() && n.parentElement && !n.parentElement.closest('script,style')) a.push(n);
  return a;
};
// Newly visible text can only come from (a) an element that was hidden at rest (the hidden inventory, tagged
// data-dd-hid) or (b) DOM added by a script (MutationObserver). So the diff watches exactly those: cheap on
// boards with tens of thousands of elements, and complete for opacity/visibility/display reveals.
dd.snap = (idx) => {
  const e = document.querySelector('[data-dd-idx="' + idx + '"]'); if (!e) return null;
  dd._hidEls = [...document.querySelectorAll('[data-dd-hid]')];
  dd._before = dd._hidEls.map(h => dd.vis(h));
  const cs = getComputedStyle(e); dd._style = [cs.color, cs.backgroundColor, cs.borderColor, cs.boxShadow, cs.textDecorationLine, cs.opacity].join('|');
  dd._hash = location.href; dd._scrollY = scrollY; dd._active = document.activeElement;
  dd.observe(); return {hidden: dd._hidEls.length};
};
dd.diff = (idx) => {
  const e = document.querySelector('[data-dd-idx="' + idx + '"]');
  const newly = []; const hids = [];
  dd._hidEls.forEach((h, i) => { if (!dd._before[i] && dd.vis(h)) {
    hids.push(+h.getAttribute('data-dd-hid'));
    const b = h.closest('.sv-tt-pop,[role=tooltip],[role=dialog],[role=menu],[role=listbox]') || h;
    newly.push({where: String(b.className || b.tagName.toLowerCase()).slice(0, 60), role: b.getAttribute('role'),
                text: (b.innerText || b.textContent || '').replace(/\n+/g, ' | ').trim()}); } });
  for (const n of dd.added) { if (n.nodeType === 1 && dd.vis(n)) newly.push({where: 'added:' + n.tagName.toLowerCase(), text: (n.innerText || '').trim()}); }
  let style_changed = false;
  if (e) { const cs = getComputedStyle(e); style_changed = [cs.color, cs.backgroundColor, cs.borderColor, cs.boxShadow, cs.textDecorationLine, cs.opacity].join('|') !== dd._style; }
  return {newly, hids, mutations: dd.mut, url: location.href, urlChanged: location.href !== dd._hash,
          scrollMoved: Math.abs(scrollY - dd._scrollY) > 2, focused: document.activeElement !== dd._active ? dd.label(document.activeElement || document.body).slice(0, 80) : null,
          style_changed};
};
dd.hit = (idx) => {
  const e = document.querySelector('[data-dd-idx="' + idx + '"]'); if (!e) return {ok: false};
  e.scrollIntoView({block: 'center', inline: 'center'});
  const r = e.getBoundingClientRect(); const cx = r.left + Math.min(r.width / 2, Math.max(1, r.width - 2)), cy = r.top + Math.min(r.height / 2, Math.max(1, r.height - 2));
  const top = document.elementFromPoint(cx, cy);
  const ok = !!top && (top === e || e.contains(top) || top.contains(e));
  return {ok: true, cx, cy, onTop: ok, occluder: ok ? null : (top ? (dd.label(top).slice(0, 60) + ' <' + top.tagName.toLowerCase() + '>') : 'nothing'),
          vw: innerWidth, vh: innerHeight, inView: cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight};
};
dd.neutral = () => {  // a point over empty canvas (no candidate, no text) to park the mouse
  const pts = [[2, 2], [innerWidth - 3, 2], [2, innerHeight - 3], [innerWidth - 3, innerHeight - 3], [innerWidth / 2, 2]];
  for (const [x, y] of pts) { const t = document.elementFromPoint(x, y);
    if (!t || t === document.body || t === document.documentElement || t.id === 'dc-root' || (!t.closest('[data-dd-idx]') && !(t.innerText || '').trim())) return [x, y]; }
  return [2, 2];
};
})();
"""


# --------------------------------------------------------------------------------------------- helpers
def cdn_router(cache_dir):
    cache = pathlib.Path(cache_dir); cache.mkdir(parents=True, exist_ok=True)
    ctx = ssl.create_default_context(cafile=CA if os.path.exists(CA) else None)
    lock = threading.Lock()

    def handle(route):
        u = route.request.url
        fn = cache / (hashlib.md5(u.encode()).hexdigest() + "-" + re.sub(r"[^A-Za-z0-9._-]", "_", u.rsplit("/", 1)[-1])[:60])
        try:
            with lock:
                if not fn.exists():
                    fn.write_bytes(urllib.request.urlopen(u, context=ctx, timeout=60).read())
            ct = "application/javascript" if u.split("?")[0].endswith(".js") else ("text/css" if ".css" in u else "application/octet-stream")
            route.fulfill(body=fn.read_bytes(), content_type=ct, headers={"access-control-allow-origin": "*"})
        except Exception as e:  # fonts (Google) etc: let the browser try normally
            try:
                route.continue_()
            except Exception:
                pass
    return handle


def start_server(root):
    class H(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **k): super().__init__(*a, directory=str(root), **k)
        def log_message(self, *a): pass
    srv = socketserver.ThreadingTCPServer(("127.0.0.1", 0), H); srv.daemon_threads = True
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, f"http://127.0.0.1:{srv.server_address[1]}/"


def board_url(board, serve_base):
    if serve_base:
        return serve_base + urllib.parse.quote(board.name)
    return board.resolve().as_uri()


def wait_render(pg, min_ms=2500, max_ms=60000):
    pg.wait_for_timeout(min_ms); last = -1; t0 = time.time()
    while (time.time() - t0) * 1000 < max_ms:
        n = pg.evaluate("() => document.body.innerText.length + document.querySelectorAll('*').length")
        if n == last and n > 0:
            return n
        last = n; pg.wait_for_timeout(1000)
    return last


def open_board(p, url, cache, viewport):
    b = p.chromium.launch(executable_path=CHROME, args=ARGS)
    ctx = b.new_context(viewport=viewport)
    ctx.route(re.compile(r"^https://"), cdn_router(cache))
    pg = ctx.new_page()
    logs = []
    pg.on("pageerror", lambda e: logs.append("pageerror: " + str(e)[:300]))
    pg.on("console", lambda m: logs.append(m.type + ": " + m.text[:300]) if m.type in ("error", "warning") else None)
    return b, ctx, pg, logs


def load(pg, url, page_id=None):
    pg.goto(url + (("#" + urllib.parse.quote(page_id)) if page_id and not page_id.startswith("_") else ""), wait_until="load", timeout=180000)
    wait_render(pg)
    pg.evaluate(JS_LIB)


# --------------------------------------------------------------------------------------------- discovery
def discover(args, board, out, url):
    from playwright.sync_api import sync_playwright
    name = board.stem.replace(".dc", "")
    res = {"board": board.name, "url": url}
    nav = []
    with sync_playwright() as p:
        b, ctx, pg, logs = open_board(p, url, args.cdn_cache, args.vp)
        load(pg, url)
        res["render_stats"] = pg.evaluate("() => ({elements: document.querySelectorAll('*').length, textLen: document.body.innerText.length, scrollW: document.documentElement.scrollWidth, scrollH: document.documentElement.scrollHeight})")
        pages = pg.evaluate("(f) => __dd.pages(f)", [x for x in args.pages.split(",") if x])
        page_ids = [x["id"] for x in pages]
        res["pages"] = pages
        res["hover_rules"] = pg.evaluate("() => __dd.hoverRules()")
        res["hover_host_selectors"] = pg.evaluate("() => __dd.hoverHostSelectors()")
        # JS handler census via CDP (native listeners on elements other than the framework root + React props handlers)
        prev = out / f"{name}-discovery.json"
        prevd = json.loads(prev.read_text()) if (args.reuse_census and prev.exists()) else {}
        if "native_listener_elements" in prevd:
            res["native_listener_elements"] = prevd["native_listener_elements"]; res["react_handler_elements"] = prevd.get("react_handler_elements", [])
            res["census_reused_from_previous_discovery"] = True
        else:
          try:
              cdp = ctx.new_cdp_session(pg)
              n = pg.evaluate("() => { window.__ddAll = [...document.querySelectorAll('*')]; return window.__ddAll.length; }")
              with_listeners = []
              for i in range(n):
                  o = cdp.send("Runtime.evaluate", {"expression": f"window.__ddAll[{i}]"})["result"]["objectId"]
                  ls = [l["type"] for l in cdp.send("DOMDebugger.getEventListeners", {"objectId": o})["listeners"]]
                  ls = [t for t in ls if t not in ("load", "error")]
                  if ls:
                      with_listeners.append({"el": pg.evaluate(f"() => {{const e = window.__ddAll[{i}]; return e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + '.' + String(e.className).slice(0,40);}}"), "types": sorted(set(ls))[:12], "n_types": len(set(ls))})
              res["native_listener_elements"] = with_listeners
              res["react_handler_elements"] = pg.evaluate("() => [...document.querySelectorAll('*')].filter(e => { const k = Object.keys(e).find(k => k.startsWith('__reactProps')); return k && Object.keys(e[k] || {}).some(x => /^on[A-Z]/.test(x)); }).map(e => __dd.path(e)).slice(0, 500)")
              pg.evaluate("() => { delete window.__ddAll; }")
          except Exception as e:
              res["listener_census_error"] = repr(e)
        hidden = pg.evaluate("() => __dd.hiddenInventory()")
        enum = pg.evaluate("(ids) => __dd.enumerate(ids)", page_ids)
        cands = enum["candidates"]
        res["hidden_pointer_elements_skipped_as_hidden_content"] = enum["hiddenPointer"]
        res["hidden_inventory"] = hidden
        res["selects"] = pg.evaluate("() => [...document.querySelectorAll('select')].map(s => ({path: __dd.path(s), options: [...s.options].map(o => o.text)}))")
        res["datalists"] = pg.evaluate("() => [...document.querySelectorAll('datalist')].map(s => ({id: s.id, options: [...s.options].map(o => o.value)}))")
        res["dc_imports"] = pg.evaluate("() => [...document.querySelectorAll('dc-import,[data-sc-name]')].map(e => (e.getAttribute('name') || e.getAttribute('data-sc-name')) + ' ' + [...e.attributes].filter(a => !/^(name|data-sc-name|data-dc-tpl|style|class)$/.test(a.name)).map(a => a.name + '=' + a.value).join(' ')).reduce((m, k) => (m[k] = (m[k] || 0) + 1, m), {})")
        # ---- page texts (visible only) -----------------------------------------------------------------
        with open(out / f"{name}-pages.txt", "w") as fh:
            fh.write(f"# {board.name} — visible text per page (hidden tooltip text excluded; it is listed per interaction)\n")
            segs = [("_header_or_outside", None)] + [(x["id"], x["label"]) for x in pages]
            if not pages:
                segs = [("_whole_board", None)]
            for pid, lab in segs:
                if pid in ("_whole_board",):
                    t = pg.evaluate("() => __dd.visibleText(document.body)")
                elif pid == "_header_or_outside":
                    t = pg.evaluate("(ids) => __dd.blocks().filter(b => !ids.some(id => __dd.pageEl(id) === b)).map(b => __dd.visibleText(b)).join('\\n')", page_ids)
                else:
                    t = pg.evaluate("(id) => __dd.visibleText(__dd.pageEl(id))", pid)
                fh.write(f"\n\n======================== PAGE {pid} {('— ' + lab) if lab else ''} ========================\n{t}\n")
                res.setdefault("page_text_chars", {})[pid] = len(t)
        # ---- page navigation via the board's own pills and via URL hash (or by scrolling, for boards without page nav)
        REACH = "(id) => { const r = __dd.pageEl(id).getBoundingClientRect(); return {hash: location.hash, targetTop: Math.round(r.top), scrollY: Math.round(scrollY), reached: Math.abs(r.top) < 60 || (r.top >= 0 && r.top < innerHeight) || (r.top < 0 && r.bottom > 0)}; }"
        for pgd in pages:
            rec = {"board": board.name, "page": pgd["id"], "label": pgd["label"], "mode": pgd.get("mode")}
            if pgd.get("mode") == "scroll":
                try:
                    load(pg, url); pg.evaluate("() => __dd.pages()")
                    pg.evaluate("(id) => __dd.pageEl(id).scrollIntoView({block: 'start'})", pgd["id"]); pg.wait_for_timeout(400)
                    rec["scroll"] = pg.evaluate(REACH, pgd["id"])
                    pg.screenshot(path=str(out / "screenshots" / f"{name}--page-{pgd['id']}--via-scroll.png"))
                    rec["note"] = "board has no page navigation and this section has no id: reached by scrolling the canvas"
                    if pg.evaluate("(id) => !!document.getElementById(id)", pgd["id"]):
                        load(pg, url, pgd["id"]); rec["url_hash"] = pg.evaluate(REACH, pgd["id"])
                except Exception as e:
                    rec["scroll_error"] = repr(e)[:300]
                nav.append(rec); continue
            try:
                load(pg, url)
                pg.locator(f"a[href='#{pgd['id']}']").first.click(timeout=10000)
                pg.wait_for_timeout(800)
                rec["pill_click"] = pg.evaluate(REACH, pgd["id"])
                pg.screenshot(path=str(out / "screenshots" / f"{name}--page-{pgd['id']}--via-pill.png"))
            except Exception as e:
                rec["pill_click_error"] = repr(e)[:300]
            try:
                load(pg, url, pgd["id"])
                rec["url_hash"] = pg.evaluate(REACH, pgd["id"])
            except Exception as e:
                rec["url_hash_error"] = repr(e)[:300]
            nav.append(rec)
        # ---- cross-board links (followed) ------------------------------------------------------------------
        load(pg, url)
        xlinks = pg.evaluate("() => { const m = {}; for (const a of document.querySelectorAll('a[href]')) { const h = a.getAttribute('href'); if (h.startsWith('#') || /\\.css$/.test(h)) continue; (m[h] = m[h] || []).push(__dd.label(a)); } return m; }")
        for href, labels in xlinks.items():
            rec = {"board": board.name, "cross_board_link": href, "link_labels": sorted(set(labels))[:10], "n_links": len(labels)}
            try:
                dest = urllib.parse.urljoin(url, href)
                pg.goto(dest, wait_until="load", timeout=120000); wait_render(pg, 1500, 30000)
                frag = urllib.parse.unquote(urllib.parse.urlparse(dest).fragment)
                rec["landed"] = pg.evaluate("(f) => ({title: (document.body.innerText || '').split('\\n').filter(Boolean).slice(0, 3).join(' / '), textLen: (document.body.innerText || '').length, fragment: f, fragmentExists: f ? !!document.getElementById(f) : null, fragmentText: f && document.getElementById(f) ? document.getElementById(f).innerText.split('\\n').filter(Boolean).slice(0, 3).join(' / ') : null})", frag)
            except Exception as e:
                rec["error"] = repr(e)[:300]
            nav.append(rec)
        # ---- variants: dark theme + widths ----------------------------------------------------------------
        variants = []
        base_txt = None
        for vname, vurl, vp in [("light-1440", url, args.vp), ("dark-1440", url + ("&" if "?" in url else "?") + "theme=dark", args.vp),
                                ("light-768", url, {"width": 768, "height": 1024}), ("light-1920", url, {"width": 1920, "height": 1080})]:
            try:
                pg.set_viewport_size(vp); pg.goto(vurl, wait_until="load", timeout=120000); wait_render(pg, 2000, 30000); pg.evaluate(JS_LIB)
                txt = pg.evaluate("() => __dd.visibleText(document.body)")
                if base_txt is None: base_txt = txt
                bg = pg.evaluate("() => getComputedStyle(document.body).backgroundColor + ' / html ' + getComputedStyle(document.documentElement).backgroundColor")
                bl, vl = base_txt.splitlines(), txt.splitlines()
                variants.append({"variant": vname, "text_chars": len(txt), "same_text_as_light_1440": txt == base_txt,
                                 "lines_only_here": [l for l in vl if l not in set(bl)][:50], "lines_missing_here": [l for l in bl if l not in set(vl)][:50], "background": bg})
                pg.screenshot(path=str(out / "screenshots" / f"{name}--variant-{vname}.png"))
            except Exception as e:
                variants.append({"variant": vname, "error": repr(e)[:300]})
        pg.set_viewport_size(args.vp)
        res["variants"] = variants
        res["console"] = logs[:200]
        b.close()
    with open(out / f"{name}-navigation.jsonl", "w") as fh:
        for r in nav:
            fh.write(json.dumps(r, ensure_ascii=False) + "\n")
    res["candidates"] = cands
    (out / f"{name}-discovery.json").write_text(json.dumps(res, ensure_ascii=False, indent=1))
    return res


# --------------------------------------------------------------------------------------------- interaction worker
_CDP = {}
def _cdp(ctx, pg):
    if id(pg) not in _CDP:
        c = ctx.new_cdp_session(pg); c.send("DOM.enable"); c.send("CSS.enable"); _CDP[id(pg)] = c
    return _CDP[id(pg)]


def force_hover(ctx, pg, idx):
    """Force :hover/:focus-within on the element and every ancestor (what a real pointer over it would set)."""
    cdp = _cdp(ctx, pg)
    pg.evaluate("(i) => { let e = document.querySelector('[data-dd-idx=\"' + i + '\"]'); let k = 0; while (e && e !== document.documentElement) { e.setAttribute('data-dd-anc', String(k++)); e = e.parentElement; } }", idx)
    root = cdp.send("DOM.getDocument", {"depth": 0})["root"]["nodeId"]
    nodes = cdp.send("DOM.querySelectorAll", {"nodeId": root, "selector": "[data-dd-anc]"})["nodeIds"]
    for n in nodes:
        cdp.send("CSS.forcePseudoState", {"nodeId": n, "forcedPseudoClasses": ["hover", "focus-within"]})
    pg.evaluate("() => { window.__ddForced = true; }")
    _CDP[("nodes", id(pg))] = nodes
    return nodes


def unforce(ctx, pg):
    cdp = _cdp(ctx, pg)
    for n in _CDP.pop(("nodes", id(pg)), []):
        try:
            cdp.send("CSS.forcePseudoState", {"nodeId": n, "forcedPseudoClasses": []})
        except Exception:
            pass
    pg.evaluate("() => document.querySelectorAll('[data-dd-anc]').forEach(e => e.removeAttribute('data-dd-anc'))")


def worker(wid, nworkers, args_d, board_s, out_s, url, cands, mode="normal"):
    from playwright.sync_api import sync_playwright
    args = argparse.Namespace(**args_d); board = pathlib.Path(board_s); out = pathlib.Path(out_s)
    name = board.stem.replace(".dc", "")
    mine = [c for i, c in enumerate(cands) if i % nworkers == wid]
    page_ids = [x for x in dict.fromkeys(c["page"] for c in cands) if not x.startswith("_")]
    done = set()   # resume: anything already recorded by ANY worker of an earlier run (worker count may differ)
    for f in out.glob(f".{name}-interactions.w*.jsonl"):
        try:
            for line in open(f):
                try:
                    d = json.loads(line)
                    if "error" not in d:      # failed interactions are retried on resume
                        done.add((d["idx"], d["action"]))
                except Exception:
                    pass
        except Exception:
            pass
    fh = open(out / f".{name}-interactions.w{wid}-{os.getpid()}.jsonl", "a")
    with sync_playwright() as p:
        b, ctx, pg, logs = open_board(p, url, args.cdn_cache, args.vp)
        state = {"page": None, "dirty": True, "reloads": 0}

        def fresh(page_id):
            if state["dirty"]:
                load(pg, url, page_id if not scroll_mode else None)
                pg.evaluate("(f) => __dd.pages(f)", [] if scroll_mode else page_ids_all)
                pg.evaluate("() => __dd.hiddenInventory()")
                pg.evaluate("(ids) => __dd.enumerate(ids)", page_ids_all)
                if scroll_mode and not page_id.startswith("_"):
                    pg.evaluate("(id) => __dd.pageEl(id).scrollIntoView({block: 'start'})", page_id)
                state["reloads"] += 1; state["dirty"] = False; state["page"] = page_id
            elif scroll_mode and (state["page"] != page_id or pg.evaluate("() => location.hash.length > 1")):
                pg.evaluate("(id) => { if (location.hash.length > 1) location.hash = ''; const p = __dd.pageEl(id); if (p) p.scrollIntoView({block: 'start'}); }", page_id)
                state["page"] = page_id
            elif not scroll_mode and (state["page"] != page_id or pg.evaluate("(id) => location.hash.slice(1) !== (id.startsWith('_') ? '' : id)", page_id)):
                # the board's own page navigation (hash), not a reload
                pg.evaluate("(id) => { if (!id.startsWith('_')) location.hash = id; else location.hash = ''; }", page_id)
                state["page"] = page_id
            nx, ny = pg.evaluate("() => __dd.neutral()")
            pg.mouse.move(nx, ny)
            pg.evaluate("() => { if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur(); }")

        _disc = json.loads((out / f"{name}-discovery.json").read_text())
        page_ids_all = _disc["_page_ids"]
        scroll_mode = any(x.get("mode") == "scroll" for x in _disc["pages"])
        for c in mine:
            for action in (("hover-forced", "click-forced") if mode == "forced" else ("hover", "click")):
                if (c["idx"], action) in done:
                    continue
                rec = {"board": board.name, "page": c["page"], "idx": c["idx"], "label": c["label"], "tag": c["tag"], "kinds": c["kinds"],
                       "selector": c["path"], "pos": [c["x"], c["y"], c["w"], c["h"]], "href": c["href"], "action": action}
                try:
                    fresh(c["page"])
                    PREP = "(i) => { const e = document.querySelector('[data-dd-idx=\"' + i + '\"]'); if (!e) return null; return {label: __dd.label(e), hit: __dd.hit(i), neutral: __dd.neutral()}; }"
                    pr = pg.evaluate(PREP, c["idx"])
                    if pr is None:  # enumeration drifted -> reload and re-tag
                        state["dirty"] = True; fresh(c["page"]); pr = pg.evaluate(PREP, c["idx"])
                    if pr["label"] != c["label"]:
                        rec["label_drift"] = pr["label"]
                    pg.mouse.move(*pr["neutral"]); pg.wait_for_timeout(180)
                    h = pg.evaluate("(i) => { const h = __dd.hit(i); __dd.snap(i); return h; }", c["idx"])
                    rec["on_top"] = h.get("onTop"); rec["occluder"] = h.get("occluder")
                    wait = args.fast_wait if c.get("fast") else args.wait
                    if action == "hover":
                        pg.mouse.move(h["cx"], h["cy"])
                        pg.wait_for_timeout(wait)
                    elif action == "hover-forced":
                        # the element is covered (e.g. by a modal drawn over the screen): force the CSS :hover and
                        # :focus-within state on it and its ancestors through the DevTools protocol, as a real hover would set
                        forced_nodes = force_hover(ctx, pg, c["idx"])
                        rec["forced_nodes"] = len(forced_nodes)
                        pg.wait_for_timeout(max(wait, 400))
                    else:
                        url_before = pg.url.split("#")[0]
                        if action == "click-forced":
                            # the element's own activation, under the overlay (SVG nodes have no .click(): dispatch the event)
                            pg.evaluate("(i) => { const e = document.querySelector('[data-dd-idx=\"' + i + '\"]'); for (const t of ['pointerdown', 'mousedown', 'pointerup', 'mouseup']) e.dispatchEvent(new MouseEvent(t, {bubbles: true, cancelable: true, view: window})); if (typeof e.click === 'function') e.click(); else e.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window})); }", c["idx"])
                        else:
                            pg.mouse.click(h["cx"], h["cy"])
                        pg.wait_for_timeout(wait)
                        try:
                            pg.wait_for_load_state("load", timeout=20000)
                        except Exception:
                            pass
                        if pg.url.split("#")[0] != url_before:
                            rec["navigated_to_document"] = pg.url
                            wait_render(pg, 1000, 20000)
                            rec["landed_text"] = pg.evaluate("() => (document.body.innerText || '').split('\\n').filter(Boolean).slice(0, 4).join(' / ')")
                            frag = urllib.parse.unquote(urllib.parse.urlparse(pg.url).fragment)
                            if frag:
                                rec["landed_fragment_exists"] = pg.evaluate("(f) => !!document.getElementById(f)", frag)
                            state["dirty"] = True
                    if not state["dirty"]:
                        d = pg.evaluate("(i) => __dd.diff(i)", c["idx"])
                        rec.update({k: d[k] for k in ("mutations", "urlChanged", "scrollMoved", "focused", "style_changed")})
                        rec["exposed_text"] = d["newly"]; rec["hidden_ids_exposed"] = d["hids"]
                        if d["urlChanged"]:
                            frag = urllib.parse.unquote(urllib.parse.urlparse(d["url"]).fragment)
                            rec["nav_hash"] = frag
                            rec["nav_target_text"] = pg.evaluate("(f) => { const t = document.getElementById(f); return t ? t.innerText.split('\\n').filter(Boolean).slice(0, 4).join(' / ') : null; }", frag)
                            rec["nav_target_exists"] = rec["nav_target_text"] is not None
                        if c.get("title") and action in ("hover", "hover-forced"):
                            rec["native_title_tooltip"] = c["title"]
                        exposed = bool(d["newly"]) or bool(rec.get("native_title_tooltip"))
                        rec["exposed"] = exposed
                        rec["exposed_kind"] = ("tooltip/hover-card" if any(x.get("where", "").startswith("sv-tt") or x.get("role") == "tooltip" for x in d["newly"]) else
                                               "new-content" if d["newly"] else "native-title" if rec.get("native_title_tooltip") else
                                               "navigation-in-board" if d["urlChanged"] else "none")
                        if exposed:
                            shot = out / "screenshots" / f"{name}--{c['page']}--{c['idx']:05d}-{action}.png"
                            pg.screenshot(path=str(shot)); rec["screenshot"] = str(shot.relative_to(out))
                        if d["mutations"]:
                            state["dirty"] = True    # DOM changed => full reload before next interaction
                        elif d["urlChanged"] or d["scrollMoved"] or d["focused"]:
                            state["page"] = None     # only hash/scroll moved => re-navigate with the board's own page hash
                    else:
                        rec["exposed"] = bool(rec.get("navigated_to_document"))
                        rec["exposed_kind"] = "navigation-other-board" if rec.get("navigated_to_document") else "none"
                except Exception as e:
                    rec["error"] = repr(e)[:400]; rec["exposed"] = None; state["dirty"] = True
                if action == "hover-forced":
                    try:
                        unforce(ctx, pg)
                    except Exception:
                        state["dirty"] = True
                fh.write(json.dumps(rec, ensure_ascii=False) + "\n"); fh.flush()
        b.close()
    fh.close()
    return state


# --------------------------------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("board"); ap.add_argument("out")
    ap.add_argument("--workers", type=int, default=3)
    ap.add_argument("--wait", type=int, default=500)
    ap.add_argument("--fast-wait", type=int, default=250)
    ap.add_argument("--viewport", default="1440x900")
    ap.add_argument("--serve", action="store_true", help="serve the board's folder over http://127.0.0.1 instead of file://")
    ap.add_argument("--cdn-cache", default=str(pathlib.Path(os.environ.get("TMPDIR", "/tmp")) / "drive_design_cdn_cache"))
    ap.add_argument("--pages", default="", help="force the page ids (comma list) instead of auto-detecting the board's page nav")
    ap.add_argument("--reuse-census", action="store_true", help="reuse the JS-listener census from an existing discovery.json (it is slow on huge boards)")
    ap.add_argument("--skip-discovery", action="store_true")
    ap.add_argument("--no-forced", action="store_true", help="skip the forced pass over covered elements")
    args = ap.parse_args()
    w, h = args.viewport.split("x"); args.vp = {"width": int(w), "height": int(h)}
    board = pathlib.Path(args.board).resolve(); out = pathlib.Path(args.out).resolve(); args.cdn_cache = str(pathlib.Path(args.cdn_cache).resolve()); (out / "screenshots").mkdir(parents=True, exist_ok=True)
    name = board.stem.replace(".dc", "")
    os.chdir(board.parent)   # load from inside the package folder
    srv = None; base = None
    if args.serve:
        srv, base = start_server(board.parent)
    url = board_url(board, base)
    t0 = time.time()
    if args.skip_discovery and (out / f"{name}-discovery.json").exists():
        disc = json.loads((out / f"{name}-discovery.json").read_text())
    else:
        disc = discover(args, board, out, url)
        disc["_page_ids"] = [x["id"] for x in disc["pages"]]
        (out / f"{name}-discovery.json").write_text(json.dumps(disc, ensure_ascii=False, indent=1))
    cands = disc["candidates"]
    print(f"[{name}] discovery: {len(disc['pages'])} pages, {len(cands)} candidates, {len(disc['hidden_inventory'])} hidden text blocks; {time.time()-t0:.0f}s", flush=True)
    ad = {k: v for k, v in vars(args).items()}
    nw = max(1, min(args.workers, len(cands) or 1))
    if cands:
        if nw == 1:
            worker(0, 1, ad, str(board), str(out), url, cands)
        else:
            with mp.get_context("spawn").Pool(nw) as pool:
                pool.starmap(worker, [(i, nw, ad, str(board), str(out), url, cands) for i in range(nw)])
    # FORCED PASS: every element a real pointer could not reach (covered by an overlay drawn over the screen) is
    # hovered again with :hover/:focus-within forced, and activated with its own click(), so nothing under a drawn
    # modal goes undriven.
    prev = {}
    for f in sorted(out.glob(f".{name}-interactions.w*.jsonl")):
        for line in open(f):
            try:
                d = json.loads(line); prev[(d["idx"], d["action"])] = d
            except Exception:
                pass
    occl = sorted({k[0] for k, d in prev.items() if d.get("on_top") is False and k[1] in ("hover", "click")})
    if occl and not args.no_forced:
        fc = [c for c in cands if c["idx"] in set(occl)]
        print(f"[{name}] forced pass over {len(fc)} covered elements", flush=True)
        nwf = max(1, min(args.workers, len(fc)))
        if nwf == 1:
            worker(0, 1, ad, str(board), str(out), url, fc, "forced")
        else:
            with mp.get_context("spawn").Pool(nwf) as pool:
                pool.starmap(worker, [(i, nwf, ad, str(board), str(out), url, fc, "forced") for i in range(nwf)])
    # merge worker logs, de-duplicate on (idx, action), keep last
    recs = {}
    for f in sorted(out.glob(f".{name}-interactions.w*.jsonl")):
        for line in open(f):
            d = json.loads(line)
            if "error" in d and (d["idx"], d["action"]) in recs and "error" not in recs[(d["idx"], d["action"])]:
                continue
            recs[(d["idx"], d["action"])] = d
    with open(out / f"{name}-interactions.jsonl", "w") as fh:
        for k in sorted(recs):
            fh.write(json.dumps(recs[k], ensure_ascii=False) + "\n")
    # summary + coverage
    summ = {"board": board.name, "url_mode": "http-served" if args.serve else "file://", "pages": {}, "elapsed_s": round(time.time() - t0)}
    allp = ["_header_or_outside"] + disc["_page_ids"] if disc["_page_ids"] else sorted({c["page"] for c in cands})
    for pid in sorted({c["page"] for c in cands} | set(disc["_page_ids"]), key=lambda x: allp.index(x) if x in allp else 99):
        cs = [c for c in cands if c["page"] == pid]
        rs = [r for r in recs.values() if r["page"] == pid]
        hv = [r for r in rs if r["action"] == "hover"]; ck = [r for r in rs if r["action"] == "click"]
        summ["pages"][pid] = {
            "elements_found": len(cs),
            "of_which_pointer_inherited_batched": sum(1 for c in cs if c.get("fast")),
            "hovered": sum(1 for r in hv if "error" not in r), "clicked": sum(1 for r in ck if "error" not in r),
            "hover_exposed": sum(1 for r in hv if r.get("exposed")), "click_exposed": sum(1 for r in ck if r.get("exposed")),
            "click_navigated_in_board": sum(1 for r in ck if r.get("urlChanged")), "click_navigated_other_board": sum(1 for r in ck if r.get("navigated_to_document")),
            "hover_style_change": sum(1 for r in hv if r.get("style_changed")),
            "occluded": len({r["idx"] for r in rs if r.get("on_top") is False and r["action"] in ("hover", "click")}),
            "covered_forced_hovered": sum(1 for r in rs if r["action"] == "hover-forced" and "error" not in r),
            "covered_forced_clicked": sum(1 for r in rs if r["action"] == "click-forced" and "error" not in r),
            "forced_hover_exposed": sum(1 for r in rs if r["action"] == "hover-forced" and r.get("exposed")),
            "forced_click_exposed": sum(1 for r in rs if r["action"] == "click-forced" and r.get("exposed")),
            "failed": sum(1 for r in rs if "error" in r), "missing": 2 * len(cs) - len(hv) - len(ck),
            "fail_reasons": sorted({r["error"][:120] for r in rs if "error" in r})[:10],
        }
    hid_total = len(disc["hidden_inventory"])
    hid_exposed = sorted({h for r in recs.values() for h in r.get("hidden_ids_exposed", [])})
    summ["hidden_text_blocks"] = hid_total; summ["hidden_text_blocks_exposed_by_interaction"] = len(hid_exposed)
    summ["hidden_text_blocks_never_exposed"] = [x for x in disc["hidden_inventory"] if x["hid"] not in set(hid_exposed)]
    summ["interactions"] = len(recs); summ["exposed"] = sum(1 for r in recs.values() if r.get("exposed"))
    (out / f"{name}-summary.json").write_text(json.dumps(summ, ensure_ascii=False, indent=1))
    print(json.dumps({k: v for k, v in summ.items() if k != "hidden_text_blocks_never_exposed"}, indent=1))
    if srv:
        srv.shutdown()


if __name__ == "__main__":
    main()
