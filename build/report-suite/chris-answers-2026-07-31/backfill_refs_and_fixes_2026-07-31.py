#!/usr/bin/env python3
"""Phase-3 audit repairs (Rule 20 traceability + Rule 28 dimension-3 fixes) on the
cases this pass touched. LOCAL ONLY — no TestRail writes. Run AFTER
apply_chris_answers_2026-07-31.py.

Three repairs, all found by the Rule-28 audit of this pass:
 (R1) 44 in-scope cases carried a spec anchor but NO Jira ticket in `refs` — Rule 20
      requires BOTH. Backfilled with the exact per-story ticket from the SV-8582 epic
      ingest (build/report-suite/epic-sv8582/INGEST-SUMMARY.md), never guessed.
 (R2) SBC-PERM-01 / SBC-PERM-02 were re-cited to SV-8601 in the first script; the epic
      map shows SBC Story 1 = SV-8600 (SV-8601 is Story 2, Filter by date range). Fixed.
 (R3) two tester-facing lines carried a spec anchor ("per S5-R4b", "per S4-R4"), which
      Rule 20 forbids in the words the manual tester reads. Anchors moved to metadata.
"""
import json, os, re, glob, csv

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CASEDIR = os.path.join(ROOT, "cases")
OUT = os.path.join(ROOT, "chris-answers-2026-07-31")

files = sorted(glob.glob(os.path.join(CASEDIR, "*.json")))
data = {f: json.load(open(f, encoding="utf-8")) for f in files}
byid = {c["id"]: (f, c) for f, lst in data.items() for c in lst}
edit = json.load(open(os.path.join(OUT, "edit-set.json")))
SCOPE = set(edit["edited"]) | set(edit["new"])

# (report, story number) -> Jira story key, transcribed from the SV-8582 epic ingest.
STORY_TICKET = {
 ("SBC", 1): "SV-8600", ("SBC", 2): "SV-8601", ("SBC", 3): "SV-8602", ("SBC", 4): "SV-8603",
 ("SBC", 6): "SV-8604", ("SBC", 7): "SV-8605", ("SBC", 8): "SV-8606", ("SBC", 9): "SV-8607",
 ("SBC", 10): "SV-8608", ("SBC", 11): "SV-8609", ("SBC", 12): "SV-8610", ("SBC", 13): "SV-8611",
 ("SBC", 14): "SV-8612", ("SBC", 15): "SV-8613", ("SBC", 16): "SV-8614", ("SBC", 17): "SV-8615",
 ("SBC", 18): "SV-8616", ("SBC", 20): "SV-8617", ("SBC", 21): "SV-8618",
 ("SBR", 1): "SV-8619", ("SBR", 2): "SV-8620", ("SBR", 3): "SV-8621", ("SBR", 4): "SV-8622",
 ("SBR", 5): "SV-8623", ("SBR", 6): "SV-8624", ("SBR", 8): "SV-8625", ("SBR", 9): "SV-8626",
 ("SBR", 10): "SV-8627", ("SBR", 11): "SV-8628", ("SBR", 12): "SV-8629", ("SBR", 13): "SV-8630",
 ("SBR", 14): "SV-8631", ("SBR", 15): "SV-8632", ("SBR", 16): "SV-8633", ("SBR", 17): "SV-8634",
 ("SBR", 18): "SV-8635", ("SBR", 19): "SV-8636", ("SBR", 20): "SV-8637", ("SBR", 21): "SV-8638",
 ("SBR", 22): "SV-8639", ("SBR", 23): "SV-8640",
 ("PV", 1): "SV-8641", ("PV", 2): "SV-8642", ("PV", 3): "SV-8643", ("PV", 4): "SV-8644",
 ("PV", 5): "SV-8645", ("PV", 6): "SV-8646", ("PV", 7): "SV-8647",
 ("TU", 1): "SV-8648", ("TU", 2): "SV-8649", ("TU", 3): "SV-8650", ("TU", 4): "SV-8651",
 ("TU", 5): "SV-8652", ("TU", 6): "SV-8653", ("TU", 7): "SV-8654", ("TU", 8): "SV-8655",
 ("TU", 9): "SV-8656",
 ("WIP", 1): "SV-8657", ("WIP", 2): "SV-8658", ("WIP", 3): "SV-8659", ("WIP", 4): "SV-8660",
 ("WIP", 5): "SV-8661", ("WIP", 6): "SV-8662", ("WIP", 7): "SV-8663", ("WIP", 8): "SV-8664",
 ("WIP", 9): "SV-8665", ("WIP", 10): "SV-8666", ("WIP", 11): "SV-8667",
 ("IV", 1): "SV-8668", ("IV", 2): "SV-8669", ("IV", 3): "SV-8670", ("IV", 4): "SV-8671",
 ("IV", 5): "SV-8672", ("IV", 6): "SV-8673", ("IV", 7): "SV-8674", ("IV", 8): "SV-8675",
 ("IV", 9): "SV-8676", ("IV", 10): "SV-8677", ("IV", 11): "SV-8678", ("IV", 12): "SV-8679",
}

log = []

# ---- R2 first: correct the two mis-cited SBC permission tickets -------------
for cid in ("SBC-PERM-01", "SBC-PERM-02"):
    c = byid[cid][1]
    before = c["spec_ref"]
    c["spec_ref"] = before.replace("SV-8601", "SV-8600", 1)
    assert "SV-8600" in c["spec_ref"]
    log.append((cid, "R2 ticket corrected SV-8601 -> SV-8600 (SBC Story 1 = Report access and "
                     "navigation placement; SV-8601 is Story 2, Filter by date range)"))

# ---- R1: backfill the missing ticket on in-scope cases ---------------------
def primary_story(cid, refs):
    """The story the case's FIRST cited anchor belongs to (never guessed)."""
    rep = cid.split("-")[0]
    m = re.search(r"Story (\d+)", refs)
    n = re.search(r"S(\d+)-[RNE]\d+", refs)
    nums = []
    if m: nums.append((m.start(), int(m.group(1))))
    if n: nums.append((n.start(), int(n.group(1))))
    if not nums:
        return None, None
    nums.sort()
    return rep, nums[0][1]

for cid in sorted(SCOPE):
    c = byid[cid][1]
    refs = c["spec_ref"]
    if re.search(r"SV-\d+", refs):
        continue
    rep, st = primary_story(cid, refs)
    key = STORY_TICKET.get((rep, st))
    assert key, (cid, rep, st, refs)
    c["spec_ref"] = f"{key} ({refs})" if not refs.startswith("(") else f"{key} {refs}"
    log.append((cid, f"R1 Rule-20 ticket backfilled: {key} (from the SV-8582 epic ingest, "
                     f"{rep} Story {st}) — the spec anchor was already present"))

# ---- R3: spec anchors out of the tester-facing words ----------------------
FIX3 = {
 "PV-CALC-02": (r"\s*\(net of reversals, per S5-R4b\)", " (net of reversals)"),
 "TU-VIS-01":  (r"\s*\(Technician column, per S4-R4\)", " (in the Technician column)"),
}
for cid, (pat, rep) in FIX3.items():
    c = byid[cid][1]
    hit = False
    for k in ("preconditions", "steps", "expected"):
        nl = []
        for ln in c.get(k) or []:
            n2 = re.sub(pat, rep, ln)
            hit = hit or n2 != ln
            nl.append(n2)
        c[k] = nl
    assert hit, cid
    log.append((cid, "R3 spec anchor removed from the tester-facing wording (Rule 20 keeps "
                     "§-numbers in the metadata layer only)"))

# ---- TU Story 10 has no Jira story ticket yet -----------------------------
for cid in ("TU-COL-01", "TU-LOC-06"):
    c = byid[cid][1]
    if "SV-86" in c["spec_ref"] or "SV-8582" in c["spec_ref"]:
        pass
    c["notes"] = (c["notes"].rstrip() + " TRACEABILITY NOTE: the TU spec's NEW Story 10 (Column "
                  "Selection and Persistence, added 2026-07-29) has NO Jira story ticket in epic "
                  "SV-8582 — the TU story tickets stop at SV-8656 (Story 9, Location Filter). This "
                  "case is cited to the nearest owning story; ASK for the new Story-10 ticket key "
                  "and re-cite when it exists.").strip()
    log.append((cid, "traceability note added — TU spec Story 10 has no Jira ticket yet (ask for it)"))

# ---- R4: title/expected wording aligned (Stage-2b TITLE-vs-EXPECTED adjudication) ----
c = byid["SBR-WO-01"][1]
c["title"] = "Sales Representative selector shows on WO and Part Sale, not on imported"
log.append(("SBR-WO-01", "R4 title aligned with its own expected results — the trimmed title said "
                         "\"hidden on imported\" while expected 3/4 say \"NOT present\" on the "
                         "imported WO and in History mode; the title now matches and no longer "
                         "drops the History-mode leg silently"))

# ---- R5: tidy the awkward doubling the mechanical rename produced -----------
DOUBLE = {
 "PV-ROW-02": [("The same special-order (special-order, vendor-sourced) part",
                "The same special-order (vendor-sourced) part")],
 "PV-CALC-02": [("A special-order (vendor-sourced, special-order) part",
                 "A special-order (vendor-sourced) part")],
}
for cid, pairs in DOUBLE.items():
    c = byid[cid][1]
    for k in ("preconditions", "steps", "expected"):
        c[k] = [ln.replace(a, b) for ln in c[k] for a, b in [("", "")]] if False else [
            (lambda s: [s := s.replace(a, b) for a, b in pairs][-1] and s)(ln) if False else ln for ln in c[k]]
    for k in ("preconditions", "steps", "expected"):
        nl = []
        for ln in c[k]:
            for a, b in pairs:
                ln = ln.replace(a, b)
            nl.append(ln)
        c[k] = nl
    log.append((cid, "R5 wording tidied — the mechanical Catalogue->Special Order rename had left a "
                     "doubled \"special-order (… special-order …)\" phrase in the precondition"))

# ---- validate + save -----------------------------------------------------
for f, lst in data.items():
    for c in lst:
        if str(c.get("viu_status", "")).startswith("Retired"):
            continue
        if c["id"] in SCOPE:
            assert re.search(r"SV-\d+", c["spec_ref"]), c["id"]
            assert re.search(r"S\d+-[RNE]\d+|Story \d+|§", c["spec_ref"]), c["id"]
            assert len(c["spec_ref"]) <= 250, (c["id"], len(c["spec_ref"]))
            assert len(c["title"]) <= 80, (c["id"], len(c["title"]))
    json.dump(lst, open(f, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    open(f, "a", encoding="utf-8").write("\n")

with open(os.path.join(OUT, "audit", "repair-log-2026-07-31.md"), "w", encoding="utf-8") as fh:
    fh.write("# Rule-28 audit repairs applied 2026-07-31 (LOCAL, pre-push)\n\n")
    fh.write(f"{len(log)} repairs.\n\n| Case | Repair |\n|---|---|\n")
    for cid, msg in log:
        fh.write(f"| {cid} | {msg} |\n")
print("repairs:", len(log))
