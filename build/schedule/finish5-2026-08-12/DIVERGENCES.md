# Schedule finish5 — divergences

**Build `v3.5-65d6500`.** Five cases walked.

**NO SUBSTANTIVE DIVERGENCE (category (b)) WAS FOUND.** Not one of the five sends a tester to a
route or a state the build does not have. **One cosmetic difference (category (a)) was corrected
and is logged below**, and **four candidate absences were ruled out as our own instruments before
anything was reported**.

The category test applied each time: **would a reader of the source recognise what the build
offers as the same thing?** Yes → cosmetic, correct and log. The source describes something the
build simply does not have → substantive, never silently rewritten, raised.

---

## 1 · COSMETIC (a) — C38875 step 2 does not say which field to change

**[C38875](https://shopview.testrail.io/index.php?/cases/view/38875)** — *API - A shift from
another location returns 404, not another shop's data*

**The step as written:**

> 2. Also try PATCH /api/schedule/shifts/{id} on the same id.

**What the build does with that, literally followed:** a PATCH whose body changes nothing is
rejected **HTTP 400 `The request changes nothing.`** — a payload-shape check that fires **before**
the location is looked at. The expected result predicts **404**, so a tester would see a 400,
conclude the case had failed, and raise a defect that does not exist.

**The step as corrected:**

> 2. Also try PATCH /api/schedule/shifts/{id} on the same id, changing a real field such as the
> colour. (A request that would change nothing is rejected on its own account before the location
> is even checked, so always send a real change here.)

**Why this is cosmetic and not substantive:** the route exists, the state is reachable, and the
behaviour is **exactly** what the source describes — with a real field the foreign id returns
**404 `'Shift' was not found.`**, identical to a nonexistent id. A reader of the source would
recognise *"PATCH the shift and get a 404"* as the same thing. Only the instruction was
under-specified.

**Applied** in this pass's single step-text write. **The expected results were NOT touched** — they
were already correct.

---

## 2 · FOUR CANDIDATE ABSENCES RULED OUT AS OUR OWN INSTRUMENTS

**None of these was reported as a defect, and each would have looked entirely credible** — a clean
probe, a clear reading, a case that plainly asks for something the response did not show. **On a
final branch, the day before release.**

| # | What it looked like | What made the reading wrong |
|---|---|---|
| 1 | **A cross-location information leak** — PATCH on a foreign id returned **400**, not the 404 the case predicts, so the id looked distinguishable from a nonexistent one | **A completely random nonexistent UUID returned the identical 400.** The 400 is payload validation before the lookup; with a patchable field both return the same 404 |
| 2 | **`shift.conflicts` was `null` everywhere**, which would have "confirmed" C30615's no-conflict expectation | **That field does not exist on the payload.** The key list gives `isConflict` and `conflictReasons`. The check could not have failed — so it was not a check |
| 3 | **The board endpoint "broke" on a wide range** | It returns a deliberate **400 `The requested range may not span more than 62 days.`** The window must be paged, and the earlier reading was a malformed request, not a fault |
| 4 | **`end_date` appeared to be ignored** by the spread — a series request with one came back as a single shift | `end_date` is **not a parameter** of that endpoint; the day count is derived from `total_minutes`. Our payload was wrong, not the build |

**The discipline that caught all four is the same one**: state what makes the current state one in
which the thing should appear — the right field name, the right payload, a valid range, a control
that a nonexistent id would fail too — **before calling anything missing**.

---

## 3 · OBSERVED IN PASSING, REPORTED AND NOT ACTED ON

**The `acknowledgeLongSeries` parameter is camelCase where every other field on that same payload
is snake_case** (`total_minutes`, `start_date`, `spread_mode`, `staff_id`, `line_ids`). The
server's own 409 message names it in camelCase and it works in that form. This is an **engineering
consistency note, not a defect**, and it touches no test case — recorded so the next pass does not
lose ten minutes to it.

**Nothing was filed.** Jira ticket creation remains on hold (Standing Rule 62); this pass made
**zero Jira calls of any kind**.
