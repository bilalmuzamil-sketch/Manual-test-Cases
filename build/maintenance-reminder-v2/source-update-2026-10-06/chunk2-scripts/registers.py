# -*- coding: utf-8 -*-
# Registers: retire, diverge, exclude, systemic, blockers, chunk1 notes (executed inside gen.py)
SNAP = json.load(open(ROOT + "/snapshots-2026-10-06/chunk2-cases-before.json", encoding="utf-8"))
UPD_IDS = {u["case_id"] for u in UPD}
def li(h): return [html.unescape(re.sub(r"<[^>]+>", "", x)).strip() for x in re.findall(r"<li>(.*?)</li>", h or "", re.S)]
def plain_res(e): return li((e or "").split("<strong>Source")[0])

_DF = ROOT + "/source-update-2026-10-06/DESIGN-DRIVE-2026-10-06/DESIGN-DRIVE-FINDINGS.md"
_dtxt = open(_DF, encoding="utf-8").read() if os.path.exists(_DF) else ""
DRIVE_STATUS = ("DESIGN-DRIVE-FINDINGS.md not found" if not _dtxt else
                ("DESIGN-DRIVE-FINDINGS.md still reads 'IN PROGRESS' (%d bytes); no final Chunk 2 findings to fold in yet" % len(_dtxt.encode())
                 if "IN PROGRESS" in _dtxt else "DESIGN-DRIVE-FINDINGS.md is final: fold-in required"))
RETIRE = []  # no behaviour was wholly removed; the reversed S18-E3 text in C204170 is replaced through its update

def D(id_, topic, a, b, question, cases, note=""):
    return {"id": id_, "topic": topic, "side_a": a, "side_b": b, "po_question": question, "affected_cases": cases,
            "case_handling": note}
DIVERGE = [
    D("D1", "Is there a reading dialog on the work order?",
      {"source": "Chunk 2 MR S10-R1", "quote": SPEC["S10-R1"]},
      {"source": "Chunk 2 MR S16-R12 (and S16-N1); main page Reusable components row 'Reading dialog'",
       "quote": SPEC["S16-R12"] + " || Main page: Reading dialog | S10-R1 (Chunk 2) | Asset tab Enter mileage (S9), work order (S16-R12)"},
      "On a work order, are readings typed only in the work order's Mileage and Engine Hours fields (S16-R12), or does the work order also open the "
      "same reading dialog as the asset (S10-R1)? Should S10-R1 and the main page's component row be updated?",
      ["C204102", "C204142"], "C204102 now tests the asset dialog only; S10-R1 held until answered. C204142 follows S16-R12 (the later, more specific text)."),
    D("D2", "What does the collapsed work order card show besides the badge?",
      {"source": "Chunk 2 MR S16-R2", "quote": SPEC["S16-R2"]},
      {"source": "Design MR_V2_2, Chunk 2 board, frame W2k (Maintenance card collapsed) — separate on-screen labels joined with ' · '", "quote": "Maintenance schedule · 1 due · [Expand]"},
      "'It carries the badge alone, with no other text': does that forbid the card title 'Maintenance schedule' and the word 'due' in the badge "
      "('1 due'), as the design shows, or only any summary text?",
      ["C204136"], "C204136 asks the tester to record the words and not fail on them until answered."),
    D("D3", "Which email dates count as a 'guess' and read Soon?",
      {"source": "Chunk 2 MR S19-R9", "quote": SPEC["S19-R9"]},
      {"source": "Plan 2 §0 assumption (asked 2026-10-05, reply 919502849) and design board R1 note",
       "quote": "\"a guessed date\" in S19-R9 = any meter-estimated date at any confidence → \"Soon\". || Design: A unit with no basis to estimate "
                "from reads Soon rather than a date the shop would be held to."},
      "Beyond every Low-confidence date, does a High or Medium meter estimate also read Soon in the email (tech plan assumption), or its month? "
      "And does a unit with no basis to estimate (No data, calendar governs) read Soon (design note) or its calendar month?",
      ["C204175"], "C204175 asserts only Low → Soon and no confidence words; High/Medium is recorded, not judged."),
    D("D4", "Month, day or 'Today' in the email's Due column?",
      {"source": "Chunk 2 MR S19-R9", "quote": "Each row shows its due month where the date is sound."},
      {"source": "Design MR_V2_2, Chunk 2 board, frame R1 (table cells, joined) ; Plan 2 §1 S19-R9 row",
       "quote": "Design rows: 'CVIP safety inspection 14 Aug 2026 Past due' and 'Tire inspection Today Due today' || Plan: Due month where the date is "
                "sound (a day for a certificate)"},
      "Should a certificate row show its End date as a day (14 Aug 2026) and a due-today row show 'Today', as the design and plan do, or the month as "
      "S19-R9 says?", ["C204174", "C204175"], "Cases avoid asserting the format of a certificate or due-today row."),
    D("D5", "Where is Undo complete for a lines-added row reset by Mark complete?",
      {"source": "Chunk 2 MR S18-R17 and S16-R25", "quote": SPEC["S18-R17"] + " || " + Q("S16-R25", "Remove is not offered once the service has been "
       "reset, by Mark complete or by invoicing; Undo complete comes first, per S18-R17.")["quote"]},
      {"source": "Plan 2 §3.3 FD-211", "quote": "Reset by Mark complete → \"Added · {n} lines · marked complete, next due counts from {date}\", no button "
       "and no Undo complete on the panel (it is undone from the asset tab"},
      "On the work order card, after Mark complete on a row whose lines were added, does the row read 'Completed · next due counts from …' with Undo "
      "complete in its menu (spec), or 'Added · 4 lines · marked complete, next due counts from …' with Undo complete only on the asset tab (plan)?",
      ["C204168", "N12"], "Cases follow the spec; N12 tells the tester what to do if Undo complete is only on the asset tab."),
    D("D6", "Add Service window labels",
      {"source": "Design MR_V2_2, Chunk 2 board, frame W2a — separate on-screen labels joined with ' · '", "quote": "Add PM-A to S3780-15904 · Add to this work order · Create a new work order instead · "
       "Cancel · Add"},
      {"source": "Plan 2 §3.3 FD-209 — excerpt, '...' marks omitted words", "quote": "title \"Add {service}\"; ... destination radio \"This work order (#{n})\" / \"A new work order\" (S17-R1) ... "
       "confirm \"Add Service\""},
      "The spec gives no wording for the window. Which labels are right: the design's or the tech plan's?", ["C204140", "C204152"],
      "Cases use the design's labels, marked 'in the design'."),
    D("D7", "Mark complete window's subtitle",
      {"source": "Chunk 2 MR S18-R1", "quote": "PM-A resets now from the date below. It won't wait for an invoice"},
      {"source": "Design MR_V2_2, Chunk 1 board frames M2/M2c/M2e and Chunk 2 board", "quote": "PM-A resets from this date. It won’t wait for an invoice."},
      "Which line sits under the Mark complete title: the spec's 'resets now from the date below' or the design's 'resets from this date'?",
      ["C204158"], "C204158 keeps the spec quote; the build will be judged against it."),
    D("D8", "Wording of the enrol action on the work order card",
      {"source": "Chunk 2 MR S16-R11", "quote": SPEC["S16-R11"]},
      {"source": "Design MR_V2_2, Chunk 2 board, frame W6 — separate on-screen labels joined with ' · '", "quote": "Not on a maintenance schedule · Enroll in a schedule"},
      "Is the card's action 'Enroll in Schedule' (spec, and the asset tab in the Chunk 1 board) or 'Enroll in a schedule' (Chunk 2 board)?",
      ["C204141"], "C204141 asks the tester to record the wording."),
    D("D9", "Reason text in the step after invoicing",
      {"source": "Chunk 2 MR S18-R8 (and the Chunk 2 board, and Plan 2's own walk-through)", "quote": "with its reason, for example Lines added from PM-A"},
      {"source": "Plan 2 Phase Q3, InvoiceStepServiceRow", "quote": "reason \"Lines added from {schedule}\" (S18-R8)"},
      "Confirm the reason names the service (Lines added from PM-A), not the schedule, so the plan can be corrected.", ["C204164"],
      "Note only: spec, design and the plan's own walk-through agree on the service."),
    D("D10", "Does an Add Service later removed still count as a maintenance origin?",
      {"source": "Chunk 2 MR S22-R1 / S22-E1", "quote": SPEC["S22-R1"] + " || " + SPEC["S22-E1"]},
      {"source": "Plan 2 §3.2 TD-112", "quote": "and state <> 'removed' (an Add Service undone by mistake is not an origin, S16-R25)"},
      "If Add Service is undone or removed, does the work order lose its Maintenance schedule origin (plan), or keep it? The spec is silent.",
      ["C204119", "C204121"], "No case asserts either way until answered."),
    D("D11", "Wording of 'a service that has just become due says so'",
      {"source": "Chunk 2 MR S16-E1", "quote": "a service that has just become due says so"},
      {"source": "Plan 2 §3.3 FD-204 and Phase Q1 copy list; older design screenshots 2026-09-16 15.04.44 and 20.24.59 (read from the image, DESIGN-PACKAGE-READING-NOTES A79/A86)",
       "quote": "Plan: \"Now due\" || Older design: Due today · appeared just now, mileage updated 14:20"},
      "What exact words should the card show for a service that has just become due? The current design shows none.",
      ["C204142"], "C204142 asks the tester to record the words shown."),
    D("D12", "Does the collapsed badge count a covered service?",
      {"source": "Chunk 2 MR S16-R2 / S16-R3", "quote": SPEC["S16-R3"]},
      {"source": "Plan 2 §1 S16-R2 row (stated assumption)", "quote": "a covered service folded under a listed coverer is not counted separately"},
      "When PM-A is folded under PM-C, does the badge count 1 (the rows shown) or 2 (the services due)?", ["C204136", "C204137"],
      "C204136 uses two services with no covering, so its count is unaffected."),
    D("D13", "Remove menu wording",
      {"source": "Chunk 2 MR S16-R25; design frame W2d", "quote": "the row's three-dot menu offers Remove"},
      {"source": "Plan 2 §3.3 FD-221", "quote": "Menu item \"Remove from this work order\""},
      "Confirm the menu item reads Remove (spec and design), so the plan can be corrected.", ["C204149", "N12"], "Note only."),
    D("D14", "Service names in the email carry a suffix in the design",
      {"source": "Chunk 1 MR S2-R3 (the name a shop gives a service is the name its customer reads in a reminder); Chunk 2 MR S19-R8",
       "quote": SPEC["S19-R8"]},
      {"source": "Design MR_V2_2, Chunk 2 board, frames R1 and R1U (table cells)", "quote": "PM-D service · PM-A service · Engine hours service "
       "(while frame R1T shows plain PM-A)"},
      "Does the email show the service exactly as the shop named it (PM-A), or with ' service' added (PM-A service)?", ["C204174", "N9"],
      "Cases say 'names the service' and do not assert a suffix."),
    D("D15", "Compliance due date on the work order card",
      {"source": "Chunk 2 MR S16-R4 (rows use the asset tab's words) with S11-R13", "quote": SPEC["S16-R4"] + " || " +
       Q("S11-R13", "A date from a certificate reads its End date and Certificate, for example 14 Oct 2026 · Certificate")["quote"]},
      {"source": "Design MR_V2_2, Chunk 2 board, frames W4 and W4o", "quote": "CVIP · Due 14 Sep 2026 || CVIP · Overdue · 14 Aug 2026 (no 'Certificate')"},
      "Should a compliance row on the card read '14 Sep 2026 · Certificate' as on the asset tab (spec), or just the date (design)?", ["C204138"],
      "C204138 keeps the spec quote; the build is judged against it."),
    D("D16", "Does a Needs readings row ride in the reminder email?",
      {"source": "Chunk 2 MR S19-R6", "quote": SPEC["S19-R6"]},
      {"source": "Chunk 2 MR S19-R7 and Chunk 1 MR S13-R36 (the worklist lists every Needs readings row whatever its date)",
       "quote": SPEC["S19-R7"]},
      "A unit whose only worklist row is a Needs readings row with a far calendar date: does the email carry that row (the worklist shows it), or "
      "only the next two upcoming services (it is not overdue, due today or within 91 days)?", ["N9"],
      "N9 asserts the next two upcoming services and records, without judging, whether the Needs readings service appears."),
    D("D17", "How is an older reading corrected?",
      {"source": "Chunk 2 MR S10-R8 and S11-R7", "quote": SPEC["S10-R8"] + " || " + SPEC["S11-R7"]},
      {"source": "Plan 1 §3.2 TD-06", "quote": "one row per (WO, meter), updated in place on each WO edit that changes the value (TD-34)"},
      "S11-R7 says a correction anywhere in the history recomputes the rate, but S10-R8 corrects only by entering the right value as the newest "
      "reading. Is changing the Mileage on an older work order the intended way to correct an older reading, and does it then stay dated as before "
      "and leave the current reading alone?", ["C204127"], "C204127 corrects the latest reading only."),
]

EXCLUDE = [
    {"item": "Viewing audit entries (reading corrections, Add Service, Mark complete, sends)", "anchors": ["S10-R4 (author part)", "S10-R8 (audit part)",
     "S17-R6", "S19-R14 (audit part)", "S21-R4/R5 (Chunk 1)"], "reason": "No screen shows the audit in v1 (main page change log 5 Oct 2026; Chunk 1 "
     "S21-N3). Cases mark that part as not checkable by hand; checking it is a developer task."},
    {"item": "Readings dated in the future or in an impossible year", "anchors": ["S11-R6"], "reason": "The reading window records today only; such "
     "readings cannot be entered by hand (Plan 1 testability note B5). Marked as not checkable by hand in C204126."},
    {"item": "Email transport failure, bounces, open rates", "anchors": ["S19-E4", "S22-N2"], "reason": "Nothing to observe by design; covered as "
     "negatives in C204179 and C204123. Forcing a transport failure is not a manual step."},
    {"item": "Performance budgets, re-entrancy guards, request counts, test ids", "anchors": ["Plan 2 NFR-F102, NFR-F104, NFR-F106, NFR-F107, NFR-F109"],
     "reason": "Engineering / automated checks, not manual tester observations (Rule 114)."},
    {"item": "Background historical-load job trigger", "anchors": ["S10-R12 (mechanism)"], "reason": "Testers see only the result (new case N6); when "
     "and how the load runs is an engineering concern (Plan 1 §7: it runs on QA after each branch deploy)."},
    {"item": "Automatic sending and the v2 email rules", "anchors": ["S19 deferred rules"], "reason": "Deferred to v2 on the spec; C204171 covers that "
     "nothing sends automatically."},
    {"item": "Phone layout of the work order card", "anchors": ["main page open question 5 Oct 2026; Plan 2 NFR-F108"], "reason": "Open question owned by "
     "product ('How the work order maintenance card works on a phone … Deferred'); no expectation to test yet."},
    {"item": "Mail sink / allowlist environment set-up", "anchors": ["Plan 2 §7 environment notes"], "reason": "Environment, not behaviour; cases tell "
     "testers to send only to mailboxes the QA team controls."},
    {"item": "Feature flag on/off behaviour", "anchors": ["main page 'No feature flag' (5 Oct 2026)"], "reason": "There is no feature flag any more; "
     "nothing to test. Stale flag text in cases is a systemic correction (below)."},
    {"item": "Accounting / webhook side effects of reversal", "anchors": ["Plan 2 §3a"], "reason": "Internal integration events with no screen; the "
     "tester-visible part (resets undone, proposed again) is new case N13."},
]

# ---------------------------------------------------------------- SC1 / SC2 / SC3: flag-only corrections (coordinator decision 6 Oct 2026)
FLAG_VARIANTS = [("The Maintenance Reminders feature is on for the shop (it ships behind the maintenance_reminders flag).", ""),
                 ("The Maintenance Reminders feature is on (maintenance_reminders flag).", ""),
                 (", maintenance_reminders flag on.", "."),
                 ("Flag on.", "")]
SC3_FIX = {204116: ("(per S2-R16)", "(picked in that service's Services also covered step)")}
RID2 = re.compile(r"\bS\d{1,2}-[RNE]\d+\b|\(S\d{1,2}\)|\bper S\d")
flag_cases, flag_variants, rid_cases, FLAG_ONLY = [], {}, [], []
for c in SNAP:
    pre = li(c["custom_preconds"])
    new_pre, hit = [], False
    for line in pre:
        l2 = line
        for v, r in FLAG_VARIANTS:
            if v in l2:
                flag_variants.setdefault(v, []).append(c["id"]); hit = True
                l2 = l2.replace(v, r)
        l2 = re.sub(r"\s+", " ", l2).strip()
        if c["id"] in SC3_FIX and SC3_FIX[c["id"]][0] in l2:
            l2 = l2.replace(*SC3_FIX[c["id"]])
        if l2: new_pre.append(l2)
    if hit: flag_cases.append(c["id"])
    hits = [l for l in li(c["custom_preconds"]) + li(c["custom_steps"]) + plain_res(c["custom_expected"]) if RID2.search(l)]
    if hits and c["id"] not in UPD_IDS:
        rid_cases.append({"case_id": c["id"], "lines": hits})
    if c["id"] in UPD_IDS: continue
    assert OLD_MARK in c["custom_expected"], c["id"]
    exp_new = c["custom_expected"].replace(esc(OLD_MARK), esc(MARK)).replace(OLD_MARK, MARK)
    FLAG_ONLY.append({"case_id": c["id"], "link": f"https://shopview.testrail.io/index.php?/cases/view/{c['id']}", "title": c["title"],
                      "preconds": new_pre, "custom_preconds": ol(new_pre), "custom_expected_marker_fix": True,
                      "custom_expected": exp_new, "sc3_fixed": c["id"] in SC3_FIX,
                      "note": "Only the feature-flag sentence is removed from the preconditions and the AUTOMATION marker is replaced; steps, results, "
                              "source line and quotes are unchanged" + ("; the requirement id in the preconditions is replaced by plain words (SC3)."
                                                                       if c["id"] in SC3_FIX else ".")})
flag_left = sorted(set(flag_cases) - UPD_IDS)
assert [f["case_id"] for f in FLAG_ONLY] == [c["id"] for c in SNAP if c["id"] not in UPD_IDS]
SYSTEMIC = [
    {"id": "SC1", "what": "Stale feature-flag precondition", "status": "RESOLVED in the proposals",
     "why": "Main page, decided 5 October 2026: 'No feature flag.' The feature ships to every organization at release. A precondition telling testers "
            "to turn a flag on cannot be carried out.",
     "variant_counts": {k: len(v) for k, v in flag_variants.items()}, "cases_total": len(set(flag_cases)),
     "fixed_by_updates": sorted(set(flag_cases) & UPD_IDS), "fixed_by_flag_only": flag_left},
    {"id": "SC2", "what": "AUTOMATION marker named the removed flag", "status": "RESOLVED (coordinator decision 6 Oct 2026)",
     "why": "Every proposal (updates, new and flag_only) now ends with our own marker text, not a quote: '" + MARK + "'.",
     "cases_affected": "all 86 Chunk 2 cases and every new case"},
    {"id": "SC3", "what": "Requirement ids inside preconditions, steps or plain results (Rules 7/9/117)", "status": "RESOLVED",
     "cases": rid_cases, "note": "C204116's '(per S2-R16)' becomes plain words in its flag_only entry; every other occurrence was in a case now rewritten."},
]

NUMERIC = [204124, 204125, 204126, 204127, 204180, 204181, 204182, 204183, 204184, 204185, 204186]
SOFT = [204111, 204112, 204115, 204118, 204129, 204130, 204132, 204133, 204134, 204135]
BLOCKERS = [
    {"id": "B1", "what": "Seeding readings with past dates", "status": "RESOLVED from the specification (coordinator decision)",
     "route": "S18-R19: Mark complete On a work order records that work order's mileage and engine hours as the asset's readings, dated the Reset date. "
              "A throwaway schedule 'ZZAUTOTEST Reading seed' holds one routine service per reading ('ZZ Seed 1', 'ZZ Seed 2', …, Every 12 months), "
              "enrolled with last service dates five years back so every seed row is overdue and shows on the work order card; for each reading, "
              "oldest first with rising values: New Work Order, type the mileage, Mark complete a seed service On this work order with Reset date = the "
              "reading's date; afterwards Remove from schedule. Also allowed: units whose past invoiced work orders already carry mileage (Plan 1 §7).",
     "cases_rewritten": NUMERIC + [204128, 204131, 204187], "new_case": "N17 (band edges)",
     "not_rewritten": {"cases": SOFT, "note": "These need a unit already in some state (an estimate, No data, a Low date). They keep their wording "
                       "(flag sentence removed); the recipe above, or a never-read unit for No data, meets their preconditions."}},
    {"id": "B2", "what": "Reaching the contact card for a unit with nothing on the worklist", "status": "RESOLVED from the specification",
     "route": "Chunk 1 S13-R36 lists every Needs readings row whatever its date (N9 uses a mileage service with no reading); S13-N2 lists a compliance "
              "service with no record, reading No record, while no tile is active (N8). Whether the Needs readings row itself rides in the email is "
              "DIVERGE D16.", "cases": ["N8", "N9"]},
    {"id": "B3", "what": "Leaving an invoice pending so it can be voided", "status": "RESOLVED (coordinator route)",
     "route": "Create Invoice, record a full payment in New Customer Payment (do not just close it), then reverse that payment from the work order's "
              "payment history; the invoice stays unpaid and not sent.", "cases": ["N14"]},
    {"id": "B4", "what": "Labels the spec and design do not give", "status": "KEPT: described in plain words; the tester records the wording shown; "
     "build verification confirms", "items": [
        "the confirm button of the implausible-reading warning (plan: 'Save anyway')",
        "the card's control for adding a compliance certificate",
        "the notice for a service that has just become due (plan: 'Now due'; DIVERGE D11)",
        "the work order's split action, the asset merge action, the invoice reverse action, the credit memo action and the payment-history reverse",
        "the invoicing permission name for a role",
        "the 'Closed {date}' caption on a closed line (plan only)",
        "'New Customer Payment' and 'Payment Method' (existing payment window; given by the coordinator, not in spec or design)"]},
    {"id": "B5", "what": "Design drive results", "status": "PENDING", "evidence": DRIVE_STATUS},
]

CHUNK1 = [
    "Demo board (Maintenance Reminders Demo) is stale against the 5 Oct spec: a 'Send reminder?' confirmation step, a greeting by company name, several "
    "units in one email, the word 'absorbs', and an estimate explained as using the two most recent readings.",
    "An In the shop value making a service due at once (S16-E1, Plan 2 TD-108) also moves due dates on the asset tab and the worklist (Chunk 1 cases).",
    "S13-R43 (worklist rest after a completion; a Needs readings row stays listed) is the Chunk 1 half of S18-R17.",
    "Asset tab labels seen on the Chunk 1 board: 'Calendar · needs mileage reading', 'Other triggers', 'Enter mileage', 'Save the reading'.",
    "Contact card: notifications off shows Send reminder disabled with the reason beside it (S14-N1), not hidden.",
    "Plan 1 FD-29 text 'None of this customer's contacts has an email address, so no reminder can be sent.' vs S14-R13 / S19-R3 (Add email) — check.",
    "The 2 Oct screenshot showing 'Enroll in maintenance schedule' is older than the spec ('Enroll in Schedule').",
    "Plan 1 TD-33 / S8-R10: a certificate End date keeps the same day number, clamped to month end.",
    "Design W14 shows the work order status 'Completed' while S13-R25 / S18-R6 call it the app's own 'Complete' (worklist Due status is Chunk 1).",
    "Design handoff 07-consent.md (16 Sep) off-state texts 'Notifications off for this customer' and the disabled-send tooltip are design-only and older "
    "than the spec; S14-N1 governs the contact card.",
    "Main page Reusable components row 'Reading dialog | S10-R1 | … work order (S16-R12)' conflicts with S16-R12 (see DIVERGE D1); the asset tab is "
    "Chunk 1's surface.",
]
