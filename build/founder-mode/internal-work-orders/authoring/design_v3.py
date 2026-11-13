"""Round 4 (13 Nov 2026): design version 1794510020-d4ec (design-2026-11-12/DESIGN-CHANGE-v1.3-2026-11-12.md). 15 boards changed (11 Close,
4 Settings); 152 are unchanged (0 changed pixels). For a changed board, the case references use its new title and its new picture: the v3
render copied into images/ with the suffix "-v13" (the old picture keeps its name, since it is attached to live cases). Design words of a
changed board are checked against its v3 file and v3 rendered text (build.py)."""
import json, os, shutil
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D); DD = f"{P}/design-2026-11-12"; V3 = f"{DD}/v3-1794510020-d4ec"
VERSION = "1794510020-d4ec"
_TD = json.load(open(f"{V3}/render/v3-text-diff.json"))["boards"]
CHANGED = {k.replace(".dc.html", ""): v for k, v in _TD.items() if v["title"] != v["oldTitle"] or v["v2"]["text"] != v["v3"]["text"]}
_FIG = {f["file"].replace(".dc.html", ""): f for f in json.load(open(f"{DD}/DESIGN-FIGURES-2026-11-12.json"))["list"]}
NEWPIC = {}
for b, v in CHANGED.items():
    old = os.path.basename(_FIG[b]["picture"])
    src = next(p for p in sorted(os.listdir(f"{V3}/render/v3")) if p.startswith(old[:old.index("-", old.index("-", 4) + 1) + 3]))
    new = src[:-4] + "-v13.png"
    if not os.path.exists(f"{DD}/images/{new}"): shutil.copyfile(f"{V3}/render/v3/{src}", f"{DD}/images/{new}")
    NEWPIC[b] = new


def apply(figs):
    """Give a changed board its v3 title and picture (in place)."""
    for f in figs:
        b = f["file"].replace(".dc.html", "")
        if b in CHANGED: f["board_title"] = CHANGED[b]["title"]; f["picture"] = "images/" + NEWPIC[b]
    return figs


def hay_text(b):
    """v3 rendered text and source of a changed board (for the design-words gate)."""
    if b not in CHANGED: return ""
    v = CHANGED[b]["v3"]
    return " ".join(v.get("text", [])) + " " + " ".join(v.get("attrs", []) if isinstance(v.get("attrs"), list) else []) + " " + \
        open(f"{V3}/files/project/{b}.dc.html", encoding="utf-8").read()
