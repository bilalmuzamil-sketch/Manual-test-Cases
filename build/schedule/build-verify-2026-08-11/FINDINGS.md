# Findings — Schedule build verification, 2026-08-11

**Written up, not filed. The ticket-creation hold stands (Standing Rule 62 + the 2026-08-10 hold:
*"Do not create anything until my next order."*). No Jira call of any kind was made this pass.**

---

## 1 · BEHAVIOUR DEVIATIONS FOUND THIS PASS: **NONE**

**Not "none found" in the sense of a clean bill — none was *findable*.** A behaviour deviation is an
observation, and **the application was never reached**. Zero screens were opened, zero controls
driven, zero drags attempted.

**Nothing was inferred from the documents and written up as though it had been seen** (Rule 12).

---

## 2 · Findings that ARE genuine, all document-side

### F1 · The specification still says left-click AND right-click for the same menu

| | |
|---|---|
| **What it says** | **§4.10**: *"Create via **left-click** on empty grid space, which opens a menu with 'Create event' and 'New work order'."* · **§7**: *"**Left-click** on empty grid space opens a menu with: Create event, New work order."* · **§14.1**: *"…shift and event creation (including via **right-click** context menu and day-view click-to-create)…"* |
| **Why it matters** | Our cases assert **left-click** (C30016 step 1: *"**Left-click** an empty spot in a technician's cell"*). If the build implements right-click, the tester fails a case whose expectation is drawn from a document that **also** supports the build. |
| **Status** | **Pre-existing, unchanged in v27, already known.** Reported not resolved — it is Branko's to settle (Rules 55/57). |

### F2 · Our own suite spells one control two ways

`Filter & Display` (C30042) against `Filter and Display` (five sibling cases), and `VIN` (C30042)
against `VIN Number` (C30034, C30045). **At most one of each pair can be right**, so at least one
case sends the tester after a control that does not exist under that name. Both texts quoted side by
side in `CLASSIFICATION.md` §1. **Needs a live read to settle (class A).**

### F3 · Seven cases assert a capitalisation the specification does not use

`Create Event` and `New Work Order` in the **Expected Results** of C30016, C30017, C30054, C30075 and
C38855, against the spec's **`Create event`** / **`New work order`** in §4.10 and §7. **Class B — the
document governs.** Left unchanged, following the Report Suite C30452 precedent. Full table in
`CLASSIFICATION.md` §2.

### F4 · A PRD-vs-design divergence on the VIN toggle's name

Spec v27 §9 names the toggle **`VIN`**; CLAUDE.md records the **design** pinning **`VIN Number`**
(VIEW-04, 2026-07-22 reconciliation). Since 2026-08-06 **both are authoritative sources** (Rule 57 as
amended), so **this is a documents-disagree finding, which Rule 57 says is RAISED to the PO rather
than silently resolved.** Dating which is newer needs §9's own text diffed across spec versions
(Rule 31 trap (c)) — **not attempted, and not guessed.**

---

## 3 · Two claims in the brief, corrected on the evidence

**(a) "Build-verification has never been done on any of them."** True of **168**, not of **6**.
C43582–C43587 each carry `Last checked against build v3.5-af3a6e1 on 8/11/2026` and describe a real
observation made at authoring. **But `v3.5-af3a6e1` is no longer the running build**, so that
observation is now superseded — the correction does not make them current.

**(b) The expected build marker.** The brief recorded `v3.5-af3a6e1`; the branch is on
**`v3.5-65d6500`**, last-modified **Tue 11 Aug 2026 09:33:33 GMT**. The brief's own warning not to
assume was correct.

---

## 4 · What could NOT be checked, itemised so the gap is visible

| Check the brief asked for | Status |
|---|---|
| Every on-screen label — exact wording and capitalisation | **BLOCKED** — check-list built (85 strings, 195 mentions, 82 cases), nothing compared |
| The navigation path for each case | **BLOCKED** — not one route driven |
| Named test data exists and is findable | **BLOCKED** — 6 data names identified, none confirmed to exist |
| Step executability, drag-heavy cases in particular | **BLOCKED** |
| Whether **click-to-arm is back** (it blocked 7 cases when removed) | **BLOCKED — and this is the highest-value single check.** 7 cases sit on `HOLD - not re-checked against the current build - it needs a drag that could not be completed`; if click-to-arm has returned, all 7 become drivable |
| Panel collapse control still absent (C43582–C43587) | **BLOCKED** — re-confirmation owed |
| Raw markup census | **DONE — 0 of 174** (TestRail-side, no build needed) |

---

## 5 · Nothing to restore

**Nothing was seeded, created, deleted or modified anywhere.** No work order, shift, event, role or
setting was touched — the application was never reached. The only state that existed was a throwaway
headless browser's own `localStorage`, and its process has exited.

**One thing deliberately NOT done:** the app bounced to `/administration/locations` ("Create a
workplace to access the rest of the app") because `admin@shopview.com` genuinely has
`default_workplace: null`. **A default workplace was NOT faked into the seed.** The Report Suite pass
recorded exactly why (`build-verify-2026-08-10/RESUME.md`): seeding one **turns on behaviour the real
account does not get**, and it produced a false "fixed" reading there. The correct route is the app's
own `POST /api/iam/change-location` — attempted, and it returned 401 because the session had already
died.
