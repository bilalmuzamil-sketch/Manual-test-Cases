#!/usr/bin/env python3
"""Builds proposals-answers.json for the 15 Oct 2026 update (Chris Ward's answers 12-31, PRD version 54). Run from the repo root."""
import json, sys
sys.path.insert(0, "build/wo-board-tech-view/answers-2026-10-15/apply")
from common import H
import part_design, part_design2, part_columns
parts = [("design", part_design.DESIGN_CHANGED, True), ("design2", part_design2.DESIGN2_CHANGED, True),
         ("design2q", part_design2.DESIGN2_QUOTE_ONLY, False), ("columns", part_columns.COLUMNS_CHANGED, True),
         ("columnsq", part_columns.COLUMNS_QUOTE_ONLY, False)]
try:
    import part_older
    parts += [("older", part_older.OLDER, None)]
except ImportError:
    pass
ups, new = [], []
for name, fns, changed in parts:
    for fn in fns:
        p = fn(); p["group"] = name; ups.append(p)
try:
    import part_new
    new = part_new.NEW
except ImportError:
    pass
json.dump({"updates": ups, "new": new, "retire": []}, open(f"{H}/proposals-answers.json", "w"), indent=1, ensure_ascii=False)
print(len(ups), "updates ·", len(new), "new")
