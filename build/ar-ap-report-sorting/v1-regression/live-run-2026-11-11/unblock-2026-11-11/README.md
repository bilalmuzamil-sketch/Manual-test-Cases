# Unblock pass — V1R-32, V1R-53, V1R-87 (run 557), 11 November 2026

**What happened:** these three tests were BLOCKED at ~12:17Z because they needed a second user or a third
location. The QA lead then gave standing permission (verbatim, 11 Nov 2026: *"YOU can always change the role
of the user tech@shopview.com"* · *"CRUD the branch the way you want ALWYS"*). This pass set up what each test
needs on the QA site, ran each one through the screen, and recorded the results in run 557.
These results replace the BLOCKED lines for these three cases in `../RESULTS.md` / `../results.json`. Those
files were not edited here, because another worker is writing to the same run today.

Site: QA site sv11315 (`https://sv11315.qa.shopview.com`) · build **v26.45.2-6a8b89c** (read before setup,
before and after every case, and again at the end — unchanged) · org Staging Foothills Group Inc.

## Results (run 557)

| Case | TestRail | Run test | Verdict | Result id | Evidence |
|---|---|---|---|---|---|
| V1R-32 | [C1079005](https://shopview.testrail.io/index.php?/cases/view/1079005) | [T4687249](https://shopview.testrail.io/index.php?/tests/view/4687249) | **Passed** | 616784 | `evidence/C1079005-PIC1…PIC3` |
| V1R-53 | [C1079026](https://shopview.testrail.io/index.php?/cases/view/1079026) | [T4687270](https://shopview.testrail.io/index.php?/tests/view/4687270) | **Passed** | 616785 | `evidence/C1079026-PIC1…PIC2` |
| V1R-87 | [C1095443](https://shopview.testrail.io/index.php?/cases/view/1095443) | [T4693163](https://shopview.testrail.io/index.php?/tests/view/4693163) | **Passed** | 616786 | `evidence/C1095443-PIC1…PIC3` |

What was seen (plain):
- **V1R-32** — tech@shopview.com with Reports page access ON, Customers View OFF: on A/R Aging Summary all 30
  customer names are plain black text; clicking "#1 Diesel" opens nothing and the page stays on A/R Aging Summary.
- **V1R-53** — tech@shopview.com with ONLY Reports page access: on A/P Aging Summary all 30 vendor names are blue
  links; clicking "#1 Diesel" opens "A/P Unpaid Invoices Report" with the Vendor chip "Vendor: #1 Diesel" and
  only that vendor's group.
- **V1R-87** — tech@shopview.com with the Admin role, at Staging Heavy Duty - 9919 (A), enrolled at A and
  Staging Lethbridge - 4310 (B), not enrolled at "ZZAUTOTEST V1R-87 Location C": every bucket opened (524 lines);
  the B invoice S11315-17835 shows the exact PRD S7-R3 prompt; Cancel stays on the report; the C invoice
  **S-17887** is plain text (PRD S7-R1); the A invoice S11315-17834 opens its finance page directly.
  The whole case was re-run, not just step 7.

## Proof standard (Rule 110)

| Case | Attribution | Identity | Provenance |
|---|---|---|---|
| V1R-32 | Control on the same screen and build: the QA lead's Admin user (has Customers View) sees the same "#1 Diesel" as a blue link that opens A/R Aging Collection (PIC3). Tech's live permission set read back as exactly `reportsPageAccess`. | Customer id `e2e804d8-…` — the element read is `text_arsum_party_<that id>`. | v26.45.2-6a8b89c before and after; 13:37Z |
| V1R-53 | Tech's live permission set read back as exactly `reportsPageAccess`, all cross toggles off, so the link is not coming from any other permission. | Vendor id `772a84c3-…`; the chip names the same vendor. | v26.45.2-6a8b89c before and after; 13:39Z |
| V1R-87 | Same user, same permissions: the A and B invoices are links and only the C one is plain, so the difference is the enrolment. A control with the QA lead's Admin user, who IS enrolled at C, shows the same S-17887 as a link (PIC3). | The plain element is `text_ardet_doc_04ae2ac2-…`, which is OUR invoice id; tech's enrolments read back (A and B only) just before the run. | v26.45.2-6a8b89c before and after; 13:41Z |

The V1R-53 note: my first automatic check compared the title to "A/P Unpaid Invoices" exactly and marked it
not met. The page's own title is "A/P Unpaid Invoices Report", the same title V1R-02 (C1078975) step 8 expects
for that page. The case's words "A/P Unpaid Invoices opens narrowed to that vendor" are met. The raw check is
left unchanged in `evidence/raw/V1R-53 qa-tech.json`.

Rule 112: the live TestRail case bodies were compared with `cases/cases.json` before the push (title,
preconditions, every step, every expected line): no differences.

## What was created on the QA site (all kept; no cleanup needed per the QA lead)

| What | Name | Id |
|---|---|---|
| Custom role | ZZAUTOTEST V1R-32 Reports on Customers View off (reportsPageAccess only, cross toggles off) | `0d6c87c1-5ec4-4883-91a6-e1f7c7f5b635` |
| Custom role | ZZAUTOTEST V1R-53 Reports page access only (reportsPageAccess only, cross toggles off) | `b7aa0ea7-fb0a-49ff-9f70-1feb2e6d7b9e` |
| Location | ZZAUTOTEST V1R-87 Location C (Calgary, GST, America/Edmonton) | `19abb244-4c5d-460a-86bb-e515d4eda24d` |
| Customer | ZZAUTOTEST AR V1R-87 Location C | `8117a9eb-4619-444d-8f4e-bb9db7ff331e` |
| Invoice | Work order **S-17887**, $87.00 open, dated 1 Nov 2026, at Location C | invoice `04ae2ac2-5278-4965-8dc0-a68a9b03abc6` |

Side effects to know about:
- Creating Location C **auto-enrolled the QA lead's user (admin@shopview.com)** there. tech@shopview.com was not
  enrolled.
- The QA lead's session was switched to Location C to create the invoice and **switched straight back to Staging
  Heavy Duty - 9919** (both 200, in `oplog.jsonl`).
- The org now has 3 locations; Location C's invoice appears in "All locations" A/R reports (one $87.00 line).
  Totals on A/R reports moved by $87.00 from this time on.
- The pre-existing roles "ZZAUTOTEST AR AP Reports only" and "QA AR Reports Only" (another session's) were read but
  not used or changed.

## tech@shopview.com (Rule 26)

Before (`tech-before.json`): **Technician** (`af8d02b5-ecd1-4205-a82f-32a4d5bb1015`), Administration department
at Staging Heavy Duty - 9919 (default) and Staging Lethbridge - 4310. Roles used in turn: V1R-32 role → V1R-53
role → system **Admin** (checked first: identical to its template, 57/57, so no reset was needed) → **restored to
Technician**. After (`tech-after.json`): role, departments, enrolments, default location and flags are
**identical** to before. Tech was signed in with quick-login in a separate cookie jar (`sv_sso_session` +
`cf_clearance` only). After every quick-login the QA lead's session was re-checked: **200 every time**, and 200
at the end.

## Files

- `oplog.jsonl` — every QA-site write: operation · target · HTTP status · read-back verification.
- `testrail-oplog.jsonl` — the run 557 writes, read back (status, picture count, comment format).
- `RESULTS-run557.json` — the exact input pushed; `push-dryrun.log`, `push-write.log` — tool output.
- `evidence/` — annotated, landscape pictures named from the C-id; `evidence/raw/` — the observation records.
- `tools/` — the scripts used (secrets are read from `/tmp` only; none are in these files).
  The result format and push follow Rule 117.2 with the defect session's `push_results_to_run.py`,
  `tr_client.py` (scratch copy reads the `key` field of the creds file) and `annotate_v2.py`.
