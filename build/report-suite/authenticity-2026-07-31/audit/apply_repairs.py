#!/usr/bin/env python3
"""PHASE 4 repairs found by the three-dimension Rule-28 audit re-run. LOCAL ONLY."""
import json, os, glob

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
files = sorted(glob.glob(os.path.join(ROOT, "cases", "cases-*.json")))
data = {f: json.load(open(f, encoding="utf-8")) for f in files}
cases = {c["id"]: c for lst in data.values() for c in lst
         if not str(c.get("viu_status", "")).startswith("Retired")}
log = []

# ---- R1 (Dimension 2, FIX-WORDING): PV-EXP-05 told the tester the no-logo fallback was
# "confirmed in the build" — not an actionable check. The TU spec S7-R11/S7-N2 documents the
# resolver as SHARED across the suite ("the shared organization-logo resolver ... otherwise the
# bundled ShopView default logo") and the 2026-07-29 changelog says "org logo -> bundled
# ShopView default -> none". The PV spec is SILENT, so the wording now gives a definite check
# and the spec-silence is recorded in the metadata layer instead of the tester's words.
c = cases["PV-EXP-05"]
old = c["expected"][4]
assert "confirmed in the build" in old, old
c["expected"][4] = ("5. The shop logo shows at the top of the PDF when one is set. With no uploaded "
                    "logo the PDF shows the bundled ShopView default logo instead of a blank space, "
                    "the same as the other reports in this suite. The CSV never includes a logo.")
c["notes"] = (c["notes"] + " AUDIT 2026-07-31 (Rule 9/Dimension 2): the tester-facing line used to "
              "read \"fallback behaviour when no logo is set is confirmed in the build\", which is "
              "not something a tester can check. The PV spec v4 is SILENT on the no-logo fallback; "
              "the wording now follows the SHARED organisation-logo resolver documented in the TU "
              "spec S7-R11/S7-N2 (\"the shared organization-logo resolver ... otherwise the bundled "
              "ShopView default logo\") and the 2026-07-29 changelog (\"org logo -> bundled ShopView "
              "default -> none\"). VIU-confirm live on the Parts Velocity PDF; if PV behaves "
              "differently that is a spec-silence finding for Chris Ward, not a bug.").strip()
log.append(("PV-EXP-05", "R1 FIX-WORDING: non-actionable \"confirmed in the build\" replaced with a "
                         "definite check; spec-silence moved to the metadata layer"))

# ---- R2-R4 (Dimension 2/3): three trimmed titles no longer named their own report, so they
# did not read sensibly standing alone (and "nav" is jargon a layman tester should not meet).
TITLES = {
 "SBR-PERM-01": ("Anyone who can see another Performance report also sees this report",
                 "Sales By Representative is visible to anyone who sees another Performance report"),
 "WIP-PERM-02": ("Without the permission the report is absent from the reports navigation",
                 "Without the permission Work In Progress is absent from the reports navigation"),
 "TU-NAV-07":   ("Without the timesheet-reports permission the report is absent from the nav",
                 "Without the timesheet-reports permission Technician Utilization is hidden"),
}
for iid, (was, now) in TITLES.items():
    assert cases[iid]["title"] == was, (iid, cases[iid]["title"])
    assert len(now) <= 80, (iid, len(now))
    cases[iid]["title"] = now
    log.append((iid, "R2 title now names its own report / drops the \"nav\" abbreviation so the "
                     "title reads sensibly on its own (was: %r)" % was))

# ---- R5/R6 (Dimension 2/3): the plain tester note for a DELIBERATELY-FAILING case.
# Chris Ward ruled 2026-07-31 (Q4=A, verbatim "the intention is to not hide these from normal
# reports access. These were specced before CRP was built") that every report opens on the
# ordinary reports access; the build still ships a dedicated Sales By Customer atom. All three
# SBC access cases therefore FAIL against today's build BY DESIGN. Only SBC-PERM-01 carried the
# note that tells the tester so; without it a tester meeting SBC-NAV-01 / SBC-PERM-02 would
# think the case is wrong and either "fix" it or skip it.
NOTE = ("%d. Note for the tester: the product owner has ruled that every report in this suite "
        "opens with the ordinary reports access. If the build still demands a separate Sales By "
        "Customer permission, mark this test Failed and report it as the known pending change — "
        "do not change the test.")
for iid in ("SBC-NAV-01", "SBC-PERM-02"):
    c = cases[iid]
    assert not any("Note for the tester" in x for x in c["expected"]), iid
    c["expected"].append(NOTE % (len(c["expected"]) + 1))
    log.append((iid, "R3 plain tester note added — this case fails against today's build BY DESIGN "
                     "(Chris Ward Q4=A ruling vs the shipped dedicated atom); only SBC-PERM-01 had "
                     "the note, so a tester hitting this one would have thought the case was wrong"))

for f, lst in data.items():
    json.dump(lst, open(f, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    open(f, "a").write("\n")
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "repair-log-2026-07-31.md"),
     "w", encoding="utf-8").write(
  "# Report Suite — Phase-4 audit repairs (2026-07-31)\n\n"
  "%d repairs, all found by the three-dimension Rule-28 re-run. Local only.\n\n"
  "| Case | Repair |\n|---|---|\n" % len(log)
  + "\n".join("| %s | %s |" % (a, b) for a, b in log) + "\n")
print("repairs applied:", len(log))
for a, b in log: print("  ", a, "-", b[:90])

# =====================================================================================
# R7 (Dimension 3, Rule 20): SPEC ANCHORS leaking into TESTER-FACING text. Rule 20 keeps
# ticket keys and spec anchors in the metadata layer only — the words a manual tester
# reads must be plain. `clean()` on push strips internal CASE ids but NOT spec anchors,
# so these 8 would have gone live. Each anchor is deleted from the tester-facing line
# (the assertion itself is untouched) and recorded in the case's notes instead.
import json as _json, os as _os, glob as _glob
_ROOT = _os.path.dirname(_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__))))
_files = sorted(_glob.glob(_os.path.join(_ROOT, "cases", "cases-*.json")))
_data = {f: _json.load(open(f, encoding="utf-8")) for f in _files}
_cases = {c["id"]: c for lst in _data.values() for c in lst
          if not str(c.get("viu_status", "")).startswith("Retired")}
LEAKS = {
 ("PV-CALC-04", "expected", 4): ("produces no row at all (per S3-N1) - accepted",
                                 "produces no row at all - accepted"),
 ("PV-ROW-10", "expected", 2): ("would be excluded per S3-N1 (Demand alone is not a keep-criterion)",
                                "would be excluded altogether (a Demand count alone does not keep a row)"),
 ("PV-VIS-01", "expected", 2): ("reports (consistency goal, §1).", "reports."),
 ("SBR-BADGE-01", "expected", 2): ("The mapping matches §3: paid", "The mapping is: paid"),
 ("TU-SUM-04", "preconditions", 0): ("one partially valued (S2-E4).", "one partially valued."),
 ("TU-TECH-04", "expected", 2): ("restored alongside (per S1-R8).", "restored alongside."),
 ("WIP-API-03", "expected", 0): ("identical computation (Earned per S4-R19, Remaining per S4-R20), so",
                                 "identical computation for both figures, so"),
 ("WIP-API-06", "expected", 1): ("matching the on-screen S4-E1 behavior.",
                                 "matching what the report shows on screen for a job with nothing approved."),
}
_log2 = []
for (iid, fld, idx), (was, now) in LEAKS.items():
    c = _cases[iid]
    assert was in c[fld][idx], (iid, c[fld][idx])
    c[fld][idx] = c[fld][idx].replace(was, now)
    c["notes"] = (c["notes"] + " AUDIT 2026-07-31 (Rule 20 / Dimension 3): a spec anchor was "
                  "removed from the tester-facing %s - the assertion is unchanged; the anchor "
                  "stays in this case's References field where it belongs." % fld).strip()
    _log2.append((iid, "R7 spec anchor removed from tester-facing %s[%d] (Rule 20)" % (fld, idx + 1)))
for f, lst in _data.items():
    _json.dump(lst, open(f, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    open(f, "a").write("\n")
_p = _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "repair-log-2026-07-31.md")
open(_p, "a", encoding="utf-8").write("\n".join("| %s | %s |" % (a, b) for a, b in _log2) + "\n")
print("R7 spec-anchor leaks repaired:", len(_log2))
