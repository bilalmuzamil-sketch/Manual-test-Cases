#!/usr/bin/env python3
"""Supplementary pass for design_text_inventory.py: on-screen texts the tool's word filter drops.

    python3 -I supplementary_texts.py <package dir> <inventory.json> <out.json>

For the BOARD files (the .dc.html boards and wo-details/Add Part.html; library files are covered per component group),
collect every HTML text node, visible attribute value and script string literal / JSX text that contains a letter,
and keep those the main tool did NOT list (single lower-case words like "open", "match", "parts", short tokens such as
"+N", unit suffixes, one-word lower-case labels, CSS ::before/::after content). Code-looking tokens are still dropped:
identifiers with no vowel run, CSS, colours, URLs, paths, camelCase/snake_case, data-* keys, event names.
"""
import html, json, re, sys, pathlib
pkg, inv, out = pathlib.Path(sys.argv[1]), json.load(open(sys.argv[2])), sys.argv[3]
have = {r["text"].lower().replace("\u2019", "'") for r in inv["rows"]}
BOARDS = ["Work Orders.dc.html", "Work Orders -no page-fix-.dc.html", "Work Orders Details.dc.html", "wo-details/Add Part.html"]
CODE = re.compile(r"^(?:[a-z]+[A-Z]\w*|\w+_\w+|[#.][\w-]+|--[\w-]+|[\w-]+\.(?:js|css|html|png|svg|jsx)|https?:.*|\d+(?:px|ms|%|em|rem|s|vh|vw)?|[a-z-]+:[^ ]*|[\w-]*-[\w-]*)$")
JSWORDS = set("""const let var function return if else true false null undefined new this typeof instanceof for while of in do switch case
break continue default class extends super import export from await async try catch finally throw delete void yield get set static
none auto block flex grid inline hidden visible absolute relative fixed sticky static normal bold left right center top bottom middle
transparent inherit initial unset pointer default move grab grabbing text number button submit checkbox radio search menu menuitem
dialog status tooltip true false click keydown keyup input change mouseenter mouseleave scroll resize load message dragstart dragover
drop dragend pointerdown pointermove pointerup mousedown focus blur div span svg path rect circle line button input label select option
img aside header section nav main table thead tbody tr td th iframe ul li a b i p br hr template style script head body html
ease linear forwards reverse infinite rows columns list tech details sm md lg xs xl info success warning error danger neutral teal
pm role open closed nowrap ellipsis wrap row column stretch start end baseline space-between solid dashed double round square
all embed peek is-embed is-peek name value title type id key ref src href alt rel lang dir charset utf-8 viewport""".split())
rows = {}
def norm(t):
    t = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), t)
    t = html.unescape(t).replace("\\n", " ").replace("\\'", "'").replace('\\"', '"').replace("\u2019", "'")
    return re.sub(r"\s+", " ", t).strip()


SVGPATH = re.compile(r"^[MmLlHhVvCcSsQqTtAaZz][\d\s.,\-MmLlHhVvCcSsQqTtAaZz]*\d[\d\s.,\-MmLlHhVvCcSsQqTtAaZz]*$")
CSSVAL = re.compile(r"(?:calc\(|minmax\(|rotate\(|translate[XY]?\(|cubic-bezier|scale\(|\d(?:px|ms)\b|prefers-|ease-|system-ui|nth-child|text/plain|^2d$)")
CLASSES = re.compile(r"^[a-z0-9]+(?:-{1,2}[a-z0-9]+)+(?: [a-z0-9]+(?:-{1,2}[a-z0-9]+)*)*$")


def add(t, where):
    t = norm(t)
    if not t or not re.search(r"[A-Za-z]", t) or len(t) > 200: return
    if t.lower() in have or t.lower() in JSWORDS or CODE.match(t): return
    if re.search(r"[{};=<>]|=>|\bvar\(|\(\)|\$\{|\(this|\(event|\.closest|' \+|\+ '|\" \+|\\\\", t): return
    if t[0] in ".[#" or SVGPATH.match(t) or CSSVAL.search(t) or CLASSES.match(t) or re.match(r"^[a-z]+(?: [a-z]+)+$", t) and all(w in JSWORDS or "-" in w for w in t.split()):
        return
    rows.setdefault(t, where)
for b in BOARDS:
    src = (pkg / b).read_text(encoding="utf-8", errors="ignore")
    for m in re.finditer(r"<(script|style)\b[^>]*>(.*?)</\1>", src, re.S | re.I):
        base = src.count("\n", 0, m.start(2)) + 1
        body = m.group(2)
        if m.group(1).lower() == "style":
            for c in re.finditer(r"content:\s*(['\"])(.*?)\1", body):
                add(c.group(2), f"{b}:{base + body.count(chr(10), 0, c.start())} (CSS content)")
            continue
        for pat in (r"\"((?:[^\"\\\n]|\\.)*)\"", r"'((?:[^'\\\n]|\\.)*)'", r"`((?:[^`\\]|\\.)*)`"):
            for s in re.finditer(pat, body):
                v = re.sub(r"\$\{[^}]*\}", " ", s.group(1))
                for piece in re.split(r"<[^>]*>", v):
                    add(piece, f"{b}:{base + body.count(chr(10), 0, s.start())}")
    plain = re.sub(r"<(script|style)\b[^>]*>.*?</\1>", lambda m: "\n" * m.group(0).count("\n"), src, flags=re.S | re.I)
    for m in re.finditer(r">([^<>]+)<", plain):
        add(re.sub(r"\{\{[^}]*\}\}", " ", m.group(1)), f"{b}:{plain.count(chr(10), 0, m.start()) + 1}")
    for m in re.finditer(r"(?:title|placeholder|aria-label|alt|label|value|data-tip-text)\s*=\s*\"([^\"]*)\"", plain):
        add(re.sub(r"\{\{[^}]*\}\}", " ", m.group(1)), f"{b}:{plain.count(chr(10), 0, m.start()) + 1}")
json.dump([{"text": t, "where": w} for t, w in sorted(rows.items(), key=lambda x: x[1])], open(out, "w"), indent=1, ensure_ascii=False)
print(len(rows), "supplementary texts")
