# P0 — THE EVIDENCE GATE (not callable; every process reports against it)

> **A result is not evidence until it is ATTRIBUTED, IDENTIFIED and DATED.**
>
> Ratified after three failures in one week, all the same error: *a search returned something and
> that was treated as proof.* This is the floor under every other process. Standing Rule 110.

---

## The three legs — all three, or the claim is UNPROVEN

### (a) ATTRIBUTION — did the match come from the field I am testing?
Blank the field and search again. Still found? Then the match came from somewhere else.

> SV-10110 was withdrawn because a vendor's **website** appeared to match — it matched via its
> **email**, which contains the same string, and V1's vendor query has no website column at all.

In practice: read `match.field` off the response, do not infer it from the fact that a row appeared.

### (b) IDENTITY — is OUR record in the list?
Not "were there results". **A count is not a verdict** — a count of 1 produced a false PASS on a
real regression. Check the record's id, or something only that record can answer.

> On production, assigning a technician looked like a failure: the work order WAS indexed, but the
> surname was shared by 62 other work orders and the group caps at 20 rows, so ours never showed.
> The count was healthy. The identity was absent.

### (c) PROVENANCE — which build, and how long after the write?
Record the build marker. A branch redeploys unannounced.

> A QA branch went `v26.36.4` → `v26.36.7` overnight and four behaviours changed with it. Reading
> that as "the index is slow" withdrew **four TRUE findings**, which then had to be restored.

```bash
curl -s https://<host>/ | grep -o 'app-version" content="[^"]*"'
```

---

## Four more that follow from the same discipline

**Prove a "not found" with a control.** Search a *different* field of the same record. If the
control answers and the target does not, the search is alive and the absence is real. If the control
is silent too, the SEARCH is the suspect, not the record.

**Wait before you condemn.** On production two inventory parts were created seconds apart; one was
searchable instantly, the other took ~20 minutes, with the first answering as a control the whole
time. "Created but genuinely not returned" was wrong. Re-ask, then decide.

**Separate a PRODUCT finding from a DATA gap.** If the data is provably correct and the build still
answers wrongly, that is a **result the suite exists to produce** — report it, do not fail your own
run over it and do not reseed hoping it changes. If the signal underneath is wrong, that is yours
to fix.

**Search Jira before reporting any loss.** On Global Search, all six "new" findings already had a
ticket.

---

## Before you ship a finding

> **Try to break your own finding.** The answer is usually one grep away in our own repository.

Ask: could this appear without the cause I am claiming? Would it reproduce on a second run? Is the
thing I am calling "missing" actually hidden behind a cap, a permission, a workplace scope, or a
twenty-minute index?

**Tool:** `build/global-search/field-attribution-audit-2026-09-16/attribution_check.py`
**Facts:** `build/APP-ACTIONS-PLAYBOOK.md` §O · **Rule:** 110 (with Rule 12 above it)
