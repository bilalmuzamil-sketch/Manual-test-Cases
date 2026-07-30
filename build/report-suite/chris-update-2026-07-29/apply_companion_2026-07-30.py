#!/usr/bin/env python3
"""Companion-video delta pass, 2026-07-30 — LOCAL apply (push executed separately under
the user's same-day authorization "do update the test cases if you learn that the video is
warranting for that").

Source of truth: companion-video-transcript-2026-07-30.md (Chris Ward PRD companion video,
Loom e4a3ad01912048c0bba88f1a02677004 — authoritative product intent, newest-wins per the
user's standing ruling). Analysis: companion-video-deltas-2026-07-30.md.

Every touched case's verbatim PRE-EDIT body is backed up to
backup/companion-2026-07-30/<internal-id>.json; MANIFEST.md lists them.

Tester-facing edits (7 — push queue):
  E1 SBC-NAV-01  C4  Performance group + below the four named anchors (new info for SBC)
  E2 TU-NAV-01   C4  name the four anchor items
  E3 SBR-NAV-01  C4  "at the BOTTOM" -> below the named anchors (need not be literally last)
  E4 WIP-TAB-01  C4  below-the-anchors placement added
  E5 PV-NAV-01   C2b drop "(the only Parts report in this release)" — IV lives under Parts too
  E6 SBR-WO-06   C17 customer-card row label -> "Sales Representative" (supersedes S19-R7)
  E7 SBR-WO-02   C14 precondition tester-aid: Settings -> Staff -> edit staff -> toggle

Notes-only annotations (13 — local metadata, NOT pushed): IV-NAV-01, TU-LINK-01,
SBC-TYPE-02, SBC-TREE-11, SBC-CUST-02, SBC-EXP-05, SBR-VIS-01, PV-VIS-01, TU-VIS-01,
WIP-VIS-01, IV-VIS-01, SBR-WO-01, IV-DATE-05.
"""
import json, glob, os

RS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BK = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backup", "companion-2026-07-30")
os.makedirs(BK, exist_ok=True)

VID = ("PRD companion video 2026-07-30 (chris-update-2026-07-29/"
       "companion-video-transcript-2026-07-30.md; Loom e4a3ad0191; authoritative, newest-wins)")
ANCHORS = "Sales, Technician Efficiency, Advisor Analysis, Shop Efficiency"

FILES = {}   # path -> list
INDEX = {}   # id -> (path, case)
for p in sorted(glob.glob(os.path.join(RS, "cases", "cases-*.json"))):
    FILES[p] = json.load(open(p))
    for c in FILES[p]:
        INDEX[c["id"]] = (p, c)

manifest = []
def touch(iid, what):
    path, c = INDEX[iid]
    with open(os.path.join(BK, f"{iid}.json"), "w") as fh:
        json.dump(c, fh, indent=1, ensure_ascii=False); fh.write("\n")
    manifest.append((iid, os.path.basename(path), what))
    return c

def addnote(c, note):
    c["notes"] = ((c.get("notes") or "").rstrip() + " " + note).strip()

# ================= E1: SBC-NAV-01 — Performance group + below the anchors =================
c = touch("SBC-NAV-01", "E1/C4 Performance group + below-the-anchors (tester-facing)")
c["title"] = "Sales By Customer listed under Performance, below existing links; titles correct"
c["steps"][1] = "2. Find the Performance group and read its entries from top to bottom."
c["expected"][0] = ('1. "Sales By Customer" is listed in the Performance group of the Reports '
 "left-side navigation, BELOW the pre-existing entries (" + ANCHORS + ") — the new reports are "
 "added below those items without moving them.")
c["spec_ref"] = ("SV-8600 (specs/sbc-sales-by-customer.md Story 1 S1-R1; S1-R3; S1-R4 — "
 "Performance group + below-the-anchors placement per the PRD companion video 2026-07-30 "
 "01:18-02:05; the SBC spec names no nav group)")
c["notes"] = ("COMPANION-VIDEO 2026-07-30 (C4, 01:18-02:05): the SBC spec names no navigation "
 "group; the video places SBC in the Performance section, below " + ANCHORS + " ('add ... sales "
 "by customer ... below those items, rather than interrupting those items'). Order among the "
 "four NEW reports is not fixed. Exact rendering VIU-confirm. Spec ratification pending "
 "(SPEC-WATCH). Source: " + VID + ". MERGED 2026-07-28 (user-authorized consolidation, "
 "MERGE-PLAN G-SBC-NAV): absorbed SBC-NAV-02. Members retired locally + deleted from TestRail; "
 "bodies kept in cases/ marked Retired.")

# ================= E2: TU-NAV-01 — name the four anchors =================
c = touch("TU-NAV-01", "E2/C4 name the four anchor items (tester-facing)")
c["expected"][2] = ("3. The entry sits BELOW the pre-existing report links — " + ANCHORS + " — "
 "the new reports are added below those items without moving or disturbing them.")
c["spec_ref"] = ("SV-8648 (specs/technician-utilization.md S1-R1 — below the named anchor items "
 "[" + ANCHORS + "] per the PRD companion video 2026-07-30 01:18-02:05, refining kickoff video "
 "P3; video authoritative, newest-wins)")
addnote(c, "COMPANION-VIDEO 2026-07-30 (C4, 01:18-02:05): the anchor items are now NAMED — "
 + ANCHORS + " 'normally live in a spot that everybody's used to clicking on'; TU was 'in "
 "absolutely the wrong spot' and moves below them. Source: " + VID + ".")

# ================= E3: SBR-NAV-01 — below the anchors (not literally last) =================
c = touch("SBR-NAV-01", "E3/C4 'at the BOTTOM' re-based to below-the-named-anchors (tester-facing)")
c["title"] = "Sales By Representative under Performance, below existing links; titles correct"
c["expected"][0] = ('1. "Sales By Representative" appears in the Performance group, BELOW the '
 "pre-existing entries (" + ANCHORS + ') — the label is the full word "Representative," not a '
 '"Rep" shorthand. It need not be the very last entry: the other new reports (Technician '
 "Utilization, Work In Progress, Sales By Customer) are added in the same below-the-anchors "
 "block, in no set order.")
c["spec_ref"] = ("SV-8619 (specs/sbr-sales-by-representative.md Story 1 S1-R1; S1-R2; S1-R3; "
 "S1-R4; S1-R5; S1-R6 — 'at the bottom' re-based to below-the-named-anchors [" + ANCHORS + "] "
 "per the PRD companion video 2026-07-30 01:18-02:05; order among the four new reports not "
 "important)")
addnote(c, "COMPANION-VIDEO 2026-07-30 (C4, 01:18-02:05): all four new Performance reports go "
 "below the named anchors; SBR being literally last is no longer asserted (order among the "
 "four is PO-flexible). Full-word 'Representative' re-confirmed (09:41-10:10). Source: " + VID + ".")

# ================= E4: WIP-TAB-01 — below-the-anchors added =================
c = touch("WIP-TAB-01", "E4/C4 below-the-anchors placement added (tester-facing)")
c["expected"][0] = ('1. The reports navigation lists a report labeled "Work In Progress" under '
 "the Performance group, BELOW the pre-existing entries (" + ANCHORS + ").")
base = c.get("spec_ref") or "specs/wip-work-in-progress.md Story 1"
if "SV-" not in base:
    base = "SV-8657 (" + base + ")"
c["spec_ref"] = ("SV-8657 (specs/wip-work-in-progress.md Story 1 S1-R1 — Performance group; "
 "below the named anchor items [" + ANCHORS + "] per the PRD companion video 2026-07-30 "
 "01:18-02:05)")
addnote(c, "COMPANION-VIDEO 2026-07-30 (C4, 01:18-02:05): WIP is one of the four new "
 "Performance reports added below " + ANCHORS + "; order among the four not fixed. Source: "
 + VID + ".")

# ================= E5: PV-NAV-01 — not the only Parts report =================
c = touch("PV-NAV-01", "E5/C2b drop the 'only Parts report' claim; IV under Parts too (tester-facing)")
c["expected"][1] = ("2. Under Parts there is an entry labeled Parts Velocity; Inventory Value "
 "also lives under Parts. The order of the two inside the Parts section is not fixed — do not "
 "fail the test on which of them comes first.")
c["spec_ref"] = ("SV-8641 (specs/parts-velocity.md S1-R1 — the spec's 'only report' sentence is "
 "superseded: Parts Velocity and Inventory Value BOTH live under Parts per the PRD companion "
 "video 2026-07-30 00:35-01:18; PV S1-R1 vs IV S1-R1 inconsistency flagged to SPEC-WATCH)")
c["notes"] = ("COMPANION-VIDEO 2026-07-30 (C2b/C3, 00:35-01:18): 'Parts Velocity and Inventory "
 "Value will live under here [the new Parts section]' — supersedes PV spec S1-R1's 'its first "
 "(and, in this release, only) report' (intra-suite inconsistency with IV S1-R1; flagged, Rule "
 "15). Ordering inside the section is PO-flexible ('no alphabetical sort ... order that seems "
 "the most fitting'). The Parts grouping is still NEW (S1-R1 stands on that). VIU-confirm exact "
 "placement/styling. Source: " + VID + ".")

# ================= E6: SBR-WO-06 — customer-card label "Sales Representative" =================
c = touch("SBR-WO-06", "E6/C17 customer-card row label -> 'Sales Representative' (tester-facing)")
c["title"] = 'Customer record shows a "Sales Representative" row; "Unassigned" when none'
c["expected"][0] = ("1. The customer record's left-panel sidebar shows a single row labeled "
 '"Sales Representative" (the full word — the product owner explicitly corrected the '
 'short-form "Sales Rep" label here) with the customer\'s assigned rep.')
c["spec_ref"] = ("SV-8636 (specs/sbr-sales-by-representative.md Story 19 S19-R7; S19-E1 — "
 "customer-card row label RE-RULED to the full 'Sales Representative' per the PRD companion "
 "video 2026-07-30 10:53-11:12, superseding the spec's 'Sales Rep'; video authoritative, "
 "newest-wins)")
addnote(c, "COMPANION-VIDEO 2026-07-30 (C17, 10:53-11:12) FIRM: 'In the customer card, this "
 "actually should say sales representative ... I will flag this immediately, label this as "
 "sales representative.' Deviation basis (Rule 25): spec S19-R7 verbatim = 'a single "
 "\"Sales Rep\" row' — superseded newest-wins; spec ratification pending (SPEC-WATCH). "
 "Source: " + VID + ".")

# ================= E7: SBR-WO-02 — toggle path tester-aid =================
c = touch("SBR-WO-02", "E7/C14 Settings->Staff->edit-staff toggle path precondition (tester-facing)")
c["title"] = "Sales Rep selector offers only reps whose sales-rep toggle is on"
c["preconditions"][0] = ("1. At least one staff member has the sales-rep toggle ON and at least "
 "one has it OFF. To arrange this: open Settings, go to Staff, edit the staff member, and use "
 "the sales-rep toggle there (restore both afterward).")
c["spec_ref"] = ("SV-8636 (specs/sbr-sales-by-representative.md Story 19 S19-R2; S19-R8 — "
 "toggle entry path Settings -> Staff -> edit the staff member per the PRD companion video "
 "2026-07-30 09:17-09:41; exact toggle label VIU-confirm)")
addnote(c, "COMPANION-VIDEO 2026-07-30 (C14, 09:17-09:41): entry point confirmed — 'We're going "
 "to go into settings. We're going to go staff, we're going to edit the staff member, and we "
 "have a new toggle here.' Exact on-screen toggle label not in the transcript — VIU-confirm. "
 "PENDING (C15/Q5): the selector's 'Sales Rep' label/accessible name may flip to the full word "
 "'Representative' per the no-short-forms ruling — question Q5 to Chris; do not edit until "
 "answered. Title shortened to fit (was >80 chars).")

# ================= Notes-only annotations (13) =================
NOTES = {
 "IV-NAV-01": ("COMPANION-VIDEO 2026-07-30 (C2a/C3, 00:35-01:18): IV under the new Parts "
   "section confirmed ('Parts Velocity and Inventory Value will live under here'); order "
   "inside the section PO-flexible — do not fail on PV-vs-IV order."),
 "TU-LINK-01": ("COMPANION-VIDEO 2026-07-30 (C6, 02:28) VISUAL-VIU-CONFIRM: 'hyperlinks "
   "Different hyperlinks. Bolded, not. Very important.' — two visually distinct link styles "
   "(bolded vs not) exist and the distinction matters; the transcript does not say which links "
   "are bold (visual-only). At VIU capture which links render bold vs not; spec is silent on "
   "the bold split — record, don't fail."),
 "SBC-TYPE-02": ("COMPANION-VIDEO 2026-07-30 (C9, 05:10-05:42): P = parts order, S = service/"
   "work order confirmed; under Parts Sales real data shows P numbers ('These would all be "
   "P's') — the all-S parts-sales rows in the PO's local were a fake-data artifact."),
 "SBC-TREE-11": ("COMPANION-VIDEO 2026-07-30 (C9, 05:10-05:42): the video's 'you shouldn't see "
   "S [under parts sales]' refers to normal data ('usually'); this case's deliberate no-vehicle "
   "S edge (S8-E3) is NOT contradicted — the bucket is still decided by vehicle absence."),
 "SBC-CUST-02": ("COMPANION-VIDEO 2026-07-30 (C11, 06:41-07:09): the multi-select's product "
   "intent is COMPARISON — 'I want to compare accurate aerodynamics versus Baxter Mining Corp. "
   "inside that same time zone'; selecting customers puts exactly those on the page."),
 "SBC-EXP-05": ("COMPANION-VIDEO 2026-07-30 (C11, 07:09-08:06): confirmed — 'when I export, "
   "only those, the information on the page is going to show up on the exports. Important you "
   "see what that toggle does.' Exports carry exactly the page contents under the Customer "
   "selection."),
 "SBR-VIS-01": None, "PV-VIS-01": None, "TU-VIS-01": None, "WIP-VIS-01": None, "IV-VIS-01": None,
 "SBR-WO-01": ("COMPANION-VIDEO 2026-07-30 (C15/C16, 09:41-10:53): WO-card dropdown confirmed "
   "(default Unassigned, assignable). PENDING Q5: the 'Sales Rep' label may flip to the full "
   "word 'Representative' per the no-short-forms ruling — do not edit until Chris answers."),
 "IV-DATE-05": ("COMPANION-VIDEO 2026-07-30 (C20, 12:01-13:10) soft-worded CONFIRMATION: 'if "
   "snapshot data is taken, we don't need to see this ... only ... important if you've been "
   "offline ... Or, no snapshot' — matches S5-R5/S5-R6 (indicator hidden when the shown day "
   "matches, shown on fallback). Spec silent on an offline/stale-data state — VIU-watch only, "
   "not authored (Rule 15 spec-silent stated)."),
}
VISNOTE = ("COMPANION-VIDEO 2026-07-30 (C12, 08:06-08:51) VISUAL-VIU-CONFIRM: 'All reports are "
 "modeled after technician efficiency ... the most recently updated visual representation ... "
 "that won't hold forever ... ideally all six reports will look as close together as possible.' "
 "Use Technician Efficiency as the side-by-side styling reference at VIU (grain of salt — the "
 "reference may move); ignore the PO's local coloring drift (fake/local artifact).")
for iid, note in NOTES.items():
    c = touch(iid, "notes-only companion-video annotation (NOT pushed)")
    addnote(c, note if note else VISNOTE)

# ================= write back + MANIFEST =================
for p, lst in FILES.items():
    with open(p, "w") as fh:
        json.dump(lst, fh, indent=1, ensure_ascii=False); fh.write("\n")

with open(os.path.join(BK, "MANIFEST.md"), "w") as fh:
    fh.write("# Companion-video apply 2026-07-30 — pre-edit backups\n\n")
    fh.write("Source: " + VID + "\n")
    fh.write("Analysis: chris-update-2026-07-29/companion-video-deltas-2026-07-30.md\n")
    fh.write("Recovery: copy the backed-up body over the case in its cases/*.json file, then "
             "regenerate deliverables (gen_import.py + id-map re-merge); if the edit was pushed, "
             "also update_case the restored body (user authorization required).\n\n")
    fh.write("| Internal ID | File | What was edited |\n|---|---|---|\n")
    for iid, fn, what in manifest:
        fh.write(f"| {iid} | {fn} | {what} |\n")

print("touched:", len(manifest))
for iid, fn, what in manifest:
    print(f"  {iid}: {what}")

# title-length guard (Rule: titles <= 80)
for iid in ("SBC-NAV-01","TU-NAV-01","SBR-NAV-01","WIP-TAB-01","PV-NAV-01","SBR-WO-06","SBR-WO-02"):
    t = INDEX[iid][1]["title"]
    assert len(t) <= 80, (iid, len(t), t)
    print(f"title-ok {iid}: {len(t)} chars")
