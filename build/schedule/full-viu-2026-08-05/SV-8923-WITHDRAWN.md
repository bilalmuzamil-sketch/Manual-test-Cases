# SV-8923 — VERIFIED FALSE, THEN WITHDRAWN (2026-08-06)

**Status: DONE.** [SV-8923](https://shopview.atlassian.net/browse/SV-8923) is now **OBSOLETE /
resolution Done**, with a plain-language comment explaining why. It was **not deleted** — the
reasoning is worth more on the record than the ticket is worth gone (and our account gets HTTP 403
on delete in any case).

This supersedes `SV-8923-SHOULD-BE-WITHDRAWN.md`, which recommended it but did not action it.

---

## We disproved it ourselves first — we did not withdraw on someone else's say-so

Build at the time of the check: **`v3.5-7ec992f`**, last-modified Wed 05 Aug 2026 22:49:36 GMT,
etag `e2a80a6ab5e0b47c29fd88af9db1e980`, `index.html` sha256 `66e91c52…dbbc53`, read **06:03:34Z**.

### Step 1 — the precondition the original observation missed is now satisfied

C30047 precondition 2 reads *"The shop has working hours set."* Read live off the Edit Location
dialog for **Staging Heavy Duty - 9919**:

* toggle *"Set business hours for this shop"* → `aria-checked = true`
* Monday–Friday all read **06:00 → 18:00**; Saturday and Sunday have no row.

Evidence `evidence/task0/t0a.json`.

### Step 2 — the switch shades, and it shades the right hours

Day view, Thursday 6 August 2026, toggled three times:

| Business Hours toggle | Elements carrying `fc-non-business` |
|---|---|
| **OFF** (the case's starting state) | **0** |
| **ON** | **40** |
| **OFF again** | **0** |

The 40 elements are really rendered — `background rgb(248, 250, 252)`, `display block`,
`opacity 1` — and they collapse into exactly **two bands**: `x=524 w=289` and `x=1390 w=289`.

**They are the correct bands, and this is decisive rather than approximate.** The time-axis slot
labels were read with their own coordinates in the same pass:

| Slot label | `data-date` | x |
|---|---|---|
| 12 AM | `2026-08-06T00:00:00` | **524** |
| 6 AM | `2026-08-06T06:00:00` | **813** |
| 6 PM | `2026-08-06T18:00:00` | **1390** |

So band 1 runs **524 → 813 = midnight to 6 AM**, and band 2 begins at **1390 = exactly the 6 PM
mark**, the shop's closing time, and runs 289px to the end of the day. The working day 06:00–18:00
(x 813 → 1390) is left **unshaded**.

That satisfies all three of C30047's expected results:

1. hours outside the working day are shaded — yes, both of them;
2. working hours remain unshaded — yes, the whole 6 AM–6 PM span;
3. turning it off removes the shading — yes, twice.

Evidence `evidence/task0/t0b.json`, `t0c.json`, screenshots `t0b-on.png` / `t0b-off.png`.

**⇒ C30047 = PASS. SV-8923 describes a fault that does not exist.**

---

## The withdrawal

* Comment posted — comment id **74586**, 2026-08-06T01:07:50-0500. It says in plain words that the
  ticket was raised against a shop with no business hours configured, that with hours set the
  behaviour is correct, that the source test case now passes, and that it is being closed rather
  than deleted.
* Transition **id 24 "Close"** → HTTP **204**.
* **Read back, every field:** status **OBSOLETE** · resolution **Done** · priority **Low** ·
  parent **SV-8700** · type **Story Defect** · comments **1**.

---

## The lesson, which is the part worth keeping

**A precondition that is not satisfied does not produce a defect — it produces a test that could not
be run.** *"The shop has working hours set"* was written at the top of C30047 and was false when the
observation was taken. Nobody put the two facts side by side, and a developer would have gone
looking for a fault in shading code that was working correctly.

**Before filing anything, confirm every precondition the source case states is actually met.** That
check is now part of Step 5 of this pass.
