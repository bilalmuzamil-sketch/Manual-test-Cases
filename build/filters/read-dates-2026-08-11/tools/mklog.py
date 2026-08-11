#!/usr/bin/env python3
"""Render testrail-execution-log.md from the per-operation JSON logs."""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
EV = os.path.join(HERE, "..", "evidence")
OUT = os.path.join(HERE, "..", "testrail-execution-log.md")

recs = []
for f in ("exec-canary.json", "exec-batch1.json", "exec-batch2.json", "exec-batch3.json"):
    recs += json.load(open(os.path.join(EV, f)))
for i, r in enumerate(recs, 1):
    r["n"] = i
json.dump(recs, open(os.path.join(EV, "testrail-execution-log.json"), "w"), indent=1)

L = ["# Filters — TestRail execution log — read-date sweep, 2026-08-11", "",
     "> **Every operation is an `update_case`. There is no other operation in this pass:**",
     "> **0 `add_case` · 0 `delete_case` · 0 section write · 0 run write · 0 result logged ·",
     "> 0 Jira call that creates anything** (Rules 6 and 62, and the active creation hold).", "",
     "## Sources, at pass start and again at write start (Rule 59)", "",
     "| | |", "|---|---|",
     "| Read at pass start | **2026-08-11 13:41:2xZ** — Confluence page 572030978, `version.number` **19**, "
     "`version.when` 2026-08-06T11:48:47.371Z, body 57,028 chars |",
     "| **Re-read immediately before the writes began** | **2026-08-11 13:59:09Z** — same page, "
     "**still version 19**, same `when`, same 57,028-char body; epic **SV-8785 still 21 children**, "
     "`updated` still 2026-08-07T13:12:18Z, status Open |",
     "| Verdict of the second read | **UNCHANGED — nothing moved between pass start and write start, "
     "so no conclusion was re-derived.** |", "",
     "## Per-operation record", "",
     "`atm` is TestRail's own `custom_atmstatus`, **captured at write time** from the post-write "
     "`get_case` body (Rule 65) — it is recorded per operation because the flag moves both ways, so "
     "reading it afterwards can give a different answer from the truth at the moment of the write.", "",
     "| # | op | case | HTTP | fields compared | byte verification | atm at write | read-dates inserted |",
     "|---|---|---|---|---|---|---|---|"]
for r in recs:
    L.append(f"| {r['n']} | `update_case` | "
             f"[C{r['case_id']}](https://shopview.testrail.io/index.php?/cases/view/{r['case_id']}) | "
             f"{r['http']} | {r['fields_compared']} | **{r['verification']}** | "
             f"{r['atmstatus_at_write']} | {', '.join(r['read_dates_inserted'])} |")

ok = sum(1 for r in recs if r["verification"] == "MATCH" and r["http"] == 200)
L += ["", f"**{len(recs)} operations. {ok} returned HTTP 200 and byte-verified MATCH. "
          f"{len(recs) - ok} did not.**", "",
      "## Standing Rule 41 — the whole-case re-read, recorded per operation", "",
      "Every one of the 114 operations carries this line in "
      "`evidence/testrail-execution-log.json`:", "",
      f"> *{recs[0]['rule41']}*", "",
      "The re-read was ALSO run as a checkable script over all 114 cases **before** any write "
      "(`tools/rule41.py`, output `evidence/rule41-findings-PRE.json`): **0 findings** — 0 stale "
      "requirement anchors against live spec v19, 0 provenance naming a version other than 19, "
      "exactly one provenance opening and exactly one `AUTOMATION:` marker per case with nothing "
      "after it, 0 raw markup, 0 barred phrases, `refs` carrying both a Jira key and a spec anchor "
      "on all 114 with no entry over 248 characters, 0 API content outside an API section, 0 title "
      "over 80 characters, and the `---` separator present on all 114.", "",
      "**Two things the re-read DID find are reported in `FINDINGS.md` rather than fixed here**, "
      "because both are wording changes beyond this pass's charter: C38882's wrong publication date "
      "for version 19, and C29600 naming no epic.", "",
      "## Post-write verification (Rule 50 — exhaustive, then exact)", "",
      "All figures below are from `tools/final_verify.py`, run **2026-08-11 14:03:38Z–14:05:01Z**, "
      "re-reading every case individually with `get_case`.", "",
      "| Check | Result |", "|---|---|",
      "| Our cases re-read live, field by field | **114 — 0 mismatches.** `custom_expected` equals "
      "the planned bytes on all 114; every other field byte-identical to the pre-write snapshot |",
      "| Fields compared per case | **30** |",
      "| `refs` written | **never** — not sent on any payload, and byte-identical on all 114 afterwards |",
      "| All three text fields sent on every payload | **yes, 114 of 114** (playbook §J #3 — an "
      "omitted text field is re-rendered into `<p>`/CRLF, and this project shows markup literally "
      "to the tester) |",
      "| Sentence 2 (`Last checked against build …`) | **altered on 0 cases.** 103 have one, 11 do "
      "not; **95 read `v3.4.2-d00239b` on 8/5/2026 and 8 read `v3.6-3e9dd6d` on 8/11/2026**, exactly "
      "as before. None added, none removed, none re-dated |",
      "| Read-date census | **0 of 114 without one.** 2 mentions on 93 cases, 3 on 20, 5 on 1 (C38909) |",
      "| `AUTOMATION` marker / provenance count / `---` separator | **unchanged on all 114** |",
      "| Raw markup, all 119 live cases | **0**, measured 14:03Z |",
      "| Foreign cases (Rule 38) | **5 byte-identical, including `updated_on` and `updated_by`** |",
      "| `custom_atmstatus = 3` after | the same **4**: C29600, C29614, C29623, C38877 |", "",
      "### Run 352 proven undamaged", "",
      "| Check | Before | After |", "|---|---|---|",
      "| `include_all` | false | **false** |",
      "| tests | 114 | **114** — test-id sets and case-id sets **equal in both directions** |",
      "| result records | 473 | **473 — every prior record present BY ID, 0 missing, 0 new** |",
      "| graded fields changed (`status_id`, `comment`, `defects`, `elapsed`, `version`, "
      "`assignedto_id`, `created_by`, `created_on`, `test_id`, `case_id`, `id`) | — | **0** |",
      "| counters | 65 P / 7 F / 0 B / 42 U | **65 P / 7 F / 0 B / 42 U** |",
      "| declared echoes (`case_title`, `case_refs`) that moved | — | **0** (see `FINDINGS.md` §6 — "
      "playbook normalisation #2c predicts `case_refs` can move on any `update_case`; it did not fire "
      "on this pass, which is recorded rather than assumed away) |", "",
      "**No result was logged anywhere. `update_run` was never called.**", ""]
open(OUT, "w").write("\n".join(L) + "\n")
print("wrote", OUT, len(recs), "ops")
