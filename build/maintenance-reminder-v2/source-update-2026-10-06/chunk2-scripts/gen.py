# -*- coding: utf-8 -*-
"""Chunk 2 MR source-update proposals (2026-10-06). Builds chunk2-proposals.json.
No TestRail writes. Quotes are pulled from the saved sources and asserted verbatim at build time."""
import json, re, html, sys, os
ROOT = "/home/user/Manual-test-Cases/build/maintenance-reminder-v2"
SRC = ROOT + "/sources"
OUT = ROOT + "/source-update-2026-10-06/chunk2-proposals.json"
sys.path.insert(0, os.path.dirname(__file__))
from anchors import anchors, clean

SPEC = anchors(SRC + "/CONFLUENCE-897679389-Chunk2-MR-2026-10-06.md")
def blob(p): return clean(open(p, encoding="utf-8").read())
DOCS = {
    "plan2": blob(SRC + "/tech-plan/Plan-2-The-work-order-and-the-customer-Technical-Implementation-Plan.md"),
    "main": blob(SRC + "/CONFLUENCE-833290250-Maintenance-Reminders-V1-2026-10-06.md"),
    "plan1": blob(SRC + "/tech-plan/Plan-1-Track-act-clear-Technical-Implementation-Plan.md"),
}
OLD_MARK = "AUTOMATION: HOLD - not yet build-verified on a Maintenance Reminders QA build (feature ships behind the maintenance_reminders flag)"
MARK = "AUTOMATION: HOLD - not yet build-verified on a Maintenance Reminders QA build"  # coordinator decision 6 Oct 2026 (SC2): no flag exists
STORY = {"S10": ("SV-10567", "Enter a reading", 26636), "S11": ("SV-10568", "Rate, estimate and confidence", 26637),
         "S12": ("SV-10569", "Due date resolution", 26638), "S16": ("SV-10572", "The maintenance panel on a work order", 26639),
         "S17": ("SV-10573", "Add a service to a work order", 26640), "S18": ("SV-10574", "Complete a service and reset the cycle", 26641),
         "S19": ("SV-10575", "The customer reminder email (sent by hand)", 26642), "S22": ("SV-10577", "Origin reporting", 26643)}
SECNAME = {26636: "S10 — Enter a reading", 26637: "S11 — Rate, estimate and confidence", 26638: "S12 — Due date resolution",
           26639: "S16 — The maintenance panel on a work order", 26640: "S17 — Add a service to a work order",
           26641: "S18 — Complete a service and reset the cycle", 26642: "S19 — The customer reminder email (sent by hand)",
           26643: "S22 — Origin reporting", 26644: "Numeric and date accuracy (Rule 116)"}
PLAN2 = "Plan 2 — The work order and the customer — Technical Implementation Plan"
PLAN1 = "Plan 1 — Track, act, clear — Technical Implementation Plan"
MAINP = "Maintenance Reminders V1 main page (Confluence 833290250) as edited 5 October 2026"

def Q(anchor, part=None):
    full = SPEC[anchor]
    if part is None: return {"anchor": anchor, "quote": full, "doc": "chunk2"}
    assert part in full, f"{anchor}: not verbatim: {part}"
    return {"anchor": anchor, "quote": part, "doc": "chunk2"}
def PQ(label, text, doc):
    assert text in DOCS[doc], f"{label}: not verbatim in {doc}: {text}"
    return {"anchor": label, "quote": text, "doc": doc}

def source_line(stories, plan=None, main=False, plan1=None):
    st = "; ".join(f"story {STORY[s][0]} ({s}, {STORY[s][1]})" for s in stories)
    parts = [f"Epic SV-3780 (Maintenance Reminders); {st}; Chunk 2 MR (Confluence 897679389) as edited 5 October 2026, "
             + ", ".join(stories)]
    if plan: parts.append(f"{PLAN2}, {plan}")
    if plan1: parts.append(f"{PLAN1}, {plan1}")
    if main: parts.append(MAINP + ", change log")
    return "; ".join(parts) + "; read 6 Oct 2026. Source-verified 6 October 2026; not yet build-verified."

def esc(t): return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
def ol(x): return "<ol>" + "".join(f"<li>{esc(i)}</li>" for i in x) + "</ol>"
def ul(x): return "<ul>" + "".join(f"<li>{esc(i)}</li>" for i in x) + "</ul>"
def expected(results, src, quotes):
    return ("<p><strong>Expected results</strong></p>" + ul(results)
            + "<p></p><p><strong>Source &mdash; where this behaviour comes from</strong><br>" + esc(src) + "</p>"
            + "<p></p><p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
            + "<ul>" + "".join(f"<li><strong>{esc(q['anchor'])}:</strong> &ldquo;{esc(q['quote'])}&rdquo;</li>" for q in quotes) + "</ul>"
            + "<p></p><p>" + esc(MARK) + "</p>")

# ---------------------------------------------------------------- shared preconditions (click by click, example values)
LOGIN_ADMIN = "Sign in to the Maintenance Reminders QA build as an Owner/Admin (any user who can open Settings > Maintenance and create and edit work orders and customers)."
SCHED = ("Open Settings > Maintenance. Open the schedule 'ZZAUTOTEST Highway Tractor PM', or create it with New schedule: "
         "add service 'PM-A' with a Calendar trigger of Every 6 months and canned lines, for example 'Engine oil and filter change' 0.8 hours, "
         "'Chassis lubrication, 12 points' 0.5 hours, 'Air filter inspection' 0.3 hours and 'Brake adjustment check' 1.2 hours (4 lines, 2.8 hours). Save.")
ENROLL = ("Open Customers, open customer 'ZZAUTOTEST Fleet Co' (create it if missing), open its Assets tab and open unit 'ZZAUTOTEST 402' "
          "(create it with New Asset if missing). Open the asset's Maintenance tab. If the unit is not on the schedule, press Enroll in Schedule, "
          "choose 'ZZAUTOTEST Highway Tractor PM', enter a last service date for PM-A about seven months ago (for example 6 Mar 2026) and press Enroll. "
          "PM-A now reads Overdue on the Maintenance tab.")
NEWWO = ("On the customer page press New Work Order, choose unit 'ZZAUTOTEST 402' and create the work order (it opens as an estimate). "
         "Note its number, for example S3780-15904.")
PANEL = "On the work order page, find the Maintenance schedule card inside the asset card at the top and press Expand."
ADDSVC = ("On the PM-A row press Add Service; in the Add PM-A to <work order number> window keep Add to this work order selected and press Add. "
          "The row now reads Added · 4 lines.")
CONTACT = ("Make sure 'ZZAUTOTEST Fleet Co' has its Send preventive maintenance notifications setting on, and a contact 'Dave Brabay' with an email "
           "address you can read (for example a QA mailbox) set as the preferred contact of unit 'ZZAUTOTEST 402'.")
WORKLIST = "Open Customers > Maintenance reminders (the worklist)."
QA_MAIL = "On the QA environment, send only to a mailbox the QA team controls."

UPD, NEW = [], []
def upd(cid, title, stories, pre, steps, results, quotes, reason, plan=None, main=False, anchors_changed=(), plan1=None, section=None):
    assert len(title) <= 80, (cid, len(title), title)
    for i, u in enumerate(UPD):
        if u["case_id"] == cid: del UPD[i]; break   # a later rewrite replaces an earlier one
    src = source_line(stories, plan, main, plan1)
    sec = section or STORY[stories[0]][2]
    UPD.append({"case_id": cid, "link": f"https://shopview.testrail.io/index.php?/cases/view/{cid}",
                "section_id": sec, "section": SECNAME[sec],
                "reason": reason, "anchors_changed": list(anchors_changed),
                "title": title, "preconditions": pre, "steps": steps, "expected_results": results,
                "source": src, "quotes": quotes,
                "custom_preconds": ol(pre), "custom_steps": ol(steps), "custom_expected": expected(results, src, quotes)})
def new(key, title, stories, pre, steps, results, quotes, reason, plan=None, main=False, section=None, plan1=None):
    assert len(title) <= 80, (key, len(title), title)
    src = source_line(stories, plan, main, plan1)
    sec = section or STORY[stories[0]][2]
    NEW.append({"key": key, "section_id": sec, "section": SECNAME[sec], "reason": reason,
                "title": title, "preconditions": pre, "steps": steps, "expected_results": results,
                "source": src, "quotes": quotes, "custom_automation_type": 2, "custom_atmstatus": 1,
                "custom_preconds": ol(pre), "custom_steps": ol(steps), "custom_expected": expected(results, src, quotes)})

exec(open(os.path.join(os.path.dirname(__file__), "cases_upd.py"), encoding="utf-8").read())
exec(open(os.path.join(os.path.dirname(__file__), "cases_new.py"), encoding="utf-8").read())
exec(open(os.path.join(os.path.dirname(__file__), "cases_seed.py"), encoding="utf-8").read())
exec(open(os.path.join(os.path.dirname(__file__), "registers.py"), encoding="utf-8").read())

# guards: no requirement ids in title / pre / steps / plain results
RID = re.compile(r"\bS\d{1,2}-[RNE]\d+\b|\(S\d{1,2}\)|\bper S\d")
for c in UPD + NEW:
    for f in ("title",):
        assert not RID.search(c[f]), (c.get("case_id") or c.get("key"), c[f])
    for f in ("preconditions", "steps", "expected_results"):
        for line in c[f]:
            assert not RID.search(line), (c.get("case_id") or c.get("key"), line)
    assert "maintenance_reminders flag" not in " ".join(c["preconditions"]), c.get("case_id")

out = {"meta": {"generated": "2026-10-06", "chunk": 2, "testrail_folder": 26635,
                "spec": "Chunk 2 MR, Confluence 897679389, lastModified 2026-10-05 19:58, saved sources/CONFLUENCE-897679389-Chunk2-MR-2026-10-06.md",
                "marker": MARK, "old_marker": OLD_MARK, "writes": "none — proposals only; no TestRail write, no commit",
                "format": "custom_preconds / custom_steps / custom_expected are full replacement HTML in the mr2_lib.add() house format"},
       "updates": UPD, "new": NEW, "flag_only": FLAG_ONLY, "retire": RETIRE, "diverge": DIVERGE, "exclude": EXCLUDE,
       "systemic_corrections": SYSTEMIC, "blockers": BLOCKERS, "chunk1_notes": CHUNK1}
json.dump(out, open(OUT, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print(f"updates {len(UPD)} new {len(NEW)} flag_only {len(FLAG_ONLY)} retire {len(RETIRE)} diverge {len(DIVERGE)} exclude {len(EXCLUDE)} "
      f"systemic {len(SYSTEMIC)} blockers {len(BLOCKERS)} chunk1 {len(CHUNK1)}")
