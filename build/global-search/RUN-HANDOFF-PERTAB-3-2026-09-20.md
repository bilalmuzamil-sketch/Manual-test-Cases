# HANDOFF → RUN SESSION — Global Search: per-tab prefix ranking (C72120 · C72121 · C72122)
### Run on `sv9160` (build `v26.36.8-d146c39`), record results in run **R415**. 2026-09-20.

**You are the run session.** All 3 are build-verified on `v26.36.8-d146c39`
(report: `build/global-search/build-verify-pertab-2026-09-20/REPORT-2026-09-20.md`). Stage-1 seed-verify
GREEN (14/14). Execute each, mark **Passed / Failed** in **R415**. **C72120 is EXPECT-FAIL against the
open SV-10279 — record it FAILED against that ticket, do not raise a new defect (§below).**

- **Scope:** C72120 (Parts), C72121 (Vendors), C72122 (Assets), section 6726. All `created_by=3`, none Automated.
- **Run:** R415 — <https://shopview.testrail.io/index.php?/runs/view/415>.
- **Run-case links:**
  - C72120 → https://shopview.testrail.io/index.php?/tests/view/3088559
  - C72121 → https://shopview.testrail.io/index.php?/tests/view/3088560
  - C72122 → https://shopview.testrail.io/index.php?/tests/view/3088561
- **🔑 RESULT-WRITE GO-AHEAD:** the QA lead asked for results recorded in R415 — explicit go-ahead for
  **result writes on R415 only** (Rule 6). Use `build/testing-tools/push_results_to_run.py` (playbook §W); union-only sync (Rule 34).
- **Branch:** `https://sv9160.qa.shopview.com` ONLY (dummy QA, full CRUD, Rule 107). Not staging/production.
- **Access:** `source build/testing-tools/ensure_bridge.sh`; fresh `sv_sso_session` in
  `/tmp/qa-cookies/sv9160-sso.txt` (chmod 600, /tmp only, NEVER committed — Rule 82); then
  `node build/testing-tools/qa-branch-boot.mjs sv9160 <route> admin`. A `403 AccessDenied` usually means
  the branch is ASLEEP (not a login failure) — two-second test + wake command in playbook §R.
- **TestRail API:** the API *key* is `/tmp`-only (may be wiped in a fresh container); the committed **web
  login password** (`ENVIRONMENT-CREDENTIALS.md` §4) authenticates `/index.php?/api/v2/` via Basic auth.
- **Rebuild data if the branch redeployed:** `cd build/global-search/seeding && python3 status.py`;
  `SEED_MANIFEST=seed-manifest-per-tab-prefix.json python3 seed.py --confirm` (never hand-edit the JSON).

## What to type, and how to judge (read the match LABEL, not row order)
🔴 **Judge by the match label, not the row order.** When the begins-with and contains rows tie, the order
is a recency artefact and can flip between runs. The label is stable. The reliable check (seed-verify §4):
```
curl -s "https://sv9160api.qa.shopview.com/api/search?q=ZZKRYPTON" -H "Cookie: $COOKIES" -H 'Accept: application/json' \
 | python3 -c 'import sys,json
for g in json.load(sys.stdin)["data"]["groups"]:
    for i in g.get("items") or []:
        m=i.get("match") or {}; print(f"{g[\"type\"]:10} {m.get(\"kind\"):8} {m.get(\"field\"):12} {i.get(\"primary\")}")'
```

| Case | Type / tab | The three rows | Expected label (observed live 2026-09-20) | Result |
|---|---|---|---|---|
| **C72120** | `ZZKRYPTON` / Parts | `ZZKRYPTON Brake Kit` (A begins) · `Heavy Duty ZZKRYPTON Filter` (B contains) · `ZZKRYPTOM Wheel Seal` (C typo) | 🔴 A observed as **`word`** (not `prefix`) — A and B tie | **FAILED against SV-10279** |
| **C72121** | `ZZMAGENTA` / Vendors | `ZZMAGENTA Supply Co` (A) · `Northgate ZZMAGENTA Parts` (B) · `ZZMAGENTO Traders` (C) | A observed as **`prefix`**, B `word`, C `fuzzy` | PASS (A above B) |
| **C72122** | `ZZOBSIDIAN` / Assets | `2019 ZZOBSIDIAN Trucks Hauler` (A) · `2019 Western Heavy ZZOBSIDIAN Hauler` (B) · `2019 ZZOBSIDIAM Trucks Hauler` (C) | A observed as **`prefix`** (field=make), B `word` (field=model), C `fuzzy` | PASS (A above B) |

## 🔴 C72120 — record FAILED against SV-10279, do not raise a new defect
SV-10279 is open: the Parts tab does not credit a begins-with match (scores it `word`, same as contains),
so A and B tie. That is the documented deviation. Record C72120 **Failed** and reference SV-10279 in the
comment. Do **not** rewrite the Expected (it comes from PRD §6.1/§4, Rule 57) and do **not** file a new
ticket. Three outcomes for completeness: (1) A/B tie by label → Failed vs SV-10279; (2) fails in any
other way → new problem, report it; (3) A ranks clearly above B with a `prefix` credit → the fix shipped,
tell the QA lead.

## Two traps the seed-verify already cleared (do not re-diagnose)
- Part numbers are deliberately neutral (`PERTAB-700x`) so the DESCRIPTION is what matches, not the number.
- Assets: make/model are indexed separately; the keyword starts `make` on A and sits mid-field on B, so the label difference is genuine, not an artefact.
Judge by *"is OUR named record there with the right label?"*, never by row count.

## OUTSTANDING — what I need from you (run session)
| # | Item |
|---|---|
| 1 | C72121, C72122 → PASS (prefix credited). |
| 2 | C72120 → FAILED against SV-10279 (open). Read the match label, not row order. No new defect, no Expected rewrite. |

**Standing holds:** no Jira/external artefact without the QA lead, no TestRail *case* writes without his
go-ahead (result writes on R415 covered above), Vladimir's cases never, Automated cases held, secrets
never committed, production is not a test environment. All on `sv9160` only.

---
_(Rule 95 — the twelve-clause Token-Discipline Charter is embedded verbatim in the companion build-verify
document `STAGE-1-SEED-VERIFY-Per-Tab-Prefix-C72120-C72121-C72122` / the sequenced handoff; canonical copy
`build/skills/TOKEN-DISCIPLINE-CHARTER.md`. Strategy first · never bulk-read · spawn discipline · never
poll · batch writes · piggyback · never re-do · answer in text · the budget · week-start guard · quality
is never the thing cut.)_
