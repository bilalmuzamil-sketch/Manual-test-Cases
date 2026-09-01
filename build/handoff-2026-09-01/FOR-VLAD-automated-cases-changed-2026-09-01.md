# FOR VLAD — Automated cases changed on 2026-09-01 (Standing Rule 65)

Rule 65: when we change a case TestRail's own **Automated** flag is on (`custom_atmstatus = 3`), Vlad
has to be told so he can adjust his automation. This is that notice for today's build-verification
write pass on suite **6597 Inline Add and Edit Parts**.

**Authorisation:** the QA lead's go-ahead of 2026-09-01, verbatim: *"1. Permitted"*, in answer to the
ask about rewriting the two cases that are both ours and Automated. `custom_atmstatus` was re-read
immediately before each write and is **still 3** on both afterwards — the flag was never touched.

| Case | Title | What changed | Automated flag | Link |
|---|---|---|---|---|
| **C45005** | Tech View add row — Save behaviour (IAEP-TADD-08, S2-R9) | Preconditions and Steps rewritten from the PROVISIONAL spec-drafted route to the route actually walked on `sv9315` (the Settings → Roles & Permissions click path, the real control labels, the Parts section within a work order line). Expected Results: the documented expectation is unchanged (Rule 57); the Rule-54 build sentence *"Last checked against build v26.35.6-598cc8a on 9/1/2026."* was added, and the marker is `AUTOMATION: READY` | **3, before and after** | https://shopview.testrail.io/index.php?/cases/view/45005 |
| **C45026** | Tech View edit row — discard guard (IAEP-TEDIT-04, S3-R5) | as above | **3, before and after** | https://shopview.testrail.io/index.php?/cases/view/45026 |

**What did NOT change on either:** the assertion, the section, the references, the case type, and the
Automated flag. Only the route wording, and the build sentence that records what it was checked
against.

**What was deliberately NOT touched, and why it matters to you:**

| Case | Why we left it alone |
|---|---|
| **C45123** (6617 Printer Friendly, *Printing logs a Work Order Printed event in audit history*) | Automated, and no per-case go-ahead has been given. Its behaviour is verified **PASS**; the only shortfall is that its steps do not name where on the screen to look, so it is the one case in that suite that fails our runnability gate. Register row **HO-1** |
| **C45220** (6597, *Adding a part to a completed line*) | Vladimir Tomovic's own case, and Automated. The QA lead's instruction of 2026-09-01: his cases are never changed. It has **no steps at all**, so it goes to the tester empty. Register row **HO-2** |

**Evidence:** `build/inline-add-edit-parts/build-verify-2026-09-01/write-2026-09-01/APPLIED.jsonl`
(per-case: operation, C-id, HTTP status, and the post-write verification result — Rule 50), and the
served-page container scan `build/handoff-2026-09-01/evidence/served-page-scan-161.json`.

**Earlier notice, still valid for its own date:**
`build/inline-add-edit-parts/render-repair-2026-08-31/FOR-VLAD-automated-cases-changed-2026-08-31.md`
covers the 2026-08-31 render repair of C45026. Today's pass is a second, separate change to the same
two cases.
