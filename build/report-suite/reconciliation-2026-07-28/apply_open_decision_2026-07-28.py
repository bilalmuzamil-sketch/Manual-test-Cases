#!/usr/bin/env python3
"""Report Suite — apply the OPEN-DECISION items per the LATEST information
(user ruling 2026-07-28: update per latest info now, correct at VIU later).

Companion to apply_video_promotion_2026-07-28.py (run AFTER it, once).
Pre-edit bodies are backed up in build/report-suite/video-promotion-backup-2026-07-28/.
NO TestRail writes (Rule 6).

Items:
  P31 Catalogue rename (video 43:34-44:12, Chris: 'maybe we do rename it...
      you're absolutely right' + 'we'll have to truncate that down') ->
      PV-FILT-01 / PV-FILT-09 / PV-ROW-05 reworded so the expectation is the
      MEANING (special-order catalog parts never put into stock) with the
      exact on-screen label = VIU-confirm (both possible labels noted, Rule 9);
      PV-EXP-08 notes-only.
  Asset-dropdown style (video 15:49-16:54, Stefan: toggle + 'uniform
      throughout the app'; Chris: 'let's please do this. Happy to update the
      spec with that, too') -> latest info = match native + toggle. No case
      asserted the stay-open behavior (verified by search); WIP-FLT-03 note
      updated from 'open decision' to the native+toggle latest info, exact
      interaction = VIU-confirm.
  TU column selector -> NO-OP confirmed (no TU column-selector case exists;
      Chris's veto stands and the spec agrees).
  Pagination (video 45:05, Stefan: 'we are definitely having pagination on
      every page... we are basically forcing the user to scroll') -> verified
      NO case asserts infinite-scroll / all-rows-at-once (search); the
      pagination cases (PV-API-01/02, IV-ACC, SBC-API) already assert
      server pagination; PV-API-01/02 notes flagged VIU-confirm for the
      behavior details.
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
CASES = os.path.join(os.path.dirname(HERE), "cases")
RULING = ("latest-info user ruling 2026-07-28: update per latest info now, "
          "correct at VIU later")


def load(fname):
    path = os.path.join(CASES, fname)
    raw = open(path).read()
    l2 = raw.split("\n")[1]
    indent = len(l2) - len(l2.lstrip())
    return path, json.loads(raw), indent


def save(path, data, indent):
    with open(path, "w") as f:
        f.write(json.dumps(data, indent=indent, ensure_ascii=False) + "\n")


def case(data, cid):
    for c in data:
        if c["id"] == cid:
            return c
    raise KeyError(cid)


# guard: don't run twice
path, data, ind = load("cases-pv-A-access-permissions-filters.json")
if "special-order" in case(data, "PV-FILT-01")["expected"][1]:
    sys.exit("PV-FILT-01 already reworded — open-decision pass already applied; aborting.")

c = case(data, "PV-FILT-01")
c["expected"] = [
 "1. The Type filter is the first control in the filter row.",
 "2. It is single-select and offers exactly three choices: Both, Inventory, and a choice for special-order catalog parts that were never put into stock. (That third choice's exact on-screen label is confirmed in the build — the spec calls it \"Catalogue\" and a rename is being considered.)",
 "3. On a first visit the default is Both.",
 "4. Both is an explicit selection returning inventory and special-order rows together - a deliberate filter value, not the absence of a filter.",
]
c["spec_ref"] = ("SV-8642 (specs/parts-velocity.md S2-R1 — 'Catalogue' label rename PENDING per "
                 "kickoff video P31 43:34-44:12; " + RULING + ")")
c["notes"] = ("VIU-confirm the exact filter control label ('Type' is the spec's name for it) and the "
              "option labels as shipped. P31 LATEST INFO (" + RULING + "): Chris is leaning to rename "
              "'Catalogue' toward the special-order-parts meaning — video 43:49 'maybe we do rename it. "
              "Because you're absolutely right. Things in inventory have a catalogue item' + 44:12 'we'll "
              "have to truncate that down somehow, because that'll get a little big for a column.' "
              "Possible labels: 'Catalogue' (current spec S2-R1) OR a short special-order-parts name (not "
              "yet chosen — do NOT invent it, Rule 9). The MEANING is fixed: special-order catalog parts "
              "never put into inventory stock.")

c = case(data, "PV-FILT-09")
c["steps"] = [
 "1. With Type = Both, select any bin in the Bin filter.",
 "2. Look for special-order (catalogue) rows in the result.",
 "3. Set the Type filter to the special-order (catalogue) choice while the Bin filter is still active.",
]
c["expected"] = [
 "1. With any Bin filter active, ALL special-order (catalogue) rows are excluded (they have no bin location).",
 "2. The special-order (catalogue) choice combined with any Bin filter yields an empty result showing the empty state - this is by design, not a defect.",
]
c["spec_ref"] = ("SV-8642 (specs/parts-velocity.md S2-R8 — 'Catalogue' label rename PENDING per "
                 "kickoff video P31 43:34-44:12; " + RULING + ")")
c["notes"] = ("Expected-behavior case: the empty result here is correct per spec. P31 LATEST INFO "
              "(" + RULING + "): the Type choice's on-screen label may be renamed from 'Catalogue' to a "
              "short special-order-parts name — label VIU-confirm, meaning unchanged.")
save(path, data, ind)

path, data, ind = load("cases-pv-B-rowmodel-columns.json")
c = case(data, "PV-ROW-05")
c["expected"] = [
 "1. The header row is sticky - it stays visible while the body scrolls.",
 "2. The Type column shows each row's kind as plain text (no badge or chip styling): Inventory, or the special-order catalogue kind. (The special-order kind's exact on-screen word is confirmed in the build — the spec says \"Catalogue\", a rename is being considered, and it must stay short enough for a column.)",
 "3. ALL columns - header and cell data, including numbers and money - are left-aligned on screen. (The exports right-align numerics instead: a deliberate export-only difference, see PV-EXP-08.)",
]
c["spec_ref"] = ("SV-8643 (specs/parts-velocity.md S3-R4; S3-R5; S3-R8 — Type value 'Catalogue' rename "
                 "PENDING per kickoff video P31 43:34-44:12; " + RULING + ")")
c["notes"] = ("P31 LATEST INFO (" + RULING + "): video 43:49 'maybe we do rename it' + 44:12 'we'll have "
              "to truncate that down somehow, because that'll get a little big for a column.' Possible "
              "labels: 'Catalogue' (current spec) OR a short special-order-parts name — VIU-confirm, do "
              "not invent (Rule 9).")
save(path, data, ind)

path, data, ind = load("cases-pv-D-exports-visual-api.json")
c = case(data, "PV-EXP-08")
c["spec_ref"] = "SV-8646 (specs/parts-velocity.md S6-R10; S3-R8)"
c["notes"] = ("Expected-behavior case (deliberate screen-vs-export difference). P31 LATEST INFO "
              "(" + RULING + "): the Type column's VALUES may be renamed from 'Catalogue' (video P31) — "
              "the centered-alignment rule is unaffected; check the exported value text at VIU.")

c = case(data, "PV-API-01")
c["spec_ref"] = "SV-8642 (specs/parts-velocity.md §2 (server-paginated); S2-R10)"
c["notes"] = (c["notes"] + " P30 LATEST INFO (" + RULING + "): pagination STANDS on every page — video "
              "45:05 Stefan: 'we are definitely having pagination on every page, so with the current code "
              "base, we are basically forcing the user to scroll.' Chris wants to revisit infinite-scroll/"
              "lazy-load LATER (45:42 'let's flag that... revisit pagination, infinite, scroll, and load') "
              "— pagination-behavior details (page size, control style) = VIU-confirm.")

c = case(data, "PV-API-02")
c["spec_ref"] = "SV-8642 (specs/parts-velocity.md S2-R10)"
c["notes"] = (c["notes"] + " P30 LATEST INFO (" + RULING + "): pagination stands on every page (video "
              "45:05); details = VIU-confirm.")
save(path, data, ind)

path, data, ind = load("cases-wip-C-summary-totals-filters.json")
c = case(data, "WIP-FLT-03")
c["notes"] = ("VIDEO-AUTHORITATIVE (P24, user ruling 2026-07-28: video overrides spec (video newer, "
              "last-update-wins)): the asset identifier is the serial number. OVERRIDDEN spec wording: "
              "S7-R4/S7-R5 options and type-ahead matched the UNIT NUMBER and the VIN. P12 LATEST INFO "
              "(" + RULING + "): the Asset dropdown should MATCH THE NATIVE ShopView multi-select style, "
              "plus a possible toggle — video 15:49-16:04 Stefan: 'I would also add maybe a toggle or "
              "something... Just to have it, like, uniform throughout the app'; Chris 16:54: 'let's "
              "please do this. Happy to update the spec with that, too.' Exact interaction (close-on-pick "
              "vs toggle) = VIU-confirm — do not fail on stay-open vs close-per-pick until confirmed "
              "live. (No case asserted the stay-open behavior — verified by search.)")
save(path, data, ind)

print("Open-decision latest-info edits applied: PV-FILT-01, PV-FILT-09, PV-ROW-05, "
      "PV-EXP-08 (notes), PV-API-01 (notes), PV-API-02 (notes), WIP-FLT-03 (notes).")
print("TU column selector: NO-OP confirmed (no TU column-selector case exists).")
print("Pagination: NO case asserts infinite-scroll/all-rows-at-once (verified by search).")
