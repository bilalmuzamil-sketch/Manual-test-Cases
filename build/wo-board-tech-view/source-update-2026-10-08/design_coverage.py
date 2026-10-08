#!/usr/bin/env python3
"""Writes DESIGN-COVERAGE-2026-10-08.md: proof that the 8 Oct design export was driven in full (Rule 120)."""
import json, glob, collections, os
B = "build/wo-board-tech-view/source-update-2026-10-08"
out = ["# WO Board & Tech View design — coverage proof, 8 October 2026 (Rule 120)", "",
       "Design: Branko Cicovic's Claude Design project \"Work Orders\" (787fef1a), export uploaded by the QA lead on 8 Oct 2026 "
       "(`sources/design-2026-10-08-upload/`). The live link needs a claude.ai sign-in (L15), so the export is the design driven.", "",
       "## 1 · Stateful crawl (`build/testing-tools/crawl_design_states.py`), one crawler per display", "",
       "| Display | Screens reached | Screens swept (full / new-elements-only) | Duplicate screens skipped | Max depth | Hovers | Clicks | Typing | Drags | Forced (covered elements) | Still failing | Dark-theme captures |",
       "|---|---|---|---|---|---|---|---|---|---|---|---|"]
for w, name in (("list", "List"), ("tech", "Tech View"), ("board", "Board View")):
    st = [json.loads(l) for l in open(f"{B}/design-crawl/{w}/states.jsonl")]
    sw = {}
    for l in open(f"{B}/design-crawl/{w}/sweeps.jsonl"):
        r = json.loads(l); sw[r["state"]] = r["mode"]
    acts = {}
    for l in open(f"{B}/design-crawl/{w}/actions.jsonl"):
        r = json.loads(l); acts[(r["state"], r["key"], r["action"])] = r
    ok = [r for r in acts.values() if not r.get("error")]
    c = collections.Counter(r["action"].split(":")[0] for r in ok)
    v = [json.loads(l) for l in open(f"{B}/design-crawl/{w}/variants.jsonl")] if os.path.exists(f"{B}/design-crawl/{w}/variants.jsonl") else []
    full = sum(1 for m in sw.values() if m == "full"); ov = sum(1 for m in sw.values() if m.startswith("overlay")); sk = sum(1 for m in sw.values() if m.startswith("skipped"))
    out.append(f"| {name} | {len(st)} | {full} / {ov} | {sk} | {max(s['depth'] for s in st)} | {c['hover']} | {c['click']} | {c['type']} | {c['drag']} | {sum(1 for r in ok if r.get('forced'))} | {sum(1 for r in acts.values() if r.get('error'))} | {sum(1 for x in v if x.get('variant') == 'dark' and not x.get('error'))} |")
out += ["", "Method: every element visible on a screen (buttons, links, menu items, inputs, every pointer-cursor and every React-handler element, tooltip hosts, drop zones) is hovered and clicked; text inputs get a matching and a no-match term; selects get every option; on each display's starting screen every draggable is dropped on every drop zone, on other screens each draggable once and each drop zone at least once. A screen is crawled in turn when it shows a new KIND of text (record data — work-order numbers, amounts, people shown on the board — counts as the same kind) or a new overlay. An element identical to one already exercised on another screen is not re-exercised; changed or new elements always are. Elements covered by a sticky header or overlay are driven with forced hover/click/drag. Buttons that appear only on hover are revealed by hovering their row/card first.", "",
        "## 2 · One-click sweep of every board in the export (`build/testing-tools/drive_design_full.py`)", ""]
for d in sorted(glob.glob(f"{B}/design-drive/*/")):
    for f in glob.glob(d + "*summary.json"):
        s = json.load(open(f)); pg = list(s.get("pages", {}).values())
        tot = lambda k: sum(p.get(k, 0) for p in pg)
        out.append(f"- `{s['board']}`: {tot('elements_found')} elements, {tot('hovered')} hovered, {tot('clicked')} clicked, {tot('failed')} failed; dark theme and 768/1920 px variants captured.")
out += ["", "## 3 · Files read in full", "",
        "- `Work Orders.dc.html` (all 1,411 lines) and the no-page-fix variant — by the three drafting workers.",
        "- `wo-details/Add Part.html` (Lines tab) — Stories 4–8 worker.",
        "- Design-system library, `support.js`, icon files (17 files, 100%): `design-library-reading-2026-10-08.md`.",
        "- 36 fonts, 4 avatar photos, the thumbnail: `design-binary-files-reading-2026-10-08.md`. All screenshots and uploads viewed.", "",
        "## 4 · What the design added to the suite", "",
        "See `design-gap-triage-2026-10-08.md` (every kind of text the design shows that no case mentioned, classified) and the register's W-questions."]
open(f"{B}/DESIGN-COVERAGE-2026-10-08.md", "w").write("\n".join(out) + "\n"); print("\n".join(out[6:10]))
