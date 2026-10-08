#!/usr/bin/env python3
"""STATEFUL design crawler (Rule 120: the whole design is driven, every time — never a delta).

drive_design_full.py resets the board after every interaction, so it only reaches states ONE click deep.
An interactive prototype (switch display -> open a card menu -> open a dialog -> confirm) hides most of its
content deeper than that. This crawler explores the prototype as a STATE GRAPH:

  state 0 = fresh load. For every state it reaches, it enumerates EVERY visible interactive element and, from
  that exact state, HOVERS it (records tooltips / newly shown text) and CLICKS it (records what appears, and
  whether the screen became a new state). Text inputs are typed into (a matching term and a no-match term);
  every <select> option is chosen; every draggable is dragged onto every drop target (and onto its own
  neighbour, to reorder). A resulting screen is EXPANDED (crawled in turn) when it shows any text line never
  seen in an already-expanded state — so every distinct thing the design can show gets its own element sweep,
  while the 40 identical "open row menu" screens do not each get one.

  State is reached by replaying its action path from a fresh load (the prototype keeps nothing between loads;
  storage is cleared anyway). After each interaction that changed the screen, the crawler restores the state
  (Escape first; if that does not restore the fingerprint, reload + replay).

  python3 crawl_design_states.py <board.html> <out-dir> [--max-depth 6] [--max-states 400] [--viewport 1440x900]
          [--vendor DIR] [--wait 400] [--resume]
  --vendor DIR maps https://unpkg.com/<pkg>@<ver>/... to DIR/<react|react-dom|babel>.js when present; any other
  https asset is fetched with VERIFIED TLS through the agent proxy CA bundle and cached.

Outputs: states.jsonl (one line per expanded state: id, depth, path, fingerprint, visible text, screenshot),
         actions.jsonl (one line per (state, element, action): what appeared, tooltip, new state id),
         summary.json (counts per state, every element tried, failures), screenshots/.
"""
import argparse, hashlib, http.server, json, os, pathlib, re, socketserver, ssl, sys, threading, time, urllib.request
from playwright.sync_api import sync_playwright

CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
CA = "/root/.ccr/ca-bundle.crt"

ENUM_JS = r"""
() => {
  const SEL = 'button,a,[role=button],[role=tab],[role=checkbox],[role=switch],[role=menuitem],[role=option],[role=radio],[role=combobox],[role=menuitemcheckbox],[role=menuitemradio],[role=slider],input,select,textarea,summary,[onclick],[tabindex]:not([tabindex="-1"]),[draggable=true],[data-tip],[title],[data-menu],[data-pin],[data-detail],[data-wo],[data-group],[data-gdrag],[data-tech]';
  const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.01; };
  const set = new Set(document.querySelectorAll(SEL));
  // drop zones (board columns / Tech View groups) are not clickable, but every draggable is dropped on each of them
  document.querySelectorAll('[data-group-id],[data-group],[data-tech]').forEach(e => set.add(e));
  // every outermost element with a pointer cursor counts too (prototype click targets are often plain divs)
  for (const e of document.querySelectorAll('body *')) {
    if (getComputedStyle(e).cursor === 'pointer' && !(e.parentElement && getComputedStyle(e.parentElement).cursor === 'pointer')) set.add(e);
  }
  for (const e of document.querySelectorAll('body *')) {
    const k = Object.keys(e).find(k => k.startsWith('__reactProps$'));
    if (k && e[k] && ['onClick','onMouseEnter','onMouseOver','onPointerDown','onMouseDown','onDragStart','onDoubleClick','onFocus','onKeyDown','onChange'].some(h => typeof e[k][h] === 'function')) set.add(e);
  }
  const out = []; const seen = {};
  const label = (e) => (e.getAttribute('aria-label') || e.getAttribute('title') || e.getAttribute('data-tip-text') || e.getAttribute('placeholder') || (e.innerText || e.value || '')).replace(/\s+/g, ' ').trim().slice(0, 80);
  const ctx = (e) => { const g = e.closest('[data-group-id]'); const w = e.closest('[data-wo]');
    return (g ? 'g:' + g.getAttribute('data-group-id') : '') + (w ? ' wo:' + w.getAttribute('data-wo') : ''); };
  for (const e of set) {
    if (!vis(e)) continue;
    const tag = e.tagName.toLowerCase(); const role = e.getAttribute('role') || '';
    const type = (e.getAttribute('type') || '').toLowerCase();
    const base = [tag, role, type, label(e), ctx(e)].join('|');
    seen[base] = (seen[base] || 0) + 1;
    const key = base + '#' + seen[base];
    e.setAttribute('data-crawl-key', key);
    const r = e.getBoundingClientRect();
    out.push({ key, tag, role, type, label: label(e), ctx: ctx(e),
      draggable: e.getAttribute('draggable') === 'true',
      drop: e.matches('[data-group-id],[data-group],[data-tech]'),
      text_input: (tag === 'input' && ['', 'text', 'search'].includes(type)) || tag === 'textarea',
      select: tag === 'select', options: tag === 'select' ? [...e.options].map(o => o.value) : [],
      x: r.x + r.width / 2, y: r.y + r.height / 2 });
  }
  return out;
}
"""
TEXT_JS = r"""() => {
  const lines = (document.body.innerText || '').split('\n').map(s => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const overlays = [...document.querySelectorAll('[role=dialog],[role=menu],[role=listbox],[role=tooltip],[aria-modal=true]')]
     .filter(e => e.getBoundingClientRect().width > 0).map(e => e.getAttribute('role') || 'modal');
  return { lines, overlays, theme: document.documentElement.getAttribute('data-theme') || '' };
}"""


NAMES = set()


def shape(line):
    """A text line with its record data replaced by placeholders, so the same message about another work order, amount
    or person is not "new design content" (it is still recorded verbatim in actions.jsonl)."""
    l = re.sub(r"\b[A-Z]\d*-\d+\b", "#WO", line)
    for n in sorted(NAMES, key=len, reverse=True):  # only people the board itself shows (avatar / technician labels)
        if n in l: l = l.replace(n, "#NAME")
    l = re.sub(r"[$]?\d[\d,]*(?:\.\d+)?%?", "#N", l)
    return l


def serve(root):
    class H(http.server.SimpleHTTPRequestHandler):
        def __init__(s, *a, **k): super().__init__(*a, directory=root, **k)
        def log_message(s, *a): pass
        def handle(s):
            try: super().handle()
            except (BrokenPipeError, ConnectionResetError): pass
    srv = socketserver.ThreadingTCPServer(("127.0.0.1", 0), H); srv.daemon_threads = True
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv.server_address[1]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("board"); ap.add_argument("out")
    ap.add_argument("--max-depth", type=int, default=6); ap.add_argument("--max-states", type=int, default=400)
    ap.add_argument("--viewport", default="1440x900"); ap.add_argument("--vendor"); ap.add_argument("--wait", type=int, default=250)
    ap.add_argument("--resume", action="store_true")
    ap.add_argument("--seed", default="", help="actions from fresh load to the crawl's root state: 'key::action;key::action'")
    ap.add_argument("--no-expand", default="", help="regex on element labels whose resulting screens are recorded but not crawled (another worker crawls them)")
    ap.add_argument("--variants", action="store_true", help="after the crawl, capture every expanded state in dark theme and the root at 768/1024/1920 px")
    a = ap.parse_args()
    board = pathlib.Path(a.board).resolve(); out = pathlib.Path(a.out); (out / "screenshots").mkdir(parents=True, exist_ok=True)
    cache = out / ".cdn-cache"; cache.mkdir(exist_ok=True)
    port = serve(str(board.parent)); url = f"http://127.0.0.1:{port}/{urllib.parse.quote(board.name)}"
    W, Hh = map(int, a.viewport.split("x"))
    sslctx = ssl.create_default_context(cafile=CA)

    def fulfil(route):
        u = route.request.url
        if a.vendor:
            for name in ("react-dom", "react", "babel"):
                if re.search(rf"/(@babel/standalone|{name})@", u) and (name != "react" or "react-dom" not in u):
                    f = pathlib.Path(a.vendor) / ("babel.js" if "babel" in u else name + ".js")
                    if f.exists(): return route.fulfill(body=f.read_bytes(), content_type="application/javascript")
        f = cache / hashlib.sha1(u.encode()).hexdigest()
        if not f.exists():
            f.write_bytes(urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), context=sslctx, timeout=60).read())
        ct = "application/javascript" if u.endswith(".js") else ("text/css" if u.endswith(".css") else None)
        return route.fulfill(body=f.read_bytes(), content_type=ct) if ct else route.fulfill(body=f.read_bytes())

    FORCED = []
    states_f = out / "states.jsonl"; actions_f = out / "actions.jsonl"
    seen_lines = set(); states = []; done = set()
    tried = set()  # (element key, action) already exercised successfully on SOME screen
    if a.resume and states_f.exists():
        states = [json.loads(l) for l in open(states_f)]
        for s in states: seen_lines.update(shape(x) for x in s["lines"])
        if actions_f.exists():
            for l in open(actions_f):
                r = json.loads(l)
                if not r.get("error"):
                    done.add((r["state"], r["key"], r["action"]))  # failed actions are retried
                    tried.add((r["key"], r["action"].split(":")[0] if r["action"].startswith("drag") else r["action"]))

    with sync_playwright() as p:
        br = p.chromium.launch(executable_path=CHROME, args=["--no-sandbox", "--disable-gpu"])
        ctx = br.new_context(viewport={"width": W, "height": Hh}); page = ctx.new_page()
        page.route(re.compile(r"^https://"), fulfil)
        page.on("dialog", lambda d: d.dismiss())

        def snap():
            t = page.evaluate(TEXT_JS); fp = hashlib.sha1(("\n".join(t["lines"]) + "|" + ",".join(sorted(t["overlays"])) + "|" + t["theme"]).encode()).hexdigest()[:16]
            return fp, t

        def fresh():
            page.goto(url, wait_until="networkidle", timeout=120000)
            page.evaluate("() => { try { localStorage.clear(); sessionStorage.clear(); } catch (e) {} }")
            page.wait_for_timeout(1500); page.mouse.move(2, 2)

        def sel(k): return '[data-crawl-key="' + k.replace('\\', '\\\\').replace('"', '\\"') + '"]'

        def reveal(k):  # buttons that only appear while the pointer is over their row / card: hover that container first
            m = re.search(r"\|g:([^ |#]*)(?: wo:([^|#]*))?", k)
            if m and m.group(2):
                c = page.locator(f'[data-wo="{m.group(2)}"]')
                if c.count(): c.first.hover(timeout=3000, force=True); page.wait_for_timeout(150); return
            # no row/card id in the key (e.g. List rows): hover rows/cards one by one until the element is there
            rows = page.locator('tr, [data-wo], [role=row]')
            for i in range(min(rows.count(), 80)):
                try: rows.nth(i).hover(timeout=1500, force=True)
                except Exception: continue
                page.wait_for_timeout(80); page.evaluate(ENUM_JS)
                if page.locator(sel(k)).count(): return

        def act(el_key, action, arg=None):
            loc = page.locator(sel(el_key))
            if loc.count() == 0:
                page.evaluate(ENUM_JS)  # re-tag keys only when the DOM was re-rendered
                loc = page.locator(sel(el_key))
            if loc.count() == 0:
                reveal(el_key); page.evaluate(ENUM_JS); loc = page.locator(sel(el_key))
            if loc.count() == 0: raise RuntimeError("element not found: " + el_key)
            loc = loc.first
            try: loc.scroll_into_view_if_needed(timeout=3000)
            except Exception: pass
            def forced(fn):
                try: fn(False)
                except Exception as ex:  # covered by a sticky header / overlay: drive it anyway, as the driver's forced pass does
                    if "Timeout" not in str(ex): raise
                    fn(True); FORCED.append(el_key)
            if action == "hover": forced(lambda f: loc.hover(timeout=3000, force=f))
            elif action == "click": forced(lambda f: loc.click(timeout=3000, force=f))
            elif action == "type": loc.fill(arg, timeout=3000)
            elif action == "select": loc.select_option(arg, timeout=3000)
            elif action == "drag":
                tgt = page.locator(sel(arg))
                if tgt.count() == 0: page.evaluate(ENUM_JS); tgt = page.locator(sel(arg))
                tgt = tgt.first
                try: loc.drag_to(tgt, timeout=5000)
                except Exception as ex:  # drop zone covered by a sticky header / another layer: drag anyway
                    if "Timeout" not in str(ex): raise
                    loc.drag_to(tgt, timeout=8000, force=True); FORCED.append(el_key)
            page.wait_for_timeout(a.wait)

        def goto_state(path):
            fresh()
            for st in path: act(*st)

        def add_state(path, depth, fp, t, parent=None):
            sid = len(states); shot = f"screenshots/state-{sid:04d}.png"
            page.screenshot(path=str(out / shot), full_page=False)
            _els = page.evaluate(ENUM_JS); keys = [e["key"] for e in _els]
            NAMES.update(e["label"] for e in _els if e["tag"] == "img" and re.fullmatch(r"[A-Z][a-z]+(?: [A-Z][a-z]+)+", e["label"] or ""))
            s = {"id": sid, "parent": parent, "keys": keys, "depth": depth, "path": path, "fp": fp, "lines": t["lines"], "overlays": t["overlays"], "theme": t["theme"], "shot": shot}
            states.append(s); seen_lines.update(shape(x) for x in t["lines"])
            with open(states_f, "a") as f: f.write(json.dumps(s, ensure_ascii=False) + "\n")
            return sid

        seed = [[x.split("::")[0], x.split("::")[1], None] for x in a.seed.split(";") if x]
        noexp = re.compile(a.no_expand) if a.no_expand else None
        if not states:
            goto_state(seed); fp, t = snap(); add_state(seed, 0, fp, t)
        known_fp = {s["fp"]: s["id"] for s in states}
        for st in states:
            for k in st.get("keys", []):
                parts = k.split("|")
                if parts[0] == "img" and re.fullmatch(r"[A-Z][a-z]+(?: [A-Z][a-z]+)+", parts[3]): NAMES.add(parts[3])
        seen_lines = set(shape(x) for s in states for x in s["lines"])
        swept_ids = set(); swept_shapes = set()
        if (out / "sweeps.jsonl").exists():
            for l in open(out / "sweeps.jsonl"):
                r = json.loads(l); swept_ids.add(r["state"])
                if r["state"] < len(states) and not r["mode"].startswith("skipped"): swept_shapes.update(shape(x) for x in states[r["state"]]["lines"])
        qi = 0
        while qi < len(states):
            S = states[qi]; qi += 1
            if S["depth"] >= a.max_depth: continue
            if S["id"] in swept_ids: pass
            elif S["depth"] > 0 and set(shape(x) for x in S["lines"]) <= swept_shapes and S.get("overlays") == states[S.get("parent") or 0].get("overlays"):
                with open(out / "sweeps.jsonl", "a") as f: f.write(json.dumps({"state": S["id"], "mode": "skipped: same kinds of text as screens already swept (only record data differs)", "elements": 0}) + "\n")
                swept_ids.add(S["id"]); continue
            try: goto_state(S["path"])
            except Exception as e:
                with open(actions_f, "a") as f: f.write(json.dumps({"state": S["id"], "key": "*", "action": "replay", "error": str(e)[:300]}) + "\n")
                continue
            base_fp, base_t = snap(); base_lines = set(base_t["lines"])
            els = page.evaluate(ENUM_JS)
            # A screen that only ADDED elements on top of its parent (a menu, popover, dialog over the same page) is swept
            # for its new elements only: everything underneath was already hovered and clicked in the parent screen.
            P = states[S["parent"]] if S.get("parent") is not None and states[S["parent"]].get("keys") else None
            sweep_mode = "full"
            if P is not None and S.get("keys"):
                pk = set(P["keys"]); ck = set(S["keys"])
                if pk <= ck: els = [e for e in els if e["key"] not in pk]; sweep_mode = "overlay-new-elements-only"
            if S["id"] not in swept_ids:
                with open(out / "sweeps.jsonl", "a") as f: f.write(json.dumps({"state": S["id"], "mode": sweep_mode, "elements": len(els)}) + "\n")
            swept_ids.add(S["id"]); swept_shapes.update(shape(x) for x in S["lines"])
            drops = [e["key"] for e in els if e["drop"]]
            todo = []
            for e in els:
                todo += [(e, "hover", None), (e, "click", None)]
                if e["text_input"]: todo += [(e, "type", "Fib"), (e, "type", "zzqx-no-match")]
                if e["select"]: todo += [(e, "select", o) for o in e["options"]]
                if e["draggable"]:
                    # the display's starting screen: every draggable onto every drop zone; every other screen: each
                    # draggable dropped once and each drop zone receiving at least one drop (linear, not quadratic)
                    if S["depth"] == 0: todo += [(e, "drag", d) for d in drops if d != e["key"]]
                    else:
                        others = [d for d in drops if d != e["key"]]
                        if others: todo.append((e, "drag", others[len([t for t in todo if t[1] == "drag"]) % len(others)]))
            for e, action, arg in todo:
                k = (S["id"], e["key"], action + ("" if arg is None else ":" + str(arg)))
                if k in done: continue
                # an element identical (same label, place and role) to one already exercised on another screen is not
                # re-clicked here; changed or new elements get new keys and are always exercised
                tk = (e["key"], "drag" if action == "drag" else k[2])
                if S["depth"] > 0 and tk in tried:
                    continue
                rec = {"state": S["id"], "key": e["key"], "label": e["label"], "ctx": e["ctx"], "action": k[2]}; FORCED.clear()
                try:
                    cur, _ = snap()
                    if cur != base_fp: goto_state(S["path"])
                    page.mouse.move(2, 2)
                    act(e["key"], action, arg)
                    fp, t = snap(); new = [l for l in t["lines"] if l not in base_lines]
                    rec.update({"changed": fp != base_fp, "new_text": new[:60], "overlays": t["overlays"]})
                    if action == "hover":
                        tip = page.evaluate("(k) => { const e = [...document.querySelectorAll('[data-crawl-key]')].find(x => x.getAttribute('data-crawl-key') === k); if (!e) return ''; let n = e, t = []; for (let i = 0; n && i < 4; i++, n = n.parentElement) { for (const a of ['title','data-tip-text','data-tip','aria-label']) { const v = n.getAttribute && n.getAttribute(a); if (v && !t.includes(v)) t.push(a + '=' + v); } } return t.join(' | ') }", e["key"])
                        rec["tooltip"] = tip
                    if fp != base_fp and action != "hover":
                        novel = [l for l in t["lines"] if shape(l) not in seen_lines]
                        if fp in known_fp: rec["to_state"] = known_fp[fp]
                        elif noexp and noexp.search(e["label"] or ""): rec["to_state"] = None; rec["not_expanded_reason"] = "crawled by another worker"
                        elif (novel or t["overlays"] != base_t["overlays"] or t["theme"] != base_t["theme"]) and len(states) < a.max_states:
                            sid = add_state(S["path"] + [[e["key"], action, arg]], S["depth"] + 1, fp, t, parent=S["id"]); known_fp[fp] = sid; rec["to_state"] = sid; rec["novel_lines"] = novel[:60]
                        else: rec["to_state"] = None
                    if new and action == "hover":
                        hs = f"screenshots/s{S['id']:04d}-hover-{hashlib.sha1(e['key'].encode()).hexdigest()[:8]}.png"; page.screenshot(path=str(out / hs)); rec["shot"] = hs
                    if fp != base_fp:
                        page.keyboard.press("Escape"); page.wait_for_timeout(150)
                except Exception as ex:
                    rec["error"] = str(ex)[:300]
                if FORCED: rec["forced"] = True
                with open(actions_f, "a") as f: f.write(json.dumps(rec, ensure_ascii=False) + "\n")
                done.add(k)
                if not rec.get("error"): tried.add(tk)
        if a.variants:
            vf = out / "variants.jsonl"
            for S in states:
                try:
                    goto_state(S["path"])
                    page.evaluate("() => document.documentElement.setAttribute('data-theme', 'dark')"); page.wait_for_timeout(300)
                    fp, t = snap(); shot = f"screenshots/state-{S['id']:04d}-dark.png"; page.screenshot(path=str(out / shot))
                    rec = {"state": S["id"], "variant": "dark", "text_diff": sorted(set(t["lines"]) ^ set(S["lines"]))[:40], "shot": shot}
                except Exception as ex: rec = {"state": S["id"], "variant": "dark", "error": str(ex)[:200]}
                with open(vf, "a") as f: f.write(json.dumps(rec, ensure_ascii=False) + "\n")
            for w in (768, 1024, 1280, 1920):
                try:
                    page.set_viewport_size({"width": w, "height": 900}); goto_state(states[0]["path"]); fp, t = snap()
                    shot = f"screenshots/root-{w}.png"; page.screenshot(path=str(out / shot), full_page=True)
                    rec = {"state": 0, "variant": f"width-{w}", "text_diff": sorted(set(t["lines"]) ^ set(states[0]["lines"]))[:60], "shot": shot}
                except Exception as ex: rec = {"state": 0, "variant": f"width-{w}", "error": str(ex)[:200]}
                with open(vf, "a") as f: f.write(json.dumps(rec, ensure_ascii=False) + "\n")
            page.set_viewport_size({"width": W, "height": Hh})
        br.close()
    acts = [json.loads(l) for l in open(actions_f)] if actions_f.exists() else []
    summary = {"board": board.name, "states_expanded": len(states), "max_depth_reached": max(s["depth"] for s in states),
               "actions": len(acts), "errors": sum(1 for r in acts if r.get("error")),
               "per_action": {k: sum(1 for r in acts if r["action"].split(":")[0] == k) for k in ("hover", "click", "type", "select", "drag")},
               "distinct_text_lines_seen": len(seen_lines)}
    json.dump(summary, open(out / "summary.json", "w"), indent=1); print(json.dumps(summary))


if __name__ == "__main__":
    import urllib.parse
    main()
