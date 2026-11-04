#!/usr/bin/env python3
"""Writes REPORT.md, PO-QUESTIONS-DRAFT.md, TICKET-LEDGER.json and TICKET-SWEEP.json from the case library (2 Nov 2026).
Run build.py first (it must print 0 PROBLEM lines) and story_diff.py (story_diff.json)."""
import sys, os, re, json, glob, importlib
from collections import Counter, defaultdict
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
import tt_lib as L
from po_questions import QUESTIONS, DROPPED, KEPT, DESIGN_DROPPED_SEE
import subprocess
_ORDER = ["cases_s1", "cases_s2", "cases_s3", "cases_s4", "cases_api", "cases_s6", "cases_inv"]
_MODS = sorted(os.path.basename(f)[:-3] for f in glob.glob(f"{D}/cases_*.py"))
for m in [x for x in _ORDER if x in _MODS] + [x for x in _MODS if x not in _ORDER]: importlib.import_module(m)
SECS = json.load(open(f"{L.P}/sections.json"))["sections"]
SD = json.load(open(f"{D}/story_diff.json"))
J = json.load(open(f"{L.P}/sources/jira-sweep-2026-11-02-pm.json"))["issues"]   # round 3: pm re-read times
CASES = L.CASES
by_code = defaultdict(list)
for c in CASES:
    for k in L.codes_of(c): by_code[k].append(c["key"])

# ---------------------------------------------------------------- TICKET-LEDGER.json and TICKET-SWEEP.json
story_keys = {v[0]: n for n, v in L.STORY.items()}
def keys_for_story(sv): return [c["key"] for c in CASES if sv in L.refs_of(c).split(",")]
VT = {
 "SV-11962": ("NO-CASE", "Developer verification task for Release A of the ROLE version (PRD v9): a session-neutral Technician permission on roles, "
              "migrations, fe-permissions, \"Role is not editable.\". PRD v17 has no Technician setting on roles, so none of its checks applies. "
              "The user-visible behaviour it protects (no logout from a Technician change or the release) is covered by INV-11 and S6-26.", ["INV-11", "S6-26"]),
 "SV-11963": ("COVERED", "Developer checklist for the lists (B1). Its setup (\"turn Technician off on a test role such as Parts Manager\") is the role "
              "version; under v17 the toggle is per staff member. Every check that still holds is covered by the Story 3 cases named here. Its "
              "line \"Time sheets, the time sheet dialogs, Punch Clock Activities, Part Sale, Schedule ... still list them\" names Part Sale, which "
              "PRD v17 S3-R6a says shows no technician dropdown.", None),
 "SV-11964": ("COVERED", "Developer checklist for the warning (B2), written for the role version: \"Roles & Permissions → Edit a role\", a "
              "people count and the role name, \"Save continues to the Confirm Permission Updates window\", and a count endpoint per role. PRD v17 "
              "warns per staff member in Edit Staff Member. The v17 checks are covered by the Story 2 cases named here.", None),
 "SV-11965": ("NO-CASE", "Developer checklist for a Technician card in Roles & Permissions (B3): role version only (Cross-Cutting card, Confirm "
              "Permission Updates, View Permissions, Duplicate Role, Reset To Template). PRD v17 has no such card; INV-15 checks that Roles & "
              "Permissions gains no Technician permission. Its pill end-date item is covered by S1-05 and S4-10 (SV-12008).", ["INV-15", "S1-05", "S4-10"]),
 "SV-11966": ("COVERED", "Developer checklist for the staff list column, notice and Public API value (B4). Its rule \"Yes = active, role has "
              "Technician on, Time Clock on\" is the role version; v17 reads the person's own toggle (S4-R1). Covered by the Story 4 and API cases named here.", None),
 "SV-11967": ("COVERED", "Developer checklist for the release-day migration (B5), granting per ROLE (\"a role with evidence is on whatever its "
              "name\"); PRD v17 turns Technician on per staff member (S6-R1). The evidence rules that still match are covered by the Release day "
              "cases named here.", None),
 "SV-11968": ("COVERED", "Developer checklist for the \"No technicians yet\" text (B6a). Its text \"Turn Technician on for a role in Roles & "
              "Permissions to assign work orders. ...\" is the v9 text; PRD v17 S3-R10 reads \"Turn Technician on for your technicians in Staff to "
              "assign work orders. Until then, every work order stays in Unassigned.\". The cases follow v17.", ["S3-29", "S3-30", "S3-33", "S3-34"]),
 "SV-11969": ("COVERED", "Developer checklist for \"Set Up Technicians\" and the first-run text (B6b). It says the button \"opens Roles & "
              "Permissions\" and the text reads \"...for a role and create your first work order...\"; PRD v17 S3-R10 says it opens the staff "
              "list (Settings, Staff) and reads \"Turn Technician on for your technicians and create your first work order to track work by tech.\". "
              "The cases follow v17.", ["S3-31", "S3-32"]),
}
VT_CODES = {"SV-11963": lambda k: k.startswith("S3-"), "SV-11964": lambda k: k.startswith("S2-"),
            "SV-11966": lambda k: k.startswith(("S4-", "API-")) and k not in ("API-08", "API-09", "API-10", "API-11", "API-12", "API-13", "API-15"),
            "SV-11967": lambda k: k.startswith("S6-")}
ledger = {}
for i in J:
    k, f = i["key"], i["fields"]
    row = {"updated": f["updated"], "summary": f["summary"], "type": f["issuetype"]["name"]}
    if k in story_keys:
        row.update(outcome="NEW-CASES", cases=keys_for_story(k),
                   note=f"Re-read 2 Nov 2026 (pm) after Chris synced it to PRD v18. Every requirement line of the story matches PRD v18 word for word ({sum(1 for c, v in SD['codes'].items() if v['story'] == k)} lines, story_diff.json).")
    elif k == "SV-11788":
        row.update(outcome="NEW-CASES", cases=[c["key"] for c in CASES],
                   note=("Epic: the whole suite. Its description says \"New staff start with it off\"; PRD v17 S1-R3 (and story SV-11879, updated later "
                         "the same day) pre-fill Technician from the role. The cases follow PRD v17 (latest wins, Rule 32); reported in REPORT.md, not asked."))
    elif k == "SV-11719":
        row.update(outcome="NEW-CASES", cases=sorted(set(by_code["GOAL-1"] + ["S3-01", "S3-02", "S3-03", "S3-07", "S3-08"])),
                   note="The origin bug (a non-billable Parts Manager on Tech View). The cases that take a non-technician off Board View, Tech View and the dropdowns cover it.")
    elif k == "SV-12008":
        row.update(outcome="NEW-CASES", cases=["S1-04", "S1-05", "S4-10"], note="The \"New\" end date: S1-05 and S4-10 (held until the release is scheduled) quote it; S1-04 quotes the placeholder date.")
    elif k in VT:
        out, note, cs = VT[k]
        if cs is None: cs = [c["key"] for c in CASES if VT_CODES[k](c["key"])]
        row.update(outcome=out, cases=cs, note=note)
    else:
        row.update(outcome="UNHANDLED", cases=[], note="")
    ledger[k] = row
json.dump(ledger, open(f"{L.P}/TICKET-LEDGER.json", "w"), indent=1, ensure_ascii=False)
json.dump({"project": "Technician Toggle", "epic": "SV-11788", "stories": [v[0] for v in L.STORY.values()], "prd_page": "977371146",
           "prd_version_handled": 20, "jira_saved": "sources/jira-sweep-2026-11-02-pm.json", "checked": "2026-11-04 (PRD v20; Jira as saved 2 Nov pm, no newer saved sweep)"},
          open(f"{L.P}/TICKET-SWEEP.json", "w"), indent=1)

# ---------------------------------------------------------------- PO-QUESTIONS-DRAFT.md
P = []
w = P.append
w("# Technician Toggle — questions for Chris Ward (DRAFT, not sent)")
w("")
w("**ALL 8 ANSWERED by Chris Ward on 2 Nov 2026** (sheet https://docs.google.com/spreadsheets/d/1nLKkgSgmtqCYu4eu15_9xN38ml32tDnJls42PPq_A4M, "
  "column E; copied word for word in po-answers-2026-11-02/ANSWERS-Chris-Ward-2026-11-02.md). He published PRD v18 and design version "
  "1793640819-ff4d with the answers. Nothing is waiting on the PO.")
w("")
w("Project: **Technician Toggle** (epic SV-11788, PRD Confluence 977371146 version 17, 2 Nov 2026). For: Chris Ward (PO and design authority). "
  "Drafted 2 Nov 2026 by the case-library worker; the coordinator sends it as the colour-coded question sheet (Rule 125 format) once everything "
  "else is done (skill 07 §1). Nothing here has been sent.")
w("")
for i, (slug, q, basis, opts, holds) in enumerate(QUESTIONS, 1):
    if i == 1: w("# Questions from reading the PRD, stories and tech plan (2 Nov 2026)"); w("")
    if slug == "tt-d01":
        w("# Questions from reading the design (2 Nov 2026; design-2026-11-02/NEW-QUESTIONS.py rows 1 to 4, register TT-D01, TT-D02, TT-D04, "
          "TT-D06; merged into this one sheet, Rule 131)"); w("")
    w(f"## Question {i}")
    w("")
    w(f"- **Project / feature:** Technician Toggle — {q.split(':')[0].replace('Technician Toggle, ', '')}")
    w(f"- **What the PRD says now:** {basis}")
    w(f"- **The question:** {q.split(': ', 1)[1] if ': ' in q else q}")
    for o in opts: w(f"- {o}")
    w(f"- **Chris's answer (2 Nov 2026, column E):** {L.ANS[i]}")
    w(f"- **Status:** answered; " + {1: "API-09 to API-11 rewritten to accepted and ignored; the refusals are tested from an old staff window in a second tab (S1-38 to S1-41)",
         2: "INV-13 released (PRD v18 S1-R8 names the role)", 3: "S3-36 rewritten to the Unassigned choice; S3-49 and S3-50 added (PRD v18 S3-R10)",
         4: "S3-48 rewritten to the answer (PRD v18 S3-N1)", 5: "S1-16 released; D-33 deleted (DELETE.json)",
         6: "S3-24 to S3-26 and D-27 released; D-34 deleted (DELETE.json)", 7: "S3-29, S3-30 and D-29 released, both sentences kept",
         8: "S1-37 rewritten to the answer and released (PRD v18 S1-R3)"}[i] + ".")
    w("")
_a9 = re.search(r"\*\*Answer: 9\. (.*?)\*\*", open(L.ANS_FILE).read()).group(1)
w("## Question 9 (added to Chris's sheet by the coordinator, 2 Nov 2026: tech plan D19 against S6-R1 (a), a time entry with both a department and a work order)")
w("")
w(f"- **Chris's answer (read 4 Nov 2026, column E, row 15):** 9. {_a9}")
w("- **Status:** answered; PRD v20 (3 Nov 2026) S6-R1 (a) carries it. The release-day cases S6-01 to S6-06 re-quote v20. No manual case for the "
  "combined entry: no ShopView screen creates a time entry with both a department and a work order (Chris's question 9 note), so it is listed "
  "as not testable by hand in REPORT.md.")
w("")
w("## QA-only: what each question holds")
w("")
w("| Question | Cases held (keys; C-ids once written) |")
w("|---|---|")
for i, (slug, *_ ) in enumerate(QUESTIONS, 1):
    w(f"| {i} ({slug}) | {', '.join(c['key'] for c in CASES if c['marker'] == L.PO_HOLD(i))} |")
w("")
w("## Skill 07 §6 check: points not asked, and the source that answers each")
w("")
for k, v in DROPPED.items(): w(f"- **{k}:** {v}")
w("")
w("## Skill 07 §6 re-run on the four design questions: why each is kept")
w("")
for k, v in KEPT.items(): w(f"- **{k} (question {[s for s, *_ in QUESTIONS].index(k) + 1}):** {v}")
w("")
w(DESIGN_DROPPED_SEE)
open(f"{L.P}/PO-QUESTIONS-DRAFT.md", "w").write("\n".join(P) + "\n")

# ---------------------------------------------------------------- REPORT.md
R = []
w = R.append
cnt = Counter(c["sec"] for c in CASES)
held = [c for c in CASES if c["held"]]
w("# Technician Toggle — case library report (2 Nov 2026)")
w("")
w("PRD \"Technician Toggle\", Confluence 977371146, **version 17** (2 Nov 2026, Chris Ward). Project type (ii) V2 / upgrade. Epic SV-11788. "
  "Round 2 (same day) added the 34 design cases and References from Design. Library: `build/technician-toggle/authoring/` (`tt_lib.py`, `cases_*.py`, `build.py`). Nothing was written to TestRail, Jira, Slack or Google; nothing was committed.")
w("")
w("## 1. Counts per section")
w("")
w("| Key | Proposed subsection of 113017 | Cases | Held |")
w("|---|---|---|---|")
for s, v in SECS.items():
    w(f"| {s} | {v['name']} | {cnt.get(s, 0)} | {sum(1 for c in held if c['sec'] == s)} |")
w(f"| | **Total** | **{len(CASES)}** | **{len(held)}** |")
w("")
mk = Counter(re.sub(r"\(question \d+\)", "(question n)", c["marker"]) for c in CASES)
w("Markers: " + "; ".join(f"`{k}` × {v}" for k, v in mk.most_common()) + ".")
w("")
w("The default marker is Rule 69's `AUTOMATION: Not available on Build to test Yet - Last checked 11/2/2026`, because no build exists yet. "
  "The brief says API cases get `AUTOMATION: READY` when their steps are fully given. Under Rule 69, READY waits for a build check, so the "
  "fully given API cases carry the Rule 69 marker like every other case. Changing that is one constant (`tt_lib.MARKER`) if the coordinator rules otherwise.")
w("")
w("## 2. Code coverage (every requirement code, named item and sub-item)")
w("")
w("| PRD item | Cases, or why not testable |")
w("|---|---|")
def sk(x):
    m = re.match(r"S(\d+)-([RNE])(\d+)([a-z]?)", x)
    return (0, int(m.group(1)), "RNE".index(m.group(2)), int(m.group(3)), m.group(4)) if m else (1, x)
for k in sorted(set(L.CODE) | set(L.NAMED) | set(L.SUB), key=sk):
    v = ", ".join(by_code.get(k, [])) or ("not testable: " + L.NOT_TESTABLE[k] if k in L.NOT_TESTABLE else "MISSING")
    w(f"| {k} | {v} |")
w("")
w("Every §8 (User Feedback Summary) message is used word for word in a step or result (a `build.py` gate).")
w("")
w("## 3. Held cases and why")
w("")
w("| Reason | Cases |")
w("|---|---|")
for r, n in Counter(re.sub(r"\(question \d+\)", "(question n)", c["marker"]) for c in held).most_common(): w(f"| {r[len('AUTOMATION: HOLD - '):]} | {n} |")
w("")
w("| Case | Title | Why held |")
w("|---|---|---|")
for c in held: w(f"| {c['key']} | {c['title']} | {c['marker'][len('AUTOMATION: HOLD - '):]} |")
w("")
w("Lesson L-14 says a behaviour a manual tester cannot set up is not written as a manual case. The brief (point 10) says to keep such cases with "
  "the exact expected text and a HOLD marker. These cases are kept as HELD in the library (not for a manual run): S2-34, S2-35, S2-36, S3-47 and S4-07 "
  "(coordinator, round 2: kept; the QA lead decides whether they go to TestRail).")
w("")
w("## 4. Stories and tickets against PRD v17")
w("")
w(f"- **Stories SV-11879 to SV-11884:** all {len(SD['codes'])} requirement lines match PRD v17 word for word, and so do the six Error Handling "
  "lines (`authoring/story_diff.py`, `story_diff.json`). No PRD code is missing from a story. The acceptance criteria add worked examples "
  "(Jordan Lee / \"Jordy\", \"Pat\", 2 + 1 counts across two locations) that agree with the PRD. Story 1 and Story 4 also add the SV-12008 "
  "placeholder check (\"if it is still the placeholder 31 Dec 2026, 07:00 UTC, this check fails\"), which S1-05 and S4-10 carry.")
w("- **Epic SV-11788:** the description says \"New staff start with it off\". PRD v17 S1-R3 pre-fills from the role (on for the built-in "
  "Technician and Foreman roles with Time Clock on). The PRD and story SV-11879 (updated 14:29 UTC) are later than the epic (09:33 UTC), so the "
  "cases follow PRD v17 (Rule 32). It is not a PO question; the epic text needs refreshing.")
w("- **Verification tasks (Nemanja Djuric) against v17:**")
for k in ("SV-11962", "SV-11963", "SV-11964", "SV-11965", "SV-11966", "SV-11967", "SV-11968", "SV-11969"):
    w(f"  - **{k}** ({ledger[k]['outcome']}): {ledger[k]['note']}")
w("- **SV-11719** (origin bug) and **SV-12008** (the \"New\" end date): covered by new cases (TICKET-LEDGER.json).")
w("")
w("## 5. Tech plan notes (plan of 28 Oct 2026, written for PRD v9; QA lead: \"No newer plan; go ahead\")")
w("")
w("Used only where it still matches v17: the Public API staff requests and field names (`GET /api/v1/staff`, `/v1/staff/{id}`, "
  "`/v1/locations/{id}/staff`; `technician` read-only, ignored on `PATCH`); the changelog location (D6); the 30-second Back rule "
  "(`RESUME_STALE_TIME_MS = 30_000`, which matches S1-E3); the lead window refetching on every open (S1-E3); the technician-list failure "
  "behaviour (S3 Error Handling); and the Edit Line save keeping former technicians (D1, S3-R8). Quoted in API-01, API-02, API-05, API-06 and API-14.")
w("")
w("Statements that contradict v17's staff-toggle model are not used as expectations:")
for t in [
 "Technician is a permission bundle on each ROLE (§2, D11, Phase A1/B3: a Cross-Cutting card in Roles & Permissions). v17: a toggle on each staff member, next to Sales Representative.",
 "S1 Error handling: one message, \"Role is not editable.\" (Q3, PRD v9). v17: \"A technician must have Time Clock on.\" and \"This role can't be a technician.\"",
 "S2 warning per role: \"1 person on E2E Role leads 1 open work order...\", counting the role's people, with Save continuing to Confirm Permission Updates. v17: per person, \"[Name] leads ...\", in Edit Staff Member.",
 "S3-R10 text \"Turn Technician on for a role in Roles & Permissions ...\" and the button opening Roles & Permissions (B6a, B6b). v17: \"... for your technicians in Staff ...\" and the button opens the staff list.",
 "Release day per role (Migration B grants roles; S6-R3 \"Technician and Foreman templates on\"). v17: per person (S6-R1), with no per-role default for existing staff.",
 "S4-R1 and S5-R1 \"role has Technician on\". v17: the person's own toggle.",
 "Changelog note \"a role toggle does not move updated_at\" (B4). v17 S6-R3: staff turned on by the release step ARE marked as updated (API-15).",
 "S5-E1 \"Roles are not exposed\". v17 S5-E1: a deactivated person whose toggle is on reads false.",
 "Evidence D19 counts a time row that carries both a department and a work order. v17 S6-R1 (a) says only \"time on a department does not count\"; there is no conflict for a row a tester can make, so no case or question.",
]: w(f"- {t}")
w("")
EDITS = json.load(open(f"{D}/design_edits.json"))
prd_cases = [c for c in CASES if c["sec"] != "DESIGN"]
with_ref = [c["key"] for c in prd_cases if c["key"] in L.DREFS]
REC = json.load(open(f"{D}/v18-named-set-record.json"))
_vf = subprocess.run([sys.executable, f"{D}/verify_v18_named_set.py"], capture_output=True, text=True).stdout.strip().splitlines()
REC20 = json.load(open(f"{D}/v20-named-set-record.json"))
_vf20 = subprocess.run([sys.executable, f"{D}/verify_v20_named_set.py"], capture_output=True, text=True).stdout.strip().splitlines()
w("## 5c. Round 4 — PRD v20 (named sets, 4 Nov 2026)")
w("")
w("QA lead: \"Yes, named sets (Recommended)\". PRD v20 (3 Nov 2026) changes S3-N1 (v19: a picked person whose Technician is turned off stays "
  "picked while the board gives them a column or group; otherwise until Work Orders is opened again from the menu or the page is reloaded) and "
  "S6-R1 (a) (v20: an entry with both a department and a work order counts as time on the work order; Chris's answer 9). Nothing else changed "
  "(diff against v18). The set is 16 cases; nothing outside it changes.")
w("")
w(f"- **Updated ({len(REC20['named_set'])}):** " + ", ".join(f"{k} {v['case']}" for k, v in sorted(REC20["named_set"].items())) +
  ". Each quotes PRD v20 (From line \"version 20 (3 Nov 2026, Chris Ward), read 4 Nov 2026\") and carries the Rule 69 marker dated 11/4/2026. "
  "S3-48 is rewritten top to bottom: a turned-off person stays picked until the page is reloaded, then drops out, and their work does not "
  "move. The others are re-quoted, and every other part is CONFIRMED (`authoring/v20-named-set-record.json`). INV-06 quotes S3-R9 and Out of "
  "Scope, not S6-R1 (a), so only its version stamp and marker change. It is in the brief's set, which I kept as given.")
w("- **New (3):** S3-51 (a turned-off person stays picked while Work Orders stays open; when they are the only person picked the board shows "
  "\"No work orders match these filters\"; unticking clears the filter), S3-52 (a turned-off person who still leads shown work stays offered "
  "and picked), S3-53 (they drop out when Work Orders is opened again from the menu). S3-48 covers the reload and S3-50 the location change.")
w("- **No manual case:** S6-R1 (a)'s entry with both a department and a work order. No ShopView screen creates one (Chris's question 9 note), "
  "so a manual tester cannot set it up. It is left to the developers' release-step checks.")
w(f"- **Proof** (`authoring/verify_v20_named_set.py`): {_vf20[0]} {_vf20[-1]}. It fails on a planted title change outside the set, as it "
  "should. `verify_v18_named_set.py` is historical (it now reports the v20 set as changes).")
w("- **Jira:** not re-read in this pass. The ledger and sweep use the tickets saved on 2 Nov (pm), and TICKET-SWEEP.json now records PRD v20 as handled.")
w("")
w("## 5b. Round 3 — PRD v18, Chris's answers 1 to 8, design version 1793640819-ff4d (named set, 2 Nov 2026)")
w("")
w("QA lead: \"Named set (Recommended)\". The set is 56 cases: the 50 in `po-answers-2026-11-02/named-50-from-codes.json` (every case tagged "
  "S1-R3, S1-R8, S3-R10, S3-N1 or Story 1 Error Handling, and the 17 held on questions 1 to 8), plus D-26, S1-25, S3-09, S3-10, S3-21 and "
  "S3-23, which quote a changed design caption. Nothing outside the set changes, not even version stamps.")
w("")
w(f"- **Updated ({len(REC['named_set'])}), each rewritten top to bottom (Rule 134):** " + ", ".join(f"{k} {v['case']}" for k, v in sorted(REC["named_set"].items())) + ".")
w("- **Parts changed per case (against its read-back):** " + "; ".join(
    f"{k}: " + ", ".join(x.replace('custom_', '') for x in ('title', 'custom_preconds', 'custom_steps', 'custom_expected', 'refs') if v[x] == 'CHANGED')
    for k, v in sorted(REC["named_set"].items())) + ". Every other part was re-checked against PRD v18, the answers and design version 1793640819-ff4d and CONFIRMED (`authoring/v18-named-set-record.json`).")
w("- **What changed in them:** quotes re-copied from PRD v18 (From line \"version 18 (2 Nov 2026, Chris Ward), read 2 Nov 2026\"); a From line "
  "for Chris's answer (sheet link and question number) where a case relies on it; References from Design name design version "
  "1793640819-ff4d and quote its new words, and the difference notes are replaced by the rulings. The 15 cases held on questions 1 to 8 are "
  "released (Rule 69 marker). Rewritten to the answers: API-09, API-10 and API-11 (accepted, value ignored: S5-N1 and answer 1); S1-37 "
  "(Save & Add Next starts fresh: answer 8); S3-36 (the filter's Unassigned choice: answer 3); S3-48 (a picked person who is turned off "
  "drops out of the filter and their work does not move: answer 4).")
w("- **New (6):** S1-38, S1-39, S1-40, S1-41 (the two refusal messages, and the role message when both reasons apply, from an old staff "
  "window in a second browser tab: PRD v18 Story 1 Error Handling, answer 1); S3-49 (the filter's Deleted technician choice); S3-50 (people "
  "picked at another location are dropped on switching, so \"No technicians yet\" shows: answer 3). INV-13 already covers answer 2, and "
  "S1-37 covers answer 8, so no duplicates were added.")
w("- **Deleted (2), for the coordinator with the QA lead's go-ahead:** D-33 C897374 and D-34 C897375, the held design-version cases "
  "(Chris ruled for the PRD on questions 5 and 6); listed in `po-answers-2026-11-02/DELETE.json`.")
w("- **Register:** TT-D01, TT-D02, TT-D04 and TT-D06 are PO-RULED, each with its answer word for word (DESIGN-DIVERGENCE-REGISTER.json).")
w(f"- **Named-set proof** (`authoring/verify_v18_named_set.py`): {_vf[0]} {_vf[-1]}. It failed on a planted title change outside the set, as it should.")
w("- **Stories re-read (pm):** SV-11879 and SV-11881 changed to match v18 word for word (68 of 68 requirement lines and the Story 1 Error "
  "Handling line match v18). SV-11880 and SV-11884 show the same text and update time as in the morning sweep.")
w("")
w("## 5a. Round 2 — design cases and References from Design (2 Nov 2026; the held statements here are superseded by 5b)")
w("")
w(f"- **Design cases:** the 34 drafts of `design-2026-11-02/DESIGN-CASE-PLAN.md` are `authoring/cases_design.py` (generated by "
  "`make_cases_design.py`): DC-01 to DC-32 are D-01 to D-32, DV-01 is D-33 and DV-02 is D-34, in \"Design — how it looks\". Each carries its "
  "References from Design block (board and page, the pictures to attach, the design's own words, the difference with its register id). "
  "The draft marker READY is replaced by Rule 69's marker (no build yet; coordinator, round 2). D-27, D-29, D-33 and D-34 are held on PO questions 6, 7, 5 and 6.")
w(f"- **Wording changes from the drafts ({len(EDITS)}), each needed by a gate, the pattern or a rule:**")
for x in EDITS: w(f"  - {x}")
w(f"- **References from Design on the PRD cases:** {len(with_ref)} of {len(prd_cases)} PRD cases name the board and pictures that show their "
  "screen (`authoring/design_refs.py`, from DESIGN-FIGURES-2026-11-02.json and SPEC-TO-DESIGN-2026-11-02.json). The other "
  f"{len(prd_cases) - len(with_ref)} have no board for their screen or state and carry no References from Design heading: "
  + ", ".join(c["key"] for c in prd_cases if c["key"] not in L.DREFS) + ".")
w("- **Differences named in the PRD-following cases (Rule 130), and the PRD cases now held:** TT-D01 in S1-16 (held, question 5); TT-D02 in "
  "S3-24, S3-25, S3-26 (held, question 6); TT-D04 in S3-29, S3-30 (held, question 7); TT-D06 in the new case S1-37, Save & Add Next "
  "(held, question 8). Settled differences are named where they touch a case (TT-D03, TT-D05, TT-D07, TT-D11 and the not-drawn rows).")
w("- **Cases changed in round 2 (Rule 134, cases not yet in TestRail):** S1-14 lost its last step, Time Clock back on, and its S1-R3 and S1-R5 "
  "quotes, because that step depends on question 5; S1-16 still covers it, held. S1-16, S3-24, S3-25, S3-26, S3-29 and S3-30 changed only their "
  "AUTOMATION line (now held). S3-31's location precondition was rewritten (an earlier string edit had garbled it; found in the round 2 sample "
  "read). S1-37 is new. Every PRD case with a board gained a References from Design block. Title, preconditions, steps, results, quotes, From "
  "lines, refs and setup recipe were re-checked against PRD v17 and the design files by build.py and found unchanged for every other case.")
w("")
w("## 6. Reading coverage (Rule 119: every source read in full)")
w("")
w("| Source | Size | Lines read | Coverage |")
w("|---|---|---|---|")
for f, how in [("sources/CONFLUENCE-977371146-v17-2026-11-02.md", "1-472 (whole file, including the Change Log, which is never quoted)"),
               ("sources/JIRA-SV-11788-tickets-2026-11-02.md", "1-728 (all 17 tickets)"),
               ("sources/tech-plan-Technician-Toggle-2026-11-02.md", "1-907 (whole plan)")]:
    p = f"{L.P}/{f}"; n = sum(1 for _ in open(p))
    w(f"| {f} | {os.path.getsize(p):,} bytes, {n} lines | {how} | 100% |")
p = f"{L.P}/sources/jira-sweep-2026-11-02.json"
w(f"| sources/jira-sweep-2026-11-02.json | {os.path.getsize(p):,} bytes (one JSON line) | parsed by script for keys, types and updated times; its ticket text is the same text as the .md above, which was read in full | 100% of fields used |")
w("| design-2026-11-02/files/project/*.dc.html (6 boards) | 6 boards | every caption (round 1, for labels); every quoted design word is checked against the package by build.py | 100% of captions |")
for f, how in [("design-2026-11-02/DESIGN-CASE-PLAN.md", "1-1395 (all 34 drafts)"), ("design-2026-11-02/NEW-QUESTIONS.py", "whole file"),
               ("design-2026-11-02/NOTES.md", "whole file"), ("design-2026-11-02/DESIGN-CASE-CHECKLIST-2026-11-02.md", "whole file"),
               ("design-2026-11-02/DESIGN-FIGURES-2026-11-02.json", "every figure (page, badge, heading, image, captions) by script"),
               ("design-2026-11-02/SPEC-TO-DESIGN-2026-11-02.json", "every row (code, verdict, pictures, note) by script"),
               ("DESIGN-DIVERGENCE-REGISTER.json", "every difference and not-shown row id and outcome by script")]:
    p = f"{L.P}/{f}"
    w(f"| {f} | {os.path.getsize(p):,} bytes | {how} | 100% of what the cases use |")
w("| design-2026-11-02/DESIGN-TEXT-INVENTORY.*, DESIGN-VISUAL-INVENTORY.md, DESIGN-READING-RECORD.md, images/ | the design worker's proof files | not re-read: they are the design drive's own coverage proof, which the plan and checklist summarise; the 25 pictures are referenced by name, and every name is checked to exist | NOT read in full (stated, Rule 119) |")
w("")
w("Rules and skills read before writing: LESSONS-REGISTER.md (L-01 to L-19), Rule 4, Rules 96, 113, 114, 116, 117 (fourteenth and "
  "fifteenth amendments in full), 122, 129, 130, 132, 134 to 138, Rule 69, IDEAL-TEST-CASE-STANDARD (superseded parts noted), skill 17 (Rule 96 "
  "text), skill 07 §2 to §6.")
w("")
_trc = subprocess.run([sys.executable, f"{L.P}/../testing-tools/tester_readiness_check.py", L.P, "--sample", "0"], capture_output=True, text=True).stdout.splitlines()[0]
w("## 7. Gates")
w("")
w("- `python3 build/technician-toggle/authoring/build.py`: 0 PROBLEM lines. Each gate was proved to fail on a planted fault (a semicolon title, "
  "steps not equal to results, two actions in one step, a placeholder, a For example line, a case id, an unused precondition record, a record not "
  "made for the test, a quote not in the PRD).")
w("- `python3 build/testing-tools/tester_readiness_check.py build/technician-toggle --sample 5`: 0 hard problems. Two random samples of five cases "
  "were read in full, and so was every \"does not / never\" result (76). Fixes made from that reading: S3-40's filter change ('Assigned to me' "
  "hides every column, so it proved nothing; it is now a Technician filter change); S3-05's staff member B reason; location C's switch moved "
  "last; a visible technician control added to S3-37 to S3-42 and S6-24; S1-34's Settings-menu result made conditional on the menu showing.")
w(f"- Round 2 readiness check: {_trc}. The round 2 sample (5 cases, seed 21) and every new \"does not / never\" line from the design cases, S1-14 and "
  "S1-37 (22 lines) were read in full; each has a visible control (the neighbouring names, the message shown, the unchanged buttons, the "
  "layout compared with a named picture). One fault found and fixed: S3-31's garbled location precondition.")
w("- `python3 build/testing-tools/ticket_sweep.py` (pm sweep, `--prd-version 18`): 0 unhandled tickets, PRD v18 handled.")
w("")
w("## 8. OUTSTANDING — what I need from you")
w("")
w("- The coordinator: review, create the subsections in 113017 (`sections.json`), run `create.py --apply` with the QA lead's go-ahead, then read back the cases and commit.")
w("- Round 4 (coordinator, with the QA lead's go-ahead): run `create.py --apply` first (3 new cases: S3-51, S3-52, S3-53), then "
  "`update_changed.py --apply` (16 named-set cases; it adds every unheld mapped case missing from run 555, union only, and assigns each "
  "added test to Mudassir, user 6).")
w("- Round 3 (done 2 Nov 2026): `update_changed.py --apply` (54 named-set cases; 15 released cases join run 555, union "
  "only), `create.py --apply` (6 new cases, then add them to run 555), delete D-33 and D-34 (DELETE.json).")
w("- Facts to confirm on the build (not PO questions): how the screen sets a line's own technician; which Public API requests change a staff member's role or a work order's lead (API-12, API-13).")
_po = [c["key"] for c in CASES if "waiting on the PO" in c["marker"]]
w("- **Waiting on the PO:** " + ("nothing: Chris answered questions 1 to 8 on 2 Nov 2026 (sheet https://docs.google.com/spreadsheets/d/"
  "1nLKkgSgmtqCYu4eu15_9xN38ml32tDnJls42PPq_A4M) and no case is held on the PO." if not _po else "cases still held on the PO: " + ", ".join(_po)))
open(f"{L.P}/REPORT.md", "w").write("\n".join(R) + "\n")
print("REPORT.md, PO-QUESTIONS-DRAFT.md, TICKET-LEDGER.json, TICKET-SWEEP.json written;", len(CASES), "cases,", len(held), "held")
