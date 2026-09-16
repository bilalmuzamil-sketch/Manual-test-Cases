# The branch moved three builds overnight, and four things got fixed

**16 September 2026.** The QA branch went from **`v26.36.4-7869ff2`** to **`v26.36.7-893d13a`**, and
its data was wiped (which is why `RESEED QA` found 0 of 11 records).

> ## 🔴 I GOT THIS WRONG TWICE. THIS FILE IS THE CORRECTED RECORD.
>
> **First** I reported six behaviours as lost, on the old build. **That was right.**
>
> **Then**, when four of them started working, I withdrew them and blamed the search index for being
> slow to catch up. **That was wrong, and it was the worse mistake** — it withdrew four true findings.
>
> **What actually happened: the build changed.** Four of the six were genuinely broken on
> `v26.36.4`, already had tickets, and were **fixed in `v26.36.7`**. The tickets were moved to
> QA Complete this morning, between 05:57 and 06:21, after the deploy.
>
> The lesson is not "wait for the index". It is **check the build marker before explaining a change
> in behaviour** — a QA branch is redeployed without announcement, and the data being wiped was the
> clue that something bigger than an index had moved.

---

## 1 · Where each of the six stands now

Measured on `v26.36.7-893d13a`, by the identity of the record returned.

| Behaviour | On `v26.36.4` | On `v26.36.7` | Ticket | Ticket state |
|---|---|---|---|---|
| Customer by postcode | 🔴 broken | ✅ **fixed** | [SV-10002](https://shopview.atlassian.net/browse/SV-10002) | QA Complete |
| Vendor by postcode | 🔴 broken | ✅ **fixed** | [SV-10005](https://shopview.atlassian.net/browse/SV-10005) | QA Complete |
| Vendor by state | 🔴 broken | ✅ **fixed** | [SV-10006](https://shopview.atlassian.net/browse/SV-10006) | QA Complete |
| Customer by website | 🔴 broken | ✅ **fixed** | [SV-10003](https://shopview.atlassian.net/browse/SV-10003) | 🔶 **still Open — can be closed** |
| Vendor by website | 🔴 broken | 🔴 **still broken** | [SV-10110](https://shopview.atlassian.net/browse/SV-10110) | Open |
| Catalogue part never stocked | 🔴 broken | 🔴 **still broken** | [SV-10001](https://shopview.atlassian.net/browse/SV-10001) | Open |

**Nothing needs filing. Every one already has a ticket.**

## 2 · Two tickets are ready to move

| Ticket | Why |
|---|---|
| **[SV-10003](https://shopview.atlassian.net/browse/SV-10003)** — a customer cannot be found by their website | It **can** now, on `v26.36.7`. Verified today by typing `bridgeporthauling-zzt.com` and getting ZZAUTOTEST Bridgeport Hauling back. The ticket is still Open. |
| **[SV-10058](https://shopview.atlassian.net/browse/SV-10058)** — a vehicle cannot be found by part of its VIN | It **can** now. Typing `ZZ4471` returns the 2019 Freightliner Cascadia. Already moved to QA Complete this morning, so this is confirmation rather than news. |

## 3 · One that looks alarming and is not

**[SV-10008](https://shopview.atlassian.net/browse/SV-10008)** — *"jobs can no longer be found by typing
the stage they are at"* — is marked **Done**, and typing `estimate` still returns no work orders.

That is **not** a regression. Specification v1.5 §4 says status is deliberately not matchable:
*"Some fields — notably status — are stored on the search document for ranking and for the row badge,
but are deliberately not matchable: typing a status name does not return records carrying that
status."* So the ticket was closed as intended behaviour, not as a fix. **No action.**

---

## 4 · 🔴 Every result in run 415 is now against the old build

All 67 recorded results were set against `v26.36.4-7869ff2`. The build has moved three patches and at
least four behaviours changed with it, so **those results no longer describe this build**. The cases
that were Failed for the four fixed behaviours would now pass.

Run 415: https://shopview.testrail.io/index.php?/runs/view/415

This is not a criticism of whoever recorded them — they were right on the day. It is simply what a
redeploy does, and it is why the build marker belongs on every result.

---

## OUTSTANDING — what I need from you

| # | What I need |
|---|---|
| **1** | **Nothing to file.** Both remaining losses already have tickets — SV-10110 (vendor website) and SV-10001 (catalogue-only part) — so there is no defect handoff to give anyone, which is what you asked me to check for. |
| **2** | **SV-10003 can be closed** — the customer website works on this build. Your call whether to close it or have it verified first. |
| **3** | **Run 415's results are stale against the new build.** Worth a re-run of at least the cases tied to SV-10002, SV-10003, SV-10005, SV-10006 and SV-10058, which should now pass. |
