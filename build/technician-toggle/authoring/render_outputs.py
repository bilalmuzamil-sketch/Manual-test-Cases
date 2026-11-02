#!/usr/bin/env python3
"""Writes REPORT.md, PO-QUESTIONS-DRAFT.md, TICKET-LEDGER.json and TICKET-SWEEP.json from the case library (2 Nov 2026).
Run build.py first (it must print 0 PROBLEM lines) and story_diff.py (story_diff.json)."""
import sys, os, re, json, glob, importlib
from collections import Counter, defaultdict
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
import tt_lib as L
from po_questions import QUESTIONS, DROPPED
_ORDER = ["cases_s1", "cases_s2", "cases_s3", "cases_s4", "cases_api", "cases_s6", "cases_inv"]
_MODS = sorted(os.path.basename(f)[:-3] for f in glob.glob(f"{D}/cases_*.py"))
for m in [x for x in _ORDER if x in _MODS] + [x for x in _MODS if x not in _ORDER]: importlib.import_module(m)
SECS = json.load(open(f"{L.P}/sections.json"))["sections"]
SD = json.load(open(f"{D}/story_diff.json"))
J = json.load(open(f"{L.P}/sources/jira-sweep-2026-11-02.json"))["issues"]
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
                   note=f"Every requirement line of the story matches PRD v17 word for word ({sum(1 for c, v in SD['codes'].items() if v['story'] == k)} lines, story_diff.json).")
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
           "prd_version_handled": 17, "jira_saved": "sources/jira-sweep-2026-11-02.json", "checked": "2026-11-02"},
          open(f"{L.P}/TICKET-SWEEP.json", "w"), indent=1)

# ---------------------------------------------------------------- PO-QUESTIONS-DRAFT.md
P = []
w = P.append
w("# Technician Toggle — questions for Chris Ward (DRAFT, not sent)")
w("")
w("Project: **Technician Toggle** (epic SV-11788, PRD Confluence 977371146 version 17, 2 Nov 2026). For: Chris Ward (PO and design authority). "
  "Drafted 2 Nov 2026 by the case-library worker; the coordinator sends it as the colour-coded question sheet (Rule 125 format) once everything "
  "else is done (skill 07 §1). Nothing here has been sent.")
w("")
for i, (slug, q, basis, opts, holds) in enumerate(QUESTIONS, 1):
    w(f"## Question {i}")
    w("")
    w(f"- **Project / feature:** Technician Toggle — {q.split(':')[0].replace('Technician Toggle, ', '')}")
    w(f"- **What the PRD says now:** {basis}")
    w(f"- **The question:** {q.split(': ', 1)[1] if ': ' in q else q}")
    for o in opts: w(f"- {o}")
    w(f"- **Your answer:** ")
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
open(f"{L.P}/PO-QUESTIONS-DRAFT.md", "w").write("\n".join(P) + "\n")

# ---------------------------------------------------------------- REPORT.md
R = []
w = R.append
cnt = Counter(c["sec"] for c in CASES)
held = [c for c in CASES if c["held"]]
w("# Technician Toggle — case library report (2 Nov 2026)")
w("")
w("PRD \"Technician Toggle\", Confluence 977371146, **version 17** (2 Nov 2026, Chris Ward). Project type (ii) V2 / upgrade. Epic SV-11788. "
  "Library: `build/technician-toggle/authoring/` (`tt_lib.py`, `cases_*.py`, `build.py`). Nothing was written to TestRail, Jira, Slack or Google; nothing was committed.")
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
w("| Case | Title | Why held |")
w("|---|---|---|")
for c in held: w(f"| {c['key']} | {c['title']} | {c['marker'][len('AUTOMATION: HOLD - '):]} |")
w("")
w("Lesson L-14 says a behaviour a manual tester cannot set up is not written as a manual case. The brief (point 10) says to keep such cases with "
  "the exact expected text and a HOLD marker. These cases are kept as HELD (not for a manual run): S2-34, S2-35, S2-36, S3-47 and S4-07. The "
  "coordinator decides whether they go to TestRail or to the developers' own checks.")
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
w("| design-2026-11-02/files/project/*.dc.html (6 boards) | captions only | every caption, for the screen's own labels; the design drive belongs to the other worker | labels only, by the brief |")
w("")
w("Rules and skills read before writing: LESSONS-REGISTER.md (L-01 to L-19), Rule 4, Rules 96, 113, 114, 116, 117 (fourteenth and "
  "fifteenth amendments in full), 122, 129, 130, 132, 134 to 138, Rule 69, IDEAL-TEST-CASE-STANDARD (superseded parts noted), skill 17 (Rule 96 "
  "text), skill 07 §2 to §6.")
w("")
w("## 7. Gates")
w("")
w("- `python3 build/technician-toggle/authoring/build.py`: 0 PROBLEM lines. Each gate was proved to fail on a planted fault (a semicolon title, "
  "steps not equal to results, two actions in one step, a placeholder, a For example line, a case id, an unused precondition record, a record not "
  "made for the test, a quote not in the PRD).")
w("- `python3 build/testing-tools/tester_readiness_check.py build/technician-toggle --sample 5`: 0 hard problems. Two random samples of five cases "
  "were read in full, and so was every \"does not / never\" result (76). Fixes made from that reading: S3-40's filter change ('Assigned to me' "
  "hides every column, so it proved nothing; it is now a Technician filter change); S3-05's staff member B reason; location C's switch moved "
  "last; a visible technician control added to S3-37 to S3-42 and S6-24; S1-34's Settings-menu result made conditional on the menu showing.")
w("- `python3 build/testing-tools/ticket_sweep.py`: see section 8.")
w("")
w("## 8. OUTSTANDING — what I need from you")
w("")
w("- The coordinator: review, create the subsections in 113017 (`sections.json`), run `create.py --apply` with the QA lead's go-ahead, then read back the cases and commit.")
w("- The design round: `cases_design.py` and `design_refs.py` fill the empty \"References from Design\" hook and the \"Design — how it looks\" section.")
w("- Facts to confirm on the build (not PO questions): how the screen sets a line's own technician; which Public API requests change a staff member's role or a work order's lead (API-12, API-13).")
w("- **Waiting on the PO** (draft, not sent: `PO-QUESTIONS-DRAFT.md`): " + "; ".join(
    f"question {i} holds {', '.join(c['key'] for c in CASES if c['marker'] == L.PO_HOLD(i))}" for i in range(1, len(QUESTIONS) + 1)) + ".")
open(f"{L.P}/REPORT.md", "w").write("\n".join(R) + "\n")
print("REPORT.md, PO-QUESTIONS-DRAFT.md, TICKET-LEDGER.json, TICKET-SWEEP.json written;", len(CASES), "cases,", len(held), "held")
