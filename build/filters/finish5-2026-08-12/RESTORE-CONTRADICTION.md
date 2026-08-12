# THE FILTER-RESTORE CONTRADICTION — SETTLED

**Question put to this pass:** finish3 recorded that a saved filter **is** restored when the page
loads; finish4 recorded that it **is not** — on the same build. One measurement had to be wrong.

**Answer: finish3 was right. Restore works. finish4's negative was an artefact of the address its
own probe landed on.**

**Build:** `v3.7-20e801b` — `index.html` last-modified Wed 12 Aug 2026 12:09:14 GMT, etag
`82eedf656263a3228c8865356eed8379`, sha256 `157756e3…`, read by this worker at **17:49:08Z**.
**Location:** Staging Heavy Duty - 9919. **Identity:** `admin@shopview.com` (42 permissions,
`view_mode: full`).
**Evidence:** `evidence/probeR1.json` (the settling run) · `evidence/probeR2.json` (the two cases
re-driven on the strength of it) · tools `probeR1.cjs`, `probeR2.cjs`.

---

## 1 · WHY THIS WAS NOT SETTLED BY REPEATING EITHER RUN

Both prior runs were internally consistent. Repeating one of them would only have reproduced its own
answer. The re-test was therefore designed around **the one variable they differed on**, with two
guards that neither prior run had:

| Design decision | Why |
|---|---|
| The baseline was cleaned **through the interface** (`Clear Filters`), never by an API write | finish3 had already proved that a junk preference value silently disables saving altogether, and **finish4 ran with `{"status":["declined"]}` left behind by its own probe**. A diagnostic write is exactly what makes this symptom appear. |
| The filter was set **only through the chip** | Same reason. The brief required it and it is the right requirement. |
| **A CONTROL ran first** — reload in the SAME profile, where restore is known to work | If the control does not restore, the detector is broken and **no absence may be reported**. |
| The **landing URL** was tested as an explicit variable: bare `/workorders` versus `/workorders?tab=all` | This is the only thing the two prior runs did differently. |

---

## 2 · WHAT WAS MEASURED

**Setup, in one profile:**

1. Arrived at `/workorders`; the preference already held `{"status":["declined"]}` — **finish4's
   leftover**, which is itself part of the story.
2. `Clear Filters` clicked through the interface → preference `filters: []`, **baseline proven
   clean** (`baselineClean: true`).
3. `Status : Declined` set through the chip → the app issued **its own `PUT` → 200** and the
   preference read back `{"status":["declined"]}`.
4. **CONTROL — reload in the same profile, bare `/workorders`:** chips came back
   `Status : Declined`. **The detector fires.**

**Then two genuinely separate browser processes, one per landing address:**

| Landing address | Chips after load (4 samples + a further reload) | Status value shown? | Rows |
|---|---|---|---|
| **`/workorders`** (bare — the nav link) | `Status : Declined`, Customer, Lead Technician, Service Advisor, Asset on Site | **YES, at every sample and after a further reload** | URL rewritten by the app to `?status=declined&tab=all` |
| **`/workorders?tab=all`** | `Status`, Customer, Lead Technician, Service Advisor, Asset on Site | **NO, at every sample and after a further reload** | address left exactly as given |

In **both** arms the app fetched the preference itself (`GET /api/users/me/preferences/work-orders-list`
→ 200) and issued **no** `PUT`. The stored value stayed `{"status":["declined"]}` throughout. Zero
bridge errors.

---

## 3 · THE VERDICT

**An explicit `?tab=all` in the address is state the user has asked for, and the build lets it win
over the saved preference. A bare `/workorders` — which is what "restored when the page loads"
actually means, and what the nav link produces — restores the saved filters.**

**finish4 landed on `/workorders?tab=all` and therefore measured the wrong thing.** Its observation
was accurate; its conclusion did not follow. The report it produced said the app "saves the filter
(its own `PUT` → 200) and a fresh profile fetches it back (`GET` → 200), yet the chip shows no
value" — every clause of that is true, and the missing clause is *"…on an address that carries its
own state"*.

**There is no defect here, and the one that was nearly reported would have been filed against
`S10-R1`/`S10-R2` on the evening before a release.**

---

## 4 · THE TWO CASES IT WAS BLOCKING — BOTH NOW RUN, END TO END

Re-driven with a bare `/workorders` landing throughout, which is the route the case text describes
and the route a tester takes (`evidence/probeR2.json`).

### C29614 — [FLT-PERS-02](https://shopview.testrail.io/index.php?/cases/view/29614) · all six steps

| Step | What happened |
|---|---|
| 1 · visit other areas briefly | Customers, Parts/Inventory, Reports/Sales — all reached |
| 2 · return to Work Orders | chips `Status : Declined, +1` · `Customer : Iibay Landscaping` · 2 rows |
| 3 · close the browser completely | preference at close: `status: [declined, approved]`, `company_id: [Iibay Landscaping]` |
| 4–5 · open again, sign in, go to Work Orders | **both filters back** — `statusKept: true`, `customerKept: true`, 2 rows |
| 6 · a **different browser profile**, same person | **both filters back**, 2 rows, separate browser process, 0 bridge errors |

**Step 6 was the step finish4 could not close.** It closes.

### C43560 — [FLT-PERS-05](https://shopview.testrail.io/index.php?/cases/view/43560) · all six steps

Two separate browser processes, last-write-wins:

| Step | What happened |
|---|---|
| 1 · Browser A sets Status **Approved** | `?status=approved`, the app's own `PUT` fired |
| 2 · Browser B **reloads first**, then unticks Approved and ticks Estimate | B saw `Status : Approved` on load, then `Status` (empty), then `Status : Estimate` |
| 3–4 · Browser A reloads | shows **Estimate**, not Approved — 33 rows |
| 5 · Browser A adds Customer *Iibay Landscaping* | `?status=estimate&company_id=…` |
| 6 · Browser B reloads | shows **both** — Estimate and the customer — 2 rows |

**finish4's own step-2 implementation was wrong** (Browser B was never reloaded, so "clear Approved"
*added* it). That is fixed here and recorded as ours.

**Both cases were re-stamped to `v3.7-20e801b` — the only two TestRail writes this pass made.**

---

## 5 · WHAT THIS SAYS ABOUT OUR OWN METHOD, RATHER THAN THE BUILD

Three things are worth carrying forward, and all three are about us:

1. **A probe's leftover state is a confound.** finish4 ran against a preference its own earlier probe
   had written. The fix is not care — it is **cleaning the baseline through the interface and
   asserting it is clean before measuring**.
2. **A control is not a formality.** The control here took one page load and it is the only reason
   this run may state a positive at all. Had the control failed, the honest output would have been
   *"not established"*.
3. **The variable that decided it was in the address bar, not the app.** Neither prior run recorded
   the URL it landed on as a *choice*. It was a choice, and it was the whole answer.

**Standing Rule 68 in one line: the blocker was real about one address and false about the other,
and nobody had tested which.**
