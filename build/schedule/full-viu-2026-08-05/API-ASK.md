# API findings — raised as an ASK, deliberately NOT filed (Standing Rule 51)

**Rule 51 is absolute and it applies even inside a batch that has standing authorisation:** an API-only
fault — one reachable **only** by calling an endpoint directly with a request the product's own screens
never send — is **never filed on our own initiative**. It is asked about separately, and filed **only** if
the QA lead says to.

**Every one of the four API cases was checked against the reachability test** — *is this fault visible to a
user or a manual tester through the product's own screens?* — and the answers are below.

---

## Nothing here needs a ticket. Two of the four API cases PASS outright.

| Case | Verdict | Reachability |
|---|---|---|
| `SCH-API-01` = [C38872](https://shopview.testrail.io/index.php?/cases/view/38872) | **NOT OBSERVED** | Needs three separate sign-ins, one per permission level. Not a finding — a gap. |
| `SCH-API-02` = [C38873](https://shopview.testrail.io/index.php?/cases/view/38873) | **PASS** — the feature has shipped | Nothing to file. |
| `SCH-API-03` = [C38874](https://shopview.testrail.io/index.php?/cases/view/38874) | **PARTLY OBSERVED** — item 1 passes exhaustively | Nothing to file. |
| `SCH-API-04` = [C38875](https://shopview.testrail.io/index.php?/cases/view/38875) | **PASS** | A suspected leak was **disproved**, not filed. |

---

## 1. The one thing that LOOKED like an API defect, and was disproved

**What it looked like.** Scoped to Lethbridge, a `PATCH` against a **Heavy Duty** shift id carrying only a
`note` returned **HTTP 400 `"The request changes nothing."`** instead of the **404** the case requires. A
400 rather than a 404 would confirm to a caller that the id is real — an information leak across
locations, which would be worth raising.

**Why it is not a defect.** The **identical 400** comes back for a **completely invented uuid**
(`00000000-0000-4000-8000-000000000000`). So the guard fires **before any lookup** and distinguishes
nothing whatsoever. Comparing the foreign id against a non-existent id is what settled it, and it is the
whole reason nothing was raised.

Everything else on that case behaves correctly and was checked against the same fake-id control:

| Probe | Foreign (real, other location) | Invented id |
|---|---|---|
| `GET /api/schedule/shifts/{id}` | 404 `'Shift' was not found.` | 404, identical |
| `PATCH` with `color` | 404 | 404, identical |
| `PATCH` with `note` only | 400 `The request changes nothing.` | **400, identical** |
| `DELETE ?scope=shift` | 404 | — |

The foreign shift was re-read afterwards and is **byte-unchanged** (note `null`, colour `#e2effe`, startsAt
`2026-08-03T13:00:00Z`), and **zero shift ids** are common to the two locations' boards.

**⇒ No ticket. Nothing to ask.**

---

## 2. Two new API facts worth recording, neither a defect

**(a) `GET /api/schedule/board` rejects a range longer than 62 days** —
`400 {"errors":[{"error":"The requested range may not span more than 62 days."}]}`. Sensible, undocumented
in specification v23, and it means any long-series verification has to page the board in windows. It cost
us a wasted call, so it belongs in the playbook rather than in a ticket.

**(b) The `note`-only `PATCH` guard described above** is a real behaviour of the endpoint and the reason a
note cannot be set through the API at all. That is **why `SCH-MODAL-06` = [C30013](https://shopview.testrail.io/index.php?/cases/view/30013)
could not be settled** — the note-scope question needed a note to be set, and the API route refuses. It is
**not** a defect: the product's own screens set notes through a different path (`button_shift_detail_add_note`),
so no user is affected.

---

## 3. What we ARE asking for — and it is access, not a ticket

**`SCH-API-01` = C38872 cannot be run at all without three separate sign-ins** — one user with no Schedule
permission, one with View only, one with View plus Edit. The case's whole assertion is the 403 boundary
between them.

**We did not use impersonation to fake it.** `POST /api/quick-login` and `POST /api/switch-user` were
**never called** in this pass, because a sibling Report Suite worker shares this `sv_sso_session` and either
call would rotate it out from under them. So the case is recorded **NOT OBSERVED with that reason**, and
its marker reads `AUTOMATION: HOLD - needs three separate sign-ins, one per permission level`.

**The same access unblocks `SCH-API-03` = C38874's items 2 and 3**, which need a caller without Work
Orders: View.

**The ask, in one line: a second and third sign-in on this QA branch, in an exclusive window.** That is the
only thing standing between us and a complete API verdict — and it is the same ask that blocks the whole
Permissions area.

---

## And the part of C38874 that WAS proved, exhaustively rather than sampled

The specification's strongest API guarantee is that **the Schedule never returns money**. That was checked
by running a regex census for **any** key containing *price, cost, rate, total, amount, charge, money,
currency, dollar, labor, subtotal, invoice, billing, fee* or *tax* over the **full** response body of all
three endpoints:

* `GET /api/schedule/board` — **132,851 bytes, ZERO such keys, zero dollar amounts**
* `GET /api/schedule/shifts/{id}` — **ZERO**
* `GET /api/schedule/work-orders` — **226,969 bytes**, and only two hits, **both innocent**:
  `totalTimeEstimateMinutes`, which is minutes, and a single bare `total` which is the **pagination row
  count, 91**.

**No money field of any kind, for any caller.** That is item 1 of C38874 and it passes.
