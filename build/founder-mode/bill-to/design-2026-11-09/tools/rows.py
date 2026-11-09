"""Build every text row of the Bill To design: board files (title, headings, notes, badges, figure headings, caption sentences,
alt text, cover lists) and the 124 screenshot transcriptions (tools/screen_text.py). Board files are parsed as data."""
import os, re, json, html, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import screen_text as ST
PROJ = os.path.join(ROOT, "files", "project")
CANVAS = json.load(open(os.path.join(PROJ, "canvas.json")))
PAGE = {b: int(v["page"][1:]) for b, v in CANVAS["boards"].items()}

def sentences(t):
    t = re.sub(r"\s+", " ", t).strip(); out, cur, q = [], "", False
    for i, ch in enumerate(t):
        cur += ch
        if ch == '"': q = not q
        if ch in ".:" and ch == "." and not q and (i + 1 == len(t) or t[i + 1] == " ") and not re.search(r"(v26\.45\.2\.1|e\.g|v26\.45\.2)\.$", cur):
            out.append(cur.strip()); cur = ""
    if cur.strip(): out.append(cur.strip())
    return out

def strip(x): return html.unescape(re.sub(r"<[^>]+>", "", x)).strip()

def board_rows():
    rows = []
    for board in CANVAS["order"]:
        src = open(os.path.join(PROJ, board), encoding="utf-8").read(); lines = src.split("\n"); pg = PAGE[board]
        def ln(pos): return src.count("\n", 0, pos) + 1
        def add(text, kind, pos, fig=None):
            for s in sentences(text) if kind in ("note", "caption", "cover") else [re.sub(r"\s+", " ", text).strip()]:
                rows.append(dict(src="board", board=board, page=pg, line=ln(pos), kind=kind, fig=fig, text=s))
        m = re.search(r"<title>(.*?)</title>", src); add(strip(m.group(1)), "title", m.start())
        for m in re.finditer(r"<h([123])[^>]*>(.*?)</h\1>", src, re.S): add(strip(m.group(2)), "heading", m.start())
        m = re.search(r"</h[12]>\s*<p[^>]*>(.*?)</p>", src, re.S)
        if m and board != "Main.dc.html": add(strip(m.group(1)), "note", m.start(1))
        if board == "Main.dc.html":
            m = re.search(r"</h1>\s*<p[^>]*>(.*?)</p>", src, re.S); add(strip(m.group(1)), "cover", m.start(1))
            for m in re.finditer(r"<li>(.*?)</li>", src, re.S): add(strip(m.group(1)), "cover", m.start(1))
            for m in re.finditer(r'<span class="sv-badge[^"]*">(.*?)</span>', src): add(strip(m.group(1)), "badge", m.start())
        for n, m in enumerate(re.finditer(r"<figure\b.*?</figure>", src, re.S), 1):
            f = m.group(0); base = m.start()
            b = re.search(r'<span class="sv-badge[^"]*">(.*?)</span>', f); add(strip(b.group(1)), "badge", base + b.start(), n)
            h = re.search(r'<span class="bt-name">(.*?)</span>', f); add(strip(h.group(1)), "figure heading", base + h.start(), n)
            a = re.search(r'alt="([^"]*)"', f)
            if a: add(html.unescape(a.group(1)), "alt", base + a.start(), n)
            for c in re.finditer(r"<li>(.*?)</li>", f, re.S): add(strip(c.group(1)), "caption", base + c.start(1), n)
            for c in re.finditer(r"<p style[^>]*>(.*?)</p>", f, re.S): add(strip(c.group(1)), "caption", base + c.start(1), n)
    return rows

def screen_rows():
    rows = []
    for fn, v in ST.SCREENS.items():
        if "same_bytes_as" in v:
            rows.append(dict(src="screen", file=fn, kind="duplicate", text="(byte-identical to %s)" % v["same_bytes_as"])); continue
        for cname in v.get("chrome", []):
            base = cname.split(" (")[0]
            lst = getattr(ST, base, None)
            if base == "CUSTOMERS_LIST": lst = ST.CUSTOMERS_LIST_UI
            if isinstance(lst, list):
                for w in lst: rows.append(dict(src="screen", file=fn, kind="chrome:" + base, text=w))
            else:
                rows.append(dict(src="screen", file=fn, kind="chrome-ref", text=cname))
            if base == "CUSTOMERS_LIST":
                for w in ST.CUSTOMERS_LIST_DATA: rows.append(dict(src="screen", file=fn, kind="data", text=w))
        for w in v.get("ui", []): rows.append(dict(src="screen", file=fn, kind="ui", text=w))
        for w in v.get("data", []): rows.append(dict(src="screen", file=fn, kind="data", text=w))
    return rows

if __name__ == "__main__":
    b = board_rows(); s = screen_rows()
    print("board rows", len(b), "screen rows", len(s))
    from collections import Counter; print(Counter(r["kind"] for r in b))
