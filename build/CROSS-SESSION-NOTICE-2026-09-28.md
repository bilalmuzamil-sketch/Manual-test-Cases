# ⚠️ To the other session working this TestRail today (28 September 2026)

Two collisions happened this afternoon. Neither is a complaint — we cannot see each other, and the
repo is the only channel we have. Both need you to know before you next write.

## 1 · C44591 — please keep the QA lead's ruling of 28 September

**What happened.** This session corrected C44591 at about 16:20 UTC on the QA lead's explicit,
named instruction that day: *"C44591 -> Invoice number is not reusable it is unique. --> Edit and
correct the test case … from title to sources end to end"*. At **16:49 UTC** the case was rewritten
again — a good build-grounded restructure citing a **newer spec revision (11 Sep)** than the one this
session had — but it **dropped two points**: the invoice-number rule the QA lead had just ruled on,
and the View-only permission point.

**What was done.** Your structure, your three Story 14 quotes and your newer source line were all
kept. The two missing points were put back, with a divergence note explaining that the ruling
overrides the specification sentence. Nothing of yours was discarded.

**The ruling, so it is not lost again:** a supplier invoice number is **unique and not reusable**.
The specification (Confluence 771391574) still says the opposite — *"The same invoice number may be
reused across several of a vendor's purchase orders"* — and **that sentence needs correcting at
source**. Measured on production build v26.39.1-3ef6ade: the second order is refused with
*"Invoice '…' is already in use"*. The case is **Passed** in run 416 on that basis.

**Marker:** set to `AUTOMATION: READY`, not HOLD. The case has actually been run, and its result is
recorded in run 416, so a HOLD would contradict the run. Your HOLD reason also named the `sv8683` QA
build, which no longer exists — Simple Flow now runs on **production**.

## 2 · Run 415 lost eight tests this afternoon

Run 415 (Global Search) held **202 tests** at about 16:15 UTC and **194** by 16:43. The eight tests
missing are the whole of section **6774 Quick Actions on Hover (v1)** — C44866 through C44873. The
**cases still exist**; only their tests and results are gone from the run.

This session made no write of any kind to run 415 before that point. If it was an `update_run` with
a partial `case_ids` list, that is Rule 34's exact warning: the omitted tests **and their results**
are deleted unrecoverably. Please use a union of existing ∪ new, never a partial list.

It matters because those eight checks have just been found to fail: **quick actions on hover are
entirely absent from the search results on staging**, against PRD §5.4, proved with a positive
control. The evidence is in
`build/global-search/staging-run-2026-09-28/FINDING-quick-actions-absent.md`. Re-adding them to the
run was left for the QA lead rather than done unattended.

## 3 · Two environment facts worth having

- **The Global Search QA branch `sv9160` is gone** — merged into staging and deleted. Global Search
  runs on **app.staging.shopview.com** now. Staging needs **all three** cookies
  (`sv_sso_session`, `PHPSESSID`, `cf_clearance`) on both hosts — the opposite of a QA branch. Boot
  helper: `build/testing-tools/staging-cookie-boot.mjs`. Full recipe and four measurement traps are
  in the playbook.
- **Simple Flow V2 runs on production** (`app.shopview.com`), build v26.39.1-3ef6ade, and seven of
  its cases were deleted today on the QA lead's instruction — snapshot and reasons in
  `build/simple-flow-v2/deleted-2026-09-28/`.
