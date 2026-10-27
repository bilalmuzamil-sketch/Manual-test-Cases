#!/usr/bin/env python3
"""Writes ../PARTS-LIFECYCLE-SETUP-FILE.md, the ONE setup file for Claude sessions (Rule 117 ninth amendment; it replaces the 274
per-case Google Docs, which no case links any more). A tester never needs it. It may hold examples, recipes and example names; it never
holds an environment address, a credential, a cookie or session data. python3 render_setup.py"""
import os, sys, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pllib as L, build_mods  # noqa: F401
MAP = L.id_map()
SHARED_RECIPES = """
## 1 · Accounts and places (slots)
| Slot | What it is | Notes |
|---|---|---|
| Admin at the test location | the QA build's Admin user | Admin holds Part Library & Inventory View / Create & Edit / Delete and sees financial data (PRD S8-R14: by default Admin, Service Manager and Parts Manager see the Delete-gated controls). |
| location B | a second location the same Admin can pick in the location selector (top right) | Stories 1, 11, 13 (other-location messages and history). |
| the test location | the location the session signs in at | every case. |
| a location with no inactive parts | a newly created location | S1-09 only. |

## 2 · Shared recipes (screens first; every value below is an example)
- **Part names.** Each case owns its records: part numbers `ZZAUTOTEST-PL-<case key>-A`, `-B`, ... (for example ZZAUTOTEST-PL-S2-06-A) and
  descriptions `ZZAUTOTEST PL <case key> PART A`. "Give parts A and B part numbers that start with the same text" = this shared prefix.
- **Create a part (screen).** Parts → Inventory → New Inventory Part → Description, Part Number, Category (required), Cost (required),
  leave "Track quantities and cost of goods" on (tracked) or click it off (untracked) → bin row: the location's default bin, Quantity →
  Save. A Core Charge above 0 gives the part a core ("Core for <description>").
- **Set a part inactive (screen).** Open the part → Part Status → Inactive → Save → Deactivate in "Deactivate part?" (Story 13), or bulk:
  ⋮ → Deactivate parts → tick → Deactivate → Deactivate.
- **Many parts (35 or 201).** Parts CSV import (Settings → Data Import → Inventory) with one row per part (template columns: name,
  part_number, uom, quantity, min_qty, max_qty, grid_location, purchase_price, core_price, vendor, manufacturer, category, tags; example
  file `po-answers-2026-10-09/inventory-import-no-bin-example.csv`). For 201 inactive parts: import, then bulk-deactivate 200 + 1.
- **A part with stock in two bins.** Add Bin Location in the part window → pick a second bin → Quantity.
- **An untracked part saved with no Default bin (S5-05).** Product answer 5 of 14 Oct: save an untracked part with bins and none marked
  default, then turn tracking on.
- **A deleted default bin (S5-16).** Product answer 5 of 14 Oct: delete, in Bin Locations (Settings on screen; the PRD says
  Administration, question Q6), the bin location that is the part's default while the part holds 0 there.
- **A bin below zero.** QA lead's answer of 9 Oct (situation 1): order an inventory part with bin quantity 0 on a work order line.
- **A part from before the release / a date before the release.** Any part whose Part History has entries older than the day the Part
  Lifecycle build reached the environment; the Inventory Value report saves a figure per day (tech plan D6), so any date before that day.
- **Two browser tabs.** Same address, same user; the second tab changes a part so the first tab's bulk change fails for it.
- **Screen reader.** Narrator (Windows, Ctrl + Windows key + Enter) or VoiceOver (Mac, Command + F5).
- **Theme.** Avatar at the top right → Light / Dark.
- **Global search.** On by default for every account, QA branches included (QA lead, 9 Oct, situation 3).
- **Core's own Part History page.** Not known yet (question Q1); S5-18 is held on it.

## 3 · Traps
- The design canvas boards are build screenshots on Staging Heavy Duty data: never use their record names as test data.
- The Inventory list loads 30 rows at a time (S2-R6): the header checkbox ticks only loaded rows; scroll to load more.
- Export downloads a file; "Empty export" when nothing matches (S1-R9b).
- A cycle count drops typed counts when the tab changes (S1-E1): save the count first if it should stay.
"""

def main():
    out = ["# Parts Lifecycle — setup file for Claude sessions (a tester does not need it)", "",
           f"Built by `authoring/render_setup.py` from the case library ({len(L.CASES)} cases written so far). Sources: {L.PRD_NAME}, "
           f"{L.READ}; tech plan of 7 Oct 2026; Jira epic {L.EPIC} read 27 Oct 2026; design canvas {L.DESIGN_URL} (13 Oct copy, unchanged 27 Oct).",
           "No environment address, credential, cookie or session data is written here.", SHARED_RECIPES, "## 4 · One recipe per case", ""]
    for c in L.CASES:
        r = MAP.get(c["key"])
        out.append(f"### {c['key']} · " + (f"C{r['case_id']}" if r else "new case") + (f" (split from {c['part_of']})" if c["part_of"] else "") + f" · {c['title']}")
        out.append("State the tester sets up:")
        out += [f"- {p}" for p in c["pre"]]
        names = sorted({m for p in c["pre"] for m in re.findall(r"\bpart [A-Z]\b", p)})
        if names: out.append("Example values: " + "; ".join(f"{n} = ZZAUTOTEST-PL-{c['key']}-{n[-1]}" for n in names) + ".")
        out += [f"- {x}" for x in c["claude"]]
        out.append(f"Quotes: {', '.join(x if isinstance(x, str) else x[1] for x in c['q'])}. Marker: {c['marker']}.")
        out.append("")
    open(f"{L.P}/PARTS-LIFECYCLE-SETUP-FILE.md", "w").write("\n".join(out))
    print("setup file:", len(L.CASES), "case recipes")

if __name__ == "__main__": main()
