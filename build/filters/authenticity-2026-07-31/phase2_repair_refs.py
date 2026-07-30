#!/usr/bin/env python3
"""PHASE 2 of the Filters closing-authenticity pass (2026-07-31) — TRACEABILITY.

Every active case's `refs` (local field `spec_ref`) must carry:
  * a SPEC ANCHOR that is valid against the ratified spec **v1.6** (Confluence
    page 572030978, version 12, 2026-07-28), and
  * a TICKET reference **where one exists**.

Filters has NO Jira epic and NO stories — proven by enumerating all 170 SV epics
in build/epic-recheck-2026-07-31/FILTERS-EPIC-SEARCH.md — so the ticket half is
recorded honestly as "Filters (no Jira epic)" and NOT invented (Rule 20).
That string is the same 22 characters as the old "Filters (Epic key TBD)" /
"Filters epic (key TBD)", so no refs string grows from the swap.

TWO defect classes repaired here:
  1. STALE SOURCE (76 cases) — refs cite `requirements.md Story N S#-R#`.
     `requirements.md` is the **V1.0** ingest (Confluence v4, 2026-05-14), 8
     Confluence versions behind; citing it is not a live anchor (SPEC-DIFF §6).
     The anchor IDs themselves survive (v1.6 REMOVED 0 requirements), so the
     repair is a re-point of the SOURCE, anchors preserved 1:1.
  2. STALE ANNOTATION (3 cases, handcrafted below) — the anchor is right but the
     annotation describes a conflict/supersession that v1.6 has since resolved.

Also normalised: the ticket half on the 31 already-v1.6 cases, and the 2 refs
containing a comma (TestRail strips the space after every comma, which makes
re-GET verification falsely MISMATCH).

LOCAL ONLY — the TestRail write is the Phase 5 authorized push.
"""
import sys, os, re, json, csv
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caseio import load_all, active, patch

HERE = os.path.dirname(os.path.abspath(__file__))
SPEC = "/home/user/Manual-test-Cases/build/filters/spec-current-2026-07-31/Filters-spec-current.md"
STAMP = "[spec v1.6 2026-07-28]"
TICKET = "Filters (no Jira epic)"

# --- cases whose ANNOTATION (not just the source label) is stale -------------
HANDCRAFTED = {
    # v1.6 S10-R2 now STATES permanent server-side per-user persistence, so the
    # "session-only wording superseded by PO ruling" hedge is itself obsolete:
    # the PRD has caught up to what we already test (SPEC-DIFF §2 S10-R2).
    "FLT-PERS-02":
        TICKET + " (S10-R2 (stored server-side against the account; survives logout; syncs across devices); S10-R3 (saved per user); S10-R1 (restored after navigating away)) "
        "+ Branko Q2 2026-07-17 - now matched by the PRD " + STAMP,
    # S9-R2 / S2-N1: PRD prose still says "hidden"; the ratified BEHAVIOUR is
    # Branko Q4=B (2026-07-17) + the QA-lead ruling (2026-07-30) = shown
    # greyed-out. Later-wins, and the PRD-text mismatch is Branko's open item.
    "FLT-TAB-02":
        TICKET + " (S9-R2; S2-N1; §4 Key Decisions - PRD text says \"hidden\"; behaviour per Branko Q4=B 2026-07-17 + QA-lead ruling 2026-07-30 = shown greyed-out/disabled; PRD alignment is Branko's open item) " + STAMP,
    # No spec anchor EXISTS for these two (engineering-plan-only behaviour). Say so
    # explicitly rather than let a tech-plan-only ref read as a spec citation.
    "FLT-PERS-06":
        TICKET + " (no numbered v1.6 requirement covers the one-off migration - context S10-R2 server-side model); tech plan 2026-07-29 s4-3.3 (browser-storage to account-preference migration) - confirmation requested " + STAMP,
    "FLT-TAB-06":
        TICKET + " (no requirement in the ratified spec v1.6 - default/last-used tab is engineering-plan-only - confirmation requested); tech plan 2026-07-29 D10 (default tab = Estimates; last-used tab persists) " + STAMP,
    "FLT-TAB-03":
        TICKET + " (S9-R3; S2-N2; §4 Key Decisions - PRD text says \"hidden\"; behaviour per Branko Q4=B 2026-07-17 + QA-lead ruling 2026-07-30 = shown greyed-out/disabled; PRD alignment is Branko's open item) " + STAMP,
}


def repoint(s):
    """`requirements.md Story N S#-R#; ...` -> canonical v1.6 citation."""
    body = re.sub(r"^requirements\.md\s+", "", s).strip()
    body = re.sub(r"\bStory\s+\d{1,2}\s+(?=S\d)", "", body)   # 'Story 8 S8-R3' -> 'S8-R3'
    body = re.sub(r"\bStory\s+\d{1,2}\b", "", body)           # bare 'Story 8'
    body = re.sub(r"requirements\.md\s*", "", body)
    body = body.replace(",", " -")                            # keep refs comma-free
    body = re.sub(r"\s{2,}", " ", body).strip(" ;-")
    return "%s (%s) %s" % (TICKET, body, STAMP)


def normalise_ticket(s):
    s = re.sub(r"^Filters (?:\(Epic key TBD\)|epic \(key TBD\))", TICKET, s)
    s = s.replace(",", " -")
    return re.sub(r"\s{2,}", " ", s).strip()


def main():
    spec = open(SPEC).read()
    valid = set(re.findall(r"\bS\d{1,2}-[RNE]\d{1,2}\b", spec))
    idmap = {r["internal_id"]: r["testrail_case_id"]
             for r in csv.DictReader(open("/home/user/Manual-test-Cases/build/filters/testrail-id-map.csv"))}

    edits, report = {}, []
    for _, c in active():
        old = (c.get("spec_ref") or "").strip()
        if c["id"] in HANDCRAFTED:
            new, kind = HANDCRAFTED[c["id"]], "STALE-ANNOTATION repaired"
        elif old.startswith("requirements.md"):
            new, kind = repoint(old), "STALE-SOURCE (V1.0 requirements.md) re-pointed to v1.6"
        else:
            new, kind = normalise_ticket(old), "ticket half normalised"
            if new == old:
                kind = "unchanged (already conformant)"

        anchors_old = re.findall(r"\bS\d{1,2}-[A-Z]\d{1,2}\b", old)
        anchors_new = re.findall(r"\bS\d{1,2}-[A-Z]\d{1,2}\b", new)
        # never DROP an anchor; handcrafted repairs may legitimately ADD one
        assert set(anchors_old) <= set(anchors_new), (c["id"], anchors_old, anchors_new)
        if c["id"] not in HANDCRAFTED:
            assert anchors_old == anchors_new, (c["id"], anchors_old, anchors_new)
        bad = [a for a in anchors_new if a not in valid]
        assert len(new) <= 250, (c["id"], len(new))
        assert "," not in new, (c["id"], "comma in refs")
        assert "FLT-" not in new, (c["id"], "internal-id leak")
        assert TICKET in new or "no Jira epic" in new, (c["id"], "no ticket statement")

        report.append({
            "internal_id": c["id"], "c_id": idmap.get(c["id"], ""), "area": c["area"],
            "anchors": ";".join(anchors_new) or "(none - spec section / tech plan only)",
            "anchors_valid_in_v1_6": "n/a" if not anchors_new else ("YES" if not bad else "NO: " + ",".join(bad)),
            "ticket": "none exists (no Jira epic - stated honestly)",
            "verdict_before": ("STALE" if (old.startswith("requirements.md") or c["id"] in HANDCRAFTED)
                               else ("PRESENT+VALID" if anchors_new or "§" in old or "tech plan" in old else "MISSING")),
            "action": kind, "refs_before": old, "refs_after": new, "len_after": len(new),
        })
        if new != old:
            edits[c["id"]] = {"spec_ref": new}

    with open(os.path.join(HERE, "traceability-per-case.csv"), "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(report[0].keys()))
        w.writeheader(); w.writerows(report)

    print("active cases audited:", len(report))
    import collections
    print(collections.Counter(r["action"] for r in report))
    print("anchors invalid in v1.6:", [r["internal_id"] for r in report if r["anchors_valid_in_v1_6"].startswith("NO")])
    print("cases with no spec anchor at all:", [r["internal_id"] for r in report if r["anchors"].startswith("(none")])
    print("max refs length after:", max(r["len_after"] for r in report))
    print("edits to apply:", len(edits))
    print("patched:", patch(edits))


if __name__ == "__main__":
    main()
