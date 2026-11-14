"""Design pictures and board words for the Tiered Pricing cases (phase 1, 14 Nov 2026).

Design: "Tiered Pricing Design" canvas, https://claude.ai/artifact/A3NtAX9CHJCD87SXDTn9AE, version 1794631438-539a, driven 14 Nov 2026
(design-2026-11-14/). The canvas now serves 1794638838-cd70 with every design file identical (DESIGN-VERSION-CHECK-1794638838-cd70.md), so the
drive is cited as it is. Board ids are the canvas numbers ("2.24"); "today:2.1" names a production "Today" screenshot saved by the
coordinator in images/today/ (TODAY-PICTURES.json). Every picture named by a case was viewed when it was assigned (phase 1: all 120 boards of
pages 1-4 and the 11 Today pictures, viewed 14 Nov 2026 as reduced montages)."""
import os, re, json, glob, html
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D); DD = f"{P}/design-2026-11-14"
_RL = json.load(open(f"{DD}/render/render-log-all.json"))["boards"]
BOARD = {}       # "2.24" -> {"file":..., "image":..., "title":...}
for f, b in _RL.items():
    lab = (b.get("title") or "").split(" ")[0]
    if re.fullmatch(r"\d+\.\d+", lab) and lab not in BOARD:
        BOARD[lab] = {"file": f, "image": os.path.basename(b["image"]), "title": b["title"], "page": b["page"]}
TODAY = {}
for t in json.load(open(f"{DD}/images/today/TODAY-PICTURES.json")):
    for n in t["numbers"]: TODAY[n] = os.path.basename(t["file"])


def picture(pid):
    """The file name a case attaches for a board id; KeyError when unknown or the file is missing."""
    if pid.startswith("today:"):
        f = TODAY[pid[6:]]; path = f"{DD}/images/today/{f}"
    else:
        f = BOARD[pid]["image"]; path = f"{DD}/images/{f}"
    if not os.path.exists(path): raise KeyError(f"picture for {pid} missing: {path}")
    return f


def picture_path(pid):
    return f"{DD}/images/today/{picture(pid)}" if pid.startswith("today:") else f"{DD}/images/{picture(pid)}"


def _ws(s):
    s = html.unescape(s or "").replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"').replace(" ", " ")
    return re.sub(r"\s+", " ", s).strip()


_BT = {}
def board_text(bid):
    """Every visible text and attribute of a board (render log) plus its board file's text, normalised."""
    if bid not in BOARD: raise KeyError(f"unknown design board {bid}")
    if bid not in _BT:
        b = _RL[BOARD[bid]["file"]]
        parts = [r["text"] for r in b["rows"]] + [a["text"] for a in b["attrs"]]
        src = open(f"{DD}/files-v1794631438-539a/project/{BOARD[bid]['file']}", encoding="utf-8").read() \
            if os.path.exists(f"{DD}/files-v1794631438-539a/project/{BOARD[bid]['file']}") else ""
        src = re.sub(r"<[^>]+>", " ", src)
        notes = open(f"{DD}/render/canvas-notes.txt").read()
        mine = [l.split(": ", 1)[1] for l in notes.splitlines() if ": " in l and l.split(": ", 1)[1].startswith(bid + " ")]
        _BT[bid] = _ws(" | ".join(parts + mine) + " | " + src)
    return _BT[bid]
